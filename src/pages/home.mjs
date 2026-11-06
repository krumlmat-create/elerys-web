import { references, services, FORM_HREF } from '../config.mjs';
import { OBJEKTY, OBJEKTY_UPDATED } from '../data/objekty.mjs';
import { esc, img, fmtDate, faqSchema, serviceSchema } from '../lib/html.mjs';
import { CTA, I, sectionHead, pillarGrid, segmentGrid, refCards, teamTeaser, processList, obligationsTable, checker, faqSection, formSection } from '../templates/partials.mjs';
import { ARTICLES, articleCards } from './znalosti.mjs';

// Ověřená čísla z evidence zakázek (CRM) – jen realizované kontroly vytápění
export const ksvDone = OBJEKTY.filter((o) => o[0] === 1 && o[5].includes('KSV'));
export const ksvTowns = new Set(ksvDone.map((o) => o[2])).size;
export const refRegions = new Set(references.map((r) => r.region)).size;

const FAQ = [
  { q: 'Co Elerys dělá a pro koho?', a: '<p>Zajišťujeme energetické služby, které po vlastnících budov vyžaduje zákon o hospodaření energií, a poradenství k úsporám. Pracujeme hlavně pro organizace: společenství vlastníků, bytová družstva, správce nemovitostí, obce, školy a firmy.</p>' },
  { q: 'Můžeme objednat více služeb najednou?', a: '<p>Ano, a dává to smysl. Prohlídku kotelny, sběr podkladů a komunikaci se správcem stačí udělat jednou – například kontrolu vytápění a průkaz energetické náročnosti pro stejný dům. Navrhneme <a href="/energeticka-pece-o-budovy/">víceletý plán péče o budovy</a>.</p>' },
  { q: 'Kdo služby provádí?', a: '<p>Kontroly systémů vytápění vede Ing. Matěj Kruml, který má pro tuto činnost oprávnění MPO (čísla oprávnění uvádíme u <a href="/kontrola-vytapeni/">kontroly vytápění</a>). Průkazy energetické náročnosti a poradenství vede Ing. Petr Michna. Podrobnosti najdete na stránce <a href="/tym/">Tým</a>.</p>' },
  { q: 'Kolik služby stojí?', a: '<p>Cenu stanovujeme podle počtu objektů, typu a výkonu zdrojů a dostupnosti podkladů. Pevnou nabídku pošleme do 1 pracovního dne od poptávky. Ceník průkazů pro byty a domy najdete na specializovaném webu <a href="https://nejpenb.vercel.app" target="_blank" rel="noopener">nejpenb.cz</a>.</p>' },
  { q: 'Účastníte se veřejných zakázek?', a: '<p>Ano. Pro zadavatele máme připravenou <a href="/pro-zadavatele/">stránku s identifikací, kvalifikací a referencemi</a> ve formátu, který se dobře přenáší do nabídky.</p>' },
];

