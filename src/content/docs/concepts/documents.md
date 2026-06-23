---
title: Documents & Layout
description: How to name, organize, and structure documents inside the .archcore/ directory.
---

## File Naming

Every document follows the pattern:

```
<slug>.<type>.md
```

- **Slug** -- lowercase alphanumeric with hyphens. Must match `^[a-z0-9]+(-[a-z0-9]+)*$`
- **Type** -- one of the 19 valid types (see [Document Types](/concepts/document-types/))
- **Extension** -- always `.md`

**Valid:** `jwt-strategy`, `use-postgres`, `api-v2-migration`

**Invalid:** `JWT_Strategy` (uppercase), `use postgres` (spaces), `my.decision` (dots in slug), `jwt_strategy` (underscores)

### Examples

```
jwt-strategy.adr.md           # decision record
api-error-format.rule.md      # enforced standard
setting-up-ci.guide.md        # step-by-step how-to
auth-redesign.prd.md          # product requirements
callbacks-to-async.cpat.md    # code pattern change
```

## Free-Form Directories

The directory structure inside `.archcore/` is completely free-form. Organize documents by domain, feature, team, or any structure that fits your project.

Layers (**vision**, **knowledge**, **experience**) are virtual -- derived from the document type in the filename, not from the physical directory. Moving a file between directories never changes its layer.

Other rules:

- Hidden directories (starting with `.`) are ignored
- Nesting depth is unlimited
- Two documents can share a slug if they live in different directories
- Directory names have no restrictions (lowercase with hyphens recommended)

:::tip[Start flat]
You don't need to design the perfect directory tree upfront. Put documents in the root of `.archcore/`. Organize into subdirectories when you have 10+ documents and want to group them.
:::

## Recommended Layouts

### Small Project (1-5 documents)

Keep it flat. No subdirectories needed.

```
.archcore/
  settings.json
  use-typescript.adr.md
  coding-standards.rule.md
  setup.guide.md
```

### Growing Product Team (5-20 documents)

Organize by domain or feature area.

```
.archcore/
  settings.json
  coding-standards.rule.md
  auth/
    jwt-strategy.adr.md
    auth-setup.guide.md
  payments/
    stripe.adr.md
  roadmap/
    q1-goals.prd.md
    auth-v2.plan.md
```

### Platform / Infrastructure Repo (20+ documents)

Organize by domain with deeper nesting as needed.

```
.archcore/
  settings.json
  api/
    versioning.adr.md
    error-format.rule.md
    rate-limiting.rule.md
  auth/
    jwt-strategy.adr.md
    auth-rules.rule.md
    auth-redesign.prd.md
  infrastructure/
    k8s-migration.adr.md
    deployment-checklist.guide.md
  patterns/
    api-endpoint-creation.task-type.md
    error-handling-v2.cpat.md
```

You can also organize by team (`backend/`, `frontend/`, `platform/`) or mix approaches -- top-level rules with domain-specific subdirectories. Pick whatever makes documents easy to find.

## Special Files

| File | Purpose |
|------|---------|
| `settings.json` | Required. Sync configuration and language settings |
| `.sync-state.json` | Auto-generated. Stores document relations and sync state |

Both files are managed by the [CLI](/cli/commands/) and skipped during document scanning.

## Next Steps

- [Document Types](/concepts/document-types/) -- all 19 types and when to use each
- [Plugin quick start](/start/plugin-quick-start/) or [CLI quick start](/cli/quick-start/) -- create your first document
- [MCP Server](/cli/mcp-server/) -- let AI agents read and write project context
