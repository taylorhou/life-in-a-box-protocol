#!/usr/bin/env node
/**
 * biz-in-a-box validator
 *
 * Validates journal.ndjson for:
 *   - required fields (id, time)
 *   - two-timestamp model: time (event) vs recorded_at (ledger write)
 *   - double-entry balance on [financial] entries
 *   - [correction] entries have supersedes ref
 *   - [transfer] entries have from/to refs
 *   - hash chain integrity
 *
 * Usage:
 *   node validate.js [journal.ndjson]
 *   echo $? → 0 = valid, 1 = errors found
 *
 * Extend this in your vertical fork:
 *   import { validateEntry } from './validate.js'
 */

import { createHash } from "crypto";
import { readFileSync } from "fs";

const GENESIS_HASH = "0".repeat(64);

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((acc, key) => {
        acc[key] = canonicalize(value[key]);
        return acc;
      }, {});
  }
  return value;
}

export function hashEntry(entry) {
  const { hash: _h, ...rest } = entry;
  const canonical = JSON.stringify(canonicalize(rest));
  return createHash("sha256").update(canonical).digest("hex");
}

export function validateEntry(entry, prevHash, index) {
  const errors = [];
  const loc = `Entry ${index} (${entry.id || "no-id"})`;
  const labels = entry.labels || [];

  // Required fields
  if (!entry.id)   errors.push(`${loc}: missing id`);
  if (!entry.time) errors.push(`${loc}: missing time (event time)`);

  // Two-timestamp model
  // time         = when the event OCCURRED (required)
  // recorded_at  = when this was WRITTEN to ledger (optional, defaults to now)
  // If recorded_at is significantly later than time, entry should carry [historical] or [imported]
  if (entry.time && entry.recorded_at) {
    const eventMs   = new Date(entry.time).getTime();
    const recordMs  = new Date(entry.recorded_at).getTime();
    const diffDays  = (recordMs - eventMs) / (1000 * 60 * 60 * 24);
    const isMarked  = labels.includes("historical") || labels.includes("imported") || labels.includes("opening-balance");
    if (diffDays > 7 && !isMarked) {
      errors.push(`${loc}: event_time and recorded_at differ by ${Math.round(diffDays)} days — add [historical] or [imported] label`);
    }
  }

  // [financial] label — double-entry required
  if (labels.includes("financial")) {
    if (!entry.debits?.length)  errors.push(`${loc}: [financial] entry missing debits`);
    if (!entry.credits?.length) errors.push(`${loc}: [financial] entry missing credits`);

    const sum = (lines) => (lines || []).reduce((a, l) => a + (l.amount || 0), 0);
    const debitTotal  = Math.round(sum(entry.debits)  * 100);
    const creditTotal = Math.round(sum(entry.credits) * 100);

    if (debitTotal !== creditTotal) {
      errors.push(`${loc}: debits (${debitTotal/100}) ≠ credits (${creditTotal/100})`);
    }
  }

  // [correction] label — must reference superseded entry
  if (labels.includes("correction") && !entry.supersedes) {
    errors.push(`${loc}: [correction] entry missing supersedes ref`);
  }

  // [transfer] label — must reference from/to actors
  if (labels.includes("transfer")) {
    if (!entry.from) errors.push(`${loc}: [transfer] entry missing from actor`);
    if (!entry.to)   errors.push(`${loc}: [transfer] entry missing to actor`);
  }

  // Hash chain
  if (entry.prev_hash !== undefined && entry.prev_hash !== prevHash) {
    errors.push(`${loc}: prev_hash mismatch (expected ${prevHash}, got ${entry.prev_hash})`);
  }

  if (entry.hash && !/^[a-f0-9]{64}$/i.test(entry.hash)) {
    errors.push(`${loc}: hash must be 64-char hex sha256`);
  }

  const expectedHash = hashEntry({ ...entry, prev_hash: prevHash });
  if (entry.hash && entry.hash !== expectedHash) {
    errors.push(`${loc}: hash invalid (expected ${expectedHash}, got ${entry.hash})`);
  }

  return { errors, hash: entry.hash || expectedHash };
}

// ─── CLI ────────────────────────────────────────────────────────────────────

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const file = process.argv[2] || "journal.ndjson";
  const lines = readFileSync(file, "utf8").trim().split("\n").filter(Boolean);

  let allErrors = [];
  let prevHash = GENESIS_HASH;
  let i = 0;

  for (const line of lines) {
    i++;
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      allErrors.push(`Line ${i}: invalid JSON`);
      continue;
    }

    const { errors, hash } = validateEntry(entry, prevHash, i);
    allErrors.push(...errors);
    prevHash = hash;
  }

  if (allErrors.length === 0) {
    console.log(`✅  ${i} entr${i === 1 ? "y" : "ies"} — valid`);
    process.exit(0);
  } else {
    console.error(`❌  ${allErrors.length} error(s) in ${i} entries:`);
    allErrors.forEach(e => console.error("  " + e));
    process.exit(1);
  }
}
