import { site, facts, quoteTime, FORM_HREF } from '../config.mjs';
import { esc, fmtDate, articleSchema, faqSchema } from '../lib/html.mjs';
import { I, CTA, pageHero, sectionHead, faqList, related, ctaBand, obligationsTable, updatedLine } from '../templates/partials.mjs';

const HOME = { name: 'Úvod', path: '/' };
const HUB = { name: 'Znalosti', path: '/znalosti/' };
const D = site.updated;
const a = facts.audit;

// Témata záměrně jiná než na matejkruml.cz (poradna), nejpenb.cz a energetikliberec.cz – viz README.
export const ARTICLES = [
  {
    slug: 'energeticke-povinnosti-budov-2026', tag: 'Přehled', read: 6,
    title: 'Energetické povinnosti budov 2026: přehled pro správce',
    h1: 'Energetické povinnosti budov v roce 2026: přehled pro vlastníky a správce',
    description: 'Energetické povinnosti vlastníků a správců budov v roce 2026: kontroly vytápění a klimatizace, PENB, energetický audit a posudek. Přehled s předpisy.',
    perex: 'Pět povinností, pět různých spouštěčů. Kdo je hlídá odděleně, snadno některou přehlédne. Tady jsou pohromadě.',
    toc: [['spoustece', 'Co povinnost spouští'], ['tabulka', 'Přehled v tabulce'], ['zmeny-2026', 'Co se změnilo v roce 2026'], ['postup', 'Jak s přehledem pracovat']],
    body: () => `
<h2 id="spoustece">Co povinnost spouští</h2>
<p>Energetické povinnosti budov nevznikají ze stejného důvodu. Některé se váží na <strong>technické zařízení</strong> (výkon zdroje tepla nebo chladu), jiné na <strong>událost</strong> (prodej, pronájem, stavba), další na <strong>organizaci</strong> (její roční spotřebu energie) a poslední na <strong>financování</strong> (dotace z veřejných zdrojů).</p>
<ul>
  <li><strong>Zařízení:</strong> kontrola systému vytápění a kontrola klimatizace, obojí u systémů ${facts.heating.threshold}.</li>
  <li><strong>Událost:</strong> průkaz energetické náročnosti při prodeji, pronájmu, nové stavbě nebo větší změně budovy.</li>
  <li><strong>Užívání:</strong> průkaz u budov užívaných orgánem veřejné moci nad 250 m².</li>
  <li><strong>Organizace:</strong> energetický audit a systém hospodaření s energií podle spotřeby.</li>
  <li><strong>Financování:</strong> energetický posudek u projektů podpořených z veřejných programů.</li>
</ul>
<h2 id="tabulka">Přehled v tabulce</h2>
${obligationsTable({ caption: 'Povinnosti podle zákona č. 406/2000 Sb. a vyhlášek' })}
<h2 id="zmeny-2026">Co se změnilo v roce 2026</h2>
<p>Největší změnou jsou <strong>energetické audity</strong>. Povinnost se už neodvíjí od velikosti podniku, ale od průměrné roční konečné spotřeby energie za poslední tři roky. Nová vyhláška o energetickém auditu a systému hospodaření s energií (${esc(a.decree)}) je účinná od ${a.decreeFrom}.</p>
<p>U průkazů energetické náročnosti se připravuje novela zákona, která převádí evropskou směrnici o energetické náročnosti budov. Na podzim 2026 byla v připomínkovém řízení a účinnost zatím stanovená není. Do té doby platí současná pravidla.</p>
<p>Pravidla pro kontroly vytápění (${esc(facts.heating.decree)}) a klimatizace (${esc(facts.ac.decree)}) se v roce 2026 neměnila.</p>
<h2 id="postup">Jak s přehledem pracovat</h2>
<ol>
  <li>Sepište budovy a u každé zdroj tepla a chladu s jmenovitým výkonem.</li>
  <li>Doplňte data poslední kontroly a platnost průkazu, pokud existuje.</li>
  <li>U organizace sečtěte spotřebu energie za tři roky.</li>
  <li>Výsledek porovnejte s tabulkou – nebo použijte naše <a href="/povinnosti-budov/">ověření povinností</a>.</li>
</ol>`,
  },
  {
    slug: 'soupis-zdroju-tepla', tag: 'Kontrola vytápění', read: 5,
    title: 'Soupis zdrojů tepla: první krok před kontrolami',
    h1: 'Soupis zdrojů tepla: první krok před kontrolami vytápění u více budov',
    description: 'Jak správce nebo obec sestaví soupis zdrojů tepla: které údaje sbírat, jak určit výkon nad 70 kW a jak z tabulky vyčíst termíny kontrol vytápění.',
    perex: 'Než objednáte kontroly pro deset nebo padesát budov, potřebujete jednu tabulku. Ušetří čas i peníze – a ukáže, kde lhůta už běží.',
    toc: [['proc', 'Proč začít soupisem'], ['udaje', 'Které údaje sbírat'], ['vykon', 'Jak určit výkon'], ['terminy', 'Z tabulky k harmonogramu']],
    body: () => `
<h2 id="proc">Proč začít soupisem</h2>
<p>U jedné budovy stačí zavolat a domluvit termín. U portfolia se bez přehledu snadno stane, že část domů má kontrolu dvakrát a jiné žádnou. Soupis zdrojů tepla je tabulka, ze které je vidět, které systémy povinnosti podléhají, kdy jim běží lhůta a co je potřeba připravit.</p>
<h2 id="udaje">Které údaje sbírat</h2>
<div class="table-wrap"><table>
  <caption>Doporučené sloupce soupisu</caption>
  <thead><tr><th scope="col">Údaj</th><th scope="col">Kde ho najdete</th></tr></thead>
  <tbody>
    <tr><th scope="row">Budova a adresa</th><td data-label="Kde ho najdete">evidence majetku nebo správy</td></tr>
    <tr><th scope="row">Typ zdroje</th><td data-label="Kde ho najdete">plynový kotel, kaskáda, biomasa, předávací stanice dálkového tepla, tepelné čerpadlo</td></tr>
    <tr><th scope="row">Jmenovitý výkon</th><td data-label="Kde ho najdete">štítek zdroje, revizní zpráva, projekt</td></tr>
    <tr><th scope="row">Rok uvedení do provozu</th><td data-label="Kde ho najdete">předávací protokol, revizní kniha</td></tr>
    <tr><th scope="row">Datum poslední kontroly</th><td data-label="Kde ho najdete">zpráva o kontrole s evidenčním číslem</td></tr>
    <tr><th scope="row">Kontakt na technika</th><td data-label="Kde ho najdete">kdo zajistí přístup do kotelny</td></tr>
  </tbody>
</table></div>
<h2 id="vykon">Jak určit výkon</h2>
<p>Povinnost se týká systémů se jmenovitým výkonem ${facts.heating.threshold}. U kotelny s více kotli, které vytápějí stejnou budovu, je potřeba posuzovat systém jako celek. U budov na dálkovém teple je zdrojem tepla předávací stanice. Pokud údaj na štítku chybí nebo je nečitelný, stačí fotografie zařízení – výkon dohledáme.</p>
<h2 id="terminy">Z tabulky k harmonogramu</h2>
<p>Systémy nad 70 kW se kontrolují ${facts.heating.interval}, nové systémy ${facts.heating.newSystem}. Z data poslední kontroly nebo uvedení do provozu tak u každého řádku vyjde termín. Objekty pak seřadíme podle naléhavosti a seskupíme podle lokalit, aby se kontroly daly provést v co nejméně výjezdech.</p>
<p>Soupis vám připravíme i z neúplných podkladů. Podívejte se, jak <a href="/kontrola-vytapeni/spravci-portfolia/">přebíráme portfolio správců</a> nebo <a href="/kontrola-vytapeni/obce-a-skoly/">areály obcí a škol</a>.</p>`,
  },
  {
    slug: 'penb-ve-verejnych-budovach', tag: 'PENB', read: 4,
    title: 'PENB ve veřejných budovách: úřady a obce',
    h1: 'Průkaz energetické náročnosti ve veřejných budovách',
    description: 'Kdy musí obec, úřad nebo škola mít průkaz energetické náročnosti: budovy užívané orgánem veřejné moci nad 250 m², umístění průkazu a správa více budov.',
    perex: 'U veřejných budov nevzniká povinnost průkazu prodejem nebo pronájmem, ale samotným užíváním. Na to se při správě obecního majetku zapomíná nejčastěji.',
    toc: [['kdy', 'Kdy povinnost vzniká'], ['kde', 'Kde průkaz umístit'], ['vice', 'Obec s více budovami'], ['vyuziti', 'Průkaz jako podklad']],
    body: () => `
<h2 id="kdy">Kdy povinnost vzniká</h2>
<p>Podle ${esc(facts.penb.paragraph)} musí mít průkaz ${esc(facts.penb.publicBuilding)}. Hranice 250 m² platí od 1. 7. 2015, dříve byla 500 m². Orgánem veřejné moci jsou například obecní a krajské úřady nebo státní instituce.</p>
<p>Vedle toho platí obecná pravidla: průkaz je potřeba i u nové stavby, při větší změně budovy (${esc(facts.penb.majorChange)}) a při prodeji nebo pronájmu.</p>
<h2 id="kde">Kde průkaz umístit</h2>
<p>V budově užívané orgánem veřejné moci se průkaz – nebo jeho grafická část – umisťuje na veřejně přístupném a dobře viditelném místě. Typicky u vstupu nebo v prostoru, kudy prochází veřejnost.</p>
<h2 id="vice">Obec s více budovami</h2>
<p>Průkaz platí ${facts.penb.validity}. Dřív skončí, pokud na budově proběhne větší změna nebo se změní způsob vytápění, chlazení či přípravy teplé vody. U obce s několika budovami se proto vyplatí vést přehled platnosti a po každé renovaci zkontrolovat, zda je potřeba průkaz nový.</p>
<h2 id="vyuziti">Průkaz jako podklad</h2>
<p>Průkaz není jen splněná povinnost. Popisuje obálku budovy a technické systémy a navrhuje opatření – je tak dobrým vstupem pro <a href="/energeticky-audit/obce/">energetický audit obce</a> nebo pro přípravu dotačního projektu.</p>
<p>Průkazy pro obce zajišťujeme jako součást <a href="/penb/bytove-domy-a-verejne-budovy/">služby pro veřejné budovy</a>.</p>`,
  },
  {
    slug: 'energeticky-audit-od-roku-2026', tag: 'Energetický audit', read: 6,
    title: 'Energetický audit od roku 2026: kdo ho musí mít',
    h1: 'Energetický audit od roku 2026: kdo ho musí mít',
    description: `Nová pravidla energetického auditu: povinnost podle spotřeby, prahy ${a.publicAudit}, ${a.bizAudit} a ${a.enms}, výpočet za skupinu a vyhláška č. 183/2026 Sb.`,
    perex: 'Velikost firmy už nerozhoduje. Rozhoduje, kolik energie organizace spotřebuje – a u podnikatelů i to, s kým tvoří skupinu.',
    toc: [['princip', 'Nový princip'], ['prahy', 'Prahy spotřeby'], ['vypocet', 'Jak spotřebu spočítat'], ['vyhlaska', 'Nová vyhláška'], ['dalsi', 'Co dělat dál']],
    body: () => `
<h2 id="princip">Nový princip</h2>
<p>Zákon o hospodaření energií dnes váže povinnost auditu a systému hospodaření s energií na <strong>${esc(a.basis)}</strong>. Původní kritérium velkého podniku tak přestalo hrát roli. Některé firmy povinnost ztratily, jiné – zejména energeticky náročné menší provozy – ji nově mají.</p>
<h2 id="prahy">Prahy spotřeby</h2>
<div class="table-wrap"><table>
  <caption>${esc(a.paragraph)} – stav v listopadu 2026</caption>
  <thead><tr><th scope="col">Průměrná roční spotřeba</th><th scope="col">Podnikatel</th><th scope="col">Veřejný sektor</th></tr></thead>
  <tbody>
    <tr><th scope="row">pod ${a.exempt}</th><td data-label="Podnikatel">bez povinnosti</td><td data-label="Veřejný sektor">–</td></tr>
    <tr><th scope="row">nad ${a.publicAudit}</th><td data-label="Podnikatel">–</td><td data-label="Veřejný sektor">energetický audit</td></tr>
    <tr><th scope="row">nad ${a.bizAudit}</th><td data-label="Podnikatel">audit ${a.bizInterval}</td><td data-label="Veřejný sektor">audit ${a.bizInterval}</td></tr>
    <tr><th scope="row">nad ${a.enms}</th><td data-label="Podnikatel">certifikovaný systém hospodaření s energií</td><td data-label="Veřejný sektor">certifikovaný systém hospodaření s energií</td></tr>
  </tbody>
</table></div>
<p>Veřejný sektor zahrnuje stát, kraje, obce, státní příspěvkové organizace, veřejné a státní vysoké školy a Českou národní banku.</p>
<h2 id="vypocet">Jak spotřebu spočítat</h2>
<ol>
  <li>Vezměte konečnou spotřebu všech forem energie – elektřinu, plyn, teplo, paliva, pohonné hmoty – za poslední tři kalendářní roky.</li>
  <li>U podnikatele sečtěte spotřebu celé skupiny, ve které má podíl alespoň 50 % kapitálu nebo hlasovacích práv.</li>
  <li>Spočítejte roční průměr a porovnejte s prahy.</li>
</ol>
<h2 id="vyhlaska">Nová vyhláška</h2>
<p>Náležitosti energetického auditu a systému hospodaření s energií stanoví ${esc(a.decree)}, vydaná v říjnu 2026 a účinná od ${a.decreeFrom}.</p>
<h2 id="dalsi">Co dělat dál</h2>
<p>Pokud vám vychází povinnost, začněte sběrem dat o spotřebě – audit s kvalitními daty je rychlejší a jeho doporučení přesnější. Jak audit zajišťujeme, popisujeme na stránce <a href="/energeticky-audit/">Energetický audit</a>, pro obce na <a href="/energeticky-audit/obce/">Audit pro obce</a>.</p>`,
  },
  {
    slug: 'nzu-2026-pro-svj-a-druzstva', tag: 'Dotace', read: 5,
    title: 'Nová zelená úsporám 2026 pro SVJ a družstva',
    h1: 'Nová zelená úsporám 2026 pro SVJ a bytová družstva',
    description: 'Jak mohou SVJ a bytová družstva využít Novou zelenou úsporám 2026: bezúročný úvěr, podklady pro dílčí a komplexní renovaci a rozhodování shromáždění.',
    perex: 'Pro bytové domy se program změnil z dotace na bezúročný úvěr. Pro společenství to znamená jiné rozhodování – a jiné podklady.',
    toc: [['zmena', 'Co se změnilo'], ['kdo', 'Kdo může žádat'], ['podklady', 'Jaké podklady dům potřebuje'], ['shromazdeni', 'Jak to projde shromážděním']],
    body: () => `
<h2 id="zmena">Co se změnilo</h2>
<p>Program Nová zelená úsporám přijímá žádosti od ${facts.nzu.start}. Hlavní formou podpory je <strong>bezúročný úvěr</strong>: úroky a náklady úvěru hradí stát, žadatel splácí jistinu. Úvěry poskytují zapojené banky a stavební spořitelny. Přímá dotace zůstala vyhrazená ekonomicky znevýhodněným domácnostem.</p>
<h2 id="kdo">Kdo může žádat</h2>
<p>O úvěr mohou žádat vlastníci rodinných domů, <strong>společenství vlastníků jednotek</strong> a <strong>bytová družstva</strong>. Žádosti se podávají elektronicky přes portál Státního fondu životního prostředí, a to do ${facts.nzu.end} nebo do vyčerpání prostředků.</p>
<h2 id="podklady">Jaké podklady dům potřebuje</h2>
<ul>
  <li><strong>Dílčí renovace</strong> – například jen okna, střecha nebo zdroj tepla: <a href="/energeticke-poradenstvi/renovacni-pas/">renovační pas</a>.</li>
  <li><strong>Komplexní renovace</strong>: <a href="/penb/bytove-domy-a-verejne-budovy/">průkaz energetické náročnosti</a>.</li>
</ul>
<p>Limity úvěru a další podmínky se liší podle typu domu a rozsahu a program je během trvání upravuje. Před podáním je vždy ověřujeme v aktuálních dokumentech na novazelenausporam.cz.</p>
<h2 id="shromazdeni">Jak to projde shromážděním</h2>
<p>Úvěr znamená, že dům bude splácet – shromáždění proto chce vidět, co se udělá, kolik to stojí a jak se to projeví na příspěvcích do fondu oprav. Doporučujeme předložit:</p>
<ol>
  <li>plán etap renovace s pořadím a odhadem nákladů,</li>
  <li>srovnání splátky úvěru s očekávanou úsporou energie,</li>
  <li>harmonogram, který počítá s topnou sezonou a s ostatními opravami domu.</li>
</ol>
<p>Podklady připravíme v rámci <a href="/energeticke-poradenstvi/dotace-nzu/">poradenství k NZÚ</a>.</p>`,
  },
  {
    slug: 'vymena-zdroje-tepla', tag: 'Poradenství', read: 5,
    title: 'Výměna zdroje tepla v bytovém domě nebo obci',
    h1: 'Výměna zdroje tepla v bytovém domě nebo obecní budově: jak rozhodnout',
    description: 'Jak rozhodnout o výměně zdroje tepla v bytovém domě, škole nebo úřadu: skutečná potřeba tepla, teploty soustavy, zateplení a srovnání provozních nákladů.',
    perex: 'Kotel na konci životnosti tlačí k rychlému rozhodnutí. Pár otázek předem ušetří desítky let provozu na špatně zvoleném zdroji.',
    toc: [['potreba', 'Začněte skutečnou potřebou'], ['soustava', 'Zvládne to otopná soustava?'], ['poradi', 'Zateplení před zdrojem'], ['naklady', 'Porovnávejte provoz, ne štítek'], ['zadani', 'Zadání pro dodavatele']],
    body: () => `
<h2 id="potreba">Začněte skutečnou potřebou</h2>
<p>Při kontrolách vytápění pravidelně vidíme zdroje, které jsou vůči skutečné potřebě tepla výrazně předimenzované – například kaskádu kondenzačních kotlů ve škole. Nový zdroj by měl vycházet z naměřené spotřeby a z výpočtu tepelných ztrát, ne z výkonu toho starého.</p>
<p>Pokud budova má zprávu z <a href="/kontrola-vytapeni/">kontroly systému vytápění</a>, najdete v ní hodnocení dimenzování – výborný výchozí bod.</p>
<h2 id="soustava">Zvládne to otopná soustava?</h2>
<p>Tepelná čerpadla pracují nejlépe s nízkou teplotou otopné vody. Starší soustavy s litinovými tělesy navržené na vysoké teploty mohou potřebovat úpravy. Před rozhodnutím je dobré ověřit, s jakou teplotou soustava v mrazech skutečně vystačí.</p>
<h2 id="poradi">Zateplení před zdrojem</h2>
<p>Pokud dům čeká zateplení nebo výměna oken, potřeba tepla klesne. Zdroj navržený před renovací pak bude zbytečně velký. Když kotel nepočká, navrhujeme řešení, které s budoucím snížením počítá – například modulární kaskádu nebo bivalentní kombinaci.</p>
<h2 id="naklady">Porovnávejte provoz, ne štítek</h2>
<p>Pořizovací cena je jen část nákladů. Do srovnání patří cena energie, servis, životnost, náklady na obnovu a u dálkového tepla i podmínky odpojení. Srovnání připravujeme pro horizont let, aby bylo vidět, kdy se dražší varianta vrátí.</p>
<h2 id="zadani">Zadání pro dodavatele</h2>
<p>Dobré zadání obsahuje požadovaný výkon, teplotní spád, požadavky na regulaci a měření a způsob vyhodnocení nabídek. S přípravou pomůžeme v rámci <a href="/energeticke-poradenstvi/zdroj-tepla/">poradenství k výběru zdroje tepla</a>.</p>`,
  },
];

