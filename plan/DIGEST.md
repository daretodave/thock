# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The news-pillar content-gap row shipped this window — the
guides-pillar row is now the one carrying the streak.** Since the
last digest (`a3e272b2`, 2026-09-16T15:19:28Z), 6 cloud `march`
ticks completed — **1 shipped, 5 no-ops** — landing 2 commits:
`9e349b39` (news pillar article, "Keychron launches Q16 HE 8K with
ceramic-TMR magnetic switches") and `9bb264ee` (the matching
`AUDIT.md` resolution for `#994`). The shipping tick (17:55→18:23
UTC, 28 minutes — visibly longer than the ~3-4 minute no-op ticks
either side of it) correctly picked `#994` (news, window-start
2026-08-15) over `#997` (guides, window-start 2026-08-16) per the
pillar tie-break rule, once it did dispatch content. Article count
is now 96 (106 with 10 newsletter issues), up 1 from the prior
digest.

**`#997` (guides pillar, filed 2026-09-15) is now the second
consecutive digest window reporting it open** — none of the 6
ticks this window dispatched `/ship-content` for it, even though
one of them did dispatch for `#994`. Read together with `#989`
(resolved after 3 windows) and `#994` (resolved after 2 windows,
this window), the pattern the standing `[score 6.5]`
`PHASE_CANDIDATES.md` candidate diagnosed from `#989` continues to
hold as **intermittent, not a hard block**: content dispatch does
fire, just not every tick a HOT PURSUIT row is open.
`.github/workflows/march.yml:156`'s embedded dispatch-order
sentence still omits `/ship-content` verbatim; cloud still cannot
patch it directly (`#898`). No new evidence changes the diagnosis
from the last three digests — not re-filing, just updating the
scoreboard (see Needs You).

**This tick's own fresh `pnpm verify` is fully clean** — all 8
legs green, run as sequential foreground calls per the standing
rule: typecheck (9 workspace projects), lint (0 warnings), 862/862
unit tests (109 files, apps/web), 230/230 script tests (83
suites), `data:validate` (87 records, all cross-refs resolve —
unchanged: 11 vendors / 18 switches / 10 keycap-sets / 10 boards /
18 group-buys / 20 trends), a clean production build, `size` OK
(all four tracked tool routes under budget, unchanged from the
prior digest), and 1238/1238 e2e (~8.1m, up from 1235 — the new
article added canonical-URL coverage). The e2e run again logged
the same benign `Error: Internal: NoFallbackError` stderr noise on
dynamic-route fallback lookups — not attached to any failing test,
unchanged shape from prior digests, not re-filing. Deploy is
`READY` at HEAD (`9bb264ee`).

## While you were out

| When (UTC, 09-16/09-17) | Tick | Outcome |
|---|---|---|
| 17:55→18:23 | cloud march | shipped — news pillar article + AUDIT resolution (`#994` closed) |
| 20:51→20:54 | cloud march | no-op — nothing dispatched |
| 23:30→23:35 | cloud march | no-op — nothing dispatched |
| 03:13→03:17 | cloud march | no-op — nothing dispatched |
| 09:09→09:12 | cloud march | no-op — nothing dispatched |
| 14:38→14:41 | cloud march | no-op — nothing dispatched |

6 completed `march`-workflow runs since the last digest: **6
success, 0 failure, 0 cancelled** (all report `success` at the
workflow level — no-ops are a clean-turn agent decision, not a
workflow error). `lighthouse`'s last 2 recorded runs are both
`success` (unchanged, no new run this window). `night` (this
workflow) last recorded completed run was the 2026-09-16 digest
(`success`); this tick is the current one.

## Shipped

