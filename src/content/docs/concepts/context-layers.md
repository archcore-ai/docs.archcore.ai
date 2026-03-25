---
title: Context Layers
description: Vision, Knowledge, and Experience — the three layers that organize project understanding from future plans to proven patterns.
---

Every document in Archcore belongs to exactly one of three **layers**. The layer represents where the document sits in the lifecycle of understanding — from aspirational plans to proven patterns.

:::note[You can ignore layers at first]
Layers are automatic — they come from the document type, not from anything you configure. If you create an `adr`, it's in the Knowledge layer. If you create a `plan`, it's in Vision. You don't need to think about layers when starting out. They become useful when you want to browse documents by category or understand the lifecycle of your project knowledge.
:::

## Vision

Documents describing the **future** — what to build and why.

Vision has 10 document types organized into three **requirement tracks**. Each track offers a different level of formality for capturing requirements. All three tracks can coexist in the same project — use whichever fits your situation.

### Product Track (Simple)

Lightweight requirements for individual features and rapid prototyping.

| Type | Purpose | Example |
|------|---------|---------|
| `prd` | Product requirements with goals, scope, and acceptance criteria | `auth-redesign.prd.md` |
| `idea` | Early-stage concepts worth capturing before they're fully formed | `realtime-sync.idea.md` |
| `plan` | Concrete implementation plans with tasks and milestones | `q2-migration.plan.md` |

### Sources Track (Discovery)

Market-driven requirements for product teams doing discovery and stakeholder alignment.

| Type | Purpose | Example |
|------|---------|---------|
| `mrd` | Market analysis — TAM/SAM/SOM, competitive landscape, market needs | `market-analysis-q1.mrd.md` |
| `brd` | Business justification — objectives, ROI, stakeholders, budget | `saas-expansion.brd.md` |
| `urd` | User needs — personas, journeys, usability requirements | `mobile-ux-needs.urd.md` |

Flow: `mrd` (market landscape) → `brd` (business justification) → `urd` (user needs).

### ISO Track (Decomposition)

Formal requirements decomposition following ISO/IEC/IEEE 29148 structure. Use this track for regulated systems or multi-team projects that need rigorous traceability.

| Type | Purpose | Example |
|------|---------|---------|
| `brs` | Business requirements specification (ISO 29148 §9.3) — mission, goals, success criteria | `platform-business-reqs.brs.md` |
| `strs` | Stakeholder requirements specification (ISO 29148 §9.4) — per-class requirements with ConOps | `stakeholder-reqs.strs.md` |
| `syrs` | System requirements specification (ISO 29148 §9.5) — system boundary, interfaces, modes | `system-reqs.syrs.md` |
| `srs` | Software requirements specification (ISO 29148 §9.6) — per-function/endpoint specs | `auth-module-reqs.srs.md` |

Flow: `brs` → `strs` → `syrs` → `srs`.

### Choosing the Right Track

| Track | Documents | Best For |
|-------|-----------|----------|
| Product (simple) | `prd`, `idea`, `plan` | Individual features, small teams, rapid prototyping |
| Sources (discovery) | `mrd` → `brd` → `urd` | Product teams doing discovery, stakeholder alignment |
| ISO (decomposition) | `brs` → `strs` → `syrs` → `srs` | Regulated systems, multi-team projects |

Vision documents answer questions like: *What are we building next? Why? What does success look like?* They are typically created at the start of an initiative and flow naturally into knowledge as decisions are made during implementation.

## Knowledge

Decisions, standards, and reference material — **what we know**.

| Type | Purpose | Example |
|------|---------|---------|
| `adr` | Architectural decisions with context, alternatives, and consequences | `use-postgres.adr.md` |
| `rfc` | Proposals open for review before a decision is finalized | `graphql-migration.rfc.md` |
| `rule` | Team standards and required behaviors with enforcement guidance | `api-versioning.rule.md` |
| `guide` | Step-by-step instructions for completing a specific task | `deploy-staging.guide.md` |
| `spec` | Canonical normative contract — behavior, constraints, invariants, conformance for a specific technical boundary | `webhook-delivery.spec.md` |
| `doc` | Non-behavioral reference — registries, glossaries, lookup tables, component lists | `env-variables.doc.md` |

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
Vision                     Knowledge              Experience
┌───────────────────┐     ┌──────────┐           ┌──────────┐
│ Product track     │     │   rfc    │           │          │
│   idea prd plan   │──→  │   adr    │───→       │task-type │
│                   │     │   rule   │───→       │   cpat   │
│ Sources track     │     │  guide   │           │          │
│   mrd brd urd     │──→  │   spec   │           │          │
│                   │     │   doc    │           │          │
│ ISO track         │     │          │           │          │
│   brs strs        │──→  │          │           │          │
│   syrs srs        │     │          │           │          │
└───────────────────┘     └──────────┘           └──────────┘
```

But this is not a strict sequence. Documents can be created in any layer at any time. A team might start with a `rule` that was always understood but never written down, or create a `task-type` before the underlying `adr` exists.

[Relations](/concepts/relations/) link documents across layers, making the connections explicit:
- A `plan` **implements** a `prd`
- A `task-type` **depends_on** a `rule`
- An `adr` **extends** a previous `adr`
- An `rfc` is **related** to an `idea`

## Layers Are Virtual

Layers are derived from the document type in the filename — they are **not** directories. A file at `.archcore/auth/jwt-strategy.adr.md` belongs to the Knowledge layer because `adr` is a Knowledge type, not because it sits in an `auth/` directory. Likewise, `.archcore/payments/saas-expansion.brd.md` is Vision because `brd` is a Vision type.

This means you can organize your `.archcore/` directory however you want:

```
.archcore/
├── auth/
│   ├── jwt-strategy.adr.md        ← Knowledge
│   └── auth-redesign.prd.md       ← Vision
├── payments/
│   ├── stripe-integration.guide.md ← Knowledge
│   └── saas-expansion.brd.md       ← Vision
├── platform/
│   └── platform-business-reqs.brs.md ← Vision
└── onboarding-flow.task-type.md    ← Experience
```

Three different layers, organized by domain — not by layer. See [Directory Structure](/concepts/directory-structure/) for more on organizing your documents.
