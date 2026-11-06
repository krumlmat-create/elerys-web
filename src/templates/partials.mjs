import { site, person, petr, contact, forms, facts, services, segments, references, sisterSites, quoteTime, FORM_HREF, CTA_LABEL } from '../config.mjs';
import { esc, abs, img, hasImg, tel, mail, ext, fmtDate, serviceSchema, faqSchema } from '../lib/html.mjs';

export const CTA = CTA_LABEL;

// ---------- ikony (tenká linka) ----------
const svg = (d, s = 24) => `<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const I = {
  go: svg('M7 17 17 7M9 7h8v8', 18),
  arrow: svg('M5 12h14M13 6l6 6-6 6', 18),
  flame: svg('M12 21c-4 0-6.5-2.6-6.5-6 0-3.5 3-5.5 3.5-9 2.5 1.5 4 4 4 6 1-1 1.5-2 1.5-3.5 2 1.5 4 4 4 6.5 0 3.4-2.5 6-6.5 6z'),
  snow: svg('M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 6l2.5-1.5M9.5 19.5 12 18l2.5 1.5'),
  label: svg('M4 5h9M4 9h11M4 13h13M4 17h15M4 5v14'),
  audit: svg('M9 4h6l1 2h3v15H5V6h3zM9 11h6M9 15h4'),
  bulb: svg('M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z'),
  block: svg('M3 21V8h8v13M11 21V3h10v18M6 11h2M6 15h2M14 7h4M14 11h4M14 15h4M2 21h20'),
  keys: svg('M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6'),
  school: svg('M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5M22 9v6'),
  factory: svg('M3 21V11l6 3v-3l6 3V5h4l2 16zM3 21h18'),
  house: svg('M4 20V10l8-6 8 6v10h-5v-6H9v6z'),
  doc: svg('M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6'),
  check: svg('M5 12.5 10 17 19 7', 18),
  plus: svg('M12 5v14M5 12h14', 18),
  ext: svg('M14 4h6v6M20 4l-9 9M18 14v6H4V6h6', 16),
  mail: svg('M3 6h18v12H3zM3 6l9 7 9-7', 18),
  phone: svg('M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z', 18),
};
export const SERVICE_ICO = { vytapeni: I.flame, klimatizace: I.snow, penb: I.label, audit: I.audit, poradenstvi: I.bulb };
export const SEGMENT_ICO = { svj: I.block, spravci: I.keys, obce: I.school, firmy: I.factory, majitele: I.house };

// ---------- hlavičky ----------
/**
 * Úvodní sekce podstránky (tmavá). o: kick, h1, lead, image{name,alt,pos}, cta[], meta (HTML pod tlačítky), size ('tall'|'')
 */
export function pageHero(o) {
  const cta = o.cta === false ? '' : `<div class="hero-cta">${(o.cta || [{ href: FORM_HREF, label: CTA, primary: true }]).map((b) => `<a class="btn ${b.primary ? 'btn-primary' : 'btn-ghost-light'}" href="${b.href}"${b.ext ? ' target="_blank" rel="noopener"' : ''}>${esc(b.label)}</a>`).join('')}</div>`;
  return `<header class="page-hero${o.image ? ' has-media' : ''}${o.size ? ' page-hero-' + o.size : ''}">
  ${o.image ? `<div class="page-hero-bg" aria-hidden="true">${img(o.image.name, { alt: '', sizes: '100vw', eager: true, pos: o.image.pos || '' })}</div>` : ''}
  <!--crumbs-->
  <div class="wrap page-hero-in">
    ${o.kick ? `<p class="eyebrow">${esc(o.kick)}</p>` : ''}
    <h1>${o.h1}</h1>
    ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
    ${cta}
    ${o.meta || ''}
  </div>
</header>`;
}

export const sectionHead = ({ kick, title, lead, tag = 'h2', id = '', cls = '' }) => `<div class="section-head${cls ? ' ' + cls : ''}">
  ${kick ? `<p class="kick">${esc(kick)}</p>` : ''}
  <${tag}${id ? ` id="${id}"` : ''}>${title}</${tag}>
  ${lead ? `<p class="section-lead">${lead}</p>` : ''}
</div>`;

// ---------- služby ----------
export function pillarGrid({ headingTag = 'h3', exclude = [] } = {}) {
  return `<ol class="pillars" role="list">
