# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Another clean window — content-gap rotation working as designed,
one fresh row still open.** Since the last digest (`99c7e827`,
2026-09-13T14:44:17Z), 6 cloud `march` ticks completed, all 6
success: 2 filed content-gap audit rows (no ship), 1 shipped the
Monday weekly trend snapshot (`data/trends/2026-W38.json`), 1
shipped `/ship-content` draining the ideas-pillar `[HOT PURSUIT]`
row (`#993`), and 2 were plain no-ops. Net: 3 commits landed
content/data work, 2 landed audit bookkeeping.

**Rule 1's sliding window kept rotating on schedule.** The
ideas-pillar row (`#993`, filed 2026-09-13 17:16Z, window-start
2026-08-14) drained cleanly at the 05:43→06:03Z tick — "Build of
the week: the mission control desk, in Class80, Godspeed, and Box
White" (`f6a70ca3`), a theme-spotlight parts-pairing piece. The
audit-closure follow-up landed 16 seconds later (`624a82d8`). By
11:40Z the survey had already refilled: a **fresh news-pillar
`[HOT PURSUIT]` row** (`#994`, window-start 2026-08-15) is open
right now, one tick old.

**Worth flagging for whoever next reviews the standing `[score
6.5]` march.yml dispatch-order candidate**: the ideas-pillar row
sat through *two* no-op ticks (20:14Z, 22:49Z on 09-13) before the
Monday-snapshot tick and then the actual drain tick picked it up —
roughly 12.5 hours and 3 cloud ticks between the row being filed
and it shipping, despite carrying the highest score (7.0) available
in the queue the whole time. The prior digest cited the
news-pillar row's same-tick drain as direct counter-evidence
against that candidate's hypothesis; this window's slower drain is
a data point back in the other direction. Not conclusive either
way — both behaviors have now been observed — but worth weighing
when that candidate next comes up for `/oversight` review. Not
filing this as a new candidate; it's fresh evidence on an existing
row, cited here per the digest's own rule against editing
candidates directly.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (87 records, all cross-refs resolve — up from 86),
a clean production build, `size` (all six tracked routes
comfortably under budget, figures unchanged from the prior digest),
and 1235/1235 e2e (~7.8m, up from 1229 — reflects the two new
articles' route/OG coverage). Article count is now 95 (up from
~93 two digests back) plus 10 newsletter issues — 105 content
pieces total. Deploy is `READY` at HEAD (`2f67c3a9`).

**The standing mistuned-gate signals are otherwise unchanged** —
re-flagged below with fresh ages.

## While you were out

| When (UTC, 09-13/09-14) | Tick | Outcome |
|---|---|---|
| 17:12→17:17 | cloud march | filed `#993` — ideas-pillar `[HOT PURSUIT]` content-gap row |
| 20:14→20:17 | cloud march | no-op — nothing to dispatch |
| 22:49→22:53 | cloud march | no-op — nothing to dispatch |
| 00:39→00:58 | cloud march | **shipped** — Monday weekly trend snapshot `data/trends/2026-W38.json` |
| 05:43→06:03 | cloud march | **shipped** — `/ship-content` drained `#993` (ideas pillar, mission-control theme build) |
| 11:40→11:44 | cloud march | filed `#994` — news-pillar `[HOT PURSUIT]` content-gap row |

6 completed `march`-workflow runs since the last digest: **6
success, 0 failure, 0 cancelled**, 2 no-op, 2 audit-only (issue
filed, no ship), 2 shipped. `lighthouse`'s two most recent
completed runs (2026-09-14T06:03Z and 2026-09-14T11:43Z, tracking
the two pushes since) were both success. `night` (this workflow)
ran success on its prior attempt (2026-09-13 digest run); this
tick is the current one.

## Shipped

