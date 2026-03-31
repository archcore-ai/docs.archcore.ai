---
title: "How to update OG image for social media previews"
status: accepted
---

## Prerequisites

- Node.js installed
- Project dependencies installed (`npm install`)
- Font files present at `scripts/fonts/Inter-Bold.ttf` and `scripts/fonts/Inter-Regular.ttf`

## How it works

The OG image (1200x630 PNG) is generated at build time using **Satori** (JSX → SVG) and **@resvg/resvg-js** (SVG → PNG). The layout is defined as code in `scripts/generate-og-image.mts`.

The image uses a light theme (warm beige `#fdf6e3`, Solarized Light palette) with 70px grid pattern, matching the landing site style. The title reads "Archcore Docs" with a subtitle "Git-native context for AI coding agents" to distinguish it from the main site OG card.

Meta tags are configured in `astro.config.mjs` via Starlight's `head` array, referencing `https://docs.archcore.ai/og-image.png`.

## Steps

### 1. Generate the image manually

```bash
npm run og:generate
```

Outputs `public/og-image.png`.

### 2. Auto-generation on build

The `prebuild` step runs automatically:

```bash
npm run build  # prebuild → og:generate, then astro build
```

No manual step needed in CI — GitHub Actions runs `npm run build`.

### 3. Edit the image content

Open `scripts/generate-og-image.mts` and modify:

- **Title** — the `fontSize: "56px"` child ("Archcore Docs")
- **Tagline** — the `fontSize: "40px"` child ("Git-native context for AI coding agents")
- **Subtitle** — the `fontSize: "22px"` block
- **Bottom bar** — the `justifyContent: "space-between"` section (URL left, sections right)
- **Colors** — constants at the top: `BG_COLOR` (#fdf6e3), `TEXT_PRIMARY` (#1a1a1a), `TEXT_MUTED` (#6b6b6b), `TEXT_DIM` (#93a1a1)
- **Logo** — reads `src/assets/logo-light.png` (dark logo for light background)

After editing, run `npm run og:generate` and inspect `public/og-image.png`.

## Verification

After deploying:

1. **opengraph.xyz** — paste `https://docs.archcore.ai`
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
| Image not showing on social media | File missing from build | Check `public/og-image.png` exists after build |
| Stale preview on social platform | Platform cached old image | Use platform-specific cache purge |
| Satori layout broken | Unsupported CSS | Satori only supports Flexbox — use `display: flex` |

## Key files

- `scripts/generate-og-image.mts` — image generator script
- `scripts/fonts/` — Inter TTF fonts for Satori
- `public/og-image.png` — generated output (1200x630)
- `src/assets/logo-light.png` — dark logo used on light OG background
- `astro.config.mjs` — OG and Twitter Card meta tags (in Starlight `head` array)
