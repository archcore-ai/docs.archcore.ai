---
title: Philosophy
description: The design principles behind archcore — why it exists, what it fundamentally is, and the ideas that shape every decision.
---

## Why Archcore Exists

AI coding agents start every session without memory. They have no recollection of yesterday's decisions, last week's architecture review, or the rule your team agreed on three months ago. The context that makes them effective — decisions, standards, patterns, plans — is scattered across `CLAUDE.md` files, `.cursorrules`, wikis, Slack threads, and people's heads.

Archcore's answer: a structured, local-first knowledge base that lives in your repository and is served to agents through MCP. Instead of a growing flat file that becomes unmaintainable, you get typed documents organized into layers, linked by explicit relations, and accessible through a standard protocol.

## Core Principles

### Local-First, Git-Versioned

The `.archcore/` directory in your repository **is** the system context. There is no external server required to use it. Everything is a file — versioned by git, reviewed through pull requests, shared through commits. Your project's knowledge travels with the code it describes.

When sync exists, local always wins. The server is a read-only consumer of your repository state, never the source of truth.

### Documentation as Code

Documents use YAML frontmatter and markdown body — the same format, same tools, and same review process as code. The `slug.type.md` naming convention encodes semantics directly into the filename:

```
jwt-strategy.adr.md
│              │
│              └─ type: architectural decision record
└─ slug: human-readable identifier
```

No configuration file maps filenames to types. No database tracks metadata. The filename is the schema.

### Virtual Layers from Filenames

Three layers — **Vision**, **Knowledge**, and **Experience** — organize every document by its role in the lifecycle of understanding. But these layers are **not directories**. The document type in the filename determines the layer:

- `prd`, `idea`, `plan` → Vision
- `adr`, `rfc`, `rule`, `guide`, `doc` → Knowledge
- `task-type`, `cpat` → Experience

This is a deliberate design choice. Directories are free-form — organize by domain, feature, team, or however makes sense for your project. The semantic categorization comes from the type, not the path. See [Context Layers](/concepts/context-layers/) for the full breakdown.

### Agents Are First-Class Citizens

Archcore is designed around [MCP (Model Context Protocol)](/integrations/mcp-server/). Agents don't just read documents — they create, update, and link them. The MCP server embeds detailed instructions into every session: when to use each document type, naming conventions, workflow rules, valid statuses, and relation semantics.

[Session hooks](/integrations/hooks/) inject the full document list at session start, so agents know what context exists before they ask. The agent sees a layered, structured view of your project's knowledge from the first message.

### An Explicit Knowledge Graph

Documents form a directed graph through relations: `implements`, `extends`, `depends_on`, and `related`. When an agent reads a document, it sees both incoming and outgoing relations — the full context of how that document connects to everything else.

Relations are stored centrally in `.sync-state.json`, not scattered across document frontmatter. This keeps documents clean and makes relation management a single-point operation: add, remove, or validate all links from one place.

### Simplicity

Archcore has a small surface area by design:

- **3 statuses** — `draft`, `accepted`, `rejected`
- **10 document types** — each with a clear purpose and layer
- **4 relation types** — enough to express meaningful connections without overcomplicating the graph
- **1 naming convention** — `slug.type.md`, always
- **Minimal config** — `settings.json` with a handful of fields

Constraints create clarity. When an agent encounters an archcore project, there are few rules to learn and fewer ways to get it wrong.

## What Agents See

When an agent calls `list_documents`, it gets a layered view of the entire knowledge base:

```
[knowledge]
  - jwt-strategy.adr.md — "Use JWT for API Authentication"
  - api-rate-limiting.rule.md — "API Rate Limiting Standards"
  - auth-setup.guide.md — "Setting Up Authentication"

[vision]
  - auth-redesign.prd.md — "Authentication System Redesign"

[experience]
  - api-endpoint-creation.task-type.md — "Creating New API Endpoints"
```

Layers are **virtual** — derived from the document type, not the directory. The agent sees a clean, layered view regardless of how you organize files on disk.

## Document Lifecycle

```
idea → prd → plan → implementation
                        ↓
                    adr (decisions made)
                        ↓
                    rule (standards derived)
                        ↓
                    guide (how to follow)
                        ↓
                    task-type / cpat (patterns learned)
```

Documents link to each other through **relations**: `implements`, `extends`, `depends_on`, and `related`. This gives agents a graph of your project's knowledge — not just isolated documents, but the connections and dependencies between them.
