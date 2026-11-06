import { segments, services, sisterSites, facts, quoteTime, FORM_HREF } from '../config.mjs';
import { esc, serviceSchema, faqSchema } from '../lib/html.mjs';
import { I, CTA, pageHero, sectionHead, block, segmentGrid, refCards, processList, faqSection, formSection, related, ctaBand, sisterBlock, SERVICE_ICO } from '../templates/partials.mjs';

const HOME = { name: 'Úvod', path: '/' };
const HUB = { name: 'Pro koho', path: '/pro-koho/' };

/** Seznam relevantních služeb pro segment: [{id, why}] */
const fitList = (items) => `<ul class="fit" role="list">${items
  .map((x) => {
    const s = services.find((y) => y.id === x.id) || x;
    return `<li class="reveal"><a href="${x.href || s.path}"><span class="fit-ico">${SERVICE_ICO[x.id] || I.doc}</span><span class="fit-t">${esc(x.label || s.label)}</span><span class="fit-d">${esc(x.why)}</span><span class="fit-go" aria-hidden="true">${I.arrow}</span></a></li>`;
  })
  .join('')}</ul>`;

function segPage(o) {
  const body = `
${pageHero({ kick: o.kick, h1: o.h1, lead: o.lead, image: o.image, cta: [{ href: '#poptavka', label: CTA, primary: true }, { href: '/povinnosti-budov/', label: 'Ověřit povinnosti' }] })}
<section class="section">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Co vás týká', title: o.fitTitle || 'Služby, které dávají smysl' })}
    ${fitList(o.fit)}
  </div>
</section>
${o.content || ''}
${o.refs ? `<section class="section section-alt"><div class="wrap"><div class="head-row">${sectionHead({ kick: 'Reference', title: o.refsTitle || 'Kde jsme pracovali' })}<a class="more" href="/reference/">Všechny reference ${I.arrow}</a></div>${refCards({ ids: o.refs, limit: 3 })}</div></section>` : ''}
${o.faq?.length ? faqSection(o.faq) : ''}
${formSection({ org: o.org, segment: o.path, title: o.formTitle || 'Napište nám' })}
${related(o.relatedLinks || [])}`;
  return {
    path: o.path,
    title: o.title,
    description: o.description,
    crumbs: [HOME, HUB, { name: o.crumb, path: o.path }],
    schema: [serviceSchema({ url: o.path, name: o.serviceName, serviceType: 'Energetické služby', description: o.description, audience: o.audience }), ...(o.faq?.length ? [faqSchema(o.faq)] : [])],
    body,
  };
}

// ============================================================ /pro-koho/
function hub() {
  const P = '/pro-koho/';
  const body = `
${pageHero({ kick: 'Pro koho', h1: 'Služby podle toho, kdo za budovu odpovídá', lead: 'Výbor SVJ, správce portfolia, starosta, ředitel školy i technický ředitel firmy řeší stejné předpisy, ale z jiné pozice. Vyberte si svou.', cta: [{ href: FORM_HREF, label: CTA, primary: true }, { href: '/povinnosti-budov/', label: 'Ověřit povinnosti' }] })}
<section class="section">
  <div class="wrap">
    ${segmentGrid({ headingTag: 'h2' })}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Veřejné zakázky', title: 'Zadáváte výběrové řízení?' })}
    <div class="prose"><p>Identifikační údaje, ověřená oprávnění, referenční tabulku a dokumenty ke stažení máme připravené na jedné stránce.</p><p><a class="btn btn-dark" href="/pro-zadavatele/">Pro zadavatele</a></p></div>
  </div>
</section>
${ctaBand({})}`;
  return {
    path: P,
    title: 'Pro koho pracujeme: SVJ, správci, obce, firmy',
    description: 'Energetické služby pro SVJ a družstva, správce nemovitostí, obce a školy, firmy a průmysl i majitele domů. Vyberte svou situaci.',
    crumbs: [HOME, HUB],
    body,
  };
}

