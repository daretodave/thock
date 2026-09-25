# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean day — both open HOT PURSUIT rows shipped and the queue
is empty for the first time in several digests.** Since the last
digest (`0b883548`, 2026-09-24T15:36:41Z), 5 cloud `march` ticks
completed — all `success`, HEAD advanced 6 commits (`0b883548` →
`205775eb`). The guides pillar's `#1000` (open since 2026-09-24,
flagged as last night's clearest pick) shipped in the 18:07 tick
("Wireless keyboard buying guide: Bluetooth, 2.4GHz, and the
latency that actually matters," `a03d26b0`). A fresh deep-dives
HOT PURSUIT row opened as `#1002` at 00:16 and closed in the very
next content tick at 11:02 ("Rapid trigger is a firmware algorithm,
not a switch spec," `55f2bbd0`) — open-to-shipped inside 11 hours,
no multi-window stall. A `/triage` tick at 21:55 processed the
heartbeat false-positive issue `#1001` (routed to `AUDIT.md` as a
scoped `[ci] [4.8]` fix, not left to drift).

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects, clean), lint (0 warnings), 862/862
unit tests (109 files, apps/web — unchanged), 230/230 script tests
(83 suites — unchanged), `data:validate` (88 records, all
cross-refs resolve — unchanged: 11 vendors / 18 switches / 10
keycap-sets / 10 boards / 18 group-buys / 21 trends), a clean
production build, `size` OK (all four tracked tool routes under
budget, unchanged figures), and 1265/1265 e2e (~8.6m, +6 over the
last digest's 1259 — the two new articles' canonical-URL and
crosslink coverage). Same benign `Error: Internal: NoFallbackError`
stderr noise on dynamic-route fallback lookups as every prior
digest — not attached to any failing test, not filing. Deploy is
`READY` at HEAD (`205775eb`).

**Still the loudest standing item: `plan/CRITIQUE.md` is 138 days
stale** (last real pass 2026-05-10T20:35:00Z, pass 11, `931c8a7`) —
unchanged again this window. Root cause confirmed since expand pass
218 (2026-07-23): cloud mode categorically cannot run `/critique`
(no Chrome MCP on the runner), and every commit in the last several
months has been a cloud tick. This is a standing
`[needs-user-call]` decision sitting in `plan/PHASE_CANDIDATES.md`,
not a bug to re-diagnose — it needs a conscious `/oversight` call
(accept local-only cadence, build a cloud-compatible substitute, or
drop it) before the fresh-eyes loop can restart.

## While you were out

| When (UTC, 09-24/09-25) | Tick | Outcome |
|---|---|---|
| 18:07→18:26 | cloud march | **shipped** — guides article "Wireless keyboard buying guide" (`a03d26b0`), closed HOT PURSUIT `#1000` (open since prior digest) |
| 21:55→22:02 | cloud march | `/triage` — routed `#1001` (heartbeat false-positive) to `triage:loop-queued`, filed `AUDIT.md` `[ci] [4.8]` row (`e0e5d22e`) |
| 00:16→00:19 | cloud march | opened HOT PURSUIT issue `#1002` (deep-dives pillar, `49395420`) |
| 05:44→05:48 | cloud march | no-op — nothing dispatched |
| 11:02→11:25 | cloud march | **shipped** — deep-dives article "Rapid trigger is a firmware algorithm, not a switch spec" (`55f2bbd0`), closed `#1002` same-window |

5 completed `march`-workflow runs since the last digest: **5
success, 0 failure, 0 cancelled, 2 content ships, 1 triage tick, 1
issue-open, 1 no-op.** `lighthouse` ran 4 times this window
(2026-09-24T22:01:53Z success, 2026-09-25T00:19:59Z success,
06:50:12Z skipped, 11:25:30Z success) — the skip sits in the quiet
05:44→11:02 gap with no intervening push. `night` (this workflow)
last completed run was the 2026-09-24 digest (`success`); this
tick is the current one.

## Shipped

- **guides**: "Wireless keyboard buying guide: Bluetooth, 2.4GHz,
  and the latency that actually matters" (`a03d26b0`) — closes
  `#1000`, publishedAt 2026-09-11 (gap-fill, largest gap in the
  30-day window).
- **deep-dives**: "Rapid trigger is a firmware algorithm, not a
  switch spec" (`55f2bbd0`, slug
  `rapid-trigger-firmware-deep-dive`) — closes `#1002`, publishedAt
  2026-09-02 (gap-fill, largest gap in the 30-day window).

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **22 open rows, up from 20** in the prior
  digest. Breakdown: 5 standing sub-3.0 `[ ]` rows (unchanged:
  `[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]`
  plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2
  hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]`
  orphaned `favicon.svg`); 4 `[needs-user-call]` rows (unchanged:
  border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`); **12 `[cross-links] [4.5]` rows, up from 10** — the
  two new articles' crosslink surveys each filed new same-pillar
  pairs; and **1 new `[user-issue #1001] [ci] [4.8]`** row (the
  heartbeat false-positive, filed this window by `/triage`, fix is
  a one-file debounce to `heartbeat.yml`). **0 open content-gap HOT
  PURSUIT rows** — both `#1000` and `#1002` shipped and closed this
  window, first clean content queue in several digests.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **138 days stale, unchanged and still
  growing.** See Headline; standing `[needs-user-call]` decision in
  `PHASE_CANDIDATES.md`.
