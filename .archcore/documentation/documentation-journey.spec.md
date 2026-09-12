---
title: "Documentation structure and first-use journey"
status: draft
tags:
  - "content"
  - "seo"
---

## Purpose & Scope
Contract for the locally implemented unified documentation journey at docs.archcore.ai. Status: draft pending explicit acceptance.
Consumers: evaluating engineers, daily agent users, harness integrators, search visitors, and generated llms.txt readers.
This contract covers navigation, page responsibilities, entry behavior, and compatibility during migration.
Engine semantics, plugin implementation, and the integration catalog remain upstream-owned.

## Surface
Current implementation: @src/data/docs-navigation.mjs, @astro.config.mjs, @src/content/docs/, @src/components/HeaderLinks.astro, @scripts/finalize-docs.mjs, @scripts/check-docs.mjs.
The following route table defines the implemented primary sidebar in order.

| Group | Label | Canonical route | Owning subject |
|---|---|---|---|
| Start | Overview | / | Definition, concrete uses, next action |
| Start | Install Archcore | /start/install/ | Platform installation and selected-host setup |
| Start | Quick start | /start/quick-start/ | One task loop with context reuse in a new session |
| Start | What to expect | /start/what-to-expect/ | Expected agent behavior, mechanisms, requested actions, limitations |
| Use Archcore | Commands and examples | /guides/commands/ | Four user commands and worked prompts |
| Use Archcore | Connect your agent | /guides/connect-your-agent/ | MCP, lifecycle hooks, instruction hints, host setup |
| Use Archcore | Integrations | /guides/integrations/ | Brief integration summaries with links to upstream recipes |
| Use Archcore | Troubleshooting | /guides/troubleshooting/ | Recovery by observable symptom |
| Understand Archcore | Why Archcore | /concepts/why-archcore/ | Long-term context value, selective capture, examples, tradeoffs |
| Understand Archcore | Project context | /concepts/project-context/ | Free-form layout, categories, status, relations, global/local boundary |
| Understand Archcore | Document types | /concepts/document-types/ | Type selection and complete type catalog |
| Reference | CLI commands | /cli/commands/ | Public command arguments and examples |
| Reference | Configuration | /cli/configuration/ | Settings and global-source configuration |
| Reference | MCP tools | /reference/mcp-tools/ | Tool inputs, outputs, and failures |
| Reference | Document format | /reference/document-format/ | File schema, plugin prose conventions, precision-check lookup |

The existing changelog remains a header destination, outside the fifteen-page documentation sidebar.
The external integration catalog remains https://archcore.ai/integrations/.

## Normative Behavior
1. The documentation sidebar MUST expose the groups and pages in the Surface order.
2. The introductory pages MUST present Archcore through the canonical product definition.
3. The introductory pages MUST NOT ask readers to choose CLI or plugin.
4. The introductory pages MUST NOT display component-ranking labels or component scope badges.
5. The installation page MUST present the platform installer followed by project initialization as one sequence.
6. WHEN installation requires host-specific actions, the installation page MUST identify those actions before declaring setup complete.
7. WHEN describing plugin delivery, the installation page MUST distinguish explicit host selection from auto-detection.
8. WHEN installation starts inside an agent, the installation page MUST preserve the engine prerequisite.
9. The installation page MUST link secondary installation methods without creating a competing product-choice path.
10. The quick start MUST identify its supported host prerequisites before its first action.
11. The quick start MUST demonstrate saved context retrieval in a new session within the same repository.
12. The quick start MUST distinguish terminal initialization from agent-led document seeding.
13. The quick start MUST provide observable checkpoints for tool availability, document creation, and subsequent retrieval.
14. The behavior page MUST distinguish recap metadata from complete document retrieval.
15. The behavior page MUST distinguish blocking write guards from advisory context and validation messages.
16. The behavior page MUST identify host-dependent limits before describing automatic behavior.
17. The behavior page MUST explain the user's role in reviewing documents and accepting recorded decisions.
18. The command page MUST organize examples by user outcome rather than internal routing calculations.
19. The connection page MUST explain MCP access, lifecycle hooks, and instruction hints as distinct mechanisms.
20. The connection page MUST distinguish MCP connectivity from support for hooks and slash commands.
21. The integration guide MUST link the upstream catalog for discovery and individual recipe instructions.
22. The integration guide MUST NOT duplicate upstream cooperation instructions or maintain independent recipe verification claims.
23. WHEN a recipe lacks joint-run evidence, the integration guide MUST retain its experimental qualification.
24. The concept pages MUST introduce categories and relations after explaining their purpose through project examples.
25. The reference pages MUST preserve public configuration, command, tool, and format details needed to operate Archcore.
26. WHEN explanations overlap, secondary pages MUST link to the owning subject in the Surface table.
27. WHEN a page moves, the site MUST preserve its previous URL through a redirect to its content destination.
28. WHEN a referenced heading moves, the destination page MUST preserve a working anchor for that topic.
29. The generated llms.txt entry point MUST present the same unified product journey as the documentation navigation.
30. The generated full documentation bundle MUST exclude duplicated obsolete introductions.
31. The site MUST preserve access to previously published machine-bundle URLs during bundle reorganization.
32. The site MUST give each indexable page a unique title and description.
33. Each documentation page MUST link to a related page and receive a contextual inbound link.
34. The site MUST preserve independent CLI and plugin version identifiers in release information.

