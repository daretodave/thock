# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A second quiet window in a row: zero commits, zero crashes, fully
green breadth.** Since the last digest (`7bf89994`,
2026-09-22T15:17:53Z), 6 cloud `march` ticks completed — all
`success`, all no-op, all genuine (checked each run's own
`is_error`/`num_turns` signal directly: `false` / 32–56 turns
across the board, not a masked crash). HEAD is unchanged
(`7bf89994`); nothing shipped.

**The HOT PURSUIT content-gap row (`#998`, deep-dives pillar) now
crosses its fourth consecutive digest window still open and
un-drafted** — filed 2026-09-19, logged open in the 09-20, 09-21,
09-22, and now 09-23 digests. This is exactly the threshold the
09-22 digest named as worth a fresh look, so here it is: this is
the same shape `#997` (guides pillar) traced through — filed
2026-09-15, also still open at its own "fourth consecutive window"
mention in the 09-19 digest, and it shipped later that same day. So
far `#998` is tracking that precedent, not exceeding it — but the
precedent's ceiling was exactly 4 windows, and this is window 4. If
`#998` is still open in tomorrow's digest, that's the point where it
stops looking like ordinary dispatch-order queuing and starts
looking like a real stall worth a fresh diagnostic (the kind that
falsified the `[score 6.5]` dispatch-order hypothesis on `#989`/
`#997` won't automatically re-apply here — that falsification
showed cloud *can* reach `/ship-content`, not that it always will
on a given tick).

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (88 records, all cross-refs resolve — unchanged: 11
vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys
/ 21 trends), a clean production build, `size` OK (all four tracked
tool routes under budget, unchanged figures), and 1247/1247 e2e
(~6.8m, unchanged from the prior digest). Same benign
`Error: Internal: NoFallbackError` stderr noise on dynamic-route
fallback lookups as every prior digest — not attached to any
failing test, not filing. Deploy is `READY` at HEAD (`7bf89994`).

## While you were out

| When (UTC, 09-22/09-23) | Tick | Outcome |
|---|---|---|
| 15:23→15:27 | cloud march | no-op — 41 turns, nothing dispatched |
| 19:31→19:34 | cloud march | no-op — 32 turns, nothing dispatched |
| 22:41→22:44 | cloud march | no-op — 37 turns, nothing dispatched |
| 01:12→01:16 | cloud march | no-op — 32 turns, nothing dispatched |
| 07:16→07:21 | cloud march | no-op — 34 turns, nothing dispatched |
| 13:18→13:44 | cloud march | no-op — 56 turns, nothing dispatched (longest tick this window; still ended clean, `is_error:false`) |

6 completed `march`-workflow runs since the last digest: **6
success, 0 failure, 0 cancelled, 0 shipped, 6 no-ops.** `lighthouse`
last ran 2026-09-22T15:18:53Z (`success`, fired right after the
last digest's push) — nothing since, as expected for its own
cadence. `night` (this workflow) last recorded completed run was
the 2026-09-22 digest (`success`); this tick is the current one.

## Shipped

**Nothing.** Zero commits landed on `main` between the last digest
commit and this one.

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
  2026-09-19, still undrained — now 4 digest windows old, same age
  as `#998`), plus 1 open `[HOT PURSUIT]` content-gap row
  (deep-dives, `#998`, **now 4 digest windows old** — the watch
  threshold called out in the Headline).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **136 days stale, unchanged and still
  growing.** Root cause remains the confirmed, documented
  `[needs-user-call] [score 6.5]` candidate: cloud mode categorically
  skips `/critique` (no Chrome MCP on the runner) — not a bug to
  re-diagnose, a standing `/oversight` decision (accept local-only
  cadence, build a cloud-compatible substitute, or drop the
  candidate).
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (2026-09-09) still the
  most recent recorded expand pass — **14 days since the last
  pass**, none ran this window (digest doesn't dispatch `/expand`;
  march's own Step 3c gate — 20 commits/48h — was never met this
  window since zero commits landed). **36 pending rows** (35 `[ ]`
  + 1 `[needs-user-call]`), unchanged — this tick files no new
  candidate and no corroborating update. Last promotion: phase 50,
  2026-08-23T12:54Z — **31 days ago**. Highest-scored pending row is
  still `[7.5]` automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#998` (deep-dives-pillar content-gap
  row, 4 digest windows old, watch item per Headline), `#929`
  (`triage:reviewed`, informational — still the root cause of the
  crash-dedupe gap, though no new crashes to log this window either),
  `#898` (`bug` + `triage:needs-user`, the `ACTIONS_PAT`
  workflow-scope limitation — still gating every pending
  `.github/workflows/march.yml` fix, including the crash-dedupe
  one-liner and the (likely moot) dispatch-order text edit).

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 88 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 21 trends) — unchanged from the prior digest
- `build` — clean production build
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1247/1247 passed (~6.8m), against `next start :4173` —
  unchanged from the prior digest (no new canonical URLs this
  window). Same benign `Error: Internal: NoFallbackError` stderr
  noise on dynamic-route fallback lookups as prior digests — not
  attached to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`7bf89994`) reports `READY`.

