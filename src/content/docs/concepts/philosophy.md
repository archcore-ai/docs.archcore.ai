---
title: Philosophy
description: The design principles behind Archcore — why it exists, what trade-offs it makes, and what this means for your workflow.
---

## Why Archcore Exists

AI coding agents start every session without memory. They have no recollection of yesterday's decisions, last week's architecture review, or the rule your team agreed on three months ago. The context that makes them effective is scattered across flat files, wikis, Slack threads, and people's heads.

Archcore's answer: a structured knowledge base that lives in your repository and is served to agents through MCP. Instead of a growing flat file that becomes unmaintainable, you get typed documents organized into layers, linked by relations, and accessible through a standard protocol.

## Core Principles

### Local-First, Git-Versioned

The `.archcore/` directory in your repository **is** your project's architectural memory. There is no external server required. Everything is a file — versioned by git, reviewed through pull requests, shared through commits. Your project's knowledge travels with the code it describes.

**What this means for you:** No sign-ups, no SaaS dependency, no data leaving your machine. You can start using Archcore in 2 minutes with `archcore init` and everything stays in your repo.

### One Setup, Every Agent

Archcore uses [MCP (Model Context Protocol)](/integrations/mcp-server/) — an open standard for connecting AI agents to tools and data. This means one `.archcore/` directory works with Claude Code, Cursor, Copilot, Gemini CLI, and more. You don't maintain separate instruction files for each tool.

**What this means for you:** When a teammate uses a different agent, they still get the same project context. No copy-pasting rules between `.cursorrules` and `CLAUDE.md`.

### Documentation as Code

Documents use YAML frontmatter and markdown — the same format, tools, and review process as code. The `slug.type.md` naming convention encodes the document type directly in the filename:

```
jwt-strategy.adr.md
│              │
│              └─ type: architectural decision record
└─ slug: human-readable identifier
```

**What this means for you:** No database, no special tooling. `ls .archcore/` tells you what's there. PRs show exactly what changed.

### Virtual Layers, Free-Form Directories

Three layers — **Vision**, **Knowledge**, and **Experience** — organize documents by their role. But layers are **not directories**. The document type determines the layer, and you organize directories however you want:

- `prd`, `idea`, `plan` → Vision
- `adr`, `rfc`, `rule`, `guide`, `doc` → Knowledge
- `task-type`, `cpat` → Experience

**What this means for you:** Group files by domain (`auth/`, `payments/`) or team — the semantic layer comes from the type, not the path. No rigid folder structure to maintain. See [Context Layers](/concepts/context-layers/) for the full breakdown.

### Agents Read, Write, and Connect

Agents don't just passively read documents — they create, update, and link them. [Session hooks](/integrations/hooks/) inject the full document list at session start, so agents know what context exists from the first message.

**What this means for you:** You can say "create an ADR for the decision we just discussed" or "link this rule to the ADR it came from" and the agent handles it through MCP.

### Simplicity by Constraint

Archcore has a small surface area by design:

- **3 statuses** — `draft`, `accepted`, `rejected`
- **10 document types** — each with a clear purpose
- **4 relation types** — `implements`, `extends`, `depends_on`, `related`
- **1 naming convention** — `slug.type.md`, always

**What this means for you:** When an agent encounters an Archcore project, there are few rules to learn and fewer ways to get it wrong. You can [start with just 3 types](/concepts/document-types/) and add more as needed.

## How Knowledge Flows

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

Documents link to each other through [relations](/concepts/relations/): `implements`, `extends`, `depends_on`, and `related`. This gives agents a graph of your project's knowledge — not just isolated documents, but the connections and dependencies between them.

## Why Not Just One Big Instruction File?

A `CLAUDE.md` or `.cursorrules` works when your project has a handful of rules. But as your project grows:

- The file becomes a wall of text — agents can't prioritize what matters
- Decisions mix with rules mix with how-tos — no structure to query
- Outdated content lingers — there's no status lifecycle
- Multiple agents need the same context — you maintain duplicate files

Archcore solves this by giving each piece of knowledge its own document, type, status, and connections. Agents query what they need instead of reading everything. See [Why Not Flat Files?](/getting-started/why-not-flat-files/) for a detailed comparison.
