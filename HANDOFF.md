# HANDOFF.md — Custody Transfer Protocol

When a child is ready (gets their first phone, turns 18, or whenever the custodian decides),
ownership of their life-in-a-box journal transfers from custodian to the child.

The hash chain is unbroken. The history is theirs. They carry it forward.

---

## The Baby Book Principle

> You didn't write your own birth story. Your parents did.  
> But it's yours. You sign the inside cover. You carry it forward.

Past entries remain honestly authored — `recorded_by: parent (custodian for child)`.
That's not a flaw. It's the truth of how childhood works.

---

## Handoff Triggers

The custodian decides. Common triggers:
- **First phone** — child gets a device and can manage their own digital identity
- **Milestone birthday** — 13, 16, 18, 21
- **Custodian's discretion** — any time feels right

Stored in `entity.yaml`:
```yaml
custodian:
  entity: person-parent
  handoff_trigger: "first phone"
  handoff_date: null   # fill in when it happens
```

---

## The Handoff Ceremony (3 steps)

### Step 1 — Custodian Seal Entry
The custodian (via their agent) appends a final entry to the child's journal,
cryptographically closing the custodian period:

```json
{
  "account": "LIFE.identity.custody",
  "labels": ["custodian_seal"],
  "memo": "Levi gets his first phone. Transferring his journal. This chapter is his.",
  "meta": {
    "custodian": "person-taylor-hou",
    "beneficiary": "person-levi-hou",
    "chain_entry_count": 847,
    "chain_root": "sha256:<genesis-hash>",
    "chain_tip": "sha256:<this-entry-hash>"
  }
}
```

### Step 2 — Repo Transfer
- GitHub repo transfers: `custodian/life-in-a-box-child` → `child/life-in-a-box`
- Custodian may retain a read-only fork (their choice, child's consent)
- `family.yaml` updates: `status: custodian` → `status: sovereign`, `handoff_date: today`

### Step 3 — Child's Ratification
The child appends their first self-authored entry:

```json
{
  "account": "LIFE.identity.custody",
  "labels": ["ratification"],
  "memo": "This is my life. I accept this history as my own.",
  "meta": {
    "custodian_seal_hash": "sha256:<seal-hash>",
    "author": "person-levi-hou"
  }
}
```

From this entry forward, only the child (or their agent) appends new entries.

---

## What Changes After Handoff

| Before | After |
|---|---|
| Custodian writes entries | Child (or their own agent) writes entries |
| `recorded_by: parent (custodian)` | `recorded_by: child` |
| Repo at custodian's GitHub | Repo at child's GitHub |
| Custodian has full write access | Child has full control; custodian has read-only (optional) |

## What Never Changes

- The hash chain is unbroken — history is intact and verifiable from day one
- Past entries are honestly attributed: parent as custodian
- The ratification entry is the cryptographic handshake between generations
- No one can alter the history between writing and handoff — the chain proves it
