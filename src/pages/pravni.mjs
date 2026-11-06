import { company, privacy, tracking } from '../config.mjs';
import { esc, fmtDate, addrText } from '../lib/html.mjs';
import { pageHero, related } from '../templates/partials.mjs';

const HOME = { name: 'Úvod', path: '/' };

function gdpr() {
  const P = '/ochrana-osobnich-udaju/';
  const body = `
${pageHero({ h1: 'Ochrana osobních údajů', lead: 'Jak zpracováváme údaje, které nám pošlete přes formulář nebo e-mailem.', cta: false, meta: `<p class="updated">Platné od <time datetime="${privacy.effectiveFrom}">${fmtDate(privacy.effectiveFrom)}</time></p>`, size: 'tight' })}
<div class="section"><div class="wrap narrow prose">
  <h2>Správce</h2>
  <p>Správcem osobních údajů je <strong>${esc(company.legalName)}</strong>, IČO ${company.ico}, DIČ ${company.dic}, se sídlem ${esc(addrText())} (dále „správce“), která provozuje značku Elerys. ${esc(company.registry)}</p>
  <h2>Jaké údaje a proč</h2>
  <div class="table-wrap"><table>
    <caption>Účely a právní základ zpracování</caption>
    <thead><tr><th scope="col">Účel</th><th scope="col">Údaje a právní základ</th></tr></thead>
    <tbody>
      <tr><th scope="row">Vyřízení poptávky a příprava nabídky</th><td data-label="Údaje a právní základ">jméno, organizace, e-mail, telefon, údaje o objektech, poznámka; jednání o uzavření smlouvy na vaši žádost (čl. 6 odst. 1 písm. b) GDPR)</td></tr>
      <tr><th scope="row">Plnění zakázky a fakturace</th><td data-label="Údaje a právní základ">kontaktní a fakturační údaje, údaje o objektech; plnění smlouvy a právních povinností (čl. 6 odst. 1 písm. b) a c) GDPR)</td></tr>
      <tr><th scope="row">Připomenutí termínu další povinnosti</th><td data-label="Údaje a právní základ">kontaktní údaje a termín; oprávněný zájem správce na péči o klienty (čl. 6 odst. 1 písm. f) GDPR) – můžete kdykoli odmítnout</td></tr>
      <tr><th scope="row">Vyhodnocení reklamy a návštěvnosti</th><td data-label="Údaje a právní základ">jen pokud bude měření zapnuto a vy k němu dáte souhlas v cookie liště (čl. 6 odst. 1 písm. a) GDPR)</td></tr>
    </tbody>
  </table></div>
  <h2>Komu údaje předáváme</h2>
  <ul>
    <li><strong>Web3Forms</strong> (web3forms.com) – zpracovatel, který obsah formuláře doručí e-mailem správci; data může zpracovávat mimo EU,</li>
    <li>poskytovatel e-mailových služeb správce,</li>
    <li>specialistům týmu Elerys, kteří vaši poptávku zpracují,</li>
    <li>účetní a daňový poradce, případně orgány veřejné moci, pokud to ukládá zákon.</li>
  </ul>
  <p>Zákonem stanovené výstupy (například zprávy o kontrole systému vytápění) se zapisují do evidence ENEX vedené Ministerstvem průmyslu a obchodu.</p>
  <h2>Jak dlouho údaje uchováváme</h2>
  <ul>
    <li>poptávka, ze které nevznikla zakázka: ${esc(privacy.retentionInquiry)},</li>
    <li>klienti: ${esc(privacy.retentionClient)},</li>
    <li>souhlas s cookies: do jeho změny nebo odvolání (viz <a href="/cookies/">cookies</a>).</li>
  </ul>
  <h2>Vaše práva</h2>
  <p>Máte právo na přístup ke svým údajům, jejich opravu, výmaz, omezení zpracování a přenositelnost, právo vznést námitku proti zpracování na základě oprávněného zájmu a právo kdykoli odvolat souhlas. Ozvěte se nám přes <a href="/kontakt/">kontaktní formulář</a> nebo na adrese sídla.</p>
  <p>Stížnost můžete podat u Úřadu pro ochranu osobních údajů (www.uoou.cz).</p>
</div></div>
${related([{ href: '/cookies/', label: 'Cookies' }, { href: '/kontakt/', label: 'Kontakt' }])}`;
  return {
    path: P,
    title: 'Ochrana osobních údajů',
    description: 'Jak AMVILI s.r.o. (značka Elerys) zpracovává osobní údaje z poptávkového formuláře: účely, příjemci, doba uložení a vaše práva.',
    crumbs: [HOME, { name: 'Ochrana osobních údajů', path: P }],
    body,
  };
}