${services
  .filter((s) => !exclude.includes(s.id))
  .map(
    (s) => `  <li class="pillar reveal">
    <a class="pillar-link" href="${s.path}">
      <span class="pillar-n">${s.n}</span>
      <span class="pillar-ico">${SERVICE_ICO[s.id]}</span>
      <${headingTag} class="pillar-t">${esc(s.label)}</${headingTag}>
      <span class="pillar-d">${esc(s.desc)}</span>
      <span class="pillar-go" aria-hidden="true">${I.arrow}</span>
    </a>
    ${s.sub.length > 1 ? `<ul class="pillar-sub" role="list">${s.sub.filter((x) => x.path !== s.path).map((x) => `<li><a href="${x.path}">${esc(x.label)}</a></li>`).join('')}</ul>` : ''}
  </li>`,
  )
  .join('\n')}
</ol>`;
}

export function segmentGrid({ headingTag = 'h3', texts = {} } = {}) {
  return `<ul class="segments" role="list">
${segments.map((s) => `  <li class="segment reveal"><a href="${s.path}"><span class="segment-ico">${SEGMENT_ICO[s.id]}</span><${headingTag}>${esc(s.label)}</${headingTag}><p>${esc(texts[s.id] || s.desc)}</p><span class="segment-go" aria-hidden="true">${I.arrow}</span></a></li>`).join('\n')}
</ul>`;
}

/** Blok „Specializovaný web“ – odkaz ven na sesterský web */
export function sisterBlock(key, { title, text, links = [] } = {}) {
  const s = sisterSites[key];
  return `<aside class="sister reveal" aria-label="Specializovaný web ${esc(s.label)}">
  <div class="sister-in">
    <p class="sister-k">Specializovaný web</p>
    <p class="sister-t">${esc(title || s.title)}</p>
    <p class="sister-d">${esc(text || s.text)}</p>
    ${links.length ? `<ul class="sister-links" role="list">${links.map((l) => `<li>${ext(l.url, esc(l.label))}</li>`).join('')}</ul>` : ''}
  </div>
  <a class="btn btn-light sister-btn" href="${s.url}" target="_blank" rel="noopener">${esc(s.label)} ${I.ext}</a>
</aside>`;
}

// ---------- reference ----------
export function refCards({ ids = null, limit = 6, headingTag = 'h3' } = {}) {
  const list = (ids ? ids.map((id) => references.find((r) => r.id === id)) : references).filter(Boolean).slice(0, limit);
  return `<ul class="refs" role="list">
${list
  .map(
    (r) => `  <li class="ref reveal">
    <figure class="ref-img">${img(r.image, { alt: r.alt, sizes: '(min-width: 1000px) 380px, (min-width: 640px) 45vw, 92vw' })}</figure>
    <div class="ref-body">
      <p class="ref-meta">${esc(r.place)} · ${esc(r.scope)}</p>
      <${headingTag} class="ref-t">${esc(r.title)}</${headingTag}>
      <p>${esc(r.text)}</p>
    </div>
  </li>`,
  )
  .join('\n')}
</ul>`;
}

export function refTable({ caption = 'Vybrané reference – kontrola systémů vytápění' } = {}) {
  const hasYear = references.some((r) => r.year);
  return `<div class="table-wrap"><table class="ref-table">
  <caption>${esc(caption)}</caption>
  <thead><tr><th scope="col">Objednatel / objekt</th><th scope="col">Typ</th><th scope="col">Místo</th><th scope="col">Rozsah</th>${hasYear ? '<th scope="col">Rok</th>' : ''}</tr></thead>
  <tbody>
    ${references.map((r) => `<tr><th scope="row">${esc(r.title)}</th><td data-label="Typ">${esc(r.kind)}</td><td data-label="Místo">${esc(r.place)}</td><td data-label="Rozsah">${esc(r.scope)}</td>${hasYear ? `<td data-label="Rok">${esc(r.year || '')}</td>` : ''}</tr>`).join('\n    ')}
  </tbody>
