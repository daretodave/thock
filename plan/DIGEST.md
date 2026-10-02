# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean window — both standing stale-group-buy rows finally shipped, after six consecutive digests flagging them.** Since the last digest (`b4d8dafb`, 2026-10-01T17:29:43Z), cloud `/march` ran 5 completed ticks over the pulse table below (2 shipped, 2 no-op, 1 expand no-op) — 5 commits total. 17:14→17:46 shipped `expand: pass 435` (`9b2cbfda`, no candidates). 22:17→22:43 shipped the `divinikey-gmk-cyl-just-beachy` status-stale fix (`7490f7e0`+`42ecfb32`), filed **and** closed `#1013` in the same tick — clean. 08:07→08:33 shipped the sibling `divinikey-gmk-cyl-orange-alert` fix (`efc47fa6`+`eb66036a`), closing `#1015` — both `[data] [3.6]` AUDIT rows that sat open across six digest windows are now `[x]`.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs green, run as sequential foreground calls per the standing rule: typecheck (9 workspace projects), lint (0 warnings), 862/862 unit tests (109 files), 230/230 script tests (83 suites), `data:validate` (89 records, cross-refs resolve — unchanged counts: 11 vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys / 22 trends), a clean production build, `size` OK (all four tracked tool routes unchanged, under budget), and **1280/1280 e2e** (~8.5m against `next start :4173`, unchanged count from the prior digest). Same benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups as every prior digest — not attached to any failing test. Deploy is `READY` at HEAD (`eb66036a`) as of this tick's `deploy:check`.

**New this window — a live, concrete instance of the standing `[needs-user-call] [score 6.0]` "loop:opened issue mirror-drain gap" candidate.** The 01:57→02:10 march tick mirrored the already-Pending `orange-alert` AUDIT row to GitHub as `#1014` but shipped nothing that tick (0 commits). The next tick (08:07→08:33) re-picked the same row, minted a *second* mirror issue `#1015`, shipped the fix, and closed `#1015` by number — leaving `#1014` open and orphaned, a duplicate of an already-resolved finding. Confirmed via `gh issue view`: `#1014` state is still `OPEN`, `#1015` is `CLOSED`. This is exactly the failure shape the pending candidate (`plan/PHASE_CANDIDATES.md`, proposed scope (a)/(b)/(c)) already names — not a new candidate, just fresh evidence. Flagged below under Needs you; cheapest resolution is a manual `gh issue close 1014 --comment "duplicate of #1015, already shipped in efc47fa6"`.

**Also new this window: GitHub issue `#1016`** ("`.nvmrc`/`engines.node` (20) drifted from CI's `node-version` 22"), filed by the 15:18→15:36 march tick's `/iterate` audit sweep (LOW severity, `docs` category) — open, `loop:opened`, no AUDIT.md row yet, no commit this tick. Genuinely novel finding (first hit in ~435 prior audit passes per its own evidence) — low-ease three-line fix (`.nvmrc`, `package.json` engines floor, `bearings.md` tree comment) whenever the loop picks it up.

**`plan/CRITIQUE.md` is now 145 days stale** (last real pass 2026-05-10T20:35:00Z, pass 11, `931c8a7`) — unchanged structural root cause as every prior digest: cloud mode cannot run `/critique` (the `reader` sub-agent needs Chrome MCP, unavailable on the runner). Already captured as the standing `[needs-user-call] [score 6.5]` "Critique gate diagnostic" candidate — not re-filing.

## While you were out

| When (UTC, 10-01/10-02) | Tick | Outcome |
|---|---|---|
| 17:14→17:46 | cloud march | **shipped** — `expand: pass 435 — no candidates` (`9b2cbfda`) |
| 17:46 | lighthouse | clean run |
| 22:17→22:43 | cloud march | **shipped** — `divinikey-gmk-cyl-just-beachy` status fix (`7490f7e0`, `42ecfb32`), filed + closed `#1013` same tick |
| 22:38 | heartbeat | clean run, no alarm |
| 22:43 | lighthouse | clean run (triggered by the data ship) |
| 01:57→02:10 | cloud march | no commit — mirrored `orange-alert` row to GitHub as `#1014`, did not ship this tick |
| 05:30 | heartbeat | clean run, no alarm |
| 06:49 | lighthouse | skipped (no new deploy since prior check) |
| 08:07→08:33 | cloud march | **shipped** — `divinikey-gmk-cyl-orange-alert` status fix (`efc47fa6`, `eb66036a`), minted a second mirror issue `#1015` and closed it — `#1014` left orphaned |
| 08:33 | lighthouse | clean run (triggered by the data ship) |
| 12:27 | heartbeat | clean run, no alarm |
| 15:18→15:36 | cloud march | no commit — `/iterate` audit sweep filed `#1016` (Node version drift, LOW) |
| 16:18 | night (this tick) | in progress |

5 completed `march`-workflow runs since the last digest: **5 success, 0 failure, 0 cancelled, 2 shipped ticks (+1 expand no-op commit), 2 true no-ops** (both filed a GitHub issue but shipped no commit). `lighthouse` ran 3 times in-window (2 clean, 1 skipped — no new deploy to check). `heartbeat` ran 3 times in-window, all clean — no alarms. `night` (this workflow) last completed run was the 2026-10-01 digest; this tick is the current one.

## Shipped

