---
title: MCP Server Integration
description: Built-in Model Context Protocol (MCP) server that lets AI coding agents read, query, and create project documents during a conversation.
---

Archcore includes a built-in MCP server that exposes your `.archcore/` documents to AI agents via the Model Context Protocol (stdio transport).

## How It Works

The MCP server runs as a subprocess launched by your coding agent. When the agent starts, it spawns `archcore mcp` and communicates with it over stdin/stdout using JSON-RPC 2.0.

The server provides 8 tools that agents can call to interact with your documents. See [MCP Tools Reference](/reference/mcp-tools/) for the complete API.

## Installation

### Automatic (Recommended)

```bash
archcore init
```

`archcore init` auto-detects installed agents and configures MCP for each one. It writes the appropriate config file so the agent knows to launch `archcore mcp` on startup.

### Manual

```bash
archcore mcp install
```

Or for a specific agent:

```bash
archcore mcp install --agent claude-code
```

### Manual Config

If you need to configure MCP manually, add to your agent's MCP config:

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

Config file locations vary by agent — see [Supported Agents](/integrations/supported-agents/) for details.

## What Agents Can Do

Once MCP is configured, agents can:

| Action | Tool | Description |
|--------|------|-------------|
| Browse | `list_documents` | List documents filtered by type, category, or status |
| Read | `get_document` | Get full document content with relations |
| Create | `create_document` | Create new documents from templates |
| Update | `update_document` | Modify title, status, or content |
| Delete | `remove_document` | Remove a document permanently |
| Link | `add_relation` | Create a relation between two documents |
| Unlink | `remove_relation` | Remove a relation |
| Browse links | `list_relations` | View all relations or filter by document |

## Agent Instructions

The MCP server embeds detailed instructions that teach agents:

- Which document type to use for each situation
- How to follow naming conventions
- When to create vs. update documents
- How to use relations properly
- Document status lifecycle (draft → accepted → rejected)

These instructions are sent automatically when the agent connects — no manual setup needed.

## Language Support

If you set a language in your config:

```bash
archcore config set language ru
```

The MCP server instructions will include a directive for the agent to write document content in that language.
