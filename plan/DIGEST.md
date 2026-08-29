# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, productive ~20-hour window — 15 cloud `march` ticks, all
15 green.** Since the last digest (`9d04a2dc`, 2026-08-28T14:44:07Z),
5 ticks shipped a substantive fix, 9 were `/expand` passes (368–376,
all "no new candidates"), and 1 was a clean no-op.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule (the
`e2e` leg needed a longer foreground wait than the default tool
timeout — handled by blocking on the same invocation rather than
letting it run unattended, per agents.md §3's "never background the
gate"). Deploy is `READY` at HEAD (`9911a381`).

The window's shape: five independent one-finding-per-tick fixes,
each caught by a fresh `/iterate` audit sweep and shipped the same
tick — a newsletter cadence gap (issue 009), a genuinely missing
weekly trend snapshot (`2026-W34`), a fabricated spark-array
discontinuity on the renamed "DCS Dolch / Molch" tracker row, a
stale present-tense tracker claim in an already-published article,
and a five-way empty-state dead end on `/vendor/prototypist`. None
scored above `[5.4]`; all five are now closed. In between, `/expand`
fired 9 times (368–376) and filed nothing — see Tuning proposals
below, since this digest is acting on that streak today rather than
deferring again.

`plan/AUDIT.md` holds **4 open `[ ]` rows**, unchanged in composition
from two digests ago (the newer `[4.8]`/`[4.0]` rows from that window
both shipped and closed this window): 3 standing low-score
mode-sonnet hero-art cascade rows (`[2.7]`, `[2.4]`, `[2.0]`) plus the
`[data] [2.4]` generated-manifest-drift row. Plus the 2 standing
`[needs-user-call]` rows, unchanged.

`plan/CRITIQUE.md` is now **110 days / ~2,547 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`). Diagnosis
unchanged (no Chrome MCP on the cloud runner), still filed as a
`[score 6.5] [needs-user-call]` candidate in
`plan/PHASE_CANDIDATES.md` awaiting `/oversight` promotion.
`plan/PHASE_CANDIDATES.md` now holds **32 live pending rows** (31
carried over + 1 new tuning proposal filed this tick, plus the 1
standing `needs-user-call`), pass 376, 6 days since the last
promotion (phase 50, 2026-08-23T12:54Z via local `/oversight`).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-28 16:07→16:26 | cloud march | content: newsletter "thock weekly — issue 09" shipped, closes `#943` |
| 08-28 20:53→21:20 | cloud march | data: backfilled missing `2026-W34` trend snapshot, closes `#949` |
| 08-28 22:06→22:26 | cloud march | fix: DCS Dolch/Molch W35 fabricated spark discontinuity corrected, closes `#950` |
| 08-28 23:07→23:21 | cloud march | expand pass 368 — no new candidates |
| 08-29 00:22→00:33 | cloud march | expand pass 369 — no new candidates |
| 08-29 01:10→01:28 | cloud march | expand pass 370 — no new candidates |
| 08-29 02:11→02:24 | cloud march | expand pass 371 — no new candidates |
| 08-29 03:10→03:18 | cloud march | expand pass 372 — no new candidates |
| 08-29 04:09→04:13 | cloud march | no-op |
| 08-29 05:08→05:27 | cloud march | content: fixed stale present-tense tracker claim in gmk-cyl-just-beachy article, closes `#951` |
| 08-29 06:13→06:31 | cloud march | expand pass 373 — no new candidates |
| 08-29 07:08→07:30 | cloud march | fix: `/vendor/prototypist` empty-state dead end closed, closes `#952` |
| 08-29 08:10→08:21 | cloud march | expand pass 374 — no new candidates |
| 08-29 09:08→09:28 | cloud march | expand pass 375 — no new candidates |
| 08-29 10:07→10:24 | cloud march | expand pass 376 — no new candidates |

15 `march`-workflow runs since the last digest: **15 success, 0
failure, 0 cancelled.** `night` ran success on its prior attempt
(2026-08-28T14:28:56Z); this tick's own run is in progress as this
file writes. `lighthouse` ran **10-for-10 success** across the same
window — the 5-consecutive-`skipped` anomaly flagged in the last
digest did not recur.

## Shipped

- **5 same-shape fixes, one per tick, each a fresh `/iterate` find**:
  newsletter issue 009 (content-gap cadence), the missing
  `2026-W34` trend snapshot (data-gap backfill), a fabricated
  spark-array discontinuity on the renamed "DCS Dolch / Molch" row
  (the D-continuity check's rename-blind-spot — noted, not yet
  hardened), a stale present-tense "currently listed on the Trends
  Tracker" claim in an already-published article whose tracker row
  had since dropped off, and a five-way empty-state dead end on
  `/vendor/prototypist` consolidated into one message plus a new
  inbound link from the vendor's own article. All five closed their
  mirrored GitHub issues same-tick.
- **9 `/expand` passes** (368–376): 0 new candidates across all
  nine — the last actual candidate filed was still pass 345
  (2026-08-23), extending the streak to **31 consecutive
  no-candidate passes** (346–376, spanning ~6 days). Every pass's
  own notes show the full 7-script mechanical-survey chain re-running
  clean, not a mechanism silently idling.

## Queues now

- **Build plan**: all 51 phases shipped, 0 pending — unchanged.
- **Cross-link drain**: 0 open `[cross-links]` `plan/AUDIT.md` rows
  — unchanged.
- **Critique**: pass 11, 2026-05-10 — **110 days / ~2,547 commits**
  stale. Diagnosis (no Chrome MCP on the cloud runner) remains filed
  as a `[score 6.5] [needs-user-call]` `plan/PHASE_CANDIDATES.md`
  candidate awaiting `/oversight` promotion — see Needs You below.
- **Phase candidates**: **32 live pending rows** (31 carried over +
  1 new tuning proposal this tick, plus 1 standing
  `needs-user-call`), pass 376, now 6 days since phase 50's
  promotion (2026-08-23T12:54Z). `/expand` itself has now gone 31
  consecutive passes (346–376, ~6 days) without filing a new one —
  this digest is acting on that streak today (see Tuning proposals).
- **Data backlog**: empty — `data/BACKLOG.md`'s Pending section is
  fully checked off. Record counts: 18 switches, 10 boards, 10
  keycap-sets, 11 vendors, 17 group-buys, 17 trends (83 total, up
  from 82 — the `2026-W34` backfill).
- **Open GitHub issues**: **4 open**, down from 5 last digest
  (`#943` shipped and closed this window). `#898` (`ACTIONS_PAT`
  workflow-scope gap) — standing, now **7 days open**, needs the
  user's PAT regen. `#915` (why-stabilizers-rattle cross-links) —
  fix shipped 2026-08-24 (`69ea1906`), issue still open **5 days
  later** — the mirror-drain-gap instance flagged in the last three
  digests, unchanged. `#928` (seven hero-art SVGs use stock
  blue/cyan, violating the warm-palette rule) — open, unpicked for a
  **fifth** digest running, `severity:med`. `#929` —
  `triage:reviewed`, no action needed.
- **`plan/AUDIT.md`**: **4 open `[ ]` Pending rows** — the 3 standing
  low-score mode-sonnet hero-art cascade rows (`[seo] [2.7]`,
  `[content] [2.4]`, `[seo] [2.0]`) plus `[data] [2.4]`
  committed-generated-manifest drift. All sub-3.0, none clearing the
  dispatch bar. Plus **2 standing `[needs-user-call]` rows**,
  unchanged: soft-404 structural block (`[bug] [4.2]`) and the
  mirror-drain-gap mechanism (`[engineering] [3.0]`, evidenced again
  by `#915` still being open).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 workspace projects.
- `lint` — green, all lintable workspaces.
- `test:run` — green, **109 files / 855 tests**. jsdom
  `Not implemented: navigation` and one intentional
  `<html>`-in-`<div>` hydration-warning console line are expected
  test-harness noise, not failures (same as prior digests).
- `test:scripts` — green, **230 tests / 83 suites**.
- `data:validate` — green, **83 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 17 trends).
- `build` — green, first attempt, no retries, static + dynamic
  routes all generated cleanly.