const svj = () =>
  segPage({
    path: '/pro-koho/svj-a-druzstva/', crumb: 'SVJ a bytová družstva', org: 'SVJ / bytové družstvo', audience: 'SVJ, bytová družstva',
    title: 'Energetické služby pro SVJ a bytová družstva',
    description: 'Co musí výbor SVJ nebo družstva zajistit: kontrola vytápění nad 70 kW, průkaz domu pro vlastníky jednotek, příprava renovace a úvěru NZÚ.',
    serviceName: 'Energetické služby pro SVJ a bytová družstva',
    kick: 'Pro koho · SVJ a družstva',
    h1: 'Energetické povinnosti domu, které leží na výboru',
    lead: 'Výbor odpovídá za povinnosti celého domu, i když se sejde jen párkrát ročně. Připravíme přehled, co dům musí mít, a podklady, které obstojí na shromáždění.',
    image: { name: 'praha-fasada' },
    fit: [
      { id: 'vytapeni', why: `Pokud má dům vlastní kotelnu nebo předávací stanici ${facts.heating.threshold}, kontrola je povinná ${facts.heating.interval}.` },
      { id: 'penb', label: 'Průkaz energetické náročnosti domu', href: '/penb/bytove-domy-a-verejne-budovy/', why: 'Vlastník bytu o něj může požádat při prodeji nebo pronájmu – výbor má na předání 30, nebo 60 dní.' },
      { id: 'poradenstvi', label: 'Příprava renovace a úvěru NZÚ', href: '/energeticke-poradenstvi/dotace-nzu/', why: 'Plán etap, podklady pro bezúročný úvěr a pro rozhodnutí shromáždění.' },
    ],
    content: block({ kick: 'Shromáždění', title: 'Podklady, které výbor potřebuje', alt: true, html: '<p>K nabídce přidáváme stručné vysvětlení pro vlastníky: co se kontroluje nebo zpracovává, proč je to povinné, co to dům stojí a co z toho má. Výbor tak nemusí složitě přepisovat odborné texty.</p>' }),
    refs: ['pisek', 'brno', 'tabor-skola'], refsTitle: 'Kontroly vytápění, které jsme dělali',
    faq: [
      { q: 'Potřebujeme souhlas shromáždění?', a: '<p>Zajištění zákonné povinnosti obvykle spadá do běžné správy domu. Jak to máte upravené, určují stanovy. Podklad pro shromáždění vám připravíme v každém případě.</p>' },
      { q: 'Dům je napojený na dálkové teplo. Týká se nás kontrola?', a: '<p>Ano, pokud má předávací stanice výkon nad 70 kW. Kontroluje se předávací stanice a navazující otopná soustava.</p>' },
    ],
    relatedLinks: [{ href: '/kontrola-vytapeni/spravci-portfolia/', label: 'Kontroly pro správce portfolia' }, { href: '/znalosti/nzu-2026-pro-svj-a-druzstva/', label: 'NZÚ 2026 pro SVJ a družstva' }, { href: '/povinnosti-budov/', label: 'Ověřit povinnosti domu' }],
  });

const spravci = () =>
  segPage({
    path: '/pro-koho/spravci-nemovitosti/', crumb: 'Správci nemovitostí', org: 'správce nemovitostí', audience: 'správci nemovitostí',
    title: 'Energetické služby pro správce nemovitostí',
    description: 'Pro správcovské firmy: kontroly vytápění a klimatizace, průkazy a poradenství pro celé portfolio domů v jednom harmonogramu s přehledem lhůt.',
    serviceName: 'Energetické služby pro správce nemovitostí',
    kick: 'Pro koho · správci nemovitostí',
    h1: 'Celé portfolio domů v jednom plánu',
    lead: 'Desítky domů, různé zdroje tepla, různé lhůty a různé výbory. Převezmeme evidenci energetických povinností a postaráme se, aby nic nepropadlo.',
    image: { name: 'brno-stanice-celek' },
    fit: [
      { id: 'vytapeni', href: '/kontrola-vytapeni/spravci-portfolia/', label: 'Kontroly vytápění pro portfolio', why: 'Soupis zdrojů, harmonogram po lokalitách, zpráva pro každé SVJ.' },
      { id: 'penb', href: '/penb/bytove-domy-a-verejne-budovy/', label: 'Průkazy pro domy ve správě', why: 'Přehled platnosti a průkazy předem, aby výbory nebyly v časovém tlaku.' },
      { id: 'klimatizace', why: 'U komerčních objektů ve správě – kanceláře, obchody.' },
      { id: 'pece', label: 'Energetická péče o budovy', href: '/energeticka-pece-o-budovy/', why: 'Víceletý plán, který spojuje všechny povinnosti portfolia.' },
    ],
    content: `<section class="section section-alt"><div class="wrap">${sectionHead({ kick: 'Spolupráce', title: 'Jak přebíráme agendu' })}${processList()}</div></section>`,
    refs: ['transakta', 'jihlava', 'litvinov'],
    faq: [
      { q: 'Umíte pracovat s naší evidencí domů?', a: '<p>Ano. Stačí export z vašeho systému – adresy, typ zdroje, výkon a datum poslední kontroly. Vrátíme ho doplněný o lhůty a plán.</p>' },
    ],
    relatedLinks: [{ href: '/kontrola-vytapeni/spravci-portfolia/', label: 'Kontroly vytápění pro portfolio' }, { href: '/energeticka-pece-o-budovy/', label: 'Energetická péče o budovy' }, { href: '/znalosti/soupis-zdroju-tepla/', label: 'Soupis zdrojů tepla' }],
  });

