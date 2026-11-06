// Elerys – bezzávislostní generátor statického webu: node build.mjs → dist/
import fs from 'node:fs';
import { logoSvg, faviconSvg } from './src/templates/lynx.mjs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { images, ogImages, ORIG, site, redirects } from './src/config.mjs';
import { setImageManifest } from './src/lib/html.mjs';
import { layout, setAssets } from './src/templates/layout.mjs';

// sharp: z node_modules projektu (npm install), jinak z globální instalace; bez sharp se použije .cache/img
let sharp = null; // NO_SHARP=1 node build.mjs → test buildu jen z cache
if (!process.env.NO_SHARP) {
try { sharp = (await import('sharp')).default; } catch {
  try { sharp = createRequire('/opt/npm-tools/node_modules/')('sharp'); } catch { sharp = null; }
}
}

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const CACHE = path.join(ROOT, 'img-cache');
const t0 = Date.now();

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'img'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
fs.mkdirSync(CACHE, { recursive: true });

// ---------- obrázky ----------
// Zpracované varianty a jejich rozměry se ukládají do img-cache/ (+ manifest.json), která je součástí projektu.
// Build pak funguje i bez sharp a bez zdrojových fotek (např. na Vercelu).
// Obrázek s `url` se stáhne při buildu (fetch → sharp); když stažení selže a v cache není, u `optional` se tiše vynechá.
const MANIFEST = path.join(CACHE, 'manifest.json');
const cachedManifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
const fresh = (out, src) => fs.existsSync(out) && (!src || !fs.existsSync(src) || fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs);
const manifest = {};
const skipped = [];
let made = 0;
async function download(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': 'elerys-build' } });
    clearTimeout(t);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return Buffer.from(await r.arrayBuffer());
  } catch (e) {
    return { error: e.cause?.message || e.message };
  }
}
for (const [name, def] of Object.entries(images)) {
  const src = def.url ? null : def.abs || path.join(ORIG, def.src);
  const cached = cachedManifest[name];
  const cacheOk = cached && cached.variants.every((v) => fresh(path.join(CACHE, path.basename(v.url)), src)) && cached.widths === def.widths.join(',');
  if (cacheOk) {
    manifest[name] = cached;
  } else {
    let input = src;
    if (def.url) {
      const buf = sharp ? await download(def.url) : { error: 'sharp není k dispozici' };
      if (!Buffer.isBuffer(buf)) {
        if (def.optional) { skipped.push(`${name} (${buf.error})`); continue; }
        throw new Error(`Obrázek ${name}: nelze stáhnout ${def.url}: ${buf.error}`);
      }
      input = buf;
    } else if (!sharp || !fs.existsSync(src)) {
      throw new Error(`Obrázek ${name}: chybí v img-cache a nelze ho vygenerovat (sharp: ${!!sharp}, zdroj: ${fs.existsSync(src)})`);
    }
    const meta0 = await sharp(input).metadata();
    const meta = def.extract ? { width: def.extract.width, height: def.extract.height } : meta0.orientation >= 5 ? { width: meta0.height, height: meta0.width } : meta0;
    manifest[name] = { widths: def.widths.join(','), variants: [] };
    for (const w0 of def.widths) {
      const w = Math.min(w0, meta.width);
      const h = Math.round((meta.height * w) / meta.width);
      const file = `${name}-${w}.webp`;
      const out = path.join(CACHE, file);
      let pipe = sharp(input).rotate();
      if (def.extract) pipe = pipe.extract(def.extract);
      await pipe.resize({ width: w, withoutEnlargement: true }).webp({ quality: 76, effort: 5 }).toFile(out);
      made++;
      if (!manifest[name].variants.some((v) => v.w === w)) manifest[name].variants.push({ w, h, url: `/img/${file}` });
    }
  }
  for (const v of manifest[name].variants) fs.copyFileSync(path.join(CACHE, path.basename(v.url)), path.join(DIST, 'img', path.basename(v.url)));
}
for (const [name, def] of Object.entries(ogImages)) {
  const src = def.abs || path.join(ORIG, def.src);
  const out = path.join(CACHE, `${name}.jpg`);
  if (!fresh(out, src)) {
    if (!sharp) throw new Error(`OG obrázek ${name} chybí v cache a sharp není k dispozici`);
    await sharp(src).rotate().resize(1200, 630, { fit: 'cover', position: def.position || 'centre' }).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
    made++;
  }
  fs.copyFileSync(out, path.join(DIST, 'img', `${name}.jpg`));
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
setImageManifest(manifest);

// ---------- CSS / JS / statické soubory ----------
const minCss = (s) =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
// fonty: kopie s hashem v názvu (immutable cache), v CSS zástupné __FONT_jméno__
const fontUrls = {};
fs.mkdirSync(path.join(DIST, 'assets', 'fonts'), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'src/assets/fonts')).filter((x) => x.endsWith('.woff'))) {
  const buf = fs.readFileSync(path.join(ROOT, 'src/assets/fonts', f));
  const h = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 8);
  const name = f.replace('.woff', `.${h}.woff`);
  fs.writeFileSync(path.join(DIST, 'assets', 'fonts', name), buf);
  fontUrls[f.replace('.woff', '')] = `/assets/fonts/${name}`;
}
let cssSrc = fs.readFileSync(path.join(ROOT, 'src/assets/css/site.css'), 'utf8').replace(/__FONT_([a-z-]+)__/g, (m, n) => fontUrls[n] || m);
const css = minCss(cssSrc);
const js = fs.readFileSync(path.join(ROOT, 'src/assets/js/site.js'), 'utf8');
const jsHash = crypto.createHash('sha1').update(js).digest('hex').slice(0, 8);
const jsName = `site.${jsHash}.js`;
fs.writeFileSync(path.join(DIST, 'assets', jsName), js);
fs.writeFileSync(path.join(DIST, 'logo.svg'), logoSvg());
fs.writeFileSync(path.join(DIST, 'favicon.svg'), faviconSvg());
// pohyb: GSAP + ScrollTrigger (vendor, self-host) + vlastní motion.js v jednom souboru
const vendorDir = path.join(ROOT, 'src/assets/js/vendor');
const motionJs = ['gsap.min.js', 'ScrollTrigger.min.js']
  .map((f) => fs.readFileSync(path.join(vendorDir, f), 'utf8').replace(/\/\/# sourceMappingURL=.*$/gm, ''))
  .join(';\n') + ';\n' + fs.readFileSync(path.join(ROOT, 'src/assets/js/motion.js'), 'utf8');
const motionName = `motion.${crypto.createHash('sha1').update(motionJs).digest('hex').slice(0, 8)}.js`;
fs.writeFileSync(path.join(DIST, 'assets', motionName), motionJs);
fs.mkdirSync(path.join(DIST, 'ke-stazeni'), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'src/assets/files'))) fs.copyFileSync(path.join(ROOT, 'src/assets/files', f), path.join(DIST, 'ke-stazeni', f));
setAssets({ css, jsUrl: `/assets/${jsName}`, fontUrls, motionUrl: `/assets/${motionName}` });

