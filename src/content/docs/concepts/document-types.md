---
title: Document Types
description: All 10 document types — ADRs, RFCs, rules, guides, PRDs, plans, and more. When to use each, required sections, and templates.
---

Archcore has 10 document types organized into 3 layers. Each type has a template with required sections that the CLI generates automatically.

## Choosing the Right Type

```
Need to record a final decision?           → adr
Need to propose a change for review?       → rfc
Need to enforce a team standard?           → rule
Need step-by-step instructions?            → guide
Need reference/lookup material?            → doc
Need to define product requirements?       → prd
Need to capture an early idea?             → idea
Need to plan implementation tasks?         → plan
Need to document a repeatable workflow?    → task-type
Need to record a coding pattern change?    → cpat
```

:::tip[Let agents choose]
When working with an AI agent, just describe what you want to document. The agent will pick the right type based on these rules — they're embedded in the MCP server instructions.
:::

---

## Vision

Where the product and project are heading.

### PRD — Product Requirements Document

Product requirements with goals, scope, and acceptance criteria.

| | |
|---|---|
| **File extension** | `.prd.md` |
| **When to use** | Product requirements with goals and acceptance criteria are defined |
| **Required sections** | Vision, Problem Statement, Goals & Success Metrics, Requirements |

### Idea — Concept to Explore

A product or technical concept that needs capturing before it's fully formed.

| | |
|---|---|
| **File extension** | `.idea.md` |
| **When to use** | A concept needs capturing for future evaluation |
| **Required sections** | Idea, Value, Possible Implementation, Risks & Constraints |

### Plan — Implementation Plan

An actionable plan with phased tasks and acceptance criteria.

| | |
|---|---|
| **File extension** | `.plan.md` |
| **When to use** | An implementation plan with tasks is formed |
| **Required sections** | Goal, Tasks (phased), Acceptance Criteria, Dependencies |

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

### Doc — Reference Documentation

Descriptive reference material — tables, registries, explanations.

| | |
|---|---|
| **File extension** | `.doc.md` |
| **When to use** | Reference information, registries, or lookup tables need documenting |
| **Required sections** | Overview, Content sections, Examples |

:::note[Rule vs Doc]
A **rule** contains imperative statements ("Always do X", "Never do Y") with enforcement info. A **doc** is descriptive reference material. If it prescribes behavior, use `rule`. If it describes what exists, use `doc`.
:::

---

## Experience

Patterns learned from doing the work. You can ignore these types at first — they become useful once your team has accumulated enough practice to recognize repeatable patterns.

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
