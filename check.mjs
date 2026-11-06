// Kontrolní skript: node check.mjs  (spouštět po buildu)
// Ověřuje SEO základy, odkazy, obrázky, JSON-LD, přístupnost formulářů a zakázané (fakticky chybné) formulace.
import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site, company, person, petr, contact } from './src/config.mjs';
const plannedPaths = [];

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const errors = [];
const warnings = [];
const planned = new Map(); // path -> počet odkazů
const err = (p, m) => errors.push(`${p}: ${m}`);
const warn = (p, m) => warnings.push(`${p}: ${m}`);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const urlOf = (f) => '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');

const decode = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return m ? decode(m[1]) : null;
};

const pages = {};
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
  pages[urlOf(f)] = { file: f, html, ids: new Set(ids), idList: ids };
}

const seen = { title: new Map(), desc: new Map(), h1: new Map(), canonical: new Map() };
const addSeen = (k, v, p) => seen[k].set(v, [...(seen[k].get(v) || []), p]);
const FORBIDDEN = [
  [/aggregateRating/i, 'falešné hodnocení (aggregateRating)'],
  [/Sb\.\s*\./, 'překlep „Sb..“ (dvojitá tečka)'],
  [/vždy osobně/i, 'nepravdivý slib „vždy osobně“'],
  [/nejlevnější/i, 'srovnávací tvrzení „nejlevnější“'],
  [/100\s*%\s*(garanc|spokojen)/i, 'přehnaný slib'],
  [/\b\d+\s*(let|roků)\s+(na trhu|zkušeností|praxe v oboru|tradice)/i, 'roky působení (neověřeno)'],
  [/\b\d+\+?\s*(spokojených )?(klientů|zákazníků)\b/i, 'počty klientů (nevymýšlet)'],
  [/(hodnocení|recenz)[^.]{0,30}★/i, 'recenze/hodnocení (žádné nezveřejňujeme)'],
  [/energetick\p{L}* specialist\p{L}* s oprávněním MPO/iu, 'obecné „specialisté s oprávněním MPO“ (smí jen kontrola vytápění s čísly)'],
  [/Michn\p{L}*[^.]{0,120}oprávněn|oprávněn\p{L}*[^.]{0,80}Michn/iu, 'oprávnění ve spojení s Ing. Petrem Michnou (oprávnění zatím nemá)'],
  [/ve zkratce: zdarma|zdarma/i, 'slovo „zdarma“'],
];
// Stránky, kde se nesmí zmiňovat oprávnění MPO (služby bez ověřeného oprávnění)
const NO_AUTH_PAGES = /^\/(penb|energeticky-audit|energeticky-posudek|kontrola-klimatizace|energeticke-poradenstvi)\//;
const NO_AUTH_RE = /s oprávněním|držitel\p{L}* oprávnění|oprávnění MPO|oprávnění č\./iu;
// Čísla oprávnění: jen 2202 a 2238 a jen na těchto stránkách
const AUTH_OK = new Set([person.mpoNumbers[0], company.mpoNumber]);
const AUTH_PAGES = new Set(['/kontrola-vytapeni/', '/tym/', '/pro-zadavatele/']);
const AUTH_NUM_RE = /oprávněn\p{L}*[^.]{0,40}?(?:č\.|číslo)\s*(\d{3,6})/giu;

