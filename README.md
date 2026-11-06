# Elerys – zastřešující web (www.elerys.cz)

Statický web značky Elerys (AMVILI s.r.o.) pro organizace: SVJ a družstva, správce nemovitostí, obce a školy, firmy, zadavatele veřejných zakázek. Vlastní generátor v Node.js bez frameworku (stejný základ jako nejpenb.cz a matejkruml.cz).

```
npm install        # jen kvůli sharp (zpracování nových fotek); build funguje i bez něj
npm run build      # → dist/ (HTML, obrázky, sitemap.xml, robots.txt, llms.txt) + vercel.json
node check.mjs     # SEO, odkazy, nadpisy, id, labely, JSON-LD, zakázané formulace, čísla oprávnění
node serve.mjs 4175 # lokální server http://localhost:4175
node qa.mjs        # Playwright: všechny stránky na 1280 a 390 px, menu, formulář, ověření povinností, screenshoty do screens/
```

## Struktura

- `src/config.mjs` – **jediné místo** pro firmu, tým, kontakty, služby, fakta z předpisů (se zdroji v komentářích), reference, obrázky a navigaci. `null` = prvek se nezobrazí, `TODO` = potvrdit s klientem.
- `src/pages/*.mjs` – obsah stránek (`home`, `sluzby`, `segmenty`, `firma`, `znalosti`, `basic`, `pravni`).
- `src/templates/` – layout (mega menu, patička), komponenty (`partials.mjs`).
- `src/assets/` – CSS, JS (`site.js`: menu, cookies, formulář, ověření povinností; `motion.js`: GSAP), fonty, soubory ke stažení (`files/` → `/ke-stazeni/`).
- `img-cache/` – zpracované obrázky WebP + `manifest.json`. **Je součástí projektu**, takže build běží i bez zdrojových fotek a bez sharp (ověřeno `NO_SHARP=1 npm run build`).

### Vzdálené obrázky
Položka v `images` s `url` (fotka Ing. Petra Michny a jeho realizace z energetikliberec.cz) se stáhne při buildu přes `fetch` → sharp a uloží do `img-cache/`. Když stažení selže a v cache není (`optional: true`), stránka se vykreslí bez ní (monogram místo portrétu, galerie realizací se skryje). Na Vercelu se stáhne při buildu; pro jistotu je vhodné po prvním úspěšném buildu lokálně (se sítí) commitnout doplněnou `img-cache/`.

## Nasazení na Vercel

1. Projekt (včetně `img-cache/`, bez `dist/`, `node_modules/`, `screens/`) nahrajte do Git repozitáře.
2. Vercel → **Add New → Project → Import**. Framework Preset: **Other**.
3. Build Command a Output Directory nevyplňujte – převezmou se z `vercel.json` (`npm run build`, `dist`).
4. Po nasazení přidejte doménu `www.elerys.cz` a `elerys.cz` přesměrujte 301 na www (Settings → Domains).
5. `site.url` v configu je kanonická doména – canonical, OG, sitemap i JSON-LD se generují vždy z ní (každá stránka má canonical jen sama na sebe).

## Formulář

Web3Forms (stejný access key jako sesterské weby), předmět „Poptávka – Elerys (web)“. Po úspěchu přesměrování na `/dekujeme/` (noindex). Cookie lišta je v základním režimu – měřicí ID v `tracking` jsou prázdná, žádné tagy se nenačítají.

## Pravidla obsahu (hlídá check.mjs)

- Oprávnění MPO se uvádí jen u kontroly vytápění: č. 2202 (Ing. Matěj Kruml) a 2238 (AMVILI s.r.o.), jen na `/kontrola-vytapeni/`, `/tym/`, `/pro-zadavatele/`. Ing. Petr Michna oprávnění zatím nemá – u ostatních služeb neutrální formulace („Elerys zajišťuje“, „zpracuje energetický specialista“). Po udělení doplnit `petr.authorization` a `qualifications`.
- Žádné ceny v Kč (ceník PENB je na nejpenb.cz), žádné recenze, počty klientů, roky na trhu, „zdarma“, „vždy osobně“, „nejlevnější“.
- Telefon/e-mail specialisty jen u PENB (`/penb/…`, `/kontakt/`). Kontakty Elerys jsou `null` → výzvy vedou na formulář.
- Proti kanibalizaci se sesterskými weby: Elerys cílí na organizační záměr (energetické služby pro obce/SVJ/firmy, audit, posudek, kontrola klimatizace, povinnosti budov, péče o budovy, VZ). Stránky kontroly vytápění a PENB jsou kratší přehledy s blokem „Specializovaný web“; žádné spotřebitelské podstránky PENB, žádné městské stránky, „Liberec“ v titulcích je zakázán. Články znalostní báze mají jiná témata než poradna matejkruml.cz, nejpenb.cz a energetikliberec.cz.
