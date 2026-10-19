# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A 3.5-day API rate-limit storm knocked out both `march` and `night` for most of this window, and the loop's own crash-reporting swallowed almost all of it.** 25 consecutive `march` tick failures ran from 2026-10-15T17:58:34Z through 2026-10-19T05:39:53Z (all `api_error_status: 429`, 1-turn, sub-second-to-low-duration crashes), finally clearing at the 2026-10-19T12:00:10Z tick (success, no-op). The same storm hit `night` (this skill's own workflow): **4 consecutive failed digest ticks** on 2026-10-15/16/17/18, meaning this is the first digest to land since 2026-10-14. The standing `[score 6.0]` phase-candidate (open since 2026-09-20, diagnosing `march.yml`'s crash-issue dedupe blocking on a stale-but-open `#929`) turns out to generalize: `night.yml` carries the identical dedupe-on-title-search pattern, and issue `#1026` (filed for the first night crash, 10-15, still open+unlabeled) silently blocked new issues for the 10-16/17/18 crashes too. Net result: 85+ hours of repeated failures across two workflows produced exactly one GitHub issue. Appended fresh evidence to that candidate this tick (see Tuning proposals) — it has now sat fully cloud-actionable and unpromoted for 22 days.

**Before the storm hit, the loop was productive: 11 cross-link pairs drained across 3 hub articles.** `tmr-switches-deep-dive` (7 pairs, `6b5fb51e`), `switch-actuation-weight-buying-guide` (1 pair, `10f0ee9a`), and `tmr-switches-five-week-climb` (3 pairs, `6ef0321b`) all cleared between 2026-10-14T16:39 and 2026-10-15T03:16 — the last productive commits before the storm began at 17:58:34Z the same day. Nothing has shipped since.

**This tick's own fresh `pnpm verify` is fully green** — all 8 legs run as sequential foreground calls: typecheck, lint, 862 unit tests in `apps/web` (109 files; every other workspace's unit suite green too), 230 script tests, `data:validate` (91 records, cross-refs resolve), a clean production build, `size` within budget (largest tracked page 145.3 KB / 175 KB), and **1310/1310 e2e** (~8.3m) against `next start :4173`. `pnpm deploy:check` confirms `READY` at HEAD (`2a1a6827`) going into this tick.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-14 15:34 | *(last digest committed, `93d6b0c4`)* | baseline |
| 16:26→16:39 | cloud march | **shipped** — `tmr-switches-deep-dive` cross-links x7 |
| 20:24→20:41 | cloud march | **shipped** — `switch-actuation-weight-buying-guide` cross-links x1 |
| 23:38 | cloud march | no-op |
| 2026-10-15 03:01→03:16 | cloud march | **shipped** — `tmr-switches-five-week-climb` cross-links x3 |
| 08:47, 13:53 | cloud march | no-op (2 ticks) |
| 15:08 | night (digest) | **failed** — `is_error:true`, filed issue `#1026` |
| 17:58 → 2026-10-19 05:39 | cloud march | **25 consecutive failures** — `api_error_status: 429` |
| 10-16 14:56, 10-17 13:48, 10-18 14:04 | night (digest) | **failed** — same 429 shape; no new issues (dedupe blocked by open `#1026`) |
| 2026-10-19 12:00 | cloud march | success, no-op — storm cleared |
| 17:02 | night (this tick) | in progress |

Since the last digest: **6 completed `march` runs before the storm (5 success incl. 3 shipping, 1 no-op), 25 failures during the storm, 1 success after** = 32 completed `march` runs, 6 commits (3 content+audit pairs). **4 completed `night` runs: all 4 failed** before this tick. 2 `lighthouse` runs visible, both `skipped`. No new `heartbeat` alarm this window beyond the standing, likely-stale `#1027` (filed 2026-10-16, mid-storm — see Needs you).

## Shipped

**Three cross-link hub drains, 11 pairs total, all before the storm.** `content: tmr-switches-deep-dive cross-links — 7 pairs drained` (`6b5fb51e`) → `audit: … addressed in 6b5fb51e` (`ac364baa`); `content: switch-actuation-weight-buying-guide cross-links — 1 pair drained` (`10f0ee9a`) → `audit: … addressed in 10f0ee9a` (`40a71d21`); `content: tmr-switches-five-week-climb cross-links — 3 pairs drained` (`6ef0321b`) → `audit: … addressed in 6ef0321b` (`2a1a6827`).

Nothing else shipped in this window — the storm consumed the remaining ~3.5 days.

## Queues now

