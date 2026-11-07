// =====================================================================
//  CENTRÁLNÍ KONFIGURACE WEBU ELERYS (zastřešující firemní web)
//  Kontakty, fakta z legislativy, služby, tým a reference se mění JEN zde.
//  null = prvek se na webu nezobrazí (nic se nevymýšlí). TODO = potvrdit s klientem.
//
//  Pravidla obsahu (nepřekrývat se se sesterskými weby – viz README):
//   - matejkruml.cz vlastní „kontrola systému vytápění“, města, detail kotelen → Elerys jen přehled pro organizace
//   - nejpenb.cz vlastní spotřebitelské PENB (byt, RD, cena) → Elerys jen PENB pro bytové domy a veřejné budovy
//   - energetikliberec.cz vlastní „… Liberec“ → Elerys nepoužívá Liberec v titulcích
//   - oprávnění MPO se uvádí JEN u kontroly vytápění (2202 Ing. Matěj Kruml, 2238 AMVILI s.r.o.)
// =====================================================================

export const site = {
  url: 'https://www.elerys.cz', // TODO potvrdit doménu (www / bez www)
  extraDomains: ['elerys.cz'], // jen evidence – 301 nastavit ve Vercelu
  name: 'Elerys',
  brand: 'Elerys',
  tagline: 'Energetické služby pro budovy a organizace',
  lang: 'cs',
  locale: 'cs_CZ',
  themeColor: '#0d0e10',
  updated: '2026-11-06', // datum poslední věcné kontroly faktů
  defaultOgImage: '/img/og-elerys.jpg',
};

// Provozovatel – převzato doslova z /home/claude/elerys/src/config.mjs (company).
export const company = {
  name: 'Elerys',
  legalName: 'AMVILI s.r.o.',
  brandNote: 'Elerys je značka společnosti AMVILI s.r.o.',
  ico: '19375336',
  dic: 'CZ19375336',
  address: { street: 'Petrská 1168/29', postalCode: '110 00', locality: 'Praha 1', country: 'CZ' },
  registry: 'Společnost je zapsána v obchodním rejstříku vedeném Městským soudem v Praze, oddíl C, vložka 385165.',
  registryShort: 'OR: Městský soud v Praze, C 385165',
  // Oprávnění MPO právnické osoby – SMÍ se uvádět jen u kontroly systémů vytápění (check.mjs hlídá).
  mpoNumber: '2238',
  openingHours: null, // TODO otevírací doba Elerys
};

// ---------------------------------------------------------------------
//  TÝM. Oprávnění: jen Matěj (kontrola vytápění). Petr Michna oprávnění MPO ZATÍM NEMÁ
//  (skládá zkoušky, potvrzeno klientem 6. 11. 2026) – web mu žádné oprávnění nepřisuzuje.
//  authorization: null = nic se nezobrazí. Po udělení doplnit { number, scope, date }.
// ---------------------------------------------------------------------
export const person = {
  id: 'matej',
  name: 'Ing. Matěj Kruml',
  givenName: 'Matěj',
  familyName: 'Kruml',
  jobTitle: 'Energetický specialista, jednatel AMVILI s.r.o.',
  lead: 'Kontrola systémů vytápění',
  mpoNumbers: ['2202'], // fyzická osoba – kontrola systémů vytápění
  alumniOf: 'VŠCHT Praha',
  photo: 'kruml-portret',
  avatar: 'kruml-avatar',
  photoAlt: 'Ing. Matěj Kruml, energetický specialista',
  timeline: [
    { from: '2023', to: 'dosud', role: 'Jednatel a energetický specialista', org: 'AMVILI s.r.o.', text: 'Kontroly systémů vytápění pro bytové domy, školy, obce a firmy.' },
    { from: '2024', to: '2025', role: 'Specialista strategie – vodíkové hospodářství', org: 'ČEZ', text: 'Příprava velkých energetických projektů.' },
    { from: '2022', to: '2025', role: 'Vedoucí vodíkové sekce', org: 'Asociace pro akumulaci energie AKU-BAT CZ', text: 'Rozvoj vodíkového hospodářství v ČR.' },
    { from: '2022', to: '2023', role: 'Hlavní technolog', org: 'Jihočeský vodárenský svaz', text: 'Technologie a kvalita pitné vody, investiční příprava.' },
    { from: '2021', to: '2023', role: 'Senior projektový manažer', org: 'Siemens', text: 'Výroba a skladování obnovitelného vodíku.' },
    { from: '2016', to: '2021', role: 'Technolog, projektový manažer', org: 'C-Energy Planá', text: 'Provoz teplárny, údržba a investice.' },
    { from: '2013', to: '2016', role: 'Vědecký pracovník', org: 'Ústav chemických procesů AV ČR', text: 'Čištění spalin a využití popela z kalů.' },
  ],
  achievements: [
    { tag: 'Vodík', title: 'Projekt VOZARTEK', text: 'Projekt, který jako první v ČR získal podporu z Inovačního fondu.' },
    { tag: 'Vodík', title: 'Letiště Praha', text: 'Studie proveditelnosti vodíkového hospodářství.' },
    { tag: 'Vodík', title: 'HyPE pro E.ON', text: 'Basic design a studie proveditelnosti.' },
    { tag: 'Voda', title: 'Úpravna vody Plav', text: 'Automatizace úpravny pro jižní Čechy.' },
    { tag: 'Teplo', title: 'Provoz teplárny', text: 'Řízení procesů, seřízení kotelny, oprava odsíření.' },
    { tag: 'Voda', title: 'Demineralizace', text: 'Úprava vody v energetických provozech.' },
  ],
  linkedin: 'https://www.linkedin.com/in/matej-kruml111/',
  memberOf: { name: 'Asociace energetických specialistů', url: 'https://www.asociacees.cz/profil/1447' },
  site: { label: 'matejkruml.cz', url: 'https://www.matejkruml.cz' },
};

