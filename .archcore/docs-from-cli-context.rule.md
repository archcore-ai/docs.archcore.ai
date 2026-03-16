---
title: "Documentation is built solely from CLI context"
status: accepted
---

## Rule

All content on this documentation site is based **exclusively** on the CLI repository context: https://github.com/archcore-ai/cli

Do not add information that is absent from CLI sources. Do not invent features or behavior.

## Rationale

CLI is the single source of truth. The documentation lives in a separate repository and can drift. Binding to CLI context guarantees accuracy.

## Examples

**Good:** describing the `archcore init` command based on code and help text from CLI.

**Bad:** describing a hypothetical `archcore deploy` command that does not exist in CLI.

## Enforcement

When updating documentation — cross-check with `.archcore/` and source code in the CLI repository.