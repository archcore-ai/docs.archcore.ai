---
title: "How to update OG image for social media previews"
status: accepted
---

## Prerequisites

- Node.js installed
- Project dependencies installed (`npm install`)
- Font files present at `scripts/fonts/Inter-Bold.ttf` and `scripts/fonts/Inter-Regular.ttf`

## How it works

Each docs page gets a unique OG image (1200x630 PNG) generated at build time. The prebuild script discovers all pages via filesystem walk, extracts titles from frontmatter, and generates per-page images using **Satori** (JSX → SVG) and **@resvg/resvg-js** (SVG → PNG).

Images use the warm-cream palette from `DESIGN.md` (#f8f1e8 paper background, near-black text) with a 70px grid pattern, matching the landing site style. Each image shows the page title, optional description, and a section breadcrumb.

A custom Starlight Head component (`src/components/Head.astro`) injects per-page `og:image` URLs based on the route ID. No per-page frontmatter needed — new pages are auto-discovered on the next build.

## Steps

### 1. Generate images manually

```bash
npm run og:generate
```

Outputs per-page images to `public/og/<slug>.png` (e.g., `public/og/start/plugin-quick-start.png`) plus `public/og-image.png` as a backward-compatible fallback (copy of the root page image).

### 2. Auto-generation on build

The `prebuild` step runs automatically:

```bash
npm run build  # prebuild → og:generate, then astro build
```

No manual step needed in CI — GitHub Actions runs `npm run build`.

### 3. Edit image content/design

Open `scripts/generate-og-image.mts` and modify:

- **Layout function** — `createOgNode(title, description, breadcrumb)` defines the Satori node tree
- **Title font** — `fontSize: "48px"` in the title section
- **Description** — `fontSize: "22px"`, auto-truncated at 120 characters
- **Colors** — constants at the top, sourced from `DESIGN.md`:
  - `BG_COLOR` — `#f8f1e8` (warm cream paper)
  - `TEXT_PRIMARY` — `#11100e` (near-black)
  - `TEXT_MUTED` — `#5f5a50`
  - `TEXT_DIM` — `#8a8377`
  - `GRID_COLOR` — `rgba(17, 16, 14, 0.04)` (subtle grid lines)
- **Section map** — `SECTION_MAP` object maps slug prefixes to section names for the breadcrumb. Currently mapped: `start`, `concepts`, `agents`, `reference`, `changelog`. **Note:** `plugin/*` and `cli/*` pages are not currently mapped, so they render with no breadcrumb — extend `SECTION_MAP` if you want these section labels.
- **Logo** — reads `src/assets/logo-light.png` (dark logo for the light background)

After editing, run `npm run og:generate` and inspect images in `public/og/`.

### 4. Add a new page

Just create the `.md`/`.mdx` file in `src/content/docs/` or `src/content/changelog/` with `title` in frontmatter. The script auto-discovers it on next build. The Head component auto-constructs the `og:image` URL from the route ID.

## How per-page meta tags work

The custom `src/components/Head.astro` overrides Starlight's default Head component:
1. Reads `Astro.locals.starlightRoute.id` (the page slug)
2. Constructs `og:image` URL: `https://docs.archcore.ai/og/{slug}.png`
3. Filters out any global og:image/twitter:image tags from `astro.config.mjs`
4. Injects per-page og:image, og:image:width/height/type, and twitter:image

Starlight defaults already set `og:title` and `og:description` per-page from frontmatter — no global override needed.

Global `head[]` in `astro.config.mjs` only contains: font preloads, `og:locale`, `og:type`, `twitter:card`, and a JSON-LD script.

## Verification

After deploying:

1. **opengraph.xyz** — paste different page URLs to verify unique images
2. **Telegram** — paste URL in any chat
3. **X/Twitter** — compose a tweet with the URL
4. **Discord** — paste URL in a message

Social platforms cache aggressively. If the image doesn't update:
- Facebook: Sharing Debugger → "Scrape Again"
- Telegram: wait ~24h or use `@WebpageBot`
- Twitter: cache expires within hours

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Build fails with "Unsupported OpenType signature" | Wrong font format | Ensure `.ttf` files in `scripts/fonts/` |
| Image not showing on social media | File missing from build | Check `public/og/<slug>.png` exists after build |
| Stale preview on social platform | Platform cached old image | Use platform-specific cache purge |
| Satori layout broken | Unsupported CSS | Satori only supports Flexbox — use `display: flex` |
| New page has no OG image | Script didn't run | Run `npm run og:generate` or `npm run build` |
| Plugin/CLI page missing breadcrumb | `SECTION_MAP` lacks `plugin`/`cli` entries | Add them to `SECTION_MAP` in `scripts/generate-og-image.mts` |

## Key files

- `scripts/generate-og-image.mts` — per-page image generator script
- `scripts/fonts/` — Inter TTF fonts for Satori (`Inter-Bold.ttf`, `Inter-Regular.ttf`)
- `public/og/` — generated per-page images (e.g., `start/plugin-quick-start.png`)
- `public/og-image.png` — backward-compatible fallback (copy of root page image)
- `src/assets/logo-light.png` — dark logo used on the light OG background
- `src/components/Head.astro` — custom Starlight Head with per-page og:image injection
- `astro.config.mjs` — global head[] (font preloads, og:locale, og:type, twitter:card, JSON-LD)
- `DESIGN.md` — palette source of truth for the OG card colors