35. The quick start MUST show context reading, planning, implementation, knowledge capture, review, and the next task.
36. The command page MUST order skills as init, plan, document, review.
37. The command page MUST give each skill its own heading.
38. The command page MUST keep expert paths inside plan without a separate heading.
39. The integration guide MUST summarize Superpowers, OpenSpec, Spec Kit, and Serena with links to their upstream recipes.
40. The concept pages MUST distinguish useful context accumulation from document-count growth.
41. The concept pages MUST prioritize complex, uncertain, or implicit knowledge over obvious implementation narration.
42. The project-context page MUST explain free-form directories without implying that document types have no content contracts.
43. The configuration page MUST limit unreleased sync guidance to a short future-use note.
44. The document-format page MUST distinguish plugin authoring conventions from the CLI's advisory checks.
45. The behavior page MUST distinguish expected agent effects from guaranteed outcomes.

## Constraints & Invariants
1. The site MUST retain static Astro and Starlight delivery, preserving the existing deployment boundary.
2. The site MUST stay within the existing 25 KB raw first-load JavaScript budget.
3. The author MUST keep new page descriptions within 120 characters to prevent OG-card truncation.
4. The author MUST preserve upstream ownership of product definitions, engine behavior, and runtime behavior.
5. The author MUST keep implementation-only routing mathematics outside the introductory journey.
6. The author MUST revise this contract before adding a primary sidebar page beyond the Surface set.
7. The author MUST preserve existing managed instruction blocks during repository-guidance updates.
The fixed page set controls navigation growth; it does not authorize dropping operational coverage to meet a page count.
Standalone changelog entries and legacy redirect pages do not count toward the primary sidebar set.
Released behavior and development-branch behavior remain distinct factual states.

## Failure Behavior
1. IF a command or behavior lacks upstream evidence, THEN the author MUST omit the unsupported claim.
2. IF host setup remains incomplete, THEN the installation page MUST name the missing action and its completion check.
3. IF hooks are unavailable, THEN the connection page MUST describe the remaining MCP capabilities without promising automatic injection.
4. IF a document cannot be retrieved, THEN the quick start MUST direct readers to project-root and MCP troubleshooting.
5. IF upstream sources conflict, THEN the author MUST record the conflict before changing the affected public claim.
6. IF a legacy URL lacks a destination, THEN the migration check MUST fail.
7. IF a published anchor loses its target, THEN the migration check MUST fail.
8. IF a required sidebar page disappears, THEN the structure check MUST fail.
9. IF a machine bundle links to a removed page, THEN the migration check MUST fail.
10. IF operational coverage cannot fit its assigned page, THEN the author MUST propose a contract revision before discarding that coverage.

## Conformance
Conformance requires all numbered behaviors, constraints, and failure rules.
Implementation evidence includes built navigation, redirect and anchor checks, machine-bundle inspection, and the existing production build.
Browser review covers the four introductory pages at 390 px and 1280 px.
The quick-start exercise is executed on a named host and version; untested hosts receive no equivalent execution claim.
The latest local build and browser checks passed. First-use execution through a separate coding-agent session remains unperformed.
Known conformance gaps remain in topic-correct historical fragment routing and detection of unregistered internal article links.
A passing migration check does not establish those two properties.
