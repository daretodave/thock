# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The heartbeat false-positive saga looks closed.** The
`[user-issue #1007]` fix (`bde7f7fc`, shipped 2026-09-29T17:57Z —
`check_hours_since_last_march` now sorts an unfiltered `-L 5` client-
side instead of the flaky `--status completed` query) has now held
through 3 clean `heartbeat` runs (22:11 09-29, 05:27 and 12:28
09-30) with zero repeat alarms — the longest quiet stretch since the
false-positive pattern started. The finding was marked addressed
same-tick (`a0cf4033`).

**Otherwise a quiet window: 5 `march` ticks since the last digest, 3
shipped, 2 no-ops, all `success`.** 17:32→17:58 shipped the
heartbeat fix above. 21:47→21:53 ran `/expand` pass 434 — still no
candidates (`b654cb4c`), extending the no-new-candidate streak to
**35 consecutive passes (400→434)** since the last real filing at
pass 399. 01:00→01:06 ran the content-gap survey fresh: filed a new
`[HOT PURSUIT] [content-gap] [7]` row for the trends pillar (1 of
≥2 articles in the last 30 days) and opened `#1011` for the next
`/ship-content` dispatch (`30f93fb4`, `2a24d2b3`) — article not yet
shipped, this is the queued next pick. 07:53→07:56 and 14:33→14:38
were clean no-ops, nothing to dispatch.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files), 230/230 script tests (83 suites), `data:validate`
(89 records, all cross-refs resolve: 11 vendors / 18 switches / 10
keycap-sets / 10 boards / 18 group-buys / 22 trends — unchanged
record counts from the prior digest), a clean production build,
`size` OK (all four tracked tool routes under budget, unchanged
figures), and 1277/1277 e2e (~8.4m against `next start :4173`, same
test count as the prior digest). Same benign `Error: Internal:
NoFallbackError` stderr noise on dynamic-route fallback lookups as
every prior digest — not attached to any failing test. Deploy is
`READY` at HEAD (`2a24d2b3`) as of this tick's `deploy:check`.

**Still the standing background item: `plan/CRITIQUE.md` is 143
days stale** (last real pass 2026-05-10T20:35:00Z, pass 11,
`931c8a7`) — unchanged this window, +1 day as expected. Same
structural root cause as every prior digest: cloud mode cannot run
`/critique` (the `reader` sub-agent needs Chrome MCP, unavailable on
the runner). Standing `[needs-user-call]` decision.

**The 2 standing `[data] [3.6]` stale-group-buy rows are still
unaddressed** (`divinikey-gmk-cyl-just-beachy`, endDate 2026-09-22
passed; `divinikey-gmk-cyl-orange-alert`, endDate 2026-09-14 passed)
— now passed over for a **fifth** consecutive digest window despite
being ease-9, single-field fixes. Flagged again below.

## While you were out

| When (UTC, 09-29/09-30) | Tick | Outcome |
|---|---|---|
| 17:32→17:58 | cloud march | **shipped** — heartbeat.yml flatline query fix (`bde7f7fc`), finding addressed (`a0cf4033`) |
| 21:47→21:53 | cloud march | no-op for shipping, but ran `/expand` pass 434 — no candidates (`b654cb4c`), streak now 35 |
| 22:11 | heartbeat | clean run, no alarm (first check after the fix) |
| 01:00→01:06 | cloud march | **shipped** — trends pillar content-gap row filed + `#1011` opened for next `/ship-content` dispatch (`30f93fb4`, `2a24d2b3`) |
| 05:27 | heartbeat | clean run, no alarm |
| 07:53→07:56 | cloud march | no-op — nothing to dispatch |
| 12:28 | heartbeat | clean run, no alarm |
| 14:33→14:38 | cloud march | no-op — nothing to dispatch |
| 16:26 | night (this tick) | in progress |

5 completed `march`-workflow runs since the last digest: **5
success, 0 failure, 0 cancelled, 2 shipped ticks (the heartbeat fix
and the content-gap dispatch), 1 expand-only tick, 2 true no-ops.**
`lighthouse` did not run in this window (no content ship triggered
it after the news-pillar cluster on 09-29). `heartbeat` ran 3 times
in-window, all clean — the false-positive pattern has not recurred
since the fix shipped. `night` (this workflow) last completed run
was the 2026-09-29 digest (`success`, 16:33→16:50); this tick is the
current one.

## Shipped

- **heartbeat.yml flatline query fix** (`bde7f7fc`) — drops the
  flaky `--status completed` query for an unfiltered `-L 5` sorted
  client-side; closes the `[user-issue #1007] [ci] [5.6]` row
  (`a0cf4033`). Held clean through 3 subsequent heartbeat runs.
