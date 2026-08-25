# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, steady 24-hour window — 24 cloud `march` ticks, 23
green, 1 red-but-harmless.** Since the last digest (`3aa2b95b`,
2026-08-24T11:01Z), 16 of 24 ticks shipped something: 6 catalog/data
corrections against primary sources or internal contradictions
(`durock-t1`, `mt3-devtty`, `gateron-magnetic-jade` stem, and 3
trend-snapshot direction fixes from phase 50's data-quality gate),
2 cross-link pairs drained (2 hub articles), 1 a11y fix (TagChip
accessible-name/visible-text divergence), 1 perf budget correction
(`/search` bundle budget raised to 175 KB post-Next-16), 2 content
misdate/example fixes, 1 already-resolved audit row confirmed
clean, and 3 `/expand` passes (348–350, all 0 new candidates).
7 ticks were clean no-ops.

**One tick failed** (08:15–08:28Z, `march` run `32825664946`,
`result.is_error: true`) and auto-filed issue `#929`. It's already
labeled `triage:reviewed` — seen, no action needed — by a later
tick's triage pass; no root cause is recorded beyond the generic
signal, and no pattern links it to any other failure this window.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule.
Deploy is `READY` at HEAD (`a3845c80`).

**`plan/AUDIT.md` is down to 2 open rows**, from 13 last digest —
both cross-link pairs and all 6 catalog-correction-cascade rows
from two windows ago drained clean. The 2 remaining are cascade
rows from the older mode-sonnet layout correction (hero-art still
shows the old 65% shape; a plate-materials framing tension) —
neither touched this window.

**One live mirror-drain-gap instance carries over unchanged**:
issue `#915` (why-stabilizers-rattle-deep-dive cross-links) — the
fix shipped two windows ago (`69ea1906`/`89099a9a`, confirmed 0
pairs remaining via a fresh survey run this tick) but the issue is
still open, no `Closes` trailer. Same standing `[needs-user-call]
[3.0]` `plan/AUDIT.md` row this has evidenced since last digest.

`plan/CRITIQUE.md` is now **107 days / ~2,480 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — same
diagnosis as every digest since (no Chrome MCP on the cloud
runner), still filed as a `[score 6.5] [needs-user-call]` candidate
in `plan/PHASE_CANDIDATES.md` awaiting `/oversight` promotion.
`plan/PHASE_CANDIDATES.md` holds **31 live pending rows**, pass
350, 2 days since the last promotion (phase 50, 2026-08-23T12:54Z
via local `/oversight`).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-24 11:08→11:14 | cloud march | expand pass 348 — 0 candidates, no new signal since pass 347 |
| 08-24 12:08→12:11 | cloud march | no-op |
| 08-24 13:20→13:38 | cloud march | content: leaf-spring-mount-deep-dive cross-link, 1 pair drained |
| 08-24 14:15→14:18 | cloud march | no-op |
| 08-24 15:14→15:33 | cloud march | a11y: TagChip accessible name no longer diverges from visible text, closes Lighthouse `[4.5]` |
| 08-24 16:11→16:26 | cloud march | content: building-mode-sonnet-with-oil-kings cross-link, 1 pair drained |
| 08-24 17:11→17:28 | cloud march | perf: `/search` bundle budget raised to 175 KB after Next 16 upgrade |
| 08-24 18:08→18:34 | cloud march | data: durock-t1 correction — factory pre-lubed, not shipped dry, closes `#921` |
| 08-24 19:12→19:16 | cloud march | no-op |
| 08-24 20:07→20:13 | cloud march | no-op |
| 08-24 21:08→21:25 | cloud march | data: mt3-devtty correction — 2017 run was dye-sub PBT, not doubleshot ABS, closes `#921` |
| 08-24 22:06→22:21 | cloud march | data: 2026-W19 CannonKeys trend row — direction corrected to flat, closes `#923` |
| 08-24 23:06→23:11 | cloud march | expand pass 349 — 0 candidates, no new signal since pass 348 |
| 08-25 00:11→00:27 | cloud march | data: 2026-W19 Prototypist trend row — direction corrected to flat, closes `#924` |
| 08-25 01:30→01:45 | cloud march | data: 2026-W29 75% Layout trend row — direction corrected to up, closes `#925` |
| 08-25 02:25→02:42 | cloud march | audit: mode-sonnet-r2-group-buy-coverage mentionedParts gap — already resolved by earlier commit, row ticked |
| 08-25 03:19→03:24 | cloud march | expand pass 350 — no candidates, no new signal since pass 349 |
| 08-25 04:14→04:31 | cloud march | content: silent-switch-damping-deep-dive — fix broken Boba LT damping example |
| 08-25 05:11→05:14 | cloud march | no-op |
| 08-25 06:09→06:30 | cloud march | content: hall-effect-rapid-trigger-plateau — fix "82 in early July" climb-start misdate |
| 08-25 07:18→07:35 | cloud march | no-op |
| 08-25 08:15→08:28 | cloud march | **failure** — `result.is_error: true`; auto-filed `#929`, since labeled `triage:reviewed` |
| 08-25 09:13→09:17 | cloud march | no-op |
| 08-25 10:08→10:35 | cloud march | data: gateron-magnetic-jade correction — stem is POM, not mixed, closes `#930` |

24 `march`-workflow runs since the last digest: **23 success, 1
failure, 0 cancelled.** `night` ran success on its prior attempt
(2026-08-24); this tick's own run (`32838482517`) is in progress as
this file writes. `lighthouse` ran twice since last digest, both
green.

## Shipped

- **6 catalog/data corrections**: durock-t1 (factory pre-lubed, not
  dry), mt3-devtty (2017 run dye-sub PBT, not doubleshot ABS),
  gateron-magnetic-jade (stem POM, not mixed), and 3 trend-snapshot
  direction corrections (2026-W19 CannonKeys → flat, 2026-W19
  Prototypist → flat, 2026-W29 75% Layout → up) — the last 3 are
  phase 50's data-quality gate continuing to drain its first-scan
  findings.
- **2 cross-link pairs drained across 2 hub articles**:
  leaf-spring-mount-deep-dive (1), building-mode-sonnet-with-oil-kings
  (1).
- **1 a11y fix**: TagChip's accessible name no longer diverges from
  its visible text — closes the standing Lighthouse
  `label-content-name-mismatch` `[4.5]` row.
- **1 perf/budget correction**: `/search` bundle budget raised to
  175 KB, reflecting real headroom after the Next 16 upgrade — no
  code change, closes the standing `[perf] [4.2]` row.
- **2 content fixes**: silent-switch-damping-deep-dive's broken Boba
  LT damping example; hall-effect-rapid-trigger-plateau's "82 in
  early July" misdate (climb actually started late June).
- **1 audit row confirmed already-resolved**: mode-sonnet-r2's
  mentionedParts gap — ticked, no edit needed.
- **3 `/expand` passes** (348, 349, 350): 0 new candidates across
  all three: the backlog is stable, not stalled — pass 347 (prior
  window) was the last one to add cascade evidence.

## Queues now

- **Build plan**: all 51 phases shipped, 0 pending — unchanged.
- **Cross-link drain**: **0 open `[cross-links]` rows** — both pairs
  open at last digest (leaf-spring-mount-deep-dive,
  building-mode-sonnet-with-oil-kings) drained this window.
- **Critique**: pass 11, 2026-05-10 — **107 days / ~2,480 commits**
  stale. Diagnosis (no Chrome MCP on the cloud runner) remains
  filed as a `[score 6.5] [needs-user-call]`
  `plan/PHASE_CANDIDATES.md` candidate awaiting `/oversight`
  promotion — see Needs You below. This is now the single largest
  age gap tracked in this file and keeps growing one day at a time
  with no mechanism to close it short of `/oversight`.
- **Phase candidates**: **31 live pending rows** (plus 1
  `needs-user-call`), pass 350, unchanged count from last digest —
  2 days since phase 50's promotion (2026-08-23T12:54Z). The
  `[7.5]` content-fact-vs-catalog numeric-spec audit and the
  `[6.5]` OG render-verification gate remain the strongest
  candidates by evidence density.
- **Data backlog**: empty — `data/BACKLOG.md`'s Pending section is
  fully checked off.
- **Open GitHub issues**: **4 open**. `#898` (`ACTIONS_PAT`
  workflow-scope gap) — standing, needs the user's PAT regen.
  `#915` (why-stabilizers-rattle cross-links) — fix already shipped,
  issue never auto-closed, unchanged mirror-drain-gap instance from
  last digest. `#928` (seven hero-art SVGs use stock blue/cyan,
  violating the warm-palette rule) — new since last digest, open,
  unpicked. `#929` (this window's march failure) — labeled
  `triage:reviewed`, no action needed.
- **`plan/AUDIT.md`**: **2 open `[ ]` Pending rows** — down sharply
  from 13 last digest. Both are cascade rows from the older
  mode-sonnet layout correction: `[seo] [2.7]` (hero-art still
  depicts the pre-fix 65% shape) and `[content] [2.4]`
  (plate-materials-explained framing tension against Mode's
  confirmed flagship config). Neither was touched this window. Plus
  **2 standing `[needs-user-call]` rows**, unchanged, non-autonomous
  by design: soft-404 structural block (`[bug] [4.2]`) and the
  mirror-drain-gap mechanism (`[engineering] [3.0]`, evidenced again
  this window by `#915`).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 workspace projects.
- `lint` — green, all lintable workspaces.
- `test:run` — green, **166 files / 1,231 tests** (web: 109/850;
  content: 24/167; data: 19/129; seo: 5/44; ui: 7/32; e2e-unit:
  1/6; tokens: 1/3).
- `test:scripts` — green, **80 suites / 223 tests**.
- `data:validate` — green, **82 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 16 trends).
- `build` — green, first attempt, no retries, 281 static pages.
- `size` — green, homepage bundle **147.1 KB / 200 KB** budget;
  `/search` **144.4 KB / 175 KB** budget — comfortable headroom
  after this window's budget-raise correction.
- `e2e` — green, **1,201/1,201** in ~7.9m. Console `NoFallbackError`
  noise during the run is from intentional not-found-route probes,
  expected and non-blocking (same as prior digests).
- `pnpm deploy:check` at HEAD (`a3845c80`) — deploy `READY`.

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth itself.

## Needs you

1. **Standing, highest-leverage: `ACTIONS_PAT` lacks the
   `workflows` PAT scope (`#898`).** Still unresolved. No cloud
   tick can push a change to `.github/workflows/*.yml` until this
   is fixed.
2. **Standing: `plan/CRITIQUE.md` is 107 days stale**, one day
   older than last digest, with no mechanism to self-correct. Root
   cause (no Chrome MCP on the cloud runner) is filed as a
   `[score 6.5] [needs-user-call]` candidate, ready for the next
   `/oversight` pass to act on directly.
3. **Standing: `#915` mirror-drain-gap instance, unchanged.** The
   why-stabilizers-rattle-deep-dive cross-link fix has been live
   since two windows ago; the issue itself never closed. A 10-second
   `gh issue close 915` clears it; the underlying tooling gap is
   already tracked as a `[needs-user-call] [3.0]` `plan/AUDIT.md`
   row and a `[6.0]` `plan/PHASE_CANDIDATES.md` candidate.
4. **New: `#928`, seven hero-art SVGs use stock blue/cyan**,
   violating the warm-palette rule — open, unpicked, `severity:med`.
   Worth a look next `/iterate` or `/ship-asset` tick if it isn't
   already the top-scored finding.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`plan/AUDIT.md` `[bug] [4.2]`, row unchanged) — real 404 status
   and the "did you mean" not-found UX are mutually exclusive under
   current Next.js routing; needs an `/oversight` design call on
   which to prioritize.

## Today's intent

No phase or content-gap work is queued — the build plan is fully
shipped through phase 50, Rule 1 is comfortable. With `plan/AUDIT.md`
down to 2 open rows (both low-score cascade findings from an older
correction), the next `/iterate` tick has thin pickings from the
mechanical surveys; `#928` (hero-art palette violation) is the
most concrete unpicked signal sitting in GitHub issues right now
and is a reasonable next pick if nothing higher-scored surfaces
from a fresh audit sweep.

## Tuning proposals

**None new this tick.** Nothing in this window's pulse crosses a
tuning threshold: `/expand` at 3 consecutive no-candidate passes
(348–350) is normal cadence, not the dozens-of-passes stall that
would warrant a proposal; the ceiling shows no hibernation (16 of
24 ticks shipped); critique staleness is already captured as a
promotion-ready candidate, not a fresh proposal. The standing
mirror-drain-gap and OG-render-verification candidates already on
file cover this window's only recurring signals (`#915`,
`NoFallbackError` noise) with no new evidence shape.
