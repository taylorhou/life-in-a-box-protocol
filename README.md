```
        \  /      \  /
     .--\//-.  .-\\/--.
    ( o    o )( o    o )
   /|   /\   ||   /\   |\
  /_|  /  \  ||  /  \  |_\
     \_\__/\_//_\__/\_/

  ─────────────────────────────────────
         l i f e - i n - a - b o x
  ─────────────────────────────────────
       one journal. one life. yours.
            life-in-a-box.org
```

> The future looks like this:
>
> One append-only, hash-chained journal.
> On git. Owned by you.
> Readable by any AI. Transferable to your kids.

---

## What is this?

A stupidly simple, agent-native operating system for a human life.

Your life generates a ledger. Every transaction, every conversation, every heartbeat, every milestone — it's all being recorded right now. The problem is it's trapped in 30 silos you don't own. When those platforms die or change terms, it's gone.

**life-in-a-box** is the alternative: an append-only, hash-chained personal journal on git. You own it. Any AI can read it. Your kids can inherit it.

**Quick links:**
- Website: https://life-in-a-box.org
- GitHub: https://github.com/taylorhou/life-in-a-box-protocol
- Spec: [`SPEC.md`](./SPEC.md)
- Federation: [`FEDERATION.md`](./FEDERATION.md)
- Handoff: [`HANDOFF.md`](./HANDOFF.md)
- AI Comms: [`COMMS_AI.md`](./COMMS_AI.md)

Inspired by [biz-in-a-box](https://biz-in-a-box.org) and Andrej Karpathy's note on [nano repos](https://x.com/karpathy/status/2024987174077432126).

---

## One repo = one life

A student. A parent. A founder. A retiree.
Fork it. Make it yours. Point your agent at it.

---

## The model

```
life-in-a-box/
├── entity.yaml      # Who you are + your relationships
├── accounts.yaml    # Taxonomy of your life (financial, health, comms, etc.)
├── labels.yaml      # Entry classification
├── journal.ndjson   # Every entry, forever — append only
├── validate.js      # Hash chain verifier
├── FEDERATION.md    # How linked journals work (family, friends)
└── HANDOFF.md       # How custody transfers to your kids
```

Every entry chains to the previous via SHA-256. Tamper-evident. Portable. Local-first. Yours.

---

## What gets recorded

**A daily journal entry:**
```json
{
  "id": "uuid",
  "prev": "sha256:b7e1...",
  "time": "2026-02-28T23:00:00-06:00",
  "account": "LIFE.journal.daily",
  "labels": ["journal_entry"],
  "memo": "Productive morning. Kids had a good day at school. Went for a run.",
  "hash": "sha256:c9d3..."
}
```

**A financial transaction:**
```json
{
  "id": "uuid",
  "prev": "sha256:c9d3...",
  "time": "2026-02-28T12:30:00-06:00",
  "account": "FINANCIAL.expenses.food_dining",
  "labels": ["bank_sync", "financial"],
  "memo": "Dinner — Uchi",
  "amount": -180.00,
  "currency": "USD",
  "hash": "sha256:d1e2..."
}
```

**A family moment (with federation):**
```json
{
  "id": "uuid",
  "prev": "sha256:d1e2...",
  "time": "2026-03-01T14:00:00-06:00",
  "account": "LIFE.experiences.family",
  "labels": ["family", "milestone"],
  "memo": "Took Levi to his first baseball game. He hit a double.",
  "participants": ["person-levi-hou"],
  "cross_post": {
    "person-levi-hou": { "share": "summary", "summary": "Dad took me to my first baseball game. Hit a double." }
  },
  "hash": "sha256:e3f4..."
}
```

---

## Federation — linked sovereign journals

Each person has their own private repo. Entries that involve others create
**cryptographically-linked cross-references** — not copies — in the other person's journal.

Parents write their children's journals as custodians. At handoff (first phone, 18th birthday, whenever),
the repo transfers. The child ratifies the history. They carry it forward.

See [`FEDERATION.md`](./FEDERATION.md) and [`HANDOFF.md`](./HANDOFF.md) for the full protocol.

---

## Getting started

```bash
# 1. Fork or clone this repo
git clone https://github.com/taylorhou/life-in-a-box-protocol my-life

# 2. Edit entity.yaml with your name, timezone, relationships
# 3. Point your AI agent at journal.ndjson
# 4. Start logging
```

No database. No server. No vendor. Just git.

---

## Accounts taxonomy

The full human life taxonomy is in [`accounts.yaml`](./accounts.yaml):

- `FINANCIAL` — assets, liabilities, income, expenses, crypto, equity
- `LIFE` — journal, health, experiences, milestones, goals, learning
- `COMMUNICATIONS` — calls, messages, email, AI sessions
- `MEDIA` — photos, videos, writing, music
- `IDENTITY` — documents, custody, legal

---

## Inspired by

- [biz-in-a-box](https://biz-in-a-box.org) — the same idea for business entities
- Andrej Karpathy's vision for [nano repos](https://x.com/karpathy/status/2024987174077432126)
- The right to own your own life's data

---

## License

MIT. Fork it. Adapt it. Make your own vertical.
