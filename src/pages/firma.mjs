import fs from 'node:fs';
import { company, person, petr, references, housingCities, housingNote, qualifications, downloads, services, sisterSites, facts, quoteTime, FORM_HREF, site } from '../config.mjs';
import { OBJEKTY_UPDATED } from '../data/objekty.mjs';
import { esc, img, hasImg, ext, addrText, fmtDate, faqSchema, serviceSchema, ID } from '../lib/html.mjs';
import { I, CTA, pageHero, sectionHead, block, refCards, refTable, teamTeaser, processList, faqSection, formSection, related, ctaBand, personPhoto, checker, obligationsTable, sisterBlock, updatedLine } from '../templates/partials.mjs';
import { ksvDone, ksvTowns, refRegions } from './home.mjs';

const HOME = { name: 'Úvod', path: '/' };
const fileExists = (f) => fs.existsSync(new URL(`../assets/files/${f}`, import.meta.url));

// ============================================================ /reference/
function reference() {
  const P = '/reference/';
  const body = `
${pageHero({ kick: 'Reference', h1: 'Reference z kontrol vytápění', lead: `Obce, školy, firmy a bytové domy. Uvádíme jen zakázky, které jsme skutečně provedli – instituce a firmy jménem, společenství vlastníků jen městem.`, image: { name: 'litvinov-koldum', pos: '50% 30%' }, cta: [{ href: FORM_HREF, label: CTA, primary: true }, { href: '/pro-zadavatele/', label: 'Tabulka pro zadavatele' }] })}
<section class="glance" aria-label="Čísla z evidence zakázek"><div class="wrap"><dl class="glance-list">
  <div><dt>Objekty s provedenou kontrolou</dt><dd>${ksvDone.length}</dd></div>
  <div><dt>Obce a města</dt><dd>${ksvTowns}</dd></div>
  <div><dt>Kraje u institucí a firem</dt><dd>${refRegions}</dd></div>
  <div><dt>Stav evidence</dt><dd>${fmtDate(OBJEKTY_UPDATED)}</dd></div>
</dl></div></section>
<section class="section">
  <div class="wrap">
    ${sectionHead({ kick: 'Instituce a firmy', title: 'Vybrané zakázky' })}
    ${refCards({ limit: 12 })}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Bytové domy', title: 'Společenství a družstva podle měst' })}
    <div>
      <ul class="city-list" role="list">${housingCities.map(([c, n]) => `<li><span>${esc(c)}</span><b>${esc(n)}</b></li>`).join('')}</ul>
      <p class="small">${esc(housingNote)} Počty jsou orientační (+ znamená nejméně).</p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Ostatní služby', title: 'Reference k dalším službám' })}
    <div class="prose"><p>Na webu Elerys zatím zveřejňujeme reference jen ke kontrolám vytápění, kde je máme doložené fotografiemi a protokoly. Reference k průkazům najdete na <a href="${sisterSites.penb.url}" target="_blank" rel="noopener">nejpenb.cz</a>, realizace Ing. Petra Michny na <a href="${petr.site.url}" target="_blank" rel="noopener">${esc(petr.site.label)}</a>.</p></div>
  </div>
</section>
${ctaBand({ title: 'Chcete referenční kontakt?', text: 'Pro výběrové řízení vám rádi zprostředkujeme kontakt na objednatele z referencí, pokud s tím souhlasí.' })}`;
  return {
    path: P,
    title: 'Reference: obce, školy, firmy a bytové domy',
    description: `Reference Elerys z kontrol systémů vytápění: Město Litvínov, střední školy, TRANSAKTA, Wotan Forest a bytové domy ve ${ksvTowns} obcích.`,
    crumbs: [HOME, { name: 'Reference', path: P }],
    body,
  };
}

