---
title: MCP Server Integration
description: How AI coding agents see and interact with your .archcore/ documents through the built-in MCP server.
---

The MCP server is how your agent sees `.archcore/`. It gives agents tools to list, read, create, update, and link documents — all within the conversation.

You usually don't need to think about MCP directly. `archcore init` sets it up automatically. This page explains what's happening under the hood and how to configure it manually if needed.

## What Agents Can Do

Once MCP is configured, agents interact with your documents through 8 tools:

| Action | Tool | Description |
|--------|------|-------------|
| Browse | `list_documents` | List documents filtered by type, layer, or status |
| Read | `get_document` | Get full document content with relations |
| Create | `create_document` | Create new documents from templates |
| Update | `update_document` | Modify title, status, or content |
| Delete | `remove_document` | Remove a document permanently |
| Link | `add_relation` | Create a relation between two documents |
| Unlink | `remove_relation` | Remove a relation |
| Browse links | `list_relations` | View all relations or filter by document |

See [MCP Tools Reference](/reference/mcp-tools/) for the complete API with parameters and examples.

## Built-in Agent Instructions

The MCP server doesn't just expose tools — it teaches agents how to use them. When an agent connects, it receives instructions covering:

- Which document type to use for each situation
- Naming conventions and slug rules
- When to create vs. update documents
- How to use relations properly
- Status lifecycle (`draft` → `accepted` → `rejected`)

These instructions are sent automatically. You don't need to explain Archcore conventions to your agent.

## Installation

### Automatic (Recommended)

```bash
archcore init
```

`archcore init` auto-detects installed agents and configures MCP for each one. It writes the appropriate config file so the agent knows to launch the MCP server on startup.

### Manual

Install for all detected agents:

```bash
archcore mcp install
```

Or for a specific agent:

```bash
archcore mcp install --agent claude-code
```

### Manual Config

If you need to configure MCP by hand, add to your agent's MCP config:

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

## Language Support

If you set a language in your config:

```bash
archcore config set language ru
```

The MCP server instructions will include a directive for the agent to write document content in that language.

## Protocol Details

The MCP server runs as a subprocess launched by your coding agent. When the agent starts, it spawns `archcore mcp` and communicates over stdin/stdout using JSON-RPC 2.0 (stdio transport). The server stays running for the duration of the session.