const obce = () =>
  segPage({
    path: '/pro-koho/obce-a-skoly/', crumb: 'Obce, školy a veřejné budovy', org: 'obec / škola / veřejná instituce', audience: 'obce, školy, příspěvkové organizace',
    title: 'Energetické služby pro obce, školy a úřady',
    description: 'Pro obce, školy a veřejné instituce: kontroly vytápění, průkazy budov úřadů, energetický audit nad 500 MWh, posudky k dotacím a podklady pro VZ.',
    serviceName: 'Energetické služby pro obce a školy',
    kick: 'Pro koho · obce a veřejný sektor',
    h1: 'Energetické povinnosti obcí, škol a úřadů',
    lead: 'Obec má budovy různého stáří a účelu, omezený rozpočet a pravidla pro zadávání. Pomůžeme povinnosti seřadit, rozpočtovat a zadat.',
    image: { name: 'litvinov-koldum', pos: '50% 30%' },
    fit: [
      { id: 'vytapeni', href: '/kontrola-vytapeni/obce-a-skoly/', label: 'Kontroly vytápění v areálech', why: 'Školy, úřady, sportoviště – všechny systémy nad 70 kW v jedné zakázce.' },
      { id: 'penb', href: '/penb/bytove-domy-a-verejne-budovy/', label: 'Průkazy budov úřadů', why: 'Budovy užívané orgánem veřejné moci nad 250 m² musí mít průkaz.' },
      { id: 'audit', href: '/energeticky-audit/obce/', label: 'Energetický audit pro obce', why: `Povinný ve veřejném sektoru nad ${facts.audit.publicAudit} průměrné roční spotřeby.` },
      { id: 'posudek', label: 'Energetický posudek k dotacím', href: '/energeticky-posudek/', why: 'U projektů úspor financovaných z veřejných programů, pokud program nestanoví jinak.' },
    ],
    content: block({ kick: 'Veřejné zakázky', title: 'Podklady pro zadání', alt: true, html: '<p>Pro zakázky malého rozsahu i podlimitní řízení máme připravené identifikační údaje, ověřená oprávnění a referenční tabulku. <a href="/pro-zadavatele/">Stránka pro zadavatele</a>.</p>' }),
    refs: ['litvinov', 'mkrumlov', 'liberec-skola'],
    faq: [
      { q: 'Můžeme povinnosti rozložit do více rozpočtových let?', a: '<p>Ano, pokud to dovolí lhůty. Navrhneme víceletý plán s odhadem nákladů po letech – viz <a href="/energeticka-pece-o-budovy/">energetická péče o budovy</a>.</p>' },
    ],
    relatedLinks: [{ href: '/pro-zadavatele/', label: 'Pro zadavatele' }, { href: '/znalosti/penb-ve-verejnych-budovach/', label: 'PENB ve veřejných budovách' }, { href: '/energeticky-audit/obce/', label: 'Audit pro obce' }],
  });

