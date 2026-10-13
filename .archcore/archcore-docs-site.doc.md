---
title: "Archcore Documentation Site"
status: accepted
---

## Overview

Current implementation: the Archcore product documentation site at docs.archcore.ai.
The site presents one product. Platform installation is the primary entry; installation from an agent is a secondary route.
The first-use journey follows project context, planning, implementation, recorded knowledge, review, and reuse in a later session.

## Navigation and page ownership

@src/data/docs-navigation.mjs defines fifteen primary pages in four groups.
The linked documentation journey specification defines their responsibilities.

| Group | Pages |
|---|---|
| Start | Overview, Install Archcore, Quick start, What to expect |
| Use Archcore | Commands and examples, Connect your agent, Integrations, Troubleshooting |
| Understand Archcore | Why Archcore, Project context, Document types |
| Reference | CLI commands, Configuration, MCP tools, Document format |

Commands appear in the order init, plan, document, review. Expert paths belong inside plan.
The integration guide summarizes four tool pairs and links to their recipes on archcore.ai. It does not duplicate cooperation instructions.
Concept pages explain selective documentation, accumulation of useful context, free-form layout, categories, statuses, and relations.
Configuration retains a short future-use note for sync. Document format explains plugin prose conventions separately from advisory checks.

## Architecture

| Concern | Implementation |
|---|---|
| Static site | Astro 6 and Starlight, configured in @astro.config.mjs |
| Documentation | @src/content/docs/ |
| Content collection | @src/content.config.ts, the `docs` collection only |
| Navigation and destinations | @src/data/docs-navigation.mjs |
| Theme | @src/styles/custom.css and @DESIGN.md |
| Writing policy | @AGENTS.md |
| Header navigation | @src/components/HeaderLinks.astro |
| Metadata | @src/components/Head.astro |
| Markdown page copies | @src/pages/[...slug].md.ts |
| OG generation | @scripts/generate-og-image.mts |
| Deployment | @.github/workflows/deploy.yml |

The site has no changelog. Release notes live on GitHub Releases of the `archcore-ai/archcore` repository.
@astro.config.mjs redirects `/changelog/` to those releases. It redirects each former changelog entry to its release tag in `archcore-ai/cli` or `archcore-ai/archcore`.
The root page uses the standard documentation layout.

## Markdown copies for agents

@src/pages/[...slug].md.ts builds one Markdown copy of each page. The page `/start/install/` has the copy `/start/install.md`. The root page has the copy `/index.md`.
The copy uses the same HTML-to-Markdown conversion as `llms-full.txt`. The endpoint imports `entryToSimpleMarkdown` from the internal files of `starlight-llms-txt`, because the package does not export it. A plugin upgrade that moves this module fails the build.
@src/components/Head.astro adds `<link rel="alternate" type="text/markdown">` to each page except 404.
@scripts/finalize-docs.mjs writes `llms.txt` links to the Markdown copies.
@public/robots.txt disallows `/*.md$` for Googlebot and Bingbot, so that search results show only the HTML pages. Other agents can read the copies.
GitHub Pages cannot select a response by the `Accept` header. A request for an HTML URL always gets HTML.

## Build and compatibility

@package.json runs OG generation through prebuild, then Astro, the documentation finalizer, documentation checks, and the first-load JavaScript check.
@scripts/finalize-docs.mjs preserves compatibility routes and heading aliases and writes the unified llms.txt index.
@scripts/check-docs.mjs verifies a Markdown copy and an alternate link for each primary page.
The migration baseline in @scripts/fixtures/docs-migration-baseline.json records 33 historical pages and 452 headings.
The current build maintains 56 redirects and six historical machine-bundle URLs.
The first-load budget is 25 KB raw. The latest local build measured 16.9 KB.

A production build requires PUBLIC_POSTHOG_KEY. ALLOW_MISSING_ANALYTICS_KEY=1 permits a deliberate local build without analytics.
Deployment remains static GitHub Pages delivery with the custom domain in @public/CNAME.

## Verification boundaries

The latest local checks passed production build, registered routes and anchors, machine bundles, and browser checks at 390 and 1280 pixels.
The sibling-link audit checked 44 active links in 26 landing, CLI, and plugin source files.
These checks do not establish successful first use through a separate coding-agent session.

Two known implementation gaps remain: some historical aliases resolve to a general page instead of the moved topic, and the article-link checker skips unregistered internal routes.
The install-per-host exception is fixed in the fragment redirect map; it does not resolve every historical fragment.
