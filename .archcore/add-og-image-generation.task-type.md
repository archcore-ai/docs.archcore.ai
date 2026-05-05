---
title: "Add build-time OG image generation with Satori"
status: accepted
---

## What

Add programmatic per-page OG image generation to a static docs site using Satori + resvg-js at build time. Produces a branded 1200x630 PNG card per page for social media previews, auto-discovered from content files.

## When to Use

- Docs site needs unique Open Graph / Twitter Card previews per page
- No SSR/edge functions available (static hosting like GitHub Pages)
- Want version-controlled, code-defined OG images instead of manual Figma exports
- Need images to auto-regenerate when content or branding changes
- New pages should get OG images automatically without manual registration

## Steps

### 1. Install dependencies

```bash
npm install --save-dev satori @resvg/resvg-js tsx
```

### 2. Add font files

Place `.ttf` fonts in `scripts/fonts/`. Satori requires raw TTF buffers — OTF won't work. Download from the font's GitHub releases (e.g., `https://github.com/rsms/inter/releases`).

### 3. Create generator script

Create `scripts/generate-og-image.mts`:

1. Load fonts as `readFileSync` buffers
2. Load logo, encode as base64 data URI
3. **Discover pages** — walk `src/content/docs/**/*.{md,mdx}` and `src/content/changelog/*.md`, parse frontmatter with regex to extract `title` and `description`
4. **Derive slug** from file path (e.g., `src/content/docs/start/plugin-quick-start.mdx` → `start/plugin-quick-start`)
5. **Map section breadcrumbs** — slug prefix to section name (e.g., `start/` → "Get Started"). Keep this map in sync with the actual sidebar sections.
6. **Parameterize layout** — `createOgNode(title, description, breadcrumb)` returns Satori object tree
7. For each page: `satori()` → SVG → `new Resvg(svg)` → `.render().asPng()` → write to `public/og/<slug>.png`
8. Copy root image to `public/og-image.png` for backward compatibility

Key constraints:
- Only Flexbox, no CSS Grid, no `position: absolute`
- Images must be base64 data URIs or remote URLs
- `backgroundImage` supports `linear-gradient` for patterns
- Use `mkdirSync({ recursive: true })` for nested output directories

Design should match the site theme. Archcore uses the warm-cream palette from `DESIGN.md`: `#f8f1e8` background with near-black text (`#11100e` primary, `#5f5a50` muted, `#8a8377` dim) over a subtle 70px grid (`rgba(17, 16, 14, 0.04)`).

### 4. Wire into build pipeline

```json
"og:generate": "npx tsx scripts/generate-og-image.mts",
"prebuild": "npm run og:generate",
"build": "npm run prebuild && astro build"
```

### 5. Override Starlight Head component

Create `src/components/Head.astro` that:
- Reads `Astro.locals.starlightRoute.id` (the page slug, available for both docs collection and StarlightPage pages)
- Constructs per-page URL: `https://docs.archcore.ai/og/{slug}.png`
- Filters out global og:image/twitter:image tags from the merged head array
- Injects per-page og:image, og:image:width/height/type, twitter:image

Register in `astro.config.mjs`:
```javascript
components: {
  Head: './src/components/Head.astro',
},
```

### 6. Clean up global head[]

Remove from `astro.config.mjs` head[] (now per-page):
- `og:image`, `og:image:width`, `og:image:height`, `og:image:type`, `twitter:image`
- `og:title`, `og:description`, `twitter:title`, `twitter:description` (Starlight defaults set these per-page from frontmatter)

Keep global: font preloads, `og:locale`, `og:type`, `twitter:card`, JSON-LD script.

## Things to Watch Out For

- **OTF fonts break Satori** — must use `.ttf` format
- **Social platforms cache aggressively** — use platform debuggers to force refresh after deploy
- **Satori CSS subset** — no Grid, no absolute positioning, no `calc()` — use Flexbox only
- **Long titles** — allow natural text wrapping, consider smaller font size (48px vs 56px) to accommodate wrapping
- **Description truncation** — truncate at ~120 characters to prevent overflow
- **Head component filtering** — must filter out global og:image tags before injecting per-page ones to avoid duplicates
- **StarlightPage compatibility** — `Astro.locals.starlightRoute.id` works for both docs collection pages and custom StarlightPage pages (uses `urlToSlug()`)
- **Logo variant** — use the dark logo (`logo-light.png`) on the light cream background, not the light-on-dark version
- **Section map drift** — the `SECTION_MAP` in `generate-og-image.mts` must be kept in sync with the sidebar sections, or new sections will render with no breadcrumb