</table></div>`;
}

// ---------- tým ----------
export const monogram = (name) => `<span class="monogram" aria-hidden="true">${esc(name.replace(/^Ing\.\s*/, '').split(' ').map((x) => x[0]).join(''))}</span>`;
export function personPhoto(p, { sizes = '(min-width: 900px) 420px, 90vw' } = {}) {
  return hasImg(p.photo) ? img(p.photo, { alt: p.photoAlt, sizes }) : monogram(p.name);
}

export function teamTeaser({ headingTag = 'h3' } = {}) {
  return `<ul class="team-teaser" role="list">
  <li class="tt reveal">
    <figure class="tt-photo">${personPhoto(person, { sizes: '(min-width: 900px) 360px, 80vw' })}</figure>
    <div><p class="tt-role">${esc(person.lead)}</p><${headingTag} class="tt-name">${esc(person.name)}</${headingTag}><p>Inženýr z ${esc(person.alumniOf)} s praxí z teplárny, vodárenství a energetických projektů. Držitel oprávnění MPO pro kontrolu systémů vytápění.</p></div>
  </li>
  <li class="tt reveal">
    <figure class="tt-photo">${personPhoto(petr, { sizes: '(min-width: 900px) 360px, 80vw' })}</figure>
    <div><p class="tt-role">${esc(petr.lead)}</p><${headingTag} class="tt-name">${esc(petr.name)}</${headingTag}><p>Průkazy energetické náročnosti, příprava auditů, renovační plány a poradenství k dotacím. Vede Akademii ES pro budoucí energetické specialisty.</p></div>
  </li>
  <li class="tt tt-open reveal">
    <span class="tt-plus" aria-hidden="true">${I.plus}</span>
    <div><p class="tt-role">Kariéra</p><${headingTag} class="tt-name">Hledáme další energetické specialisty</${headingTag}><p><a href="/kariera/">Co nabízíme a jak se ozvat</a></p></div>
  </li>
</ul>`;
}

// ---------- spolupráce ----------
export const STEPS = [
  { t: 'Zadání', d: 'Pošlete seznam objektů nebo jen popis situace. Upřesníme, které povinnosti a služby se na budovy vztahují.' },
  { t: 'Nabídka a harmonogram', d: `Pevnou nabídku pošleme ${quoteTime}. U více objektů s rozpisem po budovách a termíny rozloženými do roku.` },
  { t: 'Prohlídka a podklady', d: 'Domluvíme přístup do kotelen a technických místností s vaším technikem nebo správcem. Podklady sbíráme jednou pro všechny služby.' },
  { t: 'Výstupy a doporučení', d: 'Zprávy, průkazy a posudky dostanete v PDF s přehledem zjištění. Zákonné výstupy zapíšeme do evidence ENEX.' },
  { t: 'Hlídání termínů', d: 'Navrhneme, kdy která povinnost znovu nastává, aby žádná lhůta neutekla.' },
];
export const processList = (headingTag = 'h3', steps = STEPS) => `<ol class="steps" role="list">
${steps.map((s, i) => `  <li class="step reveal"><span class="step-n">${String(i + 1).padStart(2, '0')}</span><${headingTag}>${esc(s.t)}</${headingTag}><p>${esc(s.d)}</p></li>`).join('\n')}
</ol>`;

// ---------- přehled povinností (ověřená fakta) ----------
export const OBLIGATIONS = [
  { t: 'Kontrola systému vytápění', who: `zdroj tepla ${facts.heating.threshold}`, when: `${facts.heating.interval}, nový systém ${facts.heating.newSystem}`, law: `${facts.heating.paragraph}, ${facts.heating.decree}`, href: '/kontrola-vytapeni/' },
  { t: 'Kontrola klimatizačního systému', who: `chlazení ${facts.ac.threshold}`, when: `${facts.ac.interval}, nový systém ${facts.ac.newSystem}`, law: `§ 6a zákona č. 406/2000 Sb., ${facts.ac.decree}`, href: '/kontrola-klimatizace/' },
  { t: 'Průkaz energetické náročnosti', who: 'prodej, pronájem, nová budova, větší změna, budovy úřadů nad 250 m²', when: `platnost ${facts.penb.validity}`, law: `${facts.penb.paragraph}, ${facts.penb.decree}`, href: '/penb/' },
  { t: 'Energetický audit', who: `podnikatelé nad ${facts.audit.bizAudit}, veřejný sektor nad ${facts.audit.publicAudit} ročně`, when: `u podnikatelů ${facts.audit.bizInterval}`, law: `${facts.audit.paragraph}, ${facts.audit.decree}`, href: '/energeticky-audit/' },
  { t: 'Energetický posudek', who: 'mimo jiné projekty úspor financované z dotací', when: 'před podáním žádosti a po realizaci, pokud program nestanoví jinak', law: `${facts.posudek.paragraph}, ${facts.posudek.decree}`, href: '/energeticky-posudek/' },
];
export const obligationsTable = ({ caption = 'Hlavní energetické povinnosti budov a organizací' } = {}) => `<div class="table-wrap"><table class="ob-table">
  <caption>${esc(caption)}</caption>
  <thead><tr><th scope="col">Povinnost</th><th scope="col">Koho se týká</th><th scope="col">Jak často</th><th scope="col">Předpis</th></tr></thead>
  <tbody>
    ${OBLIGATIONS.map((o) => `<tr><th scope="row"><a href="${o.href}">${esc(o.t)}</a></th><td data-label="Koho se týká">${esc(o.who)}</td><td data-label="Jak často">${esc(o.when)}</td><td data-label="Předpis">${esc(o.law)}</td></tr>`).join('\n    ')}
  </tbody>
