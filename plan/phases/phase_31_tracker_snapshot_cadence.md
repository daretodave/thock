# Phase 31 — Trends Tracker Phase B: automated weekly snapshot cadence

> **Time-critical.** ISO week 21 starts 2026-05-18. The tracker freezes
> at W20 unless the snapshot system ships before Monday's cloud tick.

## Outcome

The Trends Tracker never goes stale. Every Monday the hourly cloud loop
detects the missing week snapshot and generates it inline — no new
workflow, no new secret, no `workflows:write` grant.

## Why this phase

Phase 27 shipped the `/trends/tracker/[week]` archive surface and the
`TrackerArchiveStrip`. Both read from `data/trends/<YYYY-WNN>.json`
files. With only W19 and W20 on disk, the tracker freezes at W20 the
moment W21 begins (2026-05-18). Phase 31 adds the automation that keeps
the data current indefinitely.

Path locked at /oversight 2026-05-16: amend `skills/march.md` with a
Monday gate (Step 0.5) — the hourly cloud loop already runs through
Monday 00:00–23:00 UTC; no new workflow needed.

## Deliverables

### 1. `skills/march.md` — Step 0.5 Monday snapshot gate

After Step 0 (git pull) and before Step 1 (triage), insert:

```
Step 0.5 — Weekly snapshot gate

Compute today's ISO week (YYYY-WNN) via:

  CURRENT_WEEK=$(node scripts/iso-week.mjs)
  IS_MONDAY=$(node -e "console.log(new Date().getDay()===1?'yes':'no')")

If IS_MONDAY=yes AND data/trends/${CURRENT_WEEK}.json does not exist:
  - Spawn scout: research this week's switch/keycap/layout/vendor/brand
    movers (12–18 rows). Scores −100..100, direction up/down/flat, 8-point
    spark array, articleSlug or null, note 20–280 chars.
  - Write data/trends/${CURRENT_WEEK}.json (schema: TrendSnapshotSchema).
  - pnpm verify (typecheck → test → data:validate → build → e2e).
  - Commit via ship-data conventions (subject: "data: trend snapshot YYYY-WNN").
  - git push origin main.
  - Return (skip triage and subsequent steps this tick).

If IS_MONDAY=no OR snapshot already exists, fall through to Step 1.
```

### 2. `scripts/iso-week.mjs`

Zero-dependency ESM script that prints the current ISO 8601 week string
(e.g. `2026-W21`). Used by the march Step 0.5 shell expansion.

### 3. Unit test: `packages/data/src/__tests__/loaders/trends.test.ts`

Verifies that `getAllTrendSnapshots()` returns snapshots in isoWeek-
ascending order (guaranteeing `getLatestTrendSnapshot()` = last entry,
and `TrackerArchiveStrip`'s `.reverse()` gives newest-first).

### 4. `data/trends/2026-W21.json`

Scout-generated snapshot for ISO week 21 (May 18–24, 2026). Ships as
part of this phase so the tracker does not freeze at W20. Future weeks
are generated automatically by the Monday gate.

## Schema reference

```json
{
  "isoWeek": "YYYY-WNN",
  "publishedAt": "ISO datetime (Monday 00:00:00.000Z)",
  "rows": [
    {
      "name": "string 2–80",
      "category": "switch|keycap|layout|vendor|brand",
      "direction": "up|down|flat",
      "score": -100..100,
      "spark": [8 integers],
      "articleSlug": "slug-string | null",
      "note": "20–280 char plain text"
    }
  ],
  "updatedAt": "ISO datetime"
}
```

## Decisions

- **Monday gate placed at Step 0.5** (before triage) because a missing
  snapshot is higher-priority than unlabeled issues — the tracker is
  the site's signature feature.
- **`scripts/iso-week.mjs`** is a standalone ESM script (not a package
  module) because the march.md step runs it via `node scripts/iso-week.mjs`
  from the repo root without any bundling.
- **Hall Effect / Rapid Trigger recategorized to 'switch'** (not 'layout')
  because the tracker's 'layout' category captures physical form factors;
  HE is a switch technology. Scout's editorial note acknowledged the ambiguity.
- **W21 data ships now** (Friday May 16) rather than waiting for Monday's
  gate because the phase itself is time-critical and the gate needs at
  least one Monday tick to fire before W21 data would otherwise be generated.

## Verify gate

```
pnpm verify
```

`typecheck → test:run → data:validate → build → e2e`

The data:validate step will validate 2026-W21.json against TrendSnapshotSchema.
The unit test verifies ascending sort order. E2e smoke walker covers
`/trends/tracker/2026-W21` automatically via `generateStaticParams`.
