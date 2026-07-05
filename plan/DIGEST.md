# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet, healthy day with one real find.** 22 `march` ticks in the
last ~25 hours: 9 productive (a11y coverage completed across every
remaining route family — 404/not-found, quiz result-view with a
genuine `aria-prohibited-attr` fix, part-detail keycap-set/board —
plus a preventative `a11y-spec-coverage-check.mjs` gate, a W27
trend-snapshot backfill, and og-runtime unit coverage), 12 clean
no-ops, and **1 crash** (22:19 UTC — the `/march` action itself
failed after 2s with no transcript). Chasing that crash down
surfaced a real workflow bug: the crash-issue-opening gate
(`march.yml` steps 11–12) never actually fires when the action
step fails, because of GitHub Actions' implicit `success()` gate —
exactly the one case it exists to catch. Filed as a new `[score
6.0]` candidate below (see Tuning proposals). Full breadth `pnpm
verify` is green top to bottom, deploy is `READY` at HEAD. One open
issue (#391, dead CannonKeys vendor URL) is mid-flight — opened at
03:29 UTC per the "can't ship cleanly → open an issue" contract,
not yet fixed. `plan/CRITIQUE.md` is now 55 days / 1135 commits
since its last pass — unchanged diagnosis from yesterday (cloud
hard-skips `/critique` by design; still an `/oversight` question).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-04 09:43–10:01 | iterate | a11y drain — 9 more routes axe coverage added + audit-closed |
| 07-04 10:39–10:48 | expand | pass 142 — no candidates |
| 07-04 11:30–11:53 | iterate | engineering drain — og-runtime data adapter unit coverage + audit-closed |
| 07-04 12:26–12:30 | march | no-op |
| 07-04 13:31–13:41 | march | no-op |
| 07-04 14:32–15:00 | iterate | data drain — trends W27 snapshot backfilled (missed Monday cadence) + audit-closed |
| 07-04 15:25–15:52 | iterate | a11y drain — part-detail keycap-set/board axe coverage added + audit-closed |
| 07-04 16:22–16:26 | march | no-op |
| 07-04 17:23–17:27 | march | no-op |
| 07-04 18:22–18:29 | expand | pass 143 — no candidates |
| 07-04 19:29–19:32 | march | no-op |
| 07-04 20:21–20:24 | march | no-op |
| 07-04 21:20–21:24 | march | no-op |
| 07-04 22:19–22:20 | march | **crash** — `/march` action failed after 2s, no transcript produced; crash-issue gate silently didn't fire (see Headline + Tuning proposals) |
| 07-04 23:21–23:26 | march | no-op |
| 07-05 00:38–01:01 | iterate | a11y drain — 404/not-found route family (7 templates) axe coverage added + audit-closed |
| 07-05 01:35–02:00 | iterate | a11y drain — quiz result-view axe scan added, real `aria-prohibited-attr` bug fixed + audit-closed |
| 07-05 03:07–03:33 | iterate | issue #391 opened (dead CannonKeys vendor URL) — no fix shipped this tick, still open |
| 07-05 05:20–05:36 | expand | pass 144 — no candidates |
| 07-05 07:07–07:26 | expand | pass 145 — no candidates |
| 07-05 09:02–09:24 | iterate | engineering drain — `a11y-spec-coverage-check.mjs` gate shipped (drains the standing candidate) + audit-closed |
| 07-05 10:44–10:51 | expand | pass 146 — no candidates |

No unlabeled "Cloud march tick crashed" issue was opened for the
22:19 crash — that's the bug this digest found, not evidence the
crash was silently handled correctly.

## Shipped

- a11y: full-page axe WCAG coverage completed for every remaining
  route family — the 7 `404`/not-found templates, both quiz
  result-view states (surfacing and fixing a real
  `aria-prohibited-attr` violation on the match-score meter — a
  plain `<div>` with `aria-label` needed `role="progressbar"` +
  `aria-valuenow`/`min`/`max`), and the `/part/keycap-set/[slug]` +
  `/part/board/[slug]` detail templates.
- Engineering: `scripts/a11y-spec-coverage-check.mjs` — a
  preventative gate (mirroring `og-coverage-check.mjs`) that
  detects new canonical routes shipping without `a11y.spec.ts`
  coverage, closing out the standing `[4.5] a11y and e2e spec
  coverage gap detector` candidate that had recurred 4 times across
  expand passes 133–143. Also: `og-runtime` data-adapter unit
  coverage (9 tests).
- Data: `data/trends/2026-W27.json` backfilled (19 rows) — the
  Monday snapshot cadence gate missed W27 because its Monday
  (2026-06-29) fell inside the March outage window; caught and
  filed at impact 9.0 the same tick it was discovered.

## Queues now

- **Build plan**: 0 pending phases — pure `/iterate` maintenance
  mode since phase 17.
- **Cross-link drain**: 0 pending, unchanged.
- **`plan/AUDIT.md`**: 0 open rows — every finding from this window
  was audit-closed in the same tick that shipped its fix, except
  the still-open issue below.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC
  at commit `931c8a7`. **55 days / 1135 commits stale** (up from
  54/1118 yesterday — expected, not a regression; see yesterday's
  refined diagnosis, carried in the standing `[6.5] Critique gate
  diagnostic` candidate: cloud hard-skips `/critique` by design, so
  the real question is what local cadence should exist).
- **`plan/PHASE_CANDIDATES.md`**: 10 pending rows — net unchanged
  from yesterday (the `a11y and e2e spec coverage gap detector`
  candidate shipped directly via `/iterate` this window and is now
  marked `[x]`; this digest adds one new `[score 6.0]` candidate,
  the `march.yml` crash-issue-gate fix). Current set: Parts catalog
  third data pass (5.5), Tracker 8-week editorial analysis (5.0),
  `/quiz/board` (6.5), `/compare/keycap-set` (5.5), Vitest coverage
  CI gate (5.5), Critique gate diagnostic (6.5), **march.yml
  crash-issue gate (6.0, new)**, Tracker topic history page (4.5),
  ship-data entity-arrival mentionedParts rescan (5.5), Accessory
  parts kind (5.0).
- **`data/BACKLOG.md`**: 0 pending — all rows drained.
- **Triage**: 1 open issue — `#391` "fix: dead CannonKeys vendor
  URL on the only live group buy" (MED, `loop:opened` +
  `source:audit`, opened 2026-07-05T03:29 UTC, still unfixed as of
  this digest). 0 unlabeled, 0 `triage:needs-user`.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, sequential legs — all