export const articlePath = (x) => `/znalosti/${x.slug}/`;
export const articleCards = (list) => `<ul class="posts" role="list">
${list.map((x) => `  <li class="post reveal"><a href="${articlePath(x)}"><span class="post-tag">${esc(x.tag)}</span><span class="post-t">${esc(x.title)}</span><span class="post-p">${esc(x.perex)}</span><span class="post-m">${x.read} min čtení ${I.arrow}</span></a></li>`).join('\n')}
</ul>`;

function hub() {
  const P = '/znalosti/';
  const body = `
${pageHero({ kick: 'Znalosti', h1: 'Znalosti pro ty, kdo za budovy odpovídají', lead: 'Články pro výbory, správce, obce a firmy. Fakta ověřujeme v předpisech a u každého článku uvádíme datum kontroly.', cta: [{ href: '/povinnosti-budov/', label: 'Ověřit povinnosti budovy', primary: true }] })}
<section class="section">
  <div class="wrap">
    ${articleCards(ARTICLES)}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Hlubší témata', title: 'Na specializovaných webech' })}
    <div class="prose"><p>Praktické detaily kontroly vytápění – podklady, lhůty, kvalita otopné vody, nejčastější nedostatky – najdete v poradně na <a href="https://www.matejkruml.cz" target="_blank" rel="noopener">matejkruml.cz</a>. Vše o průkazech pro byty a domy na <a href="https://nejpenb.vercel.app" target="_blank" rel="noopener">nejpenb.cz</a>.</p></div>
  </div>
</section>
${ctaBand({})}`;
  return {
    path: P,
    title: 'Znalosti: energetické povinnosti a úspory budov',
    description: 'Články Elerys pro SVJ, správce, obce a firmy: povinnosti budov 2026, energetický audit, PENB ve veřejných budovách, NZÚ pro SVJ, výběr zdroje tepla.',
    crumbs: [HOME, HUB],
    schema: [{ '@type': 'CollectionPage', name: 'Znalosti', url: site.url + P, hasPart: ARTICLES.map((x) => ({ '@type': 'Article', headline: x.h1, url: site.url + articlePath(x) })) }],
    body,
  };
}

