import { site, company, contact, tracking, nav, services, segments, sisterSites, FORM_HREF, CTA_LABEL } from '../config.mjs';
import { lynx } from './lynx.mjs';
import { socialLinks } from './social.mjs';
import { esc, abs, tel, mail, addrText, ldScript, orgSchema, personSchemas, websiteSchema, breadcrumbSchema, fmtDate } from '../lib/html.mjs';

let CSS = '';
let JS_URL = '/assets/site.js';
let FONTS = {};
let MOTION_URL = '';
export const setAssets = ({ css, jsUrl, fontUrls = {}, motionUrl = '' }) => {
  MOTION_URL = motionUrl;
  CSS = css;
  JS_URL = jsUrl;
  FONTS = fontUrls;
};

const isActive = (href, path) => href !== '/' && path.startsWith(href);
const cur = (href, path) => (href === path ? ' aria-current="page"' : '');

function megaPanel(path) {
  const active = services.some((s) => s.sub.some((x) => isActive(x.path, path))) || path.startsWith('/energeticky-posudek/');
  return `<li class="nav-item has-sub has-mega">
  <details class="nav-sub nav-mega">
    <summary${active ? ' class="is-active"' : ''}>Služby</summary>
    <div class="mega">
      <div class="mega-in">
        <ul class="mega-cols" role="list">
          ${services
            .map(
              (s) => `<li class="mega-col">
            <a class="mega-head" href="${s.path}"${cur(s.path, path)}><span class="mega-n">${s.n}</span><strong>${esc(s.label)}</strong><span>${esc(s.desc)}</span></a>
            ${s.sub.length > 1 ? `<ul class="mega-sub" role="list">${s.sub.filter((x) => x.path !== s.path).map((x) => `<li><a href="${x.path}"${cur(x.path, path)}>${esc(x.label)}<small>${esc(x.desc)}</small></a></li>`).join('')}</ul>` : ''}
          </li>`,
            )
            .join('\n          ')}
        </ul>
        <div class="mega-aside">
          <p class="mega-aside-k">Nevíte, co se na vás vztahuje?</p>
          <p>Pět otázek o budově a uvidíte přehled zákonných povinností.</p>
          <a class="mega-aside-link" href="/povinnosti-budov/">Ověřit povinnosti budovy</a>
          <a class="mega-aside-link" href="/energeticka-pece-o-budovy/">Energetická péče o budovy</a>
        </div>
      </div>
    </div>
  </details>
</li>`;
}

function navItems(path) {
  return nav.main
    .map((item) => {
      if (item.mega) return megaPanel(path);
      if (item.children) {
        const active = item.children.some((c) => isActive(c.href, path));
        return `<li class="nav-item has-sub">
  <details class="nav-sub">
    <summary${active ? ' class="is-active"' : ''}>${esc(item.label)}</summary>
    <ul class="drop" role="list">${item.children.map((c) => `<li><a href="${c.href}"${cur(c.href, path)}><strong>${esc(c.label)}</strong>${c.desc ? `<span>${esc(c.desc)}</span>` : ''}</a></li>`).join('')}</ul>
  </details>
</li>`;
      }
      return `<li class="nav-item"><a href="${item.href}"${isActive(item.href, path) ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`;
    })
    .join('\n');
}

function header(path) {
  return `<a class="skip" href="#obsah">Přeskočit na obsah</a>
<header class="site-header">
  <div class="wrap header-in">
    <a class="brand" href="/" aria-label="Elerys – úvodní stránka">
      ${lynx({ stroke: 'currentColor', accent: 'currentColor', w: 30 })}
      <span class="brand-word">Elerys</span>
    </a>
    <nav class="main-nav" id="hlavni-menu" aria-label="Hlavní navigace">
      <ul class="nav-list" role="list">${navItems(path)}
        <li class="nav-item nav-mobile-only"><a href="/kontakt/"${cur('/kontakt/', path)}>Kontakt</a></li>
      </ul>
    </nav>
    <div class="header-actions">
      <a class="header-link" href="/kontakt/"${cur('/kontakt/', path)}>Kontakt</a>
      <a class="btn btn-primary btn-sm header-cta" href="${FORM_HREF}">${CTA_LABEL}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="hlavni-menu"><span class="menu-icon" aria-hidden="true"></span><span class="sr-only">Menu</span></button>
    </div>
  </div>
</header>`;
}

