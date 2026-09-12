import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { canonicalRoutes, docsSidebar, baseline, docsRedirects, destination } from '../src/data/docs-navigation.mjs';

const origin = 'https://docs.archcore.ai';
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const fileFor = route => `dist${route.endsWith('/') ? route + 'index.html' : route}`;
const htmlFor = route => readFileSync(fileFor(route), 'utf8');
const idsFor = html => new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#38;', '&');
const mainContent = html => html.match(/<div\b[^>]*class="[^"]*sl-markdown-content[^\"]*"[^>]*>([\s\S]*?)<footer\b/)?.[1] ?? html.split('sl-markdown-content')[1] ?? '';

check(canonicalRoutes.length === 15, 'Expected exactly fifteen primary pages.');
check(docsSidebar.map(group => group.label).join('|') === 'Start|Use Archcore|Understand Archcore|Reference', 'Sidebar groups changed.');
const sources = readdirSync('src/content/docs', { recursive: true }).filter(path => /\.mdx?$/.test(path));
check(sources.length === canonicalRoutes.length, 'Unregistered or missing source page.');
const inbound = new Map(canonicalRoutes.map(route => [route, new Set()]));
const titleOwners = new Map();
const descriptionOwners = new Map();

for (const route of canonicalRoutes) {
  check(existsSync(fileFor(route)), `Missing canonical page: ${route}`);
  if (!existsSync(fileFor(route))) continue;
  const html = htmlFor(route);
  const content = mainContent(html);
  check([...html.matchAll(/<h1\b/g)].length === 1, `Expected one H1: ${route}`);
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  check(canonical === origin + route, `Incorrect canonical: ${route} -> ${canonical}`);
  check(!/<(?:PathBadge|PathChooser|CrossLinkCallout)\b/.test(html), `Unrendered component: ${route}`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  check(ids.length === new Set(ids).size, `Duplicate HTML IDs: ${route}`);
  const links = [...content.matchAll(/\bhref="([^"]+)"/g)].map(match => decode(match[1]));
  let outbound = false;
  for (const href of links) {
    const url = new URL(href, origin + route);
    if (url.origin !== origin) continue;
    const resolved = new URL(destination(url.href), origin);
    if (!canonicalRoutes.includes(resolved.pathname)) continue;
    check(!Object.hasOwn(docsRedirects, url.pathname), `Article links to retired route: ${route} -> ${href}`);
    if (resolved.pathname !== route) {
      outbound = true;
      inbound.get(resolved.pathname).add(route);
    }
    if (resolved.hash && existsSync(fileFor(resolved.pathname))) {
      check(idsFor(htmlFor(resolved.pathname)).has(decodeURIComponent(resolved.hash.slice(1))), `Broken article anchor: ${route} -> ${href}`);
    }
  }
  check(outbound, `No contextual outbound link: ${route}`);
  if (route === '/' || route.startsWith('/start/')) {
    check(!/Choose Plugin or CLI|Pick your path|Best for most teams|scope="(?:cli|plugin)"/.test(content), `Component-choice language: ${route}`);
  }
}

for (const [route, sources] of inbound) check(sources.size > 0, `No contextual inbound link: ${route}`);

for (const path of readdirSync('dist', { recursive: true }).filter(path => path.endsWith('.html'))) {
  const html = readFileSync('dist/' + path, 'utf8');
  if (/http-equiv="refresh"/i.test(html) || path === '404.html') continue;
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const description = html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/)?.[1];
  check(Boolean(title), `Missing title: ${path}`);
  check(Boolean(description), `Missing description: ${path}`);
  for (const [value, owners, field] of [[title, titleOwners, 'title'], [description, descriptionOwners, 'description']]) {
    if (!value) continue;
    check(!owners.has(value), `Duplicate ${field}: ${path} and ${owners.get(value)}`);
    owners.set(value, path);
  }
}

for (const page of baseline.pages) {
  const target = new URL(destination(page.route), origin);
  check(existsSync(fileFor(page.route)), `Lost original URL: ${page.route}`);
  const ids = idsFor(htmlFor(target.pathname));
  for (const heading of page.headings) check(ids.has(heading.id), `Lost legacy anchor: ${page.route}#${heading.id}`);
}

for (const [route, target] of Object.entries(docsRedirects)) {
  const html = htmlFor(route);
  check(html.includes('location.hash'), `Redirect drops incoming fragment: ${route}`);
  check(html.includes('noindex'), `Redirect is indexable: ${route}`);
  const resolved = new URL(target, origin);
  check(canonicalRoutes.includes(resolved.pathname), `Redirect chain or missing target: ${route} -> ${target}`);
  if (resolved.hash) check(idsFor(htmlFor(resolved.pathname)).has(resolved.hash.slice(1)), `Missing redirect anchor: ${route} -> ${target}`);
}

for (const bundle of baseline.bundles) {
  check(existsSync('dist' + bundle), `Lost machine bundle: ${bundle}`);
  if (!existsSync('dist' + bundle)) continue;
  const text = readFileSync('dist' + bundle, 'utf8');
  check(text.length > 100, `Empty machine bundle: ${bundle}`);
  check(!/^# (?:Choose Plugin or CLI|CLI Overview|Plugin Overview)$/m.test(text), `Obsolete introduction in bundle: ${bundle}`);
  for (const match of text.matchAll(/https:\/\/docs\.archcore\.ai\/[^\s)<>]+/g)) {
    const url = new URL(match[0]);
    check(existsSync(fileFor(url.pathname)), `Broken bundle URL: ${bundle} -> ${url.pathname}`);
  }
}

const index = readFileSync('dist/llms.txt', 'utf8');
let previous = -1;
for (const route of canonicalRoutes) {
  const position = index.indexOf(`](${origin}${route})`);
  check(position > previous, `Machine navigation order differs: ${route}`);
  previous = position;
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Documentation checks passed: ${canonicalRoutes.length} pages, ${Object.keys(docsRedirects).length} redirects, ${baseline.pages.reduce((n,p) => n + p.headings.length,0)} historical headings, ${baseline.bundles.length} legacy bundles.`);
}
