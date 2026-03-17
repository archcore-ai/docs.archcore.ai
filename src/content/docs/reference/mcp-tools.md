---
title: MCP Tools Reference
description: Complete reference for all 8 Model Context Protocol tools — list_documents, get_document, create_document, update_document, and more.
---

The Archcore MCP server exposes 8 tools that AI agents use to interact with your `.archcore/` documents.

## list_documents

List documents with optional filters.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `types` | string[] | No | Filter by document types (e.g., `["adr", "rule"]`) |
| `category` | string | No | Filter by category: `vision`, `knowledge`, or `experience` |
| `status` | string | No | Filter by status: `draft`, `accepted`, or `rejected` |

**Returns:** Array of documents with path, title, type, category, and status.

**Example response:**
```
[knowledge]
  - auth/jwt-strategy.adr.md — "Use JWT for Authentication" (accepted)
  - auth/auth-rules.rule.md — "Authentication Rules" (accepted)
  - api/rest-guide.guide.md — "REST API Setup Guide" (draft)

[vision]
  - roadmap/auth-v2.prd.md — "Auth System Redesign" (draft)
```

---

## get_document

Read a document's full content with its relations.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path as returned by `list_documents` |

**Returns:** Full document content plus outgoing and incoming relations.

---

## create_document

Create a new document. Generates from template if no content is provided.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | Yes | Document type (e.g., `adr`, `rule`, `guide`) |
| `filename` | string | Yes | Slug for the filename (lowercase, hyphens only) |
| `title` | string | No | Human-readable title |
| `status` | string | No | Status: `draft` (default), `accepted`, `rejected` |
| `content` | string | No | Markdown body. If omitted, generates template |
| `directory` | string | No | Subdirectory within `.archcore/` |

**Returns:** Path, type, category, title, status, and `nearby_documents` hint (for adding relations).

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

Modify an existing document's title, status, or content.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path |
| `title` | string | No | New title |
| `status` | string | No | New status |
| `content` | string | No | New markdown body |

At least one of `title`, `status`, or `content` must be provided.

---

## remove_document

Permanently delete a document and all its relations.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path |

**Returns:** Confirmation with `relations_removed` count.

:::caution
This is a destructive action. Prefer `update_document` with `status: "rejected"` to preserve history.
:::

---

## add_relation

Create a directed relation between two documents.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `source` | string | Yes | Source document path |
| `target` | string | Yes | Target document path |
| `type` | string | Yes | Relation type: `related`, `implements`, `extends`, `depends_on` |

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

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `source` | string | Yes | Source document path |
| `target` | string | Yes | Target document path |
| `type` | string | Yes | Relation type |

---

## list_relations

List all relations, optionally filtered by document.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | No | Filter relations involving this document |

**Returns:** All relations (or relations for the specified document) showing source, target, and type.
