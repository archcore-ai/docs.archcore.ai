# CLI Archcore to Docs Site Mapping Guide

This reference maps CLI `.archcore/` document types and topics to their corresponding documentation pages.

## Document Type Mapping

| CLI `.archcore/` Topic | Docs Page | Section |
|---|---|---|
| Document types (all 11 types: adr, rfc, rule, guide, spec, doc, prd, idea, plan, task-type, cpat) | `concepts/document-types.md` | Core Concepts |
| Context layers / categories (vision, knowledge, experience) | `concepts/context-layers.md` | Core Concepts |
| Relations (implements, extends, depends_on, related) | `concepts/relations.md` | Core Concepts |
| Directory structure / file organization | `concepts/directory-structure.md` | Core Concepts |
| Philosophy / design principles | `concepts/philosophy.md` | Core Concepts |
| CLI commands (init, validate, doctor, config, mcp, hooks, update) | `reference/cli-commands.md` | Reference |
| Configuration / settings.json | `reference/configuration.md` | Reference |
| Document format / frontmatter schema / naming | `reference/document-format.md` | Reference |
| MCP tools (list_documents, get_document, create_document, etc.) | `reference/mcp-tools.md` | Reference |
| MCP server setup | `integrations/mcp-server.md` | Integrations |
| Supported agents | `integrations/supported-agents.md` | Integrations |
| Hooks / session hooks | `integrations/hooks.md` | Integrations |
| Installation / quick start | `getting-started/quick-start.mdx` | Getting Started |
| Overview / what is archcore | `index.md` | Getting Started |

## How to Use This Mapping

1. For each CLI `.archcore/` document, identify the **topic** it covers
2. Find the matching row above to locate the target docs page
3. If a CLI document covers multiple topics, it may map to multiple docs pages
4. If no mapping exists, a new page may be needed — classify as "missing"

## Comparison Approach

When comparing CLI context to docs:

- **Feature lists**: Check that every feature/capability in CLI is documented
- **Command flags/options**: Verify all flags match between CLI and docs
- **Document types**: Ensure all types, their descriptions, templates, and required sections match
- **Configuration options**: Check every setting is documented with correct defaults
- **MCP tools**: Verify tool names, parameters, descriptions, and examples match
- **Code examples**: Ensure examples reflect actual CLI behavior
- **Terminology**: Check for renamed concepts, commands, or options
