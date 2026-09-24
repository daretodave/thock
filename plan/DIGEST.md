# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A working, self-clearing day.** Since the last digest
(`5ebed353`, 2026-09-23T15:21:27Z), 5 cloud `march` ticks
completed — all `success`, HEAD advanced 6 commits
(`5ebed353` → `0596c0da`). Two content-gap HOT PURSUIT rows shipped
clean: the deep-dives pillar's `#998` (open since 2026-09-19, called
out as a 4-window watch item in the last several digests) finally
drafted and closed in the 22:00 tick (`7876a215`, "PCB flex cuts,
explained"), and the trends pillar's `#999` — opened and closed
inside the same digest window — with "Hardware caught up to Wooting.
Firmware hasn't." (`a03bbee3`). `#998` tracked the `#997` precedent
named in the 2026-09-19 digest almost exactly: ordinary
dispatch-order queuing, not a stall, resolved without intervention.

A fresh HOT PURSUIT row opened this window and is still unshipped:
`#1000` (guides pillar, score 7.0, filed 13:11Z by the same
content-dispatch tick pattern as `#998`/`#999`). One tick old — not
yet a watch item, just tonight's clearest next pick.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects, clean), lint (0 warnings), 862/862
unit tests (109 files, apps/web), 230/230 script tests (83 suites),
`data:validate` (88 records, all cross-refs resolve — unchanged: 11
vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys /
21 trends), a clean production build, `size` OK (all four tracked
tool routes under budget, unchanged figures), and 1259/1259 e2e
(~8.3m, +12 over the last digest's 1247 — the two new articles'
canonical-URL and crosslink coverage). Same benign `Error: Internal:
NoFallbackError` stderr noise on dynamic-route fallback lookups as
every prior digest — not attached to any failing test, not filing.
Deploy is `READY` at HEAD (`0596c0da`).

**Still the loudest standing item: `plan/CRITIQUE.md` is 137 days
stale** (last real pass 2026-05-10T20:35:00Z, pass 11, `931c8a7`) —
unchanged again this window. Root cause has been confirmed since
expand pass 218 (2026-07-23): cloud mode categorically cannot run
`/critique` (no Chrome MCP on the runner), and every commit in the
last several months has been a cloud tick. This is a standing
`[needs-user-call]` decision sitting in `plan/PHASE_CANDIDATES.md`,
not a bug to re-diagnose — it needs a conscious `/oversight` call
(accept local-only cadence, build a cloud-compatible substitute, or
drop it) before the fresh-eyes loop can restart.

## While you were out

| When (UTC, 09-23/09-24) | Tick | Outcome |
|---|---|---|
| 18:12→18:14 | cloud march | no-op — nothing dispatched |
| 22:00→22:42 | cloud march | **shipped** — deep-dives article "PCB flex cuts, explained" (`7876a215`), closed HOT PURSUIT `#998` (open since 2026-09-19) |
| 01:01→01:05 | cloud march | opened HOT PURSUIT issue `#999` (trends pillar, `415d9b1e`) |
| 07:06→07:24 | cloud march | **shipped** — trends article "Hardware caught up to Wooting. Firmware hasn't." (`a03bbee3`), closed `#999` same-window |
| 13:07→13:12 | cloud march | opened HOT PURSUIT issue `#1000` (guides pillar) — still open, unshipped |

5 completed `march`-workflow runs since the last digest: **5
success, 0 failure, 0 cancelled, 2 content ships, 2 issue-opens, 1
no-op.** `lighthouse` ran twice this window (2026-09-24T07:24:16Z
and 13:11:50Z, both `success`) — tracking the two content pushes, as
expected. `night` (this workflow) last completed run was the
2026-09-23 digest (`success`); this tick is the current one.

## Shipped

- **deep-dives**: "PCB flex cuts, explained" (`7876a215`) — closes
  `#998`, the pillar's oldest open HOT PURSUIT row.
- **trends**: "Hardware caught up to Wooting. Firmware hasn't."
  (`a03bbee3`) — closes `#999`, opened and closed inside this same
  digest window.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **20 open rows, up from 14** in the prior
  digest. Breakdown: 5 standing sub-3.0 `[ ]` rows (unchanged:
  `[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]`
  plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2
  hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]`
  orphaned `favicon.svg`); 4 `[needs-user-call]` rows (unchanged:
  border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`); **10 `[cross-links] [4.5]` rows, up from 4** — the
  two new articles' crosslink surveys each filed new same-pillar
  pairs (`pcb-flex-cuts-explained` is the hub for 5 of them,
  `keyboard-cleaning-maintenance-guide` for 4, plus 1 new
  `wooting-rapid-trigger-head-start` pair); and 1 open `[HOT
  PURSUIT]` content-gap row (guides, `#1000`, filed this window,
  one tick old — not yet a watch item).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **137 days stale, unchanged and still
  growing.** See Headline; standing `[needs-user-call]` decision in
  `PHASE_CANDIDATES.md`.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (2026-09-09) still the
  most recent recorded expand pass — **15 days since the last
  pass**, none ran this window (digest doesn't dispatch `/expand`;
  march's own Step 3c gate — 20 commits/48h — wasn't met). **36
  pending rows** (35 `[ ]` + 1 `[needs-user-call]`), unchanged.
  Last promotion: phase 50, 2026-08-23 — **32 days ago**.
  Highest-scored pending row is still `[7.5]` automated
  content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#1000` (guides-pillar content-gap
  row, filed this window, tonight's clearest pick), `#929`
  (`triage:reviewed`, informational — still the root cause of the
  crash-dedupe gap, though 0 new crashes to log this window either;
  all 5 ticks completed clean), `#898` (`bug` + `triage:needs-user`,
  the `ACTIONS_PAT` workflow-scope limitation — still gating every
  pending `.github/workflows/march.yml` fix).

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
- `e2e` — 1259/1259 passed (~8.3m), against `next start :4173` —
  +12 over the prior digest's 1247 (the two new articles' canonical
  URLs and crosslink checks). Same benign `Error: Internal:
  NoFallbackError` stderr noise on dynamic-route fallback lookups as
  prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`0596c0da`) reports `READY`.