export const petr = {
  id: 'petr',
  name: 'Ing. Petr Michna',
  jobTitle: 'Energetik',
  lead: 'Průkazy energetické náročnosti budov',
  also: ['energetické audity', 'renovační pas', 'energetické poradenství'],
  authorization: null, // TODO po složení zkoušek MPO doplnit { number, scope } – do té doby NIC
  // Fakta z energetikliberec.cz (klient povolil převzetí faktů a fotek) – kariéra potvrzena klientem
  timeline: [
    { from: '2024', to: '2026', role: 'Analytik BI', org: 'FOXON s.r.o., Liberec' },
    { from: '2020', to: '2024', role: '', org: 'Datio Software' },
    { from: '2018', to: '2020', role: '', org: 'AKT plastikářská technologie Čechy' },
  ],
  academy: 'Vede Akademii ES – online přípravu energetických specialistů.',
  area: 'Liberecký kraj, Děčínsko, Mladoboleslavsko a Praha',
  photo: 'michna-portret', // vzdálený obrázek – když se nepodaří stáhnout, zobrazí se monogram
  photoAlt: 'Ing. Petr Michna',
  site: { label: 'energetikliberec.cz', url: 'https://www.energetikliberec.cz/' },
  penbSite: { label: 'nejpenb.cz', url: 'https://nejpenb.vercel.app' },
  // Kontakt specialisty – smí se ukázat JEN u PENB (pokyn klienta)
  phone: '+420 776 766 156',
  phoneHref: 'tel:+420776766156',
  email: 'energetikliberec@gmail.com',
};

// Kontakty Elerys – TODO doplnit. null = skryto, všechny výzvy vedou na poptávkový formulář.
export const contact = {
  phone: null, // TODO '+420 …'
  phoneHref: null,
  email: null, // TODO
  responseTime: 'do jednoho pracovního dne',
};

export const social = { linkedin: null, facebook: null, instagram: null }; // TODO profily značky Elerys

// Web3Forms – access key není tajný (stejný jako na matejkruml.cz a nejpenb.cz)
export const forms = {
  provider: 'web3forms',
  accessKey: 'bd562736-6a42-4413-bbdb-e9dc90aac420',
  endpoint: 'https://api.web3forms.com/submit',
  subject: 'Poptávka – Elerys (web)',
  fromName: 'Web Elerys',
};

// Měření – prázdná ID = žádné tagy se nenačtou (cookie lišta v základním režimu)
export const tracking = {
  googleAdsId: '', conversionForm: '', conversionFormValue: 0, conversionPhone: '', conversionPhoneValue: 0,
  conversionCurrency: 'CZK', ga4Id: '', sklikSemId: '',
};

// Specializované weby skupiny (patička, bloky „Specializovaný web“)
export const sisterSites = {
  heating: { label: 'matejkruml.cz', url: 'https://www.matejkruml.cz', title: 'Kontrola systémů vytápění', text: 'Web Ing. Matěje Krumla: průběh kontroly, podklady, lhůty a reference z bytových domů, škol i firem.' },
  // TODO: po přesměrování domény změnit na https://www.nejpenb.cz
  penb: { label: 'nejpenb.cz', url: 'https://nejpenb.vercel.app', title: 'Průkazy energetické náročnosti', text: 'Web pro průkazy bytů, rodinných domů i celých domů – ceník, postup a poptávka.' },
};