- **Build plan**: 0 pending phases, unchanged (50 phases shipped).
- **`plan/AUDIT.md`**: **16 open rows** (12 `[ ]` + 4 `[needs-user-call]`), down from 27 at the last digest. Breakdown of the 12: **6 `[cross-links] [4.5]`** — 3 on `synthwave-tkl-theme-build` (mirrored as issue `#1025`) and 3 fresh on `artisan-keycaps-buying-guide` ↔ beginner-tagged siblings (unmirrored); 1 `[newsletter] [4.0]` (issue 12 due — filed 2026-10-03, now **16 days** since issue 11 against a 7-day threshold); 1 `[data] [2.4]` (generated-manifest drift); 1 `[content] [2.4]` (plate-materials tension); 3 `[seo]` sub-3.0 rows unchanged (Mode Sonnet hero-art `[2.7]`/`[2.0]`, orphaned `favicon.svg` `[1.8]`). 4 `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z (pass 11, `931c8a7`) — **~162 days stale**. Root cause unchanged (cloud mode categorically cannot run `/critique` — no Chrome MCP on the runner); logging the running count, not re-diagnosing.
- **`plan/PHASE_CANDIDATES.md`**: last pass 436 (2026-10-01T…, commit `b4d8dafb`) — 18 days since any `/expand` pass ran, consistent with the dispatcher spending most of this window failing rather than reaching Step 3c. 35 `[ ]` + 1 `[needs-user-call]` pending, unchanged as distinct rows (one dated update appended this tick, no new row). Last promotion: phase 50, 2026-08-23 — now **~8.1 weeks**.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: `#1019` (newsletter dispatch, open since 2026-10-06T17:55, mirrors the 16-days-overdue AUDIT row); `#1025` (cross-link mirror, `synthwave-tkl-theme-build`, open since 2026-10-15T14:01, pre-storm, still undrained); `#1026` (night-crash, open since 2026-10-15T15:10, unlabeled — the dedupe-blocking issue, see Headline); `#1027` (heartbeat flatline alarm, filed 2026-10-16T04:26 mid-storm — likely describes the real failure cluster but with "flatlined" framing that undersells it; `march` was running every ~3h throughout, just failing); `#929` (`triage:reviewed`, standing since 2026-08-25, the original dedupe-blocker). 0 unlabeled issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential foreground calls per the skill's own instruction:

- `typecheck` — clean
- `lint` — clean
- `test:run` — 862/862 unit tests passed in `apps/web` (109 files); every other workspace's suite also green
- `test:scripts` — 230/230 script tests passed
- `data:validate` — 91 records valid, cross-refs resolve (vendors 11, switches 18, keycap-sets 10, boards 10, group-buys 18, trends 24)
- `build` — clean production build, full route manifest generated
- `size` — all tracked routes within budget (largest tracked: `/quiz/keycap-set` 145.3 KB vs 175 KB budget)
- `e2e` — **1310/1310 passed** (~8.3m) against `next start :4173`. Benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups during the run — not attached to any failing test, not filing.

No HIGH AUDIT row filed from the breadth check — nothing red. Deploy was `READY` at HEAD (`2a1a6827`) going into this tick.

## Needs you

1. **The march.yml/night.yml crash-issue dedupe bug is now confirmed to generalize across workflows and has sat fully cloud-actionable for 22 days.** This window alone cost 85+ hours of repeated, almost entirely unlogged failures on two separate workflows. The fix is a one-line dedupe-query narrowing, already fully diagnosed and traced in `plan/PHASE_CANDIDATES.md`'s standing `[score 6.0]` row (updated this tick with today's evidence). Recommend promoting at the next `/oversight` pass — this is costing real observability every time the API rate-limits, which just happened for 3.5 days straight.
2. **`plan/CRITIQUE.md` is ~162 days stale** — the fresh-eyes loop has been off for over five months, root cause unchanged (no Chrome MCP on the cloud runner) and sitting as a standing decision to make, not re-diagnosing further this tick.
3. **Newsletter cadence (`#1019`/AUDIT row) is now 16 days stale against a 7-day target**, unchanged mechanism to the one flagged in prior digests — worth an `/oversight` call on the bounded-priority-override proposal rather than waiting indefinitely.
4. **35 pending phase-candidate rows, ~8.1 weeks since the last promotion** — cloud cannot promote by design. Worth a batch `/oversight` pass.
5. **Issue `#1027` ("heartbeat has flatlined") likely mischaracterizes what was actually a 25-failure `march` storm, not a flatline** — worth a `/triage` look to close or relabel with the correct framing once the fix in item 1 is considered.

## Today's intent

With the storm cleared and both workflows back to green, the next `march` tick's top signal should be the 6 open cross-link rows (ease 9 each, same cluster-aware drain pattern that cleared 11 pairs just before the storm) unless the newsletter row or a fresh content-gap row wins the dispatch instead. Watch whether `march` resumes its pre-storm cadence and whether `#1019` finally ships now that nothing is actively failing ahead of it.

## Tuning proposals

**One dated update, no new candidates.** Appended an update to the standing `[score 6.0]` "march.yml crash-issue dedupe" candidate in `plan/PHASE_CANDIDATES.md`, generalizing its diagnosis to `night.yml` with this window's concrete numbers: 25 unlogged `march` failures, 3 unlogged `night` failures (only the first of 4 produced an issue), and the compounding fact that the fix has been fully cloud-actionable since 2026-09-27 (22 days) without promotion. Not re-scoring unilaterally, per the meta-loop rail — logged as evidence for `/oversight`, not a self-promotion.
