import { company, contact, petr, services, quoteTime, FORM_HREF } from '../config.mjs';
import { esc, addrText, tel, mail, faqSchema } from '../lib/html.mjs';
import { I, CTA, pageHero, sectionHead, leadForm, penbContact, faqList, related } from '../templates/partials.mjs';

const HOME = { name: 'Úvod', path: '/' };

function kontakt() {
  const P = '/kontakt/';
  const direct = [tel('', contact.phone), mail()].filter(Boolean);
  const faq = [
    { q: 'Za jak dlouho se ozvete?', a: `<p>${esc(contact.responseTime[0].toUpperCase() + contact.responseTime.slice(1))}. U více objektů pošleme nabídku s rozpisem po budovách.</p>` },
    { q: 'Co napsat do poptávky?', a: '<p>Typ a počet budov, obec, případně výkon zdrojů tepla a termín. U veřejné zakázky lhůtu pro podání nabídky. Nic dalšího není nutné – doptáme se.</p>' },
  ];
  const body = `
${pageHero({ kick: 'Kontakt', h1: 'Kontakt a poptávka', lead: `Napište, o jaké budovy a služby jde. Nabídku s rozsahem, termínem a cenou pošleme ${quoteTime}.`, cta: false, size: 'tight' })}
<section class="section" id="poptavka">
  <div class="wrap split-form">
    <div class="form-intro">
      <p class="kick">Poptávka</p>
      <h2>Jak se k nám dostanete</h2>
      ${direct.length ? `<p class="contact-direct">${direct.join('<br>')}</p>` : '<p>Nejrychlejší cestou je formulář – poptávka dorazí přímo specialistovi daného oboru.</p>'}
      <dl class="ident ident-compact">
        <div><dt>Provozovatel</dt><dd>${esc(company.legalName)}</dd></div>
        <div><dt>Sídlo</dt><dd>${esc(addrText())}</dd></div>
        <div><dt>IČO / DIČ</dt><dd>${company.ico} / ${company.dic}</dd></div>
        <div><dt>Rejstřík</dt><dd>${esc(company.registryShort)}</dd></div>
      </dl>
      <div class="contact-penb">
        <p class="small">Jen k průkazům energetické náročnosti (PENB) můžete kontaktovat přímo specialistu:</p>
        ${penbContact()}
      </div>
    </div>
    ${leadForm({ heading: 'Poptávka služby', headingTag: 'h2', segment: P, id: 'kontakt' })}
  </div>
</section>
<section class="section section-alt">
  <div class="wrap split-head">
    ${sectionHead({ kick: 'Otázky', title: 'Než napíšete' })}
    ${faqList(faq)}
  </div>
</section>
${related(services.map((s) => ({ href: s.path, label: s.short, text: s.desc })), 'Služby')}`;
  return {
    path: P,
    title: 'Kontakt a poptávka služeb',
    description: `Poptávka kontroly vytápění, klimatizace, PENB, auditu nebo poradenství. Nabídka ${quoteTime}. AMVILI s.r.o., Petrská 1168/29, Praha 1.`,
    crumbs: [HOME, { name: 'Kontakt', path: P }],
    schema: [{ '@type': 'ContactPage', name: 'Kontakt Elerys', url: 'https://www.elerys.cz' + P }, faqSchema(faq)],
    body,
  };
}

function dekujeme() {
  const body = `
${pageHero({ h1: 'Děkujeme, poptávka dorazila', lead: `Ozveme se ${esc(contact.responseTime)}. Pokud jste poslali seznam objektů, připravíme nabídku s rozpisem po budovách.`, cta: [{ href: '/znalosti/', label: 'Mezitím si přečtěte', primary: true }, { href: '/', label: 'Úvodní stránka' }], size: 'tight' })}
<div data-conversion="form"></div>`;
  return {
    path: '/dekujeme/',
    title: 'Děkujeme za poptávku',
    description: 'Poptávka byla odeslána. Ozveme se do jednoho pracovního dne s nabídkou a termínem.',
    crumbs: [HOME, { name: 'Děkujeme', path: '/dekujeme/' }],
    noindex: true,
    body,
  };
}

function notFound() {
  const body = `
${pageHero({ h1: 'Stránka nenalezena', lead: 'Tahle adresa neexistuje nebo se přesunula. Zkuste některý z odkazů níže.', cta: [{ href: '/', label: 'Úvodní stránka', primary: true }, { href: FORM_HREF, label: CTA }], size: 'tight' })}
${related(services.map((s) => ({ href: s.path, label: s.short, text: s.desc })), 'Služby')}`;
  return {
    path: '/404.html',
    file: '404.html',
    title: 'Stránka nenalezena (404)',
    description: 'Požadovaná stránka neexistuje. Pokračujte na přehled služeb Elerys, ověření povinností budovy nebo kontaktní formulář.',
    crumbs: [],
    noindex: true,
    body,
  };
}

export default [kontakt, dekujeme, notFound];
