---
title: "Docs SEO fixes — unique titles, llms.txt, canonicals, cross-linking (Track B)"
status: draft
---

## Goal

Make the 44 docs pages visible in search. Live SERP research (2026-07-28, see landing repo `.archcore/landing/seo-research-sdd-context-skills.rnd.md`) found only the docs homepage indexed-visible, and its snippet title rendered as "Archcore | archcore". This is Track B of the cross-repo SEO growth plan (landing repo `.archcore/landing/seo-growth.plan.md`).

## Tasks

1. **[DONE 2026-07-29, revised 2026-08-10] Fix the title template**: homepage uses a frontmatter `head` title override — now `<title>Archcore Docs — Spec-Driven Development & Context Engineering</title>`. Site-wide suffix is now `— Archcore` (`title: 'Archcore'` + `titleDelimiter: '—'`), matching the "… — Archcore" convention in the shared `product/seo-information-architecture`; the earlier lowercase `| archcore` wordmark suffix was a logo treatment used as an entity name. Sharpened 5 generic page titles: Hooks → Session Hooks, MCP Server → MCP Server for Project Context, Configuration → CLI Configuration, Skills → Plugin Skills, How It Works → How Archcore Works.
2. **[DONE 2026-07-29, partial] Ship llms.txt**: `starlight-llms-txt@0.10.0` installed (0.11.x requires Astro 7 — this repo is on Astro 6.0.4 / Starlight 0.38.1; revisit on upgrade). Generates `llms.txt`, `llms-full.txt`, `llms-small.txt` + custom sets (CLI/Plugin/Concepts) at build. **Per-page `.md` twins are NOT covered by the plugin — deferred follow-up.**
3. **[VERIFIED OK, no changes] Canonicals**: all 74 dist HTML files render self-referencing canonicals with trailing slash. 404.html carries a canonical to /404/ — harmless, left as is.
4. **[PENDING] Cross-link with the landing content hub** (after landing Track A5 ships): docs concept pages <-> /learn/ pillars and /blog/ guides on archcore.ai (e.g. document-types concept <-> typed-templates hub; MCP reference <-> "MCP server for project context" guide).
5. **[DONE 2026-07-29, revised 2026-08-10] Category phrase alignment**: Starlight `description`, the llms.txt description, the `WebSite` JSON-LD description, and the homepage description now lead with the two discovery categories and the product definition, per `product/two-discovery-categories` and `product/surface-descriptors`. The earlier "Git-native repo memory for AI coding agents" phrasing came from `landing/home-title-category-keyword.adr.md`, which is superseded. No "18 document types" residue in docs content (already said 19).

## Acceptance Criteria

- [x] Homepage title descriptive, ≤60 visible chars, exactly one `<title>` tag.
- [x] `llms.txt` / `llms-full.txt` / `llms-small.txt` build into dist with valid links.
- [x] Canonicals self-reference on spot-checked pages.
- [ ] After cross-linking: every /learn/ pillar on the landing has ≥1 inbound link from docs and vice versa.
- [ ] GSC (domain property) shows docs pages appearing for non-brand queries within ~2 months of the fixes.

## Dependencies

- Task 4 depends on the landing content hub (landing `.archcore/landing/content-hub-astro-subbuild.adr.md` + Track A5 articles).
- llms.txt `.md` twins deferred until the `starlight-llms-txt` upgrade path (Astro 7) or a custom endpoint.
- GSC verification (Track C1 in the landing growth plan) needed before measuring results.
