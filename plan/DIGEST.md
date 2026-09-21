# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, mechanical window — one commit, the Monday trend snapshot
— bracketed by three more unlogged API-error crashes that keep
corroborating last night's `[score 6.0]` crash-dedupe finding.**
Since the last digest (`c766beb4`, 2026-09-20T14:30:24Z), 6 cloud
`march` ticks completed: 3 failed (17:16, 20:15, 22:55 UTC on
09-20), 2 succeeded as no-ops (00:49, 05:50 UTC on 09-21), and 1
shipped (11:53→12:24 UTC) — the Step 0.5 Monday gate firing cleanly
to write `data/trends/2026-W39.json` (`a2c75cc0`). No content
shipped, no AUDIT rows drained, `#998` (deep-dives content-gap)
carries over untouched into its second digest window.

**All three failures are the same shape the last digest diagnosed:
`is_error:true`, ~1 turn, sub-second duration, an API-layer error
(two `429`s, matching the class already on file) — and, as
predicted, none of them produced a GitHub issue.** `gh issue list
--state all --search "Cloud march execution had issues"` still shows
exactly one such issue, `#929` (filed 2026-08-25, `triage:reviewed`,
still open). The dedupe gate at `.github/workflows/march.yml:260`
keeps treating that 27-day-old reviewed issue as "an open crash
issue already exists" and skips filing for every tick since —
including these three. This is now **4 confirmed unlogged crash
ticks since `#929`** (yesterday's 13:54 run plus these three), none
of them visible anywhere except a manual `gh run list` pulse-scan.
The standing `[score 6.0]` `PHASE_CANDIDATES.md` row already
describes the exact mechanism and fix; this tick adds a corroborating
update rather than a new candidate — see Tuning proposals.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (88 records, all cross-refs resolve — up 1 from the
prior digest's 87: 11 vendors / 18 switches / 10 keycap-sets / 10
boards / 18 group-buys / **21 trends**, the new W39 snapshot), a
clean production build, `size` OK (all four tracked tool routes
under budget, unchanged figures), and 1247/1247 e2e (~8.1m, +3 from
the prior digest's 1244 — the new `/trends/tracker/2026-W39`
canonical URL). Same benign `Error: Internal: NoFallbackError`
stderr noise on dynamic-route fallback lookups as every prior
digest — not attached to any failing test, not filing. Deploy is
`READY` at HEAD (`a2c75cc0`).

## While you were out

| When (UTC, 09-20/09-21) | Tick | Outcome |
|---|---|---|
| 17:16→17:16 | cloud march | **failed** — `is_error:true`, 298ms, 1 turn, `api_error_status: 429`; no issue filed (dedupe gap, see Headline/Tuning) |
| 20:15→20:16 | cloud march | **failed** — `is_error:true`, 462ms, 1 turn, `api_error_status: 429`; no issue filed |
| 22:55→22:56 | cloud march | **failed** — `is_error:true`, 662ms, 1 turn, `api_error_status: 429`; no issue filed |
| 00:49→00:51 | cloud march | no-op — nothing dispatched |
| 05:50→06:05 | cloud march | no-op — nothing dispatched |
| 11:53→12:24 | cloud march | shipped — Step 0.5 Monday gate wrote `data/trends/2026-W39.json` (`a2c75cc0`) |

6 completed `march`-workflow runs since the last digest: **3
success, 3 failure, 0 cancelled, 1 shipped, 2 no-ops**. `lighthouse`'s
last 2 recorded runs: both `success` (2026-09-21T12:25:20Z,
2026-09-20T14:31:27Z) — one new run this window, immediately after
the trend-snapshot tick. `night` (this workflow) last recorded
completed run was the 2026-09-20 digest (`success`); this tick is
the current one.

## Shipped

**One commit, mechanical.**

- `a2c75cc0` — Step 0.5 weekly trend snapshot, `data/trends/2026-W39.json`
  (Monday gate, 21st trend snapshot on file). No AUDIT rows, no
  content, no code.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **14 open rows, unchanged** from the prior
  digest. Breakdown: 5 standing sub-3.0 `[ ]` (`[seo] [2.7]` Mode
  Sonnet hero-art 65%→75%, `[content] [2.4]` plate-materials
  tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art,
  `[data] [2.4]` generated-manifest drift, `[seo] [1.8]` orphaned
  `favicon.svg`), 4 `[needs-user-call]` (border-contrast WCAG
  1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural
  trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`), 4
  `[cross-links] [4.5]` rows (the guides-article siblings, filed
  2026-09-19, still undrained), plus 1 open `[HOT PURSUIT]`
  content-gap row (deep-dives, `#998`, **now 2 digest windows old**
  — not yet the 3-window trigger the dispatch-order candidate
  watches for, but worth a glance if it survives a third).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **134 days stale, unchanged and still
  growing.** Root cause remains the confirmed, documented
  `[needs-user-call] [score 6.5]` candidate: cloud mode categorically
  skips `/critique` (no Chrome MCP on the runner) — not a bug to
  re-diagnose, a standing `/oversight` decision (accept local-only
  cadence, build a cloud-compatible substitute, or drop the
  candidate). The one other Pending CRITIQUE row, `[needs-user-call]
  [MED]` GA `/g/collect` beacons 503ing, is the same age and equally
  untouched.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (2026-09-09) still the
  most recent recorded expand pass — **12 days since the last pass**,
  none ran this window (digest doesn't dispatch `/expand`). **36
  pending rows** (35 `[ ]` + 1 `[needs-user-call]`), unchanged — this
  tick adds a corroborating update to the standing `[score 6.0]`
  crash-dedupe candidate rather than a new row. Last promotion: phase
  50, 2026-08-23T12:54Z — **29 days ago**. Highest-scored pending row
  is still `[7.5]` automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#998` (deep-dives-pillar content-gap
  row, 2 digest windows old), `#929` (`triage:reviewed`,
  informational — and, per the above, the direct cause of 4 now-
  unlogged crash ticks), `#898` (`bug` + `triage:needs-user`, the
  `ACTIONS_PAT` workflow-scope limitation — still gating every
  pending `.github/workflows/march.yml` fix, including the
  crash-dedupe one-liner).

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 88 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 21 trends) — trends up 1 (new W39 snapshot)
- `build` — clean production build
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1247/1247 passed (~8.1m), against `next start :4173` — up
  3 from the prior digest's 1244 (the new W39 tracker canonical
  URL). Same benign `Error: Internal: NoFallbackError` stderr noise
  on dynamic-route fallback lookups as prior digests — not attached
  to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`a2c75cc0`) reports `READY`.

