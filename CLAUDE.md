# CLAUDE.md

Read and follow `AGENTS.md` before creating or editing any page, changelog entry, Archcore document, or
component copy in this repository.

The writing policy in `AGENTS.md` uses:

- ISO 24495-1-inspired plain-language principles for everything under `src/content/docs/` and
  `src/content/changelog/`, which is the default style for the site;
- an ASD-STE100-inspired controlled style only for `.archcore/**/*.md`, which exists for machine readers.

Do not claim formal ASD-STE100 or ISO 24495-1 compliance.

## Source of truth

This site documents the Archcore CLI and plugin. Content comes from those repositories and their
`.archcore/` context, never from assumption. Verify a claim against the source repository before
writing it, and omit what you cannot verify.

- CLI: `https://github.com/archcore-ai/cli`
- Plugin: `https://github.com/archcore-ai/plugin`

## Search priority

When researching this site's structure, conventions, or history, search `.archcore/` first
(`list_documents` then `get_document`) before grepping the codebase.

Start with these documents:

- `archcore-docs-site` — site architecture, sections, component overrides, key files
- `content-structure` — the five sidebar groups and which directory each maps to
- `documentation-sources` — the three upstream sources and the accuracy obligation
- `adding-docs-page` — the procedure for a new page
- `adding-changelog-entry` and `changelog-content-structure` — changelog conventions

## Archcore operations

Use the Archcore MCP tools for all `.archcore/` document operations.

- Create with `create_document`, update with `update_document`, remove with `remove_document`.
- Read with `list_documents`, `search_documents`, and `get_document`.
- Manage relations with `add_relation`, `remove_relation`, and `list_relations`.

Do not use direct file-writing tools on `.archcore/` documents.

Treat mounted global documents as read-only. Do not edit them and do not create relations to them.

## Build and test commands

```bash
# Install dependencies
npm install

# Dev server on http://localhost:4321
npm run dev

# Production build; prebuild generates per-page OG images into public/og/
npm run build
```

A production build fails without `PUBLIC_POSTHOG_KEY`. Set `ALLOW_MISSING_ANALYTICS_KEY=1` for a
deliberate build without analytics.

## Stack

Astro 6 and Starlight. Content is `.md` and `.mdx` under `src/content/docs/`. The changelog is a
separate collection under `src/content/changelog/`.

Sidebar, redirects, `head[]` entries, and Starlight component overrides live in `astro.config.mjs`.
Theme tokens and layout live in `src/styles/custom.css`. `DESIGN.md` is the visual and copy-tone source
of truth.

## Adding or moving a page

1. Pick the sidebar group per the `content-structure` rule.
2. Create the file in the matching directory under `src/content/docs/`.
3. Add `title` and `description` frontmatter that satisfy the SEO rules in `AGENTS.md`.
4. Register the page in the `sidebar` array in `astro.config.mjs`. Starlight does not surface an
   unregistered page.
5. When a page moves or is removed, add an entry to the `redirects` table rather than breaking the URL.

## Managed blocks

Archcore delimits a managed block with `<!-- archcore:start -->` and `<!-- archcore:end -->` HTML
comments. Do not edit content inside one. Keep repository-specific instructions outside it.
