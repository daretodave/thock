# Phase 41 — Tracker Rule 2 linkage survey

> **Status:** pending
> **Score:** 5.5 (pass-13 candidate)
> **Mirrors:** GitHub issue #321

## Outcome

`scripts/tracker-linkage-survey.mjs` mechanically enforces bearings.md Rule 2:
every trend row with `direction !== 'flat'` must have its `articleSlug` populated
within 14 calendar days of first appearing in any snapshot. When the clock expires,
the script files a `content-gaps` AUDIT row so the next `/ship-content` tick
commissions the companion piece.

## Why

Rule 2 existed in bearings.md since phase 8 but had no mechanical enforcement.
The gap between "rule written" and "rule enforced" is the same pattern phases 38–40
fixed for mentionedParts, cross-links, and group-buy companions. This script
closes the last remaining human-only enforcement gap in the automation suite.

## Scope

### 1. `scripts/tracker-linkage-survey.mjs`

Scans all `data/trends/*.json` snapshots:

- Builds a map: `topic name → { firstSeenNonFlat: Date, hasArticleSlug: bool }`
  - "first seen non-flat" = earliest snapshot where `direction !== 'flat'` for this topic
  - "has article slug" = true if ANY snapshot has `articleSlug` set for this topic
- Filters topics where `hasArticleSlug === false` AND `(today - firstSeenNonFlat) > 14 days`
- Deduplicates by topic name (one AUDIT row per unique name)

Modes:
- **Dry-run** (default): prints flagged topics; exits 1 if any, 0 if clean
- **`--write`**: appends `content-gaps` AUDIT rows (deduplicates against existing rows); exits 0
- **`--json`**: `{ "missing": [...] }`; exits 0

AUDIT row format (score 5.5, impact 6, ease ~9):
```
### [ ] [content-gaps] [5.5] <name> — Rule 2 tracker linkage missing
- category: content-gaps
- filed: <date> by tracker-linkage-survey.mjs
- impact: 6 (non-flat trend row unlinked >14 days; no companion deep-dive)
- ease: 9 (one article fills it; topic already editorially curated in tracker)
- score: 5.5 (impact × ease / 10, rounded)
- first-seen: <YYYY-WNN>
- rule: Rule 2
- action: ship companion article for "<name>", set articleSlug in relevant trend snapshot(s)
```

### 2. Unit test: `scripts/__tests__/tracker-linkage-survey.test.mjs`

One `node:test` test file; covers:
- Topic first-seen >14 days ago, no articleSlug → violation detected
- Topic first-seen >14 days ago, has articleSlug in later snapshot → no violation
- Topic first-seen <14 days ago, no articleSlug → no violation (clock not expired)
- `alreadyFiled` dedup check

### 3. `skills/march.md` Step 0.5 amendment

After the Monday snapshot is committed and pushed, run:

```bash
node scripts/tracker-linkage-survey.mjs --write
```

If it files new rows, commit them:
```bash
git add plan/AUDIT.md
git commit -m "audit: tracker Rule 2 gaps filed by tracker-linkage-survey.mjs

Cloud-Run: <run-url>"
git push origin main
```

If it exits clean or non-zero, log and continue to Step 1.

## What ships in one commit

- `scripts/tracker-linkage-survey.mjs`
- `scripts/__tests__/tracker-linkage-survey.test.mjs`
- `skills/march.md` (Step 0.5 amendment)
- `plan/steps/01_build_plan.md` (phase 41 ticked)

## Verify gate

`pnpm verify` — typecheck + test:run (new test) + data:validate + build + e2e.
No new routes, no schema change, no e2e additions needed.

## Decisions standing

- Score 5.5 chosen to match the pattern from Phase 39 (cross-link survey) and Phase 40
  (group-buy companion survey) at score 5.5 for the same impact/ease profile.
- "First seen non-flat" rather than "first seen in any direction" — flat rows are editorial
  noise until they move; the 14-day clock should start at the first signal of a trend.
- If a topic oscillates (non-flat → flat → non-flat across weeks), the clock resets to the
  latest non-flat first-appearance. The survey computes: for all snapshots where the topic
  was non-flat AND unlinked, the earliest such snapshot date.
