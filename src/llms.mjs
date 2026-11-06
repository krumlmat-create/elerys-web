// Generuje /llms.txt a /llms-full.txt – stručný faktický přehled webu pro AI vyhledávače a asistenty.
import { site, company, person, petr, facts, services, sisterSites } from './config.mjs';

export default function llms(pages) {
  return `# ${site.brand} – ${site.tagline}

> ${company.brandNote} Elerys zajišťuje pro organizace (SVJ, bytová družstva, správce nemovitostí, obce, školy, firmy) kontroly systémů vytápění a klimatizace, průkazy energetické náročnosti budov, energetické audity, posudky a energetické poradenství. IČO ${company.ico}, sídlo ${company.address.street}, ${company.address.postalCode} ${company.address.locality}.

Aktualizováno: ${site.updated}

## Služby
${services.map((s) => `- ${s.label}: ${s.desc} (${site.url}${s.path})`).join('\n')}

## Tým
- ${person.name} – kontroly systémů vytápění; oprávnění MPO č. ${person.mpoNumbers[0]} (fyzická osoba) a č. ${company.mpoNumber} (${company.legalName}) pro kontrolu provozovaných systémů vytápění.
- ${petr.name} – průkazy energetické náročnosti budov a energetické poradenství.

## Fakta (stav k datu aktualizace)
- Kontrola vytápění: ${facts.heating.paragraph}, ${facts.heating.decree}; systémy ${facts.heating.threshold}, ${facts.heating.interval}, nový systém ${facts.heating.newSystem}.
- Kontrola klimatizace: ${facts.ac.decree}; systémy ${facts.ac.threshold}, ${facts.ac.interval}.
- PENB: ${facts.penb.paragraph}; platnost ${facts.penb.validity}; ${facts.penb.publicBuilding}.
- Energetický audit: ${facts.audit.paragraph}, ${facts.audit.decree} (od ${facts.audit.decreeFrom}); podnikatel nad ${facts.audit.bizAudit} ${facts.audit.bizInterval}, nad ${facts.audit.enms} systém hospodaření s energií, veřejný sektor nad ${facts.audit.publicAudit}.

## Specializované weby
${Object.values(sisterSites).map((s) => `- ${s.label} (${s.url}) – ${s.title}`).join('\n')}

## Stránky
${pages.map((p) => `- [${p.title}](${site.url}${p.path})${p.description ? ` – ${p.description}` : ''}`).join('\n')}
`;
}

const strip = (html) =>
  html
    .replace(/<(script|style|form|nav|svg|noscript)[\s\S]*?<\/\1>/gi, '')
    .replace(/<h1[^>]*>/gi, '\n# ').replace(/<h2[^>]*>/gi, '\n\n## ').replace(/<h3[^>]*>/gi, '\n\n### ')
    .replace(/<\/h[1-3]>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n- ').replace(/<\/(p|div|section|ul|ol|figure|tr)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;| /g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
export function llmsFull(pages) {
  const pick = pages.filter((p) => p.body && !p.noindex && !/ochrana|cookies|kontakt/.test(p.path));
  return `# ${site.brand} – plný text webu\n\nZdroj: ${site.url}/ (aktualizováno ${site.updated}).\n\n` + pick.map((p) => `---\n\nURL: ${site.url}${p.path}\n${strip(p.body)}`).join('\n\n');
}
