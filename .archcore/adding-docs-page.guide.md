---
title: "Adding a New Documentation Page"
status: accepted
---

## Prerequisites

- Node.js installed
- npm installed
- Project cloned and dependencies installed (`npm install`)

## Steps

1. **Pick the correct sidebar group** — Determine which of the 5 groups the page belongs to per the `content-structure` rule: Start Here, Plugin, CLI, Concepts, or Reference.

2. **Create the file** — Add a new `.md` or `.mdx` file in the matching directory:
   ```
   src/content/docs/<section>/your-page.mdx
   ```
   Section directories: `start/`, `plugin/`, `cli/`, `concepts/`, `reference/`. The Overview page (`index.mdx`) lives at the root of `src/content/docs/`. There is no `agents/` directory — agent integration content lives under `cli/agent-integrations.mdx` and `plugin/supported-hosts.mdx`.

3. **Add Starlight frontmatter** — Every page requires at minimum:
   ```yaml
   ---
   title: Your Page Title
   description: A brief description of the page content.
   ---
   ```

4. **Write content from CLI / plugin context only** — All documentation must be derived from the Archcore source repositories (CLI and Plugin) and their `.archcore/` context. Do not invent features or behaviors not present in the source. See the `docs-from-cli-context` rule.

5. **Register in sidebar** — Add the page to the matching group in the `sidebar` array in `astro.config.mjs`:
   ```js
   { label: 'Your Page Title', slug: 'section/your-page' }
   ```

6. **Preview locally** — Run the dev server and verify the page renders:
   ```bash
   npm run dev
   ```

## Verification

- [ ] Page appears in the correct sidebar group
- [ ] Build succeeds without errors: `npm run build`
- [ ] Content is accurate and sourced from CLI / plugin context

## Common Issues

- **Page not in sidebar** — Forgot to add the entry in `astro.config.mjs`. Starlight requires explicit sidebar registration.
- **Wrong slug** — The slug in the sidebar config must match the file path relative to `src/content/docs/` without the extension.
- **Frontmatter errors** — Missing `title` field causes build failure. Ensure YAML frontmatter is valid and includes required fields.
- **Page belongs to two groups** — A page can be referenced from multiple sidebar groups (the CLI Quick Start appears under both Start Here and CLI), but it lives as a single file. Add a second `{ label, slug }` entry rather than duplicating the file.