export const quoteTime = 'do 1 pracovního dne';

// ---------------------------------------------------------------------
//  FAKTA Z LEGISLATIVY – ověřeno 6. 11. 2026 (web). Zdroje:
//   [Z]   zákon č. 406/2000 Sb., znění od 1. 8. 2026: https://krajta.slv.cz/2026-08-01/2000/406
//         § 6a odst. 1, 2 (vytápění / klimatizace nad 70 kW), odst. 5 (výjimky); § 7a odst. 1, 2 (PENB, OVM nad 250 m² od 1. 7. 2015);
//         § 9 odst. 1–4 (audit: 2 778 MWh / 23 611 MWh / veřejný sektor 500 MWh / výjimka pod 200 MWh)
//   [Z9a] § 9a odst. 1 písm. a)–f) – energetický posudek: https://www.zakonyprolidi.cz/cs/2000-406 (verze účinná od 1. 11. 2026)
//   [V38] vyhláška č. 38/2022 Sb., účinná 1. 3. 2022, § 4 odst. 2–3 (do 3 let / nejméně 1× za 5 let), § 8 (zpráva, evidenční číslo z evidence MPO):
//         https://www.tzb-info.cz/pravni-predpisy/vyhlaska-c-38-2022-sb-o-kontrole-provozovaneho-systemu-vytapeni-a-kombinovaneho-systemu-vytapeni-a-vetrani
//   [V284] vyhláška č. 284/2022 Sb., účinná 15. 10. 2022, zrušila vyhl. 193/2013 Sb.; § 4 (do 3 let / nejméně 1× za 5 let); § 7 (zpráva):
//         https://www.tzb-info.cz/pravni-predpisy/vyhlaska-c-284-2022-sb-o-kontrole-provozovaneho-systemu-klimatizace-a-kombinovaneho-systemu-klimatizace-a-vetrani
//   [V264] vyhláška č. 264/2020 Sb. ve znění vyhl. č. 222/2024 Sb. (PENB): https://krajta.slv.cz/2020/264 (platnost 10 let, > 25 % obálky)
//   [V183] vyhláška č. 183/2026 Sb., o energetickém auditu a systému hospodaření s energií, účinná od 1. 11. 2026:
//         https://esipa.cz/sbirka/sbsrv.dll/sb?CP=2026s183&DR=SB
//   [V141] vyhláška č. 141/2021 Sb., o energetickém posudku: https://www.epravo.cz/top/zakony/sbirka-zakonu/sb/2021/141
//   [NZÚ] příjem žádostí od 25. 6. 2026, bezúročné úvěry, dotace jen pro zranitelné domácnosti:
//         https://www.tzb-info.cz/134732-od-10-hodin-se-prijimaji-zadosti-nova-zelena-usporam-2026
//         dílčí renovace → renovační pas (vystavuje energetický poradce NZÚ), komplexní → PENB; úvěr RD až 2 mil. Kč komplexní, 750 tis. dílčí:
//         https://novazelenausporam.cz/files/documents/storage/2026/08/17/1786966035_NZU_RD_DL_bezúročný úvěr_2026_web.pdf
//   [EPBD] novela zákona (transpozice EPBD) – připomínkové řízení 10/2026 (převzato z ověřeného configu nejpenb.cz)
//  NEUVÁDÍ SE (neověřeno nebo sporné): výše pokut, částky dotací pro SVJ, interval auditu ve veřejném sektoru nad 500 MWh.
// ---------------------------------------------------------------------
export const facts = {
  law: 'zákon č. 406/2000 Sb., o hospodaření energií',
  lawShort: 'zákon č. 406/2000 Sb.',
  heating: {
    decree: 'vyhláška č. 38/2022 Sb.', decreeGen: 'vyhlášky č. 38/2022 Sb.', threshold: 'nad 70 kW',
    interval: 'nejméně jednou za 5 let', newSystem: 'do 3 let od uvedení do provozu', paragraph: '§ 6a zákona č. 406/2000 Sb.',
  },
  ac: {
    decree: 'vyhláška č. 284/2022 Sb.', decreeGen: 'vyhlášky č. 284/2022 Sb.', from: '15. 10. 2022', replaced: 'vyhlášku č. 193/2013 Sb.',
    threshold: 'nad 70 kW', interval: 'nejméně jednou za 5 let', newSystem: 'do 3 let od uvedení do provozu',
  },
  exceptions: [
    'systém řízený systémem automatizace a řízení budovy, který splňuje zákonné požadavky',
    'systém, který je předmětem smlouvy o energetických službách se zaručeným výsledkem (§ 10e)',
    'vybrané budovy zvláštního určení vyjmenované v zákoně',
  ],
  penb: {
    paragraph: '§ 7a zákona č. 406/2000 Sb.', decree: 'vyhláška č. 264/2020 Sb.', validity: '10 let',
    majorChange: 'změna na více než 25 % celkové plochy obálky budovy',
    publicBuilding: 'budova užívaná orgánem veřejné moci s energeticky vztažnou plochou nad 250 m²',
    amendmentNote: 'Ministerstvo průmyslu a obchodu připravuje novelu zákona o hospodaření energií, která převádí evropskou směrnici o energetické náročnosti budov (EPBD). Na podzim 2026 byla v připomínkovém řízení, účinnost zatím stanovená není.',
  },
  audit: {
    paragraph: '§ 9 zákona č. 406/2000 Sb.', decree: 'vyhláška č. 183/2026 Sb.', decreeFrom: '1. 11. 2026',
    bizAudit: '2 778 MWh', bizInterval: 'jednou za 4 roky', enms: '23 611 MWh', exempt: '200 MWh', publicAudit: '500 MWh',
    basis: 'průměrná roční konečná spotřeba energie za poslední 3 kalendářní roky',
  },
  posudek: { paragraph: '§ 9a zákona č. 406/2000 Sb.', decree: 'vyhláška č. 141/2021 Sb.' },
  nzu: { start: '25. 6. 2026', end: '31. 10. 2029' },
};

