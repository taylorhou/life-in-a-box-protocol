# life-in-a-box SPEC

## Core Constraints

1. `journal.ndjson` is append-only. Never edit or delete entries.
2. Every entry must include: `id`, `prev`, `time`, `account`, `memo`, `hash`.
3. `hash` = SHA-256 of the entry's own content (excluding the hash field).
4. `prev` = the `hash` of the immediately preceding entry. First entry uses `"sha256:genesis"`.
5. `account` must be a valid path in `accounts.yaml`.
6. `labels` must each be defined in `labels.yaml`.

## Entry Schema

```json
{
  "id": "uuid-v4",
  "prev": "sha256:<hex>",
  "time": "ISO-8601 with timezone offset",
  "recorded_at": "ISO-8601 (when agent logged it, may differ from time)",
  "account": "CATEGORY.subcategory.leaf",
  "labels": ["label1", "label2"],
  "memo": "Human-readable description",
  "amount": 0.00,            // optional, for financial entries
  "currency": "USD",         // optional
  "participants": [],        // optional, list of entity IDs
  "cross_post": {},          // optional, see FEDERATION.md
  "cross_ref": {},           // optional, for cross-ref entries from other journals
  "meta": {},                // optional, arbitrary structured data
  "recorded_by": "entity-id or 'entity-id (custodian for entity-id)'",
  "hash": "sha256:<hex>"
}
```

## Corrections

Never edit. Instead, append a correction entry:

```json
{
  "labels": ["correction"],
  "memo": "Correction: [original entry id] had wrong amount. Correct amount: $42.00.",
  "corrects": "uuid-of-original-entry"
}
```

## Validation

Run `node validate.js` to verify the full chain integrity.

## Financial Double-Entry (optional)

For rigorous financial tracking, life-in-a-box supports double-entry:
- Every financial entry should have a matching contra entry
- Net effect on FINANCIAL.assets = 0 for transfers
- See `accounts.yaml` for the full chart of accounts

## Federation

See `FEDERATION.md` for the cross-journal protocol.

## Handoff

See `HANDOFF.md` for the custody transfer protocol.
