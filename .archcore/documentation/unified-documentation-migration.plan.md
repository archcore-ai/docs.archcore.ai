---
title: "Implement the unified documentation journey"
status: draft
tags:
  - "content"
  - "seo"
---

## Goal
Deliver the unified documentation journey specified by the linked contract.
Status: implementation in progress. The fifteen-page site and sibling-link migration are implemented locally. Final conformance and acceptance remain open.
The inventory records baseline commits, the 33-page disposition, proposed new files, and source conflicts.

## Tasks

### Phase 1: Establish the migration baseline
1. Capture all current routes, heading IDs, redirects, and machine-bundle URLs from @astro.config.mjs and @src/content/docs/.
2. Find incoming documentation links in @../landing/src/, @../cli/README.md, and @../plugin/README.md.
3. Pin release evidence for host installation instructions against @../cli/cmd/init.go and @../plugin/plugins/archcore/skills/init/SKILL.md.
4. Reconcile the proposed contract with the existing content-structure rule through Archcore MCP.
5. Update the page-adding guide and CLI-sync task pattern through Archcore MCP.
6. Record sibling-source conflicts for their owners without editing mounted global documents.

Phase 1 evidence: a repository route/anchor baseline (not yet committed) and a claim ledger naming source revisions.
Implementation files: @scripts/fixtures/docs-migration-baseline.json, @scripts/check-docs.mjs, @scripts/finalize-docs.mjs, and @src/data/docs-navigation.mjs.
The relation graph identifies the local navigation rule, page-adding guide, and CLI-sync pattern targeted by this phase.
Sibling correction targets: global messaging-and-voice and supported-ai-hosts, available through the global source repository.
Those upstream corrections are tracked follow-ups, not authority to rewrite the mounted read-only source.

### Phase 2: Produce the four introductory pages
1. Rewrite @src/content/docs/index.mdx using the contract's Overview responsibility.
2. Create @src/content/docs/start/install.mdx from both existing installation pages and the pinned engine behavior.
3. Create @src/content/docs/start/quick-start.mdx from the existing quick starts and the agent-init source.
4. Create @src/content/docs/start/what-to-expect.mdx from existing lifecycle explanations and host limitations.
5. Review the four pages together against the linked contract before migrating the remaining content.

The three new start files are implemented outputs recorded in the inventory.
Use a named supported host for the first exercise; document the actual host/version in its execution evidence.
The exercise records a real project rule or decision, rather than introducing a fictitious team policy.

### Phase 3: Consolidate remaining content
1. Create @src/content/docs/guides/commands.mdx from the mapped command, import, and delegation pages.
2. Create @src/content/docs/guides/connect-your-agent.mdx from the mapped host, MCP, and hook pages.
3. Create @src/content/docs/guides/integrations.mdx with operational guidance and links to @../landing/src/pages/integrations/index.astro.
4. Merge both troubleshooting pages into @src/content/docs/guides/troubleshooting.mdx.
5. Create @src/content/docs/concepts/why-archcore.mdx from the mapped rationale and fit pages.
6. Create @src/content/docs/concepts/project-context.mdx from the mapped model, layout, and relation pages.
7. Restructure @src/content/docs/concepts/document-types.md around selection before full catalog lookup.
8. Consolidate global-source operations in @src/content/docs/cli/configuration.mdx.
9. Consolidate precision-check lookup in @src/content/docs/reference/document-format.md.
10. Reconcile @src/content/docs/cli/commands.mdx and @src/content/docs/reference/mcp-tools.md with pinned public behavior.

### Phase 4: Switch navigation and preserve access
1. Replace the sidebar configuration in @astro.config.mjs with the contract's route table.
2. Remove obsolete onboarding imports of @src/components/PathChooser.astro and @src/components/PathBadge.astro.
3. Replace component-specific callouts using @src/components/CrossLinkCallout.astro with task links.
4. Apply the inventory's redirect mapping in @astro.config.mjs.
5. Preserve discovered legacy heading IDs on the destination pages.
6. Reorganize generated documentation bundles through @astro.config.mjs without abandoning published bundle URLs.
7. Remove superseded source articles after their destinations and redirects exist.
8. Update incoming links in @../landing/src/, @../cli/README.md, and @../plugin/README.md using separate repository changes.
9. Refresh the linked site-description document through Archcore MCP.
10. Reconcile remaining cross-link work in the linked SEO plan through Archcore MCP.

Keep the existing changelog collection and release identifiers.
New sidebar labels do not require changing retained page titles; title changes receive separate duplicate-title review.
Historical redirect chains are flattened only after their complete destinations are known.

### Phase 5: Verify and close
1. Add route, anchor, sidebar, and bundle conformance checks under @scripts/.
2. Integrate the checks with the existing build entry in @package.json.
3. Run the production build through @package.json, preserving @scripts/check-first-load.mjs.
4. Review the introductory pages in a browser at the widths specified by the contract.
5. Execute the documented exercise on the recorded host and version.
6. Record remaining host coverage gaps without converting them into support claims.
7. Reconcile the package through /archcore:review after implementation.
8. Request acceptance of verified documents through /archcore:document.

