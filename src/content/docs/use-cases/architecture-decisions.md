---
title: Capture Architecture Decisions
description: Use Archcore to record, track, and share architectural decisions that AI agents can discover and follow.
---

Your team makes technical decisions every week — database choices, auth strategies, API design patterns. Without a structured record, these decisions live in Slack threads, pull request comments, and people's memory. When an AI agent starts a new session, none of that context exists.

## The Workflow

Create an ADR in Archcore, and every agent on your team discovers it automatically through MCP. No copy-pasting into prompt files.

Ask your agent:

> "Create an ADR for using PostgreSQL as our primary database"

The agent calls `create_document` and produces a structured record:

```markdown
---
title: Use PostgreSQL as Primary Database
status: accepted
---

## Context
We need a relational database with strong ACID guarantees
and mature tooling for our multi-service architecture.

## Decision
Use PostgreSQL 16 for all persistent data storage.

## Alternatives Considered
- MySQL — fewer advanced features (JSONB, arrays)
- MongoDB — doesn't fit our relational data model

## Consequences
### Positive
- Strong ACID compliance
- Excellent JSON support via JSONB
### Negative
- Schema migrations required for changes
```

The next time any agent works on database-related code, it queries `.archcore/` and finds this decision. It knows PostgreSQL is the standard — without you repeating it.

## Decisions Cascade into Standards

An ADR rarely stands alone. Decisions produce rules, and rules produce guides:

```
use-postgres.adr.md
  └── related → migration-format.rule.md
                  └── related → run-migrations.guide.md
```

The ADR records *why* PostgreSQL. The rule defines *how* to write migrations. The guide walks through the steps. Agents follow the full chain.

## Agents Create ADRs Too

After a design discussion in your agent session, capture the outcome immediately:

> "Create an ADR for the authentication approach we just discussed — JWT with short-lived tokens and refresh rotation"

The agent structures the decision, fills in context and alternatives, and saves it for every future session to find.

## See Also

- [Document Types](/concepts/document-types/) — ADR format and required sections
- [Document Relations](/concepts/relations/) — how to link ADRs to rules and guides
- [Keep Coding Rules Reusable](/use-cases/coding-rules/) — the natural next step after recording a decision