const firmy = () =>
  segPage({
    path: '/pro-koho/firmy-a-prumysl/', crumb: 'Firmy a průmysl', org: 'firma', audience: 'firmy, průmyslové provozy',
    title: 'Energetické služby pro firmy a průmysl',
    description: 'Pro firmy a průmyslové provozy: energetický audit podle spotřeby od roku 2026, kontroly vytápění a klimatizace nad 70 kW, posudky a poradenství.',
    serviceName: 'Energetické služby pro firmy',
    kick: 'Pro koho · firmy a průmysl',
    h1: 'Energetické povinnosti firem a provozů',
    lead: 'Nová pravidla pro audity vázaná na spotřebu, kontroly kotelen a chlazení, investice do úspor. Zjistíme, co se vás týká, a připravíme výstupy použitelné v provozu.',
    image: { name: 'kotelna-kaskada' },
    fit: [
      { id: 'audit', why: `Povinný nad ${facts.audit.bizAudit} průměrné roční spotřeby skupiny, ${facts.audit.bizInterval}.` },
      { id: 'vytapeni', why: 'Kotelny administrativních budov, hal i technologické zdroje, které vytápějí budovu.' },
      { id: 'klimatizace', why: 'Kanceláře, serverovny, obchody a hotely se systémy nad 70 kW.' },
      { id: 'poradenstvi', why: 'Zdroj tepla, fotovoltaika s vlastní spotřebou, pořadí investic.' },
    ],
    refs: ['transakta', 'wotan', 'jihlava'],
    faq: [
      { q: 'Týká se kontrola vytápění i zdrojů pro technologii?', a: '<p>Zákonná kontrola se týká systémů vytápění budov. Zdroj, který slouží výhradně technologii a budovu nevytápí, posoudíme individuálně.</p>' },
    ],
    relatedLinks: [{ href: '/znalosti/energeticky-audit-od-roku-2026/', label: 'Kdo musí mít energetický audit' }, { href: '/kontrola-klimatizace/', label: 'Kontrola klimatizace' }],
  });

const majitele = () =>
  segPage({
    path: '/pro-koho/majitele-domu/', crumb: 'Majitelé domů', org: 'soukromý vlastník', audience: 'vlastníci rodinných a bytových domů',
    title: 'Pro majitele domů: rozcestník služeb',
    description: 'Vlastníte dům nebo byt? Průkaz pro prodej či pronájem a kontrolu kotle řeší naše specializované weby. Elerys pomůže s poradenstvím a dotacemi.',
    serviceName: 'Energetické služby pro vlastníky domů',
    kick: 'Pro koho · majitelé domů',
    h1: 'Vlastníte dům nebo byt?',
    lead: 'Elerys se soustředí na organizace. Pro domácnosti máme specializované weby, kde najdete ceník a postup šitý na míru jednomu bytu nebo domu.',
    image: { name: 'jihlava-radiator' },
    fitTitle: 'Kam dál',
    fit: [
      { id: 'penb', label: 'Průkaz pro byt nebo rodinný dům', href: sisterSites.penb.url, why: 'Ceník, kalkulačka a poptávka na nejpenb.cz.' },
      { id: 'vytapeni', label: 'Kontrola kotle nad 70 kW', href: sisterSites.heating.url, why: 'Pro větší domy s vlastní kotelnou – web matejkruml.cz.' },
      { id: 'poradenstvi', label: 'Renovace a dotace NZÚ', href: '/energeticke-poradenstvi/dotace-nzu/', why: 'Bezúročný úvěr, renovační pas a pořadí opatření.' },
    ],
    content: `<section class="section section-tight"><div class="wrap">${sisterBlock('penb')}</div></section>`,
    relatedLinks: [{ href: '/energeticke-poradenstvi/', label: 'Energetické poradenství' }, { href: '/povinnosti-budov/', label: 'Ověřit povinnosti' }],
  });

