---
title: What Is Archcore?
description: Archcore gives AI coding agents a shared architectural memory — structured decisions, rules, and patterns that persist across sessions and tools.
---

Archcore is a **shared architectural memory for AI coding agents**. It turns scattered project knowledge — decisions, rules, patterns, plans — into structured documents that agents discover, read, and follow automatically.

## The Problem

AI coding agents start every session from scratch. They don't remember yesterday's decisions, last week's architecture review, or the coding standards your team agreed on months ago.

Teams work around this with flat instruction files:

- **`CLAUDE.md`** — grows into a wall of text that's hard to maintain
- **`.cursorrules`** — locked to one tool, not reusable across agents
- **`docs/` folder** — unstructured markdown, agents don't know what's relevant
- **Team knowledge** — lives in people's heads, Slack threads, and wikis

These workarounds stop scaling as projects grow.

## How Archcore Solves This

Archcore adds a `.archcore/` directory to your repository. Inside it, every piece of project knowledge becomes a **typed document** — an architecture decision, a coding rule, a how-to guide, an implementation plan.

```text
your-project/
├── .archcore/
│   ├── auth/
│   │   ├── jwt-strategy.adr.md        ← decision
│   │   └── auth-redesign.prd.md       ← requirements
│   ├── payments/
│   │   └── stripe-integration.guide.md ← how-to
│   └── onboarding-flow.task-type.md   ← proven pattern
└── src/
    └── ...
```

Each file suffix (`.adr.md`, `.guide.md`, `.task-type.md`) indicates its [document type](/concepts/document-types/).

When an agent starts a session, Archcore's [MCP server](/integrations/mcp-server/) makes all documents available. The agent can query, read, create, and link documents without leaving the conversation.

## Why Not Just Flat Instruction Files?

| Feature | Flat files | Archcore |
|---|---|---|
| **Structure** | Free-form text | Typed documents with templates |
| **Scale** | Gets unwieldy past ~50 lines | Separate documents, free-form directory structure |
| **Reusability** | Copy-paste between tools | One setup works with all agents |
| **Findability** | Agent reads the whole file | Agent queries by type, status, or topic |
| **Lifecycle** | No versioning beyond git diff | Draft → accepted → rejected status |
| **Connections** | No links between concepts | Explicit relations between documents |

[Read the full comparison →](/getting-started/why-not-flat-files/)

## What You Get After Setup

After running [`archcore init`](/getting-started/quick-start/), your agents can:

- **Find relevant context** — query decisions, rules, and patterns by type or topic
- **Follow team standards** — read coding rules and how-to guides automatically
- **Create new knowledge** — record decisions and patterns as structured documents
- **Link related concepts** — connect a plan to the PRD it implements, or a rule to the decision that produced it
- **Work consistently** — the same knowledge base works across Claude Code, Cursor, Copilot, Gemini CLI, and more

## Next Steps

- **[Quick Start](/getting-started/quick-start/)** — install and set up in 2 minutes
- **[First 10 Minutes](/getting-started/first-10-minutes/)** — what to do after setup, with expected results
- **[Why Not Flat Files?](/getting-started/why-not-flat-files/)** — detailed comparison with CLAUDE.md, .cursorrules, and other approaches
- **[Capture Architecture Decisions](/use-cases/architecture-decisions/)** — the most common starting point for teams
