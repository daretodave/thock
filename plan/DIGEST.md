# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The quietest window in recent memory: zero commits, zero crashes,
fully green breadth.** Since the last digest (`86cdea68`,
2026-09-21T16:47:32Z), 5 cloud `march` ticks completed — all
`success`, all no-op. HEAD is unchanged (`86cdea68`); nothing
shipped. For the first time in several digest windows, **none of
those ticks crashed** — the `is_error:true`/`429` pattern that
corroborated the standing `[score 6.0]` crash-dedupe candidate
across the last two digests didn't recur this window. That's not
evidence the gate is fixed (it isn't — `#929` is still open,
`triage:reviewed`, still silently disabling the dedupe check), just
that the API didn't hiccup this time.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (88 records, all cross-refs resolve — unchanged: 11
vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys
/ 21 trends), a clean production build, `size` OK (all four tracked
tool routes under budget, unchanged figures), and 1247/1247 e2e
(~8.1m, unchanged from the prior digest). Same benign
`Error: Internal: NoFallbackError` stderr noise on dynamic-route
fallback lookups as every prior digest — not attached to any
failing test, not filing. Deploy is `READY` at HEAD (`86cdea68`).

**The HOT PURSUIT content-gap row (`#998`, deep-dives pillar) now
crosses its third consecutive digest window still open and
un-drafted** — filed 2026-09-19, logged in the 09-20 and 09-21
digests, and still sitting untouched today. This is the same shape
that triggered the `[score 6.5]` dispatch-order candidate's filing
for `#989` and its later corroboration on `#997` — but that
candidate's own 2026-09-20 update **falsified the central
mechanism** (cloud does reach `/ship-content`; both `#989` and
`#997` eventually shipped via ordinary dispatch-order queuing, not
a structurally broken lane). Reading `#998` through that same
lens: this is very likely ordinary queueing, not a new bug — noted
below as a watch item, not a new tuning candidate.

## While you were out

| When (UTC, 09-21/09-22) | Tick | Outcome |
|---|---|---|
| 17:47→17:53 | cloud march | no-op — nothing dispatched |
| 21:39→21:43 | cloud march | no-op — nothing dispatched |
| 00:33→00:37 | cloud march | no-op — nothing dispatched |
| 05:48→05:53 | cloud march | no-op — nothing dispatched |
| 10:53→10:57 | cloud march | no-op — nothing dispatched |

5 completed `march`-workflow runs since the last digest: **5
success, 0 failure, 0 cancelled, 0 shipped, 5 no-ops.** `lighthouse`
ran once this window (2026-09-21T16:48:39Z, `success`, fired
immediately after the last digest's push) — nothing since. `night`
(this workflow) last recorded completed run was the 2026-09-21
digest (`success`, 16:31→16:49); this tick is the current one.

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
  2026-09-19, still undrained — now 3 digest windows old), plus 1
  open `[HOT PURSUIT]` content-gap row (deep-dives, `#998`, **now 3
  digest windows old** — the watch threshold from the Headline).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **135 days stale, unchanged and still
  growing.** Root cause remains the confirmed, documented
  `[needs-user-call] [score 6.5]` candidate: cloud mode categorically
  skips `/critique` (no Chrome MCP on the runner) — not a bug to
  re-diagnose, a standing `/oversight` decision (accept local-only
  cadence, build a cloud-compatible substitute, or drop the
  candidate). The one other Pending CRITIQUE row, `[needs-user-call]
  [MED]` GA `/g/collect` beacons 503ing, is the same age and equally
  untouched.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (2026-09-09) still the
  most recent recorded expand pass — **13 days since the last
  pass**, none ran this window (digest doesn't dispatch `/expand`).
  **36 pending rows** (35 `[ ]` + 1 `[needs-user-call]`), unchanged
  — this tick files no new candidate and no corroborating update
  (see Tuning proposals). Last promotion: phase 50, 2026-08-23T12:54Z
  — **30 days ago**. Highest-scored pending row is still `[7.5]`
  automated content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#998` (deep-dives-pillar content-gap
  row, 3 digest windows old, watch item), `#929`
  (`triage:reviewed`, informational — still the root cause of the
  crash-dedupe gap, though no new crashes to log this window),
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
- `e2e` — 1247/1247 passed (~8.1m), against `next start :4173` —
  unchanged from the prior digest (no new canonical URLs this
  window). Same benign `Error: Internal: NoFallbackError` stderr
  noise on dynamic-route fallback lookups as prior digests — not
  attached to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`86cdea68`) reports `READY`.

## Needs you

1. **The crash-issue safety net is still silently disabled** (0 new
   instances this window, but the mechanism is unchanged). The fix
   is the one-line dedupe-query narrowing already described in the
   standing `[score 6.0]` `PHASE_CANDIDATES.md` row — exclude
   `triage:reviewed`/`triage:closed`/`triage:needs-user`-labeled
   issues from the "already open" check, mirroring `/triage`'s own
   exclusion list. Blocked on the same `#898` PAT-scope issue as
   every other `.github/workflows/*.yml` fix, so it needs a local
   push regardless of promotion.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking cloud fixes to
   `.github/workflows/*.yml`. Directly gates item 1 above and the
   dispatch-order candidate's (likely now-moot) text fix.
3. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
4. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag.
5. **36 pending phase candidates**, 30 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.0]` crash-dedupe fix) are worth pulling forward.
6. **`plan/CRITIQUE.md` is 135 days stale** — the fresh-eyes loop
   has been off for over four months. Confirmed root cause (cloud
   categorically can't run it), sitting as a standing
   `[needs-user-call]` decision in `PHASE_CANDIDATES.md` — worth a
   conscious call rather than letting it drift further.

## Today's intent

The next tick's clearest pick is dispatching `/ship-content` for the
deep-dives row (`#998`, now 3 digest windows old). Given the
falsified dispatch-order hypothesis on the near-identical `#989`/
`#997` pattern, the likeliest explanation is ordinary dispatch-order
queuing (triage/phase/data work winning some ticks, `/iterate`'s own
audit sweep winning others) rather than a broken lane — but if
`#998` survives a fourth window, that's worth a fresh look. Failing
that pick, the 4 `[cross-links] [4.5]` rows on the guides article
are straightforward `/iterate` picks. `AUDIT.md` and
`PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work — everything else queued
needs a local `/oversight` pass.

## Tuning proposals

**None this tick.** No new crash instances to corroborate the
standing `[score 6.0]` crash-dedupe candidate (first fully clean
window in recent digests — worth noting, not scoring). The
dispatch-order `[score 6.5]` candidate already carries its
2026-09-20 falsification update; `#998` crossing 3 windows is noted
above as a watch item rather than a second falsification-reversal,
since the evidence so far (ordinary queuing, not a structural gap)
still holds. Nothing else in this window's pulse suggests a
mistuned gate, ceiling, or cadence.
