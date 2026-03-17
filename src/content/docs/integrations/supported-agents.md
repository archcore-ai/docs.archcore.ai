---
title: Supported AI Coding Agents
description: AI coding agents that work with Archcore — Claude Code, Cursor, GitHub Copilot, Gemini CLI, and more. Auto-detection, MCP config, and setup for each.
---

Archcore supports 8 coding agents out of the box. Each agent gets MCP server configuration and (where supported) session hooks installed automatically during `archcore init`.

## Agent Registry

| Agent | ID | MCP Config | Hooks |
|-------|-----|-----------|-------|
| Claude Code | `claude-code` | `.mcp.json` | `.claude/settings.json` |
| Cursor | `cursor` | `.cursor/rules/mcp.json` | Cursor hooks config |
| GitHub Copilot | `copilot` | `.vscode/settings.json` | VS Code config |
| Gemini CLI | `gemini-cli` | `~/.gemini-cli/mcp.json` | Gemini CLI config |
| OpenCode | `opencode` | `opencode.json` | — |
| Codex CLI | `codex-cli` | `~/.codex-cli/mcp.json` | — |
| Roo Code | `roo-code` | `.roo/mcp.json` | — |
| Cline | `cline` | `.cline/mcp.json` | — |

## Auto-Detection

`archcore init` detects agents by looking for their configuration directories:

| Agent | Detected by |
|-------|------------|
| Claude Code | `.claude/` directory |
| Cursor | `.cursor/` directory |
| Copilot | `.vscode/extensions/` with GitHub Copilot |
| Gemini CLI | `.codex/` directory |
| OpenCode | `opencode.json` file |
| Codex CLI | `.codex-cli/` directory |
| Roo Code | `.roo/` directory |
| Cline | `.cline/` directory |

If no agents are detected, Archcore falls back to configuring Claude Code.

## MCP Config Format

Most agents use the standard `mcpServers` format:

```json
{
  "mcpServers": {
    "archcore": {
      "command": "archcore",
      "args": ["mcp"]
    }
  }
}
```

GitHub Copilot uses VS Code's server format:

```json
{
  "servers": {
    "archcore": {
      "type": "stdio",
      "command": "archcore",
      "args": ["mcp"]
    }
  }
}
```

## Manual Installation

Install MCP for a specific agent:

```bash
archcore mcp install --agent cursor
```

Install hooks for a specific agent:

```bash
archcore hooks install --agent claude-code
```

## Hooks

Hooks run automatically when an agent starts a session. Currently supported for Claude Code, Cursor, Gemini CLI, and Copilot.

The hook triggers `archcore hooks <agent-id> session-start`, which provides the agent with initial context about the `.archcore/` directory.

See [Hooks](/integrations/hooks/) for details.
