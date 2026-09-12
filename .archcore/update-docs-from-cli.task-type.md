---
title: "Update documentation from upstream sources"
status: accepted
---

## What

Maintain reader-facing documentation from its owning upstream sources. Current procedure for @src/content/docs/ and @src/content/changelog/.

## When to Use

An engine release, runtime release, or accepted product-definition change affects public documentation.

## Steps

1. Identify affected pages through their owning subjects in the documentation journey contract.
2. Read product definitions from the mounted global source.
3. Read engine behavior from the CLI repository's source and context.
4. Read runtime behavior from the plugin repository's source and context.
5. Record the branch, revision, and release state behind each changed behavioral claim.
6. Report same-subject source disagreements before changing public claims.
7. Update the owning page and replace repeated explanations with links.
8. Preserve public identifiers and historical release quotations.
9. Run the production build and review the affected rendered pages.

## Example

A CLI installation change updates the installation or connection page. A plugin command change updates Commands and examples.
A new document type first receives an upstream definition, then updates the type catalog and affected tool reference.

## Things to Watch Out For

A development branch is not proof of released behavior. The CLI owns engine semantics, not the product vocabulary or runtime command semantics.
The structure checks in @scripts/check-docs.mjs preserve navigation and existing public addresses.
