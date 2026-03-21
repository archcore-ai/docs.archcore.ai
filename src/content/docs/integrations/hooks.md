---
title: Agent Session Hooks
description: Automatic session hooks that inject project context when AI coding agents start a conversation.
---

## Why Hooks Matter

Without hooks, your agent has MCP tools available but doesn't know what documents exist until it explicitly asks. With hooks, the agent receives a summary of your `.archcore/` directory the moment the session starts — before you type anything.

This means the agent can proactively reference your decisions, rules, and patterns from the first message instead of you having to ask it to check.

Hooks are optional. MCP tools work without them. But hooks make the experience significantly smoother.

## How Hooks Work

1. Agent starts a session (e.g., you open Claude Code)
2. Agent triggers its `SessionStart` event
3. The hook runs `archcore hooks <agent-id> session-start`
4. Archcore outputs a list of available documents with their types and titles
5. Agent receives this context alongside the conversation

## Installation

### Automatic

```bash
archcore init
```

Hooks are installed automatically during `archcore init` for all detected agents that support them.

### Manual

```bash
archcore hooks install
```

Or for a specific agent:

```bash
archcore hooks install --agent claude-code
```

## Supported Agents

| Agent | Hook Support | Config Location |
|-------|-------------|-----------------|
| Claude Code | Yes | `.claude/settings.json` |
| Cursor | Yes | Cursor hooks config |
| Gemini CLI | Yes | Gemini CLI config |
| GitHub Copilot | Yes | VS Code/Copilot config |

## Hook Configuration Example

For Claude Code, the hook is added to `.claude/settings.json`:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "archcore hooks claude-code session-start"
          }
        ]
      }
    ]
  }
}
```

## When You Don't Need Hooks

Hooks are optional in these cases:

- **You always start by asking about context** — if your workflow is to ask the agent "what documents exist?" at the start, hooks don't add much
- **Your agent doesn't support hooks** — OpenCode, Codex CLI, Roo Code, and Cline don't have hook support yet; MCP tools still work fine
- **You prefer explicit control** — some users prefer to decide when the agent loads context

## Agent-Specific Commands

Each agent has its own hook subcommand. These are called by the agent automatically — you don't need to run them manually:

```bash
archcore hooks claude-code session-start
archcore hooks cursor <event>
archcore hooks gemini-cli <event>
archcore hooks copilot <event>
```
