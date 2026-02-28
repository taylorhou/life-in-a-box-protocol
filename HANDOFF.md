# HANDOFF.md — Custody Transfer Protocol

When a child gets their first phone (or Taylor decides), ownership of their
life-in-a-box journal transfers from custodian (Taylor) to the child.

---

## Step 1 — Custodian Seal Entry
Taylor (via Al) appends this to the child's journal:

```json
{
  "id": "uuid",
  "prev": "sha256:<last-entry-hash>",
  "time": "<handoff-datetime>",
  "recorded_at": "<handoff-datetime>",
  "account": "LIFE.identity.custody",
  "labels": ["custodian_seal"],
  "memo": "<child name> receives their journal. Custodian period ends.",
  "meta": {
    "custodian": "person-taylor-hou",
    "beneficiary": "person-<child>-hou",
    "chain_entry_count": <n>,
    "chain_root": "sha256:<genesis-hash>",
    "chain_tip": "sha256:<this-entry-hash>"
  },
  "hash": "sha256:..."
}
```

## Step 2 — GitHub Repo Transfer
- Taylor transfers `taylorhou/life-in-a-box-<child>` to the child's GitHub account
- Taylor may retain a read-only fork at `taylorhou/life-in-a-box-<child>-archive`
- Family graph (`family.yaml`) is updated: status → sovereign, handoff_date → today

## Step 3 — Child's Ratification Entry
The child appends their first self-authored entry:

```json
{
  "id": "uuid",
  "prev": "sha256:<seal-entry-hash>",
  "time": "<ratification-datetime>",
  "recorded_at": "<ratification-datetime>",
  "account": "LIFE.identity.custody",
  "labels": ["ratification"],
  "memo": "This is my life. I accept this history as my own.",
  "meta": {
    "custodian_seal_hash": "sha256:<seal-entry-hash>",
    "author": "person-<child>-hou"
  },
  "hash": "sha256:..."
}
```

---

## What changes after handoff

| Before | After |
|---|---|
| Taylor writes entries to child's repo | Child (or their own agent) writes entries |
| `recorded_by: taylor (custodian)` | `recorded_by: child` |
| Repo at taylorhou/ | Repo at child's GitHub account |
| Taylor has full access | Taylor has read-only fork (optional) |

## What never changes

- The hash chain is unbroken — history is intact and verifiable
- Past entries remain authored honestly: `recorded_by: taylor (custodian for child)`
- The child's ratification entry is the cryptographic acknowledgment of the full history

---

## The Baby Book Principle

> You didn't write your own birth story. Your parents did.
> But it's yours. You sign the inside cover. You carry it forward.