green:

- `typecheck` — green, 8/8 workspace packages.
- `test:run` — green, 94 files / 590 tests.
- `test:scripts` — green, 57 suites / 156 tests.
- `data:validate` — green, 68 records (9 vendors, 18 switches, 10
  keycap-sets, 9 boards, 13 group-buys, 9 trend weeks), cross-refs
  resolve.
- `build` — green, no manifest churn this run.
- `size` — green, 108.5 KB / 200 KB homepage gzip budget (unchanged
  — no bundle-affecting shipped this window).
- `e2e` — green, 959/959 in 7.1m. Same benign `NoFallbackError`
  logged mid-run on `/trends/tracker/[week]` (expected 404-path
  behavior for a non-generated week param) as prior digests; did
  not fail any test.
- **Lighthouse**: no signal — workflow still `disabled_manually`
  (unchanged since 2026-06-14).
- `pnpm deploy:check` at HEAD (`175dd9e`) — deploy `READY`.

No red legs. No new AUDIT rows filed by this breadth check itself
(the crash-gate finding came from the pulse read, not the breadth
check).

## Needs you

1. **New: `march.yml` crash-issue gate has a workflow-level bug**
   (`[score 6.0]` candidate filed this pass). Steps 11–12 of
   `.github/workflows/march.yml` lack `always()` in their `if:`
   conditions, so GitHub Actions' implicit `success()` prepend
   skips them whenever the preceding "Run /march (cloud mode)"
   step fails — silently defeating the one case ("the action
   crashed before producing a transcript") the gate was written to
   catch. Confirmed by direct log inspection of run `28721452962`.
   Cheap, low-risk, 2-line fix; worth an early `/oversight` look
   given it affects the loop's own observability.
2. **Standing: refine or resolve the `[6.5] Critique gate
   diagnostic` candidate.** Unchanged from yesterday — the original
   diagnosis (a march Step 2 dispatch-condition bug) was superseded
   by the direct finding that cloud `/march` hard-skips `/critique`
   by design. The open question is what local `/critique` cadence,
   if any, should exist, given only ~105 local commits landed in
   the last 55 days and none happened to be a `/critique` pass.
3. **Issue `#391`** (dead CannonKeys vendor URL on the only live
   group buy, Mode Sonnet R2) has been open ~8 hours without a fix
   — the tick that filed it exited cleanly per the "can't ship
   cleanly, don't half-commit" contract rather than shipping the
   one-line URL swap in the same commit. Not blocked, just a
   visible loose end; expect the next `/iterate` tick to drain it
   (same low-risk pattern as commit `9255abe`, 2026-05-09 — point
   at CannonKeys' stable storefront homepage instead of the dead
   product path).

## Today's intent

No pending build-plan phase, no AUDIT/BACKLOG queue pressure — the
loop is in clean maintenance mode. The most likely next tick drains
issue `#391` (mechanical, low-risk). Absent that, expect another
`/expand` no-op or a fresh mechanical-survey finding. The 10
pending `plan/PHASE_CANDIDATES.md` rows are the standing backlog
for the next `/oversight` promotion pass — `/quiz/board` (6.5) and
`Critique gate diagnostic` (6.5) are the highest-scored incumbents,
but the newly-filed `march.yml` crash-issue gate fix (6.0) is the
cheapest and most self-contained of the three and worth an early
look given it's a loop-observability fix, not a product feature.

## Tuning proposals

One new candidate filed this pass: `[score 6.0]` `march.yml`
crash-issue gate fix — see Needs You #1 for the full citation
trail (run `28721452962`, missing `always()` on steps 11–12). The
standing `[score 6.5]` Critique gate diagnostic candidate is
unchanged and carried forward, not re-filed.
