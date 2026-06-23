---
title: Document Types
description: All 19 document types — ADRs, RFCs, rules, guides, PRDs, R&D notes, market/business/user requirement docs, ISO specifications, and more. When to use each, required sections, and templates.
---

Archcore has 19 document types organized into 3 layers. Each type has a template with required sections that the CLI generates automatically.

## Choosing the Right Type

```
Need to record a final decision?           → adr
Need to propose a change for review?       → rfc
Need to enforce a team standard?           → rule
Need step-by-step instructions?            → guide
Need a normative contract for a boundary?  → spec
Need reference/lookup material?            → doc
Need to define product requirements?       → prd
Need to capture an early idea?             → idea
Need to investigate before deciding?       → rnd
Need to plan implementation tasks?         → plan
Need market analysis (TAM, competitors)?   → mrd
Need business justification (ROI, budget)? → brd
Need user personas and journeys?           → urd
Need ISO business requirements?            → brs
Need ISO stakeholder requirements?         → strs
Need ISO system requirements?              → syrs
Need ISO software requirements?            → srs
Need to document a repeatable workflow?    → task-type
Need to record a coding pattern change?    → cpat
```

:::tip[Let agents choose]
When working with an AI agent, just describe what you want to document. The agent picks the right type from these rules — they're embedded in the MCP server instructions.
:::

---

## Vision

Where the product and project are heading. Vision documents are organized into three **requirement tracks** — pick the one that matches your team's complexity and process.

### Product Track (Simple)

The starting point for most teams. Three types that cover the full lifecycle from idea to implementation.

#### PRD — Product Requirements Document

Product requirements with goals, scope, and acceptance criteria.

| | |
|---|---|
| **File extension** | `.prd.md` |
| **When to use** | Product requirements with goals and acceptance criteria are defined |
| **Required sections** | Vision, Problem Statement, Goals & Success Metrics, Requirements |

#### Idea — Concept to Explore

A product or technical concept that needs capturing before it's fully formed.

| | |
|---|---|
| **File extension** | `.idea.md` |
| **When to use** | A concept needs capturing for future evaluation |
| **Required sections** | Idea, Value, Possible Implementation, Risks & Constraints |

#### RnD — Research & Investigation

A bounded investigation that answers an open question before a decision is made or work begins. Every `rnd` ends with a **Recommendation** — `proceed`, `refine`, `defer`, or `stop` — plus the single next action that follows from it.

| | |
|---|---|
| **File extension** | `.rnd.md` |
| **When to use** | A bounded investigation is needed to answer a question before deciding or building |
| **Required sections** | Research Goal, Questions/Hypotheses, Approach, Findings, Recommendation, Next Action |

An `rnd` is the **Research Gate** in front of the committing tracks (`rnd` -> `idea`, `rnd` -> `adr` -> `spec` -> `plan`). Its status maps to the verdict:

- `draft` — still investigating
- `accepted` — recommendation adopted, proceed or refine
- `rejected` — defer or stop

A rejected `rnd` is a first-class outcome, not a failure. "We investigated and decided not to" stays visible as a record of the dead end — keep it, don't delete it. By convention, `prd`/`plan`/`adr` `depends_on` an `rnd`, and an `rfc` may `extend` one; `rnd` never uses [`implements`](/concepts/relations/).

:::note[RnD vs Idea vs ADR vs RFC]
An **rnd** investigates an open question and must conclude with a recommendation — use it for "should we / which way." An **idea** proposes a concept worth exploring — "we could." An **adr** records a decision already made; gather evidence in an `rnd`, then record the resulting decision as an `adr`. An **rfc** puts a concrete proposal up for review. If there's nothing to propose yet, use `rnd`.
:::

#### Plan — Implementation Plan

An actionable plan with phased tasks and acceptance criteria.

| | |
|---|---|
| **File extension** | `.plan.md` |
| **When to use** | An implementation plan with tasks is formed |
| **Required sections** | Goal, Tasks (phased), Acceptance Criteria, Dependencies |

### Sources Track (Discovery)

Captures **where** requirements come from — market, business, and users. Documents flow naturally: MRD (market landscape) -> BRD (business justification) -> URD (user needs).

#### MRD — Market Requirements Document

Market analysis covering TAM/SAM/SOM, competitive landscape, market needs, and timing.

| | |
|---|---|
| **File extension** | `.mrd.md` |
| **When to use** | Market analysis is needed before proposing a solution |
| **Required sections** | Market Overview, TAM/SAM/SOM, Competitive Landscape, Market Needs, Timing |

#### BRD — Business Requirements Document

Business justification with objectives, ROI, stakeholders, budget, and constraints.

| | |
|---|---|
| **File extension** | `.brd.md` |
| **When to use** | Business justification and organizational impact need documenting |
| **Required sections** | Objectives, ROI, Stakeholders, Budget, Constraints |

