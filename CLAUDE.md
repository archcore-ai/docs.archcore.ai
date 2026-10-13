# CLAUDE.md

Read and follow `AGENTS.md` before creating or editing any page, Archcore document, or component copy
in this repository.

The writing policy in `AGENTS.md` uses:

- ISO 24495-1-inspired plain-language principles for everything under `src/content/docs/`, which is
  the default style for the site;
- an ASD-STE100-inspired controlled style only for `.archcore/**/*.md`, which exists for machine readers.

Do not claim formal ASD-STE100 or ISO 24495-1 compliance.

## Source of truth

This site documents the Archcore CLI and plugin. Both live in the `archcore-ai/archcore` monorepo:
the CLI under `cli/`, the plugin under `plugin/`, and their shared `.archcore/` context at the
repository root. Content comes from that repository and its `.archcore/` context, never from
assumption. Verify a claim against the source repository before writing it, and omit what you
cannot verify.

- Monorepo: `https://github.com/archcore-ai/archcore` (development on branch `dev`)
- CLI source: `https://github.com/archcore-ai/archcore/tree/dev/cli`
- Plugin source: `https://github.com/archcore-ai/archcore/tree/dev/plugin`
- Published plugin marketplace tree: branch `main`, layout `plugins/archcore/`
- Releases: `https://github.com/archcore-ai/archcore/releases`

## Search priority

When researching this site's structure, conventions, or history, search `.archcore/` first
(`list_documents` then `get_document`) before grepping the codebase.

Start with these documents:

- `archcore-docs-site` — site architecture, sections, component overrides, key files
- `content-structure` — page ownership and the four sidebar groups
- `documentation-sources` — the three upstream sources and the accuracy obligation
- `adding-docs-page` — the procedure for a new page

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

Astro 6 and Starlight. Content is `.md` and `.mdx` under `src/content/docs/`. The site has no
changelog; release notes live on GitHub Releases, and `/changelog/` redirects there.

The sidebar and page redirects live in `src/data/docs-navigation.mjs`. `head[]` entries, Starlight
component overrides, and the changelog redirects live in `astro.config.mjs`.
Theme tokens and layout live in `src/styles/custom.css`. `DESIGN.md` is the visual and copy-tone source
of truth.

## Adding or moving a page

1. Pick the sidebar group per the `content-structure` rule.
2. Create the file in the matching directory under `src/content/docs/`.
3. Add `title` and `description` frontmatter that satisfy the SEO rules in `AGENTS.md`.
4. Register the page in `docsSidebar` in `src/data/docs-navigation.mjs`. Starlight does not surface
   an unregistered page.
5. When a page moves or is removed, add an entry to `migrationTargets` in the same file rather than
   breaking the URL.

## Managed blocks

Archcore delimits a managed block with the HTML comment markers
`archcore:start` and `archcore:end`. Do not edit content inside one. Keep repository-specific instructions outside it.

<!-- archcore:start --> managed by `archcore init`, block v2 — edit outside these markers
## Archcore — project context for this repo

`.archcore/` holds this project's recorded context as typed Markdown files,
`<slug>.<type>.md`, in three categories: knowledge (decisions, rules, contracts,
reference), vision (requirements, plans, research), and experience (lessons from
past work). `list_documents` filters by `category` and `types`.

Before you change, test, or explain code here, call `search_documents` with `for_path` set to the file, and read the rules, decisions, and specs it returns with `get_document`. Accepted rules and decisions bind the change. Without the Archcore MCP tools, read `.archcore/` as Markdown: the `*.rule.md` files first, then grep `.archcore/` for the file name.

1. Once per session, before the first code edit, call `list_documents` with
   `types: ["rule", "cpat"]` and `status: "accepted"`, and read every rule that
   applies to the code you will write. A rule that names no path reaches you this way.
2. Before you state how this system behaves, search the topic. Cite the document,
   or say that none exists.
3. If an accepted document conflicts with the task, tell the user before you edit.
4. If a search is empty, read `near_misses` and retry with fewer words before you
   conclude that no document exists.
5. When a decision is made ("we'll use X", "from now on Y"), record it.
6. When a module, API, or system you touched has no document, offer to capture it.

If the Archcore MCP tools are missing or fail to connect, tell the user once, then
take the file route above. Do not write `.archcore/` files by hand.

A `.archcore/` may also mount read-only **global sources** — shared, org-wide
context. `list_documents` / `search_documents` surface them alongside local docs,
tagged `source_kind: "global"`. When present, treat them as defaults a local doc
can override — never edit or relate to one.

Skip these steps only for turns this repo would have no opinion on: syntax
trivia, throwaway snippets, pure mechanics.
<!-- archcore:end -->
