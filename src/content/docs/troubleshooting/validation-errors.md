---
title: Common Validation Errors
description: Understand and fix validation errors from archcore validate.
---

`archcore validate` checks every document in `.archcore/` for correct naming, structure, and frontmatter. This page explains each error you might see and how to fix it.

## Invalid filename

**What you see:** The file doesn't match the `slug.type.md` pattern.

**Why it happens:** Slugs must be lowercase alphanumeric with hyphens only. The filename must follow the exact format `slug.type.md` — no extra dots, no spaces, no underscores.

**Examples of invalid names:**

| Filename | Problem |
|----------|---------|
| `My Decision.adr.md` | Spaces and uppercase |
| `jwt_strategy.adr.md` | Underscores |
| `UsePostgres.adr.md` | Uppercase letters |
| `api.v2.migration.adr.md` | Extra dots in the slug |

**Fix:** Rename the file to use a valid slug:

```bash
# Wrong
mv ".archcore/My Decision.adr.md" ".archcore/my-decision.adr.md"

# Wrong
mv ".archcore/jwt_strategy.adr.md" ".archcore/jwt-strategy.adr.md"
```

Slugs must match the pattern `^[a-z0-9]+(-[a-z0-9]+)*$`. See [Document Format](/reference/document-format/) for the full spec.

## Unknown document type

**What you see:** The type portion of the filename isn't recognized.

**Why it happens:** The type (the middle part of `slug.type.md`) must be one of the 11 valid types. Anything else is rejected.

**Valid types:**

```
adr, rfc, rule, guide, spec, doc, prd, idea, plan, task-type, cpat
```

**Common mistakes:**

| Filename | Problem | Fix |
|----------|---------|-----|
| `auth.decision.md` | `decision` is not a type | Rename to `auth.adr.md` |
| `setup.tutorial.md` | `tutorial` is not a type | Rename to `setup.guide.md` |
| `api-spec.reference.md` | `reference` is not a type | Rename to `api-spec.spec.md` or `api-spec.doc.md` |

**Fix:** Rename the file using one of the 11 valid types. See [Document Types](/concepts/document-types/) for guidance on choosing the right type.

## Missing frontmatter

**What you see:** The document is missing YAML frontmatter, or the frontmatter is missing required fields.

**Why it happens:** Every Archcore document requires YAML frontmatter with both `title` and `status` fields. If either is missing, the document fails validation.

**Fix:** Add the required frontmatter at the top of the file:

```markdown
---
title: Use PostgreSQL as Primary Database
status: draft
---

Your document content here...
```

Both fields are required:

| Field | Type | Required values |
|-------|------|----------------|
| `title` | string | Any non-empty string |
| `status` | string | `draft`, `accepted`, or `rejected` |

## Invalid status

**What you see:** The `status` field contains an unrecognized value.

**Why it happens:** Status must be exactly one of three values. No other values are allowed — not `active`, not `approved`, not `archived`.

**Valid values:**

| Status | Meaning |
|--------|---------|
| `draft` | Work in progress (default for new documents) |
| `accepted` | Finalized or approved |
| `rejected` | Superseded, abandoned, or declined |

**Fix:** Update the frontmatter to use a valid status:

```yaml
---
title: API Rate Limiting
status: accepted
---
```

## Orphaned relations

**What you see:** A relation points to a document that no longer exists on disk.

**Why it happens:** You deleted or renamed a document, but the relation referencing it still exists in `.sync-state.json`. The relation's target path no longer matches any file.

**Fix:** Run validate with the `--fix` flag:

```bash
archcore validate --fix
```

This automatically removes orphaned relations from the manifest and saves the updated `.sync-state.json`. No manual editing needed.

## Invalid YAML

**What you see:** The frontmatter can't be parsed as valid YAML.

**Why it happens:** The YAML between the `---` delimiters has a syntax error. Common causes:

- **Missing closing `---`** — the frontmatter block needs both an opening and closing delimiter
- **Tabs instead of spaces** — YAML requires spaces for indentation, not tabs
- **Unquoted special characters** — colons, brackets, or other YAML-significant characters in values need quoting

**Examples:**

```yaml
# Wrong: missing closing ---
---
title: My Document
status: draft

Content starts here without closing the frontmatter...
```

```yaml
# Wrong: unquoted colon in title
---
title: Decision: Use PostgreSQL
status: draft
---
```

```yaml
# Correct: quote the value
---
title: "Decision: Use PostgreSQL"
status: draft
---
```

**Fix:** Correct the YAML syntax. If you're unsure what's wrong, start with a minimal frontmatter block and add fields back one at a time:

```yaml
---
title: Your Title Here
status: draft
---
```

## Using --fix

`archcore validate --fix` automates what it can:

- Removes orphaned relations from `.sync-state.json`
- Saves the cleaned manifest

It does **not** auto-fix:

- Invalid filenames (you need to rename files manually)
- Missing or invalid frontmatter (you need to edit the file)
- Unknown document types (you need to rename the file)
- Invalid YAML syntax (you need to fix the markup)

For a full project health check beyond validation, run:

```bash
archcore doctor
```

This adds checks for `settings.json`, MCP configuration, and server reachability on top of the standard validation. See [CLI Commands](/reference/cli-commands/) for details.
