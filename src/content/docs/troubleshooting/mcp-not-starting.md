---
title: MCP Server Not Starting
description: Fix issues when the Archcore MCP server fails to start or connect.
---

The MCP server runs as a subprocess that your coding agent launches automatically. When it fails to start, the agent either reports an MCP error or silently loses access to your documents. Here's how to diagnose and fix it.

## "command not found" error

The agent tries to run `archcore mcp` but can't find the binary.

**Check:**

```bash
archcore --version
```

If this returns "command not found," the binary isn't installed or isn't in your PATH.

**Fix:** Install Archcore following the [Quick Start](/getting-started/quick-start/), then verify:

```bash
which archcore
```

This should print a path like `/usr/local/bin/archcore` or `~/.local/bin/archcore`. If the binary exists but isn't in your PATH, add its directory to your shell profile (`~/.bashrc`, `~/.zshrc`, or equivalent).

## Permission denied

On macOS and Linux, the binary needs execute permissions. The install script sets this automatically, but manual downloads or file transfers can strip it.

**Check:**

```bash
ls -l $(which archcore)
```

Look for `x` in the permissions (e.g., `-rwxr-xr-x`).

**Fix:**

```bash
chmod +x $(which archcore)
```

## Config points to wrong command

The MCP config JSON tells the agent what command to run. If the `command` or `args` fields are wrong, the server won't start.

**Check:** Open your agent's MCP config file and verify it matches this structure:

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

For GitHub Copilot, the format is slightly different:

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

**Fix:** If the config is wrong, the fastest fix is to regenerate it:

```bash
archcore mcp install
```

See [Supported Agents](/integrations/supported-agents/) for config file locations per agent.

## Multiple archcore versions

If you have multiple installations (e.g., a global install and a project-local one), the agent might pick up the wrong version — or one that's broken.

**Check:**

```bash
which archcore
archcore --version
```

On some systems, you can also check for duplicates:

```bash
which -a archcore
```

**Fix:** Remove the extra installation, or ensure your PATH resolves to the correct one first. After fixing, re-run `archcore mcp install` to regenerate the config.

## No .archcore/ directory

The MCP server needs an initialized project. If there's no `.archcore/` directory in the current project root, the server has nothing to serve.

**Check:**

```bash
ls .archcore/
```

**Fix:**

```bash
archcore init
```

This creates the `.archcore/` directory, writes `settings.json`, and configures MCP and hooks for your detected agents — all in one step.

## Run a full diagnostic

When you're not sure what's wrong, `archcore doctor` checks everything at once:

```bash
archcore doctor
```

It verifies:

- `settings.json` exists and is valid
- Document structure and naming
- MCP configuration for detected agents
- Server reachability (if a server URL is configured)

The output tells you what passed, what failed, and what to do about it.
