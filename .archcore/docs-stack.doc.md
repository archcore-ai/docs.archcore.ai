---
title: "Documentation stack"
status: accepted
---

## Overview

Tech stack for the Archcore documentation site.

## Content

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Astro | 6.x |
| Theme | Starlight | 0.38.x |
| Language | TypeScript | strict |
| Images | sharp | 0.34.x |

Content is stored as `.mdx` files in `src/content/docs/`.

## Examples

```bash
npm run dev      # local development
npm run build    # production build
```