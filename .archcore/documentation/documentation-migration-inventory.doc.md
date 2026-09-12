---
title: "Documentation migration inventory and source findings"
status: draft
tags:
  - "content"
  - "seo"
---

## Overview
Historical baseline and current migration state for the unified documentation journey.
Baseline captured on 2026-09-12 before implementation: 33 source pages. The current site contains fifteen primary pages.
The map below preserves baseline source paths and their migration destinations. Removed source paths are historical references, not missing implementation targets.

## Content

### Repository baseline
| Repository | Branch and commit | Observed state | Role |
|---|---|---|---|
| docs | main, 80ac863 | Clean before this package | Public operating documentation |
| landing | main, c7159bd | Clean | Discovery, installation summary, integration catalog |
| global | main, ed569c3 | Modified and untracked context documents | Product definitions and cross-repository decisions |
| cli | main, 9734ce2 | Clean | Engine and delivery behavior |
| plugin | dev, 5bcd37b | Clean | Runtime source; not proof of a published release |

Global findings refer to the mounted working tree, not only ed569c3.
The inspected plugin branch is dev. Release parity has not been established for this package.

### Baseline-to-target map
| Current source | Destination | Treatment and retained content |
|---|---|---|
| @src/content/docs/index.mdx | / | Replace component choice with definition and task entry |
| @src/content/docs/start/choose.mdx | /start/install/ | Retire chooser; retain host eligibility in connection guidance |
| @src/content/docs/start/plugin-quick-start.mdx | /start/quick-start/ | Rewrite around one context-reuse exercise |
| @src/content/docs/start/migrate-from-flat-files.mdx | /guides/commands/#import-existing-instructions | Preserve import prerequisites and procedure |
| @src/content/docs/plugin/overview.mdx | /guides/commands/ | Merge user outcomes; remove repeated product introduction |
| @src/content/docs/plugin/install.mdx | /start/install/ | Consolidate installation; move host depth to connection guide |
| @src/content/docs/plugin/supported-hosts.mdx | /guides/connect-your-agent/#supported-hosts | Merge host setup and capability limits |
| @src/content/docs/plugin/how-it-works.mdx | /start/what-to-expect/ | Keep observed behavior; move hook details to connection guide |
| @src/content/docs/plugin/skills.mdx | /guides/commands/ | Own command examples and public options |
| @src/content/docs/plugin/agents.mdx | /guides/commands/#delegation | Retain user-visible delegation; omit packaging internals |
| @src/content/docs/plugin/troubleshooting.mdx | /guides/troubleshooting/ | Merge symptoms and recovery |
| @src/content/docs/cli/overview.mdx | / | Merge product explanation; preserve engine details in reference |
| @src/content/docs/cli/install.mdx | /start/install/ | Own installer facts, updates, prerequisites, privacy links |
| @src/content/docs/cli/quick-start.mdx | /start/quick-start/ | Consolidate common steps; link MCP-only access from connection guide |
| @src/content/docs/cli/commands.mdx | /cli/commands/ | Retain public commands and stable command anchors |
| @src/content/docs/cli/mcp-server.mdx | /guides/connect-your-agent/#mcp | Preserve project-root binding and manual setup |
| @src/content/docs/cli/hooks.mdx | /guides/connect-your-agent/#lifecycle-hooks | Preserve installation, limitations, guards, and recovery |
| @src/content/docs/cli/agent-integrations.mdx | /guides/connect-your-agent/ | Own per-host connection guidance |
| @src/content/docs/cli/global-sources.mdx | /cli/configuration/#global-sources | Preserve setup; explain semantics in Project context |
| @src/content/docs/cli/configuration.mdx | /cli/configuration/ | Retain settings and add moved operational configuration |
| @src/content/docs/cli/troubleshooting.mdx | /guides/troubleshooting/ | Merge by symptom, preserving command-based diagnosis |
| @src/content/docs/concepts/what-is-archcore.mdx | / | Definition here; rationale moves to Why Archcore |
| @src/content/docs/concepts/mental-model.mdx | /concepts/project-context/ | Lead with documents; relocate component mechanics |
| @src/content/docs/concepts/how-it-works.md | /concepts/project-context/ | Consolidate categories and context lifecycle |
| @src/content/docs/concepts/documents.md | /concepts/project-context/#documents-and-layout | Keep organization and status semantics |
| @src/content/docs/concepts/document-types.md | /concepts/document-types/ | Retain complete catalog; lead with selection examples |
| @src/content/docs/concepts/relations.md | /concepts/project-context/#relations | Retain directions, all relation values, and limitations |
| @src/content/docs/concepts/vs-flat-files.mdx | /concepts/why-archcore/#instruction-files | Retain reasoned comparison and limits |
| @src/content/docs/concepts/use-cases.mdx | /concepts/why-archcore/#when-to-use-archcore | Retain concrete fit examples; link command exercises |
| @src/content/docs/reference/document-format.md | /reference/document-format/ | Retain format contract and public validation behavior |
| @src/content/docs/reference/mcp-tools.md | /reference/mcp-tools/ | Retain complete public tool contract |
| @src/content/docs/reference/skills.mdx | /guides/commands/ | Merge public option lookup; remove duplicated route exposition |
| @src/content/docs/reference/precision-checks.md | /reference/document-format/#precision-checks | Preserve actionable findings and remediation lookup |