// ---------- stránky ----------
const pageModules = ['home.mjs', 'sluzby.mjs', 'segmenty.mjs', 'firma.mjs', 'znalosti.mjs', 'basic.mjs', 'pravni.mjs'];
const pages = [];
for (const m of pageModules) {
  const mod = await import(`./src/pages/${m}`);
  const fns = Array.isArray(mod.default) ? mod.default : [mod.default];
  for (const fn of fns) pages.push(fn());
}
// ---------- typografie: nedělitelné mezery jen v textových uzlech (ne v atributech, <script>, <style>) ----------
const NB = '\u00a0';
const UNITS = '(?:kW|MW|kWh|MWh|Kč|let|roky|rok|m²|%|°C|h|hodin|hodiny|minut|dnů|dní|pracovních|bytů|domů|budov|jednotek|tříd|objektů|budovy|objekty)';
function typoText(t) {
  return t
    .replace(new RegExp(`(\\d) (?=${UNITS}(?![A-Za-zÁ-ž]))`, 'g'), `$1${NB}`)
    .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NB}`)
    .replace(/§ (?=\d)/g, `§${NB}`)
    .replace(/(^|[\s(„])(č\.|odst\.|písm\.) (?=\d|[a-z]\))/g, `$1$2${NB}`)
    .replace(/(^|[\s(„\u00a0])([kKsSvVzZoOuUaAiI]) /g, `$1$2${NB}`)
    .replace(/(^|[\s(„\u00a0])([kKsSvVzZoOuUaAiI]) /g, `$1$2${NB}`);
}
function typography(html) {
  return html
    .split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<textarea[\s\S]*?<\/textarea>|<[^>]+>)/)
    .map((part, i) => (i % 2 === 1 ? part : typoText(part)))
    .join('');
}

for (const p of pages) {
  const html = typography(layout(p));
  if (p.file) {
    fs.writeFileSync(path.join(DIST, p.file), html);
    continue;
  }
  const dir = path.join(DIST, p.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// ---------- sitemap.xml, robots.txt, llms.txt, vercel.json ----------
const indexable = pages.filter((p) => !p.noindex && !p.file);
fs.writeFileSync(
  path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((p) => `  <url><loc>${site.url}${p.path}</loc><lastmod>${p.updated || site.updated}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `# ${site.url}\nUser-agent: *\nAllow: /\n\n# AI vyhledávače a asistenti – povoleno\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
);
const { default: llms, llmsFull } = await import('./src/llms.mjs');
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms(indexable));
fs.writeFileSync(path.join(DIST, 'llms-full.txt'), llmsFull(indexable));
const redirectRules = Object.entries(redirects).flatMap(([to, froms]) =>
  froms.flatMap((f) => [
    { source: `/${f}`, destination: to, permanent: true },
    { source: `/${f}/`, destination: to, permanent: true },
  ]),
);
redirectRules.push({ source: '/index.html', destination: '/', permanent: true });
const sec = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
];
const vercel = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  framework: null,
  cleanUrls: false,
  trailingSlash: true,
  redirects: redirectRules,
  headers: [
    { source: '/(.*)', headers: sec },
    { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/img/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }] },
    { source: '/(.*).html', headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }] },
  ],
};
fs.writeFileSync(path.join(ROOT, 'vercel.json'), JSON.stringify(vercel, null, 2) + '\n');
if (skipped.length) console.log(`Volitelné vzdálené obrázky vynechány (nedostupné): ${skipped.join(', ')}`);
console.log(`Build OK: ${pages.length} stránek, ${Object.keys(manifest).length} obrázků (${made} nově zpracováno), CSS ${(css.length / 1024).toFixed(1)} kB inline, JS ${(js.length / 1024).toFixed(1)} kB, ${Date.now() - t0} ms`);
