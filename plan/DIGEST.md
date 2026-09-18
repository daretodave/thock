# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet window — 6 completed cloud `march` ticks since the last
digest (`b60314dc`, 2026-09-17T15:20:56Z), all `success` at the
workflow level, all no-ops.** Zero commits landed on `main` between
the last digest and this one — nothing shipped, nothing broke.
Article count holds at 96 (106 with 10 newsletter issues), unchanged
from the prior digest.

**`#997` (guides pillar, filed 2026-09-15) is now open across three
consecutive digest windows** (2026-09-16, 2026-09-17, 2026-09-18) —
the same threshold that triggered the standing `[score 6.5]`
`PHASE_CANDIDATES.md` candidate's own filing back on 2026-09-12 for
`#989`. That candidate diagnosed `.github/workflows/march.yml:156`'s
embedded dispatch-order summary as silently omitting `/ship-content`
— a plausible mechanism for exactly this shape of stall. `#989` and
`#994` both eventually resolved (after 3 and 2 windows respectively),
so the mechanism reads as intermittent rather than a hard block, but
`#997` clearing 6 more no-op ticks without a single one reaching
content dispatch is the strongest evidence yet that filing the
candidate hasn't changed cloud's actual behavior — it still needs a
local `/oversight` promotion + push, which `#898` (`ACTIONS_PAT`
lacks `workflows` scope) still blocks cloud from doing itself. Added
a dated update note to the existing candidate row in
`PHASE_CANDIDATES.md` rather than filing a duplicate (see Tuning
proposals).

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (87 records, all cross-refs resolve — unchanged: 11
vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys /
20 trends), a clean production build, `size` OK (all four tracked
tool routes under budget, unchanged figures from the prior digest),
and 1238/1238 e2e (~8.3m, same count as the prior digest — no new
canonical URLs this window). The e2e run again logged the same
benign `Error: Internal: NoFallbackError` stderr noise on
dynamic-route fallback lookups — not attached to any failing test,
unchanged shape from prior digests, not re-filing. The verify run's
`build`/`data:validate` legs touched the three
`*.generated.json` runtime files (the standing `[data] [2.4]` AUDIT
row's drift shape) — restored via `git checkout` before this commit
so the digest's own diff stays notes-only. Deploy is `READY` at HEAD
(`b60314dc`).

## While you were out

| When (UTC, 09-17/09-18) | Tick | Outcome |
|---|---|---|
| 18:46→18:50 | cloud march | no-op — nothing dispatched |
| 21:53→21:57 | cloud march | no-op — nothing dispatched |
| 23:52→23:57 | cloud march | no-op — nothing dispatched |
| 03:00→03:03 | cloud march | no-op — nothing dispatched |
| 08:42→08:45 | cloud march | no-op — nothing dispatched |
| 13:20→13:24 | cloud march | no-op — nothing dispatched |

6 completed `march`-workflow runs since the last digest: **6
success, 0 failure, 0 cancelled, 0 shipped** (all report `success`
at the workflow level — no-ops are a clean-turn agent decision, not
a workflow error). `lighthouse`'s last 2 recorded runs: 1 `success`
(2026-09-17), 1 `skipped` (2026-09-18, unchanged shape — no new
content to score against). `night` (this workflow) last recorded
completed run was the 2026-09-17 digest (`success`); this tick is
the current one.

## Shipped

**Nothing this window.** All 6 completed `march` ticks since the
last digest no-opped — no phases, no data, no content, no
iterate-picked fixes. The queues below explain why: the build plan
and data backlog are both empty, and the one live content-gap row
(`#997`) sat un-dispatched across all 6 ticks (see Headline).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 10 open rows, unchanged in count from the
  prior digest — 5 standing sub-3.0 (`[seo] [2.7]` Mode Sonnet
  hero-art 65%→75%, `[content] [2.4]` plate-materials tension,
  `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]`
  generated-manifest drift, `[seo] [1.8]` orphaned `favicon.svg`
  duplicate), 4 `[needs-user-call]` (border-contrast WCAG 1.4.11
  `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off
  `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`), plus 1 open
  `[HOT PURSUIT]` content-gap row (**guides pillar `[7]` `#997`**,
  now 3 digest windows old — see Headline).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **131 days stale**, unchanged. Root cause
  confirmed since expand pass 218 (2026-07-23): cloud mode
  categorically skips `/critique` (no Chrome MCP on the runner);
  this is a `[needs-user-call]` decision sitting in
  `PHASE_CANDIDATES.md`, not a bug to re-diagnose.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 still the most recent
  recorded pass — no new expand pass ran this window (every tick
  no-opped, never falling through to failure-mode 6). **35 pending
  rows** (34 `[ ]` + 1 `[needs-user-call]`), unchanged in count —
  the standing `[score 6.5]` dispatch-order row got a dated
  evidence update this tick, not a new row (see Tuning proposals).
  Last promotion: phase 50, 2026-08-23T12:54Z — **26 days ago**.
  Highest-scored pending row is still `[7.5]` automated
  content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open, unchanged — `#997` (guides-pillar
  content-gap row, sole open content-gap issue), `#929`
  (`triage:reviewed`, informational), `#898` (`bug` +
  `triage:needs-user`, the `ACTIONS_PAT` workflow-scope limitation —
  still gating the standing dispatch-order fix).

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
- `e2e` — 1238/1238 passed (~8.3m), against `next start :4173` —
  unchanged count from the prior digest (no new content this
  window). Same benign `Error: Internal: NoFallbackError` stderr
  noise on dynamic-route fallback lookups as prior digests — not
  attached to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`b60314dc`) reports `READY`.

## Needs you

1. **`#997` has now hit the same 3-window mark that originally
   triggered the standing `[score 6.5]` `PHASE_CANDIDATES.md`
   candidate** (`.github/workflows/march.yml:156`'s dispatch-order
   summary omitting `/ship-content`) — but this time the candidate
   was already filed and sitting unpromoted through all 6 no-op
   ticks. Filing alone hasn't changed cloud's behavior; only a
   local `/oversight` promotion + one-line push
   (`.github/workflows/march.yml:156`, add `→ ship-content` between
   `ship-data` and `expand`) lands the fix, or `#997` can be
   dispatched manually via `/ship-content` in the meantime.
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
5. **35 pending phase candidates**, 26 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.5]` march.yml dispatch gap, `[6.0]` mirror-drain
   gap) are worth pulling forward.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The one
concrete next item is the open `[HOT PURSUIT]` content-gap row —
`#997` (guides) — which has now missed 6 consecutive `march` ticks;
the next tick should dispatch `/ship-content` for it before it
becomes a fourth-window watch item. Beyond content, `AUDIT.md` and
`PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work.

## Tuning proposals

**No new candidate filed this tick — added a dated evidence update
to the existing `[score 6.5]` `march.yml` dispatch-order candidate**
instead of duplicating it. `#997` clearing the same 3-window
threshold that originally triggered that candidate's filing (for
`#989`, 2026-09-12), while the candidate itself sat unpromoted
through all 6 of this window's no-op ticks, is corroborating
evidence the diagnosed gap is real and still open — not a new
mistuned-gate shape. See `PHASE_CANDIDATES.md`'s `[score 6.5]` row
for the full update.
