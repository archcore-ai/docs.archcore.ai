---
title: "Update documentation from CLI context"
status: accepted
---

## What

Standard task for syncing the documentation site text with the current state of `.archcore/` in the CLI repository (https://github.com/archcore-ai/cli).

## When to Use

- A new CLI version is released
- Documents in `.archcore/` of the CLI repository have changed
- Need to verify the docs site is up to date

## Steps

1. Open the CLI repository and read the contents of `.archcore/` — this is the source of truth
2. Compare CLI `.archcore/` documents with current pages in `src/content/docs/`
3. Identify discrepancies: new features, changed behavior, removed capabilities
4. Update the corresponding `.mdx` files in the docs repository
5. Verify no information exists that is not present in CLI

## Example

CLI adds a new document type `cpat`. An updated `doc` appears in CLI `.archcore/` describing types → update `src/content/docs/concepts/document-types.mdx`.

## Things to Watch Out For

- Do not add information from memory — only from CLI context
- Watch for renamed commands and flags
- Verify that code examples in documentation match actual behavior