// ============================================================ /o-nas/
function onas() {
  const P = '/o-nas/';
  const body = `
${pageHero({ kick: 'O nás', h1: 'Elerys: energetické služby s technickým zázemím', lead: `${esc(company.brandNote)} Spojujeme specialisty na jednotlivé obory, aby organizace mohly energetické povinnosti svých budov řešit na jednom místě.`, image: { name: 'praha-rozdelovac' } })}
${block({ kick: 'Kdo jsme', title: 'Malý tým, jasné odpovědnosti', html: `<p>Za každým oborem stojí konkrétní člověk. Kontroly vytápění vede ${esc(person.name)}, inženýr z ${esc(person.alumniOf)} s praxí v teplárně, vodárenství a energetických projektech. Průkazy energetické náročnosti a poradenství vede ${esc(petr.name)}. Další specialisty hledáme – <a href="/kariera/">kariéra</a>.</p><p>Elerys vznikl jako zastřešující značka pro služby, které jsme dosud nabízeli pod jmény jednotlivých specialistů. Specializované weby zůstávají – pro hloubku jednoho tématu. Elerys je místo pro organizace, které potřebují víc služeb najednou.</p>` })}
${block({ kick: 'Jak pracujeme', title: 'Zásady', alt: true, html: `<ul class="principles">
  <li><strong>Pravdivě.</strong> Neslibujeme úspory, které nelze doložit, a neuvádíme čísla, která nemáme ověřená.</li>
  <li><strong>Srozumitelně.</strong> Každý výstup začíná shrnutím pro toho, kdo rozhoduje – výbor, starostu, ředitele.</li>
  <li><strong>Nezávisle.</strong> Nedodáváme kotle, čerpadla ani elektrárny. Doporučujeme, co dává smysl budově.</li>
  <li><strong>Včas.</strong> Nabídka ${quoteTime}, lhůty hlídáme za klienta.</li>
</ul>` })}
<section class="section">
  <div class="wrap">
    <div class="head-row">${sectionHead({ kick: 'Tým', title: 'Lidé za Elerys' })}<a class="more" href="/tym/">Tým podrobně ${I.arrow}</a></div>
    ${teamTeaser()}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Identifikace', title: 'Fakturační údaje' })}
    <dl class="ident">
      <div><dt>Značka</dt><dd>Elerys</dd></div>
      <div><dt>Provozovatel</dt><dd>${esc(company.legalName)}</dd></div>
      <div><dt>Sídlo</dt><dd>${esc(addrText())}</dd></div>
      <div><dt>IČO</dt><dd>${company.ico}</dd></div>
      <div><dt>DIČ</dt><dd>${company.dic}</dd></div>
      <div><dt>Rejstřík</dt><dd>${esc(company.registry)}</dd></div>
    </dl>
  </div>
</section>
<section class="section section-tight"><div class="wrap sisters-2">${sisterBlock('heating')}${sisterBlock('penb')}</div></section>
${ctaBand({})}`;
  return {
    path: P,
    title: 'O nás – značka Elerys a AMVILI s.r.o.',
    description: 'Elerys je značka AMVILI s.r.o. pro energetické služby organizacím: kontroly, průkazy, audity a poradenství. Kdo jsme, jak pracujeme, identifikace.',
    crumbs: [HOME, { name: 'O nás', path: P }],
    body,
  };
}

