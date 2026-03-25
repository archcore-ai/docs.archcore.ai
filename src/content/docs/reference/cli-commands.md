---
title: CLI Commands
description: Complete reference for all Archcore CLI commands
---

## archcore init

Initialize `.archcore/` in the current directory.

```bash
archcore init
```

**What it does:**
1. Creates `.archcore/` directory with `settings.json`
2. Auto-detects installed coding agents
3. Installs MCP server config for detected agents
4. Installs session hooks for supported agents

If no agents are detected, falls back to Claude Code configuration.

---

## archcore validate

Validate `.archcore/` structure and documents.

```bash
archcore validate [--fix]
```

**Checks performed:**
- Directory structure exists
- File naming follows `<slug>.<type>.md` pattern
- Slugs are lowercase alphanumeric with hyphens only
- Document types are valid (one of the 18 types)
- YAML frontmatter has required `title` and `status` fields
- Frontmatter is valid YAML
- Sync manifest JSON structure
- Orphaned relations (documents referenced but not on disk)

**Flags:**

| Flag | Description |
|------|-------------|
| `--fix` | Auto-remove orphaned relations and save manifest |

---

## archcore doctor

Comprehensive health check.

```bash
archcore doctor
```

Runs all validation checks plus:
- Verifies `settings.json` exists and is valid
- Checks server reachability (if server URL is configured)

---

## archcore config

Manage configuration.

```bash
archcore config                    # Show current sync type
archcore config get <key>          # Read a config value
archcore config set <key> <value>  # Set a config value
```

**Available keys:**

| Key | Values | Description |
|-----|--------|-------------|
| `sync` | `none`, `cloud`, `on-prem` | Sync type (currently locked) |
| `project_id` | integer | Project ID for sync (currently locked) |
| `archcore_url` | URL | Server URL for on-prem (currently locked) |
| `language` | language code | Language for document content (e.g., `en`, `ru`) |

**Examples:**

```bash
archcore config set language ru
archcore config get language
```

---

## archcore mcp

Run the MCP server or install MCP config.

```bash
archcore mcp              # Start stdio MCP server
archcore mcp install       # Install MCP config for all detected agents
archcore mcp install --agent <id>  # Install for a specific agent
```

The `archcore mcp` command starts a stdio MCP server that coding agents connect to. It's not meant to be run manually — agents launch it as a subprocess.

**Agent IDs:** `claude-code`, `cursor`, `copilot`, `gemini-cli`, `opencode`, `codex-cli`, `roo-code`, `cline`

---

## archcore hooks

Manage agent hooks.

```bash
archcore hooks install                  # Install hooks for all detected agents
archcore hooks install --agent <id>     # Install for a specific agent
```

**Agent hook commands** (called by agents, not manually):

```bash
archcore hooks claude-code session-start
archcore hooks cursor <event>
archcore hooks gemini-cli <event>
archcore hooks copilot <event>
```

---

## archcore update

Check for and install the latest version.

```bash
archcore update
```

Queries GitHub releases, compares versions, downloads the binary for your OS/architecture, verifies the checksum, and updates in place.

---

## archcore --version

Display the current version.

```bash
archcore --version
```

---

## archcore --help

Show help with all available commands.

```bash
archcore --help
```
