# FEDERATION.md — Cross-Journal Entry Protocol

How entries in one journal create linked entries in another.

---

## The Rule

**Reference, don't copy.** A cross-ref entry in Levi's journal points to
Taylor's original entry via hash. It does not copy Taylor's private words.

---

## Share Levels

| Level | What lands in their journal |
|---|---|
| `full` | Full memo + all meta (default: spouse) |
| `summary` | Al-generated neutral summary (default: kids) |
| `reference` | Date + account + "Taylor logged an event involving you" |
| `none` | Nothing — stays in Taylor's journal only |

---

## Entry Anatomy

**Taylor's original entry (in taylorhou/life-in-a-box):**
```json
{
  "participants": ["person-levi-hou"],
  "cross_post": {
    "person-levi-hou": {
      "share": "summary",
      "summary": "Dad took me to my first baseball game. Hit a double."
    }
  }
}
```

**Cross-ref entry (in taylorhou/life-in-a-box-levi):**
```json
{
  "labels": ["cross_ref"],
  "memo": "Dad took me to my first baseball game. Hit a double.",
  "cross_ref": {
    "source_entity": "person-taylor-hou",
    "source_repo": "taylorhou/life-in-a-box",
    "source_entry_id": "uuid",
    "source_hash": "sha256:..."
  }
}
```

The `source_hash` is cryptographic proof the source entry exists and hasn't changed.

---

## Who Does the Linking

Al (OpenClaw) — when logging an entry for Taylor, Al:
1. Detects participants (explicit or inferred from memo)
2. Applies share level from `family.yaml` defaults (or Taylor's override)
3. Generates summary if share = `summary`
4. Appends cross-ref entry to each participant's repo and pushes

This is always transparent — Taylor can review before push or set auto-push for family.
