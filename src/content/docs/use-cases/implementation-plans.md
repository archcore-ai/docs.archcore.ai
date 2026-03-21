---
title: Plan Implementation Work
description: Create structured implementation plans that AI agents can follow, track, and connect to requirements and decisions.
---

You need to plan a feature build or a migration — phases, tasks, dependencies, acceptance criteria. Without Archcore, plans live in project management tools or Google Docs that agents cannot access. Every session, you re-explain what needs to happen and in what order.

## Plans Agents Can Follow

Create a plan document in Archcore, and agents see the full scope of work with structured phases and tasks.

```markdown
---
title: Migrate User Data to PostgreSQL
status: draft
---

## Goal

Move all user data from MongoDB to PostgreSQL with zero downtime.

## Tasks

### Phase 1 — Schema and Migration Scripts
- [ ] Design PostgreSQL schema for users, profiles, and sessions
- [ ] Write migration scripts with rollback support
- [ ] Set up dual-write layer in @src/db/

### Phase 2 — Shadow Reads
- [ ] Route read queries to both databases
- [ ] Compare results and log discrepancies
- [ ] Run for 1 week in staging

### Phase 3 — Cutover
- [ ] Switch primary reads to PostgreSQL
- [ ] Decommission MongoDB read path
- [ ] Remove dual-write layer

## Acceptance Criteria

- All user queries return identical results from PostgreSQL
- Migration completes within the 4-hour maintenance window
- Rollback tested and documented

## Dependencies

- Depends on: use-postgres.adr.md (database decision)
- Depends on: migration-format.rule.md (migration standards)
```

When an agent picks up a task from this plan, it sees the full context — what phase it belongs to, what the acceptance criteria are, and what decisions the plan depends on.

## Connect Plans to Requirements and Decisions

Plans sit between vision and implementation. Relations make the connections explicit:

```
auth-redesign.prd.md ←── implements ── auth-redesign.plan.md
                                              │
                                              ├── depends_on ──→ jwt-strategy.adr.md
                                              └── depends_on ──→ auth-rules.rule.md
```

The plan **implements** the PRD that defines what to build. It **depends on** the ADRs and rules that constrain how to build it.

## Agents Help Create Plans

You don't have to write plans from scratch. Ask your agent:

> "Create an implementation plan for the auth redesign based on our PRD"

The agent reads the PRD, identifies tasks, structures them into phases, and links the plan back to its source requirements.

## Plan Status

Plans use the same status lifecycle as all Archcore documents:

- **`draft`** — the plan is being shaped, tasks may change
- **`accepted`** — the team has approved the plan and work can begin
- **`rejected`** — the plan was abandoned or superseded

## See Also

- [Document Types](/concepts/document-types/) — plan format and required sections
- [Document Relations](/concepts/relations/) — linking plans to PRDs and ADRs
- [Capture Architecture Decisions](/use-cases/architecture-decisions/) — decisions that plans depend on
