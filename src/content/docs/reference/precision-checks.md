---
title: Precision Checks
description: "Every post-write precision check: what fires it, which document types it grades, and the threshold behind it."
---

Precision checks measure a document against its type contract after `create_document` or `update_document` writes it. They run inside the `PostToolUse` hook, they report as text in front of the agent, and they never block a write. The [hooks reference](/cli/hooks/#after-a-write) covers the event that carries them.

One report prints at most **5 findings**, followed by a count of what the cap dropped. Findings arrive in a fixed order, so the same document produces the same head of the list on every write.

```text
[Archcore Precision] .archcore/auth/jwt-strategy.adr.md (advisory):
  - vague wording (robust) — replace with a concrete fact, version, threshold, or measurement
  - missing section: ## Alternatives Considered
  - one alternative recorded — a decision with nothing to compare against records a preference, not a choice
  - +2 more finding(s) not shown (report cap 5)
```

The rules are data, not code. `templates/precision.go` in the CLI repository holds the lexicons, the section contracts, and the thresholds; `internal/advisory/precision.go` and `internal/advisory/restatement.go` read them. A project that installs no plugin gets the same checks, because they ship with the binary.

## Prose profiles

Every document type carries one of two profiles. The profile decides which checks may report on the type, so an `adr` is never measured by a step's word cap and a `guide` is never graded for a modal it does not owe.

| Profile | Meaning | Types |
| ------- | ------- | ----- |
| STE | Lines instruct or obligate | `spec`, `rule`, `guide`, `task-type`, `brs`, `strs`, `syrs`, `srs` |
| ISO | Lines argue or describe | `adr`, `rfc`, `doc`, `prd`, `plan`, `idea`, `rnd`, `cpat`, `mrd`, `brd`, `urd` |

Two further tables decide which numbered items a check may read at all.

| Table | Types and sections | What the items are |
| ----- | ------------------ | ------------------ |
| Graded clauses | `spec`: Normative Behavior, Failure Behavior. `rule`: Rule | Requirements graded with a BCP 14 modal |
| Procedure steps | `guide`: Steps. `task-type`: Steps. `plan`: Tasks | Actions the reader takes |

A numbered item outside these sections is prose. An `adr` enumerates its alternatives without owing them a modal, and the four ISO 29148 types carry their requirements as identified table rows rather than numbered clauses, so neither is graded as a clause.

## Checks that run on every type

| Finding | Fires when |
| ------- | ---------- |
| Vague wording | The body uses a word or phrase from the vagueness lexicon. Headings are excluded. Up to 5 offenders are named |
| Missing section | A required `##` section for the type is absent. See [Checked sections](#checked-sections) |
| Foreign section | The body carries a heading whose content another type owns. See [Content ownership](#content-ownership) |
| Frontmatter | `title` is missing or empty, or `status` is missing or invalid |
| Placeholder body | The body is under 200 characters, counted in characters so a short non-ASCII document is flagged the same way |
| Cross-document links | The body links other `.archcore/` documents instead of using `add_relation`. Up to 3 are named |
| Long code block | A code block of 5 or more lines in a type that argues rather than instructs: `adr`, `rfc`, `doc`, and every vision type except `rnd`. A `rule`, a `guide`, and a `cpat` are exempt, because the literal text is the artifact |
| Restatement | A statement survived a move from a linked document nearly word for word. See [Restatement](#restatement) |

The vagueness lexicon covers English (`appropriate`, `robust`, `scalable`, `modern`, `various`, `optimal`, `efficient`, `flexible`, `convenient`, `seamless`, `streamlined`), Russian stems (`оптимальн`, `удобн`, `правильн`, `надёжн`, `надежн`, `гибк`, `современн`, `передов`, `эффективн`, `масштабируем`), and the phrases `best practices`, `as needed`, `world class`, and `cutting edge`.

## Checks driven by the profile tables

These read the graded clauses and the procedure steps of the type, so a type outside both tables never receives them.

| Finding | Fires when |
| ------- | ---------- |
| Requirement over 25 words | A graded clause runs past the word cap |
| Step over 20 words | A procedure step runs past the word cap |
| Compound requirement | A graded clause carries two modals. `MUST NOT` counts once |
| Condition after the obligation | A graded clause states its trigger after the response instead of opening with `WHEN`, `WHILE`, or `IF` |
| Open-ended list | A clause or step ends with `etc.`, `and so on`, `и т.д.`, or `и т.п.` |
| Ambiguous alternative | A clause or step uses `and/or` or `и/или` |
| BCP 14 modal in a step | A procedure step carries `MUST`, `SHOULD`, `SHALL`, or `MAY` |
| BCP 14 modal in a claim | A numbered item of an ISO-profile type carries a modal. The graded behavior belongs in a linked `spec` or `rule` |

Modals are matched case-sensitively. A lowercase `must` in prose is not a graded obligation and is not reported.

## Checks for one type

| Type | Finding | Fires when |
| ---- | ------- | ---------- |
| `spec` | SHALL notation | The body uses `SHALL` instead of `MUST`, `SHOULD`, or `MAY` |
| `spec` | Oversized spec | The body exceeds 80 lines |
| `spec` | Subjectless passive | A graded clause states an obligation with no obligated component as its subject. Up to 3 are named |
| `prd` | EARS clause in a requirement | A numbered requirement opens with `WHEN`, `WHILE`, or `IF`. A `prd` requirement states an outcome, and the trigger and response form belongs in a `spec` |
| `rule` | No file target | No graded clause names a path or a glob, so the [code-alignment injection](/cli/hooks/#code-alignment-injection) can never match the rule to an edited file |
| `rule` | Enforcement names no verifier | The Enforcement section names no hook, lint rule, CI step, or test, and does not say `manual review` |
| `adr` | Bullets in Context | The Context section uses a bullet list. Fenced blocks are excluded |
| `adr` | One alternative recorded | Alternatives Considered holds a single item |
| `adr` | Alternative with no stated reason | An alternative does not say what ruled it out. Up to 5 are named |
| `cpat` | Before or After holds no code block | The section describes the form that changed instead of showing it |

## Thresholds

| Threshold | Value |
| --------- | ----- |
| Findings per report | 5 |
| Minimum body length | 200 characters |
| Graded clause length | 25 words |
| Procedure step length | 20 words |
| `spec` body length | 80 lines |
| Code block length in an ISO-profile type | 5 lines |
| Restatement overlap | 0.85 |
| Documents read per restatement check | 5 |

## Checked sections

The missing-section check reads this table. It is narrower than the generated template: a template offers sections the author may fill, and this table lists the ones the type owes its reader.

A heading matches by prefix, followed by whitespace or the end of the line. `## Purpose & Scope` therefore satisfies `Purpose`, and `## Purposeful` does not.

| Type | Checked sections |
| ---- | ---------------- |
| `adr` | Context, Decision, Alternatives Considered, Consequences |
| `rfc` | Summary, Motivation, Detailed Design, Drawbacks, Alternatives |
| `rule` | Rule, Rationale, Enforcement |
| `guide` | Prerequisites, Steps, Verification |
| `spec` | Purpose, Surface, Normative Behavior, Conformance |
| `doc` | Overview |
| `prd` | Vision, Problem, Goals, Requirements |
| `idea` | Idea, Value, Risks and Constraints |
| `rnd` | Approach, Findings, Recommendation, Next Action |
| `plan` | Goal, Tasks, Acceptance Criteria |
| `mrd` | Market Landscape, Competitive Analysis, Market Needs |
| `brd` | Business Objectives, Stakeholders, Success Metrics and ROI |
| `urd` | User Personas, User Requirements, Acceptance Criteria |
| `brs` | Business Purpose and Scope, Mission, Goals and Objectives, Business Constraints, Success Criteria |
| `strs` | Purpose and Scope, Stakeholder Classes, Stakeholder Requirements, Operational Concept |
| `syrs` | System Purpose and Scope, System Requirements, System Interfaces, Verification Approach |
| `srs` | Purpose and Scope, Software Requirements, External Interfaces, Verification Matrix |
| `task-type` | When to Use, Steps |
| `cpat` | Why, Before, After, Scope |

Several sections accept an older spelling so a rename does not turn existing documents into findings. `Alternatives` satisfies Alternatives Considered, `Procedure` satisfies Steps, `Contract Surface` satisfies Surface, `Rationale` satisfies a `cpat`'s Why, `ConOps` satisfies Operational Concept, and `Verification` satisfies both Verification Approach and Verification Matrix.

## Content ownership

Each kind of content has one owning document type and one section inside it. A track produces several documents on one topic and links them with `implements`, so the boundary decides which document a statement belongs in.

| Content kind | Owner | Section |
| ------------ | ----- | ------- |
| Wanted outcome, beneficiary, threshold | `prd` | Requirements |
| Measured goal with units and a target value | `prd` | Goals and Success Metrics |
| Graded behavior: EARS clauses, BCP 14 modals | `spec` | Normative Behavior |
| Interfaces, signatures, states, field-driven rules | `spec` | Surface |
| Error, edge, and degradation handling | `spec` | Failure Behavior |
| Phases, tasks, milestones, delivery dates | `plan` | Tasks |
| Rejected alternative and the reason it was rejected | `adr` | Alternatives Considered |

The foreign-section check names a heading whose content another type owns, and names that type:

```text
section ## Normative Behavior in a prd — a spec owns that content; link the two documents instead
```

Four types carry an ownership table:

| Type | Headings it must not carry | Owner |
| ---- | -------------------------- | ----- |
| `prd` | Surface, Normative Behavior, Failure Behavior, Conformance, Solution Overview, Technical Considerations | `spec` |
| `prd` | Tasks, Timeline, Milestones, Phases, Acceptance Criteria | `plan` |
| `prd` | Alternatives Considered | `adr` |
| `mrd`, `brd`, `urd` | Mission, Goals and Objectives | `brs` |
| `mrd`, `brd`, `urd` | Operational Concept, Stakeholder Requirements | `strs` |
| `mrd`, `brd`, `urd` | System Requirements, Verification Approach | `syrs` |
| `mrd`, `brd`, `urd` | Software Requirements, Verification Matrix | `srs` |

Only unambiguous headings carry an owner. A `prd` names a business constraint inside its Problem Statement without owing the reader a Constraints section, so Constraints is deliberately absent and produces no finding.

## Restatement

The restatement check compares the written document against the documents its content flows from or into, and names a statement that survived the move nearly word for word.

- **Which documents it reads.** Neighbours across `implements` and `extends`, in both directions, sorted then capped at 5. `related` and `depends_on` are excluded: an association implies no content flow, and a dependency orders two documents without moving text between them.
- **What it compares.** List items only, at least 6 content-carrying words long. Prose paragraphs and fenced blocks are skipped, because a paragraph restates by summarizing and this comparison would report those at random.
- **What counts as a restatement.** Token overlap at or above 0.85. A copied line scores 1.0; a `prd` requirement and the `spec` behavior that grades it score well under the threshold.
- **What it reports.** At most 3 findings, one per statement however many neighbours carry it.

The check is deliberately restricted to near-verbatim copies. Two documents on one topic share vocabulary, and paraphrase detection would report exactly the pairs that are meant to differ.

If the sync manifest cannot be loaded, the check returns nothing rather than guessing. A missed finding costs a glance; a wrong one costs trust in the report.

## Next steps

- [Hooks](/cli/hooks/) covers the `PostToolUse` event these checks run in, alongside structure validation and the relation cascade notice.
- [Document types](/concepts/document-types/) describes each type, its template, and the track it belongs to.
- [Document format](/reference/document-format/) covers frontmatter fields and file naming.