Migration-only wrapper pages carry redirects, not duplicate article bodies.
A redirect destination fragment does not preserve every older fragment automatically.
Existing heading IDs require a separate capture and alias pass, including links already redirected by @astro.config.mjs.
For a source split across destinations, body links change to the precise destination; old URL anchors retain compatibility aliases.

### Created migration files
The following migration outputs now exist under @src/content/docs/.
- @src/content/docs/start/install.mdx
- @src/content/docs/start/quick-start.mdx
- @src/content/docs/start/what-to-expect.mdx
- @src/content/docs/guides/commands.mdx
- @src/content/docs/guides/connect-your-agent.mdx
- @src/content/docs/guides/integrations.mdx
- @src/content/docs/guides/troubleshooting.mdx
- @src/content/docs/concepts/why-archcore.mdx
- @src/content/docs/concepts/project-context.mdx
The root page and five retained concept/reference files provide the remaining destinations.

### Cross-repository findings
| Finding | Evidence | Documentation consequence |
|---|---|---|
| Component-choice presentation remains explicit | @src/components/PathChooser.astro; @src/components/PathBadge.astro | Remove this presentation from onboarding |
| CLI delivery follows explicit consent | @../cli/cmd/init.go, outcomePicked versus outcomeDetected | Never promise plugin installation after detection alone |
| Noninteractive and CI paths differ | @../cli/cmd/init.go, deliverPlugins | Show printed follow-up actions as incomplete setup |
| Runtime delegates lifecycle policy | @../plugin/plugins/archcore/bin/pre-tool-use; @../plugin/plugins/archcore/bin/session-start | Describe user effects before ownership details |
| Agent-led init seeds documents separately | @../plugin/plugins/archcore/skills/init/SKILL.md | Separate terminal setup from first context creation |
| Landing already exposes one installation section | @../landing/src/components/pages/how-to-use.tsx; @../landing/src/components/cta/install-command.tsx | Preserve one product narrative and update deep links |
| Catalog has four source recipes | @../landing/src/content/integrations/ | Link discovery to landing; do not duplicate recipe prose |
| Recipe instructions have an upstream importer | @../landing/src/lib/recipe-source.ts | Preserve instruction-source ownership |
| CLI and plugin releases have distinct identifiers | @src/content.config.ts | Preserve release metadata while changing onboarding |
| Machine bundles have existing consumers | Existing docs SEO plan and @astro.config.mjs | Capture bundle URLs before reorganizing sets |

The global install-responsibility rule prohibits the runtime from downloading the engine.
The global integration-catalog decision assigns operational depth to docs and discovery to landing.
Both were read through the mounted read-only source. Their current working-tree provenance is recorded above.

### Baseline conflicts and evidence gaps
- Resolved: the local content-structure rule now specifies the unified journey and delegates the exact page set to the specification.
- Resolved: the local site description now records one product, four groups, fifteen pages, and the current build stages.
- Resolved: the update task pattern now distinguishes global product definitions, CLI behavior, and plugin behavior.
- Global messaging-and-voice still mentions peer entry points; the newer one-product decision retires that wording.
- Host-roster prose includes historical two-step descriptions; engine behavior determines the current installation instructions.
- No new joint-run verification, user-comprehension study, or installation execution was performed.
- Captured: 452 historical headings, six machine-bundle URLs, and 56 redirect routes. The final active sibling-link audit checked 44 links across 26 files.
- Specific public host-version claims require release verification before publication; dev source is not a release record.

### Method sources
The information-architecture recommendation uses Diataxis task separation and progressive disclosure, inspected earlier in this session on 2026-09-12.
https://diataxis.fr/ ; https://diataxis.fr/how-to-use-diataxis/ ; https://www.nngroup.com/articles/progressive-disclosure/
These are design guidance, not measured evidence that fifteen pages improve Archcore adoption.

## Examples
A reader arriving at /cli/hooks/ reaches the connection guide's lifecycle section.
A reader following an existing hook heading retains access through its preserved heading alias.

## Current migration result

The user subsequently requested a task-loop quick start, command headings in init/plan/document/review order, short linked integration summaries, selective context capture, free-form layout, reduced sync guidance, and plugin prose guidance. The specification now records these refinements.

@src/data/docs-navigation.mjs owns current route and fragment mappings. @scripts/finalize-docs.mjs implements compatibility output.
The install-per-host fragment now reaches the actual host instructions. Other split-page fragments still need a topic-level audit; identifier presence alone is insufficient.
The final checks passed locally. No publication or independent first-use session was performed by this migration task.
