---
title: "Archcore Documentation Site"
status: accepted
---

## Overview

Documentation site for the [Archcore CLI](https://github.com/archcore-ai/cli), deployed at **docs.archcore.ai**.

Archcore turns your repository into structured, machine-readable context — so AI agents understand your architecture, rules, and decisions. It helps teams structure decisions, rules, plans, and guides inside the repository so agents can work with stronger project context. This site provides getting-started guides, concept explanations, agent setup docs, and CLI/MCP reference.

## Architecture

- **Framework:** Astro 6 + Starlight
- **Content format:** `.md` / `.mdx` files in `src/content/docs/`
- **Sidebar config:** defined in `astro.config.mjs`
- **Theme tokens:** `src/styles/custom.css`

## Sections

The site is organized into 4 sidebar sections (15 pages total):

| Section | Directory | Purpose | Pages |
|---------|-----------|---------|-------|
| Get Started | `start/` + root | Onboarding flow | Introduction, Quick Start, Flat Files vs Archcore |
| Concepts | `concepts/` | Mental model and use cases | How It Works, Document Types, Documents & Layout, Relations, Use Cases |
| Agents & Tools | `agents/` | Agent connectivity and CLI | Supported Agents, MCP Server, CLI Commands |
| Reference | `reference/` | Lookup material | MCP Tools, Configuration, Document Format, Troubleshooting |

### Changelog

The changelog lives outside the 4-section sidebar structure as a standalone content collection (`src/content/changelog/`). It is accessed via the "Changelog" link in the site header. Changelog pages use Starlight's standard docs template (sidebar and TOC visible) but entries are not listed in the sidebar. See the `adding-changelog-entry` guide and `changelog-content-structure` rule for details.

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