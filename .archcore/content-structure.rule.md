---
title: "Content Organization: 7-Section Structure"
status: accepted
---

## Rule

Every documentation page **must** belong to exactly one of 7 sidebar sections:

1. **Start Here** — Onboarding flow (introduction, quick start, first 10 minutes, comparison with flat files)
2. **Use Cases** — Scenario-driven pages showing how teams use Archcore (architecture decisions, coding rules, shared memory, implementation plans)
3. **Guides** — Agent-specific setup guides (Claude Code, Cursor, Copilot)
4. **Concepts** — Mental model (philosophy, context layers, document types, directory structure, relations)
5. **Integrations** — Agent connectivity (MCP server, supported agents, hooks)
6. **Reference** — Lookup material (CLI commands, document format, configuration, MCP tools)
7. **Troubleshooting** — Common issues and fixes (agent can't see documents, MCP not starting, validation errors)

Every new page **must** be registered in the sidebar array in `astro.config.mjs`.

## Rationale

The 7-section structure maps to the user journey: **orient → apply → set up → understand → connect → look up → fix**. The first three sections (Start Here, Use Cases, Guides) are action-oriented and serve new users. The last four (Concepts, Integrations, Reference, Troubleshooting) serve users who want deeper understanding or are debugging issues.

This structure prioritizes "jobs to be done" over internal concepts — new users see scenarios and setup guides before they encounter document types, layers, or protocol details.

## Examples

### Good

- New page explaining a use case → **Use Cases** (scenario-driven)
- New agent setup guide → **Guides** (agent-specific setup)
- New page documenting an MCP tool → **Reference** (lookup material)
- New page explaining how relations work → **Concepts** (mental model)
- New page for connecting to Cursor → **Guides** (agent setup)
- New page walking through first setup → **Start Here** (onboarding)
- New page for a common error → **Troubleshooting** (issue resolution)

### Bad

- New concept explanation placed in Reference — Reference is for lookup, not learning
- New CLI command page placed in Concepts — commands are lookup material
- New use case placed in Concepts — use cases show scenarios, not abstract concepts
- New agent setup guide placed in Integrations — Integrations is for how connectivity works, Guides is for step-by-step setup

## Enforcement

- New pages require a sidebar entry in `astro.config.mjs`; the build will not surface unregistered pages in navigation
- During review, verify the page is in the correct section per the user journey mapping above