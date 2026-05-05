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
- **Theme tokens & layout:** `src/styles/custom.css`
- **Visual design source of truth:** @DESIGN.md — palette, typography, section patterns, copy tone

## Sections

The sidebar has 5 groups (~33 pages total):

| Section | Directory | Purpose | Example pages |
|---------|-----------|---------|----------------|
| Start Here | `start/` + root | Orient and pick a path | Overview (`index.mdx`), Choose Plugin or CLI, Plugin Quick Start, CLI Quick Start (links to `cli/quick-start`), Migrate from Flat Files |
| Plugin | `plugin/` | Plugin product surface | Overview, Install, Supported Hosts, How Plugin Works, Skills, Built-in Agents, Troubleshooting |
| CLI | `cli/` | CLI product surface | Overview, Install, Quick Start, Commands, MCP Server, Hooks, Agent Integrations, Configuration, Troubleshooting |
| Concepts | `concepts/` | Shared mental model | What Is Archcore, Mental Model, How It Works, Document Types, Documents & Layout, Relations, Flat Files vs Archcore, Use Cases |
| Reference | `reference/` | Cross-cutting lookup | Document Format, MCP Tools, MCP Prompts, Plugin Skills, Tracks |

The `agents/` directory from the previous IA is gone; legacy paths (`/agents/*`, `/getting-started/*`, `/use-cases/*`, etc.) are preserved as redirects in `astro.config.mjs`. The standalone `cli/init.mdx` page has also been retired — `/cli/init/` redirects to `/cli/quick-start/`, where the init walkthrough now lives.

### Changelog

The changelog lives outside the sidebar as a standalone content collection (`src/content/changelog/`). It is accessed via the "Changelog" link in the site header. Entries are split by product (Plugin / CLI) into tabs on the listing page; each entry has a required `product` frontmatter field. Changelog pages use Starlight's standard docs template (sidebar and TOC visible) but entries are not registered in the main sidebar. See the `adding-changelog-entry` guide and `changelog-content-structure` rule for details.

### Landing system (staged)

A custom landing system lives under `src/components/landing/` and is defined by `DESIGN.md`. It is **not yet wired to any route** — `index.mdx` currently renders the standard Starlight overview with `<CardGrid>`/`<LinkCard>`. The landing components (`HeroSection`, `BeforeAfterAgentSection`, `FlatFilesComparisonSection`, `PluginVsCliSection`, `InstallSection`, `UseCasesGrid`, `FAQSection`, `FinalCTASection`, `SiteFooter`) are ready for a future splash page.

The Starlight `Hero` and `PageTitle` overrides (`SplashHeroOverride.astro`, `PageTitleOverride.astro`) only take effect on pages whose frontmatter sets `template: splash` — they suppress Starlight's default hero/h1 so the page can render its own.

## Starlight component overrides

Configured in `astro.config.mjs` under `starlight({ components: { ... } })`:

| Slot | File | Purpose |
|------|------|---------|
| `SocialIcons` | `src/components/HeaderLinks.astro` | Header "Changelog" link + social icons |
| `Head` | `src/components/Head.astro` | Per-page `og:image` injection (see `og-image-generation` guide) |
| `Hero` | `src/components/SplashHeroOverride.astro` | No-op for splash pages; landing renders its own hero |
| `PageTitle` | `src/components/PageTitleOverride.astro` | Suppresses default `<h1>` on splash pages only |

## Key Files

- @astro.config.mjs — sidebar configuration, redirects, head[], Starlight component overrides, font preloads
- @DESIGN.md — visual + product design source of truth (palette, typography, section patterns, copy)
- @src/styles/custom.css — theme tokens, design-system layout primitives, landing styles
- @src/content/docs/ — all documentation content
- @src/content/docs/index.mdx — site overview (currently CardGrid; future splash target)
- @src/content/changelog/ — changelog entries (separate content collection)
- @src/pages/changelog/ — changelog page templates (listing + individual entry)
- @src/components/ChangelogEntry.astro — changelog entry layout component
- @src/components/HeaderLinks.astro — header "Changelog" link + social icons
- @src/components/Head.astro — custom Starlight Head with per-page OG image injection
- @src/components/landing/ — landing-page sections (staged, not yet routed)
- @scripts/generate-og-image.mts — build-time per-page OG image generator (Satori + resvg-js)
- @public/fonts/ — preloaded variable WOFF2 fonts (Inter, JetBrains Mono)
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

Output is in `dist/`. The `prebuild` step generates per-page OG images into `public/og/` before `astro build` runs.
