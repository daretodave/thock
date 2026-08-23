# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, clean 23h35m — eight mechanical fixes drained back to
back, all seven mirrored issues closed same-tick, zero march
failures.** 24 `march` ticks since the last digest (`5f8ec03c`,
2026-08-22T10:51:10Z) ran green, zero failures, zero cancellations.
8 of those ticks shipped a fix; 9 more were `/expand` passes
(336–344) that filed no new candidates (routine reinforcement, no
thrash); the rest were clean no-ops.

**Nothing structurally new tonight.** No phase or content-gap work
queued, cross-link drain still fully empty, data backlog still
empty, `plan/AUDIT.md` still carries exactly the same 5 standing
non-autonomous rows as last digest. The loop spent the window on
its steady-state job: finding and shipping one sub-5.0 defect per
tick from fresh general-purpose sweeps.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule.
Deploy is `READY` at HEAD (`19cdb509`, `dpl_2fDwhUkM`).

`plan/CRITIQUE.md` is **still 105 days / 2,404 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — same
diagnosis as every digest since (no Chrome MCP on the cloud
runner), and unlike the last several nights, this diagnosis is now
**already filed** as a `[score 6.5] [needs-user-call]` candidate in
`plan/PHASE_CANDIDATES.md` ("Critique gate diagnostic — ROOT CAUSE
CONFIRMED"), waiting on the next `/oversight` promotion pass rather
than needing a fresh tuning proposal tonight.
`plan/PHASE_CANDIDATES.md` holds **30 live pending rows** (plus 1
`needs-user-call`), **70 days** since the last `/oversight`
promotion (2026-06-14, phases 46-49) — unchanged from last digest.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-22 13:22 | expand | pass 336 — 0 new candidates, mirror-drain-gap unchanged |
| 08-22 14:11 | expand | pass 337 — 0 new candidates, mirror-drain-gap unchanged |
| 08-22 15:20 → 15:21 | audit | vendor countryCode GB display label fixed, closes `#900` (`51ac7372`/`66ea8edb`) |
| 08-22 16:18 → 16:19 | audit | hall-effect-rapid-trigger-plateau — Gateron Oil King spark-spread overclaim corrected (`de71b610`/`49d22e02`) |
| 08-22 17:16 | expand | pass 338 — 0 new candidates, mirror-drain-gap unchanged |
| 08-22 18:26 | audit | `/ideas` double-priority hero images LCP fix, closes `#902` (`f8b3684f`/`7ad4bb1d`) |
| 08-22 21:20 | expand | pass 339 — 0 new candidates, sub-threshold observations re-verified |
| 08-22 22:27 | expand | pass 340 — 0 new candidates, signals unchanged |
| 08-22 23:12 | expand | pass 341 — 0 new candidates, unchanged |
| 08-23 02:49 → 02:50 | audit | outbound links — visual/AT-safe external indicator added, closes `#903` (`70e0be63`/`681ffe01`) |
| 08-23 03:49 | audit | compare selectors — accept unknown slugs from query params, dead-click Compare button fixed, closes `#904` (`e96e3671`/`de23e438`) |
| 08-23 04:20 → 05:17 | march ×2 | expand pass 342, 343 — 0 new candidates, unchanged |
| 08-23 06:24 → 06:25 | audit | newsletter-gap-survey off-by-one from truncated/untruncated date mismatch fixed, closes `#905` (`b3cde795`/`c5d9b83c`) |
| 08-23 07:36 | expand | pass 344 — 0 new candidates, unchanged |
| 08-23 09:28 | audit | InlineViz zoom-trigger button missing focus-visible ring fixed, closes `#906` (`bcd49546`/`aa34158f`) |
| 08-23 10:25 | audit | compare selectors — `react-hooks/exhaustive-deps` lint warnings cleared, closes `#907` (`fa9a76ca`/`19cdb509`) |

24 `march`-workflow runs since the last digest: **24 success, 0
failure, 0 cancelled.** `night` ran success on its prior attempt
(2026-08-22); this tick's run is in progress as this file writes.

## Shipped

- **Eight mechanical fixes, all same-tick issue closes**: compare
  selectors accepting unknown slugs from query params (dead-click
  Compare button, `#904`), compare selectors' `react-hooks/exhaustive-deps`
  lint warnings (`#907`), InlineViz zoom-trigger missing
  focus-visible ring (`#906`), outbound links missing a visual/AT-safe
  external indicator (`#903`), `/ideas` double-priority hero images
  hurting LCP (`#902`), vendor `countryCode` GB display label broken
  (`#900`), a newsletter-gap-survey off-by-one from a
  truncated/untruncated date mismatch (`#905`), and a content
  accuracy correction to the Gateron Oil King spark-spread claim in
  `hall-effect-rapid-trigger-plateau` (no mirrored issue — content-only
  fix).
- **Seven GitHub issues closed** (`#900`, `#902`, `#903`, `#904`,
  `#905`, `#906`, `#907`) — one fix (the Gateron content correction)
  had no mirrored issue to close.
- **Nine `/expand` passes** (336–344): 0 new candidates each, all
  routine reinforcement or sub-threshold re-verification. No thrash,
  nothing promoted or newly filed.
- **No content shipped this window** — Rule 1 stayed comfortable
  throughout; content-gap-survey filed nothing.

## Queues now

- **Build plan**: all 51 phases shipped, 0 pending.
- **Cross-link drain**: **0 open `[cross-links]` rows** — still
  fully drained, unchanged from last digest.
- **Critique**: pass 11, 2026-05-10 — **105 days / 2,404 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner); the diagnosis itself is now a filed `[score 6.5]
  [needs-user-call]` `plan/PHASE_CANDIDATES.md` candidate awaiting
  `/oversight` promotion — see Needs You below.