</table></div>
<p class="small">Stav k ${fmtDate(site.updated)}. ${esc(facts.penb.amendmentNote)}</p>`;

// ---------- ukázka zprávy ----------
export const reportMock = () => `<figure class="report reveal" aria-label="Ilustrace: struktura zprávy o kontrole">
  <div class="report-paper">
    <p class="report-k">Zpráva o kontrole systému vytápění</p>
    <p class="report-sub">Evidenční číslo z evidence ENEX · ${esc(facts.heating.decree)}</p>
    <ul class="report-rows" role="list">
      <li><span>Identifikace budovy a systému</span><b class="chip">popis</b></li>
      <li><span>Dimenzování zdroje vůči potřebě tepla</span><b class="chip">hodnocení</b></li>
      <li><span>Provozní parametry a regulace</span><b class="chip">měření</b></li>
      <li><span>Doporučení ke zvýšení účinnosti</span><b class="chip chip-dark">opatření</b></li>
    </ul>
    <p class="report-foot">Přílohy: fotodokumentace, podklady, výpočty</p>
    <span class="report-stamp" aria-hidden="true">ENEX</span>
  </div>
  <figcaption class="small">Struktura zprávy podle § 8 ${esc(facts.heating.decreeGen)} Ilustrace, nejde o skutečný dokument.</figcaption>
</figure>`;

// ---------- FAQ ----------
export const faqList = (items, headingTag = 'h3') => `<div class="faq">
${items.map((q) => `  <details class="faq-item">
    <summary><${headingTag} class="faq-q">${esc(q.q)}</${headingTag}><span class="faq-ico" aria-hidden="true"></span></summary>
    <div class="faq-a">${q.a}</div>
  </details>`).join('\n')}
</div>`;
export const faqSection = (items, { title = 'Časté otázky', kick = 'Otázky', id = 'faq' } = {}) => `<section class="section" id="${id}">
  <div class="wrap split-head">
    ${sectionHead({ kick, title })}
    ${faqList(items)}
  </div>
</section>`;

// ---------- CTA a související ----------
export const ctaBand = ({ title = 'Probereme vaše budovy', text, headingTag = 'h2', secondary } = {}) => `<section class="cta-band" aria-label="Poptávka">
  <div class="wrap cta-band-in">
    <div>
      <${headingTag} class="cta-title">${esc(title)}</${headingTag}>
      <p>${text || `Pošlete seznam objektů nebo krátký popis. Nabídku připravíme ${quoteTime}.`}</p>
    </div>
    <div class="cta-actions">
      <a class="btn btn-primary" href="${FORM_HREF}">${CTA}</a>
      ${secondary ? `<a class="btn btn-ghost-light" href="${secondary.href}">${esc(secondary.label)}</a>` : `<a class="btn btn-ghost-light" href="/povinnosti-budov/">Ověřit povinnosti</a>`}
    </div>
  </div>
</section>`;

export const related = (links, title = 'Související') => `<aside class="related wrap" aria-labelledby="souvisejici">
  <h2 id="souvisejici" class="related-h">${esc(title)}</h2>
  <ul role="list">
    ${links.map((l) => `<li><a href="${l.href}"><strong>${esc(l.label)}</strong>${l.text ? `<span>${esc(l.text)}</span>` : ''}<i aria-hidden="true">${I.arrow}</i></a></li>`).join('\n    ')}
  </ul>