// ---------------------------------------------------------------------
//  SLUŽBY – 5 pilířů. Oprávnění (čísla) jen u kontroly vytápění.
// ---------------------------------------------------------------------
export const services = [
  {
    id: 'vytapeni', path: '/kontrola-vytapeni/', label: 'Kontrola systémů vytápění', short: 'Kontrola vytápění', n: '01',
    desc: 'Povinné kontroly zdrojů tepla nad 70 kW pro správce, obce a firmy.', authorized: true, sister: 'heating', image: 'praha-rozdelovac',
    sub: [
      { label: 'Přehled pro organizace', path: '/kontrola-vytapeni/', desc: 'Povinnost, plán a výstup' },
      { label: 'Správci portfolia', path: '/kontrola-vytapeni/spravci-portfolia/', desc: 'Desítky domů v jednom harmonogramu' },
      { label: 'Obce a školy', path: '/kontrola-vytapeni/obce-a-skoly/', desc: 'Areály, předávací stanice, zakázky' },
    ],
  },
  {
    id: 'klimatizace', path: '/kontrola-klimatizace/', label: 'Kontrola klimatizačních systémů', short: 'Kontrola klimatizace', n: '02',
    desc: 'Pravidelná kontrola chlazení nad 70 kW podle vyhlášky č. 284/2022 Sb.', image: 'brno-chodba',
    sub: [{ label: 'Kontrola klimatizace', path: '/kontrola-klimatizace/', desc: 'Kdy, jak často, co obsahuje zpráva' }],
  },
  {
    id: 'penb', path: '/penb/', label: 'Průkaz energetické náročnosti budovy', short: 'PENB', n: '03',
    desc: 'Průkazy pro bytové domy, veřejné a komerční budovy.', sister: 'penb', image: 'praha-fasada',
    sub: [
      { label: 'PENB pro organizace', path: '/penb/', desc: 'Kdy průkaz potřebujete' },
      { label: 'Bytové domy a veřejné budovy', path: '/penb/bytove-domy-a-verejne-budovy/', desc: 'SVJ, družstva, úřady, školy' },
    ],
  },
  {
    id: 'audit', path: '/energeticky-audit/', label: 'Energetický audit a posudek', short: 'Audit a posudek', n: '04',
    desc: 'Audit podle nových pravidel od roku 2026, posudek k dotacím a investicím.', image: 'mk-dilny',
    sub: [
      { label: 'Energetický audit', path: '/energeticky-audit/', desc: 'Kdo ho musí mít a co obsahuje' },
      { label: 'Audit pro obce', path: '/energeticky-audit/obce/', desc: 'Veřejný sektor nad 500 MWh' },
      { label: 'Energetický posudek', path: '/energeticky-posudek/', desc: 'Podklad pro dotace a investice' },
    ],
  },
  {
    id: 'poradenstvi', path: '/energeticke-poradenstvi/', label: 'Energetické poradenství', short: 'Poradenství', n: '05',
    desc: 'Dotace NZÚ, renovační pas, zdroj tepla, fotovoltaika, zateplení.', image: 'jihlava-radiator',
    sub: [
      { label: 'Přehled poradenství', path: '/energeticke-poradenstvi/', desc: 'Od nápadu k investici' },
      { label: 'Dotace NZÚ', path: '/energeticke-poradenstvi/dotace-nzu/', desc: 'Bezúročné úvěry 2026' },
      { label: 'Renovační pas', path: '/energeticke-poradenstvi/renovacni-pas/', desc: 'Plán renovace po etapách' },
      { label: 'Zdroj tepla', path: '/energeticke-poradenstvi/zdroj-tepla/', desc: 'CZT, plyn, tepelné čerpadlo' },
      { label: 'Fotovoltaika', path: '/energeticke-poradenstvi/fotovoltaika/', desc: 'Pro bytové domy a firmy' },
    ],
  },
];
export const serviceById = (id) => services.find((s) => s.id === id);

