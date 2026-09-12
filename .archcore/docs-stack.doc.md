---
title: "Documentation stack"
status: accepted
---

## Overview

Tech stack for the Archcore documentation site.

## Content

| Component | Technology | Version | Notes |
|-----------|-----------|---------|-------|
| Framework | Astro | 6.x | Static output, no SSR |
| Theme | Starlight | 0.38.x | With custom Head/Hero/PageTitle/SocialIcons overrides |
| Language | TypeScript | strict | |
| Image processing | sharp | 0.34.x | Used by Astro's built-in image pipeline |
| OG card rendering | satori | 0.26.x | JSX → SVG, dev dependency |
| OG card rasterization | @resvg/resvg-js | 2.6.x | SVG → PNG, dev dependency |
| TS runner (build scripts) | tsx | 4.x | Runs `scripts/generate-og-image.mts` |
| First-load JS check | node | 22.x | Runs `scripts/check-first-load.mjs`, budget 25 KB raw |
| UI fonts | @fontsource-variable/inter, @fontsource-variable/jetbrains-mono | 5.x | Self-hosted variable WOFF2 |

Content is stored as `.md` / `.mdx` files in `src/content/docs/` (and a separate `src/content/changelog/` collection for release notes).

## Build pipeline

The `prebuild` step generates per-page OG images into `public/og/` via `scripts/generate-og-image.mts` before `astro build` runs. The build then runs @scripts/finalize-docs.mjs, @scripts/check-docs.mjs, and @scripts/check-first-load.mjs.
The finalizer writes compatibility redirects, historical heading aliases, and the unified llms.txt index. The documentation check covers the registered page set and captured migration baseline.

## Examples

```bash
npm run dev          # local development
npm run og:generate  # regenerate OG card PNGs only
npm run build        # OG generation + Astro + finalizer + docs checks + JS budget
```
