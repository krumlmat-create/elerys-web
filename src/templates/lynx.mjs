// Emblém rysa ELERYS (podle původního loga elerys_rys_final.svg) – čisté vektory, bez textu
// stroke = hlavní obrys, accent = „elektrické“ linky, fill = oči/nos
export function lynx({ stroke = '#162E4D', accent = '#2563EB', cls = 'lynx', w = 46, label = '' } = {}) {
  const h = Math.round((w * 290) / 230);
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="${cls}" ${a11y} width="${w}" height="${h}" viewBox="135 25 230 290" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-linecap="round" stroke-linejoin="round">
<line x1="250" y1="88" x2="250" y2="301" stroke="${accent}" stroke-width="3" stroke-dasharray="6 6" opacity=".6"/>
<path d="M250 88 200 158h100Z" stroke="${accent}" stroke-width="4.5"/>
<path d="M200 158 250 135l50 23" stroke="${accent}" stroke-width="4.5"/>
<g stroke="${stroke}" stroke-width="4" fill="${stroke}"><path d="M243 98v14M257 98v14"/><rect x="240" y="112" width="20" height="13" rx="2.5"/><path d="M250 125v10"/></g>
<g stroke="${stroke}" stroke-width="7.5"><path d="M200 158 158 40l92 95M300 158l42-118-92 95M200 158l-45 59 53 59 42 25 42-25 53-59-45-59"/></g>
<g stroke="${accent}" stroke-width="4"><path d="m155 217 39-13M213 152v36h18M345 217l-39-13M295 215l25 9v28M281 238h23v22M208 276h17M292 276h-17"/></g>
<circle cx="320" cy="252" r="5.5" fill="${accent}"/><circle cx="304" cy="260" r="5.5" fill="${accent}"/>
<g fill="${stroke}"><path d="M194 204h37l-24 18zM306 204h-37l24 18zM250 235l-14 23h28z"/></g>
<path d="M250 258v18M225 276h50" stroke="${stroke}" stroke-width="4.5"/>
<path d="M225 276q25 12 50 0" stroke="${accent}" stroke-width="4"/>
</g></svg>`;
}

const inner = (o) => lynx({ ...o, w: 230 }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '').replace('<g stroke-linecap', '<g transform="translate(-135 -25)" stroke-linecap');

// Samostatné soubory (logo pro schema/OG a favicon)
export const logoSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120" width="420" height="120" role="img" aria-labelledby="t"><title id="t">Elerys</title>
<g transform="translate(0 4) scale(.38)">${inner({ stroke: '#0d0e10', accent: '#0d0e10' })}</g>
<text x="112" y="76" font-family="Archivo,Segoe UI,Arial,sans-serif" font-size="54" font-weight="600" letter-spacing="12" fill="#0d0e10">ELERYS</text></svg>`;

export const faviconSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0d0e10"/><g transform="translate(9.5 4) scale(.195)">${inner({ stroke: '#ffffff', accent: '#ffffff' })}</g></svg>`;
