# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Both of yesterday's "Needs you" items got cleared in a single commit before this digest even ran.** Since the last digest (`d5db6b27`, 2026-10-02T16:34:38Z), cloud `/march` completed 4 ticks: the 20:18→20:40 tick shipped `9761afa5` — the Node-20→22 `.nvmrc`/`engines.node`/`bearings.md` drift fix flagged two digests ago (closed `#1016`) **and** closed the orphaned duplicate `#1014` as superseded, both in one commit. The 00:06→00:11 tick then shipped two more: `681881f0` (content-gap-survey + newsletter-gap-survey auto-filed two fresh rows — deep-dives HOT PURSUIT `[7.0]` and newsletter `[4.0]`) and `b32d83f0` (mirrored the deep-dives row to GitHub as `#1018`). Two more ticks since then (05:59→06:03, 11:29→13:21) ran clean but shipped nothing — the second ran an unusually long 1h52m with no commit, consistent with an attempted `/ship-content` draft for `#1018` that didn't reach a ship this tick (no error surfaced in the run log; not treated as a failure).

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs green, run as sequential foreground calls per the standing rule: typecheck (9 workspace projects), lint (0 warnings), 862/862 unit tests (109 files), 230/230 script tests (83 suites), `data:validate` (89 records, cross-refs resolve — unchanged counts: 11 vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys / 22 trends), a clean production build, `size` OK (all four tracked tool routes unchanged, under budget), and **1280/1280 e2e** (~8.1m against `next start :4173`, unchanged count from the prior digest). Same benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups as every prior digest — not attached to any failing test. The build leg's regeneration of the 3 `*.generated.json` runtime files was discarded before this commit (standing `[data] [2.4]` drift row, not re-filed). Deploy is `READY` at HEAD (`b32d83f0`) as of this tick's `deploy:check`.

**New open queue items, both auto-filed and already routed**: the deep-dives pillar hit Rule-1 hot pursuit (`[7.0]`, 1 of ≥2 articles in the last 30 days — `#1018` mirrored, next `/march` tick dispatches `/ship-content`); the newsletter queue crossed its 7-day cadence threshold (`[4.0]`, issue 012 due, last issue `thock-weekly-011` on 2026-09-26). The newsletter row's GitHub mirror shows `[mirror-failed: 2026-10-03]` — the same benign, intermittent `GH_TOKEN`-not-in-`.env` pattern seen in several prior digests (fix ships anyway per Hard rule §7.7); not a new concern.

**`plan/CRITIQUE.md` is now 146 days stale** (last real pass 2026-05-10T20:35:00Z, pass 11, `931c8a7`) — unchanged structural root cause as every prior digest: cloud mode cannot run `/critique` (the `reader` sub-agent needs Chrome MCP, unavailable on the runner). Already captured as the standing `[needs-user-call] [score 6.5]` "Critique gate diagnostic" candidate — not re-filing.

## While you were out

| When (UTC, 10-02/10-03) | Tick | Outcome |
|---|---|---|
| 16:35 | lighthouse | clean run |
| 20:18→20:40 | cloud march | **shipped** — `9761afa5` Node 20→22 drift fix, closes `#1016`; also closes orphaned duplicate `#1014` |
| 20:39 | lighthouse | clean run (triggered by the fix) |
| 20:41 | lighthouse | skipped (no new deploy since prior check) |
| 22:09 | heartbeat | clean run, no alarm |
| 00:06→00:11 | cloud march | **shipped** — `681881f0` content-gap + newsletter-gap rows auto-filed; `b32d83f0` deep-dives dispatch opens `#1018` |
| 00:10 | lighthouse | clean run (triggered by the content-gap commit) |
| 00:11 | lighthouse | clean run (triggered by the dispatch commit) |
| 05:13 | heartbeat | clean run, no alarm |
| 05:59→06:03 | cloud march | no commit — clean no-op |
| 11:29→13:21 | cloud march | no commit — 1h52m run, longest in this window, no error surfaced |
| 11:35 | heartbeat | clean run, no alarm |
| 14:46 | night (this tick) | in progress |

4 completed `march`-workflow runs since the last digest: **4 success, 0 failure, 0 cancelled, 2 shipped ticks (3 commits total), 2 true no-ops**. `lighthouse` ran 4 times in-window (3 clean, 1 skipped — no new deploy to check). `heartbeat` ran 3 times in-window, all clean — no alarms. `night` (this workflow) last completed run was the 2026-10-02 digest; this tick is the current one.

## Shipped

- **`9761afa5`** — pinned `.nvmrc`/`package.json engines.node`/`bearings.md` from Node 20 to 22 to match what both cloud workflows have actually run on since the loop's introduction. Closes `#1016`. Also closed orphaned duplicate `#1014` as superseded (same-day double-mirror of the already-shipped `orange-alert` fix — the known `[needs-user-call] [score 6.0]` mirror-drain-gap pattern, cleaned up manually this time).
- **`681881f0`** — `content-gap-survey.mjs` + `newsletter-gap-survey.mjs` auto-filed two fresh AUDIT rows: deep-dives pillar hot pursuit (`[7.0]`) and newsletter issue 012 due (`[4.0]`).
- **`b32d83f0`** — content dispatch mirrored the deep-dives hot-pursuit row to GitHub as `#1018` ("deep-dives: how TMR switches work").