// Segmenty „Pro koho“
export const segments = [
  { id: 'svj', path: '/pro-koho/svj-a-druzstva/', label: 'SVJ a bytová družstva', desc: 'Co musí výbor zajistit a kdy' },
  { id: 'spravci', path: '/pro-koho/spravci-nemovitosti/', label: 'Správci nemovitostí', desc: 'Jeden plán pro celé portfolio' },
  { id: 'obce', path: '/pro-koho/obce-a-skoly/', label: 'Obce, školy a veřejné budovy', desc: 'Povinnosti, rozpočet, zakázky' },
  { id: 'firmy', path: '/pro-koho/firmy-a-prumysl/', label: 'Firmy a průmysl', desc: 'Audit, kontroly, provozní úspory' },
  { id: 'majitele', path: '/pro-koho/majitele-domu/', label: 'Majitelé domů', desc: 'Rozcestník na specializované weby' },
];

// ---------------------------------------------------------------------
//  KVALIFIKACE (pro zadavatele) – jen ověřené položky; number: null = řádek se nezobrazí
// ---------------------------------------------------------------------
export const qualifications = [
  { label: 'Oprávnění MPO – kontrola provozovaných systémů vytápění (fyzická osoba)', holder: 'Ing. Matěj Kruml', number: '2202', scope: 'vytapeni' },
  { label: 'Oprávnění MPO – kontrola provozovaných systémů vytápění (právnická osoba)', holder: 'AMVILI s.r.o.', number: '2238', scope: 'vytapeni', file: 'rozhodnuti-mpo-opravneni-amvili-2238.pdf' },
  { label: 'Oprávnění pro kontrolu klimatizačních systémů', holder: null, number: null, scope: 'klimatizace' }, // TODO
  { label: 'Oprávnění pro zpracování PENB', holder: null, number: null, scope: 'penb' }, // TODO po zkouškách MPO
  { label: 'Oprávnění pro energetický audit a posudek', holder: null, number: null, scope: 'audit' }, // TODO
  { label: 'Pojištění profesní odpovědnosti', holder: null, number: null, scope: 'firma' }, // TODO limit plnění
];

// Soubory ke stažení pro zadavatele – zobrazí se JEN ty, jejichž soubor existuje v src/assets/files
export const downloads = [
  { label: 'Rozhodnutí MPO o udělení oprávnění AMVILI s.r.o. – kontrola vytápění', file: 'rozhodnuti-mpo-opravneni-amvili-2238.pdf' },
  { label: 'Vzorová zpráva o kontrole systému vytápění (anonymizovaná)', file: 'vzorova-zprava-kontrola-vytapeni.pdf' },
  { label: 'Profil společnosti', file: 'profil-spolecnosti-elerys.pdf' }, // TODO dodat soubor
  { label: 'Výpis z obchodního rejstříku', file: 'vypis-or-amvili.pdf' }, // TODO dodat soubor
  { label: 'Doklad o pojištění odpovědnosti', file: 'pojisteni-odpovednosti.pdf' }, // TODO dodat soubor
];