#### URD — User Requirements Document

User needs captured through personas, journeys, usability requirements, and acceptance criteria.

| | |
|---|---|
| **File extension** | `.urd.md` |
| **When to use** | User needs, personas, and journeys need capturing during discovery |
| **Required sections** | Personas, User Journeys, Usability Requirements, Acceptance Criteria |

### ISO Track (Decomposition)

Decomposes requirements through progressively detailed levels, following [ISO/IEC/IEEE 29148:2018 — Systems and software engineering — Life cycle processes — Requirements engineering](https://www.iso.org/standard/72089.html). BRS (why the business needs it) -> StRS (what stakeholders need) -> SyRS (how the system behaves) -> SRS (how the software works).

#### BRS — Business Requirements Specification

Mission, goals, operational concept, and success criteria.

| | |
|---|---|
| **File extension** | `.brs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.3 |
| **When to use** | Business requirements need formalizing into ISO-structured specification |
| **Required sections** | Mission, Business Goals, Operational Concept, Success Criteria |

#### StRS — Stakeholder Requirements Specification

Per-stakeholder-class requirements with concept of operations and compliance.

| | |
|---|---|
| **File extension** | `.strs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.4 |
| **When to use** | Stakeholder requirements need structuring per class with ConOps |
| **Required sections** | Stakeholder Classes, Per-Class Requirements, ConOps, Compliance |

#### SyRS — System Requirements Specification

System boundary, interfaces, modes, and verification approach.

| | |
|---|---|
| **File extension** | `.syrs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.5 |
| **When to use** | The whole system boundary, interfaces, and verification need specifying |
| **Required sections** | System Boundary, Interfaces, Modes of Operation, Verification Approach |

#### SRS — Software Requirements Specification

Per-function and per-endpoint specifications with a verification matrix.

| | |
|---|---|
| **File extension** | `.srs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.6 |
| **When to use** | Detailed software requirements need per-function/per-endpoint specification |
| **Required sections** | Functional Requirements, Interface Requirements, Verification Matrix |

### Choosing the Right Requirements Track

| Track | Documents | Best For |
|---|---|---|
| Product (simple) | `prd` | Individual features, small teams, rapid prototyping, internal tools |
| Sources (discovery) | `mrd` -> `brd` -> `urd` | Product teams doing discovery, stakeholder alignment, business analysis |
| ISO (decomposition) | `brs` -> `strs` -> `syrs` -> `srs` | Regulated systems, multi-team projects, complex distributed systems |

All three tracks can coexist — e.g. `prd` for a small feature while the full ISO track covers a safety-critical subsystem.

### Requirements Layers — Sources vs Specifications

Sources and Specifications serve **separate purposes**:

- **Layer A (Sources):** `mrd`, `brd`, `urd`, `prd` -- capture raw requirements from market, business, and user perspectives
- **Layer B (Specifications):** `brs`, `strs`, `syrs`, `srs` -- formalize what sources capture informally, connected via the `implements` [relation](/concepts/relations/)

:::tip[When types look similar]
The Sources and ISO tracks overlap in subject matter but differ in formality:
- **MRD vs PRD** -- MRD analyzes the market (TAM/SAM/SOM, competitors, timing) without proposing a solution. PRD proposes a product with requirements and solution overview.
- **BRD vs PRD** -- BRD focuses on business justification (ROI, budget, organizational impact). PRD focuses on product definition (features, user stories, solution).
- **URD vs PRD** -- URD captures user needs via personas and journeys (discovery-oriented). PRD defines product requirements with acceptance criteria (specification-oriented).
- **BRS vs BRD** -- BRS is an ISO specification (formalized structure). BRD is an informal source (business justification, ROI). BRS formalizes what BRD captures.
- **StRS vs URD** -- StRS is an ISO specification (per-class requirements with ConOps). URD is an informal source (personas, journeys). StRS formalizes what URD captures.
- **SyRS vs SRS** -- SyRS defines the whole system boundary. SRS specifies a single component's detailed behavior.
:::

---

## Knowledge

Decisions, standards, and reference material.

### ADR — Architecture Decision Record

Records a decision that has been made.

| | |
|---|---|
| **File extension** | `.adr.md` |
| **When to use** | A technical decision is made or finalized |
| **Required sections** | Context, Decision, Alternatives Considered, Consequences |

```markdown
---
title: Use PostgreSQL as Primary Database
status: accepted
---

## Context
We need a relational database with strong ACID guarantees...

## Decision
Use PostgreSQL 16 for all persistent storage...

## Alternatives Considered
- MySQL — fewer advanced features
- MongoDB — doesn't fit our relational model

## Consequences
### Positive
- Strong ACID guarantees
- Excellent JSON support via JSONB
### Negative
- Schema migrations required for changes
```

### RFC — Request for Comments

Proposes a significant change for team review.

| | |
|---|---|
| **File extension** | `.rfc.md` |
| **When to use** | A significant change is being proposed |
| **Required sections** | Summary, Motivation, Detailed Design, Drawbacks, Alternatives |

### Rule — Standard or Required Behavior

Imperative statements that the team must follow.

| | |
|---|---|
| **File extension** | `.rule.md` |
| **When to use** | A team standard or required behavior is established |
| **Required sections** | Rule statements, Rationale, Examples (Good/Bad), Enforcement |

```markdown
---
title: API Error Response Format
status: accepted
---

## Rule

1. ALL API errors MUST return a JSON body with `code`, `message`, and `request_id`
2. Error codes MUST use UPPER_SNAKE_CASE
3. HTTP status codes MUST match the error semantics (404 for not found, etc.)
4. Stack traces MUST NOT be included in production responses

## Rationale
Consistent error format enables clients to handle errors programmatically...

## Examples
### Good
...
### Bad
...
```

### Guide — Step-by-Step Instructions

How-to instructions for completing a specific task.

| | |
|---|---|
| **File extension** | `.guide.md` |
| **When to use** | Step-by-step instructions need to be documented |
| **Required sections** | Prerequisites, Steps (numbered), Verification, Common Issues |

### Spec — Normative Contract

The canonical normative contract for a concrete system, component, interface, schema, or protocol.

| | |
|---|---|
| **File extension** | `.spec.md` |
| **When to use** | A normative contract with behavior, constraints, and conformance criteria is being formalized |
| **Required sections** | Purpose, Scope, Authority, Subject, Contract Surface, Normative Behavior, Constraints & Invariants, Error Handling, Conformance |

```markdown
---
title: Webhook Delivery Contract
status: accepted
---

## Purpose
This specification defines the canonical webhook delivery contract.

## Scope
### Covers
- Payload format, delivery guarantees, retry policy, signature verification

### Does Not Cover
- Webhook management API (registration, listing, deletion)

## Authority
This document is the normative specification for webhook delivery.

## Normative Behavior
1. The system MUST deliver payloads as JSON with Content-Type `application/json`
2. The system MUST retry failed deliveries up to 5 times with exponential backoff
3. The system SHOULD include an HMAC-SHA256 signature in the `X-Signature` header

## Conformance
An implementation conforms to this spec if it satisfies all MUST requirements
and all stated invariants.
```

:::note[Spec vs Doc vs Rule]
A **spec** defines a normative contract for a specific technical boundary — how a component *must* behave. A **doc** is non-behavioral reference material (registries, glossaries, lookup tables). A **rule** sets a cross-cutting team standard ("Always do X"). If you're documenting how one system works → `spec`. If you're describing what exists → `doc`. If you're prescribing how engineers must act → `rule`.
:::

### Doc — Reference Documentation

Non-behavioral reference material — registries, glossaries, lookup tables, component lists.

| | |
|---|---|
| **File extension** | `.doc.md` |
| **When to use** | Non-behavioral reference material like registries, glossaries, or lookup tables needs documenting |
| **Required sections** | Overview, Content sections, Examples |

:::note[Rule vs Doc]
A **rule** contains imperative statements ("Always do X", "Never do Y") with enforcement info. A **doc** is non-behavioral reference material. If it prescribes behavior, use `rule`. If it describes what exists, use `doc`.
:::

---

## Experience

Patterns learned from doing the work. You can ignore these types at first — they become useful once your team has enough practice to recognize repeatable patterns.

### Task Type — Recurring Task Pattern

A proven workflow for a recurring implementation task.

| | |
|---|---|
| **File extension** | `.task-type.md` |
| **When to use** | A proven workflow for a recurring task is documented |
| **Required sections** | What, When to Use, Steps, Example, Things to Watch Out For |

### CPAT — Code Pattern Change

Documents how and why a coding convention or pattern changed.

| | |
|---|---|
| **File extension** | `.cpat.md` |
| **When to use** | A coding pattern or convention has deliberately changed |
| **Required sections** | What Changed, Why, Before, After, Scope |

```markdown
---
title: Switch from Callbacks to Async/Await
status: accepted
---

## What Changed
All asynchronous code now uses async/await instead of callbacks.

## Why
Callbacks led to deeply nested code and inconsistent error handling...

## Before
\`\`\`javascript
getUser(id, (err, user) => {
  if (err) return handleError(err);
  getOrders(user.id, (err, orders) => { ... });
});
\`\`\`

## After
\`\`\`javascript
const user = await getUser(id);
const orders = await getOrders(user.id);
\`\`\`

## Scope
All files in `src/services/` and `src/handlers/`.
```
