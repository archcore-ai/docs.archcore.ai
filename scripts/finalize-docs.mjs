import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { baseline, docsSidebar, docsRedirects, destination, fragmentRedirects } from '../src/data/docs-navigation.mjs';

const pathFor = route => `dist${route}index.html`;
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Preserve old heading links without exposing obsolete article bodies to search or LLM bundles.
for (const page of baseline.pages) {
  const target = new URL(destination(page.route), 'https://docs.archcore.ai');
  const file = pathFor(target.pathname);
  let html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  const aliases = page.headings.filter(heading => !ids.has(heading.id))
    .map(heading => `<span id="${escape(heading.id)}" class="legacy-anchor" aria-hidden="true"></span>`).join('');
  if (!aliases) continue;
  const anchor = target.hash.slice(1);
  const position = anchor ? html.search(new RegExp(`<h[1-6]\\b[^>]*\\bid="${anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`)) : -1;
  if (position >= 0) html = html.slice(0, position) + aliases + html.slice(position);
  else html = html.replace(/(<div\b[^>]*class="[^"]*sl-markdown-content[^"]*"[^>]*>)/, `$1${aliases}`);
  writeFileSync(file, html);
}

// Static hosting has no HTTP redirect rule that can preserve an incoming fragment.
for (const [route, href] of Object.entries(docsRedirects)) {
  const target = new URL(href, 'https://docs.archcore.ai');
  const base = target.pathname + target.search;
  const fragments = fragmentRedirects[route] ?? {};
  const script = `const fragments=${JSON.stringify(fragments)};location.replace(fragments[location.hash]||(${JSON.stringify(base)}+(location.hash||${JSON.stringify(target.hash)})))`;
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Page moved</title><link rel="canonical" href="${escape(target.href)}"><script>${script}</script><meta http-equiv="refresh" content="0;url=${escape(href)}"></head><body><a href="${escape(href)}">Continue to the documentation</a></body></html>`;
  const file = pathFor(route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

let index = '# Archcore\n\n> Archcore is a git-native context layer for AI coding agents.\n\nInstall Archcore, record project context, and retrieve it as your agent works. Specs are one part of that context.\n';
for (const group of docsSidebar) {
  index += `\n## ${group.label}\n\n`;
  for (const item of group.items) index += `- [${item.label}](https://docs.archcore.ai/${item.slug ? item.slug + '/' : ''})\n`;
}
index += '\n## Text bundles\n\n- [Full documentation](https://docs.archcore.ai/llms-full.txt)\n- [Condensed documentation](https://docs.archcore.ai/llms-small.txt)\n\n## Integrations\n\n- [Integration catalog](https://archcore.ai/integrations/)\n';
writeFileSync('dist/llms.txt', index);
console.log(`Preserved ${baseline.pages.reduce((n, page) => n + page.headings.length, 0)} legacy headings and ${Object.keys(docsRedirects).length} redirect routes.`);
