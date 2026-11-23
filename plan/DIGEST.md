# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet window with one structural event: the aged-promotion valve fired for the first time since 2026-11-16, pulling "Heading-semantics coverage check" off the candidate queue into spec 12, held behind a 1-day veto window (`#1095`, closes 2026-11-24).** Since the last digest (`cf087d6a`, 2026-11-22T18:16:01Z): cloud `march` fired three times — two clean no-ops (21:29→21:30 UTC, 02:11→02:12 UTC) and one that shipped `7e8a42e9` (11:44→12:01 UTC), `promote_queue_depth: 2` with only 1 open spec (11, held) tripping the aged-promotion path for the top-scored Pending candidate (score 6.0, 113 days old — the heading-semantics defect that four independent reactive fixes had already caught one surface at a time). No `/expand`, `/critique`, or `/iterate` work landed this window — both `#1068` and `#1092` remain open with no owner comment, so the plan's only non-held chunk (`11.1`) stayed blocked all window. Tonight's own breadth pass is fully green: `pnpm verify` run as eight sequential foreground legs — typecheck, lint, `test:run` (1347 tests: 929 web + 167 content + 156 data + 46 seo + 32 ui + 11 tokens + 6 e2e-unit), `test:scripts` (504/504), `data:validate` (96 records, cross-refs resolve), `build`, `size` (all 6 budgeted routes under budget) — plus `pnpm e2e` (1770/1770, 9.5m, every canonical URL; see Tuning proposals — this *is* the full-corpus crawl, not a smaller per-commit sample). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `stale-updated-at-check.mjs --write`, and `truncation-call-site-check.mjs --write` all came back clean — every mismatch each found (4, 0, 4, 98, 0 respectively) was already filed in `plan/AUDIT.md`, so no new rows this tick. `pnpm deploy:check` confirmed `READY` at HEAD (`7e8a42e9`) going into tonight's breadth pass. One new tuning proposal filed below: the `SMOKE_SAMPLE=full` nightly-breadth split this skill's own step 3 describes was never actually wired into the e2e suite.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-22 18:16 | *(last digest committed, `cf087d6a`)* | baseline |
| 2026-11-22 18:16 → 21:29 | *(no scheduled fire logged)* | **quiet** — ~3.2h gap, no error signal |
| 2026-11-22 21:29 → 21:30 | cloud `march` (scheduled) | **no-op** — clean `success`, 51s, nothing to ship |
| 2026-11-22 21:30 → 2026-11-23 02:11 | *(no scheduled fire logged)* | **quiet** — ~4.7h gap, no error signal |
| 2026-11-23 02:11 → 02:12 | cloud `march` (scheduled) | **no-op** — clean `success`, 62s, nothing to ship |
| 2026-11-23 02:12 → 11:44 | *(no scheduled fire logged)* | **quiet** — ~9.5h gap, no error signal |
| 2026-11-23 11:44 → 12:02 | cloud `march` (scheduled) | **shipped** — `/march` Step 0 aged promotion: candidate "Heading-semantics coverage check" [score 6.0, 113d] → spec 12, Held behind veto `#1095` until 2026-11-24 (`7e8a42e9`) |
| 2026-11-23 12:02 → (now) | night (this tick) | in progress |

Since the last digest: **1 commit shipped**, via cloud `march` (3 workflow runs, 1 shipped a commit, 2 clean no-ops), 0 local owner commits, 0 candidates filed by `/expand` (one Pending candidate consumed via aged auto-promotion instead of a fix landing), 0 critique findings filed, 0 AUDIT changes, 0 failed ticks (all three workflow runs report `success`), 0 reverts.

## Shipped

- `7e8a42e9` — plan: depth promotion — `promote_queue_depth: 2` with only spec 11 open (held) tripped `/march` Step 0's aged-promotion path. Top-scored Pending candidate ("Heading-semantics coverage check," score 6.0, proposed 2026-08-02, 113 days old) promoted to spec 12 (`plan/12-heading-semantics-coverage-check.md`). Veto issue `#1095` open; Held in `plan/README.md` until 2026-11-24 (max_age 1d, fallback release).
- Tonight's breadth pass: `pnpm verify` run as 8 sequential foreground legs — typecheck, lint, `test:run` (1347 tests across 7 workspaces), `test:scripts` (504/504), `data:validate` (96 records), `build`, `size` (all 6 budgeted routes under budget) — plus `pnpm e2e` (1770/1770, 9.5m, every canonical URL). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `stale-updated-at-check.mjs --write`, `truncation-call-site-check.mjs --write` all clean — every mismatch found was already pending in `plan/AUDIT.md`, 0 new rows. `pnpm deploy:check` confirmed `READY` at HEAD before this tick's breadth pass began.

## Queues now