## Needs you

1. **Growing: the crash-issue safety net is still silently disabled,
   now 4 confirmed unlogged instances since `#929` (2026-08-25).**
   Three more `is_error:true` cloud ticks (17:16, 20:15, 22:55 UTC
   09-20, all `api_error_status: 429`) went completely unlogged this
   window, on top of yesterday's 13:54 instance. The fix is the
   one-line dedupe-query narrowing already described in the standing
   `[score 6.0]` `PHASE_CANDIDATES.md` row — exclude
   `triage:reviewed`/`triage:closed`/`triage:needs-user`-labeled
   issues from the "already open" check, mirroring `/triage`'s own
   exclusion list. Blocked on the same `#898` PAT-scope issue as
   every other `.github/workflows/*.yml` fix, so it needs a local
   push regardless of promotion.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking cloud fixes to
   `.github/workflows/*.yml`. Directly gates item 1 above and the
   already-falsified-but-still-open `[score 6.5]` dispatch-order
   candidate's text fix.
3. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
4. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag.
5. **36 pending phase candidates**, 29 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.0]` crash-dedupe fix) are worth pulling forward.
6. **`plan/CRITIQUE.md` is 134 days stale** — the fresh-eyes loop
   has been off for over four months. Confirmed root cause (cloud
   categorically can't run it), sitting as a standing
   `[needs-user-call]` decision in `PHASE_CANDIDATES.md` — worth a
   conscious call rather than letting it drift further.

## Today's intent

The next tick's clearest pick is dispatching `/ship-content` for the
deep-dives row (`#998`, now 2 digest windows old — one more no-op
window puts it at the same three-window mark that triggered the
dispatch-order candidate's filing for `#989`/`#997`). Failing that,
the 4 `[cross-links] [4.5]` rows on the guides article are
straightforward `/iterate` picks. `AUDIT.md` and
`PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work — everything else queued
needs a local `/oversight` pass.

## Tuning proposals

**One update to `plan/PHASE_CANDIDATES.md` this tick, no new rows:**

1. **Corroborating update on the standing `[score 6.0]` crash-issue
   dedupe candidate** — three more cloud `march` ticks (17:16,
   20:15, 22:55 UTC on 2026-09-20) crashed with `is_error:true` /
   `api_error_status: 429` and none produced a GitHub issue, same
   mechanism the candidate already diagnosed (`#929`'s
   `triage:reviewed` label keeps it open, and open-and-titled is all
   the dedupe check looks at). Total now 4 confirmed unlogged
   instances since 2026-08-25. Not re-scoring — same mechanism, same
   fix, more evidence it's live and still costing visibility every
   time the API hiccups.

Proposal only — filed to `PHASE_CANDIDATES.md`, no gates, cadences,
or workflow files touched directly.
