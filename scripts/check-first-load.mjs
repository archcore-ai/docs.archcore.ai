/**
 * Measures first-load JavaScript per built page and fails over a budget.
 *
 * First load means every .js file the browser fetches before it can run the
 * page: the scripts the HTML references directly, the island component and
 * renderer chunks Astro records in `astro-island` tags, any `modulepreload`
 * link, and everything those chunks statically import. Chunks loaded later on
 * demand (analytics, search indexes) never appear in the HTML, so they are
 * correctly left out.
 *
 * Usage: node scripts/check-first-load.mjs [--budget=<kb>] [--dir=dist]
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, posix } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map(a => a.replace(/^--/, "").split("="))
);
const root = args.dir ?? "dist";
const budgetKb = Number(args.budget ?? 40);

const importsOf = new Map();
const sizeOf = new Map();

const htmlFiles = async (sub = "") => {
  const out = [];
  for (const entry of await readdir(join(root, sub), { withFileTypes: true })) {
    const rel = sub ? posix.join(sub, entry.name) : entry.name;
    if (entry.isDirectory()) out.push(...(await htmlFiles(rel)));
    else if (entry.name.endsWith(".html")) out.push(rel);
  }
  return out;
};

/** Static imports a built chunk pulls in, as paths relative to the build root. */
const chunkImports = async chunk => {
  if (importsOf.has(chunk)) return importsOf.get(chunk);
  let found = [];
  try {
    const code = await readFile(join(root, chunk), "utf8");
    const base = chunk.slice(0, chunk.lastIndexOf("/"));
    found = [
      ...code.matchAll(/(?:from|import)\s*["'](\.\/[^"']+\.js)["']/g),
    ].map(m => `${base}/${m[1].slice(2)}`);
  } catch {
    found = [];
  }
  importsOf.set(chunk, found);
  return found;
};

const closure = async (entry, seen = new Set()) => {
  if (seen.has(entry)) return seen;
  seen.add(entry);
  for (const next of await chunkImports(entry)) await closure(next, seen);
  return seen;
};

const bytes = async chunk => {
  if (sizeOf.has(chunk)) return sizeOf.get(chunk);
  let size = 0;
  try {
    size = (await stat(join(root, chunk))).size;
  } catch {
    size = 0;
  }
  sizeOf.set(chunk, size);
  return size;
};

const pages = [];
for (const file of await htmlFiles()) {
  const html = await readFile(join(root, file), "utf8");
  const entries = new Set(
    [
      ...html.matchAll(/(?:src|href)="(\/[^"]+\.js)"/g),
      ...html.matchAll(/(?:component|renderer)-url="([^"]+\.js)"/g),
    ].map(m => m[1].replace(/^\//, ""))
  );

  const chunks = new Set();
  for (const entry of entries)
    for (const chunk of await closure(entry)) chunks.add(chunk);

  let total = 0;
  for (const chunk of chunks) total += await bytes(chunk);
  pages.push({ file, total, count: chunks.size });
}

pages.sort((a, b) => b.total - a.total);
const kb = n => `${(n / 1024).toFixed(1)} KB`;

console.log(`first-load JavaScript, worst ${Math.min(5, pages.length)} pages:`);
for (const page of pages.slice(0, 5))
  console.log(`  ${kb(page.total).padStart(9)}  ${page.count} file(s)  /${page.file}`);

const worst = pages[0];
if (worst && worst.total > budgetKb * 1024) {
  console.error(
    `\nfirst-load budget exceeded: /${worst.file} ships ${kb(worst.total)}, budget is ${budgetKb} KB raw.`
  );
  process.exit(1);
}
console.log(`\nwithin the ${budgetKb} KB raw budget.`);