</aside>`;

export const updatedLine = (extra = '') => `<p class="updated">Fakta ověřena <time datetime="${site.updated}">${fmtDate(site.updated)}</time>${extra ? ` · ${extra}` : ''}</p>`;

/** Kontakt na specialistu – JEN u PENB (pokyn klienta) */
export const penbContact = () => `<div class="specialist reveal">
  <figure class="specialist-photo">${personPhoto(petr, { sizes: '96px' })}</figure>
  <div>
    <p class="specialist-k">Průkazy energetické náročnosti zajišťuje</p>
    <p class="specialist-n">${esc(petr.name)}</p>
    <p class="specialist-c"><a href="${petr.phoneHref}" data-track="phone">${I.phone}${esc(petr.phone).replace(/ /g, '&nbsp;')}</a><a href="mailto:${petr.email}">${I.mail}${esc(petr.email)}</a></p>
  </div>
</div>`;

// ---------- formulář ----------
export const ORG_TYPES = [['SVJ / bytové družstvo', 'SVJ nebo bytové družstvo'], ['správce nemovitostí', 'Správce nemovitostí'], ['obec / škola / veřejná instituce', 'Obec, škola, veřejná instituce'], ['firma', 'Firma nebo průmyslový provoz'], ['soukromý vlastník', 'Soukromý vlastník'], ['jiné', 'Jiné']];
export const SERVICE_OPTS = [['kontrola vytápění', 'Kontrola systému vytápění'], ['kontrola klimatizace', 'Kontrola klimatizace'], ['PENB', 'Průkaz energetické náročnosti (PENB)'], ['energetický audit', 'Energetický audit'], ['energetický posudek', 'Energetický posudek'], ['poradenství', 'Energetické poradenství / dotace'], ['péče o budovy', 'Víceletá péče o budovy (více služeb)'], ['nevím', 'Nevím, potřebuji poradit']];
let formCounter = 0;
const opts = (list, sel) => list.map(([v, l]) => `<option value="${v}"${v === sel ? ' selected' : ''}>${esc(l)}</option>`).join('');

export function leadForm({ heading = 'Poptávka', headingTag = 'h2', id, service = 'nevím', org = 'SVJ / bytové družstvo', segment = '', button = 'Odeslat poptávku', hideHeading = false } = {}) {
  const f = id || `f${++formCounter}`;
  const fid = (n) => `${f}-${n}`;
  return `<div class="form-card">
  <${headingTag} class="form-title${hideHeading ? ' sr-only' : ''}" id="${fid('title')}">${esc(heading)}</${headingTag}>
  <form class="lead-form" method="POST" action="${forms.endpoint}" data-ajax="${forms.endpoint}" data-subject="${esc(forms.subject)}" aria-labelledby="${fid('title')}">
    <div class="form-grid">
      <div class="field">
        <label for="${fid('sluzba')}">Služba</label>
        <select id="${fid('sluzba')}" name="sluzba">${opts(SERVICE_OPTS, service)}</select>
      </div>
      <div class="field">
        <label for="${fid('org')}">Kdo poptává</label>
        <select id="${fid('org')}" name="typ_organizace">${opts(ORG_TYPES, org)}</select>
      </div>
      <div class="field">
        <label for="${fid('objekty')}">Počet objektů</label>
        <input id="${fid('objekty')}" name="pocet_objektu" type="text" inputmode="numeric" placeholder="např. 4">
      </div>
      <div class="field">
        <label for="${fid('misto')}">Obec nebo region</label>
        <input id="${fid('misto')}" name="lokalita" type="text" autocomplete="address-level2" placeholder="např. Tábor">
      </div>
      <div class="field">
        <label for="${fid('name')}">Jméno a příjmení <span class="req" aria-hidden="true">*</span></label>
        <input id="${fid('name')}" name="jmeno" type="text" autocomplete="name" required>
      </div>
      <div class="field">
        <label for="${fid('firma')}">Organizace</label>
        <input id="${fid('firma')}" name="organizace" type="text" autocomplete="organization">
      </div>
      <div class="field">
        <label for="${fid('email')}">E-mail <span class="req" aria-hidden="true">*</span></label>
        <input id="${fid('email')}" name="email" type="email" autocomplete="email" required>
      </div>
      <div class="field">
        <label for="${fid('phone')}">Telefon</label>
        <input id="${fid('phone')}" name="telefon" type="tel" autocomplete="tel" inputmode="tel">
      </div>
      <div class="field field-wide">
        <label for="${fid('note')}">Co potřebujete</label>
        <textarea id="${fid('note')}" name="poznamka" rows="4" placeholder="Typ budov, výkon zdrojů tepla, termín, požadavky zadávacího řízení…"></textarea>
      </div>
    </div>
    <div class="field field-check">
      <input id="${fid('gdpr')}" name="souhlas" type="checkbox" value="ano" required>
      <label for="${fid('gdpr')}">Souhlasím se zpracováním údajů za účelem vyřízení poptávky. <a href="/ochrana-osobnich-udaju/">Zásady ochrany osobních údajů</a> <span class="req" aria-hidden="true">*</span></label>
    </div>
    <div class="hp" aria-hidden="true"><label for="${fid('hp')}">Nevyplňujte</label><input id="${fid('hp')}" name="botcheck" type="checkbox" tabindex="-1" autocomplete="off"></div>
    <input type="hidden" name="access_key" value="${forms.accessKey}">
    <input type="hidden" name="subject" value="${esc(forms.subject)}">
    <input type="hidden" name="from_name" value="${esc(forms.fromName)}">
    <input type="hidden" name="redirect" value="${abs('/dekujeme/')}">
    <input type="hidden" name="segment" value="${esc(segment)}">
    <input type="hidden" name="vysledek_testu">
    <input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_term"><input type="hidden" name="utm_content">
    <input type="hidden" name="gclid"><input type="hidden" name="gbraid"><input type="hidden" name="wbraid">
    <input type="hidden" name="vstupni_stranka"><input type="hidden" name="referrer"><input type="hidden" name="stranka_formulare">
    <p class="form-testnote small" hidden></p>
    <button class="btn btn-primary btn-block" type="submit">${esc(button)}</button>
    <p class="form-status" role="status" aria-live="polite"></p>
  </form>
