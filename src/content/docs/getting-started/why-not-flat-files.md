---
title: Why Not Just Flat Instruction Files?
description: How Archcore compares to CLAUDE.md, .cursorrules, and other flat-file approaches — and when each makes sense.
---

Most teams start with flat instruction files — `CLAUDE.md`, `.cursorrules`, a `docs/` folder, or a wiki. These work for small projects. This page explains where they stop working and what Archcore does differently.

## Where flat files break down

- **The file keeps growing.** A `CLAUDE.md` that starts at 20 lines reaches 200. The agent reads the entire file every session but can't prioritize what matters — everything looks equally important.
- **Multiple agents, multiple files.** You maintain `CLAUDE.md` and `.cursorrules` with overlapping content. One gets updated, the other drifts.
- **No structure to query.** Decisions, standards, how-tos, and plans are all paragraphs in the same file. There's no way to ask "show me all coding rules" or "what decisions were made about auth."
- **No lifecycle.** Last month's decision to use REST sits next to this week's switch to GraphQL. Both look equally valid. No way to mark something as superseded.
- **No connections.** A database decision produced a migration rule, which led to a guide. In a flat file, these are unrelated paragraphs.

## What Archcore does differently

### Typed documents instead of undifferentiated text

In a flat file, a decision and a coding standard are just paragraphs. Archcore gives each piece of knowledge an explicit type: `adr` for decisions, `rule` for standards, `guide` for how-tos, `plan` for implementation tasks — [11 types](/concepts/document-types/) total. Each type has a template. Agents query by type instead of parsing everything.

A flat file is a bag of text. Typed documents are a queryable knowledge base.

### Free-form directory structure

Archcore does not impose a directory layout. The `.archcore/` directory is entirely yours — organize by domain, by team, flat, nested, or however makes sense:

```text
.archcore/
├── jwt-strategy.adr.md            ← flat, small project
├── auth/
│   ├── session-handling.rule.md   ← by domain
│   └── auth-setup.guide.md
└── payments/
    └── stripe-integration.adr.md
```

The type comes from the filename (`slug.type.md`), not from where the file lives. Reorganize anytime without changing semantics.

### Relations add meaning

A database decision influenced a caching strategy, which produced coding rules, which led to a migration guide. Archcore makes these connections explicit with [directed relations](/concepts/relations/): `implements`, `extends`, `depends_on`, `related`.

```text
auth-redesign.prd.md ──implements──→ auth-redesign.plan.md
auth-redesign.plan.md ──depends_on──→ jwt-strategy.adr.md
jwt-strategy.adr.md ──related──→ session-handling.rule.md
```

When an agent reads a document, it sees the full graph — the decision that motivated it, the rules that constrain it, the plan it belongs to.

### Status lifecycle

Every document has a status: `draft`, `accepted`, or `rejected`. Superseded decisions stay in history but agents know they're no longer current.

### Cross-agent, agent-native

One `.archcore/` directory works with [Claude Code, Cursor, Copilot, Gemini CLI, and more](/integrations/supported-agents/). Agents don't just read — they query by type and status, create documents from templates, and add relations through [MCP](/integrations/mcp-server/).

## When to switch

**Stay with flat files if** your project is small, you use one agent, and your instruction file is under ~50 lines.

**Consider Archcore when** your instructions keep growing, you use multiple agents, you want status tracking, or you need connections between decisions, rules, and plans.

**You don't have to choose.** Archcore is additive — keep your `CLAUDE.md` for quick agent-specific tweaks, use `.archcore/` for structured project knowledge.

## Side-by-side

| | Flat files | Archcore |
|---|---|---|
| **Structure** | Free-form text | Typed documents with templates |
| **Scale** | Unwieldy past ~50 lines | Separate documents, free-form directory |
| **Multi-agent** | Separate files per agent | One knowledge base via MCP |
| **Findability** | Agent reads everything | Agent queries by type, status, topic |
| **Lifecycle** | No status tracking | `draft` / `accepted` / `rejected` |
| **Connections** | No links between concepts | Directed relations between documents |

## Next steps

- [Quick Start](/getting-started/quick-start/) — install and set up your first project
- [Document Types](/concepts/document-types/) — learn all 11 types and when to use each
- [Philosophy](/concepts/philosophy/) — the design principles behind Archcore