## Queues now

- **Build plan**: 0 pending phases (50/50 shipped). Loop stays in `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **11 open rows** (6 `[ ]` + 4 `[needs-user-call]` + 1 `[HOT PURSUIT]`), up 2 from the prior digest's 9 — the two new auto-filed rows above. Breakdown: 5 standing sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]` plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]` orphaned `favicon.svg`); 1 new `[ ]` row (`[newsletter] [4.0]` issue 012 due); 4 `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`); 1 new `[HOT PURSUIT]` row (`[content-gap] [7.0]` deep-dives, `#1018`, actively being dispatched). Cross-link queue: **0 pending pairs** (confirmed via `article-crosslink-survey.mjs` — "all pairs linked").
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z (pass 11, `931c8a7`) — **146 days stale, +1 day.** Its only Pending row remains the standing `[needs-user-call]` GA-beacon item. Standing decision; see Headline.
- **`plan/PHASE_CANDIDATES.md`**: pass 435 (2026-10-01) is still the most recent expand pass — only 3 commits / ~18h elapsed since pass 435's own anchor commit `b4d8dafb`, well under both the 20-commit and 48h thresholds, so no new pass fired this window. The **39-consecutive-no-new-candidate streak (397→435) holds flat**. 50 header rows unchanged (35 `[ ]` truly pending + 14 `[x]` shipped-awaiting-move + 1 `[needs-user-call]`). Last promotion: phase 50, 2026-08-23 — **41 days ago.** Highest-scored pending row is still `[7.5]` automated content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: window opened with `#1014` (orphaned duplicate) and `#1016` (Node drift) outstanding from the prior digest; both closed by `9761afa5`. `#1018` (deep-dives dispatch) opened fresh, still open — awaiting `/ship-content`. Currently open: `#929` (`triage:reviewed`, standing), `#1018` (fresh). 0 unlabeled issues, 0 `triage:needs-user` issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web) — unchanged from the prior digest
- `test:scripts` — 230/230 passed (83 suites) — unchanged
- `data:validate` — 89 records valid, cross-refs resolve (11 vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys / 22 trends) — unchanged from the prior digest
- `build` — clean production build (regenerates the 3 `*.generated.json` runtime files — discarded before this commit, same standing `[data] [2.4]` drift row, not re-filed)
- `size` — all tracked routes comfortably under budget, unchanged figures from the prior digest (`/quiz/switch` 145.2 KB, `/quiz/keycap-set` 145.3 KB, `/compare/switch` and `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — **1280/1280 passed** (~8.1m), against `next start :4173` — unchanged count from the prior digest (no new canonical URLs this window). Same benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups as prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red. `deploy:check` at HEAD (`b32d83f0`) reports `READY`.

## Needs you

1. **`plan/CRITIQUE.md` is 146 days stale** — the fresh-eyes loop has been off for nearly five months. Root cause confirmed (cloud categorically can't run it, Chrome MCP unavailable on the runner), sitting as a standing `[needs-user-call]` decision in `plan/PHASE_CANDIDATES.md` — worth a conscious call (accept as local-only ritual / build a cloud-compatible substitute / drop it) rather than letting it drift further.
2. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
3. **35 pending phase-candidate rows, 41 days since the last promotion** — cloud cannot promote by design. Worth a batch `/oversight` pass, especially with the `[7.5]` fact-audit row still the highest-scored item waiting, and 14 of those 50 header rows already shipped and just needing a Promoted-section move.
4. **The 11:29→13:21 march tick ran 1h52m and shipped nothing** — much longer than this window's other ticks (4–22 min). No error surfaced in the run log and the loop self-recovered cleanly next tick, but it's worth a look if the pattern repeats: likely an in-progress `/ship-content` draft for `#1018` that didn't clear verify/commit within the tick, not a crash.

## Today's intent

`#1018` (deep-dives HOT PURSUIT, score 7.0) is the clear next pick — already mirrored to GitHub, awaiting `/ship-content` to draft "how TMR switches work." The newsletter row (`[4.0]`, issue 012 due) sits right behind it. Everything else in `AUDIT.md` is the standing sub-3.0 and `needs-user-call` set, which keeps needing a local `/oversight` pass rather than an autonomous pick: the critique staleness call and the phase-candidate batch promotion are both user-in-the-loop decisions, not mechanical fixes.

## Tuning proposals

**None new this tick.** The two standing signals from prior windows continue unchanged rather than worsening: the critique-staleness root cause is already captured as the `[needs-user-call] [score 6.5]` "Critique gate diagnostic" candidate, and the expand no-candidate streak is already covered by the pending `[score 3.6]` "`/expand` dispatch cadence" candidate — neither needs re-filing. The one new observation this window (the 1h52m no-commit tick) is logged under Needs you as a watch item, not a tuning proposal — a single long-but-clean tick isn't yet a pattern worth a gate change. Nothing in this window's pulse — 2 clean ships, 2 no-ops, 0 failures, a fully green breadth check — suggests a new mistuned gate, ceiling, or cadence.
