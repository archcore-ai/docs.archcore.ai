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
| Core Concepts | Mental model | How It Works, Document Types, Relations |
| Integrations | Agent connectivity | MCP Server, Supported Agents, Hooks |
| Reference | Lookup material | CLI Commands, Document Format, Configuration |

## Key Files

- @astro.config.mjs — sidebar configuration and Starlight options
- @src/styles/custom.css — theme tokens and custom styling
- @src/content/docs/ — all documentation content
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