**One content piece, one data snapshot, one tick each.**
`/ship-content` drafted and shipped "Build of the week: the
mission control desk, in Class80, Godspeed, and Box White" at
`/article/mission-control-theme-build` (publishedAt 2026-09-06,
gap-fill midpoint of the 30-day window), closing `#993` and the
ideas-pillar `[HOT PURSUIT]` row. The Monday weekly-snapshot gate
also fired, adding `data/trends/2026-W38.json`. The other 4 ticks
found nothing to ship directly: 2 no-ops, and 2 that filed
content-gap audit rows (mechanical bookkeeping, not a ship).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 5 standing sub-3.0 rows unchanged (two Mode
  Sonnet hero-art 65%→75% redraws `[2.7]`/`[2.0]`, a plate-materials
  content-tension item `[2.4]`, a generated-manifest-drift
  observation `[2.4]`, the unreferenced `favicon.svg` duplicate
  `[1.8]`), 4 `[needs-user-call]` rows unchanged (soft-404
  structural trade-off `[4.2]`, `loop:opened` mirror-drain gap
  `[3.0]`, GTM consent-gate `[3.6]`, dark-mode border-contrast WCAG
  1.4.11 `[1.3]`), plus 1 fresh `[HOT PURSUIT]` content-gap row
  (**news pillar, `[7]`**, filed 2026-09-14, window-start
  2026-08-15, issue `#994`) — the ideas-pillar row is now `[x]`
  closed.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~127 days stale**, unchanged. Root cause
  confirmed since expand pass 218 (2026-07-23): cloud mode
  categorically skips `/critique` (no Chrome MCP on the runner);
  this is a `[needs-user-call]` decision sitting in
  `PHASE_CANDIDATES.md`, not a bug to re-diagnose.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (2026-09-09-dated
  header, most recent pass notes through 431), **35 pending rows**
  (34 `[ ]` + 1 `[needs-user-call]`), file untouched since the
  2026-09-12 digest — no new expand pass ran this window (march's
  Step 3c cadence gate never tripped: well under the 20-commit/48h
  threshold on every tick). Last promotion: phase 50,
  2026-08-23T12:54Z — **22 days ago**. Highest-scored pending row
  is still `[7.5]` automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open, up from 2 — `#994` (fresh, this
  window's news-pillar content-gap row, awaiting `/ship-content`),
  `#929` (`triage:reviewed`, informational), and `#898` (`bug` +
  `triage:needs-user`, the `ACTIONS_PAT` workflow-scope limitation,
  unchanged). `#993` is now closed (shipped this window).

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 87 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 20 trends) — up from 86 (the W38 snapshot)
- `build` — clean production build
- `size` — `/page` 146.7 KB gz (budget 200 KB), `/search/page`
  144.0 KB gz, `/quiz/switch` 145.2 KB gz, `/quiz/keycap-set`
  145.3 KB gz, `/compare/switch` 142.2 KB gz, `/compare/board`
  142.2 KB gz (budget 175 KB each) — all six routes comfortably
  under budget, figures unchanged from the prior digest (no
  client-JS-affecting commit landed this window)
- `e2e` — 1235/1235 passed (~7.8m, up from 1229 — the two new
  articles' routes/OG images added coverage), against
  `next start :4173`. The run again logged benign `Error: Internal:
  NoFallbackError` stderr noise on dynamic-route fallback lookups —
  not attached to any failing test, same unchanged shape as prior
  digests, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`2f67c3a9`) reports `READY`.

## Needs you

1. **Promote or reject the `/critique` cloud-skip diagnostic**
   (`[needs-user-call] [score 6.5]` in `PHASE_CANDIDATES.md`) — the
   fresh-eyes loop has been silent for ~127 days and the root cause
   (no Chrome MCP on the cloud runner) has been confirmed since
   expand pass 218, now 83 days ago. Options are laid out in the
   candidate row: accept as a local-only ritual, build a cloud-
   compatible substitute, or drop it.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking any cloud fix to
   `.github/workflows/*.yml`. This gates at least three pending
   candidates from ever landing autonomously: the march.yml
   dispatch-order summary fix `[6.5]` (see Headline — this window's
   evidence is mixed, not settled), the crash-issue `always()` gate
   fix `[6.0]`, and the permission gap itself `[5.5]`. A single
   local PAT rescope would unblock all three at once.
3. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
4. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag.
5. **The asset-hygiene dispatch-gap candidate** (`[score 5.5]`,
   filed pass 399) — a named fix with no dispatch path; would drain
   the two standing Mode Sonnet hero-art redraw rows in one commit.
6. **35 pending phase candidates**, 22 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.5]` march.yml dispatch gap, `[6.0]` mirror-drain
   gap) are worth pulling forward.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The concrete
next item is the fresh news-pillar `[HOT PURSUIT]` row (`#994`,
`[7]`, window-start 2026-08-15) — the next `/march` tick should
dispatch `/ship-content` for it. Given this window's mixed
evidence on drain latency (see Headline), it's worth a quiet watch:
does it drain same-tick like the news-pillar row two windows ago,
or take a few no-op ticks like the ideas-pillar row this window?
Beyond content, `AUDIT.md` and `PHASE_CANDIDATES.md` remain
otherwise structurally empty of actionable, autonomously-shippable
work.

## Tuning proposals

**None filed this tick.** The pulse is nominal — verify green,
deploy green, the one open content-gap row from the prior window
drained within it. The one notable signal is evidentiary, not a
new proposal: this window's slower (2-no-op-tick) drain of the
ideas-pillar row is a data point *for* the standing `[score 6.5]`
march.yml dispatch-order candidate, partially offsetting the prior
digest's same-tick counter-evidence — noted in the Headline for
whoever runs the next `/oversight` pass on that row, not applied as
an edit (digest proposes new candidates only; it doesn't revise
existing ones).

The standing candidates — `/critique` cloud-skip diagnostic
(`[needs-user-call] [score 6.5]`), asset-hygiene dispatch gap
(`[score 5.5]`), and the 35-deep promotion backlog — are unchanged
in shape since the last digest; re-cited with fresh ages in Needs
You above rather than re-filed as new rows.
