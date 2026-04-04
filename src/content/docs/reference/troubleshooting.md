---
title: Troubleshooting
description: Common issues with Archcore — agent visibility, MCP server startup, and validation errors.
---

This page covers the most common issues you'll hit when working with Archcore. Each section describes symptoms, how to diagnose the problem, and how to fix it.

For a quick all-in-one check, run:

```bash
archcore doctor
```

This validates your project context — `settings.json`, document structure, MCP configuration, and server reachability — in one pass. The output tells you exactly what's wrong and how to fix it.

## Agent Cannot See Documents

Your agent says it can't find any documents, or it doesn't seem to know about Archcore at all. Work through the checks below in order — they're arranged from most common to least common.

### MCP not configured

The agent needs an MCP server configuration to connect to Archcore. Without it, the agent has no way to discover or read your project context.

**Check:** Look for the MCP config file for your agent:

| Agent          | Config file                          |
| -------------- | ------------------------------------ |
| Claude Code    | `.mcp.json`                          |
| Cursor         | `.cursor/mcp.json`                   |
| GitHub Copilot | `.vscode/mcp.json`                   |
| Gemini CLI     | `.gemini/settings.json`              |
| OpenCode       | `opencode.json`                      |
| Codex CLI      | `.codex/config.toml`                 |
| Roo Code       | `.roo/mcp.json`                      |
| Cline          | VS Code globalStorage (manual setup) |

**Fix:** Run the setup command:

```bash
archcore mcp install
```

Or re-run full initialization, which also installs hooks:

```bash
archcore init
```

Both commands auto-detect your agents and write the correct config files. See [Supported Agents](/agents/supported-agents/) for the full agent registry.

### Config points to wrong command

The MCP config JSON tells the agent what command to run. If the `command` or `args` fields are wrong, the server won't start and the agent won't see any documents.

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

**Fix:** Regenerate the config:

```bash
archcore mcp install
```

See [Supported Agents](/agents/supported-agents/) for config file locations per agent.

### Archcore not in PATH

The MCP server runs as a subprocess — your agent executes `archcore mcp` behind the scenes. If the `archcore` binary isn't in your shell PATH, the agent can't launch it and reports "command not found."

**Check:**

```bash
which archcore
```

If this returns nothing, the binary isn't in your PATH.

**Fix:** Add the directory containing `archcore` to your PATH. The exact location depends on how you installed it. If you used the install script, the binary is typically at `~/.local/bin/archcore` or `/usr/local/bin/archcore`.

Add it to your shell profile (`~/.bashrc`, `~/.zshrc`, or equivalent), then verify:

```bash
archcore --version
```

If you haven't installed Archcore yet, follow the [Quick Start](/start/quick-start/).

### Wrong working directory

The MCP server looks for `.archcore/` relative to the current project root. If you opened your editor in a parent directory, a subdirectory, or a different project entirely, the server won't find your documents.

**Check:**

```bash
ls .archcore/
```

If this shows "No such file or directory," you're not in the right project root.

**Fix:** Open your editor or terminal in the directory that contains `.archcore/`. For multi-root workspaces, make sure the project with `.archcore/` is the active workspace root.

If you haven't initialized the project yet:

```bash
archcore init
```

This creates the `.archcore/` directory, writes `settings.json`, and configures MCP and hooks for your detected agents.

### Hooks not installed

Without session hooks, the agent doesn't receive project context when a conversation starts. The agent can still use MCP tools if configured, but it won't proactively check for documents — it only discovers them if it happens to call the MCP tools.

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

This installs hooks for all detected agents. See [MCP Server](/agents/mcp-server/) for agent-specific details.

### Agent doesn't support MCP

Some agents or agent modes don't support the Model Context Protocol. If your agent isn't in the [supported agents list](/agents/supported-agents/), it can't connect to the Archcore MCP server.

**Supported agents:** Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenCode, Codex CLI, Roo Code, Cline.

If your agent isn't listed, you can still use Archcore documents manually — they're standard Markdown files in `.archcore/` that any tool can read.

### Documents exist but agent says none found

The agent connects to MCP successfully but reports zero documents. This usually means your documents have validation errors and are being skipped.

**Check:**

```bash
archcore validate
```

This reports any issues with file naming, frontmatter, or document structure.

**Common causes:**

- Filename doesn't match `slug.type.md` pattern (spaces, underscores, or uppercase in the slug)
- Missing or invalid YAML frontmatter (`title` and `status` are required)
- Unknown document type in the filename

