---
title: "Documentation page ownership and navigation"
status: accepted
---

## Rule

Current authoring policy for the unified Archcore documentation migration authorized on 2026-09-12.

1. The author MUST assign each page to one owning subject in the documentation journey specification.
2. The author MUST use the specification's sidebar groups and page order.
3. The author MUST revise the specification before adding a primary sidebar page.
4. The author MUST present Archcore as one product throughout introductory pages.
5. The author MUST NOT ask readers to choose between the CLI and plugin.
6. WHEN a topic already has an owning page, the author MUST link to that page instead of repeating its explanation.
7. WHEN a page moves, the author MUST preserve its URL and referenced heading IDs.
8. The author MUST keep the integration catalog on archcore.ai and operational guidance in docs.
9. The author MUST retain public command, configuration, tool, and format reference coverage.
10. The author MUST keep changelog entries outside the primary documentation sidebar.
11. The author MUST retain existing machine-bundle URLs during bundle reorganization.

## Rationale

The former five-group policy organized onboarding around component selection. The user authorized one product journey instead.
The normative route set belongs to the linked specification; @astro.config.mjs implements it.
The migration fixture at @scripts/fixtures/docs-migration-baseline.json records existing routes and heading IDs.

## Examples

An explanation of context retrieval belongs to What to expect. Manual MCP configuration belongs to Connect your agent.
CLI arguments belong to CLI commands. A recipe's discovery page belongs to the landing catalog.

## Enforcement

The structure and migration checks run from @package.json. Review page ownership before merging content.
