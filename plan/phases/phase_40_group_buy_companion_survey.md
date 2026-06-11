# Phase 40 — Group-buy Rule 3 companion survey

> Deterministic automation for bearings.md Rule 3: every `live` or
> `announced` group-buy record must have a companion editorial piece.
> Phase 37 shipped `relatedArticle` on the schema; this phase ships
> the survey script that mechanically audits the gap.

## Outcome

`scripts/group-buy-companion-survey.mjs` runs at every tick (Step
3b.5a of `skills/march.md`) and after every new group-buy record
ships (Step 4b of `skills/ship-data.md`). When a `live` or
`announced` record lacks `relatedArticle`, the script files a
`content-gaps` AUDIT row (impact 7, ease 5, score 7.0) so the next
`/ship-content` tick produces the companion article automatically.

## Why

Rule 3 (bearings.md §Content velocity) is manually enforced today.
Five group-buy companion articles shipped between May 10–11 to drain
a backlog of manually-spotted gaps. Without automation:
- A newly added group-buy record silently violates Rule 3 until an
  iterate audit or oversight pass manually notices.
- The drift period can be days or weeks.

Phase 37 made `relatedArticle` a first-class schema field; Phase 40
makes the absence of that field a filed AUDIT row within the same
loop tick.

## Scope

### 1. `scripts/group-buy-companion-survey.mjs`

Reads every `data/group-buys/*.json`. Flags records where:
- `status ∈ {live, announced}`
- `relatedArticle` is absent or null

Three modes:
- **dry-run** (default): prints flagged slugs + exit 1 if any,
  exit 0 if clean.
- **`--write`**: appends AUDIT rows to `plan/AUDIT.md`.
  Deduplicates: skips a slug already present in AUDIT.md.
  Exit 0.
- **`--json`**: prints `{ "missing": [...] }`. Exit 0.

AUDIT row format for each flagged record:
```
### [ ] [content-gaps] [7.0] <vendor-slug>-<slug> — Rule 3 companion article missing
- category: content-gaps
- filed: <ISO-date> by group-buy-companion-survey.mjs
- impact: 7 (live/announced group buy has no thock companion piece;
  /group-buys card has no "Read our coverage →" link)
- ease: 5 (one companion article + relatedArticle field update)
- score: 7.0
- group-buy: data/group-buys/<vendor>-<slug>.json
- action: ship companion article for <name>, then set relatedArticle
  field in the group-buy record
```

Exports `__test` object for unit tests (same pattern as phases 36–39).

### 2. `scripts/__tests__/group-buy-companion-survey.test.mjs`

node:test unit tests (no devDeps):
1. **Violation** — live record without `relatedArticle` → flagged.
2. **No-violation (closed)** — closed record without `relatedArticle`
   → not flagged (rule is forward-looking only).
3. **No-violation (has relatedArticle)** — live record with
   `relatedArticle` set → not flagged.

### 3. `skills/march.md` amendment — Step 3b.5a

After the cross-link survey block, add:

```bash
node scripts/group-buy-companion-survey.mjs --write
```

Best-effort: if it exits non-zero, log and continue. Then fall through.

### 4. `skills/ship-data.md` amendment — new Step 4b

After Step 4 (write the JSON), when adding a `group-buys` record:

> After writing the JSON, run `node scripts/group-buy-companion-survey.mjs --write`.
> If the new record is `live` or `announced` without `relatedArticle`,
> the script files the AUDIT row in the same commit (via `--write`).
> Best-effort: failure does not block the ship-data tick.

## Not in scope

- No new route or UI change.
- No schema change (relatedArticle already optional in GroupBuySchema).
- No e2e test (the script is a CLI utility; unit tests suffice).

## Definition of done

- `scripts/group-buy-companion-survey.mjs` exits 0 clean on current
  corpus (all live records have relatedArticle).
- 3 unit tests green.
- `skills/march.md` Step 3b.5a amended.
- `skills/ship-data.md` Step 4b added.
- `pnpm verify` green.

## Files

```
scripts/group-buy-companion-survey.mjs           new
scripts/__tests__/group-buy-companion-survey.test.mjs  new
skills/march.md                                  amended (Step 3b.5a)
skills/ship-data.md                              amended (Step 4b)
plan/phases/phase_40_group_buy_companion_survey.md  this file
```
