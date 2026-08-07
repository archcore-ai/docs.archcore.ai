---
title: MCP Tools Reference
description: Parameters, returns, and constraints for the 10 Archcore MCP tools, plus the conditional install_host_config tool.
---

The Archcore MCP server exposes 10 tools that AI agents use to interact with your `.archcore/` documents. An eleventh, [`install_host_config`](#install_host_config), is registered conditionally: `archcore mcp` exposes it, but a server built without a host-wiring executor does not.

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
| `limit`    | number   | No       | Maximum number of documents to return. Default 100, max 500. Values above 500 are clamped; `0` or omitted maps to the default; negative values return `limit must be non-negative`. |
| `offset`   | number   | No       | Number of matching documents to skip before the returned page. Default 0. Use with `truncated` to page through large result sets; negative values return `offset must be non-negative`. |

**Returns:** A JSON envelope object:

```json
{
  "documents": [ /* array of matching document rows */ ],
  "total": 0,
  "offset": 0,
  "returned": 0,
  "truncated": false
}
```

- `documents`: the page of matches, `[]` when nothing matches. Each row carries `path`, `title`, `type`, `category`, `status`, and `tags`.
- `total`: total number of documents matching the filters, before pagination.
- `offset`: the offset applied to this page.
- `returned`: number of documents in `documents` (the page size).
- `truncated`: `true` when more matches exist beyond this page. Narrow the filters or request the next page with `offset`.

**Example response:**

```json
{
  "documents": [
    {
      "path": "roadmap/auth-v2.prd.md",
      "title": "Auth System Redesign",
      "type": "prd",
      "category": "vision",
      "status": "draft",
      "tags": ["auth"]
    },
    {
      "path": "auth/jwt-strategy.adr.md",
      "title": "Use JWT for Authentication",
      "type": "adr",
      "category": "knowledge",
      "status": "accepted",
      "tags": ["auth", "security"]
    }
  ],
  "total": 142,
  "offset": 0,
  "returned": 2,
  "truncated": true
}
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
| `mtime_after` | string   | No          | Only include documents modified after this time. Accepts RFC3339 timestamps or a positive relative duration: `<N>h`, `<N>d`, `<N>w`, `<N>mo`, `<N>y`. |
| `sort`        | string   | No          | Result ordering: `relevance` (default) or `mtime`.                                                                           |
| `mode`        | string   | No          | Output detail: `snippets` (default) returns only matching excerpts; `full` additionally returns each result's complete document `body` (frontmatter stripped), so you can read the matched docs without a follow-up `get_document`. |
| `limit`       | number   | No          | Maximum number of results. Defaults and caps are mode-dependent: `snippets` → default 50, max 200; `full` → default 3, max 20. Values above the cap are clamped.                                                |

At least one of `path_ref`, `content`, `types`, or `status` must be provided. Filters combine with AND semantics.

**Sort modes:**

- `relevance`: orders by max match specificity DESC, then type priority (`rule` > `adr` > `spec` > ...), then mtime DESC.
- `mtime`: orders purely by modification time, newest first.

**Returns:** Array of matched documents. Each result has:

- `path`, `title`, `type`, `status`, `mtime`, `tags`: document metadata.
- `matches`: per-match evidence array. Each entry has `kind` (`path_ref_explicit`, `path_ref_mention`, or `content`), `ref` (the matched token), `specificity` (integer), and `excerpt` (~120-char window). Empty array for pure-metadata queries.
- `body`: the complete document body (frontmatter stripped). Included only when `mode: "full"`; omitted in the default `snippets` mode.
- `incoming_relations`, `outgoing_relations`: manifest edges involving this document.

**Example: find rules and ADRs that reference a code path**

```
search_documents({
  path_ref: "src/payments/",
  types: ["rule", "adr"]
})
```

**Example: content search across all documents**

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

Create a new document. Generates from template if no content is provided. Rejects a target directory under a [global source](/cli/global-sources/). Globals are read-only.

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

Modify an existing document's title, status, or content. Rejects a path under a [global source](/cli/global-sources/). Globals are read-only.

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

Permanently delete a document and all its relations. Rejects a path under a [global source](/cli/global-sources/). Globals are read-only.

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

Create a directed relation between two documents. Refuses an edge whose source **or** target is a [global source](/cli/global-sources/) document, in either direction. Relations connect local documents only.

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

Initialize the `.archcore/` knowledge base for the current project. The tool is idempotent: calling it on an already-initialized project preserves the existing settings and returns them.

**Parameters:**

| Name           | Type   | Required    | Description                                                                                          |
| -------------- | ------ | ----------- | ---------------------------------------------------------------------------------------------------- |
| `language`     | string | No          | BCP-47 language code for generated document content (e.g., `en`, `ru`, `ja`). Defaults to `en`.      |
| `sync_mode`    | string | No          | Sync mode: `none` (default, local only), `cloud`, or `on-prem`.                                      |
| `archcore_url` | string | conditional | Required only when `sync_mode="on-prem"`. URL of the on-prem Archcore server.                        |

**Returns:** JSON with `initialized: true`, the resulting `settings` object, and `already_initialized: bool`.

**When agents call this:** the MCP server starts even in repos without `.archcore/`. When `list_documents` reports an empty result on a fresh repo and the user asks to create a document, an agent should call `init_project` once to bootstrap the directory, then proceed. Subsequent calls are no-ops.

This tool creates the `.archcore/` directory and `settings.json` only. It writes no host config (hooks, MCP registration, instructions file). That is [`install_host_config`](#install_host_config)'s job during an explicit setup flow, or `archcore init --agent <id>` from the shell.

---

## install_host_config

Wire a project's host configs for a coding agent — hook entries, the MCP server entry, and the Archcore usage hint in the agent's instructions file. Produces the same artifacts as `archcore init --agent <id>`, all written under the project root the server was started for.

This is the only MCP tool that writes outside `.archcore/`, into config files you hand-edit. It is also the only tool registered conditionally: it appears when the CLI's cmd layer injects a host-wiring executor, which `archcore mcp` does. A bare server built without one never exposes it.

**Parameters:**

| Name           | Type    | Required | Description                                                                                                                                                             |
| -------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `host`         | string  | Yes      | Agent id of the current host to wire. One of `claude-code`, `cursor`, `gemini-cli`, `opencode`, `codex-cli`, `roo-code`, `cline`, `copilot`.                             |
| `all_detected` | boolean | No       | Also wire every agent whose marker directory already exists in the project. This is the same auto-detection `archcore init` performs. Default `false`, which wires only `host`. |

**Returns:** A JSON report naming every artifact, per agent, project-relative:

```json
{
  "archcore_initialized": false,
  "agents": [
    {
      "agent": "claude-code",
      "mcp_config_path": ".mcp.json",
      "hooks_supported": true,
      "instructions_path": "CLAUDE.md",
      "instructions_extra_paths": ["AGENTS.md"]
    }
  ]
}
```

- `archcore_initialized`: `true` when this call created `.archcore/`. Wiring initializes the project first when it is absent.
- `agents[].agent`: the agent id this entry describes.
- `agents[].mcp_config_path`: the MCP config the server entry was merged into. Omitted for agents that need a manual MCP install.
- `agents[].mcp_manual_hint`: present instead of `mcp_config_path` when the agent stores its MCP config outside the project (Cline keeps it in VS Code global storage).
- `agents[].hooks_supported`: `false` for agents with no hook integration; hook entries are installed only when `true`.
- `agents[].instructions_path`: the agent's primary instructions file.
- `agents[].instructions_extra_paths`: additional instruction files the same write touched. Claude Code has `CLAUDE.md` as primary plus `AGENTS.md` as extra.
- `agents[].errors`: sanitized per-artifact errors. A failed artifact does not abort the rest, so a partial wiring still returns a readable report.

Paths report what actually landed on disk, not what was attempted. An instruction write across several files that fails partway still names the file it wrote.

**Why it declares itself non-destructive:** every write is scoped to Archcore's own content. Hook installs touch only marker-recognized entries, so foreign hooks survive. MCP config writes merge only Archcore-owned fields, so your fields and other servers survive. Instruction writes replace only the span between the Archcore markers and land atomically. Archcore renames a temp file into place and preserves the file's permissions. Calling again converges: existing Archcore entries are kept or updated in place.

**When agents call this:** only when you have explicitly asked to set up or wire Archcore into your host **and** confirmed a plan the agent stated first (which agent, which files). Noticing that hooks look missing is not a trigger. Neither is a generic "set up my project", nor routine document work. An agent that spots an unwired project asks; it does not act.
