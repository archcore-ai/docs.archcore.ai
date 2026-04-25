---
title: "Archcore Documentation Site"
status: accepted
---

## Overview

Documentation site for [Archcore](https://github.com/archcore-ai), deployed at **docs.archcore.ai**.

Archcore turns your repository into structured, machine-readable context — so AI coding agents understand your architecture, rules, and decisions. The project ships in two flavors: a **Plugin** for AI coding hosts (Claude Code, Cursor) and a standalone **CLI**. This site provides path-based onboarding, plugin and CLI references, shared concept material, and lookup tables (MCP tools, prompts, skills, tracks).

## Architecture

- **Framework:** Astro 6 + Starlight
- **Content format:** `.md` / `.mdx` files in `src/content/docs/`
- **Sidebar config:** defined in `astro.config.mjs`
- **Theme tokens:** `src/styles/custom.css`

## Sections

The sidebar has 5 groups (~34 pages total):

| Section | Directory | Purpose | Example pages |
|---------|-----------|---------|----------------|
| Start Here | `start/` + root | Orient and pick a path | Overview (`index.mdx`), Choose Plugin or CLI, Plugin Quick Start, CLI Quick Start (links to `cli/quick-start`), Migrate from Flat Files |
| Plugin | `plugin/` | Plugin product surface | Overview, Install, Supported Hosts, How Plugin Works, Skills, Built-in Agents, Troubleshooting |
| CLI | `cli/` | CLI product surface | Overview, Install, Quick Start, `archcore init`, Commands, MCP Server, Hooks, Agent Integrations, Configuration, Troubleshooting |
| Concepts | `concepts/` | Shared mental model | What Is Archcore, Mental Model, How It Works, Document Types, Documents & Layout, Relations, Flat Files vs Archcore, Use Cases |
| Reference | `reference/` | Cross-cutting lookup | Document Format, MCP Tools, MCP Prompts, Plugin Skills, Tracks |

The `agents/` directory from the previous IA is gone; legacy paths (`/agents/*`, `/getting-started/*`, `/use-cases/*`, etc.) are preserved as redirects in `astro.config.mjs`.

### Changelog

The changelog lives outside the sidebar as a standalone content collection (`src/content/changelog/`). It is accessed via the "Changelog" link in the site header. Entries are split by product (Plugin / CLI) into tabs on the listing page; each entry has a required `product` frontmatter field. Changelog pages use Starlight's standard docs template (sidebar and TOC visible) but entries are not registered in the main sidebar. See the `adding-changelog-entry` guide and `changelog-content-structure` rule for details.

## Key Files

- @astro.config.mjs — sidebar configuration, redirects, and Starlight options
- @src/styles/custom.css — theme tokens and custom styling
- @src/content/docs/ — all documentation content
- @src/content/changelog/ — changelog entries (separate content collection)
- @src/pages/changelog/ — changelog page templates (listing + individual entry)
- @src/components/ChangelogEntry.astro — changelog entry layout component
- @src/components/HeaderLinks.astro — header "Changelog" link + social icons
- @package.json — dependencies and scripts

## Examples

### Getting started

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`.

### Production build

```bash
npm run build
```

Output is in `dist/`.
