---
title: Keep Coding Rules Reusable
description: Define team coding standards once in Archcore and have every AI agent follow them automatically.
---

Your team has coding standards — error formats, naming conventions, test patterns, commit message rules. Without Archcore, you repeat these in every `CLAUDE.md`, `.cursorrules`, and agent prompt. When a standard changes, you update multiple files across multiple tools.

## Write Once, All Agents Follow

Create a rule document in Archcore, and every agent picks it up through MCP — regardless of which tool your teammates use.

```markdown
---
title: API Error Response Format
status: accepted
---

## Rule

1. ALL API errors MUST return JSON with `code`, `message`, and `request_id`
2. Error codes MUST use UPPER_SNAKE_CASE
3. HTTP status codes MUST match error semantics

## Rationale

Consistent error format enables clients to handle errors programmatically
and simplifies debugging across services.

## Examples

### Good

{ "code": "USER_NOT_FOUND", "message": "No user with ID 42", "request_id": "req_abc123" }

### Bad

{ "error": "not found" }

## Enforcement

Apply to all handlers in @src/api/. Verify in integration tests.
```

When an agent generates API error handling code, it reads this rule and follows the format. Every agent, every session, same standard.

## Rules Have Structure

Unlike free-text instruction files, rule documents have required sections:

- **Rule statements** — imperative, unambiguous requirements
- **Rationale** — why the rule exists (agents use this to apply it in edge cases)
- **Good/Bad examples** — concrete patterns to follow and avoid
- **Enforcement** — where and how the rule applies

This structure gives agents enough context to apply rules correctly, not just literally.

## Link Rules to Decisions

A rule often originates from an architectural decision. Make the connection explicit:

```
use-postgres.adr.md ── related ──→ migration-format.rule.md
```

When an agent reads the rule, it sees the linked ADR and understands the full context behind the standard.

## See Also

- [Document Types](/concepts/document-types/) — rule format and required sections
- [Capture Architecture Decisions](/use-cases/architecture-decisions/) — where rules come from
- [Build Shared Project Memory](/use-cases/shared-project-memory/) — rules as part of the bigger picture
