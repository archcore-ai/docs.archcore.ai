---
title: Context Layers
description: Vision, Knowledge, and Experience — the three layers that organize project understanding from future plans to proven patterns.
---

Every document in archcore belongs to exactly one of three **layers**. The layer represents where the document sits in the lifecycle of understanding — from aspirational plans to proven patterns.

## Vision

Documents describing the **future** — what to build and why.

| Type | Purpose | Example |
|------|---------|---------|
| `prd` | Product requirements with goals, scope, and acceptance criteria | `auth-redesign.prd.md` |
| `idea` | Early-stage concepts worth capturing before they're fully formed | `realtime-sync.idea.md` |
| `plan` | Concrete implementation plans with tasks and milestones | `q2-migration.plan.md` |

Vision documents answer questions like: *What are we building next? Why? What does success look like?* They are typically created at the start of an initiative and flow naturally into knowledge as decisions are made during implementation.

## Knowledge

Decisions, standards, and reference material — **what we know**.

| Type | Purpose | Example |
|------|---------|---------|
| `adr` | Architectural decisions with context, alternatives, and consequences | `use-postgres.adr.md` |
| `rfc` | Proposals open for review before a decision is finalized | `graphql-migration.rfc.md` |
| `rule` | Team standards and required behaviors with enforcement guidance | `api-versioning.rule.md` |
| `guide` | Step-by-step instructions for completing a specific task | `deploy-staging.guide.md` |
| `doc` | Reference material, registries, lookup tables, and general documentation | `env-variables.doc.md` |

Knowledge is the backbone of system context. This is where most documents live — the accumulated understanding of how your system works and why it works that way. Decisions emerge from implementation, standards emerge from decisions, and guides make standards actionable.

## Experience

Patterns and lessons learned from **practice**.

| Type | Purpose | Example |
|------|---------|---------|
| `task-type` | Proven workflows for recurring implementation tasks | `api-endpoint-creation.task-type.md` |
| `cpat` | Code pattern changes — when a convention or approach has deliberately changed | `error-handling-v2.cpat.md` |

Experience documents crystallize from repeated work. After an agent creates its third API endpoint following the same pattern, that pattern becomes a `task-type`. When a team deliberately changes how they handle errors, the shift is recorded as a `cpat`. Experience feeds back into knowledge — a `cpat` might lead to updating a `rule`, and a `task-type` might reference a `guide`.

## How Layers Connect

The natural lifecycle flows from **Vision → Knowledge → Experience**:

```
Vision                Knowledge              Experience
┌──────────┐         ┌──────────┐           ┌──────────┐
│   idea   │───→     │   rfc    │           │          │
│   prd    │───→     │   adr    │───→       │task-type │
│   plan   │───→     │   rule   │───→       │   cpat   │
│          │         │  guide   │           │          │
│          │         │   doc    │           │          │
└──────────┘         └──────────┘           └──────────┘
```

But this is not a strict sequence. Documents can be created in any layer at any time. A team might start with a `rule` that was always understood but never written down, or create a `task-type` before the underlying `adr` exists.

[Relations](/concepts/relations/) link documents across layers, making the connections explicit:
- A `plan` **implements** a `prd`
- A `task-type` **depends_on** a `rule`
- An `adr` **extends** a previous `adr`
- An `rfc` is **related** to an `idea`

## Layers Are Virtual

Layers are derived from the document type in the filename — they are **not** directories. A file at `.archcore/auth/jwt-strategy.adr.md` belongs to the Knowledge layer because `adr` is a Knowledge type, not because it sits in an `auth/` directory.

This means you can organize your `.archcore/` directory however you want:

```
.archcore/
├── auth/
│   ├── jwt-strategy.adr.md        ← Knowledge
│   └── auth-redesign.prd.md       ← Vision
├── payments/
│   └── stripe-integration.guide.md ← Knowledge
└── onboarding-flow.task-type.md    ← Experience
```

Three different layers, organized by domain — not by layer. See [Directory Structure](/concepts/directory-structure/) for more on organizing your documents.
