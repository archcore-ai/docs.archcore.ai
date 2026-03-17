---
title: Directory Structure
description: How to organize documents inside .archcore/ — free-form layout by domain, feature, or team with virtual categories derived from file type.
---

## Free-Form Organization

The directory structure inside `.archcore/` is completely free-form. You can organize documents by domain, feature, team, or any other way that makes sense for your project.

Categories (**knowledge**, **vision**, **experience**) are **virtual** — derived automatically from the document type in the filename (`slug.type.md`), not from the physical directory.

## File Naming

Every document follows the pattern:

```
<slug>.<type>.md
```

- **Slug**: lowercase alphanumeric with hyphens (`^[a-z0-9]+(-[a-z0-9]+)*$`)
- **Type**: one of the 10 valid types (`adr`, `rfc`, `rule`, `guide`, `doc`, `prd`, `idea`, `plan`, `task-type`, `cpat`)
- **Extension**: always `.md`

Examples:
```
jwt-strategy.adr.md           ✅
api-error-format.rule.md      ✅
setting-up-ci.guide.md        ✅
My Decision.adr.md            ❌ (spaces, uppercase)
jwt_strategy.adr.md           ❌ (underscores)
decision.txt                  ❌ (wrong extension, no type)
```

## Examples

### By Domain

```
.archcore/
├── settings.json
├── auth/
│   ├── jwt-strategy.adr.md
│   ├── auth-rules.rule.md
│   └── auth-redesign.prd.md
├── payments/
│   ├── stripe-integration.adr.md
│   └── payment-processing.guide.md
└── infrastructure/
    ├── k8s-migration.adr.md
    └── deployment-checklist.guide.md
```

### By Team

```
.archcore/
├── settings.json
├── backend/
│   ├── api-versioning.adr.md
│   └── database-rules.rule.md
├── frontend/
│   ├── react-patterns.rule.md
│   └── component-library.doc.md
└── platform/
    └── ci-cd-pipeline.guide.md
```

### Flat (Small Projects)

```
.archcore/
├── settings.json
├── use-typescript.adr.md
├── coding-standards.rule.md
├── setup.guide.md
└── api-reference.doc.md
```

### Mixed

```
.archcore/
├── settings.json
├── coding-standards.rule.md          ← root level
├── auth/
│   ├── jwt-strategy.adr.md
│   └── auth-setup.guide.md
├── payments/
│   └── stripe.adr.md
└── roadmap/
    ├── q1-goals.prd.md
    └── auth-v2.plan.md
```

## Special Files

| File | Purpose |
|------|---------|
| `settings.json` | Required. Sync configuration and language |
| `.sync-state.json` | Auto-generated. Stores document relations and sync state |

Both are managed by the CLI and skipped during document scanning.

## Rules

1. Hidden directories (starting with `.`) are ignored
2. Subdirectory nesting depth is unlimited
3. Two documents can have the same slug if they're in different directories
4. Directory names have no naming restrictions (but lowercase with hyphens is recommended)
5. Moving a document to a different directory doesn't change its category
