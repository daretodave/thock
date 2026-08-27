# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean, steady ~27-hour window — 16 cloud `march` ticks, all 16
green, zero failures.** Since the last digest (`e95901f3`,
2026-08-26T10:59Z), 5 of 16 ticks shipped a substantive fix, 6 were
`/expand` passes (361–366, all 0 new candidates), and 5 were clean
no-ops. No `march` failures this window at all — a clear contrast
with the prior window's two transient 429s.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule.
Deploy is `READY` at HEAD (`2e6e0059`).

**`plan/AUDIT.md` holds the same 3 open rows as last digest** — no
new standing findings this window; every audit finding filed this
window (5 of them) was resolved same-tick, filed-and-closed in one
commit pair. The 3 standing rows are all low-score, same-class
hero-art cascade findings from the mode-sonnet layout correction
(`[seo] [2.7]`, `[content] [2.4]`, `[seo] [2.0]`) — unchanged, still
`/ship-asset`-shaped.

`plan/CRITIQUE.md` is now **109 days / ~2,522 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — one day
older than last digest, same diagnosis (no Chrome MCP on the cloud
runner), still filed as a `[score 6.5] [needs-user-call]` candidate
in `plan/PHASE_CANDIDATES.md` awaiting `/oversight` promotion.
`plan/PHASE_CANDIDATES.md` holds **31 live pending rows**, unchanged
in count, pass 366, now 4 days since the last promotion (phase 50,
2026-08-23T12:54Z via local `/oversight`).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-26 11:08→11:29 | cloud march | perf: homepage hero/grid image sizes ignore 1280px container cap, closes AUDIT `[4.8]` |
| 08-26 12:09→12:12 | cloud march | no-op |
| 08-26 13:21→13:25 | cloud march | no-op |
| 08-26 14:16→14:33 | cloud march | content: thock-weekly-005 Durock T1 blurb no longer says "ships dry", closes `#938`'s residual AUDIT `[6.3]` |
| 08-26 15:46→15:52 | cloud march | expand pass 361 — no candidates, no new signal since pass 360 |
| 08-26 16:28→16:31 | cloud march | no-op |
| 08-26 17:57→18:07 | cloud march | expand pass 362 — no new candidates, 3 stale Considered entries cleaned up |
| 08-26 18:40→18:59 | cloud march | content: fix 4 residual Boba U4/U4T "same stem" claims commit 96987f07 missed |
| 08-26 19:33→19:56 | cloud march | content: relative-this-month pattern gap — 2 trends articles drifted stale |
| 08-26 20:47→20:57 | cloud march | expand pass 363 — no new candidates |
| 08-26 21:56→22:12 | cloud march | expand pass 364 — no new candidates |
| 08-26 23:05→23:30 | cloud march | fix: homepage trending tiles link to their articles, closes `#941` |
| 08-27 01:29→01:38 | cloud march | expand pass 365 — no new candidates |
| 08-27 03:44→03:47 | cloud march | no-op |
| 08-27 06:05→06:20 | cloud march | expand pass 366 — no new candidates |
| 08-27 10:17→10:21 | cloud march | no-op |

16 `march`-workflow runs since the last digest: **16 success, 0
failure, 0 cancelled.** `night` ran success on its prior attempt
(2026-08-26T10:42Z); this tick's own run is in progress as this file
writes. `lighthouse` ran 5 times since last digest, all green.

## Shipped

- **1 perf fix**: homepage hero/grid image sizes now respect the
  1280px container cap instead of requesting oversized art.
- **1 content fix**: `thock-weekly-005`'s Durock T1 Deep Dive teaser
  no longer contradicts the corrected "ships factory pre-lubed"
  premise.
- **1 catalog-fact correction**: 4 residual Boba U4/U4T "same stem"
  claims that an earlier fix (`96987f07`) missed.
- **1 content-language fix**: added a `relative-this-month` pattern
  rule and reworded 5 live instances across 2 trends articles that
  had drifted stale relative to their July 2026 publish dates.
- **1 enhancement**: homepage "Trending" strip tiles now link to
  their articles — the same class of fix as the prior window's
  cross-link work, closing `#941`.
- **6 `/expand` passes** (361–366): 0 new candidates across all
  six — the last actual candidate filed was still pass 345
  (2026-08-23); this window extends that streak to 21 consecutive
  no-candidate passes (346–366, spanning ~4 days).

## Queues now

- **Build plan**: all 51 phases shipped, 0 pending — unchanged.
- **Cross-link drain**: 0 open `[cross-links]` `plan/AUDIT.md` rows
  — unchanged from last digest.
- **Critique**: pass 11, 2026-05-10 — **109 days / ~2,522 commits**
  stale, one day older than last digest. Diagnosis (no Chrome MCP on
  the cloud runner) remains filed as a `[score 6.5]
  [needs-user-call]` `plan/PHASE_CANDIDATES.md` candidate awaiting
  `/oversight` promotion — see Needs You below.
- **Phase candidates**: **31 live pending rows** (plus 1
  `needs-user-call`), pass 366, unchanged in count from last digest,
  now 4 days since phase 50's promotion (2026-08-23T12:54Z).
  `/expand` itself has now gone 21 consecutive passes (346–366,
  ~4 days) without filing a new one — see Tuning proposals below for
  why this still isn't a tuning trigger. The `[7.5]`
  content-fact-vs-catalog numeric-spec audit and the two `[6.5]`
  candidates (truncation-boundary mechanical survey, OG
  render-verification gate) remain the strongest by evidence
  density.
