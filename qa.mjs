// QA v prohlížeči: node qa.mjs [base]  (server: node serve.mjs 4175)
// Všechny stránky na 1280 a 390 px: chyby JS, vodorovné přetečení; mega menu, přepnutí hlavičky,
// validace formuláře, ověření povinností; screenshoty do screens/.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = createRequire('/opt/npm-tools/node_modules/')('playwright'); }
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.argv[2] || 'http://localhost:4175';
const SHOTS = path.join(ROOT, 'screens');
fs.mkdirSync(SHOTS, { recursive: true });
const sm = fs.readFileSync(path.join(ROOT, 'dist/sitemap.xml'), 'utf8');
const paths = [...sm.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]).concat(['/dekujeme/', '/neexistuje/']);
const problems = [];
const bad = (m) => { problems.push(m); console.log('  ✗ ' + m); };

const browser = await playwright.chromium.launch();
for (const vw of [{ w: 1280, h: 860, tag: 'desktop' }, { w: 390, h: 844, tag: 'mobile' }]) {
  const ctx = await browser.newContext({ viewport: { width: vw.w, height: vw.h }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  // cookie lišta pryč (souhlas „odmítnout“), aby nezakrývala screenshoty
  await ctx.addInitScript(() => { try { localStorage.setItem('el_consent', JSON.stringify({ ads: false, analytics: false, ts: Date.now() })); } catch (e) {} });
  const page = await ctx.newPage();
  let errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(m.text()); });
  for (const p of paths) {
    errs = [];
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(150);
    const ov = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const over = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.right > w + 1 && getComputedStyle(el).position !== 'fixed'; }).slice(0, 3).map((el) => el.tagName + '.' + el.className);
      return { sw: document.documentElement.scrollWidth, w, over };
    });
    if (ov.sw > ov.w + 1) bad(`${vw.tag} ${p}: vodorovné přetečení ${ov.sw} > ${ov.w} (${ov.over.join(', ')})`);
    if (errs.length) bad(`${vw.tag} ${p}: chyby JS: ${errs.join(' | ')}`);
  }

  // úvod – screenshot celé stránky (postupné rolování kvůli odhalovacím animacím)
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(1600);
  const header0 = await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-light'));
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 170)); } });
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('#sluzby').offsetTop + 200, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const header1 = await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-light'));
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('#pro-koho').offsetTop + 300, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const header2 = await page.evaluate(() => document.querySelector('.site-header').classList.contains('is-light'));
  if (header0 || !header1 || header2) bad(`${vw.tag}: přepínání hlavičky světlá/tmavá nefunguje (${header0}/${header1}/${header2})`);
  else console.log(`  ✓ ${vw.tag}: hlavička tmavá nad úvodem, světlá nad obsahem, tmavá nad tmavou sekcí`);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(1300);
  await page.screenshot({ path: path.join(SHOTS, `home-${vw.tag}.png`), fullPage: true });

  // menu
  if (vw.tag === 'desktop') {
    await page.hover('.has-mega > details > summary');
    await page.waitForTimeout(400);
    const open = await page.evaluate(() => document.querySelector('.nav-mega').open && document.querySelector('.mega').getBoundingClientRect().height > 200);
    if (!open) bad('desktop: mega menu se neotevřelo'); else console.log('  ✓ desktop: mega menu');
    await page.screenshot({ path: path.join(SHOTS, 'mega-menu-desktop.png') });
    await page.mouse.move(640, 700);
    await page.waitForTimeout(400);
  } else {
    await page.click('.menu-toggle');
    await page.waitForTimeout(200);
    await page.click('.has-mega > details > summary');
    await page.waitForTimeout(200);
    const ok = await page.evaluate(() => document.querySelector('.main-nav').classList.contains('is-open') && document.querySelector('.nav-mega').open);
    if (!ok) bad('mobile: menu / služby se neotevřely'); else console.log('  ✓ mobile: menu a podnabídka Služby');
    await page.screenshot({ path: path.join(SHOTS, 'menu-mobile.png') });
    await page.click('.menu-toggle');
  }

  // validace formuláře
  await page.goto(BASE + '/kontakt/', { waitUntil: 'load' });
  await page.click('#poptavka form.lead-form button[type="submit"]');
  await page.waitForTimeout(200);
  const v = await page.evaluate(() => ({ errs: document.querySelectorAll('#poptavka .field-error:not([hidden])').length, status: document.querySelector('#poptavka .form-status').textContent, focus: document.activeElement && document.activeElement.name }));
  if (v.errs < 3 || !/Zkontrolujte/.test(v.status)) bad(`${vw.tag}: validace formuláře (${JSON.stringify(v)})`); else console.log(`  ✓ ${vw.tag}: validace formuláře (${v.errs} chyby, fokus na ${v.focus})`);

  // ověření povinností
  await page.goto(BASE + '/povinnosti-budov/', { waitUntil: 'load' });
  await page.waitForTimeout(600);
  for (const sel of ['input[name="typ"][value="verejna"]', 'input[name="teplo"][value="nad70"]', 'input[name="klima"][value="nevim"]', 'input[name="situace"][value="zmena"]', 'input[name="vlastnik"][value="verejny"]']) await page.click(`#checker label:has(> ${sel})`);
  await page.click(`#checker label:has(> input[name="spotreba"][value="do2778"])`);
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => [...document.querySelectorAll('#checker .ck-item')].map((x) => x.className.replace('ck-item ', '') + ':' + x.querySelector('h3 span').textContent));
  const expect = ['is-yes:Kontrola systému vytápění', 'is-yes:Průkaz energetické náročnosti (PENB)', 'is-yes:Energetický audit / systém hospodaření s energií', 'is-maybe:Kontrola klimatizačního systému'];
  if (!expect.every((e) => r.includes(e))) bad(`${vw.tag}: ověření povinností – nečekaný výsledek ${JSON.stringify(r)}`); else console.log(`  ✓ ${vw.tag}: ověření povinností (${r.length} položky)`);
  await page.evaluate(() => document.querySelector('#checker .ck-result').scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(500);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 170)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
  await page.waitForTimeout(1300);
  if (vw.tag === 'desktop') await page.screenshot({ path: path.join(SHOTS, 'povinnosti-budov-desktop.png'), fullPage: true });
  else await page.screenshot({ path: path.join(SHOTS, 'povinnosti-budov-mobile.png'), fullPage: true });

  // collapsible ověření na úvodu
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.click('.collapse-btn');
  await page.waitForTimeout(700);
  const h = await page.evaluate(() => document.querySelector('.collapse-body').getBoundingClientRect().height);
  if (h < 300) bad(`${vw.tag}: rozbalení ověření na úvodu (${h}px)`); else console.log(`  ✓ ${vw.tag}: rozbalovací ověření na úvodu`);

  if (vw.tag === 'desktop') {
    for (const [p, name] of [['/kontrola-vytapeni/', 'kontrola-vytapeni-desktop'], ['/pro-zadavatele/', 'pro-zadavatele-desktop'], ['/tym/', 'tym-desktop']]) {
      await page.goto(BASE + p, { waitUntil: 'load' });
      await page.waitForTimeout(1200);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 350) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 170)); } window.scrollTo({ top: 0, behavior: 'instant' }); });
      await page.waitForTimeout(1300);
      await page.screenshot({ path: path.join(SHOTS, `${name}.png`), fullPage: true });
    }
  }
  await ctx.close();
}
await browser.close();
console.log(problems.length ? `\nQA: ${problems.length} problémů` : `\nQA ✓ ${paths.length} stránek × 2 šířky bez chyb`);
process.exit(problems.length ? 1 : 0);
