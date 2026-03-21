---
title: Build Shared Project Memory
description: Give every AI agent on your team access to the same project knowledge — decisions, patterns, and context that persist across sessions.
---

Multiple developers on your team use AI agents. Each agent starts fresh every session — no memory of decisions, no awareness of standards, no knowledge of what other agents have done. Without a shared context layer, every developer maintains their own instruction files and knowledge stays fragmented.

## One Knowledge Base, Every Agent

The `.archcore/` directory lives in your repository. Every developer who clones the repo gets the same project knowledge. Every agent — Claude Code, Cursor, Copilot, Gemini CLI — reads from the same source through MCP.

```
your-project/
├── .archcore/
│   ├── auth/
│   │   ├── jwt-strategy.adr.md
│   │   └── auth-redesign.prd.md
│   ├── api/
│   │   ├── error-format.rule.md
│   │   └── rest-conventions.guide.md
│   └── onboarding-flow.task-type.md
└── src/
```

No syncing between tools. No copy-pasting between prompt files. One directory, version-controlled with your code.

## Knowledge Compounds

Every document you add makes future agent sessions more productive. The lifecycle flows naturally:

```
idea → prd → plan → adr → rule → guide → task-type
```

An **idea** becomes a **PRD** with requirements. The PRD produces a **plan** with tasks. Implementation produces **ADRs** for decisions made along the way. Decisions crystallize into **rules**. Rules get **guides** that explain how to follow them. Repeated work becomes **task-types** that agents execute consistently.

Each document builds on what came before. A month of accumulated context means agents start sessions already knowing your architecture, standards, and patterns.

## Git-Versioned, PR-Reviewable

Archcore documents are plain markdown files. They go through the same workflow as code:

- **Branch** — draft a new ADR on a feature branch
- **Review** — teammates review the decision in a pull request
- **Merge** — the accepted decision becomes part of shared context
- **History** — `git log` shows when and why every decision was made

No external tool to manage. No separate access controls. Your project knowledge lives where your code lives.

## See Also

- [Quick Start](/getting-started/quick-start/) — set up Archcore in 2 minutes
- [Context Layers](/concepts/context-layers/) — how Vision, Knowledge, and Experience organize your documents
- [Capture Architecture Decisions](/use-cases/architecture-decisions/) — the most common starting point
