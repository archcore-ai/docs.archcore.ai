---
title: "Document the research and evidence Types and the Three New Relations"
status: draft
tags:
  - "content"
  - "document-types"
  - "relations"
---

## Goal

Bring the docs site up to the vocabulary decided in the shared context on 2026-09-07: the knowledge type `evidence`, the vision type `research`, the relation types `supports`, `contradicts`, and `supersedes`, the rebinding of the `research` expert alias, and one paragraph that states what Archcore stores and what it leaves to the host. Sources of truth, in precedence order per @.archcore/documentation-sources.rule.md: `concepts/research-and-evidence-types` and `architecture/store-not-method-engine` in the mounted global; the CLI v0.8.3 source and release notes for tool behavior; the plugin v0.8.2 release notes for the alias.

Both upstream releases are out: CLI v0.8.3 (2026-09-07, "feat: add research and evidence vocabulary") and plugin v0.8.2 (2026-09-07). Estimates are human-plus-AI hours [assumption]; the phases sum to 4–6 hours.

Facts verified on 2026-09-07 against the sources, used by the tasks below:

- The accepted vocabulary has 21 types: 12 vision, 7 knowledge, 2 experience. Knowledge is `adr`, `rfc`, `rule`, `guide`, `spec`, `doc`, `evidence`. `research` sits in vision next to `rnd`.
- Required sections (CLI `templates/precision.go`): `research` — Goal, Scope, Coverage, Sources, Findings, Synthesis, Open Gaps; `evidence` — Locator, Extract, Notes. Both types carry the ISO prose profile.
- The MCP server instructions (CLI `internal/mcp/server.go`) list 25 pairwise type-selection rules, up from 22; the three new ones are `rnd vs research`, `research vs doc`, `evidence vs statement`. They name the three relation axes: structural, evidential, temporal.
- The cascade notice (CLI `cmd/hook_post_tool_use.go`) follows `implements`, `depends_on`, and `extends` only. The three new relation values do not cascade.
- `update_document` preserves frontmatter keys outside `title`, `status`, `tags` since CLI v0.8.3 (release notes, Fixes). The parser still reads only those three.
- Plugin v0.8.2: `plan research <topic>` produces a `research`; `plan rnd <topic>` fixes the type to `rnd`; `plan evidence` and `document evidence` file one material; on a CLI older than v0.8.3 `plan research` falls back to `rnd` and names the required version.

Out of scope, noted for a separate entry: the docs changelog has no entries for CLI v0.8.0–v0.8.2 or plugin v0.8.0–v0.8.1. This plan adds only the two entries for the research releases.

## Tasks

### Phase 1 — concept pages

1. [x] @src/content/docs/concepts/document-types.md: the count line at the top (line 6) and the `description` frontmatter (line 3) become 21; the decision tree gains both types; a `Research` block after the `RnD` block (line 68) states the closing test (a verdict closes an `rnd`, coverage closes a `research`) and that `research` takes neither `implements` nor `extends`, with `rnd depends_on research` as the canonical link; an `Evidence` block in the Knowledge section after `Doc` (line 375) states the material test (one material, never one statement), the row-first convention, and the source-class tags `source:primary`, `source:secondary`, `source:measurement`, `source:interview`, `source:dataset`.
2. [x] @src/content/docs/concepts/how-it-works.md: the Knowledge table (line 61) gains an `evidence` row and the Vision text gains `research`; the count lines at 34 and 145 become 21. The earlier draft of this task named eight knowledge types and a "knowledge formula"; neither is in the global source, so this task lists seven knowledge types and adds no formula.
3. [x] @src/content/docs/concepts/relations.md: the table (line 12) gains three rows; a short section names the three axes (structural, evidential, temporal) and the direction of each new relation (`supports`: material → statement it backs; `contradicts`: challenger → statement it disputes; `supersedes`: newer → older); a "Research links" pattern under Common patterns (`rnd depends_on research`, `evidence supports research`, `evidence contradicts research`, `evidence supersedes evidence`); the count line at 106 becomes 21. The convention that a `contradicts` edge stays until the disputed body names both materials and the resolution goes here.
4. [x] @src/content/docs/plugin/how-it-works.mdx: the relation cascade note (line 91) adds one sentence that `supports`, `contradicts`, and `supersedes` do not trigger the cascade notice.
5. [x] @src/content/docs/concepts/mental-model.mdx: one paragraph from `architecture/store-not-method-engine` after the "Who does what" table — gates fill and check documents; the method stays with the host. Also the count line at @src/content/docs/concepts/what-is-archcore.mdx line 81.
6. [x] Count sweep, one line each: @src/content/docs/concepts/vs-flat-files.mdx (lines 26 and 89), @src/content/docs/concepts/documents.md (line 124), @src/content/docs/cli/commands.mdx (line 72), @src/content/docs/plugin/skills.mdx (line 212), @src/content/docs/reference/skills.mdx (line 127). After this task no page under @src/content/docs/ states 19 types.

### Phase 2 — reference and product pages

