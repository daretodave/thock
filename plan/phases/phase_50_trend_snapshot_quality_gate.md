# Phase 50 — Trend-snapshot data-quality gate

> **Status:** pending
> **Score:** 7.5 (pass-207 candidate, 25 instances confirmed through pass 319)

## Outcome

`scripts/trend-snapshot-quality-check.mjs` mechanically enforces four
cross-reference invariants over `data/trends/*.json` that nothing currently
checks: vendor/group-buy name spelling, articleSlug topical relevance,
note-vs-record status agreement, and direction/spark-array mathematical
consistency. `skills/march.md` Step 0.5 runs it immediately after every
Monday snapshot write and **hard-fails the snapshot commit on errors** — the
same "catch it at the source, not three iterate ticks later" shape as
phases 36/38/41/42.

## Why

The trend snapshot is scout-authored prose over a strict schema
(`TrendRowSchema`) every week, with no mechanical check that the prose and
the numbers agree with each other or with the rest of `/data`. Four gaps
identified across expand passes 207–319:

1. Vendor/group-buy names drift in casing inside `note` prose (e.g. a note
   spells a vendor's name differently than its canonical `data/vendors/
   <slug>.json` record).
2. `articleSlug`, when set, is supposed to link to an article that actually
   covers the row's topic — nothing confirms the link is topical rather than
   stale/copy-pasted.
3. Notes that describe a linked group buy's status ("closed", "now live")
   can drift out of sync with the group-buy record's own `status` field
   after the note is written and the record is later updated (or vice
   versa).
4. `direction` is a human categorical judgment; `spark` is the numeric
   history. The two can silently disagree, and week-over-week `spark`
   arrays are supposed to be shift-and-append continuous (this week drops
   the oldest point and appends the newest) — a broken chain means a
   snapshot was authored without reading the prior week's data.

## Scope

### 1. `scripts/trend-snapshot-quality-check.mjs`

Loads every `data/trends/*.json` (sorted filename order = chronological,
matching `tracker-linkage-survey.mjs`'s own convention), every
`data/vendors/*.json`, every `data/group-buys/*.json`, and reads MDX article
files directly from `apps/web/src/content/articles/` (frontmatter + body,
via the same hand-rolled parser shape as `article-crosslink-survey.mjs` —
no framework import from a `.mjs` script). Four independent checks, each
returning its own violation list:

**Check A — name-casing drift.** Canonical name list = every
`data/vendors/*.json` `name` field + every `data/group-buys/*.json` `name`
field, **excluding `"Drop"`** (a real vendor name that collides with the
common English word "drop" — "stock drop", "score drop" — which false-
positived 100% of the time in a corpus dry run; documented exclusion, not a
gap). For each canonical name, whole-word case-insensitive search over each
row's `note`; any match whose case doesn't exactly equal the canonical
spelling is a violation.

**Check B — articleSlug topical relevance.** When `row.articleSlug` is set,
load the article file. Tokenize `row.name` into lowercase keywords (split
on non-alphanumerics, drop tokens < 3 chars and a small stopword list).
Violation if **none** of those keywords appear anywhere in the lowercased
full file content (frontmatter + body — title/tags-only produced false
positives in a corpus dry run for legitimately-linked articles that name
the topic only in body prose, e.g. `vendor-first-customs.mdx` naming
"Wuque"/"Prototypist" in prose, not tags).

**Check C — status-claim agreement.** Build a `relatedArticle → group-buy
record` map from `data/group-buys/*.json` (Phase 37 field). For rows whose
`articleSlug` matches a key in that map: only proceed if the `note` text
actually mentions the group buy's own name (keyword-gated — vendor rows
routinely discuss multiple concurrent buys in one note, and an ungated date/
status check false-positived on *other* buys mentioned in the same note in
a corpus dry run). When gated in, check the note for closing-language
(`closed`, `wrapped up`, `has ended`, `now ended`) against
`status ∈ {closed, shipped}`, and for opening-language (`now live`, `just
opened`, `opens `, `open for orders`) against `status ∈ {live, announced}`.
Mismatch is a violation. **No date-arithmetic sub-check** — an earlier date-
extraction-vs-`startDate`/`endDate` design produced 14/14 false positives
in a corpus dry run (notes cite dates for other concurrently-running group
buys far more often than the linked one) and was dropped as unreliable.

**Check D — direction/spark consistency**, two sub-checks:
- *Sign agreement:* `delta = spark[last] - spark[secondLast]`. For
  `direction ∈ {up, down}`, the sign must strictly match (including
  `delta === 0`, which contradicts a claimed move). For `direction ===
  'flat'`, tolerate `|delta| ≤ 2` — small week-over-week wobble is within a
  scout's normal "plateau" judgment (confirmed against the full corpus:
  zero strict up/down contradictions exist today, but a `flat`-with-zero-
  tolerance policy flags 51/268 rows as noise; `|delta| ≤ 2` leaves exactly
  one real corpus violation).
- *Shift-and-append continuity:* for each pair of chronologically adjacent
  snapshot files (adjacent in the sorted file list), match rows by
  normalized topic key (same `normalizeTopicKey` shape as
  `tracker-linkage-survey.mjs` — lowercase, collapse `X / Y` → `X/Y`,
  collapse whitespace). Where both snapshots carry the same topic, the
  later `spark` must equal the earlier `spark.slice(1)` with exactly one
  new value appended. Confirmed holding for every matched pair in the
  existing corpus — this is a floor, not a change.

Modes (matching the established survey shape):
- **Dry-run** (default): prints violations; exit 1 if any, 0 if clean.
- **`--write`**: appends `data` AUDIT rows (deduplicates against existing
  rows keyed on `<isoWeek> <row.name> — <violation-type>`); exit 0.
- **`--json`**: `{ "violations": [...] }`, each tagged with `check` (`A`–
  `D`) and `isoWeek`; exit 0.
- **`--file <path>`**: scope checks A/B/C/D-sign to a single snapshot file
  (used by the march Step 0.5 hard gate — the continuity sub-check still
  needs the prior week's file, read directly). Combines with all modes.

AUDIT row scores (`impact × ease / 10`, one shape per violation type):
- Check A (casing): impact 3, ease 9 → **2.7**.
- Check B (topic mismatch): impact 5, ease 6 → **3.0**.
- Check C (status-claim mismatch): impact 6, ease 8 → **4.8**.
- Check D-sign (direction contradiction): impact 4, ease 9 → **3.6**.
- Check D-continuity (fabricated discontinuity): impact 7, ease 5 → **3.5**.

### 2. Unit tests: `scripts/__tests__/trend-snapshot-quality-check.test.mjs`

One `node:test` file, one positive + one control case per check (8 cases
minimum):
- Check A: canonical-cased mention (no violation) vs. wrong-cased mention
  (violation); confirms `"Drop"` is excluded from the canonical list.
- Check B: keyword present in body (no violation) vs. keyword absent from
  full content (violation).
- Check C: name-gated note with matching status language (no violation) vs.
  mismatched status language (violation); confirms an ungated note
  mentioning a *different* buy's status doesn't false-positive.
- Check D-sign: `flat` with `|delta| = 1` (no violation) vs. `up` with
  `delta = 0` (violation); `|delta| = 3` on `flat` (violation, over
  tolerance).
- Check D-continuity: valid shift-and-append pair (no violation) vs. a
  fabricated discontinuity (violation).

### 3. `skills/march.md` Step 0.5 amendment

After the Monday snapshot file is written (between the existing Step 3 and
Step 4), run:

```bash
node scripts/trend-snapshot-quality-check.mjs --file "data/trends/${CURRENT_WEEK}.json"
```

**This is a hard gate, not a survey** — non-zero exit blocks the snapshot
commit. Read the violations, patch the new snapshot file's `note`/
`direction`/`articleSlug` fields directly (this is a same-tick data fix,
not a follow-up AUDIT row — the file hasn't committed yet), and re-run.
Up to 3 iterations on the same root cause; beyond that, fall through to
`ship-a-phase` §10-shaped stop-and-report (cite the check, the row, and
what was tried).

Once the gated file passes, continue to Step 4 (commit) unchanged.

### 4. One-time corpus scan in the ship commit

```bash
node scripts/trend-snapshot-quality-check.mjs --write
```

Run once against the full existing corpus (all 15 `data/trends/*.json`
files, checks A/B/C/D). Files whatever residual AUDIT rows the corpus
scan turns up (non-blocking — this is historical data, not the gate).
Commit alongside the script.

## What ships in one commit

- `scripts/trend-snapshot-quality-check.mjs`
- `scripts/__tests__/trend-snapshot-quality-check.test.mjs`
- `skills/march.md` (Step 0.5 amendment)
- `plan/AUDIT.md` (residual rows from the one-time corpus scan, if any)

## Verify gate

`pnpm verify` — typecheck + test:run + test:scripts (new test) +
data:validate + build + e2e. No new routes, no schema change, no e2e
additions needed.

## Decisions standing

- `"Drop"` excluded from Check A's canonical-name list — common-word
  collision, confirmed 100% false-positive rate in a corpus dry run.
- Check B searches full file content (frontmatter + body), not just
  title/tags — title/tags-only produced false positives against real,
  correctly-linked articles.
- Check C has no date-arithmetic sub-check and is gated on the note
  mentioning the linked buy's own name — an ungated, date-comparing design
  produced a 14/14 false-positive rate in a corpus dry run (notes routinely
  cite dates for *other* concurrently-running buys).
- Check D-sign tolerates `|delta| ≤ 2` for `flat`-labeled rows — a
  zero-tolerance policy flagged 51/268 corpus rows as noise (normal
  editorial "plateau" judgment absorbing ±1–2 point week-over-week score
  wobble); `≤ 2` leaves exactly one real corpus violation and zero false
  positives.
- Adjacency for the continuity sub-check is sorted-file-list order, not ISO
  week arithmetic — matches `tracker-linkage-survey.mjs`'s own convention;
  a genuine gap week just skips continuity checking for that pair (reduced
  coverage, never a false positive).
- The march Step 0.5 amendment is a hard gate on the *newly written* file
  only; the corpus-wide `--write` scan is best-effort and non-blocking,
  matching every other survey script's contract.