function cookies() {
  const P = '/cookies/';
  const rows = [
    ['el_consent', 'tento web (localStorage)', 'nezbytné', 'uložení vaší volby v cookie liště', '12 měsíců nebo do změny volby'],
    ['mk_attr', 'tento web (sessionStorage)', 'jen se souhlasem', 'zdroj návštěvy (UTM) pro přiložení k poptávce', 'do zavření prohlížeče'],
    ['mk_test', 'tento web (sessionStorage)', 'funkční', 'shrnutí výsledku ověření povinností pro předvyplnění poptávky', 'do zavření prohlížeče'],
    ['mk_lead', 'tento web (sessionStorage)', 'nezbytné', 'jednorázová značka odeslané poptávky', 'do zobrazení děkovné stránky'],
  ];
  if (tracking.googleAdsId) rows.push(['_gcl_au, _gcl_aw', 'Google Ads', 'reklamní', 'měření konverzí z reklam', 'až 90 dní']);
  if (tracking.ga4Id) rows.push(['_ga, _ga_*', 'Google Analytics', 'analytické', 'statistika návštěvnosti', 'až 2 roky']);
  if (tracking.sklikSemId) rows.push(['cookies Seznam.cz', 'Seznam.cz (Sklik)', 'reklamní', 'měření konverzí', 'podle Seznamu']);
  const measuring = tracking.googleAdsId || tracking.ga4Id || tracking.sklikSemId;
  const body = `
${pageHero({ h1: 'Cookies', lead: measuring ? 'Web používá nezbytné ukládání dat a – s vaším souhlasem – měření návštěvnosti a reklamy.' : 'Web teď používá jen nezbytné ukládání dat. Měřicí ani reklamní skripty se nenačítají.', cta: false, size: 'tight' })}
<div class="section"><div class="wrap narrow prose">
  <h2>Jak funguje souhlas</h2>
  <p>Při první návštěvě se zobrazí lišta s volbou. Dokud souhlas nedáte, nenačítají se žádné měřicí ani reklamní skripty. Volba platí 12 měsíců.</p>
  <p><button type="button" class="btn btn-outline" data-cookie-settings>Změnit nastavení cookies</button></p>
  <h2>Seznam</h2>
  <div class="table-wrap"><table>
    <caption>Cookies a úložiště používané na webu</caption>
    <thead><tr><th scope="col">Název</th><th scope="col">Poskytovatel</th><th scope="col">Kategorie</th><th scope="col">Účel</th><th scope="col">Doba</th></tr></thead>
    <tbody>
      ${rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td data-label="Poskytovatel">${esc(r[1])}</td><td data-label="Kategorie">${esc(r[2])}</td><td data-label="Účel">${esc(r[3])}</td><td data-label="Doba">${esc(r[4])}</td></tr>`).join('\n      ')}
    </tbody>
  </table></div>
  <p>Cookies můžete smazat nebo zablokovat v nastavení prohlížeče. Více v <a href="/ochrana-osobnich-udaju/">zásadách ochrany osobních údajů</a>.</p>
</div></div>
${related([{ href: '/ochrana-osobnich-udaju/', label: 'Ochrana osobních údajů' }, { href: '/kontakt/', label: 'Kontakt' }])}`;
  return {
    path: P,
    title: 'Cookies a nastavení souhlasu',
    description: 'Jaké cookies a úložiště web Elerys používá, k čemu slouží, jak dlouho trvají a jak změnit souhlas s měřením.',
    crumbs: [HOME, { name: 'Cookies', path: P }],
    body,
  };
}

export default [gdpr, cookies];
