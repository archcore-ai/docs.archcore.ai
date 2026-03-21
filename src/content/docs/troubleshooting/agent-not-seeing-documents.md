---
title: Agent Cannot See Documents
description: Troubleshoot when your AI coding agent can't find or read Archcore documents.
---

Your agent says it can't find any documents, or it doesn't seem to know about Archcore at all. Here are the most common causes and how to fix each one.

## MCP not configured

The agent needs an MCP server configuration to connect to Archcore. Without it, the agent has no way to discover or read your documents.

**Check:** Look for the MCP config file for your agent:

| Agent | Config file |
|-------|------------|
| Claude Code | `.mcp.json` |
| Cursor | `.cursor/rules/mcp.json` |
| GitHub Copilot | `.vscode/settings.json` |
| Gemini CLI | `~/.gemini-cli/mcp.json` |
| OpenCode | `opencode.json` |
| Codex CLI | `~/.codex-cli/mcp.json` |
| Roo Code | `.roo/mcp.json` |
| Cline | `.cline/mcp.json` |

**Fix:** Run the setup command:

```bash
archcore mcp install
```

Or re-run full initialization, which also installs hooks:

```bash
archcore init
```

Both commands auto-detect your agents and write the correct config files. See [Supported Agents](/integrations/supported-agents/) for the full agent registry.

## Archcore not in PATH

The MCP server runs as a subprocess — your agent executes `archcore mcp` behind the scenes. If the `archcore` binary isn't in your shell PATH, the agent can't launch it.

**Check:**

```bash
which archcore
```

If this returns nothing, the binary isn't in your PATH.

**Fix:** Add the directory containing `archcore` to your PATH. The exact location depends on how you installed it. If you used the install script, the binary is typically at `~/.local/bin/archcore` or `/usr/local/bin/archcore`.

After updating your PATH, verify:

```bash
archcore --version
```

## Wrong working directory

The MCP server looks for `.archcore/` relative to the current project root. If you opened your editor in a parent directory, a subdirectory, or a different project entirely, the server won't find your documents.

**Check:**

```bash
ls .archcore/
```

If this shows "No such file or directory," you're not in the right project root.

**Fix:** Open your editor or terminal in the directory that contains `.archcore/`. For multi-root workspaces, make sure the project with `.archcore/` is the active workspace root.

## Hooks not installed

Without session hooks, the agent doesn't receive context about Archcore when a conversation starts. The agent can still use MCP tools if configured, but it won't proactively check for documents — it only discovers them if it happens to call the MCP tools.

**Check:** For Claude Code, look for the hook in `.claude/settings.json`:

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

**Fix:**

```bash
archcore hooks install
```

This installs hooks for all detected agents. See [Hooks](/integrations/hooks/) for agent-specific details.

## Agent doesn't support MCP

Some agents or agent modes don't support the Model Context Protocol. If your agent isn't in the [supported agents list](/integrations/supported-agents/), it can't connect to the Archcore MCP server.

**Supported agents:** Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenCode, Codex CLI, Roo Code, Cline.

If your agent isn't listed, you can still use Archcore documents manually — they're standard Markdown files in `.archcore/` that any tool can read.

## Documents exist but agent says none found

The agent connects to MCP successfully but reports zero documents. This usually means your documents have validation errors and are being skipped.

**Check:**

```bash
archcore validate
```

This reports any issues with file naming, frontmatter, or document structure.

**Common causes:**

- Filename doesn't match `slug.type.md` pattern (e.g., spaces, underscores, or uppercase in the slug)
- Missing or invalid YAML frontmatter (`title` and `status` are required)
- Unknown document type in the filename

**Fix:** Correct the issues reported by `archcore validate`. See [Common Validation Errors](/troubleshooting/validation-errors/) for detailed guidance on each error type.

## Still stuck?

Run a full diagnostic:

```bash
archcore doctor
```

This checks your `settings.json`, document structure, MCP configuration, and server reachability in one pass. The output tells you exactly what's wrong and how to fix it.