</div>`;
}

/** Sekce s formulářem (id="poptavka") */
export function formSection({ title = 'Pošlete poptávku', text, service, org, segment = '', kick = 'Poptávka', aside = '' } = {}) {
  return `<section class="section section-form" id="poptavka">
  <div class="wrap split-form">
    <div class="form-intro">
      <p class="kick">${esc(kick)}</p>
      <h2>${esc(title)}</h2>
      <p>${text || `Stačí pár údajů. Ozveme se ${esc(contact.responseTime)} a u každé služby navrhneme rozsah, termín a cenu předem.`}</p>
      <ul class="checks" role="list">
        <li>Nabídka ${quoteTime}</li>
        <li>Jedno kontaktní místo pro všechny služby</li>
        <li>U více objektů rozpis po budovách</li>
      </ul>
      ${aside}
    </div>
    ${leadForm({ heading: 'Poptávka služby', headingTag: 'h3', service, org, segment })}
  </div>
</section>`;
}

// ---------- kontrola povinností (checker) ----------
const radio = (n, legend, name, list, hint = '') => `<fieldset class="ck-q" data-q="${name}">
  <legend><span class="ck-n">${n}</span><span>${legend}</span></legend>
  ${hint ? `<p class="ck-hint">${hint}</p>` : ''}
  <div class="ck-opts">${list.map(([v, l]) => `<label class="opt"><input type="radio" name="${name}" value="${v}"><span>${l}</span></label>`).join('')}</div>
