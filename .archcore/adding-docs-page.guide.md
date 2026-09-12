---
title: "Maintain the documentation page set"
status: accepted
---

Reader and actor: documentation maintainer updating a page or proposing a navigation change.

## Prerequisites

The documentation journey contract defines the page set. @src/data/docs-navigation.mjs implements its sidebar and migration destinations.

## Steps

1. Identify the page that owns the reader's task in the journey contract.
2. Edit that page under @src/content/docs/ when its subject already exists.
3. Before adding a primary page, propose a revision to the journey contract through Archcore MCP.
4. Verify concepts against global context, engine behavior against CLI source, and runtime behavior against plugin source.
5. Preserve identifiers, commands, quoted output, and existing managed blocks.
6. Give the page a unique title and a description within 120 characters.
7. Add contextual links to related pages.
8. Update @src/data/docs-navigation.mjs for an approved route change.
9. Preserve old routes and anchors through the migration fixture and finalizer.
10. Run npm run build.

## Verification

@package.json runs @scripts/check-docs.mjs after the build finalizer, followed by the JavaScript budget check.
The page appears in the contract's sidebar position and retains its contextual links.

## Common Issues

A page outside the registered set fails the structure check. The finalizer inserts missing baseline heading aliases, so the anchor check confirms identifier presence rather than topic-correct placement.
Review moved headings against their actual content destinations. The checker currently skips unregistered internal article routes; review those links separately until the implementation gap is fixed.
A new concept without an upstream definition needs an upstream decision before publication.
