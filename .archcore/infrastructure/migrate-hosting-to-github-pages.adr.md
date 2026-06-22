---
title: "Migrate docs site hosting from Vercel to GitHub Pages"
status: accepted
---

## Context

The docs site (`docs.archcore.ai`) is a fully static Astro + Starlight site with no server-side needs.

## Decision

Follow the ecosystem decision to host static web properties on GitHub Pages — the rationale (Vercel blocked/unreliable in Russia, no SSR requirement) and shared consequences live in the `archcore` global source `web/static-hosting-github-pages` and are not restated here.

Docs-specific implementation:

- Deployed via GitHub Actions on every push to `main` (`@.github/workflows/deploy.yml`).
- Custom domain `docs.archcore.ai` via `public/CNAME`.
- Astro outputs static HTML for all routes, so **no SPA fallback** is needed (unlike the landing SPA).
