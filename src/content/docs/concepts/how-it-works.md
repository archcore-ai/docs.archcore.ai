---
title: How Archcore Works
description: Archcore keeps project context local and git-versioned, in three layers named Vision, Knowledge, and Experience.
---

## Core principles

### Local-first, git-versioned

The `.archcore/` directory in your repository is your project context. There is no external server and no SaaS dependency. Every document is a file: versioned by git, reviewed in pull requests, shared through commits. After `archcore init`, that context travels with the code it describes.

### One setup, every agent

Archcore uses [MCP (Model Context Protocol)](/cli/mcp-server/) — an open standard for connecting AI agents to tools and data. One `.archcore/` directory works with Claude Code, Cursor, Copilot, Gemini CLI, and more. You maintain one set of documents instead of parallel copies in `.cursorrules` and `CLAUDE.md`.

### Documentation as code

Documents use YAML frontmatter and markdown. The `slug.type.md` naming convention encodes the document type directly in the filename:

```
jwt-strategy.adr.md
│              │
│              └─ type: architectural decision record
└─ slug: human-readable identifier
```

Archcore needs no database and no special tooling. `ls .archcore/` shows what exists, and a pull request diff shows what changed.

### Simplicity by constraint

Archcore has a small surface area by design:

- 3 statuses: `draft`, `accepted`, `rejected`
- 19 document types, each with a clear purpose
- 4 relation types: `implements`, `extends`, `depends_on`, `related`
- 1 naming convention: `slug.type.md`, always

An agent that encounters an Archcore project has few rules to learn. You can [start with three types](/concepts/document-types/) and add more as needed.

## Context layers

Every document belongs to exactly one of three **layers**. The layer comes from the document type, not from configuration.

:::note[You can ignore layers at first]
If you create an `adr`, it is in the Knowledge layer. If you create a `plan`, it is in Vision. Layers become useful when you want to browse documents by category or understand the lifecycle of your project context.
:::

### Vision: what to build and why

Vision has 11 document types across three **requirement tracks**. Use whichever fits your situation; all three can coexist.

| Track | Documents | Best for |
|-------|-----------|----------|
| Product (simple) | `prd`, `idea`, `rnd`, `plan` | Individual features, small teams, rapid prototyping |
| Sources (discovery) | `mrd` -> `brd` -> `urd` | Product teams doing discovery, stakeholder alignment |
| ISO (decomposition) | `brs` -> `strs` -> `syrs` -> `srs` | Regulated systems, multi-team projects |

### Knowledge: what we know

Decisions, standards, and reference material. This is where most documents live.

| Type | Purpose | Example |
|------|---------|---------|
| `adr` | Architectural decisions with context and consequences | `use-postgres.adr.md` |
| `rfc` | Proposals open for review before a decision is finalized | `graphql-migration.rfc.md` |
| `rule` | Team standards and required behaviors | `api-versioning.rule.md` |
| `guide` | Step-by-step instructions for a specific task | `deploy-staging.guide.md` |
| `spec` | Normative contract covering behavior, constraints, and invariants | `webhook-delivery.spec.md` |
| `doc` | Non-behavioral reference such as registries, glossaries, and lookup tables | `env-variables.doc.md` |

### Experience: what we learned

Patterns crystallized from repeated work.

| Type | Purpose | Example |
|------|---------|---------|
| `task-type` | Proven workflows for recurring implementation tasks | `api-endpoint-creation.task-type.md` |
| `cpat` | Code pattern changes, recorded when a convention deliberately shifts | `error-handling-v2.cpat.md` |

## How layers connect

The natural lifecycle flows from **Vision -> Knowledge -> Experience**:

```
Vision                       Knowledge              Experience
┌─────────────────────┐     ┌──────────┐           ┌──────────┐
│ Product track       │     │   rfc    │           │          │
│   idea rnd prd plan │──>  │   adr    │───>       │task-type │
│                     │     │   rule   │───>       │   cpat   │
│ Sources track       │     │  guide   │           │          │
│   mrd brd urd       │──>  │   spec   │           │          │
│                     │     │   doc    │           │          │
│ ISO track           │     │          │           │          │
│   brs strs          │──>  │          │           │          │
│   syrs srs          │     │          │           │          │
└─────────────────────┘     └──────────┘           └──────────┘
```

This is not a strict sequence. Documents can be created in any layer at any time. A team might start with a `rule` that was always understood but never written down, or create a `task-type` before the underlying `adr` exists.

## How knowledge flows

```
idea -> prd -> plan -> implementation
                          ↓
                      adr (decisions made)
                          ↓
                      rule (standards derived)
                          ↓
                      guide (how to follow)
                          ↓
                      task-type / cpat (patterns learned)
```

[Relations](/concepts/relations/) link documents across layers with four directed types: `implements`, `extends`, `depends_on`, and `related`. Agents get a graph of your repository context, including the connections between documents.

## Layers are virtual

Layers are derived from the document type in the filename, not from directories. A file at `.archcore/auth/jwt-strategy.adr.md` belongs to Knowledge because `adr` is a Knowledge type, not because it sits in an `auth/` directory.

Organize your `.archcore/` directory however you want:

```
.archcore/
├── auth/
│   ├── jwt-strategy.adr.md        <- Knowledge
│   └── auth-redesign.prd.md       <- Vision
├── payments/
│   ├── stripe-integration.guide.md <- Knowledge
│   └── saas-expansion.brd.md       <- Vision
└── onboarding-flow.task-type.md    <- Experience
```

Three different layers, organized by domain. The layer comes from the type, not the path. See [Documents & Layout](/concepts/documents/) for more on organizing your files.

## Agents read, write, and connect

Agents also create, update, and link documents. [Session hooks](/cli/hooks/) inject a bounded project recap at session start, so agents know what structured context exists from the first message.

You can say "create an ADR for the decision we just discussed" or "link this rule to the ADR it came from" and the agent handles it through MCP.

## Next steps

- [Plugin quick start](/start/plugin-quick-start/) and [CLI quick start](/cli/quick-start/) set up Archcore in 2 minutes.
- [Document Types](/concepts/document-types/) is the full reference for all 19 types.
- [Relations](/concepts/relations/) explains how to link documents with directed relations.
- [MCP Server](/cli/mcp-server/) shows how agents connect to your project context.
