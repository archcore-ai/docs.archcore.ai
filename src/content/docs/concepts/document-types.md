---
title: Document Types
description: Archcore has 19 document types, including ADR, RFC, rule, guide, spec, doc, PRD, plan, and ISO specifications.
---

Archcore has 19 document types organized into 3 categories. Each type has a template with required sections that the Archcore CLI generates. If you have not installed the CLI yet, get it from the [CLI page](https://archcore.ai/cli/).

## Choosing the right type

```
Need to record a final decision?           → adr
Need to propose a change for review?       → rfc
Need to enforce a team standard?           → rule
Need step-by-step instructions?            → guide
Need a contract for a boundary or feature? → spec
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
When you work with an AI agent, describe what you want to document. The agent picks the type from these same rules, which are embedded in the MCP server instructions.
:::

---

## Vision

Where the product and project are heading. Vision documents are organized into three **requirement tracks**. Pick the one that matches your team's complexity and process.

### Product track (simple)

The starting point for most teams. Four types that cover the lifecycle from investigation through implementation.

#### PRD (Product Requirements Document)

Product requirements with goals, scope, and acceptance criteria.

| | |
|---|---|
| **File extension** | `.prd.md` |
| **When to use** | Product requirements with goals and acceptance criteria are defined |
| **Required sections** | Vision, Problem Statement, Goals & Success Metrics, Requirements |

#### Idea

A product or technical concept that needs capturing before it is fully formed.

| | |
|---|---|
| **File extension** | `.idea.md` |
| **When to use** | A concept needs capturing for future evaluation |
| **Required sections** | Idea, Value, Possible Implementation, Risks & Constraints |

#### RnD

A bounded investigation that answers an open question before a decision is made or work begins. Every `rnd` ends with a **Recommendation** (`proceed`, `refine`, `defer`, or `stop`) plus the single next action that follows from it.

| | |
|---|---|
| **File extension** | `.rnd.md` |
| **When to use** | A bounded investigation is needed to answer a question before deciding or building |
| **Required sections** | Research Goal, Questions/Hypotheses, Approach, Findings, Recommendation, Next Action |

An `rnd` is the **Research Gate** in front of the committing tracks (`rnd` -> `idea`, `rnd` -> `adr` -> `spec` -> `plan`). Its status maps to the verdict:

- `draft`: still investigating
- `accepted`: recommendation adopted, proceed or refine
- `rejected`: defer or stop

A rejected `rnd` is a first-class outcome. Keep it in the repository, because "we investigated and decided not to" stays visible as a record of the dead end. By convention, `prd`/`plan`/`adr` `depends_on` an `rnd`, and an `rfc` may `extend` one; `rnd` never uses [`implements`](/concepts/relations/).

:::note[RnD vs Idea vs ADR vs RFC]
An **rnd** investigates an open question and must conclude with a recommendation. Use it for "should we" and "which way." An **idea** proposes a concept worth exploring, the "we could" case. An **adr** records a decision already made; gather evidence in an `rnd`, then record the resulting decision as an `adr`. An **rfc** puts a concrete proposal up for review. If there is nothing to propose yet, use `rnd`.
:::

#### Plan

An actionable plan with phased tasks and acceptance criteria.

| | |
|---|---|
| **File extension** | `.plan.md` |
| **When to use** | An implementation plan with tasks is formed |
| **Required sections** | Goal, Tasks (phased), Acceptance Criteria, Dependencies |

### Sources track (discovery)

Captures where requirements come from: the market, the business, and users. Documents flow naturally from MRD (market landscape) to BRD (business justification) to URD (user needs).

#### MRD (Market Requirements Document)

Market analysis covering TAM/SAM/SOM, competitive landscape, market needs, and timing.

| | |
|---|---|
| **File extension** | `.mrd.md` |
| **When to use** | Market analysis is needed before proposing a solution |
| **Required sections** | Market Landscape, TAM/SAM/SOM, Competitive Analysis, Market Needs, Opportunity and Timing |

#### BRD (Business Requirements Document)

Business justification with objectives, stakeholders, constraints, and ROI.

| | |
|---|---|
| **File extension** | `.brd.md` |
| **When to use** | Business justification and organizational impact need documenting |
| **Required sections** | Business Objectives, Stakeholders, Business Rules and Constraints, Success Metrics and ROI |

#### URD (User Requirements Document)

User needs captured through personas, journeys, user requirements, usability, and acceptance criteria.

| | |
|---|---|
| **File extension** | `.urd.md` |
| **When to use** | User needs, personas, and journeys need capturing during discovery |
| **Required sections** | User Personas, User Journeys, User Requirements, Usability Requirements, Acceptance Criteria |

### ISO track (decomposition)

Decomposes requirements through progressively detailed levels, following [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) on requirements engineering. BRS (why the business needs it) -> StRS (what stakeholders need) -> SyRS (how the system behaves) -> SRS (how the software works).

#### BRS (Business Requirements Specification)

Mission and goals, operational concept, business constraints, and traceability.

| | |
|---|---|
| **File extension** | `.brs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.3 |
| **When to use** | Business requirements need formalizing into ISO-structured specification |
| **Required sections** | Mission and Goals, Operational Concept, Business Constraints, Traceability |

#### StRS (Stakeholder Requirements Specification)

Per-stakeholder-class requirements with concept of operations and traceability.

| | |
|---|---|
| **File extension** | `.strs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.4 |
| **When to use** | Stakeholder requirements need structuring per class with ConOps |
| **Required sections** | Stakeholder Classes, ConOps, Stakeholder Requirements, Traceability |

#### SyRS (System Requirements Specification)

System boundary, system requirements, interfaces, and verification approach.

| | |
|---|---|
| **File extension** | `.syrs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.5 |
| **When to use** | The whole system boundary, interfaces, and verification need specifying |
| **Required sections** | System Boundary, System Requirements, System Interfaces, Verification Approach |

#### SRS (Software Requirements Specification)

Per-function and per-endpoint specifications with a verification matrix.

| | |
|---|---|
| **File extension** | `.srs.md` |
| **ISO reference** | [ISO/IEC/IEEE 29148:2018](https://www.iso.org/standard/72089.html) §9.6 |
| **When to use** | Detailed software requirements need per-function/per-endpoint specification |
| **Required sections** | Scope, Software Requirements, External Interfaces, Verification Matrix |

### Choosing the right requirements track

| Track | Documents | Best for |
|---|---|---|
| Product (`prd`) | `idea` -> `prd` -> `spec` -> `plan` | Individual features, small teams, rapid prototyping, internal tools |
| Sources (discovery) | `mrd` -> `brd` -> `urd` | Product teams doing discovery, stakeholder alignment, business analysis |
| ISO (decomposition) | `brs` -> `strs` -> `syrs` -> `srs` | Regulated systems, multi-team projects, complex distributed systems |

Default to the Product track; move to Sources or ISO only when the project demands it.

The Archcore plugin drives these tracks through [`/archcore:plan`](/plugin/skills/#archcoreplan). In the plugin, the Product track runs as the `sdd` track of `/archcore:plan`. Without the plugin, create the same documents through the MCP tools in the same order.

All three tracks can coexist. For example, use the Product track for a small feature while the full ISO track covers a safety-critical subsystem.

### Sources vs specifications

Sources and specifications have separate purposes:

- **Layer A (sources)**: `mrd`, `brd`, `urd`, and `prd` capture raw requirements from market, business, and user perspectives.
- **Layer B (specifications)**: `brs`, `strs`, `syrs`, and `srs` formalize what sources capture informally. The `implements` [relation](/concepts/relations/) connects the two layers.

Formalization runs one way: from source to specification, never the reverse.

PRD is a hybrid. It belongs to the sources layer, but it can substitute for the full ISO cascade. Link a PRD to ISO types with `related`, not `implements`.

:::tip[When types look similar]
The Sources and ISO tracks overlap in subject matter but differ in formality:
- **MRD vs PRD**: MRD analyzes the market (TAM/SAM/SOM, competitors, timing) without proposing a solution. PRD proposes a product with requirements and solution overview.
- **BRD vs PRD**: BRD focuses on business justification (ROI, budget, organizational impact). PRD focuses on product definition (features, user stories, solution).
- **URD vs PRD**: URD captures user needs via personas and journeys (discovery-oriented). PRD defines product requirements with acceptance criteria (specification-oriented).
- **BRS vs BRD**: BRS is an ISO specification (formalized structure). BRD is an informal source (business justification, ROI). BRS formalizes what BRD captures.
- **StRS vs URD**: StRS is an ISO specification (per-class requirements with ConOps). URD is an informal source (personas, journeys). StRS formalizes what URD captures.
- **SyRS vs SRS**: SyRS defines the whole system boundary. SRS specifies a single component's detailed behavior.
:::

---

## Knowledge

Decisions, standards, and reference material.

### ADR (Architecture Decision Record)

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

### RFC (Request for Comments)

Proposes a significant change for team review.

| | |
|---|---|
| **File extension** | `.rfc.md` |
| **When to use** | A significant change is being proposed |
| **Required sections** | Summary, Motivation, Detailed Design, Drawbacks, Alternatives |

### Rule

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

### Guide

Step-by-step instructions for completing a specific task.

| | |
|---|---|
| **File extension** | `.guide.md` |
| **When to use** | Step-by-step instructions need to be documented |
| **Required sections** | Prerequisites, Steps (numbered), Verification, Common Issues |

### Spec

A normative behavior contract for something others rely on: a boundary (API/interface/schema/protocol) or a feature/subsystem. You can capture a spec after the code exists or specify it ahead of the code. If the implementation diverges from the spec, the spec takes precedence.

A spec covers one subject and is not a general reference dump. Keep the body at or under 80 lines.

| | |
|---|---|
| **File extension** | `.spec.md` |
| **When to use** | A normative contract with behavior, constraints, and conformance criteria is being formalized |
| **Required sections** | Purpose & Scope, Surface, Normative Behavior, Constraints & Invariants, Failure Behavior, Conformance |

Write each Normative Behavior item as a numbered requirement in EARS clause order, with one uppercase BCP 14 keyword (MUST, SHOULD, or MAY, defined by RFC 2119 and RFC 8174) per requirement. EARS has four forms:

- Ubiquitous: `The <subject> MUST <response>.`
- Event-driven: `WHEN <trigger>, the <subject> MUST <response>.`
- State-driven: `WHILE <state>, the <subject> MUST <response>.`
- Unwanted behavior: `IF <condition>, THEN the <subject> MUST <response>.`

Failure Behavior items use the same notation, but each one takes the `IF ..., THEN ...` form, never `WHEN`.

```markdown
---
title: Webhook Delivery Contract
status: accepted
---

## Purpose & Scope
This specification is normative for webhook delivery — how the system pushes
event payloads to subscriber endpoints.

Depended on by: subscriber integrations and the delivery worker.

Out of scope: the webhook management API (registration, listing, deletion).

## Surface
What dependents see of the subject. Reference source definitions with @-notation —
don't copy interface or struct bodies; copies go stale.

- Delivery worker: @internal/webhooks/delivery.go — sends each event to subscribers
- Signature header: `X-Signature` carries the payload HMAC
- States: queued → delivering → delivered | failed

## Normative Behavior
1. The system MUST deliver payloads as JSON with Content-Type `application/json`.
2. WHEN a delivery fails, the system MUST retry up to 5 times with exponential backoff.
3. The system SHOULD include an HMAC-SHA256 signature in the `X-Signature` header.

## Constraints & Invariants
- Constraint: payloads MUST NOT exceed 256 KB — keeps delivery within the request timeout.
- Invariant: each event MUST be delivered at least once to every active subscriber.

## Failure Behavior
1. IF all retries are exhausted, THEN the system MUST mark the delivery `failed` and stop.
2. IF a subscriber endpoint times out, THEN the system MUST re-queue the delivery for retry.

## Conformance
An implementation conforms when it satisfies all MUST requirements, all
invariants, and all failure rules above.
```

:::note[Spec vs Doc vs Rule]
A **spec** defines a normative contract for a specific technical boundary: how a component *must* behave. A **doc** is non-behavioral reference material (registries, glossaries, lookup tables). A **rule** sets a cross-cutting team standard ("Always do X"). If you are documenting how one system works → `spec`. If you are describing what exists → `doc`. If you are prescribing how engineers must act → `rule`. If the document answers "what should we build and why" (user stories, priorities, success metrics) → `prd` or an ISO type, not a spec.
:::

### Doc

Non-behavioral reference material: registries, glossaries, lookup tables, and component lists.

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

Patterns learned from doing the work. You can ignore these types at first. They become useful once your team has enough practice to recognize repeatable patterns.

### Task type

A proven workflow for a recurring implementation task.

| | |
|---|---|
| **File extension** | `.task-type.md` |
| **When to use** | A proven workflow for a recurring task is documented |
| **Required sections** | What, When to Use, Steps, Example, Things to Watch Out For |

### CPAT (Code Pattern Change)

Records how and why a coding convention or pattern changed.

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