7. [x] @src/content/docs/reference/precision-checks.md: the ISO row of the prose profile table (line 27) gains `research` and `evidence`; the Checked sections table (line 114) gains a `research` row (Goal, Scope, Coverage, Sources, Findings, Synthesis, Open Gaps) and an `evidence` row (Locator, Extract, Notes). Procedure: @.archcore/update-docs-from-cli.task-type.md.
8. [x] @src/content/docs/reference/mcp-tools.md: the `create_document` type parameter (line 262) names both new types; the `add_relation` type enum (line 335) lists all seven values with the axis of each; the tool description states the direction of the three new relations.
9. [x] @src/content/docs/reference/document-format.md: the parser statement on line 6 stays (it reads `title`, `status`, `tags`); one sentence after it states that `update_document` preserves keys it does not own, since CLI v0.8.3.
10. [x] @src/content/docs/cli/mcp-server.mdx: the built-in instructions list (lines 58–66) — 25 pairwise rules with `rnd` vs `research` as an example, seven relation types on three axes, the type catalog with both new types, the selection rules (a verdict closes `rnd`, coverage closes `research`; a material is `evidence`, a statement is not), and the status meanings for `research` and `evidence`.
11. [x] @src/content/docs/plugin/skills.mdx (lines 21, 78, 140) and @src/content/docs/reference/skills.mdx (lines 17, 78, 89, 131–132): the expert-path rows — `research` produces a `research`; `rnd` by name produces an `rnd`; `evidence` files one material; the research instrument row names `research` or `rnd` as its product and `evidence` as an optional product of the gather gate; the `world` need row names the research instrument without fixing the product to `rnd`; the category table adds `research` to Vision and `evidence` to Knowledge. The fallback on an older CLI gets one sentence.

### Phase 3 — changelog

12. [x] @src/content/changelog/0.8.3-cli.md per @.archcore/changelog-content-structure.rule.md and @.archcore/adding-changelog-entry.guide.md: `product: "cli"`, date 2026-09-07; Improvements — two types, three relations, older CLIs reject manifests with the new values, relation tools reject global sources and out-of-project paths; Fixes — `update_document` preserves custom frontmatter fields. The `-cli` suffix keeps the filename distinct from a later plugin v0.8.3.
13. [x] @src/content/changelog/0.8.2-plugin.md: `product: "plugin"`, date 2026-09-07; Breaking changes — `/archcore:plan research` now produces a `research`, `rnd` by name is the migration; Improvements — `plan rnd`, `plan evidence` and `document evidence`, the three relations on CLI ≥ v0.8.3, the fallback on an older CLI, closeout scope includes `research`; Fixes — Cursor post-write advisories, unwritable temp directory. CLI v0.8.2 also exists, so the suffix is required by the rule.

## Status

All 13 tasks were done on 2026-09-07. The build passed with `ALLOW_MISSING_ANALYTICS_KEY=1`; @astro.config.mjs is unchanged; no page under @src/content/docs/ states 19 types, 22 pairwise rules, or four relation types. Two additions beyond the task list, both verified against CLI v0.8.3: the long code block row of @src/content/docs/reference/precision-checks.md now exempts `research` and `evidence`, because neither type is in the CLI's architect-voice set; @src/content/docs/reference/mcp-tools.md states the frontmatter preservation under `update_document`. Found and left out of scope: the "Who does what" table in @src/content/docs/concepts/mental-model.mdx attributes cascade detection to the plugin, while the cascade notice has lived in the CLI since v0.7.0.

## Acceptance Criteria

1. Every page listed above names both types and all seven relation values, and no page under @src/content/docs/ states 19 types, 22 pairwise rules, or four relation types.
2. The plugin changelog entry marks the alias change as breaking and names the migration.
3. The build passes (`npm run build` with `ALLOW_MISSING_ANALYTICS_KEY=1`) and the sidebar order in @astro.config.mjs is unchanged.
4. Every new claim traces to one of the sources in Goal; nothing on a page states a behavior the CLI v0.8.3 source or the plugin v0.8.2 release notes do not carry.

## Declared Delta

- route: `null` (size M) — the package is this existing draft `plan`, resumed on 2026-09-07 at the file-mapping step; no instrument ran.
- Δ: creates=[]; modifies=[]; retires=[]; decision=none; intent_gap=no. The docs repository holds no `spec`, so the page changes are content work, not a capability delta. The product intent is recorded in the global `product/research-direction` (stage 4) and in this plan.
- Π: `machine` for every need — the global RFC and ADR, the CLI v0.8.3 source (`templates/precision.go`, `internal/mcp/server.go`, `cmd/hook_post_tool_use.go`) and release notes, the plugin v0.8.2 release notes and the installed plugin skills. No `user` need remained after grounding.
- M: `stone` — accepted local rules cover the zone (@.archcore/documentation-sources.rule.md, @.archcore/changelog-content-structure.rule.md, @.archcore/plain-language-and-seo.rule.md). Raised the base label from S to M.
- R: none.

## Dependencies

- `concepts/research-and-evidence-types` (global, read-only) — the vocabulary and the conventions the pages restate.
- `architecture/store-not-method-engine` (global, read-only) — the paragraph in task 5.
- `product/research-direction` (global, read-only) — stage 4 is this plan.
- @.archcore/documentation-sources.rule.md — precedence of sources.
- @.archcore/plain-language-and-seo.rule.md — the style every page and entry follows.
- @.archcore/changelog-content-structure.rule.md and @.archcore/adding-changelog-entry.guide.md — the changelog entries.
- @.archcore/update-docs-from-cli.task-type.md — the procedure for tasks 7 to 10.
- CLI v0.8.3 (`https://github.com/archcore-ai/cli/releases/tag/v0.8.3`) and plugin v0.8.2 (`https://github.com/archcore-ai/plugin/releases/tag/v0.8.2`), both published 2026-09-07.
