---
title: "First-load JavaScript on the docs site is capped at 25 KB raw and checked on every build"
status: accepted
tags:
  - "infrastructure"
---

## Context

The landing site records a first-load JavaScript budget in
`landing/astro-first-load-optimizations.adr.md` and lists "nothing in the build enforces the budget"
as a tradeoff. The docs site had neither a budget nor a measurement.

Starlight ships no framework island. Every page loads five small scripts — the analytics loader, the
Starlight page script, the search opener, and the two table-of-contents scripts. Measured on the
`dist/` built at this commit, the worst page is 16.9 KB raw across 7 files. The Pagefind index
(`module.*.js`, 279 KB) and posthog-js are loaded on demand and never appear in the HTML, so they are
not first load.

The landing's other two mechanisms do not transfer. `preloadIslandChunks()` addresses the island
chunk chain, and this site renders no islands. `stripMessageField: false` is a Lingui setting, and
the docs carry no i18n runtime.

## Decision

1. Record 25 KB raw as the first-load JavaScript budget for the worst page on the site.
2. `@scripts/check-first-load.mjs` measures it and fails the build over the budget. `npm run build`
   runs it after `astro build`. It sums every `.js` file the HTML references, including island
   `component-url`/`renderer-url` chunks and `modulepreload` links, and follows their static imports,
   so the number stays correct if an island is ever added.
3. `compressHTML: true` is explicit in `@astro.config.mjs` rather than inherited from the Astro
   default, matching the landing site.

The same script runs in the landing repository's sibling projects, so one measurement procedure
covers every Astro property.

## Alternatives Considered

- Port `preloadIslandChunks()` as well — rejected: the hook would find no islands and add nothing,
  leaving unused build code whose failure mode is silence.
- Check the budget by hand after a change, as the landing ADR prescribes — rejected: the landing ADR
  already names the manual step as its weakness.

## Consequences

Positive:

- A framework island, a new tracking script, or a Starlight upgrade that grows the client runtime
  fails the build instead of shipping unnoticed.

Tradeoffs:

- The script parses built HTML and chunk imports with regular expressions. An Astro change to chunk
  import formatting makes it under-count; the per-page file count it prints is the signal.
- 25 KB is 8 KB of headroom over today's 16.9 KB. A deliberate addition above it needs the budget
  raised here, not the check silenced.

## Superseded when

- The docs site adopts framework islands, which changes both the number and what has to be measured.