**plan:** 2 specs (11, held on `#1092`; 12, held on veto `#1095` until 2026-11-24), 1 chunk left by pulse's count (`11.1`) — still **Held**, since 2026-11-21, max_age 14d, expires 2026-12-05 — 0 chunks actually ready to pick. Spec 12's own chunks (7 by its progress count) don't show in pulse's "chunks left" number yet — same standing `pulse.mjs` held-counter undercount noted below.
**audit:** 141 total unresolved rows by hand count (2 `### ` rows under `## Pending` — `[needs-user-call]` `[HIGH]` `#1068`, `[user-issue #1092]` `[HIGH]` — plus 139 `### [ ]` rows under `## Open findings`: 101 `[seo]` — 98 at `[5.4]` stale-`updatedAt` rows plus 1 each at `[2.7]`/`[2.0]`/`[1.8]` — 26 `[cross-links] [4.5]`, 9 `[content] [3.6]`, 1 `[a11y] [3.5]`, 1 `[data] [2.4]`, 1 `[engineering]`) — unchanged from last digest (no AUDIT writes this window; tonight's five write-scripts all found only already-pending mismatches). Pulse's own "2 pending" still only matches the literal `## Pending` heading count, missing the 139-row `## Open findings` backlog — the standing `pulse.mjs` undercount bug (unpromoted score-4.0 candidate, filed 2026-11-09).
**critique:** 12 pending, last pass 38h ago (pass 21, 2026-11-22T07:50:12Z at `5b4e5402`) — no new pass this window (`/critique` wasn't dispatched; the one cloud tick that shipped ran `/march` Step 0's promotion path instead). The standing `[HIGH]` `/trends/tracker` Sleeper/Faller magnitude mismatch (pass 16/19) is still open, still no GitHub issue.
**candidates:** 12 pending (4 `>21d`, oldest 102d, "Catalog primary-source verification pass") — net +1 this window: the top-aged candidate ("Heading-semantics coverage check," 113d) was promoted out via the aged valve, and this digest files 1 new tuning proposal (`SMOKE_SAMPLE` gap, see Tuning proposals). Under `Promote: aged`, the valve is draining: `node scripts/plan/promote.mjs sweep` → **auto-promoted 12 "Heading-semantics coverage check" (veto until 2026-11-24, `#1095`)**, 12 awaiting. `node scripts/plan/promote.mjs cuts --since 2026-11-22` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **Standing — `[needs-user-call]` `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in `march.yml` run, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~16.8d old — still open, still `triage:needs-user`, 2 comments on the issue but both from the loop itself, no owner comment yet. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes `#1068`, max_age 14d) — **expires 2026-11-26, 3 days from now.**
- **Standing — `user-issue #1092`** (cloud `march` failed 2026-11-20 — `ACTIONS_PAT` push to `.github/workflows/march.yml` rejected "without `workflows` permission"): opened 2026-11-21T00:11Z, now ~70h/2.9d old, past the 24h SLA — still open, still `triage:needs-user`, 1 comment (the loop's own), no owner comment yet. Blocks chunk `11.1` (the plan's only non-held chunk) via its Held line (since 2026-11-21, max_age 14d, expires 2026-12-05).
- **oversight needed: candidate queue silting (4 pending >21d, oldest 102d)** — the oldest-pending threshold (>45d) still trips even though the >21d count sits at 4, below the ≥5 trigger. Standing condition, repeat observation from every digest since at least 2026-11-04; one candidate drained via the aged valve this window (see Queues now), but the oldest-pending age itself didn't move.
- No motion-stalled alert — shipped 13 last full week (2026-W47) vs. 16.75 baseline (2026-W43..46), floor 8.38 → reads `ok`; 0 shipped so far in the just-started 2026-W48.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **New this window:** the aged-promotion valve fired for spec 12 — a repo-admin decision point even though it's auto-promoted: closing `#1095` before 2026-11-24 vetoes the spec; leaving it open lets `/march` build it starting 2026-11-24.
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed.
- **Standing item, unchanged:** the AUDIT queue is still dominated by the 98 `[seo] [5.4]` stale-`updatedAt` rows (trivial frontmatter-date bumps) — the batching-gap candidate that would let `/iterate` drain them in one commit (score 5.6, filed 2026-11-21) is still unpromoted.

## Today's intent

0 chunks are actually ready to pick. `11.1` stays Held pending the `#1092` credential call; spec 12's chunks are Held behind the `#1095` veto window through 2026-11-24 — if that closes without a veto, the next dispatcher tick picks up spec 12's first chunk. Absent plan work, the AUDIT queue's top mechanical picks are unchanged from last digest: the 98 `[seo] [5.4]` stale-`updatedAt` rows, then the 26 `[cross-links] [4.5]` rows, then the 9 `[content] [3.6]` rows, then critique's remaining unscored `[HIGH]` finding (the `/trends/tracker` Sleeper/Faller mismatch), then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo]`/`[data] [1.8]`-`[2.7]` hero-art/favicon drift, `[engineering]` row).

## Tuning proposals

One new candidate filed tonight (`plan/CANDIDATES.md`, score 4.2, `kind: guard`): **`SMOKE_SAMPLE` nightly-breadth split was never wired.** This skill's own step 3 lists `SMOKE_SAMPLE=full pnpm e2e` as the nightly-only full-corpus leg, implying a smaller sample runs per-commit the rest of the time — but `grep -rln "SMOKE_SAMPLE"` across the repo returns zero hits outside `plan/DIGEST.md`/`skills/digest.md` themselves, and `apps/e2e/src/fixtures/canonical-urls.ts`'s `getCanonicalUrls()` reads no env var and always returns the full 1770-URL set. Tonight's plain `pnpm e2e` (no env var, the same leg every cloud `march` tick's `pnpm verify` already runs) produced the identical `1770 passed (9.5m)` count the "nightly full sample" language describes. `agents.md` §3 explicitly instructs moving O(content) per-URL breadth off the per-commit path onto a nightly job; that split doesn't exist in code, so every cloud tick (3-4/day this window) pays the full ~9.5-minute crawl, not just the nightly digest. Not self-fixing — per the meta-loop rail, this is a proposal for `/oversight` to pick between implementing the sample split or retiring the stale doc language, not something this tick should wire itself.