**Fix:** Correct the issues reported by `archcore validate`. See [Validation Errors](#validation-errors) below for detailed guidance on each error type.

## MCP Server Not Starting

The MCP server runs as a subprocess that your coding agent launches automatically. When it fails to start, the agent either reports an MCP error or silently loses access to your repo context. This section covers issues specific to server startup — for general connectivity problems, see [Agent Cannot See Documents](#agent-cannot-see-documents) above.

### Permission denied

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

### Multiple archcore versions

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

**Fix:** Remove the extra installation, or ensure your PATH resolves to the correct one first. After fixing, regenerate the config:

```bash
archcore mcp install
```

## Validation Errors

`archcore validate` checks every document in `.archcore/` for correct naming, structure, and frontmatter. This section explains each error you might see and how to fix it.

### Invalid filename

**What you see:** The file doesn't match the `slug.type.md` pattern.

**Why it happens:** Slugs must be lowercase alphanumeric with hyphens only. The filename must follow the exact format `slug.type.md` — no extra dots, no spaces, no underscores.

**Examples of invalid names:**

| Filename                  | Problem                |
| ------------------------- | ---------------------- |
| `My Decision.adr.md`      | Spaces and uppercase   |
| `jwt_strategy.adr.md`     | Underscores            |
| `UsePostgres.adr.md`      | Uppercase letters      |
| `api.v2.migration.adr.md` | Extra dots in the slug |

**Fix:** Rename the file to use a valid slug:

```bash
# Wrong
mv ".archcore/My Decision.adr.md" ".archcore/my-decision.adr.md"

# Wrong
mv ".archcore/jwt_strategy.adr.md" ".archcore/jwt-strategy.adr.md"
```

Slugs must match the pattern `^[a-z0-9]+(-[a-z0-9]+)*$`. See [Document Format](/reference/document-format/) for the full spec.

### Unknown document type

**What you see:** The type portion of the filename isn't recognized.

**Why it happens:** The type (the middle part of `slug.type.md`) must be one of the 18 valid types. Anything else is rejected.

**Valid types:**

```
adr, rfc, rule, guide, spec, doc, prd, idea, plan, task-type, cpat,
mrd, brd, urd, brs, strs, syrs, srs
```

**Common mistakes:**

| Filename                | Problem                   | Fix                                               |
| ----------------------- | ------------------------- | ------------------------------------------------- |
| `auth.decision.md`      | `decision` is not a type  | Rename to `auth.adr.md`                           |
| `setup.tutorial.md`     | `tutorial` is not a type  | Rename to `setup.guide.md`                        |
| `api-spec.reference.md` | `reference` is not a type | Rename to `api-spec.spec.md` or `api-spec.doc.md` |

**Fix:** Rename the file using one of the 18 valid types. See [Document Types](/concepts/document-types/) for guidance on choosing the right type.

### Missing frontmatter

**What you see:** The document is missing YAML frontmatter, or the frontmatter is missing required fields.

**Why it happens:** Every Archcore document requires YAML frontmatter with both `title` and `status` fields. If either is missing, the document fails validation.

**Fix:** Add the required frontmatter at the top of the file:

```markdown
---
title: Use PostgreSQL as Primary Database
status: draft
---

Your document content here...
```

Both fields are required:

| Field    | Type   | Required values                    |
| -------- | ------ | ---------------------------------- |
| `title`  | string | Any non-empty string               |
| `status` | string | `draft`, `accepted`, or `rejected` |

### Invalid status

**What you see:** The `status` field contains an unrecognized value.

**Why it happens:** Status must be exactly one of three values. No other values are allowed — not `active`, not `approved`, not `archived`.

**Valid values:**

| Status     | Meaning                                      |
| ---------- | -------------------------------------------- |
| `draft`    | Work in progress (default for new documents) |
| `accepted` | Finalized or approved                        |
| `rejected` | Superseded, abandoned, or declined           |

**Fix:** Update the frontmatter to use a valid status:

```yaml
---
title: API Rate Limiting
status: accepted
---
```

### Orphaned relations

**What you see:** A relation points to a document that no longer exists on disk.

**Why it happens:** You deleted or renamed a document, but the relation referencing it still exists in `.sync-state.json`. The relation's target path no longer matches any file.

**Fix:** Run validate with the `--fix` flag:

```bash
archcore validate --fix
```

This automatically removes orphaned relations from the manifest and saves the updated `.sync-state.json`. No manual editing needed.

### Invalid tags

**What you see:** A tag doesn't match the required format.

**Why it happens:** Tags must be lowercase and match `^[a-z][a-z0-9_:|-]*$`. Uppercase letters, spaces, and other characters are rejected.

**Examples of invalid tags:**

| Tag         | Problem                  |
| ----------- | ------------------------ |
| `Frontend`  | Uppercase letters        |
| `my tag`    | Spaces                   |
| `123-start` | Must start with a letter |

**Fix:** Correct the tag value. Archcore shows a "did you mean?" hint when a tag is rejected — for example, `Frontend` will suggest `frontend`.

### Invalid YAML

**What you see:** The frontmatter can't be parsed as valid YAML.

**Why it happens:** The YAML between the `---` delimiters has a syntax error. Common causes:

- **Missing closing `---`** — the frontmatter block needs both an opening and closing delimiter
- **Tabs instead of spaces** — YAML requires spaces for indentation, not tabs
- **Unquoted special characters** — colons, brackets, or other YAML-significant characters in values need quoting

**Examples:**

```yaml
# Wrong: missing closing ---
---
title: My Document
status: draft

Content starts here without closing the frontmatter...
```

```yaml
# Wrong: unquoted colon in title
---
title: Decision: Use PostgreSQL
status: draft
---
```

```yaml
# Correct: quote the value
---
title: "Decision: Use PostgreSQL"
status: draft
---
```

**Fix:** Correct the YAML syntax. If you're unsure what's wrong, start with a minimal frontmatter block and add fields back one at a time:

```yaml
---
title: Your Title Here
status: draft
---
```

### Using --fix

`archcore validate --fix` automates what it can:

- Removes orphaned relations from `.sync-state.json`
- Saves the cleaned manifest

It does **not** auto-fix:

- Invalid filenames (you need to rename files manually)
- Missing or invalid frontmatter (you need to edit the file)
- Unknown document types (you need to rename the file)
- Invalid YAML syntax (you need to fix the markup)

For a full project health check beyond validation, run:

```bash
archcore doctor
```

This adds checks for `settings.json`, MCP configuration, and server reachability on top of the standard validation. See [CLI Reference](/agents/cli/) for details.
