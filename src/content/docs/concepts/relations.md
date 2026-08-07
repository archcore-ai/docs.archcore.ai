---
title: Document Relations
description: Archcore has four directed relation types. Use implements, extends, depends_on, and related to link documents.
---

Relations are explicit links between documents. They tell agents how your project's knowledge connects: which plan implements which PRD, which rule came from which decision, which guide depends on which standard.

You can ignore relations at first. They become valuable as your `.archcore/` grows and documents start referencing each other.

## Relation types

| Type | Use it when | Example |
|------|-------------|---------|
| `implements` | One document fulfills what another specifies | A plan implements a PRD |
| `extends` | One document builds on another | An RFC extends an existing ADR |
| `depends_on` | One document requires another to make sense | A plan depends on an ADR |
| `related` | General association | Two ADRs on the same topic |

Relations are **directed**. Each relation has a source and a target, and the direction carries meaning: "plan implements PRD" is not the same as "PRD implements plan".

## Creating relations

### Via your agent (recommended)

```
You: "Link the auth plan to the auth PRD — the plan implements the PRD"
Agent: [calls add_relation tool]
```

The agent uses the `add_relation` MCP tool with source, target, and relation type.

### Via CLI

`archcore status` validates relations. It flags orphaned relations, which point to documents that no longer exist, and `archcore doctor --fix` removes them.

## Viewing relations

When an agent reads a document via `get_document`, the response includes:

- Outgoing relations, where this document is the source
- Incoming relations, where this document is the target

The agent sees how a document connects in both directions.

## Common patterns

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

Archcore stores relations in `.archcore/.sync-state.json` alongside sync metadata. It manages this file automatically, so do not edit it by hand. Change relations through the MCP tools (`add_relation`, `remove_relation`, `list_relations`) or the CLI.

## Next steps

- [Document Types](/concepts/document-types/) lists the 19 types you can link.
- [MCP Tools](/reference/mcp-tools/) documents the arguments `add_relation`, `remove_relation`, and `list_relations` take.
- [How Archcore Works](/concepts/how-it-works/) shows where relations sit in the three context layers.
