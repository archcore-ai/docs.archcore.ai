---
title: "How to update OG image for social media previews"
status: accepted
---

The build-time OG technique (Satori → SVG → resvg → PNG, fonts, Satori CSS limits, social-cache verification, common issues) is shared across Archcore web properties and documented in the `archcore` global source `web/og-image-generation`. This guide covers only the **docs site (Astro + Starlight) specifics**.

## Prerequisites

- Node.js, `npm install`
- Fonts at `scripts/fonts/Inter-Bold.ttf` and `scripts/fonts/Inter-Regular.ttf`

## How docs OG works

Each docs page gets a unique OG image (1200×630). The prebuild script walks `src/content/docs/**/*.{md,mdx}` and `src/content/changelog/*.md`, extracts `title`/`description` from frontmatter, and emits per-page images to `public/og/<slug>.png` plus `public/og-image.png` as a root fallback. A custom `src/components/Head.astro` injects per-page `og:image` from the route ID — no per-page frontmatter, new pages auto-discovered. Palette is the warm-cream `DESIGN.md` set (`#f8f1e8` bg, `#11100e` text) over a 70px grid.

## Common tasks

- **Generate manually:** `npm run og:generate` → images in `public/og/`. Build runs it via `prebuild` (`npm run build`).
- **Edit design:** `scripts/generate-og-image.mts` — `createOgNode(title, description, breadcrumb)`, title 48px, description 22px (truncated 120 chars), colors from `DESIGN.md`, and `SECTION_MAP` (slug-prefix → breadcrumb; `plugin/*` and `cli/*` are unmapped, so they render with no breadcrumb unless added).
- **Add a page:** create the `.md`/`.mdx` with a `title` in frontmatter — auto-discovered; Head builds the `og:image` URL from the route ID.

## Per-page meta (Astro)

`src/components/Head.astro` overrides Starlight's Head: reads `Astro.locals.starlightRoute.id`, builds `https://docs.archcore.ai/og/{slug}.png`, filters global og:image/twitter:image out of `astro.config.mjs`, and injects per-page tags. Starlight sets `og:title`/`og:description` per-page from frontmatter. Global `head[]` keeps only font preloads, `og:locale`, `og:type`, `twitter:card`, and the JSON-LD script.

## Docs-specific gotchas

- Plugin/CLI pages render without a breadcrumb unless added to `SECTION_MAP`.
- `Astro.locals.starlightRoute.id` works for both docs-collection and custom StarlightPage pages.
- Use the dark logo (`src/assets/logo-light.png`) on the light background.

## Key files

`scripts/generate-og-image.mts`, `scripts/fonts/`, `public/og/`, `public/og-image.png`, `src/assets/logo-light.png`, `src/components/Head.astro`, `astro.config.mjs`, `DESIGN.md`.
