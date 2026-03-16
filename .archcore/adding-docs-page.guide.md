---
title: "Adding a New Documentation Page"
status: accepted
---

## Prerequisites

- Node.js installed
- npm installed
- Project cloned and dependencies installed (`npm install`)

## Steps

1. **Pick the correct section** — Determine which of the 4 sections the page belongs to per the content-structure rule: Getting Started, Core Concepts, Integrations, or Reference.

2. **Create the file** — Add a new `.md` file in the appropriate directory:
   ```
   src/content/docs/<section>/your-page.md
   ```
   Section directories: `getting-started/`, `core-concepts/`, `integrations/`, `reference/`.

3. **Add Starlight frontmatter** — Every page requires at minimum:
   ```yaml
   ---
   title: Your Page Title
   description: A brief description of the page content.
   ---
   ```

4. **Write content from CLI context only** — All documentation must be derived from the CLI source code and its context. Do not invent features or behaviors not present in the CLI. See the `docs-from-cli-context` rule.

5. **Register in sidebar** — Add the page to the correct section in the sidebar array in `astro.config.mjs`:
   ```js
   { label: 'Your Page Title', slug: 'section/your-page' }
   ```

6. **Preview locally** — Run the dev server and verify the page renders:
   ```bash
   npm run dev
   ```

## Verification

- [ ] Page appears in the correct sidebar section
- [ ] Build succeeds without errors: `npm run build`
- [ ] Content is accurate and sourced from CLI context

## Common Issues

- **Page not in sidebar** — Forgot to add the entry in `astro.config.mjs`. Starlight requires explicit sidebar registration.
- **Wrong slug** — The slug in the sidebar config must match the file path relative to `src/content/docs/` without the extension.
- **Frontmatter errors** — Missing `title` field causes build failure. Ensure YAML frontmatter is valid and includes required fields.