// ---------------------------------------------------------------------
//  REFERENCE – jen kontrola vytápění, z /home/claude/elerys/src/config.mjs (heating: true).
//  Bez log, recenzí a adres SVJ. year: null = sloupec „Rok“ se nezobrazí (TODO doplnit roky).
// ---------------------------------------------------------------------
export const references = [
  { id: 'litvinov', title: 'Město Litvínov', kind: 'obec', place: 'Litvínov', region: 'Ústecký kraj', scope: '13 objektů města', objects: 13, year: null,
    text: 'Radnice, úřad, zimní stadion, hotel Koldům, sběrný dvůr, hasičská stanice a sportovní areál v jedné zakázce.', image: 'litvinov-koldum', alt: 'Výšková budova hotelu Koldům v Litvínově' },
  { id: 'vysoke', title: 'ISŠ Vysoké nad Jizerou', kind: 'škola', place: 'Vysoké nad Jizerou', region: 'Liberecký kraj', scope: '9 budov areálu', objects: 9, year: null,
    text: 'Školní areál s dílnami a domovem mládeže, plynové kotelny a kaskády kondenzačních kotlů.', image: 'vysoke-skola', alt: 'Hlavní vchod Integrované střední školy ve Vysokém nad Jizerou' },
  { id: 'mkrumlov', title: 'SŠ dopravy, obchodu a služeb Moravský Krumlov', kind: 'škola', place: 'Moravský Krumlov, Polánka, Ivančice', region: 'Jihomoravský kraj', scope: '7 objektů ve třech obcích', objects: 7, year: null,
    text: 'Hlavní budova, domov mládeže, tělocvična, dílny a odloučené pracoviště.', image: 'mk-skola', alt: 'Hlavní budova střední školy v Moravském Krumlově' },
  { id: 'transakta', title: 'Objekty TRANSAKTA', kind: 'firma', place: 'Praha, Lysá nad Labem', region: 'Praha a Středočeský kraj', scope: '6 objektů', objects: 6, year: null,
    text: 'Obchodní dům Bílá labuť, Hotel Royal Palace a další objekty – kotelny, předávací stanice, řízení.', image: 'transakta-labut', alt: 'Budova obchodního domu Bílá labuť v Praze' },
  { id: 'hustopece', title: 'SŠ polytechnická Hustopeče', kind: 'škola', place: 'Hustopeče, Diváky', region: 'Jihomoravský kraj', scope: '3 objekty', objects: 3, year: null,
    text: 'Kotelny školy, domova mládeže a odborného pracoviště včetně řídicího systému.', image: 'hus-dispecink', alt: 'Řídicí systém kotelny na monitoru ve škole v Hustopečích' },
  { id: 'liberec-skola', title: 'SŠ a MŠ Na Bojišti', kind: 'škola', place: 'Liberec', region: 'Liberecký kraj', scope: '3 budovy, dálkové teplo', objects: 3, year: null,
    text: 'Tři školní budovy napojené na dálkové teplo – předávací stanice a otopná soustava.', image: 'lib-skola', alt: 'Historická budova školy Na Bojišti' },
  { id: 'pisek', title: 'Gymnázium Písek', kind: 'škola', place: 'Písek', region: 'Jihočeský kraj', scope: '2 budovy, dálkové teplo', objects: 2, year: null,
    text: 'Předávací stanice s deskovými výměníky a hydraulicky vyvážená otopná soustava.', image: 'pisek-budova', alt: 'Nádvoří historické budovy Gymnázia Písek' },
  { id: 'kladruby', title: 'SŠ chovu koní a jezdectví Kladruby nad Labem', kind: 'škola', place: 'Kladruby nad Labem', region: 'Pardubický kraj', scope: 'plynová kotelna 640 kW', objects: 1, year: null,
    text: 'Kaskáda pěti kondenzačních kotlů; zdroj je vůči skutečné potřebě tepla výrazně předimenzovaný.', image: 'ref-skola-kladruby', alt: 'Budova střední školy v Kladrubech nad Labem v mlze' },
  { id: 'brno', title: 'VOŠ zdravotnická Brno', kind: 'škola', place: 'Brno', region: 'Jihomoravský kraj', scope: 'předávací stanice CZT', objects: 1, year: null,
    text: 'Předávací stanice dálkového tepla – měření tepla, čerpadla, regulace a rozvody.', image: 'brno-stanice', alt: 'Předávací stanice dálkového tepla ve sklepě školy v Brně' },
  { id: 'tabor-skola', title: 'MŠ a ZŠ Tábor', kind: 'škola', place: 'Tábor', region: 'Jihočeský kraj', scope: 'dálkové teplo', objects: 1, year: null,
    text: 'Předávací stanice se čtyřmi směšovacími okruhy a ekvitermní regulací.', image: 'tabor-skola', alt: 'Vchod do budovy mateřské a základní školy v Táboře' },
  { id: 'jihlava', title: 'MG-REAL, administrativní budova', kind: 'firma', place: 'Jihlava', region: 'Kraj Vysočina', scope: 'plynová kotelna', objects: 1, year: null,
    text: 'Kontrola vytápění administrativní budovy společnosti MG-REAL, reality s.r.o.', image: 'ref-mg-real-jihlava', alt: 'Vícepodlažní administrativní budova v Jihlavě' },
  { id: 'wotan', title: 'Wotan Forest, a.s. – provoz Třebovice', kind: 'firma', place: 'Třebovice', region: 'Pardubický kraj', scope: 'biomasa 500 kW', objects: 1, year: null,
    text: 'Kotelna na biomasu pro sušárny řeziva a vytápění provozu.', image: 'wotan-kotel', alt: 'Kotel na biomasu s podávacím zařízením' },
];
// Bytové domy (SVJ, BD) – jen město a orientační počet, nikdy adresa (referenceArchive.cities v matejkruml configu)
export const housingCities = [
  ['Praha', '25+'], ['Karlovy Vary', '12'], ['Jihlava', '10+'], ['Třeboň', '8+'], ['Chomutov', '7'], ['Dačice', '6'], ['Olomouc', '5'],
  ['České Budějovice', '4'], ['Benešov', '3'], ['Jindřichův Hradec', '3'], ['Suchdol nad Lužnicí', '3'],
];
export const housingNote = 'Stavební bytové družstvo Města Třeboň (6 bytových domů) a desítky společenství vlastníků – bez uvedení adres.';