function breadcrumbs(crumbs) {
  if (!crumbs || crumbs.length < 2) return '';
  return `<nav class="breadcrumbs" aria-label="Drobečková navigace"><ol class="wrap">${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? `<li><span aria-current="page">${esc(c.name)}</span></li>` : `<li><a href="${c.path}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
}

function footer() {
  const contactLine = [tel('', contact.phone), mail()].filter(Boolean).join(' · ');
  return `<footer class="site-footer">
  <div class="wrap footer-top">
    <p class="footer-claim">Povinnosti budov<br><em>v jednom plánu.</em></p>
    <div class="footer-cta"><a class="btn btn-primary" href="${FORM_HREF}">${CTA_LABEL}</a><a class="btn btn-ghost-light" href="/povinnosti-budov/">Ověřit povinnosti</a></div>
  </div>
  <div class="wrap footer-grid">
    <div class="footer-nap">
      <a class="footer-brand" href="/">${lynx({ stroke: 'currentColor', accent: 'currentColor', w: 30 })}<span>Elerys</span></a>
      <p>${esc(company.brandNote)}</p>
      <address>
        <strong>${esc(company.legalName)}</strong><br>
        ${esc(addrText())}<br>
        IČO ${company.ico} · DIČ ${company.dic}<br>
        ${esc(company.registryShort)}${contactLine ? `<br>${contactLine}` : ''}
      </address>
      ${socialLinks()}
    </div>
    <div>
      <h2 class="footer-h">Služby</h2>
      <ul class="footer-links" role="list">
        ${services.map((s) => `<li><a href="${s.path}">${esc(s.short)}</a></li>`).join('')}
        <li><a href="/energeticky-posudek/">Energetický posudek</a></li>
        <li><a href="/energeticka-pece-o-budovy/">Energetická péče o budovy</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Pro koho</h2>
      <ul class="footer-links" role="list">
        ${segments.map((s) => `<li><a href="${s.path}">${esc(s.label)}</a></li>`).join('')}
        <li><a href="/pro-zadavatele/">Pro zadavatele VZ</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Společnost</h2>
      <ul class="footer-links" role="list">
        <li><a href="/o-nas/">O nás</a></li>
        <li><a href="/tym/">Tým</a></li>
        <li><a href="/kariera/">Kariéra</a></li>
        <li><a href="/reference/">Reference</a></li>
        <li><a href="/znalosti/">Znalosti</a></li>
        <li><a href="/povinnosti-budov/">Povinnosti budov</a></li>
        <li><a href="/kontakt/">Kontakt</a></li>
      </ul>
    </div>
    <div class="footer-sisters">
      <h2 class="footer-h">Naše specializované weby</h2>
      <ul class="footer-links" role="list">
        ${Object.values(sisterSites).map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener"><strong>${esc(s.label)}</strong><span>${esc(s.title)}</span></a></li>`).join('')}
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>© ${new Date(site.updated).getFullYear()} ${esc(company.legalName)} · Fakta o povinnostech ověřena ${fmtDate(site.updated)}</p>
    <p><a href="/ochrana-osobnich-udaju/">Ochrana osobních údajů</a> · <a href="/cookies/">Cookies</a> · <button type="button" class="linklike" data-cookie-settings>Nastavení cookies</button></p>
  </div>
</footer>`;
}

const stickyBar = () => `<div class="sticky-cta" aria-label="Rychlá poptávka">
  <a href="/povinnosti-budov/" class="sticky-alt">Povinnosti</a>
  <a href="${FORM_HREF}" class="sticky-order">${CTA_LABEL}</a>
