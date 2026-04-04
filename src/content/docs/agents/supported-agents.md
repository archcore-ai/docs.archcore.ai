---
title: Supported AI Coding Agents
description: AI coding agents that work with Archcore — Claude Code, Cursor, GitHub Copilot, Gemini CLI, and more. Support status, features, and setup guides.
---

Archcore supports 8 coding agents out of the box. Each agent gets MCP server configuration and (where supported) session hooks installed automatically during `archcore init`.

## Support Matrix

| Agent          | MCP    | Hooks |
| -------------- | ------ | ----- |
| Claude Code    | Yes    | Yes   |
| Cursor         | Yes    | Yes   |
| GitHub Copilot | Yes    | Yes   |
| Gemini CLI     | Yes    | Yes   |
| OpenCode       | Yes    | —     |
| Codex CLI      | Yes    | —     |
| Roo Code       | Yes    | —     |
| Cline          | Manual | —     |

**MCP** = agent can list, read, create, update documents through Archcore tools.
**Hooks** = agent receives document context automatically at session start.

## Auto-Detection

`archcore init` detects agents by looking for their configuration directories:

| Agent          | Detected by                                    |
| -------------- | ---------------------------------------------- |
| Claude Code    | `.claude/` directory                           |
| Cursor         | `.cursor/` directory                           |
| GitHub Copilot | `.github/copilot-instructions.md` file         |
| Gemini CLI     | `.gemini/` directory                           |
| OpenCode       | `opencode.json` file or `.opencode/` directory |
| Codex CLI      | `.codex/` directory                            |
| Roo Code       | `.roo/` directory                              |
| Cline          | `.clinerules/` directory                       |

If no agents are detected, Archcore falls back to configuring Claude Code.

## MCP Config Locations

| Agent          | ID            | Config File                    |
| -------------- | ------------- | ------------------------------ |
| Claude Code    | `claude-code` | `.mcp.json`                    |
| Cursor         | `cursor`      | `.cursor/mcp.json`             |
| GitHub Copilot | `copilot`     | `.vscode/mcp.json`             |
| Gemini CLI     | `gemini-cli`  | `.gemini/settings.json`        |
| OpenCode       | `opencode`    | `opencode.json`                |
| Codex CLI      | `codex-cli`   | `.codex/config.toml`           |
| Roo Code       | `roo-code`    | `.roo/mcp.json`                |
| Cline          | `cline`       | VS Code globalStorage (manual) |

## Manual Installation

Install MCP for a specific agent:

```bash
archcore mcp install --agent cursor
```

Install hooks for a specific agent:

```bash
archcore hooks install --agent claude-code
```

## Best Experience

For the best experience, use an agent that supports both MCP and hooks. Claude Code, Cursor, GitHub Copilot, and Gemini CLI currently offer the most complete integration — agents receive context at session start and have full document management tools available.

Agents without hook support (OpenCode, Codex CLI, Roo Code, Cline) still work well through MCP tools. The main difference is that you'll need to explicitly ask the agent to check for documents rather than having context injected automatically.