const articlePage = (x) => () => {
  const P = articlePath(x);
  const others = ARTICLES.filter((y) => y !== x).slice(0, 3);
  const body = `
${pageHero({ kick: x.tag, h1: esc(x.h1), lead: esc(x.perex), cta: false, meta: `<p class="updated">${x.read} min čtení · Fakta ověřena <time datetime="${D}">${fmtDate(D)}</time></p>` })}
<article class="section">
  <div class="wrap article-grid">
    <aside class="toc" aria-label="Obsah článku">
      <p class="toc-h">Obsah</p>
      <ol>${x.toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol>
      <a class="btn btn-dark btn-sm" href="${FORM_HREF}">${CTA}</a>
    </aside>
    <div class="prose prose-article">
${x.body()}
      <p class="article-note small">Článek vychází z předpisů platných k ${fmtDate(D)}. Nejde o právní radu; konkrétní situaci rádi posoudíme.</p>
    </div>
  </div>
</article>
<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kick: 'Další články', title: 'Pokračujte ve čtení' })}
    ${articleCards(others)}
  </div>
</section>
${ctaBand({})}`;
  return {
    path: P,
    title: x.title,
    description: x.description,
    ogType: 'article',
    crumbs: [HOME, HUB, { name: x.tag, path: P }],
    schema: [articleSchema({ url: P, headline: x.h1, description: x.description, date: D })],
    body,
  };
};

export default [hub, ...ARTICLES.map(articlePage)];
