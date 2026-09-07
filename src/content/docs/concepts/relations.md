---
title: Document Relations
description: Archcore has seven directed relation types on three axes, from implements and depends_on to supports and supersedes.
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
| `supports` | One material backs a statement in another document | An evidence supports a research |
| `contradicts` | One document disputes a statement in another | An evidence contradicts a research |
| `supersedes` | A newer document replaces an older one | A newer evidence supersedes an older evidence |

Relations are **directed**. Each relation has a source and a target, and the direction carries meaning: "plan implements PRD" is not the same as "PRD implements plan".

### Three axes

The seven types fall on three axes. The axis tells you what kind of claim the edge makes.

| Axis | Types | The edge says |
|------|-------|---------------|
| Structural | `implements`, `extends`, `depends_on`, `related` | How documents are built from one another |
| Evidential | `supports`, `contradicts` | Whether a material backs or disputes a statement |
| Temporal | `supersedes` | Which document replaced which |

The direction of each evidential and temporal edge is fixed:

- `supports` points from the material to the statement it backs.
- `contradicts` points from the challenger to the statement it disputes. A reviewer reads the edge in both directions; the stored direction records who challenged whom.
- `supersedes` points from the newer document to the older one it replaces.

No relation type is bound to a document category. Which pair of types takes which edge is a convention, not a check the Archcore CLI enforces. The CLI accepts the three evidential and temporal types from version 0.8.3. An older CLI rejects a manifest that contains them, so every reader of a shared repository needs 0.8.3 or later before the first `supports`, `contradicts`, or `supersedes` edge lands.

## Creating relations

The MCP tool `add_relation` is the only way to create a relation. No CLI command creates relations, and Archcore never creates them automatically.

### Via your agent

```
You: "Link the auth plan to the auth PRD — the plan implements the PRD"
Agent: [calls add_relation tool]
```

The agent uses the `add_relation` MCP tool with source, target, and relation type.

### Linking new documents

`create_document` does not link the new document to anything. When other documents share its directory, the response includes a `nearby_documents` hint: up to 5 paths from the same directory, sorted alphabetically. The agent reviews each candidate and calls `add_relation` explicitly when a semantic link exists.

A document created without a follow-up `add_relation` call stays unlinked. `archcore doctor` surfaces orphaned documents.

### Validating relations with the CLI

`archcore status` flags orphaned relations, which point to documents that no longer exist, and `archcore doctor --fix` removes them.

## Viewing relations

When an agent reads a document via `get_document`, the response includes:

- Outgoing relations, where this document is the source
- Incoming relations, where this document is the target

The agent sees how a document connects in both directions.

## Common patterns

### Decision flow

```
prd  ──implements──→ idea
plan ──implements──→ prd
plan ──depends_on──→ adr
adr  ──related─────→ rule
rule ──related─────→ guide
```

*"We had an idea, wrote requirements, planned the work, made decisions during implementation, derived rules from those decisions, and wrote guides to follow the rules."*

The more specific document is the `implements` source, and the more general document is the target: the PRD implements the idea, and the plan implements the PRD.

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

### Research links

```
rnd      ──depends_on───→ research  (decision-bound investigation draws on the territory map)
evidence ──supports─────→ research  (material backs a finding)
evidence ──contradicts──→ research  (material disputes a finding)
evidence ──supersedes───→ evidence  (newer report replaces the older one)
adr      ──contradicts──→ adr       (two accepted decisions conflict)
adr      ──supersedes───→ adr       (a newer decision replaces an older one)
```

A `research` is never the source of `implements` or `extends`. `rnd depends_on research` is the link from a decision-bound investigation to the territory it draws on.

A `contradicts` edge stays until the body of the disputed document carries one line that names both materials and states the resolution. A reader treats an edge without such a line as unresolved. The CLI stores the edge and does not resolve the contradiction.

A superseded document shows its replacement only through its incoming relations. The CLI adds no annotation to tool responses for it.

### Requirements track

```
brs  ──implements──→ mrd  (business requirements spec formalizes the market analysis)
strs ──implements──→ urd  (stakeholder requirements spec formalizes the user needs)
syrs ──implements──→ strs (system requirements spec decomposes the stakeholder spec)
srs  ──implements──→ syrs (software requirements spec decomposes the system spec)
```

*"Requirements flow from informal sources to formal specifications. Each specification formalizes what the source captures informally."*

Three conventions govern the [requirements layers](/concepts/document-types/):

- Same-layer documents link with `related`, not `implements`. An `mrd` and a `brd` are peers, so `mrd related brd`.
- A `prd` links to an ISO type with `related`, because the PRD is an alternative path.
- Partial cascades are valid. A project that skips the StRS and SyRS levels links `srs implements brs` directly.

## Storage

Archcore stores relations in `.archcore/.sync-state.json` alongside sync metadata. The file is tracked in git, so relations are shared with the team automatically. Archcore manages the file itself; do not edit it by hand. Change relations through the MCP tools `add_relation`, `remove_relation`, and `list_relations`.

## Next steps

- [Document Types](/concepts/document-types/) lists the 21 types you can link.
- [MCP Tools](/reference/mcp-tools/) documents the arguments `add_relation`, `remove_relation`, and `list_relations` take.
- [How Archcore Works](/concepts/how-it-works/) shows where relations sit in the three virtual categories.