- **`expand: pass 435`** (`9b2cbfda`) — no candidates filed, 39th consecutive no-new-candidate pass (397–435).
- **`divinikey-gmk-cyl-just-beachy` status fix** (`7490f7e0`, `42ecfb32`) — flipped stale `announced` → `closed` (endDate 2026-09-22 had passed), closed `#1013`. Standing `[data] [3.6]` row, open six digest windows, finally drained.
- **`divinikey-gmk-cyl-orange-alert` status fix** (`efc47fa6`, `eb66036a`) — flipped stale `live` → `closed` (endDate 2026-09-14 had passed), closed `#1015` (leaving sibling mirror `#1014` orphaned — see Headline/Needs you). Standing `[data] [3.6]` row, also open six digest windows, now drained.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **9 open rows** (5 `[ ]` + 4 `[needs-user-call]`), down 2 from the prior digest's 11 — both standing `[data] [3.6]` stale-group-buy rows shipped this window with nothing new filed to replace them. Breakdown: 5 standing sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]` plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]` orphaned `favicon.svg`); 4 `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]` — now with a fresh live instance, see Headline). `#1016` (Node version drift) has no AUDIT.md row yet.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z (pass 11, `931c8a7`) — **145 days stale, +1 day.** Its only Pending row remains the standing `[needs-user-call]` GA-beacon item. Standing decision; see Headline.
- **`plan/PHASE_CANDIDATES.md`**: pass 435 (2026-10-01) is the most recent expand pass — no new pass fired this window (only 5 commits / ~23h elapsed since pass 435's own anchor commit `9b2cbfda`, under both the 20-commit and 48h thresholds), so the **39-consecutive-no-new-candidate streak (397→435) holds flat**. **50 header rows** unchanged (35 `[ ]` + 14 `[x]` shipped-awaiting-move + 1 `[needs-user-call]`). Last promotion: phase 50, 2026-08-23 — **40 days ago.** Highest-scored pending row is still `[7.5]` automated content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: window opened with `#1013` (just-beachy mirror) and `#1014`/`#1015` (orange-alert, double-mirrored) in flight; `#1013` and `#1015` closed by their fixes. Currently open: `#929` (`triage:reviewed`, standing), `#1014` (orphaned duplicate, see Headline), `#1016` (Node version drift, fresh). 0 unlabeled issues, 0 `triage:needs-user` issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web) — unchanged from the prior digest
- `test:scripts` — 230/230 passed (83 suites) — unchanged
- `data:validate` — 89 records valid, cross-refs resolve (11 vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys / 22 trends) — unchanged from the prior digest
- `build` — clean production build (regenerates the 3 `*.generated.json` runtime files — discarded before this commit, same standing `[data] [2.4]` drift row, not re-filed)
- `size` — all tracked routes comfortably under budget, unchanged figures from the prior digest (`/quiz/switch` 145.2 KB, `/quiz/keycap-set` 145.3 KB, `/compare/switch` and `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — **1280/1280 passed** (~8.5m), against `next start :4173` — unchanged count from the prior digest (no new canonical URLs this window). Same benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups as prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red. `deploy:check` at HEAD (`eb66036a`) reports `READY`.

## Needs you

1. **`#1014` is an orphaned duplicate GitHub issue** — the `orange-alert` stale-status finding was mirrored twice (`#1014` then `#1015`); the fix closed only `#1015`. `#1014` is safe to close manually as a duplicate (`gh issue close 1014 --comment "duplicate of #1015, already shipped in efc47fa6"`) — fresh, concrete evidence for the already-Pending `[needs-user-call] [score 6.0]` "loop:opened issue mirror-drain gap" candidate; not re-filing, just flagging the live instance.
2. **`plan/CRITIQUE.md` is 145 days stale** — the fresh-eyes loop has been off for nearly five months. Root cause confirmed (cloud categorically can't run it, Chrome MCP unavailable on the runner), sitting as a standing `[needs-user-call]` decision in `plan/PHASE_CANDIDATES.md` — worth a conscious call (accept as local-only ritual / build a cloud-compatible substitute / drop it) rather than letting it drift further.
3. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]` (see item 1).
4. **50 pending phase-candidate header rows, 40 days since the last promotion** — cloud cannot promote by design. Worth a batch `/oversight` pass, especially with the `[7.5]` fact-audit row still the highest-scored item waiting, and 14 of those 50 rows already shipped and just needing a Promoted-section move.

## Today's intent

With both standing stale-group-buy rows finally drained, `AUDIT.md` is back down to the standing sub-3.0 and `needs-user-call` items plus the fresh, low-ease `#1016` (Node version drift) — a good pick for the next `/iterate` tick once it gets a formal AUDIT.md row. Otherwise the queue needs a local `/oversight` pass rather than an autonomous pick: the critique staleness call, the mirror-issue cleanup, and the phase-candidate batch promotion are all user-in-the-loop decisions, not mechanical fixes.

## Tuning proposals

**None new this tick.** Both standing signals from prior windows continue unchanged rather than worsening: the critique-staleness root cause is already captured as the `[needs-user-call] [score 6.5]` "Critique gate diagnostic" candidate, and the expand no-candidate streak is already covered by the pending `[score 3.6]` "`/expand` dispatch cadence" candidate — neither needs re-filing. This window's new `#1014`/`#1015` double-mirror is fresh *evidence* for the existing `[score 6.0]` mirror-drain-gap candidate, not a new gate — logged under Needs you rather than filed as a duplicate candidate. Nothing in this window's pulse — 2 clean ships, 2 no-ops, 1 expand no-op, 0 failures, a fully green breadth check — suggests a new mistuned gate, ceiling, or cadence.