**One article.** "Keychron launches Q16 HE 8K with ceramic-TMR
magnetic switches" (`/article/keychron-q16-he-8k-ceramic-tmr`),
drafted for the news pillar's Rule 1 hot-pursuit gap (`#994`,
filed 2026-09-14). `publishedAt` 2026-09-07, aligned with the
W37 tracker snapshot that broke the news — Keychron's Kickstarter
launch for a ceramic-TMR magnetic-switch board, contrasted against
Cherry/XTRFY's earlier TMR bet. Landed in commit `9e349b39`, with
the matching `AUDIT.md` resolution row in `9bb264ee` closing
`#994`. Nothing else shipped this window — the other 5 ticks were
clean no-ops.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 10 open rows (down from 11) — 5 standing
  sub-3.0 (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content]
  [2.4]` plate-materials tension, `[seo] [2.0]`
  cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]`
  generated-manifest drift, `[seo] [1.8]` orphaned `favicon.svg`
  duplicate), 4 `[needs-user-call]` (border-contrast WCAG 1.4.11
  `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off
  `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`), plus 1 open
  `[HOT PURSUIT]` content-gap row (**guides pillar `[7]` `#997`**,
  now 2 digest windows old — see Headline). `#994`'s row closed
  this window.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~130 days stale**, unchanged. Root cause
  confirmed since expand pass 218 (2026-07-23): cloud mode
  categorically skips `/critique` (no Chrome MCP on the runner);
  this is a `[needs-user-call]` decision sitting in
  `PHASE_CANDIDATES.md`, not a bug to re-diagnose.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 still the most recent
  recorded pass — no new expand pass ran this window (every tick
  either no-opped or shipped content, never falling through to
  failure-mode 6). **35 pending rows** (34 `[ ]` + 1
  `[needs-user-call]`), unchanged in count. Last promotion: phase
  50, 2026-08-23T12:54Z — **25 days ago**. Highest-scored pending
  row is still `[7.5]` automated content-fact-vs-catalog
  numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open (down from 4) — `#997` (guides-pillar
  content-gap row, now the sole open content-gap issue), `#929`
  (`triage:reviewed`, informational), `#898` (`bug` +
  `triage:needs-user`, the `ACTIONS_PAT` workflow-scope limitation
  — still gating the standing dispatch-order fix). `#994` closed
  this window.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web)
- `test:scripts` — 230/230 passed (83 suites)
- `data:validate` — 87 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 20 trends) — unchanged
- `build` — clean production build
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1238/1238 passed (~8.1m), against `next start :4173` —
  up from 1235, the new article's canonical URL added coverage.
  Same benign `Error: Internal: NoFallbackError` stderr noise on
  dynamic-route fallback lookups as prior digests — not attached to
  any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`9bb264ee`) reports `READY`.

## Needs you

1. **The march.yml dispatch-order candidate's scoreboard**
   (`[score 6.5]` in `PHASE_CANDIDATES.md`, proposed 2026-09-12
   from `#989`) now reads: `#989` resolved after 3 windows,
   `#994` resolved after 2 windows (this window), `#997` open
   after 1 window and counting. The mechanism keeps confirming
   itself as intermittent rather than a hard block — content
   dispatch does fire, roughly every 2-3 windows a HOT PURSUIT row
   is open, not every tick. `.github/workflows/march.yml:156`
   still omits `/ship-content` from its embedded dispatch-order
   sentence. Cloud cannot patch its own workflow file (`#898`
   blocks it) — a local one-line push (append `→ ship-content`
   between `ship-data` and `expand`) is the standing proposed fix,
   or `#997` can be dispatched manually via `/ship-content` in the
   meantime.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking any cloud fix to
   `.github/workflows/*.yml`. Gates the fix above plus at least two
   other pending candidates (the crash-issue `always()` gate fix
   `[6.0]`, the permission gap itself `[5.5]`). A single local PAT
   rescope would unblock all three at once.
3. **The border-contrast finding** (`[needs-user-call] [a11y]
   [1.3]` in `AUDIT.md`) — still open, still a taste call: accept
   visibly heavier borders in dark mode for WCAG 1.4.11 compliance,
   or a lighter-touch alternative.
4. **The GTM consent-gate finding** (`[needs-user-call] [3.6]` in
   `AUDIT.md`) — names a taste call: consent-gate the existing GTM
   tag vs. revert to the originally planned cookieless Plausible
   tag.
5. **35 pending phase candidates**, 25 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.5]` march.yml dispatch gap, `[6.0]` mirror-drain
   gap) are worth pulling forward.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The one
concrete next item is the open `[HOT PURSUIT]` content-gap row —
`#997` (guides) — which the next `/march` tick should dispatch
`/ship-content` for before a third pillar has a chance to stack on
top. Beyond content, `AUDIT.md` and `PHASE_CANDIDATES.md` remain
otherwise structurally empty of actionable, autonomously-shippable
work.

## Tuning proposals

**None filed this tick.** No new mistuned-gate shape emerged that
isn't already captured by the standing `[score 6.5]` march.yml
dispatch-order candidate. This window is evidentiary, not a new
proposal: `#994` resolved (2 windows), reinforcing that the
mechanism is intermittent rather than broken outright, while
`#997` opens a fresh instance of the same streak — cited above in
Headline and Needs You for whoever runs the next `/oversight` pass
on that row, not applied as an edit (digest proposes new candidates
only; it doesn't revise existing ones).

The standing candidates — march.yml dispatch-order gap (`[score
6.5]`), `/critique` cloud-skip diagnostic (`[needs-user-call] [score
6.5]`), asset-hygiene dispatch gap (`[score 5.5]`), and the
35-deep promotion backlog — are unchanged in shape since the last
digest, re-cited with fresh ages in Needs You above rather than
re-filed as new rows.
