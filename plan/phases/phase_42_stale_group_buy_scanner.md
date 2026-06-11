# Phase 42 — Stale group-buy status scanner

> **Status:** pending
> **Score:** 4.8 (pass-16 candidate)

## Outcome

`scripts/group-buy-status-check.mjs` mechanically enforces data hygiene for
group-buy records: any record with `status ∈ {live, announced}` whose `endDate`
is in the past is a staleness violation. The script files a `data` AUDIT row so
the next `/ship-data` tick corrects the status field before readers see a
stale "LIVE" pill on `/group-buys` or `/group-buys/past`.

## Why

The expand pass-16 notes (pass 123 in PHASE_CANDIDATES.md) identified that
`prussian-alert` (endDate 2026-06-12) would be the first real-world trigger for
this gap: after the endDate passes, the `/group-buys` page would render a "LIVE"
pill on a closed buy. The site's `getAllClosedGroupBuys()` loader handles the
display logic correctly (endDate < today → archive), but the data record itself
still shows `status: "live"` — a hygiene gap visible in the raw data and in any
consumer that reads the status field directly. This script closes the gap with
the same mechanical-enforcement shape as phases 38–41.

## Scope

### 1. `scripts/group-buy-status-check.mjs`

Scans all `data/group-buys/*.json` records:

- Loads each record.
- Flags records where:
  - `status ∈ {live, announced}`, AND
  - `endDate` is set AND `new Date(endDate) < today`
- Deduplicates by slug (one AUDIT row per unique slug).

Modes:
- **Dry-run** (default): prints flagged slugs; exits 1 if any, 0 if clean.
- **`--write`**: appends `data` AUDIT rows (deduplicates against existing rows); exits 0.
- **`--json`**: `{ "stale": [...] }`; exits 0.

AUDIT row format (impact 4, ease 9, score 3.6):
```
### [ ] [data] [3.6] <slug> — status stale, endDate <YYYY-MM-DD> passed
- category: data
- filed: <date> by group-buy-status-check.mjs
- impact: 4 (buy shows status "<status>" but endDate <YYYY-MM-DD> has passed — data hygiene gap)
- ease: 9 (update status field to 'closed' in data/group-buys/<slug>.json)
- score: 3.6 (impact × ease / 10)
- group-buy: data/group-buys/<slug>.json
- action: update status from '<status>' to 'closed' in data/group-buys/<slug>.json
```

### 2. Unit test: `scripts/__tests__/group-buy-status-check.test.mjs`

One `node:test` test file; covers:
- `status: "live"` with `endDate` in the past → stale violation detected
- `status: "live"` with `endDate` in the future → no violation
- `status: "live"` with no `endDate` set → no violation (open-ended)
- `status: "closed"` with past `endDate` → no violation (already correct)
- `alreadyFiled` dedup check

### 3. `skills/march.md` Step 3b.5a amendment

After the group-buy companion survey, add:

```bash
node scripts/group-buy-status-check.mjs --write
```

If it files new rows, log them and continue. Non-zero exit → log and continue.
The scanner is best-effort.

### 4. `skills/ship-data.md` Step 4c amendment

After writing/updating a group-buy JSON record (after Step 4b), run:

```bash
node scripts/group-buy-status-check.mjs --write
```

If the record's `endDate` has already passed with a live/announced status, a
AUDIT row files immediately. Best-effort; not blocking.

## What ships in one commit

- `scripts/group-buy-status-check.mjs`
- `scripts/__tests__/group-buy-status-check.test.mjs`
- `skills/march.md` (Step 3b.5a amendment)
- `skills/ship-data.md` (Step 4c amendment)

## Verify gate

`pnpm verify` — typecheck + test:run (new test) + data:validate + build + e2e.
No new routes, no schema change, no e2e additions needed.

## Decisions standing

- Score 3.6 (impact 4, ease 9) chosen to match the data-hygiene tier: lower than
  the Rule 3 companion survey (7.0) because a stale status field is a data-quality
  issue rather than a missing editorial piece, and `getAllClosedGroupBuys()` already
  handles display correctly — the site renders correctly, the raw data doesn't.
- No-endDate records are not flagged: open-ended buys (no defined close date) are
  valid and should not trigger hygiene rows.
- Status update target is always `"closed"` (not `"shipped"`): the distinction
  between "closed" (order window ended, buy in production) and "shipped" (kits
  delivered) is not automatically detectable; the script flags to "closed" and a
  human or subsequent `/ship-data` tick can refine to "shipped" with evidence.
