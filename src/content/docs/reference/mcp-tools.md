---
title: MCP Tools Reference
description: Parameters, returns, errors, and source scoping for the 10 Archcore MCP tools, plus conditional install_host_config.
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

`list_documents` and `search_documents` both take a `source` parameter that scopes one call to `local`, `global`, or a declared source id. An unknown value fails the call instead of returning an empty page.

Global documents are **read-only**: the write tools (`create_document`, `update_document`, `remove_document`) reject any global path, and `add_relation` refuses an edge that touches a global on either endpoint. When a local document and a global cover the same topic, the agent treats the local one as authoritative when reading them. Search ranking carries no source weight beyond the final tiebreak, which puts the local document first when two results tie on every other key.

No MCP tool includes an absolute filesystem path in an error or a result. Every returned path is relative to the project root or to `.archcore/`.

## list_documents

List documents with optional filters.

**Parameters:**

| Name       | Type     | Required | Description                                                                                  |
| ---------- | -------- | -------- | -------------------------------------------------------------------------------------------- |
| `types`    | string[] | No       | Filter by document types (e.g., `["adr", "rule"]`)                                           |
| `category` | string   | No       | Filter by category: `vision`, `knowledge`, or `experience`                                   |
| `status`   | string   | No       | Filter by status: `draft`, `accepted`, or `rejected`                                         |
| `tags`     | string[] | No       | Filter by tags with OR semantics (matches documents with at least one of the specified tags) |
| `limit`    | number   | No       | Maximum number of documents to return. Default 100, max 500. Values above 500 are clamped; `0` or omitted maps to the default; negative values return `limit must be non-negative`. |
| `offset`   | number   | No       | Number of matching documents to skip before the returned page. Default 0. Use with `truncated` to page through large result sets; negative values return `offset must be non-negative`. |
| `source`   | string   | No       | Scope the listing to one source: `local` (the project's own documents), `global` (every mounted global source), or a declared global source id. Omitted admits every source; an unknown value returns `invalid source "<value>" (valid: "local", "global", or a declared global source id)`. |

**Returns:** A JSON envelope object:

```json
{
  "documents": [ /* array of matching document rows */ ],
  "total": 0,
  "offset": 0,
  "returned": 0,
  "truncated": false,
  "by_source": { "local": 0 }
}
```

- `documents`: the page of matches, `[]` when nothing matches. Each row carries `path`, `category`, `type`, `filename`, `slug`, `title`, `status`, `tags`, `mtime`, `source_id`, and `source_kind`, plus `global` and `read_only` only when true. List rows carry no `content`.
- `total`: total number of documents matching the filters, before pagination.
- `offset`: the offset applied to this page.
- `returned`: number of documents in `documents` (the page size).
- `truncated`: `true` when more matches exist beyond this page. Narrow the filters, scope the call with `source`, or request the next page with `offset`.
- `by_source`: each source id mapped to its number of matching documents across the whole filtered set, before pagination. Compare it with the page to see what a truncation dropped.

**Page ordering:** The page interleaves sources. Each source gets a quota proportional to its share of the filtered set, with a floor of one row, so every mounted source appears on the first page instead of being evicted by a large local corpus. A project with no global sources keeps plain scan order, and paging with `offset` walks the same interleaved sequence without repeating or skipping a document.

**Example response:**

```json
{
  "documents": [
    {
      "path": ".archcore/roadmap/auth-v2.prd.md",
      "category": "vision",
      "type": "prd",
      "filename": "auth-v2.prd.md",
      "slug": "auth-v2",
      "title": "Auth System Redesign",
      "status": "draft",
      "tags": ["auth"],
      "mtime": "2026-04-20T16:00:00Z",
      "source_id": "local",
      "source_kind": "local"
    },
    {
      "path": ".archcore/global/company/architecture/error-handling.rule.md",
      "category": "knowledge",
      "type": "rule",
      "filename": "error-handling.rule.md",
      "slug": "error-handling",
      "title": "Error Handling Standard",
      "status": "accepted",
      "tags": ["errors"],
      "mtime": "2026-02-02T11:30:00Z",
      "source_id": "company",
      "source_kind": "global",
      "global": true,
      "read_only": true
    },
    {
      "path": ".archcore/auth/jwt-strategy.adr.md",
      "category": "knowledge",
      "type": "adr",
      "filename": "jwt-strategy.adr.md",
      "slug": "jwt-strategy",
      "title": "Use JWT for Authentication",
      "status": "accepted",
      "tags": ["auth", "security"],
      "mtime": "2026-03-12T09:14:00Z",
      "source_id": "local",
      "source_kind": "local"
    }
  ],
  "total": 142,
  "offset": 0,
  "returned": 3,
  "truncated": true,
  "by_source": { "local": 130, "company": 12 }
}
```

The page holds one row from the mounted `company` source because the interleave seeds every source before it fills the rest of the page by share.

---

## search_documents

Search documents by path reference, content words, or metadata. Unlike `list_documents`, this tool scans document bodies and returns per-match evidence (excerpts, specificity, ranking). Read-only.

**Parameters:**

| Name          | Type     | Required    | Description                                                                                                                  |
| ------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `path_ref`    | string   | conditional | Path reference to match in document bodies. Matches both `@path` notation and qualified bare paths. Leading `@` is optional. |
| `content`     | string   | conditional | Case-insensitive word search against title + body. The value is split on whitespace, and `match` decides how many of the words must occur. No stemming, no fuzzy matching. |
| `match`       | string   | No          | How the words in `content` must match: `all` (default), `any`, or `exact`. Any other value maps to `all`. |
| `source`      | string   | No          | Scope the search to one source: `local` (the project's own documents), `global` (every mounted global source), or a declared global source id. Omitted admits every source. |
| `types`       | string[] | conditional | Filter by document types (e.g., `["adr", "rule"]`).                                                                          |
| `status`      | string   | conditional | Filter by status: `draft`, `accepted`, or `rejected`.                                                                        |
| `mtime_after` | string   | No          | Only include documents modified after this time. Accepts RFC3339 timestamps or a positive relative duration: `<N>h`, `<N>d`, `<N>w`, `<N>mo`, `<N>y`, e.g. `24h`, `30d`, `6mo`. |
| `sort`        | string   | No          | Result ordering: `relevance` (default) or `mtime`.                                                                           |
| `mode`        | string   | No          | Output detail: `snippets` (default) returns only matching excerpts; `full` additionally returns each result's complete document `body` (frontmatter stripped), so you can read the matched docs without a follow-up `get_document`. |
| `limit`       | number   | No          | Maximum number of results. Defaults and caps are mode-dependent: `snippets` → default 50, max 200; `full` → default 3, max 20. Values above the cap are clamped; `0` or omitted maps to the mode default.       |

At least one of `path_ref`, `content`, `types`, or `status` must be provided. Filters combine with AND semantics.

**Match modes:**

- `all` (default): every word of `content` occurs somewhere in the document, in any order and at any distance. `"plugin compatibility"` matches a document titled "Plugin / CLI Compatibility".
- `any`: at least one word occurs. Highest recall, noisiest page.
- `exact`: the whole `content` value as one literal substring — the behavior before CLI v0.8.0.

A single-word query behaves identically under `all` and `exact`.

**Sort modes:**

- `relevance` (default): orders by score DESC, then type priority ASC, then modification time DESC, then `path` ASC as the final tiebreak.

  The score is `100 × (best path-ref specificity + Σ content-word specificities) + capped occurrence count`. Per word, a title hit scores 3, a hit on a markdown heading line scores 2, and any other body hit scores 1. The occurrence count is capped at 20, so a term-stuffed body cannot outrank a structural hit. A repeated path reference contributes its single best hit rather than a sum.

  Type priority is `rule` 1, `adr` 2, `spec` 3, `cpat` 4, `guide` 5, `plan` 6, `idea` 7; every other type sorts last.

  A global document's effective modification time is treated as zero, because a vendored global's mtime is its clone date and not a relevance signal. On a tie across every other key, the local document therefore ranks first.
- `mtime`: orders purely by modification time, newest first.

**Per-source representation:** when the `limit` cut would remove every row of a source that has at least one match, that source's top row is swapped in over the lowest-ranked page row whose source keeps more than one row. Sources claim a swap in rank order of their own top row, and swapping stops once every page row is its source's last. The guarantee holds in `full` mode too, so one of the three default slots carries the top row of an otherwise-evicted source.

**Returns:** a JSON envelope object:

```json
{
  "results": [ /* array of matched documents */ ],
  "coverage": { "local": 102, "company": 42 }
}
```

- `results`: the matches, `[]` when nothing matches.
- `coverage`: each searched source id mapped to the number of documents scanned in it, counted after the `source` scope and before the query filters. An empty `results` beside a populated `coverage` is a **verified absence** — the corpus was searched and holds no match, rather than having been skipped.

Each result has:

- `path`, `title`, `type`, `status`, `mtime`, `tags`: document metadata. A primary document's `path` begins with `.archcore/`; a mounted external global carries its declared relative prefix instead.
- `source_id`, `source_kind`: always present, plus `global` and `read_only` only when true. See [Source annotation and global sources](#source-annotation-and-global-sources).
- `matches`: per-match evidence array. Each entry has `kind` (`path_ref_explicit`, `path_ref_mention`, or `content`), `ref` (the matched token — one content word under `all` and `any`, the whole query under `exact`), `specificity` (integer), and `excerpt` (~120-char window). Serialized as `[]` for pure-metadata queries, never `null`.
- `body`: the complete document body (frontmatter stripped). Included only when `mode: "full"`; omitted in the default `snippets` mode.
- `incoming_relations`, `outgoing_relations`: manifest edges involving this document. Serialized as `[]` when empty, never `null`.

**Errors:**

- All filters empty: `specify at least one filter (path_ref, content, types, or status)`.
- Negative `limit`: `limit must be non-negative`.
- Invalid `mtime_after`: `invalid mtime_after: <reason>`.
- Unknown `source`: `invalid source "<value>" (valid: "local", "global", or a declared global source id)`.
- A `content` value that holds no word under `match: "all"` or `"any"`: `content must contain at least one word`. `exact` accepts any non-empty value.
- A missing `.sync-state.json` manifest is not an error; every result carries empty relation arrays. A present-but-invalid manifest fails the call with `loading manifest: <reason>`, and `get_document` and `list_relations` fail the same way.

**Limitations:**

- A rule with no `@path` reference in its body is not reachable through a `path_ref` search.
- Matching is literal per word. There is no stemming, so singular and plural forms of one word still do not match each other.

**Example: find rules and ADRs that reference a code path**

```
search_documents({
  path_ref: "src/payments/",
  types: ["rule", "adr"]
})
```

**Example: a multi-word query that no title spells that way**

```
search_documents({
  content: "plugin compatibility"
})
```

Returns both a local rule titled "Compatibility Contract Between the CLI and the Plugin" and a global rule titled "Plugin / CLI Compatibility Across Independent Release Trains". Each holds both words somewhere; neither holds the phrase. `match: "exact"` returns nothing here.

**Example: verified absence**

```json
{ "results": [], "coverage": { "local": 102, "company": 42 } }
```

144 documents across both sources were searched and none holds every query word. Broaden the words or try `match: "any"` — do not read this as a source that went unsearched.

**Example: scope a search to the mounted globals**

```
search_documents({
  content: "error handling",
  source: "global"
})
```

**Compatibility:** CLI v0.8.0 changed this response from a bare array to the `{"results", "coverage"}` envelope, and made `all` the default match mode. A client that parsed the array directly must be updated; `match: "exact"` restores the earlier matching behavior. From here the envelope grows additively — new fields may appear on the envelope, on a result, or on a match without breaking a consumer that ignores unknown fields.

---

## get_document

Read a document's full content with its relations.

**Parameters:**

| Name   | Type   | Required | Description                                   |
| ------ | ------ | -------- | --------------------------------------------- |
| `path` | string | Yes      | Document path as returned by `list_documents` |

**Returns:** The full document record: the same fields as a `list_documents` row plus `content`, with `outgoing_relations` and `incoming_relations`. Each relation entry is `{path, type}` with a `.archcore/`-prefixed path.

**Errors:** an unknown path returns `document not found: <path>`.

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

**Returns:** `{path, category, type, title, status}`, plus `tags` when non-empty and `nearby_documents` when present. `nearby_documents` is up to 5 paths of other documents in the same directory, sorted alphabetically. Treat it as a hint only: review each candidate and call `add_relation` when a semantic link exists. Do not link every neighbor by default.

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

**Returns:** `{path, category, type, title, status}`, plus `tags` when non-empty.

---

## remove_document

Permanently delete a document and all its relations. Rejects a path under a [global source](/cli/global-sources/). Globals are read-only.

**Parameters:**

| Name   | Type   | Required | Description   |
| ------ | ------ | -------- | ------------- |
| `path` | string | Yes      | Document path |

**Returns:** `{path, title, type, category, relations_removed}`. `relations_removed` counts the deleted document's own edges.

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

**Returns:** `{source, target, type, added}`. `added` is `false` when the edge already existed.

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

**Returns:** `{source, target, type, removed}`. `removed` is `false` when no such edge exists.

---

## list_relations

List all relations, optionally filtered by document.

**Parameters:**

| Name   | Type   | Required | Description                              |
| ------ | ------ | -------- | ---------------------------------------- |
| `path` | string | No       | Filter relations involving this document |

**Returns:** A JSON envelope `{"relations": [...]}` with all relations, or the relations involving the specified document. Each entry carries `source`, `target`, and `type`. Relation `source` and `target` are stored without the `.archcore/` prefix, unlike the `path` fields on documents.

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