// ============================================================ /tym/
function tym() {
  const P = '/tym/';
  const body = `
${pageHero({ kick: 'Tým', h1: 'Lidé, kteří za službami stojí', lead: 'Každý obor má svého garanta. U kontroly vytápění uvádíme čísla oprávnění MPO; u ostatních služeb popisujeme, kdo za nimi stojí, bez čísel oprávnění.' })}
<section class="section" id="matej-kruml">
  <div class="wrap person">
    <figure class="person-photo reveal">${personPhoto(person)}</figure>
    <div class="person-body">
      <p class="kick">${esc(person.lead)}</p>
      <h2>${esc(person.name)}</h2>
      <p class="person-role">${esc(person.jobTitle)}</p>
      <p>Absolvent ${esc(person.alumniOf)}. Před založením AMVILI pracoval jako technolog teplárny, hlavní technolog vodárenského svazu a v energetických projektech pro velké firmy. Kotelny a předávací stanice zná z pohledu provozovatele.</p>
      <dl class="auth">
        <div><dt>Oprávnění MPO č. ${person.mpoNumbers[0]}</dt><dd>kontrola provozovaných systémů vytápění (fyzická osoba)</dd></div>
        <div><dt>Oprávnění MPO č. ${company.mpoNumber}</dt><dd>kontrola provozovaných systémů vytápění – ${esc(company.legalName)}</dd></div>
      </dl>
      <p>Člen <a href="${person.memberOf.url}" target="_blank" rel="noopener">${esc(person.memberOf.name)}</a> · <a href="${person.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${person.site.url}" target="_blank" rel="noopener">${esc(person.site.label)}</a></p>
      <h3>Profesní praxe</h3>
      <ol class="timeline" role="list">${person.timeline.map((t) => `<li><span class="tl-y">${t.from}–${t.to}</span><span class="tl-r"><strong>${esc(t.role)}</strong>, ${esc(t.org)}</span></li>`).join('')}</ol>
      <h3>Vybrané projekty</h3>
      <ul class="wins" role="list">${person.achievements.map((a) => `<li><span class="win-tag">${esc(a.tag)}</span><strong>${esc(a.title)}</strong><span>${esc(a.text)}</span></li>`).join('')}</ul>
    </div>
  </div>
</section>
<section class="section section-alt" id="petr-michna">
  <div class="wrap person">
    <figure class="person-photo reveal">${personPhoto(petr)}</figure>
    <div class="person-body">
      <p class="kick">${esc(petr.lead)}</p>
      <h2>${esc(petr.name)}</h2>
      <p class="person-role">${esc(petr.jobTitle)} · ${esc(petr.also.join(', '))}</p>
      <p>Vede v Elerys průkazy energetické náročnosti budov a energetické poradenství – přípravu podkladů pro audity, renovační plány a dotace Nová zelená úsporám. ${esc(petr.academy)}</p>
      <p>Působí především v oblasti: ${esc(petr.area)}.</p>
      <p><a href="${petr.site.url}" target="_blank" rel="noopener">${esc(petr.site.label)}</a> · <a href="${petr.penbSite.url}" target="_blank" rel="noopener">${esc(petr.penbSite.label)}</a></p>
      <h3>Profesní praxe</h3>
      <ol class="timeline" role="list">${petr.timeline.map((t) => `<li><span class="tl-y">${t.from}–${t.to}</span><span class="tl-r">${t.role ? `<strong>${esc(t.role)}</strong>, ` : ''}${esc(t.org)}</span></li>`).join('')}</ol>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Kariéra', title: 'Hledáme další energetické specialisty' })}
    <div class="prose"><p>Tým chceme rozšířit o specialisty na kontroly, průkazy a audity. <a href="/kariera/">Co nabízíme a jak se ozvat</a>.</p></div>
  </div>
</section>
${ctaBand({})}`;
  return {
    path: P,
    title: 'Tým Elerys: Ing. Matěj Kruml a Ing. Petr Michna',
    description: 'Kdo stojí za službami Elerys: Ing. Matěj Kruml (kontroly vytápění, oprávnění MPO 2202) a Ing. Petr Michna (PENB a poradenství). Praxe a projekty.',
    crumbs: [HOME, { name: 'O nás', path: '/o-nas/' }, { name: 'Tým', path: P }],
    body,
  };
}

// ============================================================ /kariera/
function kariera() {
  const P = '/kariera/';
  const faq = [
    { q: 'Máte vypsané konkrétní pozice?', a: '<p>Momentálně ne. Hledáme lidi průběžně a podobu spolupráce domlouváme individuálně.</p>' },
    { q: 'Musím mít oprávnění MPO?', a: '<p>Pro samostatné zpracování zákonných výstupů ano. Pokud se na zkoušky připravujete, ozvěte se také – domluvíme se, jak může spolupráce vypadat.</p>' },
  ];
  const body = `
${pageHero({ kick: 'Kariéra', h1: 'Hledáme další energetické specialisty', lead: 'Elerys je zatím malý tým. Chceme růst s lidmi, kteří rozumí budovám a technologiím a chtějí dělat zakázky pro obce, správce a firmy pořádně.', cta: [{ href: '#poptavka', label: 'Ozvat se', primary: true }] })}
${block({ kick: 'Koho hledáme', title: 'Obory, ve kterých chceme posílit', html: `<ul>
  <li>kontroly systémů vytápění a klimatizace,</li>
  <li>průkazy energetické náročnosti budov,</li>
  <li>energetické audity a posudky,</li>
  <li>energetické poradenství a dotace.</li>
</ul><p>Neinzerujeme konkrétní pracovní místa ani mzdu. Formu spolupráce – zaměstnání, nebo spolupráce na živnost – a rozsah domluvíme podle situace.</p>` })}
${block({ kick: 'Co nabízíme', title: 'Na čem se domluvíme', alt: true, html: '<ul><li>zakázky pro obce, školy, správce a firmy po celé republice,</li><li>technické zázemí a konzultace s kolegy z praxe v teplárenství a projektech,</li><li>administrativu a obchod, aby se specialista mohl věnovat odborné práci.</li></ul>' })}
${faqSection(faq)}
${formSection({ kick: 'Ozvěte se', title: 'Napište nám o sobě', text: 'Do poznámky napište, v čem se pohybujete a jaké máte oprávnění nebo zkušenosti. Ozveme se do jednoho pracovního dne.', service: 'nevím', org: 'jiné', segment: 'kariera' })}`;
  return {
    path: P,
    title: 'Kariéra: hledáme energetické specialisty',
    description: 'Elerys hledá energetické specialisty pro kontroly, průkazy, audity a poradenství. Bez vymyšlených pozic – napište nám, jak si spolupráci představujete.',
    crumbs: [HOME, { name: 'O nás', path: '/o-nas/' }, { name: 'Kariéra', path: P }],
    schema: [faqSchema(faq)],
    body,
  };
}

