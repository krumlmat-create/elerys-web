import fs from 'node:fs';
import { company, person, petr, facts, references, housingCities, housingNote, petrWorks, quoteTime, FORM_HREF } from '../config.mjs';
import { esc, img, hasImg, ext } from '../lib/html.mjs';
import { I, CTA, block, sectionHead, servicePage, sisterBlock, refCards, reportMock, penbContact, updatedLine, obligationsTable } from '../templates/partials.mjs';

const HOME = { name: 'Úvod', path: '/' };
const fileExists = (f) => fs.existsSync(new URL(`../assets/files/${f}`, import.meta.url));
const exceptionsList = () => `<ul>${facts.exceptions.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>`;
const cards = (items) => `<ul class="mini-cards" role="list">${items.map((x) => `<li class="reveal"><h3>${x.t}</h3><p>${x.d}</p>${x.href ? `<a class="mini-go" href="${x.href}">${esc(x.l || 'Více')} ${I.arrow}</a>` : ''}</li>`).join('')}</ul>`;
const subNav = (items) => `<nav class="subnav" aria-label="Podstránky služby"><div class="wrap"><ul role="list">${items.map((x) => `<li><a href="${x.path}">${esc(x.label)}</a></li>`).join('')}</ul></div></nav>`;
const NEUTRAL = 'Elerys zajišťuje';

// ============================================================ KONTROLA VYTÁPĚNÍ – hub
function vytapeni() {
  const P = '/kontrola-vytapeni/';
  const mpoFile = 'rozhodnuti-mpo-opravneni-amvili-2238.pdf';
  return servicePage({
    path: P,
    title: 'Kontrola vytápění pro správce, obce a firmy',
    description: 'Kontroly systémů vytápění nad 70 kW pro organizace s více budovami: harmonogram, zprávy s doporučeními, zápis do ENEX. Oprávnění MPO 2202 a 2238.',
    crumbs: [HOME, { name: 'Kontrola vytápění', path: P }],
    kick: 'Služba 01 · Kontrola systémů vytápění',
    h1: 'Kontroly vytápění pro organizace s více budovami',
    lead: `Zdroje tepla ${facts.heating.threshold} musí projít pravidelnou kontrolou podle ${facts.heating.decreeGen} Pro správce, obce a firmy ji plánujeme po celých portfoliích – s jedním harmonogramem a srozumitelnými doporučeními.`,
    image: { name: 'praha-rozdelovac', pos: '50% 50%' },
    ogImage: '/img/og-vytapeni.jpg',
    heroCta: [{ href: '#poptavka', label: CTA, primary: true }, { href: '#opravneni', label: 'Oprávnění MPO' }],
    glance: [
      { k: 'Koho se týká', v: `zdroje tepla ${facts.heating.threshold}` },
      { k: 'Jak často', v: facts.heating.interval },
      { k: 'Nový systém', v: facts.heating.newSystem },
      { k: 'Výstup', v: 'zpráva s evidenčním číslem z ENEX' },
    ],
    service: { name: 'Kontrola systémů vytápění pro organizace', serviceType: 'Kontrola provozovaného systému vytápění', description: 'Kontroly systémů vytápění nad 70 kW podle § 6a zákona č. 406/2000 Sb. a vyhlášky č. 38/2022 Sb. pro správce, obce, školy a firmy.', audience: 'správci nemovitostí, SVJ, obce, školy, firmy' },
    content: `
${subNav([{ path: '/kontrola-vytapeni/spravci-portfolia/', label: 'Pro správce portfolia' }, { path: '/kontrola-vytapeni/obce-a-skoly/', label: 'Pro obce a školy' }, { path: '/povinnosti-budov/', label: 'Ověřit povinnost' }])}
${block({ kick: 'Povinnost', title: 'Co ukládá zákon', html: `
  <p>Podle ${esc(facts.heating.paragraph)} musí vlastník budovy, společenství vlastníků jednotek nebo správce zajistit pravidelnou kontrolu provozovaného systému vytápění se jmenovitým výkonem ${facts.heating.threshold}. Podrobnosti stanoví ${esc(facts.heating.decree)}, účinná od 1. 3. 2022.</p>
  <p>Kontrola se opakuje ${facts.heating.interval}. Nově uvedený systém musí projít první kontrolou ${facts.heating.newSystem}. Výsledkem je písemná zpráva s evidenčním číslem z evidence ministerstva.</p>
  <p>Povinnost se nevztahuje na:</p>${exceptionsList()}
  <p>Zda se výjimka na konkrétní budovu vztahuje, posuzujeme podle skutečného stavu – zejména u systémů automatizace a řízení.</p>` })}
${block({ kick: 'Pro organizace', title: 'Co dostanete navíc proti jednotlivé objednávce', alt: true, html: cards([
  { t: 'Soupis zdrojů tepla', d: 'Projdeme seznam budov a určíme, které systémy jsou nad 70 kW, kdy byly uvedeny do provozu a kdy jim běží lhůta.' },
  { t: 'Harmonogram po lokalitách', d: 'Objekty seskupíme podle míst a termínů, aby prohlídky proběhly v co nejméně výjezdech a bez kolizí s topnou sezonou.' },
  { t: 'Zpráva pro každý systém', d: 'Každý systém má vlastní zprávu s doporučeními. K tomu souhrnná tabulka zjištění pro celé portfolio.' },
  { t: 'Přehled dalších lhůt', d: 'Ke každému objektu dostanete datum další kontroly. Na blížící se termín vás upozorníme.' },
]) })}
<section class="section" id="opravneni">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Oprávnění', title: 'Kontroly provádíme s oprávněním MPO' })}
    <div class="prose">
      <dl class="auth">
        <div><dt>${esc(person.name)}</dt><dd>oprávnění MPO č. <strong>${person.mpoNumbers[0]}</strong> – kontrola provozovaných systémů vytápění (fyzická osoba)</dd></div>
        <div><dt>${esc(company.legalName)}</dt><dd>oprávnění MPO č. <strong>${company.mpoNumber}</strong> – kontrola provozovaných systémů vytápění (právnická osoba)</dd></div>
      </dl>
      ${fileExists(mpoFile) ? `<p><a class="file-link" href="/ke-stazeni/${mpoFile}" download>${I.doc} Rozhodnutí MPO o udělení oprávnění (PDF)</a></p>` : ''}
      <p class="small">Oprávnění se týkají výhradně kontroly systémů vytápění. Ostatní služby Elerys uvádíme bez čísel oprávnění.</p>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split-media">
    <div>
      ${sectionHead({ kick: 'Výstup', title: 'Co obsahuje zpráva' })}
      <div class="prose"><p>Zpráva hodnotí dimenzování zdroje vůči potřebě tepla, provozní parametry a nastavení regulace. Hlavní hodnotou jsou doporučení – co upravit hned, co naplánovat a co nechat být.</p><p>Typické zjištění z naší praxe: kaskáda kotlů ve škole výrazně předimenzovaná vůči skutečné potřebě tepla. Taková informace se hodí při plánování obnovy zdroje.</p></div>
    </div>
    ${reportMock()}
  </div>
</section>
<section class="section">
  <div class="wrap">
    <div class="head-row">${sectionHead({ kick: 'Reference', title: 'Vybrané kontroly' })}<a class="more" href="/reference/">Všechny reference ${I.arrow}</a></div>
    ${refCards({ ids: ['litvinov', 'mkrumlov', 'wotan'], limit: 3 })}
  </div>
</section>
<section class="section section-tight">
  <div class="wrap">
    ${sisterBlock('heating', { text: 'Podrobný průvodce kontrolou, podklady, lhůty, ukázky z kotelen a reference z bytových domů najdete na webu Ing. Matěje Krumla.' })}
  </div>
</section>`,
    faq: [
      { q: 'Jak zjistíme, jestli máme systém nad 70 kW?', a: '<p>Rozhoduje jmenovitý výkon zdroje tepla – údaj najdete na štítku kotle, v revizní zprávě nebo v projektové dokumentaci. U domu napojeného na dálkové teplo je zdrojem předávací stanice. Pokud si nejste jistí, pošlete fotky štítků a určíme to za vás.</p>' },
      { q: 'Můžeme kontroly rozložit do více let?', a: '<p>Ano, pokud to lhůty dovolí. U portfolia obvykle začínáme objekty, kterým lhůta běží nejdříve, a zbytek rozložíme tak, aby další cyklus vycházel rovnoměrně.</p>' },
      { q: 'Je kontrola vytápění totéž co revize kotle?', a: '<p>Ne. Revize a servis řeší bezpečnost a technický stav zařízení. Kontrola podle zákona o hospodaření energií posuzuje energetickou účinnost celého systému a končí doporučeními.</p>' },
      { q: 'Kdo zprávu zapíše do evidence?', a: '<p>Zprávu zapisujeme do evidence ENEX Ministerstva průmyslu a obchodu my. Vy dostanete zprávu s evidenčním číslem.</p>' },
    ],
    form: { service: 'kontrola vytápění', title: 'Poptávka kontrol vytápění' },
    relatedLinks: [
      { href: '/kontrola-vytapeni/spravci-portfolia/', label: 'Pro správce portfolia', text: 'Desítky domů v jednom plánu' },
      { href: '/kontrola-vytapeni/obce-a-skoly/', label: 'Pro obce a školy', text: 'Areály a veřejné zakázky' },
      { href: '/znalosti/soupis-zdroju-tepla/', label: 'Soupis zdrojů tepla', text: 'První krok před kontrolami' },
      { href: '/pro-zadavatele/', label: 'Pro zadavatele', text: 'Kvalifikace a reference' },
    ],
  });
}

