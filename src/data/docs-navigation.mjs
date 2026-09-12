import { readFileSync } from 'node:fs';

export const docsSidebar = [
  { label: 'Start', items: [
    { label: 'Overview', slug: '' },
    { label: 'Install Archcore', slug: 'start/install' },
    { label: 'Quick start', slug: 'start/quick-start' },
    { label: 'What to expect', slug: 'start/what-to-expect' },
  ] },
  { label: 'Use Archcore', items: [
    { label: 'Commands and examples', slug: 'guides/commands' },
    { label: 'Connect your agent', slug: 'guides/connect-your-agent' },
    { label: 'Integrations', slug: 'guides/integrations' },
    { label: 'Troubleshooting', slug: 'guides/troubleshooting' },
  ] },
  { label: 'Understand Archcore', items: [
    { label: 'Why Archcore', slug: 'concepts/why-archcore' },
    { label: 'Project context', slug: 'concepts/project-context' },
    { label: 'Document types', slug: 'concepts/document-types' },
  ] },
  { label: 'Reference', items: [
    { label: 'CLI commands', slug: 'cli/commands' },
    { label: 'Configuration', slug: 'cli/configuration' },
    { label: 'MCP tools', slug: 'reference/mcp-tools' },
    { label: 'Document format', slug: 'reference/document-format' },
  ] },
];

export const canonicalRoutes = docsSidebar.flatMap(group => group.items.map(item => item.slug ? `/${item.slug}/` : '/'));

export const migrationTargets = {
  '/': '/',
  '/start/choose/': '/start/install/',
  '/start/plugin-quick-start/': '/start/quick-start/',
  '/start/migrate-from-flat-files/': '/guides/commands/#import-existing-instructions',
  '/plugin/overview/': '/guides/commands/',
  '/plugin/install/': '/start/install/',
  '/plugin/supported-hosts/': '/guides/connect-your-agent/#supported-hosts',
  '/plugin/how-it-works/': '/start/what-to-expect/',
  '/plugin/skills/': '/guides/commands/',
  '/plugin/agents/': '/guides/commands/#delegation',
  '/plugin/troubleshooting/': '/guides/troubleshooting/',
  '/cli/overview/': '/',
  '/cli/install/': '/start/install/',
  '/cli/quick-start/': '/start/quick-start/',
  '/cli/commands/': '/cli/commands/',
  '/cli/mcp-server/': '/guides/connect-your-agent/#mcp',
  '/cli/hooks/': '/guides/connect-your-agent/#lifecycle-hooks',
  '/cli/agent-integrations/': '/guides/connect-your-agent/',
  '/cli/global-sources/': '/cli/configuration/#global-sources',
  '/cli/configuration/': '/cli/configuration/',
  '/cli/troubleshooting/': '/guides/troubleshooting/',
  '/concepts/what-is-archcore/': '/',
  '/concepts/mental-model/': '/concepts/project-context/',
  '/concepts/how-it-works/': '/concepts/project-context/',
  '/concepts/documents/': '/concepts/project-context/#documents-and-layout',
  '/concepts/document-types/': '/concepts/document-types/',
  '/concepts/relations/': '/concepts/project-context/#relations',
  '/concepts/vs-flat-files/': '/concepts/why-archcore/#instruction-files',
  '/concepts/use-cases/': '/concepts/why-archcore/#when-to-use-archcore',
  '/reference/document-format/': '/reference/document-format/',
  '/reference/mcp-tools/': '/reference/mcp-tools/',
  '/reference/skills/': '/guides/commands/',
  '/reference/precision-checks/': '/reference/document-format/#precision-checks',
};

export const baseline = JSON.parse(readFileSync(new URL('../../scripts/fixtures/docs-migration-baseline.json', import.meta.url), 'utf8'));

export const fragmentRedirects = {
  '/plugin/install/': {
    '#install-per-host': '/guides/connect-your-agent/#install-per-host',
  },
};

export function destination(href) {
  const initial = new URL(href, 'https://docs.archcore.ai');
  if (initial.hostname !== 'docs.archcore.ai') return href;
  const fragmentTarget = fragmentRedirects[initial.pathname]?.[initial.hash];
  if (fragmentTarget) {
    const target = new URL(fragmentTarget, initial.origin);
    return target.pathname + initial.search + target.hash;
  }
  let route = initial.pathname;
  let fallbackHash = '';
  const seen = new Set();
  while (!canonicalRoutes.includes(route)) {
    if (seen.has(route)) throw new Error(`Redirect cycle at ${route}`);
    seen.add(route);
    const mapped = migrationTargets[route] ?? baseline.redirects[route];
    if (!mapped) break;
    const next = new URL(mapped, initial.origin);
    route = next.pathname;
    fallbackHash = next.hash || fallbackHash;
  }
  return route + initial.search + (initial.hash || fallbackHash);
}

export const docsRedirects = Object.fromEntries(
  [...new Set([...Object.keys(baseline.redirects), ...Object.keys(migrationTargets)])]
    .filter(route => !canonicalRoutes.includes(route))
    .map(route => [route, destination(route)])
);