- **Data backlog**: empty — `data/BACKLOG.md`'s Pending section is
  fully checked off. Record counts unchanged: 18 switches, 10
  boards, 10 keycap-sets, 11 vendors, 17 group-buys, 16 trends (82
  total).
- **Open GitHub issues**: **4 open**, unchanged from last digest.
  `#898` (`ACTIONS_PAT` workflow-scope gap) — standing, needs the
  user's PAT regen. `#915` (why-stabilizers-rattle cross-links) —
  fix already shipped in an earlier window, issue never
  auto-closed, same mirror-drain-gap instance as last digest.
  `#928` (seven hero-art SVGs use stock blue/cyan, violating the
  warm-palette rule) — open, unpicked for a third digest running,
  `severity:med`. `#929` (the 08-25 08:15Z march failure) — labeled
  `triage:reviewed`, no action needed.
- **`plan/AUDIT.md`**: **3 open `[ ]` Pending rows**, unchanged from
  last digest — all three are low-score cascade findings from the
  mode-sonnet layout correction chain. Plus **2 standing
  `[needs-user-call]` rows**, unchanged, non-autonomous by design:
  soft-404 structural block (`[bug] [4.2]`) and the mirror-drain-gap
  mechanism (`[engineering] [3.0]`, evidenced again by `#915`).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 workspace projects.
- `lint` — green, all lintable workspaces.
- `test:run` — green, **166 files / 1,236 tests** (web: 109/855;
  content: 24/167; data: 19/129; seo: 5/44; ui: 7/32; e2e-unit:
  1/6; tokens: 1/3).
- `test:scripts` — green, **81 suites / 225 tests**.
- `data:validate` — green, **82 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 16 trends).
- `build` — green, first attempt, no retries, static + dynamic
  routes all generated cleanly.
- `size` — green, homepage bundle **147.1 KB / 200 KB** budget;
  `/search` **144.4 KB / 175 KB** budget — same comfortable headroom
  as last digest.
- `e2e` — green, **1,201/1,201** in ~7.7m. Console `NoFallbackError`
  noise during the run is from intentional not-found-route probes,
  expected and non-blocking (same as prior digests).
- `pnpm deploy:check` at HEAD (`2e6e0059`) — deploy `READY`.

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth itself.

## Needs you

1. **Standing, highest-leverage: `ACTIONS_PAT` lacks the
   `workflows` PAT scope (`#898`).** Still unresolved, now 5 days
   open. No cloud tick can push a change to `.github/workflows/*.yml`
   until this is fixed.
2. **Standing: `plan/CRITIQUE.md` is 109 days stale**, one day older
   than last digest, with no mechanism to self-correct. Root cause
   (no Chrome MCP on the cloud runner) is filed as a `[score 6.5]
   [needs-user-call]` candidate, ready for the next `/oversight`
   pass to act on directly.
3. **Standing: `#915` mirror-drain-gap instance, unchanged.** The
   why-stabilizers-rattle-deep-dive cross-link fix has been live
   for four days; the issue itself never closed. A 10-second
   `gh issue close 915` clears it; the underlying tooling gap is
   already tracked as a `[needs-user-call] [3.0]` `plan/AUDIT.md`
   row and a `[6.0]` `plan/PHASE_CANDIDATES.md` candidate.
4. **Standing: `#928`, seven hero-art SVGs use stock blue/cyan**,
   violating the warm-palette rule — open, unpicked for three
   digests running, `severity:med`. Worth a look next `/iterate` or
   `/ship-asset` tick if it isn't already the top-scored finding —
   it's now sitting alongside three related hero-art `[seo]` rows
   in `plan/AUDIT.md` (the mode-sonnet 65%/75% cascade), so a
   combined `/ship-asset` pass could plausibly clear all four at
   once.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`plan/AUDIT.md` `[bug] [4.2]`, row unchanged) — real 404 status
   and the "did you mean" not-found UX are mutually exclusive under
   current Next.js routing; needs an `/oversight` design call on
   which to prioritize.

## Today's intent

No phase or content-gap work is queued — the build plan is fully
shipped through phase 50, Rule 1 is comfortable. `plan/AUDIT.md`'s 3
open rows are all low-score hero-art redraws from the same
mode-sonnet cascade; `#928`'s palette violation is the most
concrete unpicked signal sitting in GitHub issues for a third
digest running and, given its overlap with the three cascade rows,
is a reasonable single `/ship-asset` pick to clear the whole
hero-art backlog in one pass if nothing higher-scored surfaces from
a fresh audit sweep.

## Tuning proposals

**None new this tick.** `/expand` has now gone 21 consecutive
passes (346–366, ~4 days) without a new candidate — closer to the
"dozens of passes" stall threshold flagged as a watch item in the
last two digests, but still short of it, and pass notes continue to
show real (if negative) audit work each time (Considered-entry
cleanup at pass 362, cascade-evidence checks), not a mechanism
silently idling. The ceiling shows no hibernation (11 of 16 ticks
this window either shipped or ran a genuine expand pass; only 5 were
plain no-ops, a healthier ratio than last window's 6/24). Critique
staleness is already captured as a promotion-ready candidate, not a
fresh proposal. If the no-candidate streak reaches pass 375+ (the
threshold flagged last digest) without a change in shipped-tick
density, the next digest should propose either widening `/expand`'s
signal categories or lengthening its dispatch interval.
