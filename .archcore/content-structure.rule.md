---
title: "Content Organization: 4-Section Structure"
status: accepted
---

## Rule

Every documentation page **must** belong to exactly one of 4 sidebar sections:

1. **Getting Started** — Onboarding flow (introduction, quick start)
2. **Core Concepts** — Mental model (philosophy, context layers, document types, directory structure, relations)
3. **Integrations** — Agent connectivity (MCP server, supported agents, hooks)
4. **Reference** — Lookup material (CLI commands, document format, configuration, MCP tools)

Every new page **must** be registered in the sidebar array in `astro.config.mjs`.

## Rationale

The 4-section structure maps to the user journey: **learn → understand → connect → look up**. This ensures content is discoverable and readers always know where to find what they need.

## Examples

### Good

- New page documenting an MCP tool → **Reference** (lookup material)
- New page explaining how relations work → **Core Concepts** (mental model)
- New page for connecting to Cursor → **Integrations** (agent connectivity)
- New page walking through first setup → **Getting Started** (onboarding)

### Bad

- New concept explanation placed in Reference — Reference is for lookup, not learning
- New CLI command page placed in Core Concepts — commands are lookup material
- New integration page placed in Getting Started — Getting Started is only for onboarding flow

## Enforcement

- New pages require a sidebar entry in `astro.config.mjs`; the build will not surface unregistered pages in navigation
- During review, verify the page is in the correct section per the user journey mapping above