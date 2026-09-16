# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet window, zero content shipped, and the march.yml
dispatch-order bug now has a third confirmed instance.** Since the
last digest (`33f0ceb6`, 2026-09-15T15:25:43Z), 5 cloud `march`
ticks completed — **1 partial ("shipped" only a content-gap
audit row + a GitHub issue, no article), 4 genuine no-ops** —
landing 2 commits: `d3219f78` (guides pillar dropped into hot
pursuit, auto-filed by `content-gap-survey.mjs`) and `c23d01c5`
(the same tick's `/ship-content` dispatch opened issue `#997` but
produced no MDX file, no commit beyond the audit-row edit). Article
count holds flat at 95 (105 with 10 newsletter issues) — unchanged
since the prior digest.

**The news-pillar row (`#994`, filed 2026-09-14) has now survived
two full digest windows** — this is the second digest in a row to
report it open, on top of ~14 completed `march` ticks since it was
filed with zero dispatch success. **A second, independent row
(guides, `#997`, filed 2026-09-15) joined it this window** and is
already showing the identical shape: opened a tracking issue,
shipped nothing. That makes **three** confirmed instances of the
pattern the standing `[score 6.5]` `PHASE_CANDIDATES.md` candidate
diagnosed on 2026-09-12 from `#989` (`#989` itself resolved
2026-09-13, so the mechanism isn't permanently blocking — it's
non-deterministic, and currently on a bad streak): `#989` (3
digest-windows to resolve), `#994` (2 windows and counting, still
open), `#997` (1 window, already following the same no-op-after-
issue-open shape). `.github/workflows/march.yml:156`'s embedded
dispatch-order summary — *"triage → critique (skipped) →
ship-a-phase → ship-data → expand → iterate"* — still omits
`/ship-content` verbatim; cloud remains unable to patch it directly
(`#898` blocks workflow-file edits). This is now the strongest
evidentiary case yet for a local one-line push. See Needs You.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (87 records, all cross-refs resolve — unchanged: 11
vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys /
20 trends), a clean production build, `size` OK (all tracked routes
under budget, e.g. `/quiz/keycap-set` 145.3 KB / 175 KB,
`/compare/switch` and `/compare/board` 142.1 KB / 175 KB), and
1235/1235 e2e (~8.0m). The e2e run again logged the same benign
`Error: Internal: NoFallbackError` stderr noise on dynamic-route
fallback lookups — not attached to any failing test, unchanged
shape from prior digests, not re-filing. Deploy is `READY` at HEAD
(`c23d01c5`).

## While you were out

| When (UTC, 09-15/09-16) | Tick | Outcome |
|---|---|---|
| 19:29→19:33 | cloud march | partial — auto-filed guides content-gap row, dispatched `/ship-content`, opened `#997`, no article shipped |
| 22:41→22:45 | cloud march | no-op — nothing dispatched |
| 01:01→01:05 | cloud march | no-op — nothing dispatched |
| 07:08→07:13 | cloud march | no-op — nothing dispatched |
| 13:03→13:07 | cloud march | no-op — nothing dispatched |