// ============================================================ /pro-zadavatele/
function zadavatele() {
  const P = '/pro-zadavatele/';
  const quals = qualifications.filter((q) => q.number);
  const dls = downloads.filter((d) => fileExists(d.file));
  const faq = [
    { q: 'Můžete se zúčastnit podlimitní veřejné zakázky?', a: '<p>Ano. Kvalifikační doklady, které máme, a reference doložíme podle požadavků zadávací dokumentace. Pokud zadavatel požaduje oprávnění pro konkrétní činnost, ověřte si v tabulce kvalifikace, ke které službě ho uvádíme.</p>' },
    { q: 'Uzavíráte rámcové smlouvy?', a: '<p>Ano, u opakovaných služeb – typicky kontrol vytápění v pětiletém cyklu – dává rámcová smlouva s dílčími objednávkami smysl pro obě strany.</p>' },
    { q: 'Podáváte i společnou nabídku?', a: '<p>U rozsáhlých zakázek, které kombinují více oborů, můžeme nabídku podat společně s partnerem nebo s poddodavatelem. Způsob prokázání kvalifikace pak upřesníme podle zadávací dokumentace.</p>' },
    { q: 'Jak rychle dostaneme nabídku?', a: `<p>U poptávky zakázky malého rozsahu pošleme nabídku ${quoteTime}. U formálních řízení se řídíme lhůtou zadavatele.</p>` },
  ];
  const body = `
${pageHero({ kick: 'Pro zadavatele', h1: 'Podklady pro veřejné zakázky v energetice', lead: 'Identifikace dodavatele, ověřená oprávnění, referenční tabulka a dokumenty na jednom místě – ve formě, kterou lze přenést do nabídky nebo průzkumu trhu.', cta: [{ href: '#poptavka', label: 'Poslat výzvu k nabídce', primary: true }, { href: '#reference-tabulka', label: 'Referenční tabulka' }] })}
<section class="section" id="identifikace">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Identifikace', title: 'Dodavatel' })}
    <dl class="ident">
      <div><dt>Obchodní firma</dt><dd>${esc(company.legalName)} (značka Elerys)</dd></div>
      <div><dt>IČO</dt><dd>${company.ico}</dd></div>
      <div><dt>DIČ</dt><dd>${company.dic}</dd></div>
      <div><dt>Sídlo</dt><dd>${esc(addrText())}</dd></div>
      <div><dt>Zápis</dt><dd>${esc(company.registry)}</dd></div>
      <div><dt>Osoba odpovědná za kontroly vytápění</dt><dd>${esc(person.name)}</dd></div>
    </dl>
  </div>
</section>
<section class="section section-alt" id="kvalifikace">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Kvalifikace', title: 'Ověřená oprávnění' })}
    <div>
      <div class="table-wrap"><table>
        <caption>Oprávnění uvádíme jen tam, kde je máme doložená</caption>
        <thead><tr><th scope="col">Oprávnění</th><th scope="col">Držitel</th><th scope="col">Číslo</th></tr></thead>
        <tbody>${quals.map((q) => `<tr><th scope="row">${esc(q.label)}</th><td data-label="Držitel">${esc(q.holder)}</td><td data-label="Číslo">${esc(q.number)}${q.file && fileExists(q.file) ? ` · <a href="/ke-stazeni/${q.file}" download>PDF</a>` : ''}</td></tr>`).join('')}</tbody>
      </table></div>
      <p class="small">Ostatní služby (kontrola klimatizace, PENB, audit, posudek, poradenství) zajišťujeme bez uvedení čísel oprávnění na webu. Pokud zadávací dokumentace požaduje oprávnění pro tyto činnosti, způsob prokázání upřesníme v nabídce.</p>
    </div>
  </div>
</section>
<section class="section" id="reference-tabulka">
  <div class="wrap">
    ${sectionHead({ kick: 'Reference', title: 'Referenční zakázky – kontrola systémů vytápění', lead: 'Objednatelé z řad institucí a firem. Kontakt na objednatele zprostředkujeme na vyžádání se souhlasem objednatele.' })}
    ${refTable()}
    <p class="small">Dále bytové domy (SVJ, družstva) – ${housingCities.slice(0, 6).map(([c, n]) => `${esc(c)} ${esc(n)}`).join(', ')} a další. Celkem ${ksvDone.length} objektů s provedenou kontrolou ve ${ksvTowns} obcích podle evidence zakázek k ${fmtDate(OBJEKTY_UPDATED)}.</p>
  </div>
</section>
${dls.length ? `<section class="section section-alt" id="ke-stazeni">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Ke stažení', title: 'Dokumenty' })}
    <ul class="files" role="list">${dls.map((d) => `<li><a href="/ke-stazeni/${d.file}" download>${I.doc}<span>${esc(d.label)}</span><small>PDF</small></a></li>`).join('')}</ul>
  </div>
</section>` : ''}
${block({ kick: 'Formy spolupráce', title: 'Zakázky malého rozsahu, podlimitní řízení, rámcové smlouvy', html: `<ul class="principles">
  <li><strong>Zakázky malého rozsahu.</strong> Na výzvu k podání nabídky reagujeme ${quoteTime}; nabídku členíme po objektech.</li>
  <li><strong>Podlimitní řízení.</strong> Kvalifikaci a reference doložíme podle zadávací dokumentace.</li>
  <li><strong>Rámcové smlouvy.</strong> Vhodné pro pětiletý cyklus kontrol vytápění nebo průběžnou obnovu průkazů.</li>
  <li><strong>Společná nabídka.</strong> U zakázek kombinujících více oborů lze podat nabídku s partnerem nebo poddodavatelem.</li>
</ul>` })}
${faqSection(faq)}
${formSection({ kick: 'Výzva k nabídce', title: 'Pošlete výzvu nebo zadání', text: 'Do poznámky uveďte předmět zakázky, počet objektů a lhůtu pro podání nabídky. Přílohy (zadávací dokumentaci) pošleme odkazem v odpovědi.', service: 'nevím', org: 'obec / škola / veřejná instituce', segment: 'zadavatel' })}
${related([{ href: '/pro-koho/obce-a-skoly/', label: 'Pro obce a školy' }, { href: '/energeticka-pece-o-budovy/', label: 'Energetická péče o budovy' }, { href: '/reference/', label: 'Reference s fotkami' }])}`;
  return {
    path: P,
    title: 'Pro zadavatele veřejných zakázek v energetice',
    description: 'Podklady pro veřejné zakázky: identifikace AMVILI s.r.o., oprávnění MPO 2202 a 2238 pro kontrolu vytápění, referenční tabulka, rámcové smlouvy.',
    crumbs: [HOME, { name: 'O nás', path: '/o-nas/' }, { name: 'Pro zadavatele', path: P }],
    schema: [faqSchema(faq)],
    body,
  };
}