- **trends pillar content-gap dispatch** (`30f93fb4`, `2a24d2b3`) —
  row auto-filed by `content-gap-survey.mjs`, issue `#1011` opened
  for the next `/ship-content` tick. Article not yet written — this
  is the queued top pick, not a completed ship.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **12 open rows** (7 `[ ]` + 1
  `[HOT PURSUIT]` + 4 `[needs-user-call]`), same total as the prior
  digest net of this window's churn — the `[user-issue #1007]`
  heartbeat row closed, the new `[HOT PURSUIT] [content-gap] [7]`
  trends row opened to replace it. Breakdown: 5 standing sub-3.0
  `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%,
  `[content] [2.4]` plate-materials tension, `[seo] [2.0]`
  cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-
  manifest drift, `[seo] [1.8]` orphaned `favicon.svg`); 4
  `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11
  `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off
  `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`); **2 standing
  `[data] [3.6]` rows unchanged** (`divinikey-gmk-cyl-just-beachy`,
  `divinikey-gmk-cyl-orange-alert`) — passed over for a fifth
  consecutive window (see Headline); **1 new `[HOT PURSUIT]
  [content-gap] [7]`** trends-pillar row — now the highest-scored
  open AUDIT item, queued for `/ship-content`.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **143 days stale, +1 day.** Standing
  `[needs-user-call]` decision; see Headline.
- **`plan/PHASE_CANDIDATES.md`**: pass 434 (2026-09-29) now the
  most recent expand pass — **35 consecutive no-new-candidate
  passes** since pass 399, up from 34 at the last digest. **36
  pending rows** unchanged (35 `[ ]` + 1 `[needs-user-call]`). Last
  promotion: phase 50, 2026-08-23 — **38 days ago.** Highest-scored
  pending row is still `[7.5]` automated content-fact-vs-catalog
  numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 2 open at pulse start (`#1010`, `#929`);
  `#1010` was closed by the prior digest tick, so the window opened
  with `#929` only, then `#1011` was opened this window for the
  trends content-gap dispatch. Currently open: `#1011`
  (`loop:opened`, awaiting `/ship-content`) and `#929`
  (`triage:reviewed`, informational, standing since 2026-08-25). 0
  unlabeled issues, 0 `triage:needs-user` issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web) —
  unchanged from the prior digest
- `test:scripts` — 230/230 passed (83 suites) — unchanged
- `data:validate` — 89 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 22 trends) — unchanged from the prior digest
- `build` — clean production build (regenerates the 3
  `*.generated.json` runtime files — discarded before this commit,
  same standing `[data] [2.4]` drift row, not re-filed)
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1277/1277 passed (~8.4m), against `next start :4173`,
  same test count as the prior digest. Same benign `Error: Internal:
  NoFallbackError` stderr noise on dynamic-route fallback lookups as
  prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red.
`deploy:check` at HEAD (`2a24d2b3`) reports `READY`.

## Needs you

1. **`plan/CRITIQUE.md` is 143 days stale** — the fresh-eyes loop
   has been off for nearly five months. Root cause confirmed (cloud
   categorically can't run it, Chrome MCP unavailable on the
   runner), sitting as a standing `[needs-user-call]` decision in
   `plan/PHASE_CANDIDATES.md` — worth a conscious call (accept as
   local-only ritual / build a cloud-compatible substitute / drop
   it) rather than letting it drift further.
2. **The 2 standing `[data] [3.6]` stale-group-buy rows have now
   been passed over for a fifth consecutive digest window** despite
   being ease-9, single-field fixes clearing the qualifying bar —
   same open question as the last several digests: whether
   `/iterate`'s selection logic is systematically deprioritizing
   small data-hygiene rows in favor of content-gap and higher-score
   work, or whether there's a reason these ticks keep choosing
   otherwise. With the heartbeat row now closed and the new HOT
   PURSUIT content row about to absorb a tick, these two may sit
   even longer unless picked deliberately.
3. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast
   WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404
   structural trade-off `[4.2]`, `loop:opened` mirror-drain gap
   `[3.0]`.
4. **36 pending phase candidates, 38 days since the last
   promotion** — cloud cannot promote by design. Worth a batch
   `/oversight` pass, especially with the `[7.5]` fact-audit row
   still the highest-scored item waiting.

## Today's intent

The clearest next pick is the new `[HOT PURSUIT] [content-gap] [7]`
trends-pillar row — `#1011` is already open, `/ship-content` is the
named next step, and at score 7 it clears every other open AUDIT row
by a wide margin. Right behind it: the 2 `[data] [3.6]`
stale-group-buy rows, cheap and now five windows overdue — worth a
deliberate pick rather than letting a sixth window pass. Beyond
those, `AUDIT.md` is otherwise down to the standing sub-3.0 and
`needs-user-call` items, which need a local `/oversight` pass rather
than an autonomous pick.

## Tuning proposals

**None new this tick.** The heartbeat false-positive pattern that
drove the last two digests' headlines appears resolved by the
already-shipped fix — no new gate-tuning signal there, just
confirmation the existing fix held. The 35-consecutive-no-candidate
`/expand` streak is a continuation of the trend already tracked as
the pending `[score 3.6]` "`/expand` dispatch cadence" candidate in
`plan/PHASE_CANDIDATES.md` (not re-filed; that row's own streak-
aware backoff proposal already covers this exact signal and awaits
`/oversight`). Nothing else in this window's pulse suggests a new
mistuned gate, ceiling, or cadence.
