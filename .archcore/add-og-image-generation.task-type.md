---
title: "Add build-time OG image generation with Satori"
status: accepted
---

## What

Add programmatic OG image generation to a static site using Satori + resvg-js at build time. Produces a branded 1200x630 PNG card for social media previews.

## When to Use

- Site needs Open Graph / Twitter Card social media previews
- No SSR/edge functions available (static hosting like GitHub Pages)
- Want version-controlled, code-defined OG images instead of manual Figma exports
- Need the image to auto-regenerate when content or branding changes

## Steps

### 1. Install dependencies

```bash
npm install --save-dev satori @resvg/resvg-js tsx
```

### 2. Add font files

Place `.ttf` fonts in `scripts/fonts/`. Satori requires raw TTF buffers — OTF won't work. Download from the font's GitHub releases (not Google Fonts direct links).

### 3. Create generator script

Create `scripts/generate-og-image.mts`:

1. Load fonts as `readFileSync` buffers
2. Load logo, encode as base64 data URI
3. Define layout as Satori object tree (`{ type, props, children }`)
4. Render: `satori()` → SVG → `new Resvg(svg)` → `.render().asPng()`
5. Write to `public/og-image.png`

Key constraints:
- Only Flexbox, no CSS Grid, no `position: absolute`
- Images must be base64 data URIs or remote URLs
- `backgroundImage` supports `linear-gradient` for patterns

### 4. Wire into build pipeline

```json
"og:generate": "npx tsx scripts/generate-og-image.mts",
"prebuild": "npm run og:generate",
"build": "npm run prebuild && astro build"
```

### 5. Add/verify meta tags

For Starlight, add to `astro.config.mjs` → `head[]`:
- `og:image`, `og:image:width` (1200), `og:image:height` (630), `og:image:type` (image/png)
- `twitter:card` (summary_large_image), `twitter:image`

### 6. Exclude scripts from linting if needed

Add `scripts` to ESLint `globalIgnores` if using TypeScript-checked config.

## Things to Watch Out For

- **OTF fonts break Satori** — must use `.ttf` format
- **Social platforms cache aggressively** — use platform debuggers to force refresh after deploy
- **Satori CSS subset** — no Grid, no absolute positioning, no `calc()` — use Flexbox only
- **Static site limitation** — all routes share the same OG image unless prerendering per-route HTML
