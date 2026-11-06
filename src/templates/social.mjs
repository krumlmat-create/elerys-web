import { social } from '../config.mjs';
import { esc } from '../lib/html.mjs';

export const ICONS = {
  whatsapp: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.2 21.8l5.1-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.9 2c0 1.2.9 2.4 1 2.5.1.2 1.7 2.7 4.2 3.8 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.5-.2z"/></svg>',
  linkedin: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1 0-5zM3 9.75h4V21H3zM9.5 9.75h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.9c0-1.17-.02-2.68-1.63-2.68-1.64 0-1.89 1.28-1.89 2.6V21h-4z"/></svg>',
  facebook: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21z"/></svg>',
  instagram: '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21.4 8.2c-.1-1.5-.4-2.8-1.5-3.9S17.5 2.8 16 2.7C14.4 2.6 9.6 2.6 8 2.7c-1.5.1-2.8.4-3.9 1.5S2.7 6.6 2.6 8.1c-.1 1.6-.1 6.4 0 8 .1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.6.1 6.4.1 8 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.6.1-6.3 0-7.9zM19.3 18a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4A3 3 0 0 1 5.3 18c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3a3 3 0 0 1 1.7-1.7c1.2-.5 4-.4 5.3-.4s4.1-.1 5.3.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.3z"/></svg>',
};
const LABEL = { whatsapp: 'WhatsApp', linkedin: 'LinkedIn', facebook: 'Facebook', instagram: 'Instagram' };

/** Řada ikon profilů (jen když je URL v configu) */
export function socialLinks({ cls = 'social-links' } = {}) {
  const items = Object.entries(social).filter(([, u]) => u);
  if (!items.length) return '';
  return `<ul class="${cls}" role="list">${items
    .map(([k, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${LABEL[k]}">${ICONS[k]}</a></li>`)
    .join('')}</ul>`;
}