// ============================================================ /energeticka-pece-o-budovy/
function pece() {
  const P = '/energeticka-pece-o-budovy/';
  const years = [
    { y: 'Rok 1', t: 'Soupis a zákonné minimum', d: 'Soupis budov a zdrojů, kontroly s nejbližšími lhůtami, chybějící průkazy, ověření povinnosti auditu.' },
    { y: 'Rok 2', t: 'Data a priority', d: 'Zbylé kontroly, přehled spotřeb, u povinných subjektů audit. Seznam opatření seřazený podle přínosu.' },
    { y: 'Rok 3–4', t: 'Investice', d: 'Posudky k dotačním žádostem, poradenství k výběru zdroje tepla a fotovoltaice, technický dozor nad zadáním.' },
    { y: 'Rok 5', t: 'Nový cyklus', d: 'Další kola kontrol podle lhůt, aktualizace průkazů po renovacích, vyhodnocení úspor.' },
  ];
  const body = `
${pageHero({ kick: 'Balíček služeb', h1: 'Energetická péče o budovy', lead: 'Pro obce a správce, kteří nechtějí řešit kontroly, průkazy a audity jednotlivě a na poslední chvíli. Jeden víceletý plán, jeden kontakt, termíny pod kontrolou.', image: { name: 'vysoke-rozdelovac' }, cta: [{ href: '#poptavka', label: 'Chci plán péče', primary: true }, { href: '/povinnosti-budov/', label: 'Ověřit povinnosti' }] })}
<section class="section">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Co obsahuje', title: 'Čtyři služby v jednom plánu' })}
    <ul class="fit" role="list">
      ${['vytapeni', 'penb', 'audit', 'poradenstvi'].map((id) => { const s = services.find((x) => x.id === id); return `<li class="reveal"><a href="${s.path}"><span class="fit-ico">${SERVICE_ICO[id]}</span><span class="fit-t">${esc(s.label)}</span><span class="fit-d">${esc(s.desc)}</span><span class="fit-go" aria-hidden="true">${I.arrow}</span></a></li>`; }).join('')}
    </ul>
  </div>
</section>
<section class="section section-dark">
  <div class="wrap">
    ${sectionHead({ kick: 'Ukázkový průběh', title: 'Jak může vypadat pětiletý plán' })}
    <ol class="timeline-h" role="list">${years.map((x) => `<li class="reveal"><span class="th-y">${x.y}</span><h3>${x.t}</h3><p>${x.d}</p></li>`).join('')}</ol>
    <p class="small on-dark">Ilustrativní rozvržení. Skutečný plán vychází z lhůt a rozpočtu vašich budov.</p>
  </div>
</section>
${block({ kick: 'Cena', title: 'Jak se plán oceňuje', html: `<p>Každou službu v plánu oceníme předem a rozepíšeme po letech a budovách – obec ji tak může zařadit do rozpočtového výhledu, správce předložit jednotlivým výborům. Návrh plánu s cenami pošleme ${quoteTime} od dodání seznamu budov.</p>` })}
${faqSection([
  { q: 'Musíme se zavázat na celé období?', a: '<p>Ne. Plán je podklad pro rozhodování; jednotlivé služby objednáváte postupně podle rozpočtu.</p>' },
  { q: 'Hodí se péče i pro menší obec?', a: '<p>Ano. I obec se třemi budovami má kontroly, průkazy a často dotační projekty. Plán pomůže, aby se povinnosti nesešly v jednom roce.</p>' },
])}
${formSection({ service: 'péče o budovy', org: 'obec / škola / veřejná instituce', segment: P, title: 'Pošlete seznam budov' })}
${related([{ href: '/pro-koho/obce-a-skoly/', label: 'Pro obce a školy' }, { href: '/pro-koho/spravci-nemovitosti/', label: 'Pro správce nemovitostí' }, { href: '/pro-zadavatele/', label: 'Pro zadavatele' }])}`;
  const faq = [
    { q: 'Musíme se zavázat na celé období?', a: '<p>Ne. Plán je podklad pro rozhodování; jednotlivé služby objednáváte postupně podle rozpočtu.</p>' },
    { q: 'Hodí se péče i pro menší obec?', a: '<p>Ano. I obec se třemi budovami má kontroly, průkazy a často dotační projekty. Plán pomůže, aby se povinnosti nesešly v jednom roce.</p>' },
  ];
  return {
    path: P,
    title: 'Energetická péče o budovy pro obce a správce',
    description: 'Víceletý plán energetických povinností pro obce a správce: kontroly vytápění, PENB, audit a poradenství v jednom harmonogramu a s jedním kontaktem.',
    crumbs: [HOME, HUB, { name: 'Energetická péče o budovy', path: P }],
    schema: [serviceSchema({ url: P, name: 'Energetická péče o budovy', serviceType: 'Energetický management budov', description: 'Víceletý plán kontrol, průkazů, auditů a poradenství pro obce a správce nemovitostí.', audience: 'obce, správci nemovitostí' }), faqSchema(faq)],
    body,
  };
}

export default [hub, svj, spravci, obce, firmy, majitele, pece];
