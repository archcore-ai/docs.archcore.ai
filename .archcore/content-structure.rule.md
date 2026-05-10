---
title: "Content Organization: Sidebar Sections"
status: accepted
---

## Rule

Every documentation page **must** belong to exactly one of 5 sidebar groups:

1. **Start Here** — Onboarding and path selection (overview, choose Plugin vs CLI, quick starts, migration from flat files)
2. **Plugin** — The Claude Code / Cursor / Codex CLI plugin product (overview, install, supported hosts, how it works, skills, built-in agents, troubleshooting)
3. **CLI** — The standalone CLI product (overview, install, quick start, `archcore init`, commands, MCP server, hooks, agent integrations, configuration, troubleshooting)
4. **Concepts** — Mental model and conceptual content (what is archcore, mental model, how it works, document types, documents & layout, relations, flat files vs archcore, use cases)
5. **Reference** — Lookup material (document format, MCP tools, MCP prompts, plugin skills, tracks)

Every new page **must** be registered in the sidebar array in `astro.config.mjs`.

## Rationale

The 5-group structure maps to the user journey: **orient → pick a path → understand → look up**. Start Here splits early between the two products (Plugin or CLI) because each has its own install, integration story, and surface area. Concepts and Reference are shared across both products.

This structure keeps each product self-contained while concept and reference material remains shared, so users don't have to hunt for "the CLI version" of an explanation.

## Section directories

| Section | Directory | Notes |
|---------|-----------|-------|
| Start Here | `start/` + root | `index.mdx` (Overview) lives at the root; `choose.mdx`, `plugin-quick-start.mdx`, `migrate-from-flat-files.mdx` live in `start/`. The "CLI Quick Start" entry in this group links to `cli/quick-start.mdx`. |
| Plugin | `plugin/` | All plugin-specific pages |
| CLI | `cli/` | All CLI-specific pages |
| Concepts | `concepts/` | Shared between products |
| Reference | `reference/` | Shared between products |

## Examples

### Good

- New page documenting a plugin command → **Plugin**
- New page documenting a CLI flag → **CLI**
- New page explaining how relations work → **Concepts** (shared mental model)
- New page documenting an MCP tool or prompt → **Reference** (lookup material)
- New page introducing the project to a first-time visitor → **Start Here**

### Bad

- A plugin-specific install page placed in **Start Here** — installs belong with their product (Plugin or CLI)
- A CLI command reference placed in **Reference** — CLI surface area lives under **CLI**; Reference is for cross-cutting lookup tables (MCP tools, document format, plugin skills, tracks)
- A concept explanation placed in **Reference** — Reference is for lookup, not learning
- A new troubleshooting page placed at the top level — each product has its own `troubleshooting.mdx` under `plugin/` or `cli/`

## Enforcement

- New pages require a sidebar entry in `astro.config.mjs`; the build will not surface unregistered pages in navigation
- During review, verify the page is in the correct group per the user-journey mapping above
- Legacy paths from the previous IA are preserved via the `redirects` table in `astro.config.mjs` — when restructuring further, add redirects rather than breaking external links
