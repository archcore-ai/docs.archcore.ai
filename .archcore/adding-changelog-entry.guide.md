---
title: "Adding a New Changelog Entry"
status: accepted
---

## Prerequisites

- Node.js installed
- npm installed
- Project cloned and dependencies installed (`npm install`)

## How the Changelog Works

The changelog is a standalone content collection separate from the main docs. Key components:

| Component | Path | Purpose |
|-----------|------|---------|
| Content collection | @src/content/changelog/*.md | Markdown entries with version/date/title/description/product frontmatter |
| Schema | @src/content.config.ts | Zod schema validating `version`, `date`, `title`, `product` (`"plugin"` \| `"cli"`), optional `description` |
| Listing page | @src/pages/changelog/index.astro | Plugin and CLI tabs (Plugin first); each tab shows preview cards (title + description + "Read more") sorted by date descending |
| Entry page | @src/pages/changelog/[slug].astro | Individual entry with full content and TOC from h2 headings |
| Entry component | @src/components/ChangelogEntry.astro | Shared layout: version pill, date, title; listing mode shows description preview, standalone mode renders full body |
| Images | `public/changelog/` | Static assets for changelog screenshots |
| Header link | @src/components/HeaderLinks.astro | "Changelog" link in the site header |
| Styles | @src/styles/custom.css | Version pill, date, entry separator, description preview, "Read more" link, body styles, empty-state |

### Layout

Changelog pages use Starlight's **standard docs template** — the sidebar and "On this page" TOC are visible, matching the rest of the site. Entries are not registered in the sidebar; they are accessed via the header "Changelog" link.

The listing page (`/changelog/`) renders **two tabs** — **Plugin** (default, first) and **CLI**. Each tab shows preview cards for entries with the matching `product` value: version pill, date, title, description, and a "Read more" link. Full content is only rendered on individual entry pages.

If a tab has no entries yet, an empty-state message is shown ("No plugin releases yet." / "No CLI releases yet.").

### URL structure

- `/changelog/` — listing of all entries split into Plugin / CLI tabs (newest first within each tab, preview only)
- `/changelog/<version>/` — individual entry with full content (e.g., `/changelog/0.1.0/`)

The URL slug is derived from the filename (minus `.md`).

## Steps

1. **Create the entry file** — Add a new `.md` file in `src/content/changelog/` named after the version:
   ```
   src/content/changelog/0.2.0.md
   ```

2. **Add required frontmatter** — Every changelog entry requires these fields:
   ```yaml
   ---
   version: "0.2.0"
   date: 2026-04-01
   title: "Short Feature Headline"
   description: "2–3 sentences summarizing the key changes. This text appears as the preview on the listing page. Make it informative enough to stand alone."
   product: "cli"
   ---
   ```
   - `version` — semver string, must match the filename
   - `date` — release date in YYYY-MM-DD format
   - `title` — concise headline describing the release
   - `description` — 2–3 sentence preview shown on the listing page; technically optional in schema but expected by convention
   - `product` — `"plugin"` for plugin releases, `"cli"` for CLI releases; determines which tab the entry appears under

3. **Write the body** — Start with a 1–2 sentence intro paragraph, then use `## Improvements`, `## Fixes`, and optionally `## Misc` subsections with bullet lists. See the `changelog-content-structure` rule for details.

4. **Add images (optional)** — Place screenshots in `public/changelog/` and reference them:
   ```markdown
   ![Feature screenshot](/changelog/0.2.0-dashboard.png)
   ```

5. **Preview locally** — Run the dev server and check both pages:
   ```bash
   npm run dev
   ```
   - `/changelog/` — the entry appears at the top of the matching product tab (Plugin or CLI) with description preview
   - `/changelog/0.2.0/` — individual entry page with full content, sidebar, and "On this page" TOC

## Verification

- [ ] Entry appears at the top of the correct product tab on `/changelog/` (Plugin or CLI), sorted by date descending
- [ ] Listing page shows title, description preview, and "Read more" link
- [ ] Individual entry page renders at `/changelog/<version>/` with full content
- [ ] Sidebar and "On this page" TOC are visible on both pages
- [ ] Build succeeds without errors: `npm run build`
- [ ] Version pill, date, and title display correctly
- [ ] Images (if any) load and have rounded corners with borders
- [ ] Dark/light mode — colors render correctly

## Common Issues

- **Entry not appearing** — Ensure the file is in `src/content/changelog/` with a `.md` extension. The glob loader picks up all `.md` files in that directory automatically.
- **Schema validation error** — Missing or mistyped frontmatter fields. `version`, `date`, `title`, and `product` are required. `date` must be a valid date (YYYY-MM-DD). `product` must be exactly `"plugin"` or `"cli"`.
- **Entry in the wrong tab** — Check the `product` field. Switching between `"plugin"` and `"cli"` moves the entry between tabs.
- **No preview on listing** — The listing page shows the `description` frontmatter field. If `description` is missing, no preview text appears.
- **Wrong sort order** — Entries sort by `date`, not filename. Ensure the `date` field is correct.
- **No TOC on entry page** — The "On this page" panel is generated from `h2` headings (`## Improvements`, `## Fixes`, etc.). Entries without h2 headings won't have TOC items.
- **Images not loading** — Images must be in `public/changelog/`, not `src/`. Reference with absolute paths (`/changelog/image.png`).