// Realizace Ing. Petra Michny (energetické poradenství, NZÚ) – vzdálené fotky z energetikliberec.cz.
// Zobrazí se JEN když se fotky při buildu podaří stáhnout (lokálně proxy 403 → sekce se nevykreslí).
const EL = 'https://www.energetikliberec.cz/images/realizace/';
export const petrWorks = [
  { image: 'pm-zatepleni', caption: 'Zateplení fasády v rámci NZÚ' },
  { image: 'pm-rekuperace', caption: 'Rekuperace, Turnov' },
  { image: 'pm-tc', caption: 'Tepelné čerpadlo, Rumburk' },
  { image: 'pm-fve', caption: 'Fotovoltaika, Rumburk' },
];

// ---------------------------------------------------------------------
//  OBRÁZKY – zdroje lokálně (abs/src), nebo `url` (stažení při buildu). Zpracované varianty v img-cache/.
// ---------------------------------------------------------------------
export const ORIG = '/home/claude/orig';
const P = '/home/claude/brief/photos/';
export const images = {
  'hero-koldum': { abs: P + 'litvinov-koldum.jpg', widths: [640, 1000, 1600, 2200] },
  'kruml-portret': { abs: '/home/claude/web/src/assets/kruml-portret-studio.jpg', widths: [400, 640, 896] },
  'kruml-avatar': { abs: '/home/claude/web/src/assets/kruml-portret-studio.jpg', extract: { left: 310, top: 217, width: 260, height: 260 }, widths: [160] },
  'vzor-zprava-titul': { abs: '/home/claude/web/src/assets/vzor-zprava-titul.jpg', widths: [320, 560] },
  'rozhodnuti-mpo-titul': { abs: '/home/claude/web/src/assets/rozhodnuti-mpo-titul.jpg', widths: [320, 560] },
  'mereni-kourovodu': { src: 'public/images/real_specialista_mereni_kourovodu.jpg', widths: [480, 800, 1200] },
  'testo-mereni-kotel': { src: 'public/images/real_testo_mereni_kotel.jpg', widths: [480, 800, 1200] },
  'kotelna-kaskada': { src: 'public/images/real_kotelna_kaskada_buderus.jpg', widths: [480, 800, 1200] },
  'praha-rozdelovac': { abs: P + 'praha_kotelna_101146.jpg', widths: [480, 800, 1200, 1600] },
  'praha-fasada': { abs: P + 'praha_kotelna_105202.jpg', widths: [480, 800, 1200, 1600] },
  'praha-cerpadlo': { abs: P + 'praha_kotelna_101830.jpg', widths: [480, 800, 1200] },
  'brno-chodba': { abs: P + 'brno_rozvody_chodba.jpg', widths: [480, 800, 1200, 1600] },
  'brno-stanice-celek': { abs: P + 'brno_stanice_celek.jpg', widths: [480, 800, 1200, 1600] },
  'mk-dilny': { abs: P + 'mkrumlov_dilny.jpg', widths: [480, 800, 1200, 1600] },
  'mk-rozvody': { abs: P + 'mkrumlov_rozvody.jpg', widths: [480, 800, 1200] },
  'jihlava-radiator': { abs: P + 'jihlava_radiator.jpg', widths: [480, 800, 1200, 1600] },
  'vysoke-rozdelovac': { abs: P + 'vysoke-rozdelovac.jpg', widths: [480, 800, 1200] },
  'tabor-stanice': { abs: P + 'tabor-stanice.jpg', widths: [480, 800, 1200] },
  'pisek-budova': { abs: P + 'pisek-budova.jpg', widths: [480, 800, 1200, 1600] },
  'ref-skola-kladruby': { src: 'public/images/ref_kotelna_skola_kladruby.webp', widths: [400, 800, 1100] },
  'ref-mg-real-jihlava': { src: 'public/images/ref_kotelna_mg_real_jihlava.webp', widths: [400, 800, 1100] },
  'brno-stanice': { abs: P + 'brno_stanice.jpg', widths: [480, 800, 1200] },
  'mk-skola': { abs: P + 'mkrumlov_skola.jpg', widths: [480, 800, 1200] },
  'hus-dispecink': { abs: P + 'hustopece_dispecink.jpg', widths: [480, 800, 1200] },
  'vysoke-skola': { abs: P + 'vysoke-skola.jpg', widths: [480, 800, 1200] },
  'tabor-skola': { abs: P + 'tabor-skola.jpg', widths: [480, 800, 1200] },
  'litvinov-koldum': { abs: P + 'litvinov-koldum.jpg', widths: [480, 800, 1200] },
  'wotan-kotel': { abs: P + 'wotan-kotel.jpg', widths: [480, 800, 1200] },
  'transakta-labut': { abs: P + 'transakta-labut.jpg', widths: [480, 800, 1200] },
  'lib-skola': { abs: P + 'liberec_skola.jpg', widths: [480, 800, 1200] },
  // vzdálené (volitelné) – při neúspěšném stažení se nezobrazí
  'michna-portret': { url: 'https://www.energetikliberec.cz/fotomichna.webp', widths: [400, 640], optional: true },
  'pm-zatepleni': { url: EL + 'zatepleni/dotace-nzu-zatepleni-fasady-liberec.webp', widths: [480, 800], optional: true },
  'pm-rekuperace': { url: EL + 'rekuperace/dotace-nzu-rekuperace-zehnder-turnov.webp', widths: [480, 800], optional: true },
  'pm-tc': { url: EL + 'tc/dotace-nzu-tc-rumburk.webp', widths: [480, 800], optional: true },
  'pm-fve': { url: EL + 'fve/dotace-nzu-fve-rumburk.webp', widths: [480, 800], optional: true },
};
export const ogImages = {
  'og-elerys': { abs: P + 'litvinov-koldum.jpg', position: 'centre' },
  'og-vytapeni': { abs: P + 'praha_kotelna_101146.jpg', position: 'centre' },
};

