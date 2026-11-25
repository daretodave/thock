# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Spec 12's veto window cleared clean, and the loop used it: one dispatch chain shipped a new mechanical survey, a chunk of heading-semantics fixes, and a critique pass, leaving spec 12 with exactly one chunk left and — for the first time in two digests — a chunk actually ready to pick.** Since the last digest (`1b1de287`, 2026-11-24T20:59:56Z): cloud `march` fired five times — a clean no-op at 03:20-03:25 (quota utilization 0.02, idle probe found nothing fresh to do), then a ~10.4h quiet gap, then a 4-run dispatch chain 13:50-16:21 that shipped all 11 commits of this window: `34bc406c` (veto sweep — vetoed 0, released 1, clearing spec 12's hold), `76b1b65e` (chunked spec 12), `27dd1a01` (critique pass 22 — 2 low findings), `b4f83950`→`34b2fc6e` (chunk 12.1: `heading-semantics-coverage-check.mjs` scanner, closed + settled), and `56fdb8a7`→`fd0b107f` (chunk 12.4: two a11y heading fixes, settled, plus a same-tick archive-SHA correction after a trailer rewrite). Tonight's own breadth pass is fully green: `pnpm verify` run as eight sequential foreground legs — typecheck, lint, `test:run` (1338 tests: 931 web + 167 content + 156 data + 46 seo + 32 ui + 6 e2e-unit), `test:scripts` (504/504), `data:validate` (97 records, cross-refs resolve), `build` (125 articles), `size` (6/6 budgeted routes under budget) — plus `pnpm e2e` (1778/1778, 7.0m, every canonical URL). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `stale-updated-at-check.mjs --write`, and `truncation-call-site-check.mjs --write` all came back clean — every flagged mismatch was already pending in `plan/AUDIT.md`, zero new rows filed. `pnpm deploy:check` confirmed `READY` at HEAD (`fd0b107f`) before the pass began. No new tuning proposal tonight.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-24 20:59:56 | *(last digest committed, `1b1de287`)* | baseline |
| 2026-11-24 20:59:56 → 2026-11-25 03:20 | *(no scheduled fire logged)* | **quiet** — ~6.3h gap, no error signal |
| 2026-11-25 03:20 → 03:25 | cloud `march` (scheduled) | **no-op** — quota utilization 0.02 (well under cap), idle probe found the repo unchanged with nothing fresh ready; clean exit, no error |
| 2026-11-25 03:25 → 13:50 | *(no scheduled fire logged)* | **quiet** — ~10.4h gap, no error signal |
| 2026-11-25 13:50 → 14:23 | cloud `march` (scheduled) | **shipped** — veto sweep: vetoed 0, released 1 (`34bc406c`, clearing spec 12's aged-promotion hold); spec 12 chunked (`76b1b65e`) |
| 2026-11-25 14:23 → 14:33 | cloud `march` (chained) | **shipped** — critique pass 22: 2 low findings (`27dd1a01`) |
| 2026-11-25 14:33 → 15:19 | cloud `march` (chained) | **shipped** — chunk 12.1: `heading-semantics-coverage-check.mjs` scanner (gate/`--write`/`--json`) shipped, closed, settled (`b4f83950`→`34b2fc6e`) |
| 2026-11-25 15:19 → 16:21 | cloud `march` (chained) | **shipped** — chunk 12.4: `/sources` row titles + suggested-switch-pairs titles get real headings, closed, settled, archive-SHA fix after a trailer rewrite (`56fdb8a7`→`fd0b107f`) |
| 2026-11-25 16:21 → (now) | night (this tick) | in progress |

Since the last digest: **11 commits shipped** across 4 cloud `march` runs chained from one dispatch (all `success`, all shipped) plus 1 clean no-op, 0 local owner commits, 0 candidates newly filed (no `/expand` fire this window), 0 new `plan/AUDIT.md` rows (tonight's breadth pass filed none — all clean or already pending), 0 failed ticks, 0 reverts.

## Shipped

- `34bc406c` — plan: veto sweep — vetoed 0, released 1 (spec 12's aged-promotion veto window closed without a veto).
- `76b1b65e` — plan: chunk spec 12 — heading-semantics coverage check.
- `27dd1a01` — critique: pass 22 — 2 findings (0 high, 0 medium, 2 low): an unexplained orange dot in the hero card's grid gap on `/` and `/news`, and a week/year label formatted two different ways between `/` and `/trends/tracker`.
- `b4f83950`→`34b2fc6e` — chunk 12.1: `heading-semantics-coverage-check.mjs` scanner shipped (gate/`--write`/`--json`, mirrors `og-coverage-check.mjs`'s shape), closed and settled.
- `56fdb8a7`→`fd0b107f` — chunk 12.4: `SuggestedSwitchPairs` and `SourceCounts` titles promoted to real `h3` headings (a11y), closed, settled; one follow-up commit fixed the archive line's SHAs after the chunk's own commit chain was rebuilt to add a missing `Cloud-Run:` trailer.
- Tonight's breadth pass: `pnpm verify` as 8 sequential foreground legs — typecheck, lint, `test:run` (1338 tests), `test:scripts` (504/504), `data:validate` (97 records), `build` (125 articles), `size` (6/6 under budget) — plus `pnpm e2e` (1778/1778, 7.0m, full canonical-URL crawl). All five mechanical survey scripts (`content-fact-audit`, `article-internal-consistency-check`, `group-buy-article-staleness-check`, `stale-updated-at-check`, `truncation-call-site-check`) ran `--write` clean — 0 new rows. `pnpm deploy:check` confirmed `READY` at HEAD (`fd0b107f`) before the pass began.

## Queues now

**plan:** 2 specs, 3 chunks left, 1 held — spec 11 (`11.1`, Held on `#1092` since 2026-11-21, max_age 14d, expires 2026-12-05) and spec 12 (2 chunks left: `12.2` unit tests + live-corpus regression gate — **ready, needs nothing** — and `12.3` wire `--write` into the survey chain + nightly digest, needs `12.2`). First ready chunk in two digests — the next dispatcher tick can pick `12.2` directly.
**audit:** 157 total unresolved rows by hand count — 2 under `## Pending` (`[needs-user-call]` `#1068`, `[user-issue #1092]`) + 155 under `## Open findings`: 102 `[seo]` (99 at `[5.4]` stale-`updatedAt` + 3 legacy at `[2.7]`/`[2.0]`/`[1.8]`), 41 `[cross-links]` `[4.5]`, 9 `[content]` `[~3.6]`, 1 `[a11y]` `[3.5]`, 1 `[data]` `[2.4]`, 1 `[engineering]`. Unchanged from last digest (157→157) — tonight's breadth pass filed nothing new.
**critique:** 14 pending, last pass ~5h ago (pass 22, 2026-11-25T14:30:33Z at `76b1b65e`). The standing `[HIGH]` `/trends/tracker` Sleeper/Faller magnitude mismatch (pass 16/19/21/22) is still open, still no GitHub issue.
**candidates:** 12 pending (4 `>21d`, oldest 104d, "ItemList JSON-LD parity check") — unchanged this window: no new candidates filed, none promoted, none cut. Under `Promote: aged`: `node scripts/plan/promote.mjs sweep` → **auto-promoted none, 0 awaiting** (spec 12's veto resolved by release, nothing else in the Held lane to sweep). `node scripts/plan/promote.mjs cuts --since 2026-11-24` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **Standing — `[needs-user-call]` `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in `march.yml` run, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~18.8d old — still open, still `triage:needs-user`, no owner comment yet. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes `#1068`, max_age 14d) — **expires 2026-11-26, tomorrow.**
- **Standing — `user-issue #1092`** (cloud `march` failed 2026-11-20 — `ACTIONS_PAT` push to `.github/workflows/march.yml` rejected "without `workflows` permission"): opened 2026-11-21T00:11Z, now ~4.8d old, past the 24h SLA — still open, still `triage:needs-user`, no owner comment yet. Blocks chunk `11.1` via its Held line (since 2026-11-21, max_age 14d, expires 2026-12-05).
- **oversight needed: candidate queue silting (4 pending >21d, oldest 104d)** — the oldest-pending threshold (>45d) still trips even though the `>21d` count sits at 4, below the ≥5 trigger. Standing condition, repeat observation from every digest since at least 2026-11-04; the queue didn't move this window.
- No motion-stalled alert — `pulse.mjs --motion` reports `shipped 13 / baseline 16.75 · 2026-W47 against 2026-W43..2026-W46`, `floor 8.38 · ok (50% of the baseline)`.
- No secrets-rotation note — `scripts/secrets.mjs audit` reports 0 events.
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed, now a fourth pass (16/19/21/22) citing it.
- **Standing item, unchanged:** the AUDIT queue's `[seo] [5.4]` stale-`updatedAt` cluster is still 99 rows — the batching-gap candidate that would let `/iterate` drain them in one commit (score 5.6, filed 2026-11-21) is still unpromoted.

## Today's intent

Chunk `12.2` (unit tests + live-corpus regression gate for `heading-semantics-coverage-check.mjs`) is ready to pick — needs nothing, no hold. `11.1` stays Held pending the `#1092` credential call. Once `12.2` lands, `12.3` (wire `--write` into the survey chain + nightly digest) unblocks and spec 12 closes out. Absent plan work, the AUDIT queue's top mechanical picks are unchanged in shape from last digest: the 99 `[seo] [5.4]` stale-`updatedAt` rows, then the 41 `[cross-links] [4.5]` rows, then the 9 `[content] [~3.6]` rows, then critique's remaining unscored `[HIGH]` finding (the `/trends/tracker` Sleeper/Faller mismatch), then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo]`/`[data]` `[1.8]`-`[2.7]` hero-art/favicon drift, `[engineering]` row).

## Tuning proposals

None new tonight. The standing unpromoted set is unchanged: stale-`updatedAt` cluster-drain mode (score 5.6), `march.yml` crash-dedupe (score 6.0), ItemList JSON-LD parity survey (score 6.0), read-time regression guard (score 6.0), catalog primary-source verification (score 6.0), `pulse.mjs` `pendingSection()` undercount (score 4.0), `pulse.mjs` held-line undercount (score 3.2), `SMOKE_SAMPLE` nightly-breadth split never wired (score 4.2). Tonight's breadth pass surfaced no new mistuned-gate signal.
