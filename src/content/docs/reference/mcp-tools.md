---
title: MCP Tools Reference
description: Complete reference for all 10 Model Context Protocol tools — list_documents, search_documents, get_document, create_document, init_project, and more.
---

The Archcore MCP server exposes 10 tools that AI agents use to interact with your `.archcore/` documents.

## Source annotation and global sources

When a project declares [global sources](/cli/global-sources/), the read tools (`list_documents`, `search_documents`, `get_document`) return documents from both the local project and the mounted globals. Every returned document carries source annotation so the agent can tell them apart:

| Field | Local document | Global document |
| ----- | -------------- | --------------- |
| `source_id` | `local` | the source's declared `id` |
| `source_kind` | `local` | `global` |
| `read_only` | _(omitted)_ | `true` |
| `global` | _(omitted)_ | `true` |

Global documents are **read-only**: the write tools (`create_document`, `update_document`, `remove_document`) reject any global path, and `add_relation` refuses an edge that touches a global on either endpoint. Local documents always take precedence over a same-topic global.

## list_documents

List documents with optional filters.

**Parameters:**

| Name       | Type     | Required | Description                                                                                  |
| ---------- | -------- | -------- | -------------------------------------------------------------------------------------------- |
| `types`    | string[] | No       | Filter by document types (e.g., `["adr", "rule"]`)                                           |
| `category` | string   | No       | Filter by layer: `vision`, `knowledge`, or `experience`                                      |
| `status`   | string   | No       | Filter by status: `draft`, `accepted`, or `rejected`                                         |
| `tags`     | string[] | No       | Filter by tags with OR semantics (matches documents with at least one of the specified tags) |

**Returns:** Array of documents with path, title, type, layer, and status.

**Example response:**

```
[vision]
  - roadmap/auth-v2.prd.md — "Auth System Redesign" (draft)

[knowledge]
  - auth/jwt-strategy.adr.md — "Use JWT for Authentication" (accepted)
  - auth/auth-rules.rule.md — "Authentication Rules" (accepted)
  - api/rest-guide.guide.md — "REST API Setup Guide" (draft)
```

---

## search_documents

Search documents by path reference, content substring, or metadata. Unlike `list_documents`, this tool scans document bodies and returns per-match evidence (excerpts, specificity, ranking). Read-only.

**Parameters:**

| Name          | Type     | Required    | Description                                                                                                                  |
| ------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `path_ref`    | string   | conditional | Path reference to match in document bodies. Matches both `@path` notation and qualified bare paths. Leading `@` is optional. |
| `content`     | string   | conditional | Case-insensitive substring matched against title + body. No stemming or fuzzy matching.                                      |
| `types`       | string[] | conditional | Filter by document types (e.g., `["adr", "rule"]`).                                                                          |
| `status`      | string   | conditional | Filter by status: `draft`, `accepted`, or `rejected`.                                                                        |
| `mtime_after` | string   | No          | Only include documents modified after this time. Accepts RFC3339 timestamps or relative durations (`24h`, `30d`, `90d`).     |
| `sort`        | string   | No          | Result ordering: `relevance` (default) or `mtime`.                                                                           |
| `limit`       | number   | No          | Maximum number of results. Default 50, max 200. Values above 200 are clamped.                                                |

At least one of `path_ref`, `content`, `types`, or `status` must be provided. Filters combine with AND semantics.

**Sort modes:**

- `relevance` — orders by max match specificity DESC, then type priority (`rule` > `adr` > `spec` > ...), then mtime DESC.
- `mtime` — orders purely by modification time, newest first.

**Returns:** Array of matched documents. Each result has:

- `path`, `title`, `type`, `status`, `mtime`, `tags` — document metadata.
- `matches` — per-match evidence array. Each entry has `kind` (`path_ref_explicit`, `path_ref_mention`, or `content`), `ref` (the matched token), `specificity` (integer), and `excerpt` (~120-char window). Empty array for pure-metadata queries.
- `incoming_relations`, `outgoing_relations` — manifest edges involving this document.

**Example — find rules and ADRs that reference a code path:**

```
search_documents({
  path_ref: "src/payments/",
  types: ["rule", "adr"]
})
```

**Example — content search across all documents:**

```
search_documents({
  content: "money rounding",
  status: "accepted",
  limit: 20
})
```

---

## get_document

Read a document's full content with its relations.

**Parameters:**

| Name   | Type   | Required | Description                                   |
| ------ | ------ | -------- | --------------------------------------------- |
| `path` | string | Yes      | Document path as returned by `list_documents` |

**Returns:** Full document content plus outgoing and incoming relations.

---

## create_document

Create a new document. Generates from template if no content is provided. Rejects a target directory under a [global source](/cli/global-sources/) — globals are read-only.

**Parameters:**

