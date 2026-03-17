---
title: "Archcore Documentation Site"
status: accepted
---

## Overview

Documentation site for the [Archcore CLI](https://github.com/archcore-ai/cli), deployed at **docs.archcore.ai**.

Archcore is a System Context Platform that keeps humans and AI in sync with your system. This site provides getting-started guides, concept explanations, integration docs, and CLI reference.

## Architecture

- **Framework:** Astro 6 + Starlight
- **Content format:** `.md` / `.mdx` files in `src/content/docs/`
- **Sidebar config:** defined in `astro.config.mjs`
- **Theme tokens:** `src/styles/custom.css`

## Sections

The site is organized into 4 sidebar sections that map to the user journey:

| Section | Purpose | Examples |
|---------|---------|----------|
| Getting Started | Onboarding flow | Introduction, Quick Start |
| Core Concepts | Mental model | Philosophy, Context Layers, Document Types, Directory Structure, Relations |
| Integrations | Agent connectivity | MCP Server, Supported Agents, Hooks |
| Reference | Lookup material | CLI Commands, Document Format, Configuration, MCP Tools |

### Changelog

The changelog lives outside the 4-section sidebar structure as a standalone content collection (`src/content/changelog/`). It is accessed via the "Changelog" link in the site header. Changelog pages use Starlight's standard docs template (sidebar and TOC visible) but entries are not listed in the sidebar. See the `adding-changelog-entry` guide and `changelog-content-structure` rule for details.

## Key Files

- @astro.config.mjs — sidebar configuration and Starlight options
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