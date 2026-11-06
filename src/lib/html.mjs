import { site, company, person, petr, contact, social, services } from '../config.mjs';

// ---------- základní helpery ----------
export const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const abs = (p) => (p.startsWith('http') ? p : site.url + p);
export const fmtDate = (iso) => {
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`;
};
/** telefon / e-mail Elerys jen pokud jsou v configu */
export const tel = (cls = '', label = contact.phone) =>
  contact.phone ? `<a href="${contact.phoneHref}" class="${cls}" data-track="phone">${esc(label).replace(/ /g, '&nbsp;')}</a>` : '';
export const mail = (cls = '') => (contact.email ? `<a href="mailto:${contact.email}" class="${cls}">${contact.email}</a>` : '');
export const addrText = () => {
  const a = company.address;
  return a ? `${a.street}, ${a.postalCode} ${a.locality}` : '';
};
/** Externí odkaz (nové okno) */
export const ext = (url, label, cls = '') => `<a href="${url}" target="_blank" rel="noopener"${cls ? ` class="${cls}"` : ''}>${label}</a>`;

// ---------- obrázky ----------
let manifest = {};
export const setImageManifest = (m) => (manifest = m);
export const hasImg = (name) => !!manifest[name];
export function img(name, { alt, sizes = '100vw', eager = false, cls = '', pos = '' } = {}) {
  const m = manifest[name];
  if (!m) throw new Error(`Neznámý obrázek: ${name}`);
  if (alt === undefined) throw new Error(`Chybí alt u obrázku ${name}`);
  const largest = m.variants[m.variants.length - 1];
  const fallback = m.variants.find((v) => v.w >= 800) || largest;
  const srcset = m.variants.map((v) => `${v.url} ${v.w}w`).join(', ');
  return `<img src="${fallback.url}" srcset="${srcset}" sizes="${sizes}" width="${largest.w}" height="${largest.h}" alt="${esc(alt)}"${
    eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"'
  }${cls ? ` class="${cls}"` : ''}${pos ? ` style="object-position:${pos}"` : ''}>`;
}
export const imgUrl = (name, minW = 1200) => {
  const m = manifest[name];
  if (!m) return null;
  const v = m.variants.find((x) => x.w >= minW) || m.variants[m.variants.length - 1];
  return v.url;
};

// ---------- JSON-LD ----------
export const ldScript = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
export const ID = { org: `${site.url}/#organizace`, website: `${site.url}/#web`, matej: `${site.url}/tym/#matej-kruml`, petr: `${site.url}/tym/#petr-michna` };

export function orgSchema() {
  const o = {
    '@type': 'ProfessionalService',
    '@id': ID.org,
    name: site.brand,
    legalName: company.legalName,
    description: 'Energetické služby pro organizace: kontroly systémů vytápění a klimatizace, průkazy energetické náročnosti budov, energetické audity, posudky a poradenství.',
    url: site.url + '/',
    logo: abs('/logo.svg'),
    image: abs(site.defaultOgImage),
    identifier: { '@type': 'PropertyValue', propertyID: 'IČO', value: company.ico },
    vatID: company.dic,
    address: { '@type': 'PostalAddress', streetAddress: company.address.street, postalCode: company.address.postalCode, addressLocality: company.address.locality, addressCountry: 'CZ' },
    areaServed: { '@type': 'Country', name: 'Česká republika' },
    employee: [{ '@id': ID.matej }, { '@id': ID.petr }],
    knowsAbout: services.map((s) => s.label),
    sameAs: [person.site.url, 'https://nejpenb.vercel.app', ...Object.values(social).filter(Boolean)],
  };
  if (contact.phoneHref) o.telephone = contact.phoneHref.replace('tel:', '');
  if (contact.email) o.email = contact.email;
  return o;
}

export function personSchemas() {
  const m = {
    '@type': 'Person', '@id': ID.matej, name: person.name, givenName: person.givenName, familyName: person.familyName, honorificPrefix: 'Ing.',
    jobTitle: person.jobTitle, alumniOf: { '@type': 'CollegeOrUniversity', name: person.alumniOf },
    memberOf: { '@type': 'Organization', name: person.memberOf.name, url: person.memberOf.url },
    worksFor: { '@id': ID.org }, url: abs('/tym/'), sameAs: [person.linkedin, person.site.url],
  };
  const mu = imgUrl(person.photo, 640);
  if (mu) m.image = abs(mu);
  const p = { '@type': 'Person', '@id': ID.petr, name: petr.name, honorificPrefix: 'Ing.', jobTitle: petr.jobTitle, worksFor: { '@id': ID.org }, url: abs('/tym/'), sameAs: [petr.site.url] };
  const pu = imgUrl(petr.photo, 400);
  if (pu) p.image = abs(pu);
  return [m, p];
}

export function websiteSchema() {
  return { '@type': 'WebSite', '@id': ID.website, url: site.url + '/', name: site.name, inLanguage: 'cs-CZ', publisher: { '@id': ID.org } };
}

/** Service. opts: { url, name, description, serviceType, audience, provider } */
export function serviceSchema(opts = {}) {
  const url = abs(opts.url || '/');
  const o = {
    '@type': 'Service', '@id': url + '#sluzba', name: opts.name, serviceType: opts.serviceType || opts.name,
    description: opts.description, provider: { '@id': ID.org }, areaServed: { '@type': 'Country', name: 'Česká republika' }, url,
  };
  if (opts.audience) o.audience = { '@type': 'Audience', audienceType: opts.audience };
  return o;
}

export function breadcrumbSchema(crumbs) {
  return { '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })) };
}

export function faqSchema(items) {
  const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  return { '@type': 'FAQPage', mainEntity: items.map((q) => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: strip(q.a) } })) };
}

export function articleSchema({ url, headline, description, date }) {
  return {
    '@type': 'Article', headline, description, inLanguage: 'cs-CZ', mainEntityOfPage: abs(url), datePublished: date, dateModified: date,
    author: { '@id': ID.org }, publisher: { '@id': ID.org }, image: abs(site.defaultOgImage),
  };
}
