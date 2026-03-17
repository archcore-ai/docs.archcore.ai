---
title: How It Works
description: The Archcore workflow from project init to AI agent interaction — how documents are created, validated, and served through MCP.
---

## Overview

Archcore works in three layers:

1. **Documents** — structured markdown files in `.archcore/`
2. **CLI** — validates, manages, and serves documents
3. **MCP Server** — exposes documents to AI agents via Model Context Protocol

## The Workflow

### 1. Initialize

```bash
archcore init
```

Creates `.archcore/` with a `settings.json` and auto-configures your coding agents.

### 2. Write Documents

Create documents manually or through your AI agent. Every document is a markdown file with YAML frontmatter:

```
.archcore/auth/jwt-strategy.adr.md
```

```markdown
---
title: Use JWT for API Authentication
status: accepted
---

## Context
We need stateless authentication for our API...

## Decision
Use JWT tokens with RS256 signing...
```

The filename determines the type: `jwt-strategy` is the slug, `adr` is the type.

### 3. Agent Interaction

When your agent starts a session, it connects to Archcore's MCP server. The agent can:

- **List documents** — filter by type, layer, or status
- **Read documents** — get full content with relations
- **Create documents** — generate from templates
- **Update documents** — modify content or status
- **Link documents** — add relations between documents

### 4. Validate

```bash
archcore validate
```

Checks that all documents follow naming conventions, have valid frontmatter, and that relations point to existing documents. Use `--fix` to auto-remove orphaned relations.

## What Agents See

When an agent calls `list_documents`, it gets:

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

Documents link to each other through **relations**: `implements`, `extends`, `depends_on`, and `related`. This gives agents a graph of your project's knowledge.
