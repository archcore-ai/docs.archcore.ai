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
| Navigation and destinations | @src/data/docs-navigation.mjs |
| Theme | @src/styles/custom.css and @DESIGN.md |
| Writing policy | @AGENTS.md |
| Release records | @src/content/changelog/ and @src/content.config.ts |
| Changelog routes | @src/pages/changelog/ |
| Header navigation | @src/components/HeaderLinks.astro |
| Metadata | @src/components/Head.astro |
| OG generation | @scripts/generate-og-image.mts |
| Deployment | @.github/workflows/deploy.yml |

Changelog entries remain outside the primary sidebar. CLI and plugin retain independent release identifiers.
Release versions come from the collection rather than a manually maintained latest-version statement here.
The root page uses the standard documentation layout. Components under @src/components/landing/ remain outside the current root-page implementation.

## Build and compatibility

@package.json runs OG generation through prebuild, then Astro, the documentation finalizer, documentation checks, and the first-load JavaScript check.
@scripts/finalize-docs.mjs preserves compatibility routes and heading aliases and writes the unified llms.txt index.
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
@CLAUDE.md still carries obsolete five-group navigation instructions and needs a separate source-file correction.
