---
title: First 10 Minutes
description: What to do after installing Archcore — create your first document, see your agent use it, and build connected project knowledge.
---

You've installed Archcore. Now make it useful. This guide walks you through four concrete steps that take your project from zero to a working architectural memory in about 10 minutes.

## What you'll accomplish

- A working `.archcore/` directory in your repository
- Your first architectural document (an ADR)
- Your agent answering questions from real project context
- A second document linked to the first through a relation

Each step ends with a clear result you can verify before moving on.

## Step 1: Initialize your project

If you haven't installed the CLI yet, follow the [Quick Start](/getting-started/quick-start/) first. Otherwise, navigate to your project and run:

```bash
cd your-project
archcore init
```

The CLI does three things:

1. Creates `.archcore/` with a `settings.json` configuration file
2. Auto-detects your coding agents (Claude Code, Cursor, Copilot, Gemini CLI, etc.)
3. Installs the MCP server config and session hooks for each detected agent

**Verify it worked.** Open a conversation with your agent and ask:

> "What Archcore documents exist in this project?"

The agent should respond that there are no documents yet (or list existing ones if you're adding Archcore to a project that already has `.archcore/` files). If the agent doesn't recognize the question, the MCP server may not be configured — check that `archcore init` detected your agent in its output.

## Step 2: Create your first decision

Ask your agent to create an ADR about a real decision in your project. Pick something concrete:

> "Create an ADR about using PostgreSQL as our primary database"

The agent calls the `create_document` MCP tool and generates a properly structured document with the right template, frontmatter, and sections.

**Verify it worked.** Check the file the agent created:

```bash
ls .archcore/
```

You should see a file like `use-postgres.adr.md` (or inside a subdirectory if the agent chose to organize by domain). Open it — the content should look like this:

```markdown
---
title: Use PostgreSQL as Primary Database
status: draft
---

## Context

We need a reliable relational database for our application...

## Decision

Use PostgreSQL for all persistent data storage...

## Alternatives Considered

- MySQL — fewer advanced features (JSONB, arrays, CTEs)
- MongoDB — doesn't fit our relational data model

## Consequences

### Positive
- Strong ACID guarantees
- Excellent ecosystem and tooling

### Negative
- Requires schema migrations for changes
- Horizontal scaling is more complex than NoSQL
```

The key parts: YAML frontmatter with `title` and `status`, a `slug.type.md` filename, and template sections matching the ADR type.

:::tip
You can also create documents manually. Create the file yourself following the [Document Format](/reference/document-format/) spec and the naming convention `slug.type.md`. But letting the agent do it is faster and less error-prone.
:::

## Step 3: Ask your agent about it

This is where the value becomes concrete. Start a new conversation with your agent (or continue the current one) and ask questions that require project context:

> "What architectural decisions have been made in this project?"

The agent calls `list_documents`, finds your ADR, and reports back. Then go deeper:

> "Summarize our database decision and its trade-offs"

The agent calls `get_document`, reads the full content, and gives you an informed answer drawn from the document — not from guesswork or generic knowledge.

**Verify it worked.** The agent's response should reference specific details from your ADR: the alternatives you considered, the consequences you documented, the status of the decision. If it gives a generic answer about PostgreSQL instead, the MCP connection may not be active.

This is the core loop: you capture knowledge as structured documents, and every agent session has that knowledge from the start.

## Step 4: Build on it

Architectural knowledge doesn't exist in isolation. Decisions produce rules. Rules need guides. Create a second document that connects to the first:

> "Create a rule for database migrations based on the PostgreSQL ADR"

The agent creates a new `.rule.md` document — something like `database-migrations.rule.md` — with imperative statements about how your team handles schema changes.

Now link them:

> "Link the migration rule to the PostgreSQL ADR"

The agent calls `add_relation` to create a `related` relation between the two documents. From this point forward, any agent reading either document sees the connection.

**Verify it worked.** Ask:

> "Show me all documents and their relations"

The agent should list both documents and the relation between them. You now have the beginning of a knowledge graph — two documents, one relation, and a foundation to build on.

## Starting from an existing repo

If your project already has documentation or agent configuration files, Archcore works alongside them.

### "I already have a CLAUDE.md"

Keep it. Archcore is additive — it doesn't replace or conflict with existing instruction files. Over time, move structured knowledge out of `CLAUDE.md` and into typed documents. A coding standard becomes a `.rule.md`. A setup procedure becomes a `.guide.md`. The flat file gets smaller as your `.archcore/` directory grows.

### "I already have docs/ or ADRs"

Your agent can help with the migration:

> "Migrate our existing documentation into Archcore format"

The agent reads your files, picks the right document types (decisions become ADRs, standards become rules, how-tos become guides), and creates properly structured documents in `.archcore/`. Review the results — the agent may need guidance on status values and which content is still current.

### "I already have .cursorrules"

Same approach — keep it for now. Identify which rules are project-specific standards (move to `.rule.md`), which are coding patterns (move to `.cpat.md`), and which are step-by-step procedures (move to `.guide.md`). Migrate gradually. Once the knowledge lives in `.archcore/`, it works with every agent, not just Cursor.

## What's next

- [Document Types](/concepts/document-types/) — learn all 10 types and when to use each
- [Philosophy](/concepts/philosophy/) — understand the design principles behind Archcore
- [Context Layers](/concepts/context-layers/) — how Vision, Knowledge, and Experience organize your documents
- [Relations](/concepts/relations/) — the full set of relation types and common linking patterns
