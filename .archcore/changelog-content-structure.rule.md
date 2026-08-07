---
title: "Changelog Entry Content Structure"
status: accepted
---

## Rule

Every changelog entry **must** follow this structure:

1. **Frontmatter** with `version` (semver string), `date` (YYYY-MM-DD), `title` (short headline), `description` (2–3 sentence preview shown on the listing page), and `product` (`"plugin"` or `"cli"` — determines which tab on `/changelog/` the entry appears under).
2. **Intro paragraph** — 1–2 sentences summarizing the release.
3. **Subsections** using exactly these `h2` headings (in order, include only those that apply):
   - `## Breaking changes` — removed or renamed commands, flags, and behavior that needs reader action
   - `## Improvements` — new features and enhancements
   - `## Fixes` — bug fixes
   - `## Misc` — maintenance, docs, refactoring, dependency updates

Each subsection **must** use a bullet list. Keep bullets concise — one line per change, with inline code for CLI commands or file paths.

WHEN a release removes or renames a public command, flag, or MCP surface, the author **must** open the body with `## Breaking changes` rather than fold the change into `## Improvements`. A reader who skips the entry must still be able to see what stopped working.

The `description` field is **required in practice** — it serves as the preview text on the `/changelog/` listing page. Write 2–3 sentences that summarize the key changes. This is different from `title`, which is a short headline.

The `product` field is **required by schema** — entries without it fail the build. Use `"plugin"` for releases of the AI host plugin (Claude Code / Cursor / Codex CLI / GitHub Copilot CLI) and `"cli"` for releases of the standalone CLI. The listing page renders Plugin and CLI as separate tabs (Plugin first), so the field controls which audience sees the entry.

WHEN the plugin and the CLI ship the same version number, the author **must** write one entry per product and disambiguate the filenames with a `-plugin` or `-cli` suffix. The `version` field stays the bare semver string. See the `adding-changelog-entry` guide for the filename rule.

Images **must** be placed in `public/changelog/` and referenced with absolute paths (`/changelog/image.png`).

Changelog entries are **not** registered in the sidebar — they are not part of the main sidebar. They are accessed via the header "Changelog" link. However, changelog pages use Starlight's standard docs template, so the regular sidebar and "On this page" TOC are visible for navigation context.

## Rationale

Consistent structure makes changelogs scannable. The Breaking changes/Improvements/Fixes/Misc pattern groups changes by user impact (what broke → what's new → what's fixed → everything else). The listing page shows only the description preview with a "Read more" link, so the description must be informative enough to stand on its own. Using the standard docs layout keeps the changelog visually consistent with the rest of the site.

`## Breaking changes` leads because a removed command costs the reader more than a new one gains them. Archcore v0.7.0 removed five of seven plugin slash commands; an entry that listed those removals under "Improvements" would have buried the only part a current user had to act on.

The `product` split exists because the Plugin and CLI ship on independent release cadences and have separate audiences. Mixing both in one stream forced readers to skim past releases that don't apply to them. The cadences are independent but not disjoint: v0.7.0 shipped on both, which is why the same version can need two entries.

## Examples

### Good

```markdown
---
version: "0.2.0"
date: 2026-04-01
title: "Relation Visualization"
description: "This release introduces an interactive relation graph for visualizing document connections. Validation is now faster with parallel file checks. All CLI commands support a new --format json flag for scripting."
product: "cli"
---

Archcore now visualizes document relations as an interactive graph.

## Breaking changes
- `archcore graph` is removed; use `archcore list --graph`

## Improvements
- Interactive relation graph in `archcore list --graph`
- New `--format json` flag for all CLI commands

## Fixes
- `validate` no longer crashes on circular relations
- Correct exit code on missing `.archcore/` directory

## Misc
- Updated MCP server dependencies
```

### Bad

- Using `### Features` or `## New` instead of `## Improvements` — inconsistent heading convention
- Listing a removed command under `## Improvements` — the reader misses the action they must take
- Writing multi-paragraph descriptions per bullet — keep bullets to one line
- One-sentence `description` like "Bug fixes and improvements" — too vague for the listing preview
- Omitting `product` — schema validation fails the build
- Setting `product` to a value other than `"plugin"` or `"cli"` — schema validation fails
- Two entries for the same version with the same filename — one overwrites the other
- Placing images in `src/` instead of `public/changelog/` — images won't resolve at build time
- Adding the entry to the sidebar in `astro.config.mjs` — changelog entries are auto-discovered by the glob loader

## Enforcement

- Schema validation at build time catches missing or mistyped frontmatter fields (`version`, `date`, `title`, `product` required; `description` optional in schema but expected by convention)
- During review, verify subsection headings match the convention and bullets are concise
- During review, verify a release that removed a public surface opens with `## Breaking changes`
- The glob loader in @src/content.config.ts auto-discovers entries — no manual registration needed