- **Phase candidates**: **30 live pending** rows in
  `plan/PHASE_CANDIDATES.md` (plus 1 `needs-user-call`), pass 344.
  **70 days** since the last `/oversight` promotion (2026-06-14,
  phases 46-49), unchanged. The `[7.5]` trend-snapshot data-quality
  gate and the `[7.5]` content-fact-vs-catalog numeric-spec audit
  remain the strongest candidates waiting on the next promotion.
- **Data backlog**: empty — `data/BACKLOG.md`'s Pending section is
  fully checked off.
- **Open GitHub issues**: **19 open**, unchanged. 0 unlabeled
  (triage gate clean). **6 labeled `triage:needs-user`** (`#898`,
  `#883`, `#756`, `#639`, `#499`, `#434`) — `#898` (`ACTIONS_PAT`
  workflow-scope gap) is still open and still the highest-leverage
  `/oversight` action available. 2 labeled `triage:reviewed`
  (`#882`, `#437`, no action needed). 11 remaining `loop:opened`
  issues are the standing mirror-drain-gap set, unchanged.

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint`'s Next-16
  deprecation notice is cosmetic, not a failure).
- `test:run` — green, **166 files / 1,227 tests** (web: 109 files /
  849 tests; content: 24 files / 165 tests; data: 19 files / 129
  tests; seo: 5 files / 44 tests; ui: 7 files / 31 tests; e2e-unit:
  1 file / 6 tests; tokens: 1 file / 3 tests).
- `test:scripts` — green, **74 suites / 208 tests**.
- `data:validate` — green, **81 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17 group-buys,
  15 trends).
- `build` — green, first attempt, no retries.
- `size` — green, homepage bundle **108.8 KB / 200 KB** budget;
  `/search` **106.5 KB / 150 KB** budget, unchanged.
- `e2e` — green, **1,168/1,168** in ~7.9m. Console noise from
  intentional not-found-route `NoFallbackError` probes during the
  run is expected, not a regression (documented in prior digests).
- `pnpm deploy:check` at HEAD (`19cdb509`) — deploy `READY`
  (`dpl_2fDwhUkM`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth. `plan/AUDIT.md` still carries exactly **5 open rows**, all
the same standing non-autonomous items as last digest (Lighthouse-CI
`[4.0]`, march.yml crash-issue-gate `[6.3]`, soft-404 structural-block
`[needs-user-call]`, heartbeat.yml dedup-scope `[4.0]`, mirrored-issue-drain
`[needs-user-call]`).

## Needs you

1. **Standing, highest-leverage: `ACTIONS_PAT` lacks the
   `workflows` PAT scope (`#898`).** Still unresolved. No cloud tick
   can push a change to `.github/workflows/*.yml` until this is
   fixed. Unblocks `#395` (march.yml crash-issue gate, `[6.3]`) and
   `#620` (heartbeat.yml dedup scope, `[4.0]`) — a 5-minute token
   change clears two standing AUDIT rows at once.
2. **Standing: `plan/CRITIQUE.md` is 105 days stale.** Dark since
   pass 11 (2026-05-10). The root cause (no Chrome MCP on the cloud
   runner) is now formally filed as a `[score 6.5]
   [needs-user-call]` candidate in `plan/PHASE_CANDIDATES.md` — the
   next `/oversight` pass can act on it directly (e.g., decide
   whether to run `/critique` locally on a manual cadence) rather
   than needing fresh diagnosis.
3. **Standing: Lighthouse CI disabled ~72 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original 2026-06-12 disable
   reason first.
4. **Standing: mirror-drain-gap `[needs-user-call] [3.0]`** — still
   at 11 open `loop:opened` issues, unchanged this window. No new
   instances surfaced, but none drained either.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) — non-autonomous, unchanged.
6. **Standing, growing: the `/oversight` promotion backlog.** 30
   live candidates pending, 70 days since the last promotion. The
   two `[7.5]` candidates (trend-snapshot data-quality gate,
   content-fact-vs-catalog numeric audit) are the clearest next
   picks, alongside the critique-gate diagnostic candidate above.

## Today's intent

No phase or content-gap work is queued — Rule 1 is comfortable, the
build plan is fully shipped, and the cross-link queue stays fully
drained. The next `/march` tick's most likely autonomous action is
another fresh audit sweep turning up one more sub-5.0 defect, the
same steady-state pattern as this entire window (8 fixes in 24
ticks, one qualifying finding roughly every 3 ticks). The open
questions are unchanged from last digest: the `#898` PAT-scope fix
remains the single highest-leverage `/oversight` action in the
queue, alongside the standing asks above (critique staleness now
with a filed candidate ready to act on, Lighthouse, the growing
promotion backlog).

## Tuning proposals

**None new this tick.** The meta-loop signals visible tonight
(mirror-drain-gap holding steady at 11, `/expand` cycling cleanly
through 9 no-candidate passes with no thrash) are already filed as
pending `plan/PHASE_CANDIDATES.md` candidates or GitHub issues from
prior ticks. `/expand`'s cadence and hit-rate continue to look
healthy; no fresh gate mistuning found.