// ============================================================ KONTROLA VYTÁPĚNÍ – správci portfolia
function vytapeniSpravci() {
  const P = '/kontrola-vytapeni/spravci-portfolia/';
  return servicePage({
    path: P,
    title: 'Kontroly vytápění pro správce portfolia domů',
    description: 'Kontroly vytápění pro správcovské firmy a družstva: soupis zdrojů, harmonogram po lokalitách, zpráva pro každé SVJ a přehled lhůt pro celé portfolio.',
    crumbs: [HOME, { name: 'Kontrola vytápění', path: '/kontrola-vytapeni/' }, { name: 'Správci portfolia', path: P }],
    kick: 'Kontrola vytápění · správci nemovitostí',
    h1: 'Kontroly vytápění pro celé portfolio domů',
    lead: 'Správcovská firma nebo družstvo má desítky kotelen a předávacích stanic s různými lhůtami. Převezmeme plánování, koordinaci přístupu i komunikaci s výbory.',
    image: { name: 'brno-stanice-celek' },
    glance: [
      { k: 'Vstup', v: 'seznam domů a zdrojů tepla' },
      { k: 'Plán', v: 'harmonogram po lokalitách' },
      { k: 'Výstup', v: 'zpráva pro každý systém + souhrn' },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Kontroly vytápění pro správce nemovitostí', serviceType: 'Kontrola provozovaného systému vytápění', description: 'Plánování a provedení kontrol systémů vytápění pro portfolia bytových domů ve správě.', audience: 'správci nemovitostí, bytová družstva' },
    content: `
${block({ kick: 'Postup', title: 'Jak přebíráme portfolio', html: `<ol class="numbered">
  <li><strong>Soupis.</strong> Z vašeho seznamu domů vytřídíme systémy nad 70 kW a doplníme rok uvedení do provozu a datum poslední kontroly.</li>
  <li><strong>Priority.</strong> Seřadíme domy podle toho, komu lhůta běží nejdříve, a navrhneme rozložení do měsíců.</li>
  <li><strong>Koordinace.</strong> Termíny prohlídek domlouváme s vaším technikem nebo přímo s výborem; přístup do kotelny stačí na jednu návštěvu.</li>
  <li><strong>Zprávy.</strong> Každé společenství dostane vlastní zprávu, vy souhrnnou tabulku zjištění a doporučení napříč domy.</li>
  <li><strong>Další cyklus.</strong> Ke každému domu evidujeme datum další kontroly a připomeneme ho.</li>
</ol>` })}
${block({ kick: 'Fakturace', title: 'Smluvně podle vaší struktury', alt: true, html: '<p>Fakturovat můžeme jednotlivým společenstvím, nebo souhrnně správci – podle toho, jak máte nastavené mandátní smlouvy. Cenu stanovíme pro celé portfolio předem a rozepíšeme ji po domech, aby šla předložit výborům.</p><p>K nabídce přidáme krátký podklad pro shromáždění vlastníků: co kontrola je, proč je povinná a co z ní dům má.</p>' })}
<section class="section">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Zkušenost', title: 'Bytové domy, kde jsme kontrolovali' })}
    <div>
      <ul class="city-list" role="list">${housingCities.map(([c, n]) => `<li><span>${esc(c)}</span><b>${esc(n)}</b></li>`).join('')}</ul>
      <p class="small">${esc(housingNote)} Počty jsou orientační (+ znamená nejméně).</p>
    </div>
  </div>
</section>
<section class="section section-tight"><div class="wrap">${sisterBlock('heating')}</div></section>`,
    faq: [
      { q: 'Musí u prohlídky být někdo z výboru?', a: '<p>Nemusí. Potřebujeme přístup do kotelny nebo k předávací stanici a ideálně kontakt na technika, který systém zná. Vše ostatní domluvíme se správcem.</p>' },
      { q: 'Co když dům nemá žádnou dokumentaci?', a: '<p>Kontrolu lze udělat i tak – údaje zjistíme na místě ze štítků a měřením. Ve zprávě pak uvedeme, které podklady by bylo dobré doplnit.</p>' },
      { q: 'Lze kontrolu spojit s průkazem energetické náročnosti?', a: '<p>Ano. Pokud dům průkaz potřebuje, podklady z prohlídky využijeme i pro něj. Viz <a href="/penb/bytove-domy-a-verejne-budovy/">PENB pro bytové domy</a>.</p>' },
    ],
    form: { service: 'kontrola vytápění', org: 'správce nemovitostí', title: 'Pošlete seznam domů' },
    relatedLinks: [
      { href: '/pro-koho/spravci-nemovitosti/', label: 'Služby pro správce', text: 'Všechny povinnosti portfolia' },
      { href: '/energeticka-pece-o-budovy/', label: 'Energetická péče o budovy', text: 'Víceletý plán' },
      { href: '/znalosti/soupis-zdroju-tepla/', label: 'Soupis zdrojů tepla', text: 'Jak ho připravit' },
    ],
  });
}

// ============================================================ KONTROLA VYTÁPĚNÍ – obce a školy
function vytapeniObce() {
  const P = '/kontrola-vytapeni/obce-a-skoly/';
  return servicePage({
    path: P,
    title: 'Kontroly vytápění pro obce a školy',
    description: 'Kontroly vytápění pro obce, školy a příspěvkové organizace: celé areály, předávací stanice, podklady pro zakázku malého rozsahu. Reference z měst a škol.',
    crumbs: [HOME, { name: 'Kontrola vytápění', path: '/kontrola-vytapeni/' }, { name: 'Obce a školy', path: P }],
    kick: 'Kontrola vytápění · veřejný sektor',
    h1: 'Kontroly vytápění pro obce, školy a areály',
    lead: 'Radnice, škola, sportovní hala i hasičská zbrojnice – každá s jiným zdrojem tepla a jiným uživatelem. Pomůžeme zadání sestavit a provedeme kontroly všech objektů v jedné zakázce.',
    image: { name: 'vysoke-skola', pos: '50% 40%' },
    glance: [
      { k: 'Typické objekty', v: 'školy, úřady, sportoviště' },
      { k: 'Zdroje', v: 'plynové kotelny, kaskády, CZT' },
      { k: 'Zadání', v: 'podklady pro VZ malého rozsahu' },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Kontroly vytápění pro obce a školy', serviceType: 'Kontrola provozovaného systému vytápění', description: 'Kontroly systémů vytápění pro obce, školy a příspěvkové organizace.', audience: 'obce, školy, příspěvkové organizace' },
    content: `
${block({ kick: 'Kdo objednává', title: 'Zřizovatel, nebo škola?', html: '<p>Povinnost má vlastník budovy, případně její správce. U škol a dalších příspěvkových organizací to bývá obec nebo kraj jako vlastník, ale kontrolu často objednává sama organizace, která budovu spravuje. Doporučujeme si to před zadáním vyjasnit – podle toho se liší i fakturace.</p><p>Pokud obec spravuje více objektů, vyplatí se zadat kontroly souhrnně: jedna zakázka, jeden harmonogram a jednotný formát výstupů.</p>' })}
${block({ kick: 'Areály', title: 'Více budov, více systémů', alt: true, html: cards([
  { t: 'Školní areál', d: 'Hlavní budova, tělocvična, dílny a domov mládeže mívají samostatné kotelny. Každý systém nad 70 kW má vlastní zprávu.' },
  { t: 'Dálkové teplo', d: 'U objektů napojených na CZT kontrolujeme předávací stanici a navazující otopnou soustavu.' },
  { t: 'Sportoviště a provozy', d: 'Zimní stadiony, haly či hasičské stanice mají specifický provoz – hodnotíme ho podle skutečného využití.' },
]) })}
<section class="section">
  <div class="wrap">
    <div class="head-row">${sectionHead({ kick: 'Reference', title: 'Obce a školy' })}<a class="more" href="/reference/">Všechny reference ${I.arrow}</a></div>
    ${refCards({ ids: ['litvinov', 'vysoke', 'hustopece'], limit: 3 })}
  </div>
</section>
<section class="section section-tight"><div class="wrap">${sisterBlock('heating')}</div></section>`,
    faq: [
      { q: 'Musí obec kontroly soutěžit?', a: '<p>Záleží na předpokládané hodnotě a vnitřní směrnici obce. U zakázek malého rozsahu obvykle stačí poptávka několika dodavatelů. Podklady pro nabídku – identifikaci, oprávnění a reference – najdete na stránce <a href="/pro-zadavatele/">Pro zadavatele</a>.</p>' },
      { q: 'Můžete kontroly provést mimo provoz školy?', a: '<p>Ano, termín prohlídky přizpůsobíme provozu. Systém ale musí být v provozu, aby šly ověřit provozní parametry – proto kontroly plánujeme ideálně v topné sezoně.</p>' },
      { q: 'Co obec se zprávou dělá dál?', a: '<p>Zpráva slouží jako doklad o splnění povinnosti a jako podklad pro plánování investic. Doporučení se hodí do rozpočtového výhledu i do <a href="/energeticky-audit/obce/">energetického auditu</a>, pokud ho obec potřebuje.</p>' },
    ],
    form: { service: 'kontrola vytápění', org: 'obec / škola / veřejná instituce', title: 'Poptávka pro obec nebo školu' },
    relatedLinks: [
      { href: '/pro-koho/obce-a-skoly/', label: 'Služby pro obce a školy' },
      { href: '/pro-zadavatele/', label: 'Pro zadavatele', text: 'Kvalifikace a reference' },
      { href: '/energeticky-audit/obce/', label: 'Energetický audit pro obce' },
    ],
  });
}

// ============================================================ KONTROLA KLIMATIZACE
function klimatizace() {
  const P = '/kontrola-klimatizace/';
  return servicePage({
    path: P,
    title: 'Kontrola klimatizace nad 70 kW pro budovy',
    description: 'Kontrola klimatizačních systémů nad 70 kW podle vyhlášky č. 284/2022 Sb.: kdy je povinná, jak často a co obsahuje zpráva. Nabídka do 1 pracovního dne.',
    crumbs: [HOME, { name: 'Kontrola klimatizace', path: P }],
    kick: 'Služba 02 · Kontrola klimatizačních systémů',
    h1: 'Kontrola klimatizačních systémů',
    lead: `Klimatizace a kombinované systémy klimatizace a větrání ${facts.ac.threshold} podléhají pravidelné kontrole stejně jako vytápění. Týká se to hlavně kanceláří, obchodů, hotelů, serveroven a výroby.`,
    image: { name: 'brno-chodba', pos: '50% 50%' },
    glance: [
      { k: 'Koho se týká', v: `systémy ${facts.ac.threshold}` },
      { k: 'Jak často', v: facts.ac.interval },
      { k: 'Nový systém', v: facts.ac.newSystem },
      { k: 'Předpis', v: facts.ac.decree },
    ],
    service: { name: 'Kontrola klimatizačních systémů', serviceType: 'Kontrola provozovaného systému klimatizace', description: 'Kontrola klimatizačních systémů a kombinovaných systémů klimatizace a větrání nad 70 kW podle vyhlášky č. 284/2022 Sb.', audience: 'firmy, správci komerčních budov, veřejné instituce' },
    content: `
${block({ kick: 'Povinnost', title: 'Co říká předpis', html: `
  <p>Povinnost kontroly stanoví § 6a zákona č. 406/2000 Sb. pro provozované systémy klimatizace a kombinované systémy klimatizace a větrání se jmenovitým výkonem ${facts.ac.threshold}. Podrobnosti upravuje ${esc(facts.ac.decree)}, účinná od ${facts.ac.from}; nahradila dřívější ${esc(facts.ac.replaced)}</p>
  <p>Nový systém se kontroluje ${facts.ac.newSystem}, provozovaný systém ${facts.ac.interval}. Kontrolu provádí energetický specialista a výsledkem je písemná zpráva.</p>
  <p>Výjimky jsou stejné jako u vytápění:</p>${exceptionsList()}` })}
${block({ kick: 'Výstup', title: 'Co obsahuje zpráva', alt: true, html: `<p>Zpráva podle § 7 vyhlášky obsahuje identifikaci budovy a systému, hodnocení dimenzování zdroje chladu, provozních parametrů a nastavení regulace, závěry a doporučení pro efektivnější provoz. V příloze jsou použité podklady, plán kontroly, fotodokumentace a výpočty.</p>
  <p>Pokud budova má řídicí systém, který data o provozu sbírá a vyhodnocuje, hodnotí se účinnost z naměřených dat – kontrola je pak rychlejší a přesnější.</p>` })}
${block({ kick: 'S kým', title: `${NEUTRAL} kontroly klimatizace`, html: `<p>Kontrolu klimatizace zpracuje energetický specialista. U budov, kde zároveň běží lhůta pro kontrolu vytápění, obě kontroly naplánujeme na stejnou návštěvu a sjednotíme podklady.</p><p>Nabídku s rozsahem, termínem a cenou pošleme ${quoteTime}.</p>` })}`,
    faq: [
      { q: 'Jak poznáme, že máme klimatizaci nad 70 kW?', a: '<p>Rozhoduje jmenovitý výkon systému uvedený v dokumentaci nebo na štítcích jednotek. U budov s více jednotkami posoudíme, zda tvoří jeden systém. Pošlete nám typové štítky nebo projekt a určíme to.</p>' },
      { q: 'Je kontrola klimatizace totéž co kontrola úniku chladiva?', a: '<p>Ne. Kontroly těsnosti a servis chladicích zařízení řeší jiné předpisy. Kontrola podle zákona o hospodaření energií hodnotí energetickou účinnost systému.</p>' },
      { q: 'Lze kontrolu klimatizace spojit s kontrolou vytápění?', a: '<p>Ano, u budov s oběma systémy to doporučujeme – jedna prohlídka, jedny podklady, dvě samostatné zprávy.</p>' },
    ],
    form: { service: 'kontrola klimatizace', org: 'firma', title: 'Poptávka kontroly klimatizace' },
    relatedLinks: [
      { href: '/kontrola-vytapeni/', label: 'Kontrola vytápění' },
      { href: '/pro-koho/firmy-a-prumysl/', label: 'Pro firmy a průmysl' },
      { href: '/povinnosti-budov/', label: 'Ověřit povinnosti budovy' },
    ],
  });
}

// ============================================================ PENB – hub
function penb() {
  const P = '/penb/';
  return servicePage({
    path: P,
    title: 'PENB pro organizace, bytové a veřejné budovy',
    description: 'Průkaz energetické náročnosti pro SVJ, obce, úřady a firmy: kdy ho organizace potřebuje, platnost 10 let a spojení s dalšími službami. Ceník na nejpenb.cz.',
    crumbs: [HOME, { name: 'PENB', path: P }],
    kick: 'Služba 03 · Průkaz energetické náročnosti budovy',
    h1: 'Průkaz energetické náročnosti pro organizace',
    lead: 'Průkaz potřebuje celý bytový dům při prodeji či pronájmu, každá nová budova a budovy, které užívají úřady. Pro organizace ho zajistíme spolu s dalšími povinnostmi budovy.',
    image: { name: 'praha-fasada', pos: '50% 50%' },
    heroCta: [{ href: '#poptavka', label: CTA, primary: true }, { href: 'https://nejpenb.vercel.app/cenik/', label: 'Ceník na nejpenb.cz', ext: true }],
    glance: [
      { k: 'Platnost', v: facts.penb.validity },
      { k: 'Předpis', v: `${facts.penb.paragraph}` },
      { k: 'Veřejné budovy', v: 'úřady nad 250 m²' },
      { k: 'Ceník', v: '<a href="https://nejpenb.vercel.app/cenik/" target="_blank" rel="noopener">na nejpenb.cz</a>' },
    ],
    service: { name: 'Průkaz energetické náročnosti budovy pro organizace', serviceType: 'Průkaz energetické náročnosti budovy', description: 'Zajištění průkazu energetické náročnosti pro bytové domy, veřejné a komerční budovy.', audience: 'SVJ, bytová družstva, obce, firmy' },
    content: `
${subNav([{ path: '/penb/bytove-domy-a-verejne-budovy/', label: 'Bytové domy a veřejné budovy' }, { path: '/znalosti/penb-ve-verejnych-budovach/', label: 'Článek: PENB ve veřejných budovách' }])}
${block({ kick: 'Kdy', title: 'Kdy organizace průkaz potřebuje', html: `<ul>
  <li><strong>Nová budova a větší změna</strong> – stavebník nebo vlastník zajistí průkaz u nové stavby a při ${esc(facts.penb.majorChange)}.</li>
  <li><strong>Budovy úřadů</strong> – u budovy užívané orgánem veřejné moci s energeticky vztažnou plochou nad 250 m² (od 1. 7. 2015).</li>
  <li><strong>Prodej a pronájem</strong> – při prodeji budovy nebo její ucelené části a při pronájmu.</li>
</ul>
<p>Průkaz platí ${facts.penb.validity}. Dřív skončí, pokud na budově proběhne větší změna nebo se změní způsob vytápění, chlazení či přípravy teplé vody.</p>
<p class="small">${esc(facts.penb.amendmentNote)}</p>` })}
${block({ kick: 'Proč s námi', title: 'Průkaz jako součást plánu', alt: true, html: `<p>Pro organizaci průkaz málokdy stojí osamoceně. Prohlídku budovy využijeme i pro kontrolu vytápění, podklady pro energetický posudek nebo renovační plán. U více budov sjednotíme formát výstupů a termíny platnosti.</p>
${penbContact()}` })}
<section class="section section-tight"><div class="wrap">${sisterBlock('penb', { text: 'Ceník, orientační kalkulačka a postup pro byty, rodinné domy i celé bytové domy najdete na našem specializovaném webu.', links: [{ url: 'https://nejpenb.vercel.app/cenik/', label: 'Ceník' }, { url: 'https://nejpenb.vercel.app/penb-bytovy-dum/', label: 'PENB pro bytový dům' }] })}</div></section>`,
    faq: [
      { q: 'Kolik průkaz stojí?', a: '<p>Ceník pro byty, rodinné domy a bytové domy je zveřejněný na <a href="https://nejpenb.vercel.app/cenik/" target="_blank" rel="noopener">nejpenb.cz</a>. U nebytových a veřejných budov pošleme nabídku do 1 pracovního dne.</p>' },
      { q: 'Platí starý průkaz po rekonstrukci?', a: '<p>Po větší změně budovy nebo po změně vytápění, chlazení či přípravy teplé vody přestává platit a je potřeba nový.</p>' },
      { q: 'Potřebuje průkaz i škola?', a: '<p>Pokud školu užívá orgán veřejné moci a energeticky vztažná plocha přesahuje 250 m², ano. Podrobněji v článku <a href="/znalosti/penb-ve-verejnych-budovach/">PENB ve veřejných budovách</a>.</p>' },
    ],
    form: { service: 'PENB', title: 'Poptávka průkazu pro organizaci' },
    relatedLinks: [
      { href: '/penb/bytove-domy-a-verejne-budovy/', label: 'PENB pro bytové domy a veřejné budovy' },
      { href: '/energeticke-poradenstvi/dotace-nzu/', label: 'Dotace NZÚ', text: 'Kdy je průkaz podmínkou' },
      { href: '/povinnosti-budov/', label: 'Ověřit povinnosti budovy' },
    ],
  });
}

function penbBd() {
  const P = '/penb/bytove-domy-a-verejne-budovy/';
  return servicePage({
    path: P,
    title: 'PENB pro bytové domy a veřejné budovy',
    description: 'Průkaz energetické náročnosti pro SVJ, družstva, obce a úřady: povinnosti vůči vlastníkům jednotek, budovy nad 250 m² a sladění s dalšími povinnostmi.',
    crumbs: [HOME, { name: 'PENB', path: '/penb/' }, { name: 'Bytové domy a veřejné budovy', path: P }],
    kick: 'PENB · SVJ, družstva, obce',
    h1: 'PENB pro bytové domy a veřejné budovy',
    lead: 'Společenství a družstva řeší průkaz kvůli vlastníkům jednotek, obce kvůli budovám úřadů a škol. V obou případech se vyplatí mít průkaz platný dřív, než ho někdo nutně potřebuje.',
    image: { name: 'pisek-budova', pos: '50% 60%' },
    glance: [
      { k: 'SVJ', v: 'průkaz domu pro vlastníky jednotek' },
      { k: 'Veřejné budovy', v: 'nad 250 m², průkaz na viditelném místě' },
      { k: 'Platnost', v: facts.penb.validity },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'PENB pro bytové domy a veřejné budovy', serviceType: 'Průkaz energetické náročnosti budovy', description: 'Průkazy energetické náročnosti pro bytové domy (SVJ, družstva) a budovy užívané orgány veřejné moci.', audience: 'SVJ, bytová družstva, obce, úřady' },
    content: `
${block({ kick: 'Bytové domy', title: 'Co musí zajistit společenství', html: '<p>Když vlastník jednotky byt prodává nebo pronajímá, může písemně požádat společenství nebo správce o průkaz celého domu. Ten mu ho musí předat do 30 dnů, pokud průkaz domu existuje, jinak do 60 dnů. Výbor tedy často řeší průkaz pod časovým tlakem.</p><p>Průkaz domu zpracovaný předem tuto situaci řeší a výbor ho může předávat opakovaně, dokud je platný. Hodí se i jako podklad pro plán oprav a pro žádost o podporu z programu Nová zelená úsporám.</p>' })}
${block({ kick: 'Veřejné budovy', title: 'Budovy úřadů, škol a obcí', alt: true, html: '<p>Budova užívaná orgánem veřejné moci s energeticky vztažnou plochou nad 250 m² musí mít průkaz. Obce a kraje tuto povinnost řeší typicky u radnic, úřadů a dalších budov, které samy užívají.</p><p>U více budov sestavíme přehled platnosti průkazů, aby obnova nepřišla pro všechny objekty najednou.</p>' })}
${block({ kick: 'Kontakt', title: 'Kdo průkazy zajišťuje', html: `<p>Průkazy pro Elerys vede ${esc(petr.name)}. Pro rychlou domluvu k průkazu se můžete obrátit přímo na něj, nebo použít formulář níže.</p>${penbContact()}` })}
<section class="section section-tight"><div class="wrap">${sisterBlock('penb')}</div></section>`,
    faq: [
      { q: 'Musí SVJ mít průkaz, i když nikdo neprodává?', a: '<p>Samotná existence domu povinnost nezakládá. Povinnost vzniká hlavně při prodeji, pronájmu, nové stavbě a větší změně budovy – a při žádosti vlastníka jednotky. Průkaz předem ale ušetří výboru čas.</p>' },
      { q: 'Lze průkaz domu použít pro prodej bytu?', a: '<p>Ano, průkaz celého domu platí i pro jednotky v něm. Podrobnosti pro jednotlivé byty najdete na <a href="https://nejpenb.vercel.app" target="_blank" rel="noopener">nejpenb.cz</a>.</p>' },
      { q: 'Kde musí být průkaz ve veřejné budově?', a: '<p>Průkaz nebo jeho grafickou část je potřeba umístit na veřejně přístupném a dobře viditelném místě v budově.</p>' },
    ],
    form: { service: 'PENB', org: 'SVJ / bytové družstvo', title: 'Poptávka průkazu pro dům nebo budovu' },
    relatedLinks: [
      { href: '/penb/', label: 'PENB pro organizace' },
      { href: '/pro-koho/svj-a-druzstva/', label: 'Služby pro SVJ a družstva' },
      { href: '/znalosti/penb-ve-verejnych-budovach/', label: 'PENB ve veřejných budovách' },
    ],
  });
}

// ============================================================ ENERGETICKÝ AUDIT
function audit() {
  const P = '/energeticky-audit/';
  const a = facts.audit;
  return servicePage({
    path: P,
    title: 'Energetický audit pro firmy a veřejný sektor',
    description: 'Energetický audit podle zákona č. 406/2000 Sb. a vyhlášky č. 183/2026 Sb.: kdo ho musí mít od roku 2026, prahy spotřeby a co audit obsahuje.',
    crumbs: [HOME, { name: 'Energetický audit', path: P }],
    kick: 'Služba 04 · Energetický audit',
    h1: 'Energetický audit podle pravidel platných od roku 2026',
    lead: 'Povinnost auditu se nově odvíjí od spotřeby energie organizace, ne od velikosti firmy. Zjistíme, zda se vás týká, a audit připravíme tak, aby jeho opatření šla použít v investičním plánu.',
    image: { name: 'mk-dilny', pos: '50% 55%' },
    glance: [
      { k: 'Podnikatelé', v: `nad ${a.bizAudit} ročně, ${a.bizInterval}` },
      { k: 'Systém hospodaření', v: `nad ${a.enms} – certifikovaný` },
      { k: 'Veřejný sektor', v: `audit nad ${a.publicAudit}` },
      { k: 'Prováděcí předpis', v: `${a.decree}, od ${a.decreeFrom}` },
    ],
    service: { name: 'Energetický audit', serviceType: 'Energetický audit', description: 'Energetický audit pro podnikatele a veřejný sektor podle § 9 zákona č. 406/2000 Sb. a vyhlášky č. 183/2026 Sb.', audience: 'firmy, obce, kraje, příspěvkové organizace' },
    content: `
${subNav([{ path: '/energeticky-audit/obce/', label: 'Audit pro obce' }, { path: '/energeticky-posudek/', label: 'Energetický posudek' }, { path: '/znalosti/energeticky-audit-od-roku-2026/', label: 'Článek: kdo musí mít audit' }])}
${block({ kick: 'Povinnost', title: 'Kdo musí mít audit', html: `<p>Rozhodující je ${esc(a.basis)}. U podnikatele se počítá celá skupina, ve které má podíl alespoň 50 % kapitálu nebo hlasovacích práv.</p>
<div class="table-wrap"><table>
  <caption>Povinnosti podle § 9 zákona č. 406/2000 Sb. (znění účinné v listopadu 2026)</caption>
  <thead><tr><th scope="col">Spotřeba</th><th scope="col">Podnikatel</th><th scope="col">Veřejný sektor</th></tr></thead>
  <tbody>
    <tr><th scope="row">pod ${a.exempt}</th><td data-label="Podnikatel">povinnost se nevztahuje</td><td data-label="Veřejný sektor">–</td></tr>
    <tr><th scope="row">nad ${a.publicAudit}</th><td data-label="Podnikatel">–</td><td data-label="Veřejný sektor">energetický audit</td></tr>
    <tr><th scope="row">nad ${a.bizAudit}</th><td data-label="Podnikatel">audit ${a.bizInterval}</td><td data-label="Veřejný sektor">audit ${a.bizInterval}</td></tr>
    <tr><th scope="row">nad ${a.enms}</th><td data-label="Podnikatel">certifikovaný systém hospodaření s energií</td><td data-label="Veřejný sektor">certifikovaný systém hospodaření s energií</td></tr>
  </tbody>
</table></div>
<p>Veřejným sektorem se rozumí stát, kraje, obce, příspěvkové organizace, veřejné a státní vysoké školy a Česká národní banka. Náležitosti auditu stanoví ${esc(a.decree)}, účinná od ${a.decreeFrom}.</p>` })}
${block({ kick: 'Obsah', title: 'Co od auditu čekat', alt: true, html: cards([
  { t: 'Bilance spotřeby', d: 'Kde a kolik energie organizace spotřebuje – budovy, provozy, doprava – a jak se spotřeba vyvíjí.' },
  { t: 'Návrh opatření', d: 'Konkrétní opatření s odhadem úspor, investice a návratnosti, seřazená podle přínosu.' },
  { t: 'Použitelný výstup', d: 'Audit stavíme tak, aby šel přenést do investičního plánu a sloužil jako podklad pro dotační žádosti.' },
]) })}
${block({ kick: 'S kým', title: `${NEUTRAL} audit od sběru dat po předání`, html: `<p>Energetický audit zpracuje energetický specialista. Využijeme výstupy, které už máte – zprávy z kontrol vytápění a klimatizace, průkazy budov, měření spotřeby – a doplníme jen to, co chybí.</p><p>Nabídku pošleme ${quoteTime}. Pro přesnější odhad rozsahu se hodí roční spotřeby energií za poslední tři roky a seznam budov a provozů.</p>` })}`,
    faq: [
      { q: 'Platí stará pravidla podle velikosti podniku?', a: '<p>Ne. Od roku 2026 rozhoduje spotřeba energie, ne počet zaměstnanců či obrat. Organizace s nízkou spotřebou mohou povinnost ztratit, jiné ji naopak nově získávají.</p>' },
      { q: 'Jak spočítat spotřebu za skupinu?', a: '<p>Sečte se průměrná roční konečná spotřeba energie všech společností ve skupině, ve kterých má podnikatel podíl alespoň 50 %. Pomůžeme s tím při úvodní konzultaci.</p>' },
      { q: 'Je rozdíl mezi auditem a posudkem?', a: '<p>Audit hodnotí celou organizaci nebo její části a navrhuje opatření. <a href="/energeticky-posudek/">Energetický posudek</a> posuzuje konkrétní projekt – typicky jako podklad k dotaci.</p>' },
    ],
    form: { service: 'energetický audit', org: 'firma', title: 'Poptávka energetického auditu' },
    relatedLinks: [
      { href: '/energeticky-audit/obce/', label: 'Audit pro obce' },
      { href: '/energeticky-posudek/', label: 'Energetický posudek' },
      { href: '/pro-koho/firmy-a-prumysl/', label: 'Pro firmy a průmysl' },
    ],
  });
}

function auditObce() {
  const P = '/energeticky-audit/obce/';
  const a = facts.audit;
  return servicePage({
    path: P,
    title: 'Energetický audit pro obce a veřejný sektor',
    description: `Energetický audit pro obce, kraje a příspěvkové organizace: povinnost nad ${a.publicAudit} ročně, jak spočítat spotřebu a jak audit využít v investicích.`,
    crumbs: [HOME, { name: 'Energetický audit', path: '/energeticky-audit/' }, { name: 'Obce', path: P }],
    kick: 'Energetický audit · veřejný sektor',
    h1: 'Energetický audit pro obce a veřejné instituce',
    lead: `Veřejný sektor má přísnější práh než firmy: povinnost auditu vzniká už nad ${a.publicAudit} průměrné roční spotřeby. To zahrnuje i menší města se školami, sportovišti a úřadem.`,
    image: { name: 'litvinov-koldum', pos: '50% 30%' },
    glance: [
      { k: 'Práh', v: `nad ${a.publicAudit} ročně` },
      { k: 'Vyšší práh', v: `nad ${a.bizAudit}: ${a.bizInterval}` },
      { k: 'Nejvyšší práh', v: `nad ${a.enms}: systém hospodaření s energií` },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Energetický audit pro obce', serviceType: 'Energetický audit', description: 'Energetický audit pro obce, kraje a příspěvkové organizace podle § 9 zákona č. 406/2000 Sb.', audience: 'obce, kraje, příspěvkové organizace' },
    content: `
${block({ kick: 'Spotřeba', title: 'Jak zjistit, zda obec překračuje práh', html: `<ol class="numbered">
  <li>Sečtěte faktury za elektřinu, plyn, teplo a další paliva za poslední tři kalendářní roky – za všechny budovy a provozy, které obec spravuje.</li>
  <li>Zvažte, co patří k obci a co k jejím příspěvkovým organizacím; ty jsou v zákoně uvedené samostatně.</li>
  <li>Vypočtěte průměr a porovnejte s prahem ${a.publicAudit}.</li>
</ol><p>Pokud data nejsou pohromadě, sestavíme přehled spotřeb za vás. Výsledkem je i užitečná evidence pro další roky.</p>` })}
${block({ kick: 'Využití', title: 'Audit jako podklad pro investice', alt: true, html: '<p>Dobře zpracovaný audit ukáže, které budovy mají největší potenciál úspor a v jakém pořadí do nich investovat. Opatření lze převzít do rozpočtového výhledu a použít v žádostech o dotace.</p><p>Pro obce, které chtějí povinnosti řešit průběžně, nabízíme <a href="/energeticka-pece-o-budovy/">energetickou péči o budovy</a> – víceletý plán, ve kterém audit navazuje na kontroly a průkazy.</p>' })}`,
    faq: [
      { q: 'Počítá se spotřeba příspěvkových organizací do obce?', a: '<p>Zákon uvádí obce i příspěvkové organizace jako samostatné subjekty. Jak rozdělit spotřebu v konkrétním případě, posoudíme podle toho, kdo je odběratelem energií a kdo budovy spravuje.</p>' },
      { q: 'Jak dlouho audit trvá?', a: '<p>Záleží na počtu budov a dostupnosti dat. Harmonogram navrhneme v nabídce, kterou pošleme do 1 pracovního dne.</p>' },
    ],
    form: { service: 'energetický audit', org: 'obec / škola / veřejná instituce', title: 'Poptávka auditu pro obec' },
    relatedLinks: [
      { href: '/energeticky-audit/', label: 'Energetický audit – přehled' },
      { href: '/pro-koho/obce-a-skoly/', label: 'Pro obce a školy' },
      { href: '/pro-zadavatele/', label: 'Pro zadavatele' },
    ],
  });
}

// ============================================================ ENERGETICKÝ POSUDEK
function posudek() {
  const P = '/energeticky-posudek/';
  return servicePage({
    path: P,
    title: 'Energetický posudek k dotacím a investicím',
    description: 'Energetický posudek podle § 9a zákona č. 406/2000 Sb. a vyhlášky č. 141/2021 Sb.: kdy je povinný, k čemu slouží u dotací a co obsahuje.',
    crumbs: [HOME, { name: 'Energetický posudek', path: P }],
    kick: 'Služba 04 · Energetický posudek',
    h1: 'Energetický posudek pro projekty úspor',
    lead: 'Posudek ověřuje, zda konkrétní projekt splní technické, ekologické a ekonomické parametry. Nejčastěji ho potřebujete jako přílohu žádosti o dotaci a po dokončení projektu.',
    image: { name: 'kotelna-kaskada', pos: '50% 50%' },
    glance: [
      { k: 'Předpis', v: facts.posudek.paragraph },
      { k: 'Náležitosti', v: facts.posudek.decree },
      { k: 'Typické použití', v: 'dotace z veřejných zdrojů' },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Energetický posudek', serviceType: 'Energetický posudek', description: 'Energetický posudek podle § 9a zákona č. 406/2000 Sb. pro projekty úspor energie a dotační programy.', audience: 'obce, firmy, SVJ' },
    content: `
${block({ kick: 'Kdy', title: 'Kdy je posudek povinný', html: `<p>Zákon v § 9a vyjmenovává případy, kdy musí stavebník, vlastník budovy nebo energetického hospodářství posudek zajistit. Pro budovy a organizace jsou nejdůležitější:</p>
<ul>
  <li>posouzení proveditelnosti projektu na snížení energetické náročnosti budov, zvýšení účinnosti nebo využití obnovitelných zdrojů, pokud je financovaný ze státních, evropských nebo jiných veřejných programů a program nestanoví jinak,</li>
  <li>vyhodnocení, zda projekt z takového programu splnil plánované parametry,</li>
  <li>stanovení vnitřního výnosového procenta projektu s nárokem na podporu obnovitelných zdrojů.</li>
</ul>
<p>Další případy se týkají velkých zdrojů energie nad 20 MW – posouzení kombinované výroby elektřiny a tepla a využití odpadního tepla. Náležitosti posudku stanoví ${esc(facts.posudek.decree)}</p>` })}
${block({ kick: 'Praxe', title: 'Jak posudek zapadá do projektu', alt: true, html: cards([
  { t: 'Před žádostí', d: 'Ověříme, zda projekt splní podmínky programu, a nastavíme parametry, které bude potřeba doložit.' },
  { t: 'Během přípravy', d: 'Spolupracujeme s projektantem, aby projektová dokumentace a posudek vycházely ze stejných předpokladů.' },
  { t: 'Po realizaci', d: 'Vyhodnotíme, zda projekt dosáhl slíbených parametrů – to programy obvykle vyžadují pro závěrečné vyúčtování.' },
]) })}
${block({ kick: 'S kým', title: `${NEUTRAL} posudek v celém rozsahu`, html: `<p>Posudek zpracuje energetický specialista. Pokud už máte energetický audit nebo průkaz budovy, vycházíme z nich. Nabídku pošleme ${quoteTime}.</p>` })}`,
    faq: [
      { q: 'Potřebuji posudek pro NZÚ?', a: '<p>Program Nová zelená úsporám má vlastní podmínky – pro dílčí renovaci renovační pas, pro komplexní renovaci průkaz energetické náročnosti. Viz <a href="/energeticke-poradenstvi/dotace-nzu/">Dotace NZÚ</a>.</p>' },
      { q: 'Je posudek totéž co audit?', a: '<p>Ne. <a href="/energeticky-audit/">Audit</a> hodnotí celou organizaci, posudek konkrétní projekt.</p>' },
    ],
    form: { service: 'energetický posudek', org: 'obec / škola / veřejná instituce', title: 'Poptávka energetického posudku' },
    relatedLinks: [
      { href: '/energeticky-audit/', label: 'Energetický audit' },
      { href: '/energeticke-poradenstvi/', label: 'Energetické poradenství' },
      { href: '/povinnosti-budov/', label: 'Ověřit povinnosti budovy' },
    ],
  });
}

// ============================================================ PORADENSTVÍ
const worksGallery = () => {
  const list = petrWorks.filter((w) => hasImg(w.image));
  if (!list.length) return '';
  return `<section class="section">
  <div class="wrap">
    ${sectionHead({ kick: 'Z praxe', title: `Realizace, na kterých pracoval ${esc(petr.name)}` })}
    <ul class="works" role="list">${list.map((w) => `<li><figure>${img(w.image, { alt: w.caption, sizes: '(min-width: 900px) 280px, 45vw' })}<figcaption>${esc(w.caption)}</figcaption></figure></li>`).join('')}</ul>
    <p class="small">Fotografie z webu ${ext(petr.site.url, esc(petr.site.label))}.</p>
  </div>
</section>`;
};

function poradenstvi() {
  const P = '/energeticke-poradenstvi/';
  return servicePage({
    path: P,
    title: 'Energetické poradenství pro SVJ, obce a firmy',
    description: 'Energetické poradenství pro organizace: dotace NZÚ, renovační pas, výběr zdroje tepla, fotovoltaika a zateplení v pořadí, které dává smysl.',
    crumbs: [HOME, { name: 'Energetické poradenství', path: P }],
    kick: 'Služba 05 · Energetické poradenství',
    h1: 'Energetické poradenství před investicí',
    lead: 'Nejdražší chyba je udělat správné opatření ve špatném pořadí. Pomůžeme rozhodnout, co dělat dřív – zateplení, okna, zdroj tepla, fotovoltaiku – a jak to financovat.',
    image: { name: 'jihlava-radiator', pos: '50% 50%' },
    glance: [
      { k: 'Dotace', v: 'Nová zelená úsporám 2026' },
      { k: 'Plán', v: 'renovační pas, etapy' },
      { k: 'Technologie', v: 'zdroj tepla, FVE, rekuperace' },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Energetické poradenství', serviceType: 'Energetické poradenství', description: 'Poradenství k úsporám energie, dotacím, výběru zdroje tepla a fotovoltaice pro SVJ, obce a firmy.', audience: 'SVJ, bytová družstva, obce, firmy' },
    content: `
<section class="section">
  <div class="wrap">
    ${sectionHead({ kick: 'Témata', title: 'S čím pomáháme' })}
    ${cards([
      { t: 'Dotace NZÚ 2026', d: 'Bezúročné úvěry pro bytové a rodinné domy, podmínky a příprava podkladů.', href: '/energeticke-poradenstvi/dotace-nzu/', l: 'Dotace NZÚ' },
      { t: 'Renovační pas', d: 'Plán renovace po etapách, aby jednotlivé kroky na sebe navazovaly.', href: '/energeticke-poradenstvi/renovacni-pas/', l: 'Renovační pas' },
      { t: 'Výběr zdroje tepla', d: 'Dálkové teplo, plyn, tepelné čerpadlo nebo kombinace – podle domu, ne podle reklamy.', href: '/energeticke-poradenstvi/zdroj-tepla/', l: 'Zdroj tepla' },
      { t: 'Fotovoltaika', d: 'Kdy se elektrárna na střeše bytového domu nebo firmy vyplatí a jak ji dimenzovat.', href: '/energeticke-poradenstvi/fotovoltaika/', l: 'Fotovoltaika' },
    ])}
  </div>
</section>
${block({ kick: 'Přístup', title: 'Nejdřív obálka, pak technologie', alt: true, html: '<p>Obecné pravidlo: nejdřív snížit potřebu tepla (zateplení, okna, větrání s rekuperací), potom podle nové, nižší potřeby navrhnout zdroj tepla a nakonec doplnit výrobu elektřiny. Zdroj navržený pro nezateplený dům bude po zateplení předimenzovaný – to vidíme při kontrolách vytápění pravidelně.</p><p>Výjimky existují: dosluhující kotel nepočká na zateplení. Pak navrhujeme řešení, které počítá s budoucím snížením potřeby tepla.</p>' })}
${worksGallery()}`,
    faq: [
      { q: 'Kdo poradenství poskytuje?', a: `<p>Poradenství vede ${esc(petr.name)}, technické otázky zdrojů tepla konzultuje s Ing. Matějem Krumlem. Více na stránce <a href="/tym/">Tým</a>.</p>` },
      { q: 'Dodáváte i technologie?', a: '<p>Ne. Jsme nezávislí na dodavatelích – pomáháme vybrat řešení a připravit zadání, instalaci provádí firma, kterou si vyberete.</p>' },
    ],
    form: { service: 'poradenství', title: 'Poptávka poradenství' },
    relatedLinks: [
      { href: '/energeticke-poradenstvi/dotace-nzu/', label: 'Dotace NZÚ' },
      { href: '/energeticka-pece-o-budovy/', label: 'Energetická péče o budovy' },
      { href: '/znalosti/vymena-zdroje-tepla/', label: 'Článek: výměna zdroje tepla' },
    ],
  });
}

const PCRUMB = { name: 'Energetické poradenství', path: '/energeticke-poradenstvi/' };

function nzu() {
  const P = '/energeticke-poradenstvi/dotace-nzu/';
  return servicePage({
    path: P,
    title: 'Dotace NZÚ 2026 pro bytové domy a SVJ',
    description: 'Nová zelená úsporám 2026 pro SVJ, družstva a vlastníky domů: bezúročné úvěry, renovační pas a PENB jako podklady. Pomůžeme s přípravou.',
    crumbs: [HOME, PCRUMB, { name: 'Dotace NZÚ', path: P }],
    kick: 'Poradenství · Nová zelená úsporám',
    h1: 'Nová zelená úsporám 2026: příprava žádosti',
    lead: `Program se od ${facts.nzu.start} opírá hlavně o bezúročné úvěry. Přímá dotace zůstala jen pro ekonomicky znevýhodněné domácnosti. Pomůžeme připravit dům i podklady.`,
    image: { name: 'praha-fasada', pos: '50% 50%' },
    glance: [
      { k: 'Příjem žádostí', v: `od ${facts.nzu.start}` },
      { k: 'Forma podpory', v: 'bezúročný úvěr' },
      { k: 'Dílčí renovace', v: 'renovační pas' },
      { k: 'Komplexní renovace', v: 'průkaz PENB' },
    ],
    service: { name: 'Poradenství k dotacím NZÚ', serviceType: 'Dotační poradenství', description: 'Příprava podkladů a renovace pro program Nová zelená úsporám 2026.', audience: 'SVJ, bytová družstva, vlastníci domů' },
    content: `
${block({ kick: 'Program', title: 'Jak program funguje v roce 2026', html: `<p>Žádosti se podávají elektronicky přes portál Státního fondu životního prostředí od ${facts.nzu.start}, a to do ${facts.nzu.end} nebo do vyčerpání prostředků. Podpora má hlavně formu bezúročného úvěru – úroky a náklady úvěru hradí stát, žadatel splácí jen jistinu. Úvěry poskytují banky a stavební spořitelny zapojené do programu.</p>
<p>Úvěr mohou čerpat vlastníci rodinných domů, společenství vlastníků jednotek a bytová družstva. Přímá dotace je vyhrazena domácnostem v obtížné ekonomické situaci.</p>
<p class="small">Podmínky se v průběhu programu mění. Aktuální znění vždy ověřujeme na novazelenausporam.cz před podáním žádosti.</p>` })}
${block({ kick: 'Podklady', title: 'Renovační pas, nebo průkaz?', alt: true, html: '<ul><li><strong>Dílčí renovace</strong> (jen okna, jen střecha, jen zdroj tepla): podkladem je <a href="/energeticke-poradenstvi/renovacni-pas/">renovační pas</a>, který vystavuje energetický poradce zapojený do programu.</li><li><strong>Komplexní renovace</strong>: podkladem je <a href="/penb/">průkaz energetické náročnosti</a> stavu před a po renovaci.</li></ul><p>Pro bytový dům doporučujeme začít průkazem a jednoduchým plánem etap – výbor pak může na shromáždění předložit, co se udělá, v jakém pořadí a jak to dům zaplatí.</p>' })}`,
    faq: [
      { q: 'Může SVJ čerpat úvěr NZÚ?', a: '<p>Ano, společenství vlastníků jednotek i bytová družstva patří mezi oprávněné žadatele o úvěr.</p>' },
      { q: 'Kolik si dům může půjčit?', a: '<p>Limity se liší podle typu domu a rozsahu renovace a program je během trvání upravuje. Aktuální výši ověříme pro váš dům při přípravě.</p>' },
    ],
    form: { service: 'poradenství', org: 'SVJ / bytové družstvo', title: 'Poptávka přípravy NZÚ' },
    relatedLinks: [
      { href: '/znalosti/nzu-2026-pro-svj-a-druzstva/', label: 'Článek: NZÚ pro SVJ a družstva' },
      { href: '/energeticke-poradenstvi/renovacni-pas/', label: 'Renovační pas' },
      { href: '/penb/bytove-domy-a-verejne-budovy/', label: 'PENB pro bytové domy' },
    ],
  });
}

function pas() {
  const P = '/energeticke-poradenstvi/renovacni-pas/';
  return servicePage({
    path: P,
    title: 'Renovační pas pro bytové a rodinné domy',
    description: 'Renovační pas jako plán renovace po etapách: k čemu slouží, kdy ho chce NZÚ a jak ho využít při rozhodování SVJ nebo vlastníka domu.',
    crumbs: [HOME, PCRUMB, { name: 'Renovační pas', path: P }],
    kick: 'Poradenství · plán renovace',
    h1: 'Renovační pas: plán, ne jen formulář',
    lead: 'Renovační pas popisuje, v jakém pořadí dům renovovat, aby jednotlivé kroky na sebe navazovaly. V programu NZÚ je podmínkou pro dílčí renovace.',
    image: { name: 'mk-rozvody', pos: '50% 50%' },
    glance: [
      { k: 'Obsah', v: 'stav domu a etapy renovace' },
      { k: 'NZÚ', v: 'podklad pro dílčí renovaci' },
      { k: 'Vystavuje', v: 'energetický poradce programu' },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Renovační pas', serviceType: 'Energetické poradenství', description: 'Příprava plánu renovace po etapách pro bytové a rodinné domy.', audience: 'SVJ, bytová družstva, vlastníci domů' },
    content: `
${block({ kick: 'K čemu', title: 'Proč plán etap šetří peníze', html: '<p>Bez plánu se dům renovuje podle toho, co se zrovna rozbije. Výsledkem bývá nová okna, která nesedí do budoucího zateplení, nebo nový kotel dimenzovaný na nezateplený dům. Renovační pas tomu předchází: popíše současný stav, navrhne etapy a ke každé odhadne přínos.</p>' })}
${block({ kick: 'Postup', title: 'Jak pas vzniká', alt: true, html: '<ol class="numbered"><li>Prohlídka domu a sběr podkladů – dokumentace, spotřeby, stav konstrukcí a technologií.</li><li>Návrh etap s ohledem na technické návaznosti a možnosti financování.</li><li>Projednání s vlastníkem nebo výborem – u SVJ i podklad pro shromáždění.</li></ol><p>Pro program NZÚ vystavuje renovační pas energetický poradce zapojený do programu. Kdo z našeho týmu pas pro konkrétní dům vystaví, potvrdíme v nabídce.</p>' })}`,
    faq: [
      { q: 'Nahradí renovační pas průkaz energetické náročnosti?', a: '<p>Ne, jde o jiné dokumenty s jiným účelem. Průkaz hodnotí energetickou náročnost budovy podle zákona, pas plánuje renovaci. Pro komplexní renovaci v NZÚ je podkladem průkaz.</p>' },
    ],
    form: { service: 'poradenství', title: 'Poptávka renovačního pasu' },
    relatedLinks: [
      { href: '/energeticke-poradenstvi/dotace-nzu/', label: 'Dotace NZÚ' },
      { href: '/energeticke-poradenstvi/zdroj-tepla/', label: 'Výběr zdroje tepla' },
    ],
  });
}

function zdroj() {
  const P = '/energeticke-poradenstvi/zdroj-tepla/';
  return servicePage({
    path: P,
    title: 'Výběr zdroje tepla pro bytové domy a budovy',
    description: 'Nezávislé poradenství k výběru zdroje tepla: dálkové teplo, plynová kotelna, tepelné čerpadlo nebo kombinace. Pro SVJ, obce a firmy.',
    crumbs: [HOME, PCRUMB, { name: 'Zdroj tepla', path: P }],
    kick: 'Poradenství · zdroj tepla',
    h1: 'Výběr zdroje tepla bez obchodního zájmu',
    lead: 'Rozhodnutí o zdroji tepla platí na desítky let. Porovnáme varianty na skutečných datech budovy – spotřebě, výkonu, stavu rozvodů a plánech renovace.',
    image: { name: 'tabor-stanice', pos: '50% 50%' },
    glance: [
      { k: 'Varianty', v: 'CZT, plyn, tepelné čerpadlo, kombinace' },
      { k: 'Vstupy', v: 'spotřeba, výkon, rozvody' },
      { k: 'Nezávislost', v: 'nedodáváme technologie' },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Poradenství k výběru zdroje tepla', serviceType: 'Energetické poradenství', description: 'Porovnání variant zdroje tepla pro bytové domy, veřejné a firemní budovy.', audience: 'SVJ, obce, firmy' },
    content: `
${block({ kick: 'Postup', title: 'Na čem rozhodnutí stojí', html: cards([
  { t: 'Skutečná potřeba tepla', d: 'Výkon stávajícího zdroje bývá vyšší, než dům potřebuje. Vycházíme z naměřené spotřeby, ne ze štítku starého kotle.' },
  { t: 'Teplotní úroveň soustavy', d: 'Tepelné čerpadlo potřebuje nižší teploty otopné vody. Ověříme, zda je soustava zvládne, nebo co je potřeba upravit.' },
  { t: 'Plán renovace', d: 'Pokud dům čeká zateplení, zdroj navrhneme na budoucí potřebu – nebo jako etapové řešení.' },
  { t: 'Provozní náklady', d: 'Porovnáme náklady variant v rozsahu let, včetně údržby a obnovy, ne jen pořizovací cenu.' },
]) })}
${block({ kick: 'Návaznost', title: 'Využijeme zprávu z kontroly vytápění', alt: true, html: '<p>Pokud má budova zprávu z kontroly systému vytápění, obsahuje hodnocení dimenzování zdroje a provozních parametrů – ideální výchozí bod. Pokud ji ještě nemá a zdroj je nad 70 kW, můžeme obojí spojit. Viz <a href="/kontrola-vytapeni/">kontrola vytápění</a>.</p>' })}`,
    faq: [
      { q: 'Vyplatí se odpojit dům od dálkového tepla?', a: '<p>Obecná odpověď neexistuje. Záleží na ceně tepla v dané soustavě, stavu domu a možnostech umístění vlastního zdroje. Porovnáme varianty na datech vašeho domu.</p>' },
    ],
    form: { service: 'poradenství', title: 'Poptávka poradenství ke zdroji tepla' },
    relatedLinks: [
      { href: '/znalosti/vymena-zdroje-tepla/', label: 'Článek: výměna zdroje tepla' },
      { href: '/kontrola-vytapeni/', label: 'Kontrola vytápění' },
    ],
  });
}

function fve() {
  const P = '/energeticke-poradenstvi/fotovoltaika/';
  return servicePage({
    path: P,
    title: 'Fotovoltaika pro bytové domy, obce a firmy',
    description: 'Poradenství k fotovoltaice na bytovém domě, obecní nebo firemní budově: dimenzování podle spotřeby, statika střechy, pořadí s ostatními opatřeními.',
    crumbs: [HOME, PCRUMB, { name: 'Fotovoltaika', path: P }],
    kick: 'Poradenství · fotovoltaika',
    h1: 'Fotovoltaika na budovách organizací',
    lead: 'Elektrárna na střeše dává smysl tehdy, když vyrobenou elektřinu budova spotřebuje. Pomůžeme navrhnout velikost podle skutečného odběru a zařadit ji do plánu oprav.',
    image: { name: 'mk-dilny', pos: '50% 30%' },
    glance: [
      { k: 'Klíčový vstup', v: 'průběh spotřeby elektřiny' },
      { k: 'Kontrola', v: 'stav a statika střechy' },
      { k: 'Pořadí', v: 'po opravě střechy' },
      { k: 'Nabídka', v: quoteTime },
    ],
    service: { name: 'Poradenství k fotovoltaice', serviceType: 'Energetické poradenství', description: 'Nezávislé poradenství k návrhu fotovoltaiky pro bytové domy, obce a firmy.', audience: 'SVJ, obce, firmy' },
    content: `
${block({ kick: 'Návrh', title: 'Co rozhoduje o přínosu', html: cards([
  { t: 'Spotřeba v čase', d: 'Firma s denním provozem spotřebuje výrobu přímo. U bytového domu záleží na společných spotřebách a na tom, jak se výroba rozdělí mezi byty.' },
  { t: 'Střecha', d: 'Elektrárnu instalovat až po opravě nebo zateplení střechy – demontáž a zpětná montáž zbytečně zdražují.' },
  { t: 'Navazující technologie', d: 'Tepelné čerpadlo, nabíjení vozidel nebo akumulace mění ideální velikost elektrárny.' },
]) })}
${block({ kick: 'Nezávislost', title: 'Nabídky dodavatelů posoudíme', alt: true, html: '<p>Fotovoltaiku nedodáváme. Pomůžeme připravit zadání a porovnat nabídky dodavatelů – dimenzování, předpoklady výroby a vlastní spotřeby, záruky.</p>' })}`,
    faq: [
      { q: 'Lze na fotovoltaiku pro bytový dům čerpat NZÚ?', a: '<p>Podmínky programu se pro jednotlivá opatření liší a v průběhu se mění. Pro konkrétní dům je ověříme při přípravě – viz <a href="/energeticke-poradenstvi/dotace-nzu/">Dotace NZÚ</a>.</p>' },
    ],
    form: { service: 'poradenství', title: 'Poptávka poradenství k fotovoltaice' },
    relatedLinks: [
      { href: '/energeticke-poradenstvi/', label: 'Energetické poradenství' },
      { href: '/energeticke-poradenstvi/renovacni-pas/', label: 'Renovační pas' },
    ],
  });
}

export default [vytapeni, vytapeniSpravci, vytapeniObce, klimatizace, penb, penbBd, audit, auditObce, posudek, poradenstvi, nzu, pas, zdroj, fve];