## Needs you

1. **`plan/CRITIQUE.md` is 137 days stale** — the fresh-eyes loop
   has been off for over four and a half months. Root cause
   confirmed (cloud categorically can't run it), sitting as a
   standing `[needs-user-call]` decision in `PHASE_CANDIDATES.md` —
   worth a conscious call rather than letting it drift further.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking cloud fixes to
   `.github/workflows/*.yml`. Directly gates the standing `[score
   6.0]` crash-dedupe fix and the `always()` march.yml gate fix,
   both written and verified but unpushable from cloud.
3. **The crash-issue safety net is still silently disabled** (0 new
   instances this window — all 5 ticks completed clean — but the
   mechanism is unchanged). Fix already described in the standing
   `[score 6.0]` `PHASE_CANDIDATES.md` row; blocked on `#898`.
4. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast
   WCAG 1.4.11 `[1.3]` (accept heavier dark-mode borders or a
   lighter-touch alternative), GTM consent-gate `[3.6]` (consent-gate
   vs. revert to cookieless Plausible), soft-404 structural
   trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
5. **36 pending phase candidates**, 32 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if the higher-scored rows (`[7.5]` fact-audit,
   `[6.0]` crash-dedupe fix) are worth pulling forward.

## Today's intent

The clearest pick for the next tick is dispatching `/ship-content`
for the guides row (`#1000`) — issue-stamped, scores 7.0, one tick
old. Failing that pick, the 10 `[cross-links] [4.5]` rows cluster
cleanly for `/iterate`'s cluster-drain (phase 46): `
pcb-flex-cuts-explained` is the hub for 5 pairs and
`keyboard-cleaning-maintenance-guide` for 4 — either drains in one
commit. `AUDIT.md` and `PHASE_CANDIDATES.md` remain otherwise
structurally empty of actionable, autonomously-shippable work —
everything else queued needs a local `/oversight` pass.

## Tuning proposals

**None this tick.** No new crash instances to corroborate the
standing `[score 6.0]` crash-dedupe candidate — all 5 ticks this
window completed with a genuine `success` conclusion and a clean
commit or no-op, not a masked crash. The dispatch-order shape that
produced the 4-window `#998` watch item in prior digests resolved
itself this window exactly as the `#997` precedent predicted, so
there's nothing new to file there either. The cross-link row growth
(4 → 10) is organic content-velocity backlog with an existing
cluster-drain mechanism (phase 46), not a mistuned gate. Nothing
else in this window's pulse suggests a mistuned gate, ceiling, or
cadence.
