---
name: actualize-archcore-docs
description: >
  Actualize and sync Archcore documentation site with the .archcore/ context of the archcore-ai/archcore monorepo.
  Use when: "update docs from archcore", "actualize documentation", "sync docs with CLI",
  "check docs are up to date", "compare docs with archcore context", or any request to
  ensure the documentation site reflects the current state of the Archcore CLI.
  This skill reads .archcore/ from both the monorepo (source of truth) and the docs repo,
  compares them with actual documentation pages, and identifies what needs updating.
---

# Actualize Archcore Docs

Sync the Archcore documentation site (`docs.archcore.ai`) with the `.archcore/` context of the `archcore-ai/archcore` monorepo.

**Source of truth**: the `.archcore/` directory at the root of the `archcore-ai/archcore` monorepo (branch `dev`). The monorepo holds the CLI under `cli/` and the plugin under `plugin/`; both share that one `.archcore/`.
**Target**: documentation pages in `src/content/docs/` of the docs repo.

## Prerequisites

The monorepo (`https://github.com/archcore-ai/archcore`) must be available locally.
Ask the user for the path if not provided. Example prompt:

> This skill needs the `archcore-ai/archcore` monorepo locally to read its `.archcore/` context (source of truth).
> Please provide the path to your local clone of `archcore-ai/archcore`, or clone it first:
> `git clone https://github.com/archcore-ai/archcore`

## Workflow

### Step 1: Gather context from both repos

Run these in parallel:

1. **Monorepo `.archcore/`** (source of truth): Use the `Glob` and `Read` tools to read all `.archcore/**/*.md` files from the monorepo path provided by the user. These documents define the actual features, behavior, and capabilities of Archcore.

2. **Docs repo `.archcore/`** (site rules): Use the `mcp__archcore__list_documents` and `mcp__archcore__get_document` MCP tools to read the docs site's own `.archcore/` context. These define how the docs site is structured and maintained.

3. **Current documentation pages**: Use `Glob` to find all `src/content/docs/**/*.{md,mdx}` files and read them.

### Step 2: Build comparison matrix

For each monorepo `.archcore/` document, determine which docs page(s) it maps to.
See `references/mapping-guide.md` for the standard mapping between monorepo archcore document types and docs site sections.

Create a structured comparison:

```
| Monorepo document | Docs Page(s) | Status |
|---|---|---|
| doc-types.doc.md | concepts/document-types.md | needs-update / up-to-date / collision / missing |
```

### Step 3: Classify discrepancies

For each entry in the matrix, classify as:

- **up-to-date** — docs accurately reflect monorepo context. No action needed.
- **needs-update** — monorepo context has changed; docs are stale/outdated/incomplete. Proceed to update.
- **collision** — docs say one thing, the monorepo says another, and it's unclear which is correct or how to reconcile. **Ask the user**.
- **missing** — the monorepo has context that isn't documented at all. Plan a new page or section.
- **deprecated** — docs describe something no longer present in monorepo context. Plan removal or update.

### Step 4: Report findings to user

Present the comparison matrix with clear status for each item. Group by status category.
For collisions, show both versions (monorepo vs docs) and ask the user what to do.

### Step 5: Execute updates

For each item that needs action:

#### Collisions (ask user first)
Present both versions clearly and wait for user decision before proceeding.

#### Needs-update / Deprecated / Missing
Use subagents to make changes:

- **For code, technical implementation, page structure, config changes** (sidebar registration, component updates, MDX/Astro work):
  Use the `documentation-developer` agent (`subagent_type: "documentation-developer"`).

- **For writing, rewriting, or editing documentation text/content** (descriptions, explanations, examples, copy):
  Use the `documentation-writer` agent (`subagent_type: "documentation-writer"`).

When spawning subagents, provide them with:
1. The specific monorepo `.archcore/` document content (source of truth)
2. The current docs page content (what needs changing)
3. The docs site `.archcore/` rules (content-structure, docs-from-cli-context)
4. Clear instructions on what to change and why

### Step 6: Verify

After all updates, re-read the changed files to confirm accuracy.
Run `npm run build` to verify no build errors.

## Rules

1. **Only archcore-specific content.** Do not touch pages or content unrelated to Archcore features/concepts defined in monorepo `.archcore/`.
2. **Never invent information.** All content must come from monorepo `.archcore/` context. If something is ambiguous, ask the user.
3. **Collisions require user input.** Never auto-resolve conflicts between monorepo context and existing docs.
4. **Follow the 4-section structure.** New pages go in the correct section per the content-structure rule: Getting Started, Core Concepts, Integrations, Reference.
5. **Register new pages.** Any new page must be added to the sidebar in `astro.config.mjs`.
