---
title: Configuration Reference
description: Complete reference for .archcore/settings.json — project settings, sync types (local, cloud, on-prem), language options, and validation rules.
---

## Settings File

Configuration is stored in `.archcore/settings.json`. This file is created during `archcore init` and managed through `archcore config`.

### Minimal Config (Local Only)

```json
{
  "sync": "none"
}
```

### With Language

```json
{
  "sync": "none",
  "language": "ru"
}
```

## Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sync` | string | Yes | Sync type: `none`, `cloud`, or `on-prem` |
| `project_id` | integer | No | Project identifier for cloud/on-prem sync |
| `archcore_url` | string | No | Server URL for on-prem sync |
| `language` | string | No | Language code for document content |

## Sync Types

### `none` — Local Only

Documents stay local. No server communication.

```json
{
  "sync": "none"
}
```

**Allowed fields:** `sync`, `language`
**Forbidden fields:** `project_id`, `archcore_url`

### `cloud` — Cloud Sync

Syncs to `https://app.archcore.ai`.

```json
{
  "sync": "cloud",
  "project_id": 42
}
```

**Allowed fields:** `sync`, `project_id`, `language`
**Forbidden fields:** `archcore_url`

:::note
Cloud sync is not yet available. The `sync` field is currently locked to `none`.
:::

### `on-prem` — Self-Hosted Server

Syncs to a self-hosted Archcore server.

```json
{
  "sync": "on-prem",
  "project_id": 42,
  "archcore_url": "https://archcore.internal.company.com"
}
```

**Allowed fields:** `sync`, `project_id`, `archcore_url`, `language`
**Required fields:** `archcore_url`

:::note
On-prem sync is not yet available.
:::

## Validation Rules

- `sync` must be one of: `none`, `cloud`, `on-prem`
- Fields must be consistent with the sync type (e.g., `archcore_url` is forbidden for `cloud`)
- `language` must not contain spaces
- `archcore_url` must not be empty when sync is `on-prem`
- Optional fields use `omitempty` — omitted fields use code-level defaults

## Managing Config

```bash
# View current sync type
archcore config

# Get a specific value
archcore config get language

# Set a value
archcore config set language en
```
