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

The image uses a dark theme with the 70px grid pattern, "docs" badge, and docs-specific subtitle. Meta tags are configured in `astro.config.mjs` via Starlight's `head` array.

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

- **Headline text** — look for the `fontSize: "56px"` children
- **Subtitle** — look for the `fontSize: "22px"` block
- **Bottom bar** — the `justifyContent: "space-between"` section
- **Colors** — constants at the top: `BG_COLOR`, `TEXT_PRIMARY`, `TEXT_MUTED`, `TEXT_DIM`
- **Logo** — reads `src/assets/logo-dark.png` automatically

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
- `astro.config.mjs` — OG and Twitter Card meta tags (in Starlight `head` array)
