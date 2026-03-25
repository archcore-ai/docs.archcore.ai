---
title: Document Relations
description: Link architecture decisions, rules, and plans with directed relations — implements, extends, depends_on, and related.
---

Relations are explicit links between documents. They tell agents how your project's knowledge connects — which plan implements which PRD, which rule came from which decision, which guide depends on which standard.

You can ignore relations at first. They become valuable as your `.archcore/` grows and documents start referencing each other.

## Relation Types

| Type | Use it when | Example |
|------|-------------|---------|
| `implements` | One document fulfills what another specifies | A plan implements a PRD |
| `extends` | One document builds on another | An RFC extends an existing ADR |
| `depends_on` | One document requires another to make sense | A plan depends on an ADR |
| `related` | General association | Two ADRs on the same topic |

Relations are **directed** — they have a source and a target. The direction carries meaning: "plan implements PRD" is different from "PRD implements plan".

## Creating Relations

### Via your agent (recommended)

```
You: "Link the auth plan to the auth PRD — the plan implements the PRD"
Agent: [calls add_relation tool]
```

The agent uses the `add_relation` MCP tool with source, target, and relation type.

### Via CLI

Relations are validated with `archcore validate`. Orphaned relations (pointing to documents that no longer exist) are flagged and can be auto-removed with `--fix`.

## Viewing Relations

When an agent reads a document via `get_document`, the response includes:
- **Outgoing relations** — where this document is the source
- **Incoming relations** — where this document is the target

This gives agents the full context of how a document connects to everything else.

## Common Patterns

### Decision flow

```
idea ──implements──→ prd
prd  ──implements──→ plan
plan ──depends_on──→ adr
adr  ──related─────→ rule
rule ──related─────→ guide
```

*"We had an idea, wrote requirements, planned the work, made decisions during implementation, derived rules from those decisions, and wrote guides to follow the rules."*

### RFC to ADR

```
rfc ──extends──→ adr   (RFC proposes changes to an existing decision)
adr ──related──→ rule  (ADR produces rules)
```

### Experience links

```
task-type ──depends_on──→ rule   (task follows these rules)
cpat      ──extends────→ rule    (pattern change updates a rule)
```

### Requirements track

```
mrd ──implements──→ brs   (market analysis formalized into business requirements)
urd ──implements──→ strs  (user needs formalized into stakeholder requirements)
strs ──implements──→ syrs (stakeholder requirements refined into system requirements)
syrs ──implements──→ srs  (system requirements refined into software requirements)
```

*"Requirements flow from informal sources to formal specifications. Each specification formalizes what the source captures informally."*

## Storage

Relations are stored in `.archcore/.sync-state.json` alongside sync metadata. This file is auto-managed — don't edit it manually. Use MCP tools (`add_relation`, `remove_relation`, `list_relations`) or the CLI to manage relations.