// ============================================================ /povinnosti-budov/
function povinnosti() {
  const P = '/povinnosti-budov/';
  const faq = [
    { q: 'Jak přesný je výsledek?', a: '<p>Ověření pracuje s hlavními pravidly zákona č. 406/2000 Sb. a prováděcích vyhlášek. Neřeší všechny výjimky a zvláštní případy – ty posoudíme individuálně.</p>' },
    { q: 'Ukládáte odpovědi?', a: '<p>Ne. Výsledek se počítá jen ve vašem prohlížeči. Pokud nám pošlete poptávku, přiložíme k ní shrnutí výsledku.</p>' },
  ];
  const body = `
${pageHero({ kick: 'Nástroj', h1: 'Jaké energetické povinnosti má vaše budova?', lead: 'Pár otázek o budově a organizaci a uvidíte přehled povinností s odkazy na předpisy: kontroly vytápění a klimatizace, průkaz, audit a posudek.', cta: false, meta: updatedLine('zákon č. 406/2000 Sb. a prováděcí vyhlášky') })}
<section class="section section-checker">
  <div class="wrap narrow">${checker({ id: 'checker' })}</div>
</section>
<section class="section section-alt">
  <div class="wrap">
    ${sectionHead({ kick: 'Přehled', title: 'Pravidla, ze kterých ověření vychází' })}
    ${obligationsTable()}
  </div>
</section>
${faqSection(faq)}
${formSection({ title: 'Chcete výsledek ověřit s námi?', segment: P })}`;
  return {
    path: P,
    title: 'Povinnosti budov: ověření za minutu',
    description: 'Interaktivní ověření energetických povinností budovy: kontrola vytápění a klimatizace nad 70 kW, PENB, energetický audit a posudek dle zákona 406/2000 Sb.',
    crumbs: [HOME, { name: 'Povinnosti budov', path: P }],
    schema: [faqSchema(faq), { '@type': 'WebApplication', name: 'Ověření energetických povinností budovy', applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', url: site.url + P, offers: undefined, publisher: { '@id': ID.org } }],
    body,
  };
}

export default [reference, onas, tym, kariera, zadavatele, povinnosti];