Do not run installer demonstrations against the maintainer's active repository without choosing a disposable project.
Implemented checks: @scripts/check-docs.mjs and @scripts/check-first-load.mjs; compatibility output: @scripts/finalize-docs.mjs.

## Acceptance Criteria
1. The implementation review contains evidence for every conformance category in the linked specification.
2. The migration review accounts for every row in the linked inventory.
3. The claim ledger resolves publication-blocking source disagreements or identifies omitted claims.
4. The four introductory pages receive a joint content review before the sidebar switch.
5. Each sibling-repository link change has its own reviewable diff and recorded delivery state.
6. The closeout distinguishes implementation verification from unperformed user studies.

## Dependencies
Implementation follows the new local contract and the inventory linked through the relation graph.
Installation details depend on @../cli/cmd/init.go and the runtime entry under @../plugin/plugins/archcore/skills/init/.
Recipe discovery depends on the landing catalog; it does not require duplicating its source instructions.
The existing production pipeline and JavaScript budget remain the deployment boundary.
No runtime capability change or recipe compatibility experiment is required to write truthful documentation.

## Declared Delta
- route: capability (size L).
- creates: [unified-documentation-journey].
- modifies: []; no accepted local spec currently covers the new unified journey.
- retires: []; removed component-choice pages are presentation artifacts, and their public URLs remain compatibility routes.
- decision: none; the single-product direction comes from the user and existing upstream decisions.
- intent_gap: yes; newcomer completion and documentation-maintenance outcomes are recorded in the PRD.
- Π: machine for repository facts and existing design guidance; user for supplied product intent; no remaining question blocks drafting.
- M: stone, because accepted local writing, navigation, source, and infrastructure documents cover the zone.
- R: external-contract, covering published URLs, anchors, machine bundles, and sibling links.
- raised by: stone and external-contract, applied as one size escalation from M to L.
- instruments: intent, contract, decompose; supporting reference inventory.
- Runbook: not added; this is a one-time editorial migration, and installation behavior already exists.
- The proposed capability is one reader journey with one shared page-ownership contract, not fifteen independently introduced product capabilities.
- Existing behavior sources are grounded; historical prose conflicts are recorded in the inventory, not silently adopted.
- New-file targets and check filenames are now resolved in the implementation.

## Clarifications
The user requested specification-led restructuring before page implementation.
The fifteen-page set is implemented locally; the new specification remains draft pending acceptance.
The user selected implementation of all phases and subsequently authorized link fixes and synchronization with landing, CLI, and plugin. Package documents remain draft pending explicit acceptance.


## Execution evidence: 2026-09-12
1. Current implementation: fifteen primary pages replace thirty-three source pages. The baseline covers 452 historical headings, 56 redirect routes, and six legacy machine-bundle URLs.
2. Production build: `ALLOW_MISSING_ANALYTICS_KEY=1 npm run build` completed successfully. The first-load check reports 16.9 KB raw against the 25 KB budget.
3. Sibling synchronization: 44 active documentation links across 26 source files in landing, CLI, and plugin resolve against the built site. The scan checked paths and fragments and rejected retired routes. Generated translation modules, obsolete translation entries, historical changelogs, and Archcore records were excluded.
4. Sibling changes include @../landing/public/llms.txt, @../landing/public/install/index.html, landing source links, @../cli/README.md, @../plugin/README.md, @../plugin/plugins/archcore/skills/init/SKILL.md, and @../plugin/plugins/archcore/bin/session-start. Delivery state: local edits only; no commit, push, or publication was performed.
5. Plugin verification: all ten tests in @../plugin/test/unit/session-start-goldens.bats pass with the updated installation URL.
6. Browser verification: Chromium loaded all four introductory pages at 390 and 1280 pixels. All returned HTTP 200 with an H1, no horizontal overflow, and no page errors. Screenshots are temporary local artifacts under /tmp/archcore-docs-browser/.

## Remaining closeout work
1. The install-per-host fragment is fixed and verified in Chromium. Other split-page fragment destinations remain open, including the former install page's analytics section. Existing checks establish identifier presence, not topic-correct placement.
2. The documented exercise has not been executed through creation, human approval, and retrieval in a separate agent session. No end-to-end first-use claim is supported yet.
3. The deep drift review is complete and the site description is updated. Final claim-ledger reconciliation, SEO-plan reconciliation, and unregistered-link detection remain open.
4. User comprehension and completion-time improvements are hypotheses, not measured outcomes.
5. Acceptance of the new package remains pending. Do not report all phases complete.

## Review reconciliation

The user authorized context updates after the deep drift review. The site description, journey contract, baseline interpretation, build description, and checker limitations are reconciled.
The source-file correction to @CLAUDE.md remains separate work. Review did not modify code or host instruction files.
All fifteen pages passed the latest browser checks at 390 and 1280 pixels. Both malformed GitHub Releases URLs are fixed.
The final build and the ten plugin golden tests passed. Landing type checking and ESLint passed; the type checker reported 120 diagnostic hints.
The completed review does not discharge this plan: first-use execution, residual compatibility work, and acceptance remain open.
