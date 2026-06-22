---
title: "Add build-time OG image generation with Satori"
status: accepted
---

## What

The reusable pattern for adding build-time OG image generation (Satori + resvg) to a static site is the ecosystem task-type `web/build-time-og-images` in the `archcore` global source. The docs-site (Astro + Starlight) operational steps — page auto-discovery, the `Head.astro` override, `SECTION_MAP`, and `public/og/<slug>.png` output — are in `og-image-generation.guide`.

This file is kept as a local pointer; see those two documents.