5 completed `march`-workflow runs since the last digest: **5
success, 0 failure, 0 cancelled** (all runs report `success`
conclusion at the workflow level — the content-shipping failure is
inside the agent's own turn, not a workflow error). `lighthouse`'s
last 2 recorded runs are both `success`. `night` (this workflow)
last recorded completed run was the 2026-09-15 digest (`success`);
this tick is the current one.

## Shipped

**Nothing shippable landed this window.** The one non-no-op tick
(19:29) only advanced bookkeeping: it correctly detected the guides
pillar dropping into Rule-1 hot pursuit and auto-filed the AUDIT.md
row + opened issue `#997`, then dispatched `/ship-content` per
`skills/march.md` §3b.5 — but that dispatch produced no MDX file,
no hero art, no commit. Same failure shape as `#989`'s and `#994`'s
earlier no-op streaks. See Headline for the pattern-level read.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: 11 open rows — 5 standing sub-3.0 (`[seo]
  [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]`
  plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2
  hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]`
  orphaned `favicon.svg` duplicate), 4 `[needs-user-call]`
  (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`), plus 2 `[HOT PURSUIT]` content-gap rows (**news
  pillar `[7]` `#994`**, now ~2 digest windows old; **guides pillar
  `[7]` `#997`**, new this window) — see Headline.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **~129 days stale**, unchanged. Root cause
  confirmed since expand pass 218 (2026-07-23): cloud mode
  categorically skips `/critique` (no Chrome MCP on the runner);
  this is a `[needs-user-call]` decision sitting in
  `PHASE_CANDIDATES.md`, not a bug to re-diagnose.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 still the most recent
  recorded pass — no new expand pass ran this window (every tick
  either no-opped or attempted a content dispatch, never falling
  through to failure-mode 6). **35 pending rows** (34 `[ ]` + 1
  `[needs-user-call]`), unchanged in count. Last promotion: phase
  50, 2026-08-23T12:54Z — **24 days ago**. Highest-scored pending
  row is still `[7.5]` automated content-fact-vs-catalog
  numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 4 open (up from 3) — `#997` (**new**, this
  window's guides-pillar content-gap row), `#994` (still open,
  news-pillar content-gap row, now the older of the two), `#929`
  (`triage:reviewed`, informational), `#898` (`bug` +
  `triage:needs-user`, the `ACTIONS_PAT` workflow-scope limitation
  — still gating the fix both content-gap rows need).

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
- `size` — all tracked routes comfortably under budget, figures
  unchanged from the prior digest (no client-JS-affecting commit
  landed this window)
- `e2e` — 1235/1235 passed (~8.0m), against `next start :4173`. Same
  benign `Error: Internal: NoFallbackError` stderr noise on
  dynamic-route fallback lookups as prior digests — not attached to
  any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`c23d01c5`) reports `READY`.

## Needs you

1. **The march.yml dispatch-order candidate now has a third
   instance** (`[score 6.5]` in `PHASE_CANDIDATES.md`, proposed
   2026-09-12 from `#989`). `#994` (news) has now sat open across
   **two consecutive digest windows** with zero shipped content,
   and `#997` (guides, filed this window) has already started
   repeating the identical shape after a single tick. `#989` itself
   did eventually resolve (2026-09-13), so the failure isn't a hard
   block — it's an intermittent miss that's now missed 3 times out
   of 3 tracked instances. `.github/workflows/march.yml:156` still
   omits `/ship-content` from its embedded dispatch-order sentence.
   Cloud cannot patch its own workflow file (`#898` blocks it) — a
   local one-line push (append `→ ship-content` between
   `ship-data` and `expand`) is the standing proposed fix, or both
   `#994` and `#997` can be dispatched manually via `/ship-content`
   in the meantime to clear the backlog directly.
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
5. **35 pending phase candidates**, 24 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if any of the higher-scored rows (`[7.5]`
   fact-audit, `[6.5]` march.yml dispatch gap, `[6.0]` mirror-drain
   gap) are worth pulling forward.

## Today's intent

No pending phase — the loop stays in `/iterate` mode. The concrete
next items are the two open `[HOT PURSUIT]` content-gap rows —
`#994` (news, oldest) and `#997` (guides, newest) — the next
`/march` tick should dispatch `/ship-content` for `#994` first
(older row, per pillar-selection tie-break) before a third pillar
has a chance to stack on top. Beyond content, `AUDIT.md` and
`PHASE_CANDIDATES.md` remain otherwise structurally empty of
actionable, autonomously-shippable work.

## Tuning proposals

**None filed this tick.** No new mistuned-gate shape emerged that
isn't already captured by the standing `[score 6.5]` march.yml
dispatch-order candidate. The signal this window is evidentiary,
not a new proposal: a third independent instance (`#997`, on top of
`#989` and `#994`) of the same failure shape, with `#994` now
spanning two full digest windows unresolved — cited above in
Headline and Needs You for whoever runs the next `/oversight` pass
on that row, not applied as an edit (digest proposes new candidates
only; it doesn't revise existing ones).

The standing candidates — march.yml dispatch-order gap (`[score
6.5]`), `/critique` cloud-skip diagnostic (`[needs-user-call] [score
6.5]`), asset-hygiene dispatch gap (`[score 5.5]`), and the
35-deep promotion backlog — are unchanged in shape since the last
digest, re-cited with fresh ages in Needs You above rather than
re-filed as new rows.