- `size` — green, homepage bundle **147.1 KB / 200 KB** budget;
  `/search` **144.4 KB / 175 KB** budget — same comfortable headroom
  as last digest.
- `e2e` — green, **1,208/1,208** (up from 1,201 — new coverage from
  this window's vendor-detail-empty-state and tracker-claim fixes).
  Console `NoFallbackError` noise during the run is from intentional
  not-found-route probes, expected and non-blocking (same as prior
  digests).
- `pnpm deploy:check` at HEAD (`9911a381`) — deploy `READY`.

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth itself.

## Needs you

1. **Standing, highest-leverage: `ACTIONS_PAT` lacks the
   `workflows` PAT scope (`#898`).** Still unresolved, now **7 days
   open**. No cloud tick can push a change to
   `.github/workflows/*.yml` until this is fixed.
2. **Standing: `plan/CRITIQUE.md` is 110 days stale**, with no
   mechanism to self-correct under an all-cloud operating pattern.
   Root cause (no Chrome MCP on the cloud runner) is filed as a
   `[score 6.5] [needs-user-call]` candidate, ready for the next
   `/oversight` pass to act on directly (accept local-only cadence,
   design a Chrome-free substitute, or drop it).
3. **Standing, third digest running: `#915` mirror-drain-gap
   instance.** The why-stabilizers-rattle-deep-dive cross-link fix
   has been live for 5 days; the issue itself still hasn't closed.
   A 10-second `gh issue close 915` clears it; the underlying
   tooling gap is already tracked as a `[needs-user-call] [3.0]`
   `plan/AUDIT.md` row and a `[6.0]` `plan/PHASE_CANDIDATES.md`
   candidate.
4. **Standing, now a fifth digest running: `#928`**, seven hero-art
   SVGs use stock blue/cyan, violating the warm-palette rule — open,
   `severity:med`. It sits alongside the 3 related hero-art `[seo]`
   rows in `plan/AUDIT.md` (the mode-sonnet 65%/75% cascade), so a
   combined `/ship-asset` pass could plausibly clear all four at
   once. None of these currently clear the 3.0 dispatch bar on their
   own, which may be why the streak persists — worth a direct pick
   if you're doing a manual `/ship-asset` or `/iterate` pass.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`plan/AUDIT.md` `[bug] [4.2]`, row unchanged) — real 404 status
   and the "did you mean" not-found UX are mutually exclusive under
   current Next.js routing; needs an `/oversight` design call on
   which to prioritize.
6. **New: 6 days since the last `/oversight` promotion** (phase 50,
   2026-08-23T12:54Z), with 32 candidates now sitting in
   `plan/PHASE_CANDIDATES.md`'s Pending section. Cloud `/expand`
   cannot promote — only local `/oversight` can — so backlog depth
   won't move regardless of how often `/expand` fires. Not urgent
   (nothing here is time-sensitive), but the queue is the largest
   it's been.

## Today's intent

No `plan/AUDIT.md` row clears the 3.0 dispatch bar right now (the 4
open rows top out at `[2.7]`), the data backlog is empty, and the
content-gap queue is comfortable — so the next several cloud ticks
will likely keep following the pattern this window already showed:
a fresh `/iterate` general-purpose sweep finds one new, previously
undiscovered defect per tick and ships it same-tick, while `/expand`
keeps firing on schedule and finding nothing new to propose. If
that holds, consider a direct `/ship-asset` pass on the `#928` +
mode-sonnet hero-art cluster (Needs You #4) — it's the single
highest-value cluster currently sitting below the autonomous
dispatch bar.

## Tuning proposals

**One new candidate filed this tick**, acting on a commitment the
last three digests made explicitly: "if the no-candidate streak
reaches pass 375+ without a change in shipped-tick density, the next
digest should propose either widening `/expand`'s signal categories
or lengthening its dispatch interval." The streak crossed pass 375
at pass 376 (today's HEAD). Filed as `[score 3.6]` in
`plan/PHASE_CANDIDATES.md`: lengthen `skills/march.md` Step 3c's
20-commit/48h rate-limit with a streak-aware backoff (widen to
40-commit/96h once the no-candidate streak exceeds ~15, reset on the
next filed candidate or `/oversight` promotion) — the evidence favors
cadence over coverage, since all 31 passes found the existing signal
categories genuinely quiet rather than too narrow. Per this skill's
own meta-loop rail, this is a proposal only; `/oversight` decides
whether to promote, adjust, or reject it.
