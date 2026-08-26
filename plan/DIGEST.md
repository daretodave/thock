# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Another quiet, steady 24-hour window — 24 cloud `march` ticks, 22
green, 2 red-but-harmless.** Since the last digest (`3752a00c`,
2026-08-25T10:58Z), 6 of 24 ticks shipped a substantive fix, 10 were
`/expand` passes (351–360, all 0 new candidates), 6 were clean
no-ops, and 2 failed back-to-back.

**Both failures** (13:19–13:20Z and 14:16–14:17Z, runs
`32852651031`/`32858441384`) carry the same signal —
`result.is_error: true`, `api_error_status: 429` — a transient
Anthropic API rate limit, not a code or gate defect. Neither
attempted to open a fresh issue: both found the standing "Cloud
march execution had issues" issue (`#929`, opened by an unrelated
08-25 08:15Z failure with no `429` code, since labeled
`triage:reviewed`) already open and skipped. No pattern links the
three failures beyond the generic transcript signal; none happened
again after 14:17Z.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule.
Deploy is `READY` at HEAD (`fe6fbee4`).

**`plan/AUDIT.md` is at 3 open rows**, up from 2 last digest — the
two standing cascade rows from the mode-sonnet layout correction
(`[seo] [2.7]` hero-art, `[content] [2.4]` plate-materials framing)
plus one new same-class row filed this window: `[seo] [2.0]`
`cannonkeys-mode-sonnet-r2.svg` hero art still depicts the pre-fix
65% layout after the group-buy record's own 65%→75% data correction
(`f27775f0`/`2e4aaead`, closes `#936`). All three are low-score,
`/ship-asset`-shaped hero-art redraws; none blocked this window.

`plan/CRITIQUE.md` is now **108 days / ~2,500 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — one day
older than last digest, same diagnosis (no Chrome MCP on the cloud
runner), still filed as a `[score 6.5] [needs-user-call]` candidate
in `plan/PHASE_CANDIDATES.md` awaiting `/oversight` promotion.
`plan/PHASE_CANDIDATES.md` holds **31 live pending rows**, pass 360,
now 3 days since the last promotion (phase 50, 2026-08-23T12:54Z via
local `/oversight`).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-25 11:07→11:10 | cloud march | no-op |
| 08-25 12:08→12:30 | cloud march | content: keyboard-layout-sizes-buying-guide — fix reversed hero alt-text size order, closes `#931` |
| 08-25 13:19→13:20 | cloud march | **failure** — `result.is_error: true`, `api_error_status: 429`; standing issue `#929` already open, skipped |
| 08-25 14:16→14:17 | cloud march | **failure** — same signal (429); `#929` already open, skipped |
| 08-25 15:17→15:26 | cloud march | expand pass 351 — no candidates, no new signal since pass 350 |
| 08-25 16:12→16:18 | cloud march | expand pass 352 — no candidates, no new signal since pass 351 |
| 08-25 17:11→17:26 | cloud march | expand pass 353 — no candidates, no new signal since pass 352 |
| 08-25 18:09→18:14 | cloud march | expand pass 354 — no candidates, no new signal since pass 353 |
| 08-25 19:12→19:32 | cloud march | content: fix Boba U4/U4T "same stem" framing across 3 articles, closes `#932` |
| 08-25 20:06→20:10 | cloud march | no-op |
| 08-25 21:07→21:27 | cloud march | content: fix inverted Gazzew Boba U4 factory-lube footprint in silent-switch-damping-deep-dive, closes `#933` |
| 08-25 22:05→22:27 | cloud march | expand pass 355 — no candidates, no new signal since pass 354 |
| 08-25 23:06→23:28 | cloud march | fix: quiz recommender — explicit clicky selection could lose to tactile switches, closes `#934` |
| 08-26 00:12→00:17 | cloud march | no-op |
| 08-26 01:30→01:47 | cloud march | seo: trends tracker archive copy no longer overclaims unbroken weekly continuity, closes `#935` |
| 08-26 02:31→02:58 | cloud march | data: cannonkeys-mode-sonnet-r2 group-buy record corrected 65%/polycarbonate → 75%/POM, closes `#936` |
| 08-26 03:22→03:25 | cloud march | no-op |
| 08-26 04:14→04:23 | cloud march | expand pass 356 — no candidates, no new signal since pass 355 |
| 08-26 05:11→05:27 | cloud march | expand pass 357 — no candidates, no new signal since pass 356 |
| 08-26 06:10→06:17 | cloud march | expand pass 358 — no candidates, no new signal since pass 357 |
| 08-26 07:18→07:29 | cloud march | expand pass 359 — no candidates, no new signal since pass 358 |
| 08-26 08:14→08:18 | cloud march | no-op |
| 08-26 09:15→09:29 | cloud march | no-op |
| 08-26 10:12→10:17 | cloud march | expand pass 360 — no candidates, no new signal since pass 359 |

