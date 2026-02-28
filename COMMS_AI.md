# COMMS_AI.md — Al ↔ Taylor Communication Log Spec

This document defines how all communication between Taylor and Al (OpenClaw) is recorded in `journal.ndjson`.

---

## Purpose

Every meaningful interaction with Al is an append-only entry. This gives Taylor:
- A portable, ownable record of everything Al has done or decided
- Full audit trail that survives platform changes (OpenClaw → Perplexity → anything)
- Searchable history of tasks, decisions, and context Al has learned

---

## Journal Entry Types

### 1. Session summary (`ai_session`)
Logged at the end of each meaningful conversation block.

```json
{
  "id": "uuid",
  "prev": "sha256:...",
  "time": "2026-02-28T09:00:00-06:00",
  "recorded_at": "2026-02-28T09:30:00-06:00",
  "account": "COMMUNICATIONS.ai.al",
  "labels": ["ai_session"],
  "memo": "Session: saved 9 prompt files to workspace, initialized life-in-a-box entity, discussed portability strategy.",
  "meta": {
    "platform": "OpenClaw",
    "model": "claude-sonnet-4-6",
    "channel": "bluebubbles",
    "topics": ["prompts", "life-in-a-box", "portability"],
    "files_changed": ["prompts/*.md", "entity.yaml"],
    "commits": ["6175c79", "8928c56"]
  },
  "hash": "sha256:..."
}
```

### 2. Task completed (`ai_task`)
Logged when Al completes a discrete delegated task.

```json
{
  "id": "uuid",
  "prev": "sha256:...",
  "time": "2026-02-28T09:15:00-06:00",
  "recorded_at": "2026-02-28T09:15:30-06:00",
  "account": "COMMUNICATIONS.ai.al",
  "labels": ["ai_task"],
  "memo": "Created life-in-a-box Moltbook agent and pushed entity.yaml with full family + company structure.",
  "meta": {
    "task": "initialize life-in-a-box",
    "outcome": "success",
    "artifacts": ["github.com/taylorhou/life-in-a-box/commit/8928c56"]
  },
  "hash": "sha256:..."
}
```

### 3. Decision logged (`ai_decision`)
When a consequential decision is made (with or without Taylor's explicit input).

```json
{
  "id": "uuid",
  "prev": "sha256:...",
  "time": "2026-02-28T09:20:00-06:00",
  "recorded_at": "2026-02-28T09:20:00-06:00",
  "account": "COMMUNICATIONS.ai.al",
  "labels": ["ai_decision"],
  "memo": "Decided to use life-in-a-box journal.ndjson as the canonical comms log between Taylor and Al. Rationale: portable, ownable, hash-chained, survives platform migration.",
  "meta": {
    "decided_by": "taylor+al",
    "alternatives_considered": ["openclaw workspace memory only", "separate comms db"]
  },
  "hash": "sha256:..."
}
```

### 4. Memory / preference noted (`ai_memory`)
Long-term facts Al should remember about Taylor.

```json
{
  "id": "uuid",
  "prev": "sha256:...",
  "time": "2026-02-28T09:25:00-06:00",
  "recorded_at": "2026-02-28T09:25:00-06:00",
  "account": "COMMUNICATIONS.ai.al",
  "labels": ["ai_memory"],
  "memo": "Taylor prefers proactive execution over asking for permission on internal tasks. Ask before external actions (email, tweets).",
  "hash": "sha256:..."
}
```

---

## Logging Cadence

| Trigger | Entry type | Who logs |
|---|---|---|
| End of meaningful session | `ai_session` | Al (auto) |
| Discrete task completed | `ai_task` | Al (auto) |
| Consequential decision made | `ai_decision` | Al (auto) |
| New preference/fact learned | `ai_memory` | Al (auto) |
| Taylor explicitly wants something recorded | any | Taylor asks Al |

---

## Privacy

- Sensitive content (credentials, private health, financial specifics) goes in `meta` only when Taylor explicitly approves logging
- Default: log topic + outcome, not full message content
- Full transcript is never committed — summaries only