| Name        | Type     | Required | Description                                       |
| ----------- | -------- | -------- | ------------------------------------------------- |
| `type`      | string   | Yes      | Document type (e.g., `adr`, `rule`, `guide`)      |
| `filename`  | string   | Yes      | Slug for the filename (lowercase, hyphens only)   |
| `title`     | string   | No       | Human-readable title                              |
| `status`    | string   | No       | Status: `draft` (default), `accepted`, `rejected` |
| `content`   | string   | No       | Markdown body. If omitted, generates template     |
| `directory` | string   | No       | Subdirectory within `.archcore/`                  |
| `tags`      | string[] | No       | Tags for cross-cutting categorization             |

**Returns:** Path, type, layer, title, status, and `nearby_documents` hint (for adding relations).

**Example:**

```
Agent calls: create_document({
  type: "adr",
  filename: "use-postgres",
  title: "Use PostgreSQL as Primary Database",
  directory: "database"
})

Creates: .archcore/database/use-postgres.adr.md
```

---

## update_document

Modify an existing document's title, status, or content. Rejects a path under a [global source](/cli/global-sources/) — globals are read-only.

**Parameters:**

| Name      | Type     | Required | Description                                                                              |
| --------- | -------- | -------- | ---------------------------------------------------------------------------------------- |
| `path`    | string   | Yes      | Document path                                                                            |
| `title`   | string   | No       | New title                                                                                |
| `status`  | string   | No       | New status                                                                               |
| `content` | string   | No       | New markdown body                                                                        |
| `tags`    | string[] | No       | New tags (replaces existing). Omit to preserve current tags; pass `[]` to clear all tags |

At least one of `title`, `status`, `content`, or `tags` must be provided.

---

## remove_document

Permanently delete a document and all its relations. Rejects a path under a [global source](/cli/global-sources/) — globals are read-only.

**Parameters:**

| Name   | Type   | Required | Description   |
| ------ | ------ | -------- | ------------- |
| `path` | string | Yes      | Document path |

**Returns:** Confirmation with `relations_removed` count.

:::caution
This is a destructive action. Prefer `update_document` with `status: "rejected"` to preserve history.
:::

---

## add_relation

Create a directed relation between two documents. Refuses an edge whose source **or** target is a [global source](/cli/global-sources/) document, in either direction — relations connect local documents only.

**Parameters:**

| Name     | Type   | Required | Description                                                     |
| -------- | ------ | -------- | --------------------------------------------------------------- |
| `source` | string | Yes      | Source document path                                            |
| `target` | string | Yes      | Target document path                                            |
| `type`   | string | Yes      | Relation type: `related`, `implements`, `extends`, `depends_on` |

**Example:**

```
add_relation({
  source: "roadmap/auth-v2.plan.md",
  target: "roadmap/auth-v2.prd.md",
  type: "implements"
})
```

---

## remove_relation

Remove a directed relation between two documents.

**Parameters:**

| Name     | Type   | Required | Description          |
| -------- | ------ | -------- | -------------------- |
| `source` | string | Yes      | Source document path |
| `target` | string | Yes      | Target document path |
| `type`   | string | Yes      | Relation type        |

---

## list_relations

List all relations, optionally filtered by document.

**Parameters:**

| Name   | Type   | Required | Description                              |
| ------ | ------ | -------- | ---------------------------------------- |
| `path` | string | No       | Filter relations involving this document |

**Returns:** All relations (or relations for the specified document) showing source, target, and type.

---

## init_project

Initialize the `.archcore/` knowledge base for the current project. Idempotent — safe to call on an already-initialized project (existing settings are preserved and returned).

**Parameters:**

| Name           | Type   | Required    | Description                                                                                          |
| -------------- | ------ | ----------- | ---------------------------------------------------------------------------------------------------- |
| `language`     | string | No          | BCP-47 language code for generated document content (e.g., `en`, `ru`, `ja`). Defaults to `en`.      |
| `sync_mode`    | string | No          | Sync mode: `none` (default, local only), `cloud`, or `on-prem`.                                      |
| `archcore_url` | string | conditional | Required only when `sync_mode="on-prem"`. URL of the on-prem Archcore server.                        |

**Returns:** JSON with `initialized: true`, the resulting `settings` object, and `already_initialized: bool`.

**When agents call this:** the MCP server starts even in repos without `.archcore/`. When `list_documents` reports an empty result on a fresh repo and the user asks to create a document, an agent should call `init_project` once to bootstrap the directory, then proceed. Subsequent calls are no-ops.

This tool does **not** install hooks or MCP configs for other agents and does **not** register the MCP server itself — those still require `archcore hooks install` and `archcore mcp install` from the shell.

---

## MCP prompts

Beyond tools, the MCP server also exposes 5 **prompts** that orchestrate multi-document workflows in a single call (PRD + plan, ADR + spec + plan, ISO 29148 cascade, etc.). Most MCP-aware clients surface them as slash commands.

See [MCP prompts](/reference/mcp-prompts/) for the complete prompt catalog and arguments.