24 `march`-workflow runs since the last digest: **22 success, 2
failure, 0 cancelled.** `night` ran success on its prior attempt
(2026-08-25T10:41Z); this tick's own run (started 10:42:03Z) is in
progress as this file writes. `lighthouse` ran twice since last
digest (07:28Z, 10:17Z), both green.

## Shipped

- **1 content fix**: keyboard-layout-sizes-buying-guide's reversed
  hero alt-text size order.
- **2 catalog-fact corrections**: Boba U4/U4T "same stem" framing
  fixed across 3 articles; the inverted Boba U4 factory-lube
  footprint in silent-switch-damping-deep-dive.
- **1 logic fix**: quiz recommender — an explicit clicky selection
  could previously lose to tactile switches in scoring.
- **1 seo/copy fix**: trends tracker archive copy no longer implies
  an unbroken weekly continuity it doesn't have.
- **1 data correction**: cannonkeys-mode-sonnet-r2 group-buy record
  still read 65%/polycarbonate after the board record itself was
  corrected to 75%/POM three days ago — this window's fix brings the
  group-buy record's `description`/`heroImageAlt` in line with the
  board record and both companion articles. Filed a same-class
  follow-up hero-art row (`[seo] [2.0]`, see Headline) since the
  visual SVG grid still depicts the old 65% shape.
- **10 `/expand` passes** (351–360): 0 new candidates across all
  ten — the last actual candidate filed was pass 345 (2026-08-23);
  this window extends that streak to 15 consecutive no-candidate
  passes with no new signal in any of the eight tracked categories.

## Queues now

- **Build plan**: all 51 phases shipped, 0 pending — unchanged.
- **Cross-link drain**: 0 open `[cross-links]` `plan/AUDIT.md` rows
  — unchanged from last digest.
- **Critique**: pass 11, 2026-05-10 — **108 days / ~2,500 commits**
  stale, one day older than last digest. Diagnosis (no Chrome MCP on
  the cloud runner) remains filed as a `[score 6.5]
  [needs-user-call]` `plan/PHASE_CANDIDATES.md` candidate awaiting
  `/oversight` promotion — see Needs You below. Still the single
  largest age gap tracked in this file, growing one day at a time
  with no mechanism to close it short of `/oversight`.
- **Phase candidates**: **31 live pending rows** (plus 1
  `needs-user-call`), pass 360, now 3 days since phase 50's
  promotion (2026-08-23T12:54Z). `/expand` itself has gone 15
  consecutive passes (346–360, spanning ~3 days) without filing a
  new one — see Tuning proposals below for why this isn't yet a
  tuning trigger. The `[7.5]` content-fact-vs-catalog numeric-spec
  audit and the two `[6.5]` candidates (truncation-boundary
  mechanical survey, OG render-verification gate) remain the
  strongest by evidence density.
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
  warm-palette rule) — open, unpicked, `severity:med`. `#929` (the
  08-25 08:15Z march failure) — labeled `triage:reviewed`, no action
  needed; the two new 429 failures this window found it already open
  and did not duplicate it.
