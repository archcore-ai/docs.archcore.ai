---
title: Agent Session Hooks
description: Automatic session hooks that inject project context when AI coding agents start a conversation. Supported for Claude Code, Cursor, and more.
---

Hooks let Archcore run commands automatically when an agent starts a session. This provides the agent with context about your `.archcore/` directory before the conversation begins.

## How Hooks Work

1. Agent starts a session (e.g., you open Claude Code)
2. Agent triggers its `SessionStart` event
3. The hook runs `archcore hooks <agent-id> session-start`
4. Archcore outputs context about available documents
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

| Agent | Hook Location |
|-------|--------------|
| Claude Code | `.claude/settings.json` |
| Cursor | Cursor hooks config |
| Gemini CLI | Gemini CLI config |
| GitHub Copilot | VS Code/Copilot config |

## Hook Configuration

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

## Agent-Specific Commands

Each agent has its own hook subcommand:

```bash
archcore hooks claude-code session-start
archcore hooks cursor <event>
archcore hooks gemini-cli <event>
archcore hooks copilot <event>
```

These commands are called by the agent — you don't need to run them manually.