// ---------------------------------------------------------------------
//  NAVIGACE
// ---------------------------------------------------------------------
export const FORM_HREF = '/kontakt/#poptavka';
export const CTA_LABEL = 'Poptat službu';
export const nav = {
  main: [
    { label: 'Služby', mega: true },
    { label: 'Pro koho', children: [...segments.map((s) => ({ label: s.label, href: s.path, desc: s.desc })), { label: 'Energetická péče o budovy', href: '/energeticka-pece-o-budovy/', desc: 'Víceletý plán pro obce a správce' }] },
    { label: 'Reference', href: '/reference/' },
    { label: 'Znalosti', href: '/znalosti/' },
    { label: 'O nás', children: [
      { label: 'O nás', href: '/o-nas/', desc: 'Kdo jsme a jak pracujeme' },
      { label: 'Tým', href: '/tym/', desc: 'Lidé a jejich obory' },
      { label: 'Kariéra', href: '/kariera/', desc: 'Hledáme energetické specialisty' },
      { label: 'Pro zadavatele', href: '/pro-zadavatele/', desc: 'Kvalifikace a reference pro VZ' },
    ] },
  ],
};

export const privacy = {
  retentionInquiry: '1 rok od posledního kontaktu', // TODO potvrdit
  retentionClient: 'smluvní dokumentace po dobu stanovenou účetními a daňovými předpisy',
  effectiveFrom: '2026-11-06',
};

// 301 přesměrování (generuje se do vercel.json)
export const redirects = {
  '/kontakt/': ['poptavka', 'objednat'],
  '/znalosti/': ['blog', 'poradna'],
  '/o-nas/': ['o-firme'],
  '/povinnosti-budov/': ['kalkulacka-povinnosti'],
};
