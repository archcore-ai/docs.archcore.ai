---
title: How It Works
description: Core design principles and the three context layers that organize project knowledge in Archcore.
---

## Core Principles

### Local-First, Git-Versioned

The `.archcore/` directory in your repository **is** your project context. No external server, no SaaS dependency. Everything is a file — versioned by git, reviewed through pull requests, shared through commits. Run `archcore init` and your git-native context travels with the code it describes.

### One Setup, Every Agent

Archcore uses [MCP (Model Context Protocol)](/cli/mcp-server/) — an open standard for connecting AI agents to tools and data. One `.archcore/` directory works with Claude Code, Cursor, Copilot, Gemini CLI, and more. No copy-pasting rules between `.cursorrules` and `CLAUDE.md`.

### Documentation as Code

Documents use YAML frontmatter and markdown. The `slug.type.md` naming convention encodes the document type directly in the filename:

```
jwt-strategy.adr.md
│              │
│              └─ type: architectural decision record
└─ slug: human-readable identifier
```

No database, no special tooling. `ls .archcore/` tells you what's there. PRs show exactly what changed.

### Simplicity by Constraint

Archcore has a small surface area by design:

- **3 statuses** — `draft`, `accepted`, `rejected`
- **18 document types** — each with a clear purpose
- **4 relation types** — `implements`, `extends`, `depends_on`, `related`
- **1 naming convention** — `slug.type.md`, always

When an agent encounters an Archcore project, there are few rules to learn and fewer ways to get it wrong. You can [start with just 3 types](/concepts/document-types/) and add more as needed.

## Context Layers

Every document belongs to exactly one of three **layers**. The layer comes from the document type, not from anything you configure — it is automatic.

:::note[You can ignore layers at first]
If you create an `adr`, it is in the Knowledge layer. If you create a `plan`, it is in Vision. Layers become useful when you want to browse documents by category or understand the lifecycle of your project context.
:::

### Vision — what to build and why

Vision has 10 document types across three **requirement tracks**. Use whichever fits your situation — all three can coexist.

| Track | Documents | Best For |
|-------|-----------|----------|
| Product (simple) | `prd`, `idea`, `plan` | Individual features, small teams, rapid prototyping |
| Sources (discovery) | `mrd` -> `brd` -> `urd` | Product teams doing discovery, stakeholder alignment |
| ISO (decomposition) | `brs` -> `strs` -> `syrs` -> `srs` | Regulated systems, multi-team projects |

### Knowledge — what we know

Decisions, standards, and reference material. This is where most documents live.

| Type | Purpose | Example |
|------|---------|---------|
| `adr` | Architectural decisions with context and consequences | `use-postgres.adr.md` |
| `rfc` | Proposals open for review before a decision is finalized | `graphql-migration.rfc.md` |
| `rule` | Team standards and required behaviors | `api-versioning.rule.md` |
| `guide` | Step-by-step instructions for a specific task | `deploy-staging.guide.md` |
| `spec` | Normative contract — behavior, constraints, invariants | `webhook-delivery.spec.md` |
| `doc` | Non-behavioral reference — registries, glossaries, lookup tables | `env-variables.doc.md` |

### Experience — what we learned

Patterns crystallized from repeated work.

| Type | Purpose | Example |
|------|---------|---------|
| `task-type` | Proven workflows for recurring implementation tasks | `api-endpoint-creation.task-type.md` |
| `cpat` | Code pattern changes — when a convention has deliberately shifted | `error-handling-v2.cpat.md` |

## How Layers Connect

The natural lifecycle flows from **Vision -> Knowledge -> Experience**:

```
Vision                     Knowledge              Experience
┌───────────────────┐     ┌──────────┐           ┌──────────┐
│ Product track     │     │   rfc    │           │          │
│   idea prd plan   │──>  │   adr    │───>       │task-type │
│                   │     │   rule   │───>       │   cpat   │
│ Sources track     │     │  guide   │           │          │
│   mrd brd urd     │──>  │   spec   │           │          │
│                   │     │   doc    │           │          │
│ ISO track         │     │          │           │          │
│   brs strs        │──>  │          │           │          │
│   syrs srs        │     │          │           │          │
└───────────────────┘     └──────────┘           └──────────┘
```

This is not a strict sequence. Documents can be created in any layer at any time. A team might start with a `rule` that was always understood but never written down, or create a `task-type` before the underlying `adr` exists.

## How Knowledge Flows

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

[Relations](/concepts/relations/) link documents across layers with four directed types: `implements`, `extends`, `depends_on`, and `related`. This gives agents a graph of your repo context — not just isolated documents, but the connections between them.

## Layers Are Virtual

Layers are derived from the document type in the filename — they are **not** directories. A file at `.archcore/auth/jwt-strategy.adr.md` belongs to Knowledge because `adr` is a Knowledge type, not because it sits in an `auth/` directory.

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

Three different layers, organized by domain. The semantic layer comes from the type, not the path. See [Documents](/concepts/documents/) for more on organizing your files.

## Agents Read, Write, and Connect

Agents don't just passively read documents — they create, update, and link them. [Session hooks](/cli/mcp-server/) inject the full document list at session start, so agents know what structured context exists from the first message.

You can say "create an ADR for the decision we just discussed" or "link this rule to the ADR it came from" and the agent handles it through MCP.

## Next Steps

- [Plugin quick start](/start/plugin-quick-start/) or [CLI quick start](/cli/quick-start/) — set up Archcore in 2 minutes
- [Document Types](/concepts/document-types/) — full reference for all 18 types
- [Relations](/concepts/relations/) — link documents with directed relations
- [MCP Server](/cli/mcp-server/) — how agents connect to your project context
