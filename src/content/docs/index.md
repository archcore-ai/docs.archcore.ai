---
title: What Is Archcore?
description: Archcore structures your project's architectural knowledge into typed documents that AI coding agents discover and follow through MCP.
---

Archcore is an open-source **System Context Platform**. It structures your project's architectural knowledge into documents that AI coding agents can discover, read, and follow through [MCP (Model Context Protocol)](/integrations/mcp-server/).

## The Problem

AI coding agents (Claude Code, Cursor, Copilot, etc.) produce better results when they have context about your project — decisions, rules, conventions, patterns. Today, you probably store this context in:

- `CLAUDE.md` / `.cursorrules` — flat files that grow unwieldy
- Confluence / Notion — not accessible to agents
- People's heads — not accessible to anyone else

None of these scale. As context grows, flat files become hard to maintain. As teams grow, knowledge gets fragmented.

## The Solution

Archcore solves this with a structured approach to project context:

1. **10 document types** — each with a specific purpose, required sections, and a template
2. **Free-form directory structure** — organize by domain, feature, team, or however makes sense; documents are classified by their type (in the filename), not by where they live
3. **Relations** — explicit links between documents (implements, extends, depends_on, related)
4. **MCP server** — agents read and write documents through [8 MCP tools](/reference/mcp-tools/)
5. **Validation** — CLI checks structure, naming, frontmatter, and relations
6. **Multi-agent support** — one setup works with Claude Code, Cursor, Copilot, Gemini CLI, and more

## Three Categories

Every document type belongs to one of three categories:

- **Knowledge** (adr, rfc, rule, guide, doc) — decisions, standards, and reference material
- **Vision** (prd, idea, plan) — where the product and project are heading
- **Experience** (task-type, cpat) — patterns learned from doing the work

See [Document Types](/concepts/document-types/) for descriptions, required sections, and templates for all 10 types.

## Project Layout

```text
Your project
├── .archcore/
│   ├── settings.json
│   ├── auth/
│   │   ├── jwt-strategy.adr.md        ← knowledge
│   │   └── auth-redesign.prd.md       ← vision
│   ├── payments/
│   │   └── stripe-integration.guide.md ← knowledge
│   └── onboarding-flow.task-type.md   ← experience
└── src/
    └── ...
```

When an agent starts a session, Archcore's MCP server makes all documents available through tools like `list_documents`, `get_document`, and `create_document`. The agent can query, read, and create new documents without leaving the conversation.

## Next Steps

- [Quick Start](/getting-started/quick-start/) — install and set up your first project in 2 minutes
- [How It Works](/concepts/how-it-works/) — understand the full workflow from init to agent interaction
- [Document Types](/concepts/document-types/) — learn all 10 types and when to use each
- [MCP Server](/integrations/mcp-server/) — how agents connect to your project context
