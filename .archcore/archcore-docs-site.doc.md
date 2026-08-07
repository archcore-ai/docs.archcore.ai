---
title: "Archcore Documentation Site"
status: accepted
---

## Overview

Documentation site for [Archcore](https://github.com/archcore-ai), deployed at **docs.archcore.ai**.

Archcore turns your repository into structured, machine-readable context, so AI coding agents understand your architecture, rules, and decisions. The project ships in two flavors: a **Plugin** for AI coding hosts (Claude Code, Cursor, Codex CLI) and a standalone **CLI**. This site provides path-based onboarding, plugin and CLI references, shared concept material, and lookup tables (MCP tools, document format, plugin skills).

## Architecture

- **Framework:** Astro 6 + Starlight
- **Content format:** `.md` / `.mdx` files in `src/content/docs/`
- **Sidebar config:** defined in `astro.config.mjs`
- **Theme tokens & layout:** `src/styles/custom.css`
- **Visual design source of truth:** @DESIGN.md — palette, typography, section patterns, copy tone
- **Writing policy:** @AGENTS.md — plain-language profile for site content, controlled style for `.archcore/`

## Sections

The sidebar has 5 groups (32 pages, 44 built routes including the changelog):

| Section | Directory | Purpose | Example pages |
|---------|-----------|---------|----------------|
| Start Here | `start/` + root | Orient and pick a path | Overview (`index.mdx`), Choose Plugin or CLI, Plugin Quick Start, CLI Quick Start (links to `cli/quick-start`), Migrate from Flat Files |
| Plugin | `plugin/` | Plugin product surface | Overview, Install, Supported Hosts, How Plugin Works, Skills, Built-in Agents, Troubleshooting |
| CLI | `cli/` | CLI product surface | Overview, Install, Quick Start, Commands, MCP Server, Hooks, Agent Integrations, Global Sources, Configuration, Troubleshooting |
| Concepts | `concepts/` | Shared mental model | What Is Archcore, Mental Model, How It Works, Document Types, Documents & Layout, Relations, Flat Files vs Archcore, Use Cases |
| Reference | `reference/` | Cross-cutting lookup | Document Format, MCP Tools, Plugin Skills |

The `agents/` directory from the previous IA is gone; legacy paths (`/agents/*`, `/getting-started/*`, `/use-cases/*`, etc.) are preserved as redirects in `astro.config.mjs`.

Retired pages and where they now point:

- `cli/init.mdx` — the init walkthrough moved into `cli/quick-start.mdx`; `/cli/init/` redirects there.
- `reference/mcp-prompts.mdx` — the CLI deleted its five MCP track prompts in v0.7.0, so the page was removed; `/reference/mcp-prompts/` redirects to `/plugin/skills/#archcoreplan`, alongside the existing `/reference/tracks/` redirect. Track orchestration is plugin-owned.

### Changelog

The changelog lives outside the sidebar as a standalone content collection (`src/content/changelog/`). It is accessed via the "Changelog" link in the site header. Entries are split by product (Plugin / CLI) into tabs on the listing page; each entry has a required `product` frontmatter field. Changelog pages use Starlight's standard docs template (sidebar and TOC visible) but entries are not registered in the main sidebar. See the `adding-changelog-entry` guide and `changelog-content-structure` rule for details.

The newest CLI entry is `0.5.0`. The CLI has since shipped through `v0.7.0`, so the changelog trails the product.

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

- @AGENTS.md — canonical writing policy (plain language, em dash and heading rules, SEO frontmatter)
- @CLAUDE.md — agent routing, Archcore operations, build commands, page-adding procedure
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
- @scripts/generate-og-image.mts — build-time per-page OG image generator (Satori + resvg-js); truncates the page description at 117 characters when rendering the card
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

Output is in `dist/`. The `prebuild` step generates per-page OG images into `public/og/` before `astro build` runs. A production build fails without `PUBLIC_POSTHOG_KEY`; set `ALLOW_MISSING_ANALYTICS_KEY=1` for a deliberate build without analytics.