- **`plan/PHASE_CANDIDATES.md`**: pass 431 (2026-09-09) still the
  most recent recorded expand pass — **16 days since the last
  pass**, none ran this window (digest doesn't dispatch `/expand`;
  march's own Step 3c gate — 20 commits/48h — wasn't met). **36
  pending rows** (35 `[ ]` + 1 `[needs-user-call]`), unchanged.
  Last promotion: phase 50, 2026-08-23 — **33 days ago**.
  Highest-scored pending row is still `[7.5]` automated
  content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#1001` (`triage:loop-queued` + `bug`
  + `ci`, heartbeat false-positive, routed to the new `AUDIT.md`
  `[4.8]` row), `#929` (`triage:reviewed`, informational — still
  the root cause of the crash-dedupe gap, though 0 new crashes to
  log this window either; all 5 ticks completed clean), `#898`
  (`bug` + `triage:needs-user`, the `ACTIONS_PAT` workflow-scope
  limitation — still gating every pending
  `.github/workflows/*.yml` fix, including the new heartbeat one).

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web) —
  unchanged from the prior digest
- `test:scripts` — 230/230 passed (83 suites) — unchanged
- `data:validate` — 88 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 21 trends) — unchanged from the prior digest
- `build` — clean production build
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1265/1265 passed (~8.6m), against `next start :4173` —
  +6 over the prior digest's 1259 (the two new articles' canonical
  URLs and crosslink checks). Same benign `Error: Internal:
  NoFallbackError` stderr noise on dynamic-route fallback lookups as
  prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed — nothing red. `deploy:check` at HEAD
(`205775eb`) reports `READY`.

## Needs you

1. **`plan/CRITIQUE.md` is 138 days stale** — the fresh-eyes loop
   has been off for over four and a half months. Root cause
   confirmed (cloud categorically can't run it), sitting as a
   standing `[needs-user-call]` decision in `PHASE_CANDIDATES.md` —
   worth a conscious call rather than letting it drift further.
2. **`#898`** (`triage:needs-user`) — `ACTIONS_PAT` lacks
   `workflows` scope, blocking cloud fixes to
   `.github/workflows/*.yml`. Directly gates the standing `[score
   6.0]` crash-dedupe fix, the `always()` march.yml gate fix, and
   now also the new `#1001` heartbeat-debounce fix — all
   fully-scoped one-file changes sitting unpushable from cloud.
3. **The crash-issue safety net is still silently disabled** (0 new
   instances this window — all 5 ticks completed clean — but the
   mechanism is unchanged). Fix already described in the standing
   `[score 6.0]` `PHASE_CANDIDATES.md` row; blocked on `#898`.
4. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast
   WCAG 1.4.11 `[1.3]` (accept heavier dark-mode borders or a
   lighter-touch alternative), GTM consent-gate `[3.6]` (consent-gate
   vs. revert to cookieless Plausible), soft-404 structural
   trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
5. **36 pending phase candidates**, 33 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass if the higher-scored rows (`[7.5]` fact-audit,
   `[6.0]` crash-dedupe fix, the new `#1001` debounce fix) are worth
   pulling forward together, since all three need the same local
   push anyway.

## Today's intent

For the first time in several digests, **no open HOT PURSUIT
content-gap row** is waiting — both `#1000` and `#1002` shipped
clean this window. The clearest next pick is the 12
`[cross-links] [4.5]` rows: `pcb-flex-cuts-explained` is the hub
for 5 pairs and `keyboard-cleaning-maintenance-guide` for 4 —
either drains cleanly in one commit via `/iterate`'s cluster-drain
(phase 46). The new `[ci] [4.8]` heartbeat row is fully scoped
(one-line debounce to `.github/workflows/heartbeat.yml`) but, like
the standing crash-dedupe and gate fixes, needs a local
`/oversight` push rather than a cloud tick — `#898` blocks any
`.github/workflows/*.yml` edit from cloud. `AUDIT.md` and
`PHASE_CANDIDATES.md` are otherwise structurally empty of
actionable, autonomously-shippable work beyond the cross-link
drain — everything else queued needs a local `/oversight` pass.

## Tuning proposals

**None this tick.** All 5 ticks this window completed with a
genuine `success` conclusion and a clean commit or no-op — no
masked-crash evidence to corroborate the standing crash-dedupe
candidate. The mirror-drain mechanism worked correctly this
window too: both `#1000` and `#1002` closed via clean `Closes #N`
trailers with no title-drift or missing-trailer instance, unlike
the pattern the standing `[score 6.0]` mirror-drain candidate
tracks. The cross-link row growth (10 → 12) is organic
content-velocity backlog with an existing cluster-drain mechanism
(phase 46), not a mistuned gate. The one new AUDIT row (`#1001`
heartbeat false-positive) was handled through the ordinary
triage → AUDIT path, not a sign of a missing dispatch lane. Nothing
else in this window's pulse suggests a mistuned gate, ceiling, or
cadence.
