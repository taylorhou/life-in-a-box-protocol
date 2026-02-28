# FEDERATION.md — Cross-Journal Entry Protocol

How entries in one journal create linked entries in another.

---

## The Rule

**Reference, don't copy.** A cross-ref entry in a child's journal points to
the parent's original entry via hash. It does not copy private words.

---

## Share Levels

| Level | What lands in their journal |
|---|---|
| `full` | Full memo + all meta (default: spouse) |
| `summary` | AI-generated neutral summary (default: kids, friends) |
| `reference` | Date + account only — "Person logged an event involving you" |
| `none` | Nothing — stays in your journal only |

Set defaults per relationship in `entity.yaml`:
```yaml
relationships:
  spouse:
    default_share: full
  custodian_of:
    default_share: summary
```

---

## Entry Anatomy

**Your original entry:**
```json
{
  "id": "a1b2c3d4-...",
  "account": "LIFE.experiences.family",
  "labels": ["family", "milestone"],
  "memo": "Took Levi to his first baseball game. He hit a double. Austin was jealous — plan his one-on-one soon.",
  "participants": ["person-levi-hou", "person-austin-hou"],
  "cross_post": {
    "person-levi-hou": {
      "share": "summary",
      "summary": "Dad took me to my first baseball game. Hit a double."
    },
    "person-austin-hou": {
      "share": "none"
    }
  },
  "hash": "sha256:abc123..."
}
```

**Cross-ref entry (lands in Levi's journal):**
```json
{
  "labels": ["cross_ref", "family", "milestone"],
  "memo": "Dad took me to my first baseball game. Hit a double.",
  "cross_ref": {
    "source_entity": "person-taylor-hou",
    "source_repo": "owner/life-in-a-box",
    "source_entry_id": "a1b2c3d4-...",
    "source_hash": "sha256:abc123..."
  }
}
```

The `source_hash` is cryptographic proof the source entry exists unchanged.
Austin gets nothing — Taylor's private note about him stays private.

---

## Who Does the Linking

An AI agent (with access to both repos) handles cross-posting:
1. Detects participants (explicit `participants` field, or inferred from memo)
2. Applies share level from `entity.yaml` defaults (or entry-level override)
3. Generates summary if `share: summary`
4. Appends cross-ref entry to each participant's repo and pushes

---

## Agents

Each sovereign person can have their own AI agent writing to their journal:

| Person | Status |
|---|---|
| You (journal owner) | Your agent logs on your behalf |
| Spouse | Their own agent (sovereign, writes independently) |
| Children | Your agent writes as custodian until handoff |

When two agents have shared-access relationships, cross-posting can be automatic.
Custodian entries are clearly marked `recorded_by: "parent-entity-id (custodian for child-entity-id)"`.
