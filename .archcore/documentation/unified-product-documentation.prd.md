---
title: "Unified Archcore product documentation"
status: draft
tags:
  - "content"
  - "docs-style"
---

## Vision
Archcore documentation gives engineers one product journey from installation to reuse of project context.
Status: planned. The user requested specification-led restructuring on 2026-09-12.

## Problem Statement
The current site asks newcomers to choose CLI or plugin before using Archcore.
Its 33 content pages repeat introductions, installation guidance, command coverage, and lifecycle explanations.
Engineers evaluating Archcore and engineers configuring agents carry this navigation cost; machine readers inherit the same split.
Baseline: @src/content/docs/index.mdx, @src/content/docs/start/choose.mdx, and @astro.config.mjs at docs commit 80ac863.

## Goals and Success Metrics
- Structural completion: every baseline content page has a recorded destination; baseline coverage is 33 pages.
- Product coherence: zero component-choice prompts across the four introductory pages.
- [assumption] First-use comprehension: four of five first-time readers identify one product and explain the demonstrated context reuse.
- [assumption] Task completion: four of five first-time readers finish the supported-host quick start without maintainer intervention.
- User studies, acquisition effects, and completion times are unmeasured; these targets are proposed validation criteria, not existing results.

## Requirements
1. A newcomer understands the product without studying component responsibilities.
2. A newcomer obtains a working setup for the host they actually use.
3. A newcomer observes saved project context being retrieved in a later session.
4. A returning user locates commands and recovery guidance without repeating onboarding.
5. An integrator understands the capabilities required to connect an existing agent setup.
6. A reader understands the reasons for the document model separately from first-use instructions.
7. Existing readers retain access through previously published documentation links.
8. Maintainers keep one owning page for each explanation and preserve upstream factual ownership.

## Out of Scope
Engine behavior changes, new plugin hosts, verified compatibility claims without joint-run evidence, a visual redesign, and publishing changes in sibling repositories.
The project remains an English documentation site. Landing's translations remain its responsibility.

## Dependencies
Current engine behavior comes from @../cli/cmd/init.go; runtime behavior comes from @../plugin/plugins/archcore/skills/init/SKILL.md.
The integration catalog is served by @../landing/src/pages/integrations/index.astro.
Existing upstream decisions inform the package; their acceptance does not imply this new package is accepted.

## Clarifications
The user requested one Archcore narrative, lightweight documentation, plugin-based first use, harness integration guidance, concepts, and retained CLI reference.
The user authorized additional grounding across docs, landing, global, CLI, and plugin before specifying implementation.
[assumption] The proposed fifteen-page structure is the concrete baseline for review; no page deletion or publication has occurred.