export default function home() {
  const body = `
<header class="hero">
  <div class="hero-bg" aria-hidden="true">${img('hero-koldum', { alt: '', sizes: '100vw', eager: true, pos: '50% 35%' })}</div>
  <div class="wrap hero-in">
    <p class="eyebrow">Elerys · energetické služby pro budovy</p>
    <h1>Energetické povinnosti budov <em>v jednom plánu</em></h1>
    <p class="lead">Kontroly vytápění a klimatizace, průkazy energetické náročnosti, audity a poradenství pro SVJ, správce nemovitostí, obce, školy a firmy.</p>
    <div class="hero-cta">
      <a class="btn btn-primary btn-lg" href="${FORM_HREF}">${CTA}</a>
      <a class="btn btn-ghost-light btn-lg" href="/povinnosti-budov/">Ověřit povinnosti budovy</a>
    </div>
    <ul class="hero-proof" role="list">
      <li><strong>${ksvDone.length}</strong><span>objektů s provedenou kontrolou vytápění</span></li>
      <li><strong>${ksvTowns}</strong><span>obcí a měst, kde jsme kontrolovali</span></li>
      <li><strong>${services.length}</strong><span>oborů služeb pod jednou značkou</span></li>
    </ul>
    <p class="hero-note">Podle evidence zakázek k ${fmtDate(OBJEKTY_UPDATED)}.</p>
  </div>
  <a class="hero-scroll" href="#sluzby" aria-label="Přejít na služby"><span></span></a>
</header>

<section class="section" id="sluzby">
  <div class="wrap">
    <div class="head-row">
      ${sectionHead({ kick: 'Služby', title: 'Pět oborů, jeden partner', lead: 'Každá služba má vlastní přehled pro organizace. Tam, kde máme specializovaný web, na něj odkazujeme pro podrobnosti.' })}
    </div>
    ${pillarGrid()}
  </div>
</section>

<section class="section section-dark" id="pro-koho">
  <div class="wrap">
    ${sectionHead({ kick: 'Pro koho', title: 'Služby podle toho, kdo za budovu odpovídá' })}
    ${segmentGrid({ texts: {
      svj: 'Které kontroly a průkazy musí výbor zajistit a jak to sladit se shromážděním.',
      spravci: 'Desítky domů v jednom harmonogramu, jedna fakturace, přehled lhůt.',
      obce: 'Školy, úřady a sportoviště: povinnosti, rozpočet, veřejné zakázky.',
      firmy: 'Audit podle nových pravidel, kontroly kotelen a chlazení, úspory v provozu.',
      majitele: 'Průkaz pro byt nebo dům a kontrola kotle – rozcestník na naše specializované weby.',
    } })}
  </div>
</section>

<section class="section" id="proc-elerys">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Proč Elerys', title: 'Inženýři z provozu, ne z prezentací', lead: 'Neslibujeme, co neumíme doložit. Tohle o nás doložit umíme.' })}
    <ul class="reasons" role="list">
      <li class="reveal"><h3>Praxe z teplárny a vodárenství</h3><p>Kontroly vede inženýr z VŠCHT, který léta řídil provoz teplárny a technologii úpravy vody. Kotelnu a předávací stanici čteme jako provozovatel.</p></li>
      <li class="reveal"><h3>Reference u obcí, škol a firem</h3><p>Třináct objektů města Litvínova v jedné zakázce, celé školní areály, obchodní dům i kotelna na biomasu. Reference v ${refRegions} krajích s fotkami z místa.</p></li>
      <li class="reveal"><h3>Jeden kontakt pro všechny povinnosti</h3><p>Kontrola vytápění, průkaz, audit i dotační poradenství pod jednou značkou. Podklady sbíráme jednou, termíny hlídáme za vás.</p></li>
      <li class="reveal"><h3>Výstupy, které se dají použít</h3><p>Zprávy s konkrétními doporučeními a pořadím opatření. Zákonné výstupy zapisujeme do evidence ENEX Ministerstva průmyslu a obchodu.</p></li>
    </ul>
  </div>
</section>

<section class="section section-alt" id="spoluprace">
  <div class="wrap">
    ${sectionHead({ kick: 'Jak spolupracujeme', title: 'Od soupisu budov k hlídání lhůt' })}
    ${processList()}
  </div>
</section>

<section class="section" id="povinnosti">
  <div class="wrap">
    <div class="head-row">
      ${sectionHead({ kick: 'Povinnosti budov', title: 'Co zákon po vlastnících budov chce', lead: 'Přehled hlavních povinností podle zákona č. 406/2000 Sb. a prováděcích vyhlášek. Ověřeno k datu aktualizace webu.' })}
    </div>
    ${obligationsTable()}
    <div class="collapse" id="overit">
      <div class="collapse-head">
        <span class="collapse-ico" aria-hidden="true">${I.check}</span>
        <div><p class="collapse-k">Ověření za minutu</p><h3 class="collapse-t">Které povinnosti má vaše budova?</h3><p class="collapse-d">Pět otázek, výsledek s odkazy na předpisy. Bez registrace.</p></div>
        <button type="button" class="btn btn-dark collapse-btn js-only" aria-expanded="false" aria-controls="overit-body"><span class="c-open">Spustit ověření</span><span class="c-close">Skrýt</span></button>
      </div>
      <div class="collapse-body" id="overit-body"><div class="collapse-inner">${checker({ id: 'home-checker', compact: true })}</div></div>
    </div>
  </div>
</section>

<section class="section section-alt" id="reference">
  <div class="wrap">
    <div class="head-row">
      ${sectionHead({ kick: 'Reference', title: 'Kde jsme byli' })}
      <a class="more" href="/reference/">Všechny reference ${I.arrow}</a>
    </div>
    ${refCards({ ids: ['litvinov', 'vysoke', 'transakta'], limit: 3 })}
  </div>
</section>

<section class="section" id="tym">
  <div class="wrap">
    <div class="head-row">
      ${sectionHead({ kick: 'Tým', title: 'Konkrétní lidé za každým oborem' })}
      <a class="more" href="/tym/">O týmu ${I.arrow}</a>
    </div>
    ${teamTeaser()}
  </div>
</section>

<section class="section section-alt" id="znalosti">
  <div class="wrap">
    <div class="head-row">
      ${sectionHead({ kick: 'Znalosti', title: 'Články pro ty, kdo za budovy odpovídají' })}
      <a class="more" href="/znalosti/">Všechny články ${I.arrow}</a>
    </div>
    ${articleCards(ARTICLES.slice(0, 3))}
  </div>
</section>

${faqSection(FAQ)}
${formSection({ title: 'Napište, o jaké budovy jde', segment: 'home' })}`;

  return {
    path: '/',
    title: 'Energetické služby pro SVJ, obce a firmy | Elerys',
    description: 'Kontroly vytápění a klimatizace, PENB, energetické audity a poradenství pro SVJ, správce, obce, školy a firmy. Nabídka do 1 pracovního dne.',
    schema: [
      faqSchema(FAQ),
      ...services.map((s) => serviceSchema({ url: s.path, name: s.label, description: s.desc })),
    ],
    body,
  };
}