let wordsPillar = 0;
const perf = [];
const words = {};
for (const [p, pg] of Object.entries(pages)) {
  const { html } = pg;
  const isIndexable = !/<meta name="robots" content="noindex/.test(html);

  // title / description / canonical
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  if (!title) err(p, 'chybí <title>');
  else {
    const t = decode(title);
    if (t.length > 60) err(p, `title má ${t.length} znaků (> 60): ${t}`);
    addSeen('title', t, p);
  }
  const desc = attr((html.match(/<meta name="description"[^>]*>/) || [''])[0], 'content');
  if (!desc) err(p, 'chybí meta description');
  else {
    if (desc.length > 155) err(p, `description má ${desc.length} znaků (> 155)`);
    if (desc.length < 70) warn(p, `description je krátká (${desc.length} zn.)`);
    addSeen('desc', desc, p);
  }
  const canonical = attr((html.match(/<link rel="canonical"[^>]*>/) || [''])[0], 'href');
  if (p === '/404.html') { if (isIndexable) err(p, '404 musí mít noindex'); }
  else if (!canonical) err(p, 'chybí canonical');
  else {
    if (canonical !== site.url + p) err(p, `canonical ${canonical} ≠ ${site.url + p}`);
    addSeen('canonical', canonical, p);
  }
  for (const m of ['og:title', 'og:description', 'og:image', 'og:url']) {
    const tag = (html.match(new RegExp(`<meta property="${m}"[^>]*>`)) || [''])[0];
    const v = attr(tag, 'content');
    if (!v) err(p, `chybí ${m}`);
    else if ((m === 'og:image' || m === 'og:url') && !v.startsWith('https://')) err(p, `${m} není absolutní URL`);
  }
  if (!/name="twitter:card"/.test(html)) err(p, 'chybí twitter:card');
  if (p === '/dekujeme/' && isIndexable) err(p, 'děkovná stránka musí mít noindex');

  // H1 a hierarchie nadpisů
  const main = (html.match(/<main[\s\S]*<\/main>/) || [html])[0];
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1]));
  if (h1s.length !== 1) err(p, `počet H1 = ${h1s.length}`);
  else addSeen('h1', h1s[0], p);
  const levels = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) if (levels[i] > levels[i - 1] + 1) { warn(p, `přeskočená úroveň nadpisu h${levels[i - 1]} → h${levels[i]}`); break; }
  if (p !== '/' && p !== '/404.html' && !/aria-label="Drobečková navigace"/.test(html)) err(p, 'chybí drobečková navigace');

  // duplicitní id
  const dupIds = pg.idList.filter((id, i, a) => a.indexOf(id) !== i);
  if (dupIds.length) err(p, `duplicitní id: ${[...new Set(dupIds)].join(', ')}`);

  // odkazy
  const hrefs = [...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => decode(m[1]));
  for (const h of hrefs) {
    if (/^(https?:|mailto:|tel:)/.test(h)) {
      if (h.startsWith(site.url)) warn(p, `absolutní interní odkaz ${h}`);
      continue;
    }
    if (h.startsWith('#')) {
      if (h.length > 1 && !pg.ids.has(h.slice(1))) err(p, `kotva ${h} neexistuje`);
      continue;
    }
    if (!h.startsWith('/')) { warn(p, `relativní odkaz ${h}`); continue; }
    const [pathPart, hash] = h.split('#');
    const target = pathPart.split('?')[0];
    if (!target.endsWith('/') && !path.extname(target)) err(p, `odkaz bez lomítka na konci: ${h}`);
    if (pages[target]) {
      if (hash && !pages[target].ids.has(hash)) err(p, `kotva ${h} na cílové stránce neexistuje`);
    } else if (fs.existsSync(path.join(DIST, target))) {
      /* soubor */
    } else if (plannedPaths.includes(target)) {
      planned.set(target, (planned.get(target) || 0) + 1);
    } else err(p, `rozbitý interní odkaz ${h}`);
  }
  if (isIndexable && p !== '/404.html') {
    if (!hrefs.some((h) => h === '/kontakt/#poptavka' || h === '#poptavka')) err(p, 'chybí odkaz na poptávkový formulář');
    for (const h of hrefs.filter((x) => x.startsWith('tel:'))) {
      if (contact.phoneHref && h === contact.phoneHref) continue;
      if (h === petr.phoneHref && (/^\/penb\//.test(p) || p === '/kontakt/')) continue;
      err(p, `telefon ${h} mimo povolené použití (Elerys kontakt null; kontakt specialisty jen u PENB)`);
    }
  }

  // obrázky
  const imgs = [...html.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
  imgs.forEach((tag, i) => {
    const src = attr(tag, 'src');
    const alt = attr(tag, 'alt');
    if (alt === null) err(p, `obrázek ${src} nemá atribut alt`);
    if (!attr(tag, 'width') || !attr(tag, 'height')) err(p, `obrázek ${src} nemá width/height`);
    if (!/loading="lazy"/.test(tag) && !/fetchpriority="high"/.test(tag)) warn(p, `obrázek ${src} není lazy ani hero`);
    if (src && src.startsWith('/') && !fs.existsSync(path.join(DIST, src))) err(p, `obrázek ${src} neexistuje`);
    for (const s of (attr(tag, 'srcset') || '').split(',').map((x) => x.trim().split(' ')[0]).filter(Boolean))
      if (!fs.existsSync(path.join(DIST, s))) err(p, `srcset ${s} neexistuje`);
  });

  // formuláře: každé viditelné pole má label
  for (const m of html.matchAll(/<(input|select|textarea)\s[^>]*>/g)) {
    const tag = m[0];
    const type = attr(tag, 'type');
    if (type === 'hidden') continue;
    if (/disabled/.test(tag) && /checked/.test(tag)) continue; // cookie „nezbytné“ v labelu
    const id = attr(tag, 'id');
    const name = attr(tag, 'name');
    if (id && new RegExp(`<label[^>]*for="${id}"`).test(html)) continue;
    if (name && new RegExp(`<label[^>]*>\\s*<input[^>]*name="${name}"`).test(html)) continue; // obalené labelem
    err(p, `pole ${name || id} nemá label`);
  }

  // JSON-LD
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (!lds.length) err(p, 'chybí JSON-LD');
  const types = new Set();
  for (const raw of lds) {
    try {
      const j = JSON.parse(raw);
      const collect = (o) => {
        if (Array.isArray(o)) o.forEach(collect);
        else if (o && typeof o === 'object') {
          if (o['@type']) [].concat(o['@type']).forEach((t) => types.add(t));
          Object.values(o).forEach(collect);
        }
      };
      collect(j);
    } catch (e) {
      err(p, `nevalidní JSON-LD: ${e.message}`);
    }
  }
  for (const t of ['ProfessionalService', 'Person', 'WebSite']) if (!types.has(t)) err(p, `JSON-LD neobsahuje ${t}`);
  if (p !== '/' && p !== '/404.html' && !types.has('BreadcrumbList')) err(p, 'JSON-LD neobsahuje BreadcrumbList');
  if (/class="faq"/.test(html) && !types.has('FAQPage')) err(p, 'stránka má FAQ, ale ne FAQPage');
  if (types.has('FAQPage') && !/class="faq"/.test(html)) err(p, 'FAQPage bez viditelného FAQ');

  // zakázané formulace
  const visible = text(main) + ' ' + lds.join(' ');
  for (const [re, why] of FORBIDDEN) if (re.test(visible)) err(p, `zakázaná formulace: ${why}`);
  if (NO_AUTH_PAGES.test(p)) { const m = text(main).match(NO_AUTH_RE); if (m) err(p, `zmínka o oprávnění na stránce služby bez ověřeného oprávnění: „${m[0]}“`); }
  for (const m of visible.matchAll(AUTH_NUM_RE)) if (!AUTH_OK.has(m[1])) err(p, `neznámé číslo oprávnění ${m[1]}`);
  for (const n of AUTH_OK) if (text(main).includes(n) && !AUTH_PAGES.has(p)) err(p, `číslo oprávnění ${n} mimo povolené stránky (${[...AUTH_PAGES].join(', ')})`);
  if (/Liberec/i.test(decode(title || ''))) err(p, 'titulek obsahuje „Liberec“ (klíčové slovo sesterského webu)');
  // „zdarma“ v tlačítkách a odkazech (CTA)
  for (const m of main.matchAll(/<(a|button)\b[^>]*>([\s\S]*?)<\/\1>/g)) if (/zdarma/i.test(text(m[2]))) err(p, `CTA obsahuje „zdarma“: ${text(m[2])}`);
  // null hodnoty v configu se nesmí propsat do textu
  if (/\bnull\b|undefined|\[object Object\]|NaN/.test(text(main))) err(p, 'v textu je null/undefined/NaN');
  // ceny: Elerys žádné částky neuvádí (PENB ceník je na nejpenb.cz)
  { const amounts = [...visible.matchAll(/(\d{1,3}(?:[  ]\d{3})+|\d{3,})\s*Kč/g)].map((m) => m[1]); if (amounts.length) err(p, `částka v Kč: ${amounts.join(', ')}`); }
  if (/"price"\s*:|priceRange|"offers"|minPrice/.test(lds.join(' '))) err(p, 'JSON-LD obsahuje cenu/Offer');
  if (/<video[\s>]|<source[^>]+\.mp4|rel="preload"[^>]+\.mp4/.test(html)) err(p, 'video se nesmí načítat před kliknutím (v HTML je <video>/<source>/preload)');
  for (const m of html.matchAll(/data-video="([^"]+)"/g)) if (!fs.existsSync(path.join(DIST, m[1]))) err(p, `video ${m[1]} neexistuje`);
  if (!/name="access_key" value="bd562736-6a42-4413-bbdb-e9dc90aac420"/.test(html) && /class="lead-form"/.test(html)) err(p, 'formulář bez access key Web3Forms');
  for (const m of html.matchAll(/<input type="hidden" name="subject" value="([^"]+)"/g)) if (decode(m[1]) !== 'Poptávka – Elerys (web)') err(p, `nesprávný předmět formuláře: ${m[1]}`);
  // hlavní služby musí mít blok „Specializovaný web“ (proti kanibalizaci)
  if (['/kontrola-vytapeni/', '/penb/'].includes(p) && !/class="sister/.test(html)) err(p, 'chybí blok „Specializovaný web“');
  // service schema na stránkách služeb
  if (/^\/(kontrola-|penb|energetick)/.test(p) && !types.has('Service')) err(p, 'stránka služby bez JSON-LD Service');
  if (/"aggregateRating"|"review"\s*:/.test(lds.join(' '))) err(p, 'JSON-LD nesmí obsahovat hodnocení/recenze');
  
  // výkon: HTML (gzip) + JS (gzip) + obrázky nad ohybem (eager, kandidát pro 390 px @2x)
  const htmlGz = zlib.gzipSync(html).length;
  const jsUrl = (html.match(/<script src="(\/assets\/[^"]+)"/) || [])[1];
  const jsGz = jsUrl ? zlib.gzipSync(fs.readFileSync(path.join(DIST, jsUrl))).length : 0;
  let imgBytes = 0;
  for (const tag of imgs.filter((t) => /fetchpriority="high"/.test(t))) {
    const cands = (attr(tag, 'srcset') || '').split(',').map((x) => x.trim().split(' ')).filter((x) => x[0]).map(([u, w]) => ({ u, w: parseInt(w) }));
    const pick = cands.find((c) => c.w >= 780) || cands[cands.length - 1] || { u: attr(tag, 'src') };
    imgBytes += fs.statSync(path.join(DIST, pick.u)).size;
  }
  perf.push({ p, htmlGz, jsGz, imgBytes, total: htmlGz + jsGz + imgBytes });

  words[p] = text((main.match(/<article[\s\S]*<\/article>/) || [main])[0]).split(' ').length;
}

for (const [k, map] of Object.entries(seen))
  for (const [v, ps] of map) if (ps.length > 1) err(ps.join(', '), `duplicitní ${k}: „${v}“`);

// výstup
console.log(`\nKontrola ${Object.keys(pages).length} stránek v dist/\n`);
for (const p of Object.keys(pages).sort()) {
  const t = decode((pages[p].html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  console.log(`  ${p.padEnd(30)} ${String(t.length).padStart(2)} zn.  ${t}`);
}
console.log('\nPočet slov v <article> (orientačně):');
for (const [p, w] of Object.entries(words).sort()) if (w > 300) console.log(`  ${p.padEnd(45)} ${w}`);
console.log('\nPřenos pro první viewport (gzip HTML + gzip JS + obrázky nad ohybem pro 390 px @2x; CSS je inline):');
for (const r of perf.sort((a, b) => a.p.localeCompare(b.p))) {
  const kb = (n) => (n / 1024).toFixed(1).padStart(6);
  const flag = r.total > 250 * 1024 ? '  ⚠ > 250 kB' : '';
  console.log(`  ${r.p.padEnd(45)} HTML ${kb(r.htmlGz)} kB  JS ${kb(r.jsGz)} kB  IMG ${kb(r.imgBytes)} kB  = ${kb(r.total)} kB${flag}`);
  if (r.total > 250 * 1024) warn(r.p, `první viewport ${(r.total / 1024).toFixed(0)} kB > 250 kB`);
}
// sitemap
const sm = fs.existsSync(path.join(DIST, 'sitemap.xml')) ? fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8') : '';
for (const [p, pg] of Object.entries(pages)) {
  const idx = !/<meta name="robots" content="noindex/.test(pg.html);
  const inSm = sm.includes(`<loc>${site.url}${p}</loc>`);
  if (idx && p !== '/404.html' && !inSm) err(p, 'chybí v sitemap.xml');
  if (!idx && inSm) err(p, 'noindex stránka je v sitemap.xml');
}
for (const f of ['robots.txt', 'llms.txt', 'sitemap.xml']) if (!fs.existsSync(path.join(DIST, f))) err(f, 'chybí');
if (planned.size) {
  console.log(`\nPlánované stránky (zatím neexistují, odkazy jsou v pořádku) – ${planned.size}:`);
  for (const [p, n] of [...planned].sort()) console.log(`  · ${p} (${n}× odkaz)`);
}
if (warnings.length) {
  console.log(`\nVarování (${warnings.length}):`);
  warnings.forEach((w) => console.log('  ! ' + w));
}
if (errors.length) {
  console.log(`\nCHYBY (${errors.length}):`);
  errors.forEach((e) => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('\n✓ Bez chyb.');