## Needs you

1. **`#998` watch**: still open at 4 digest windows, tracking (not
   yet exceeding) the `#997` precedent. If it's still open tomorrow,
   that crosses new ground and deserves a direct look at why a
   7.0-scored, issue-stamped content-gap row keeps losing the
   dispatch coin-flip across 6+ clean-exit ticks.
2. **The crash-issue safety net is still silently disabled** (0 new
   instances this window, but the mechanism is unchanged). The fix
   is the one-line dedupe-query narrowing already described in the
   standing `[score 6.0]` `PHASE_CANDIDATES.md` row — exclude
   `triage:reviewed`/`triage:closed`/`triage:needs-user`-labeled
   issues from the "already open" check, mirroring `/triage`'s own
   exclusion list. Blocked on the same `#898` PAT-scope issue as
   every other `.github/workflows/*.yml` fix, so it needs a local
   push regardless of promotion.
3. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking cloud fixes to
   `.github/workflows/*.yml`. Directly gates item 2 above and the
   dispatch-order candidate's (likely now-moot) text fix.
4. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
5. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag.
6. **36 pending phase candidates**, 31 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.0]` crash-dedupe fix) are worth pulling forward.
7. **`plan/CRITIQUE.md` is 136 days stale** — the fresh-eyes loop
   has been off for over four months. Confirmed root cause (cloud
   categorically can't run it), sitting as a standing
   `[needs-user-call]` decision in `PHASE_CANDIDATES.md` — worth a
   conscious call rather than letting it drift further.

## Today's intent

The clearest pick for the next tick is still dispatching
`/ship-content` for the deep-dives row (`#998`) — it's issue-stamped,
scores 7.0, and is the oldest actionable item in the queue. Failing
that pick, the 4 `[cross-links] [4.5]` rows on the guides article are
straightforward `/iterate` picks, same age as `#998`. `AUDIT.md` and
`PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work — everything else queued
needs a local `/oversight` pass.

## Tuning proposals

**None this tick.** No new crash instances to corroborate the
standing `[score 6.0]` crash-dedupe candidate (second consecutive
clean window — every one of this window's 6 ticks confirmed
`is_error:false` directly, not just workflow-level `success`). The
dispatch-order `[score 6.5]` candidate already carries its
2026-09-20 falsification update; `#998` crossing its 4th window is
noted above as a watch item, tracking the `#997` precedent rather
than exceeding it. If `#998` is still open tomorrow, that's the
trigger for a real tuning candidate (not filed preemptively — the
evidence so far still reads as ordinary queuing, and filing on a
hunch before the precedent is actually broken would just add noise
to an already-36-row queue). Nothing else in this window's pulse
suggests a mistuned gate, ceiling, or cadence.
