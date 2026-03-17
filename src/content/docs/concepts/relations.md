---
title: Document Relations
description: Link architecture decisions, rules, and plans with directed relations — implements, extends, depends_on, and related.
---

Documents can be linked with directed relations that express how they connect. Relations are stored in `.archcore/.sync-state.json` and managed through the CLI or MCP tools.

## Relation Types

| Type | Meaning | Example |
|------|---------|---------|
| `related` | General association | Two ADRs on the same topic |
| `implements` | Source implements what target specifies | A plan implements a PRD |
| `extends` | Source builds upon target | An RFC extends an existing ADR |
| `depends_on` | Source requires target to proceed | A plan depends on an ADR |

Relations are **directed** — they have a source and a target. The direction matters for semantic meaning.

## Creating Relations

### Via MCP (AI agent)

```
User: "Link the auth plan to the auth PRD — the plan implements the PRD"
Agent: [calls add_relation tool]
```

The agent uses the `add_relation` MCP tool with:
- `source`: the plan's path
- `target`: the PRD's path
- `type`: `implements`

### Via CLI

Relations are validated with `archcore validate`. Orphaned relations (pointing to documents that no longer exist) are flagged and can be auto-removed with `--fix`.

## Viewing Relations

When an agent reads a document via `get_document`, the response includes both:
- **Outgoing relations** — relations where this document is the source
- **Incoming relations** — relations where this document is the target

This gives agents a complete picture of how documents connect.

## Common Patterns

### Decision Flow

```
idea ──implements──→ prd
prd  ──implements──→ plan
plan ──depends_on──→ adr
adr  ──related─────→ rule
rule ──related─────→ guide
```

### RFC to ADR

```
rfc ──extends──→ adr   (RFC proposes changes to an existing decision)
adr ──related──→ rule  (ADR produces rules)
```

### Experience Links

```
task-type ──depends_on──→ rule   (task follows these rules)
cpat      ──extends────→ rule    (pattern change updates a rule)
```

## Storage

Relations are stored in `.archcore/.sync-state.json` alongside sync metadata. This file is auto-managed — don't edit it manually. Use MCP tools (`add_relation`, `remove_relation`, `list_relations`) or the CLI to manage relations.
