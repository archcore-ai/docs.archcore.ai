---
title: "Migrate docs site hosting from Vercel to GitHub Pages"
status: accepted
---

## Context

The docs site (docs.archcore.ai) is a fully static Astro + Starlight site. It was hosted on Vercel.

Vercel is blocked or unreliable for a portion of users in Russia, which means potential users cannot access the project documentation. Since the site requires no server-side features (SSR, edge functions, middleware), there is no technical reason to stay on a platform with access restrictions.

## Decision

Move hosting from Vercel to GitHub Pages.

Key implementation details:
- GitHub Actions workflow deploys `dist/` on every push to `main` (@.github/workflows/deploy.yml)
- Custom domain `docs.archcore.ai` configured via `public/CNAME`
- Astro already outputs static HTML for all routes, so no SPA fallback is needed

## Alternatives Considered

- **Stay on Vercel** — simplest option, but does not solve the access problem for Russian users.
- **Cloudflare Pages** — good alternative with wide availability, but adds another third-party dependency. GitHub Pages is sufficient for a static site and keeps everything within the GitHub ecosystem.
- **Netlify** — similar to Cloudflare Pages; no meaningful advantage over GitHub Pages for this use case.

## Consequences

**Positive:**
- The site is accessible from Russia and other regions where Vercel may be restricted
- Hosting is free and fully integrated with the existing GitHub repository
- Simpler infrastructure — no separate Vercel project to manage

**Negative:**
- No preview deployments for pull requests (can be added later with a separate workflow if needed)
- GitHub Pages has a soft bandwidth limit (100 GB/month) — unlikely to be an issue for a docs site