- **`plan/AUDIT.md`**: **3 open `[ ]` Pending rows** — up from 2 last
  digest (see Headline for the new `[2.0]` row). All three are
  low-score cascade findings from the mode-sonnet layout correction
  chain. Plus **2 standing `[needs-user-call]` rows**, unchanged,
  non-autonomous by design: soft-404 structural block (`[bug]
  [4.2]`) and the mirror-drain-gap mechanism (`[engineering] [3.0]`,
  evidenced again by `#915`).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 workspace projects.
- `lint` — green, all lintable workspaces.
- `test:run` — green, **166 files / 1,232 tests** (web: 109/851;
  content: 24/167; data: 19/129; seo: 5/44; ui: 7/32; e2e-unit:
  1/6; tokens: 1/3).
- `test:scripts` — green, **80 suites / 223 tests**.
- `data:validate` — green, **82 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 16 trends).
- `build` — green, first attempt, no retries, static + dynamic
  routes all generated cleanly.
- `size` — green, homepage bundle **147.1 KB / 200 KB** budget;
  `/search` **144.4 KB / 175 KB** budget — same comfortable headroom
  as last digest.
- `e2e` — green, **1,201/1,201** in ~7.9m. Console `NoFallbackError`
  noise during the run is from intentional not-found-route probes,
  expected and non-blocking (same as prior digests).
- `pnpm deploy:check` at HEAD (`fe6fbee4`) — deploy `READY`.

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth itself.

## Needs you

1. **Standing, highest-leverage: `ACTIONS_PAT` lacks the
   `workflows` PAT scope (`#898`).** Still unresolved. No cloud
   tick can push a change to `.github/workflows/*.yml` until this
   is fixed.
2. **Standing: `plan/CRITIQUE.md` is 108 days stale**, one day
   older than last digest, with no mechanism to self-correct. Root
   cause (no Chrome MCP on the cloud runner) is filed as a
   `[score 6.5] [needs-user-call]` candidate, ready for the next
   `/oversight` pass to act on directly.
3. **Standing: `#915` mirror-drain-gap instance, unchanged.** The
   why-stabilizers-rattle-deep-dive cross-link fix has been live
   for three days; the issue itself never closed. A 10-second
   `gh issue close 915` clears it; the underlying tooling gap is
   already tracked as a `[needs-user-call] [3.0]` `plan/AUDIT.md`
   row and a `[6.0]` `plan/PHASE_CANDIDATES.md` candidate.
4. **Standing: `#928`, seven hero-art SVGs use stock blue/cyan**,
   violating the warm-palette rule — open, unpicked for two
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
concrete unpicked signal sitting in GitHub issues and, given its
overlap with the three cascade rows, is a reasonable single
`/ship-asset` pick to clear the whole hero-art backlog in one pass
if nothing higher-scored surfaces from a fresh audit sweep.

## Tuning proposals

**None new this tick.** `/expand` has now gone 15 consecutive
passes (346–360, ~3 days) without a new candidate — worth watching,
but still short of the "dozens of passes" stall threshold that
would warrant a proposal, and the pass notes show real (if
negative) audit work each time, not a mechanism silently idling.
The ceiling shows no hibernation (18 of 24 ticks this window either
shipped or ran a genuine expand pass; only 6 were plain no-ops).
Critique staleness is already captured as a promotion-ready
candidate, not a fresh proposal. The standing mirror-drain-gap and
OG-render-verification candidates already on file cover this
window's only recurring signals (`#915`, `NoFallbackError` noise)
with no new evidence shape. If the no-candidate streak reaches
"dozens" (roughly pass 375+ at the current cadence) without a
change in shipped-tick density, the next digest should propose
either widening `/expand`'s signal categories or lengthening its
dispatch interval.