</div>`;

const cookieBar = () => `<div class="cookie-bar" id="cookie-bar" role="dialog" aria-modal="false" aria-labelledby="cookie-title" hidden>
  <div class="cookie-in">
    <p id="cookie-title" class="cookie-title">Cookies</p>
    <p class="cookie-text">Web používá nezbytné cookies. Analytické a reklamní jen s vaším souhlasem. <a href="/cookies/">Více</a></p>
    <form class="cookie-prefs" hidden>
      <label><input type="checkbox" checked disabled> Nezbytné (vždy aktivní)</label>
      <label><input type="checkbox" name="analytics"> Analytické (návštěvnost)</label>
      <label><input type="checkbox" name="ads"> Reklamní (měření konverzí)</label>
    </form>
    <div class="cookie-actions">
      <button type="button" class="btn btn-sm btn-dark" data-consent="all">Přijmout vše</button>
      <button type="button" class="btn btn-sm btn-dark" data-consent="none">Odmítnout vše</button>
      <button type="button" class="btn btn-sm btn-outline" data-consent="custom">Nastavení</button>
    </div>
  </div>
</div>`;

function consentHead({ loadTagNow }) {
  const ids = [tracking.googleAdsId, tracking.ga4Id].filter(Boolean);
  return `<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
try{var c=JSON.parse(localStorage.getItem('el_consent'));if(c&&c.ts&&Date.now()-c.ts<31536e6){gtag('consent','update',{ad_storage:c.ads?'granted':'denied',ad_user_data:c.ads?'granted':'denied',ad_personalization:c.ads?'granted':'denied',analytics_storage:c.analytics?'granted':'denied'})}}catch(e){}
gtag('js',new Date());${ids.map((id) => `gtag('config','${id}');`).join('')}
window.MK={gtagId:'${tracking.googleAdsId}',convForm:'${tracking.conversionForm}',convPhone:'${tracking.conversionPhone}',convFormValue:${tracking.conversionFormValue || 0},convPhoneValue:${tracking.conversionPhoneValue || 0},currency:'${tracking.conversionCurrency}',loadTagNow:${loadTagNow ? 'true' : 'false'},sklikSem:${JSON.stringify(tracking.sklikSemId || null)},email:${JSON.stringify(contact.email || '')},phone:${JSON.stringify(contact.phone || '')}};
document.documentElement.className='js'+(window.matchMedia&&!matchMedia('(prefers-reduced-motion: reduce)').matches?' motion':'');setTimeout(function(){if(!window.__motionReady)document.documentElement.classList.remove('motion')},3500);
</script>`;
}

const SUFFIX = ' | Elerys';
/** Jednotný suffix titulku, pokud se vejde do 60 znaků */
export const fullTitle = (t) => (t.includes('Elerys') || (t + SUFFIX).length > 60 ? t : t + SUFFIX);

/** @param {object} page {path,title,description,crumbs,body,schema,noindex,ogImage,ogType,heroDark,file} */
export function layout(page) {
  page = { ...page, title: fullTitle(page.title) };
  const canonical = abs(page.path);
  const ogImage = abs(page.ogImage || site.defaultOgImage);
  const graph = [orgSchema(), ...personSchemas(), websiteSchema(), ...(page.crumbs?.length > 1 ? [breadcrumbSchema(page.crumbs)] : []), ...(page.schema || [])];
  return `<!doctype html>
<html lang="cs" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.file ? '' : `<link rel="canonical" href="${canonical}">`}
${page.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="${site.themeColor}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${FONTS.archivo ? `<link rel="preload" href="${FONTS.archivo}" as="font" type="font/woff" crossorigin>` : ''}
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${ogImage}">
${consentHead({ loadTagNow: page.loadTagNow })}
<style>${CSS}</style>
<script src="${JS_URL}" defer></script>
${MOTION_URL ? `<script src="${MOTION_URL}" defer></script>` : ''}
${ldScript({ '@context': 'https://schema.org', '@graph': graph })}
</head>
<body class="${page.bodyClass || ''}">
${header(page.path)}
<main id="obsah">
${page.body.includes('<!--crumbs-->') ? page.body.replace('<!--crumbs-->', breadcrumbs(page.crumbs)) : breadcrumbs(page.crumbs) + page.body}
</main>
${footer()}
${stickyBar()}
${cookieBar()}
</body>
</html>
`;
}
