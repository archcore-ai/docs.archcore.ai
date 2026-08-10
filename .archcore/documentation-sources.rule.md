---
title: "Documentation sources and their precedence"
status: accepted
---

## Rule

This site documents a product it does not own. Every claim on it originates in an upstream repository, and this rule names which one.

1. The author MUST take concepts, vocabulary, positioning, architectural roles, and the document model from the `archcore` global source, mounted read-only at `.archcore/settings.json`.
2. The author MUST take engine behavior — CLI commands, MCP tools, hook wiring, config paths, host tiers — from the `archcore/cli` repository: its `.archcore/` documents and its source.
3. The author MUST take runtime behavior — the command surface, tracks, gates, plugin packaging per host — from the `archcore/plugin` repository.
4. The author MUST NOT state a concept, definition, or product claim that no upstream source states. A page that needs one is blocked until the concept is recorded upstream.
5. WHEN two sources disagree, the author MUST resolve by subject, not by repository: global decides what a thing *is*, the CLI decides how the engine *behaves*, the plugin decides how the runtime *behaves*. IF they disagree inside one subject, THEN the author MUST report the conflict rather than pick a side in prose.
6. The author MUST NOT describe a feature, command, or behavior that no upstream source implements.
7. WHEN this site explains an upstream concept in its own words, the author MAY use an explanatory metaphor, and MUST NOT let the metaphor contradict the upstream definition or introduce a competing term for something already named.

## Rationale

The earlier version of this rule made the CLI the single source of truth for everything. That was true when the CLI was the only product, and it stopped being true twice: the plugin became a second implementation with behavior of its own, and the shared context became the place where the concepts live.

The cost of leaving it unfixed is subtle. Nothing breaks — the site just becomes the most complete written statement of a concept, and then it *is* the definition, held in a repository that ships no product and that no other repository reads. Every other repository in the ecosystem pulls concepts from the global source; a documentation site that defines them instead inverts the flow, and corrections start landing here rather than upstream where the code is.

Requirement 4 is what keeps the flow one-directional. Writing a page is the most common moment for a gap in the shared vocabulary to surface, which makes it the most common temptation to fill the gap locally.

Requirement 7 exists because good documentation explains, and explanation needs figures of speech. Calling the CLI a compiler is useful; renaming the engine to "the compiler" in a table of responsibilities is not.

## Examples

**Good:** describing `archcore init` from the CLI's code and help text.

**Good:** describing what a `spec` is from the global `concepts/document-types-reference`, then showing the CLI's generated section list beside it.

**Good:** "The CLI works like a compiler for your context" as an aside, next to the canonical role name.

**Bad:** describing a hypothetical `archcore deploy` command that no repository implements.

**Bad:** defining a term on this site because no upstream document defines it yet.

**Bad:** a responsibility table that assigns a guardrail to the plugin, when the global `architecture/engine-runtime-boundary` assigns it to the engine.

## Enforcement

- Cross-check every factual page against the owning repository before merging.
- A release that moves a responsibility between the engine and the runtime invalidates the responsibility tables on this site; sweep them in the same change.
- A concept gap found while writing gets recorded upstream first, then cited here.