</fieldset>`;
const check = (name, list) => `<div class="ck-opts">${list.map(([v, l]) => `<label class="opt opt-check"><input type="checkbox" name="${name}" value="${v}"><span>${l}</span></label>`).join('')}</div>`;

export function checker({ id = 'kontrola-povinnosti', compact = false } = {}) {
  return `<div class="checker${compact ? ' checker-compact' : ''}" id="${id}">
  <form class="ck-form js-only" data-checker aria-label="Ověření povinností budovy">
    ${radio(1, 'O jakou budovu jde?', 'typ', [['bd', 'Bytový dům'], ['rd', 'Rodinný dům'], ['admin', 'Kanceláře, obchod, hotel'], ['verejna', 'Škola, úřad, veřejná budova'], ['prumysl', 'Výroba, sklad, areál']])}
    ${radio(2, 'Jmenovitý výkon zdroje tepla', 'teplo', [['do70', 'do 70 kW'], ['nad70', 'nad 70 kW'], ['czt', 'dálkové teplo (předávací stanice)'], ['nevim', 'nevím']], 'U více kotlů v jedné kotelně se výkony sčítají; u předávací stanice rozhoduje její výkon.')}
    ${radio(3, 'Klimatizace (chlazení)', 'klima', [['zadna', 'žádná'], ['do70', 'do 70 kW'], ['nad70', 'nad 70 kW'], ['nevim', 'nevím']])}
    <fieldset class="ck-q" data-q="situace">
      <legend><span class="ck-n">4</span><span>Co se s budovou chystá?</span></legend>
      ${check('situace', [['prodej', 'prodej budovy nebo jednotky'], ['najem', 'pronájem'], ['stavba', 'nová stavba'], ['zmena', 'větší rekonstrukce obálky (nad 25 %)'], ['dotace', 'projekt úspor s dotací'], ['nic', 'nic z toho']])}
    </fieldset>
    ${radio(5, 'Kdo budovu užívá nebo vlastní?', 'vlastnik', [['ovm', 'úřad / orgán veřejné moci'], ['verejny', 'obec, kraj, příspěvková organizace'], ['firma', 'podnikatel'], ['svj', 'SVJ, družstvo, soukromý vlastník']])}
    <div class="ck-more" data-show-for="ovm verejny firma" hidden>
      ${radio(6, 'Roční konečná spotřeba energie organizace (průměr 3 let)', 'spotreba', [['do200', 'pod 200 MWh'], ['do500', '200–500 MWh'], ['do2778', '500–2 778 MWh'], ['do23611', '2 778–23 611 MWh'], ['nad', 'nad 23 611 MWh'], ['nevim', 'nevím']], 'Počítá se celá organizace, u podnikatele včetně skupiny (podíl alespoň 50 %), ne jedna budova.')}
      <label class="opt opt-check ck-area" data-show-for="ovm" hidden><input type="checkbox" name="plocha250" value="ano"><span>Energeticky vztažná plocha budovy je nad 250 m²</span></label>
    </div>
    <div class="ck-result" role="status" aria-live="polite"><p class="ck-empty">Odpovězte na otázky – přehled povinností se sestaví průběžně.</p></div>
  </form>
  <div class="nojs-only">${obligationsTable()}</div>
</div>`;
}

// ---------- obecná stránka služby ----------
/**
 * o: path,title,description,crumbs[],kick,h1,lead,image,heroCta,heroMeta,glance[{k,v}],content,after,faq,service{},form{},relatedLinks
 */
export function servicePage(o) {
  const body = `
${pageHero({ kick: o.kick, h1: o.h1, lead: o.lead, image: o.image, cta: o.heroCta || [{ href: '#poptavka', label: CTA, primary: true }], meta: o.heroMeta })}
${o.glance ? `<section class="glance" aria-label="Ve zkratce"><div class="wrap"><dl class="glance-list">${o.glance.map((g) => `<div class="reveal"><dt>${esc(g.k)}</dt><dd>${g.v}</dd></div>`).join('')}</dl></div></section>` : ''}
<article class="article-main">
${o.content}
</article>
${o.after || ''}
${o.faq?.length ? faqSection(o.faq) : ''}
${formSection({ segment: o.path, ...(o.form || {}) })}
${o.relatedLinks ? related(o.relatedLinks) : ''}`;
  return {
    path: o.path,
    title: o.title,
    description: o.description,
    crumbs: o.crumbs,
    ogImage: o.ogImage,
    schema: [...(o.service ? [serviceSchema({ url: o.path, ...o.service })] : []), ...(o.faq?.length ? [faqSchema(o.faq)] : []), ...(o.schema || [])],
    body,
  };
}

/** Textový blok se sticky nadpisem vlevo */
export const block = ({ kick, title, html, id = '', alt = false, wide = false }) => `<section class="section${alt ? ' section-alt' : ''}"${id ? ` id="${id}"` : ''}>
  <div class="wrap ${wide ? '' : 'split-head'}">
    ${sectionHead({ kick, title })}
    <div class="prose">${html}</div>
  </div>
</section>`;
