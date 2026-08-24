# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The busiest window in recent digest history — a big local
`/oversight` session landed mid-window on top of a full 24 cloud
`march` ticks, all green.** Since the last digest (`a3a2ed55`,
2026-08-23T10:54Z), 24 `march`-workflow runs completed: **24
success, 0 failure, 0 cancelled.** Interleaved with those, a local
`/oversight` session (commits `126c45bc`…`8fadb388`, ~12:18–13:04Z)
drained **11 open PRs → 0** and **19 open issues → 1** (`#898`,
still needs the user's PAT regen), promoted **phase 50**
(trend-snapshot data-quality gate) into the build plan, shipped 7
deep-dive articles, re-enabled Lighthouse CI, and bumped Next to
16.3 (+ zod 4.4, react 19.2.8, vitest 3.2.6, playwright 1.62).

**Cloud `march` then shipped phase 50 itself**, ran two `/expand`
passes, corrected 5 catalog records against primary sources
(closing `#911`, `#912`, `#914`), drained 12 cross-link pairs
across 4 hub articles, shipped the Monday `2026-W35` trend
snapshot, and shipped one guides-pillar content-gap article. Net:
**17 of 24 cloud ticks shipped something**, 7 were clean no-ops.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground legs per the standing rule.
Deploy is `READY` at HEAD (`92cff507`, `dpl_3jDqZkFV`).

**One live mirror-drain-gap instance surfaced this window**: issue
`#915` (why-stabilizers-rattle-deep-dive cross-links) was opened at
07:38Z and the fix shipped one minute later (`69ea1906`/`89099a9a`
at 07:38–07:39Z) — but the commit carried no `Closes #915` trailer,
so the issue is still open despite the underlying finding being
fully drained. Concrete new evidence for the standing `[needs-user-call]
[3.0]` mirror-drain-gap row in `plan/AUDIT.md`.

`plan/CRITIQUE.md` is now **106 days / ~2,460 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — same
diagnosis as every digest since (no Chrome MCP on the cloud
runner), still filed as a `[score 6.5] [needs-user-call]` candidate
in `plan/PHASE_CANDIDATES.md` awaiting `/oversight` promotion.
`plan/PHASE_CANDIDATES.md` holds **31 live pending rows** (plus 1
`needs-user-call`) — but the promotion clock itself just reset:
the local `/oversight` session promoted phase 50 **within this
window** (`c069ae63`, 2026-08-23T12:54Z), so the backlog is 31
rows / ~1 day since last promotion, not the 70-day gap the last
several digests flagged.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-23 11:05→11:31 | cloud march | a11y: footer Buttondown attribution external-link indicator, closes `#908` (`d28efd63`/`3e58ceae`) |
| 08-23 12:06→12:30 | cloud march | a11y: Source citation link external-link indicator, closes `#909` (`ffc4c681`/`9a7d5d53`) |
| 08-23 12:18→13:04 | **local /oversight** | drained 11 PRs → 0, 19 issues → 19→1; march crash-gate + heartbeat dedup fix; GH Actions bump; deps major bump (Next 16.3 + 4 more); 7 deep-dive articles; Lighthouse CI re-enabled + first green run (files `[4.5]` label-content-name-mismatch); OG font loader hotfix; **promoted phase 50** |
| 08-23 13:13→13:36 | cloud march | phase 50 shipped — trend-snapshot data-quality gate (`fbae462a`/`620d2f2b`), one-time corpus scan files 3 `[data] [3.6]` direction/spark contradiction rows on old W19/W29 snapshots |
| 08-23 14:05→14:23 | cloud march | expand pass 345 — 1 candidate filed: `[6.0]` catalog primary-source verification pass |
| 08-23 15:05→15:37 | cloud march | data: mode-sonnet catalog correction — 75%/5.5°/Mounting Block System, closes `#911` |
| 08-23 16:04→16:24 | cloud march | data: gazzew-boba-lt correction — linear not silent-linear, 55g/65g, closes `#912` |
| 08-23 17:05→17:14 | cloud march | expand pass 346 — 0 candidates, catalog-verification candidate draining as expected |
| 08-23 18:04→18:12 | cloud march | no-op |
| 08-23 19:06→19:22 | cloud march | data: gateron-magnetic-jade correction — 30g/50g, 3.5mm travel |
| 08-23 20:03→20:21 | cloud march | data: cherry-mx2a-silent-black correction — 60g/100g, 3.7mm travel |
| 08-23 21:04→21:26 | cloud march | content: gazzew boba u4t — dampener location/lube wording/travel fix, closes `#914` |
| 08-23 22:04→22:20 | cloud march | cross-links: gazzew-boba-family-deep-dive hub, 4 pairs drained |
| 08-23 23:04→23:09 | cloud march | no-op |
| 08-24 00:11→00:13 | cloud march | no-op |
| 08-24 01:30→01:33 | cloud march | no-op |
| 08-24 02:29→02:31 | cloud march | no-op |
| 08-24 03:22→03:24 | cloud march | no-op |
| 08-24 04:16→04:18 | cloud march | no-op |
| 08-24 05:15→05:55 | cloud march | data: Monday trend snapshot `2026-W35` |
| 08-24 06:14→06:36 | cloud march | content-gap row auto-filed + issue `#916` opened; guides pillar article shipped same tick — "Keyboard layout sizes, compared" |
| 08-24 07:24→07:40 | cloud march | cross-links: why-stabilizers-rattle-deep-dive hub, 4 pairs drained — issue `#915` opened but **not auto-closed** (no `Closes` trailer; mirror-drain-gap instance) |
| 08-24 08:16→08:34 | cloud march | expand pass 347 — 0 new candidates, cascade evidence appended to 2 pending candidates |
| 08-24 09:17→09:33 | cloud march | cross-links: gateron-magnetic-jade-deep-dive hub, 2 pairs drained |
| 08-24 10:14→10:27 | cloud march | cross-links: silent-switch-damping-deep-dive hub, 2 pairs drained |

24 `march`-workflow runs since the last digest: **24 success, 0
failure, 0 cancelled.** `night` ran success on its prior attempt
(2026-08-23); this tick's own run is in progress as this file
writes. `lighthouse` ran twice since re-enable, both green.

## Shipped

- **5 catalog corrections against primary sources**, closing
  `#911`, `#912`, `#914` (2 more had no mirrored issue):
  mode-sonnet (layout/angle/mount), gazzew-boba-lt (weight/silence
  classification), gateron-magnetic-jade (force/travel),
  cherry-mx2a-silent-black (travel/force), gazzew boba u4t
  (dampener location/lube/travel). 5 of the original 6 rows filed
  by the 2026-08-23 `/oversight` fact-check are now drained; only
  `mt3-devtty` (doubleshot vs. dye-sub) remains.
- **12 cross-link pairs drained across 4 hub articles**:
  gazzew-boba-family-deep-dive (4), why-stabilizers-rattle-deep-dive
  (4, `#915` still open — mirror gap), gateron-magnetic-jade-deep-dive
  (2), silent-switch-damping-deep-dive (2).
- **2 a11y fixes**, both closing mirrored issues: footer Buttondown
  attribution external-link indicator (`#908`), Source citation
  external-link indicator (`#909`).
- **1 content-gap article**: guides pillar, "Keyboard layout sizes,
  compared: 60% to full-size, which fits your desk."
- **1 Monday trend snapshot**: `2026-W35`.
- **1 phase shipped**: phase 50, trend-snapshot data-quality gate —
  promoted and shipped in the same window; its own first corpus
  scan immediately found 3 pre-existing direction/spark
  contradictions in older snapshots (now `[data] [3.6]` AUDIT rows).
- **2 `/expand` passes** (345 filed 1 candidate — `[6.0]` catalog
  primary-source verification; 346–347 filed 0 new, both
  reinforcing already-Pending candidates with cascade evidence).
- **Local `/oversight` session**: 11 PRs closed, 19→1 open issues,
  march.yml crash-issue gate fixed, heartbeat.yml dedup scoped,
  GitHub Actions bumped, a 5-package dependency major bump, 7
  deep-dive articles, Lighthouse CI re-enabled, an OG font-loader
  edge-bundle hotfix, and phase 50 promoted.

## Queues now

- **Build plan**: all 51 phases shipped (phase 50 landed this
  window), 0 pending.
- **Cross-link drain**: **2 open `[cross-links]` rows** — new pairs
  surfaced from this window's content bursts (`leaf-spring-mount-deep-dive`
  ↔ `60-percent-layout-history`; `building-mode-sonnet-with-oil-kings`
  ↔ `gasket-mount-reality`), after 12 pairs drained the same window.
- **Critique**: pass 11, 2026-05-10 — **106 days / ~2,460 commits**
  stale. Diagnosis (no Chrome MCP on the cloud runner) remains
  filed as a `[score 6.5] [needs-user-call]`
  `plan/PHASE_CANDIDATES.md` candidate awaiting `/oversight`
  promotion — see Needs You below.
- **Phase candidates**: **31 live pending** rows (plus 1
  `needs-user-call`), pass 347. Promotion clock reset **this
  window** — phase 50 promoted 2026-08-23T12:54Z via local
  `/oversight` (was 70 days stale as of last digest). The `[7.5]`
  content-fact-vs-catalog numeric-spec audit (now 19 confirmed
  instances) and the `[6.0]` catalog-verification pass (5/6 rows
  self-drained this window) are the strongest remaining candidates.
- **Data backlog**: empty — `data/BACKLOG.md`'s Pending section is
  fully checked off.
- **Open GitHub issues**: **2 open** (down from 19 at the start of
  this window). `#898` (`ACTIONS_PAT` workflow-scope gap) —
  standing, needs the user's PAT regen. `#915` (why-stabilizers-rattle
  cross-links) — fix already shipped (`69ea1906`/`89099a9a`) but the
  issue never auto-closed; a live mirror-drain-gap instance, see
  Needs You.
- **`plan/AUDIT.md`**: **13 open rows**, up from 5 last digest — 2
  cross-link pairs (above), 3 `[data] [3.6]` direction/spark
  contradictions on old trend snapshots (phase 50's first corpus
  scan), 1 `[mentionedParts] [3.6]`, 4 cascade rows from this
  window's catalog corrections not yet propagated to dependent
  prose/art (`content [3.4]`, `content [3.5]`, `seo [2.7]`, `content
  [2.4]`), 1 `[data-gaps] [4.0]` (mt3-devtty, last of the original
  6), 1 `[a11y] [4.5]` (Lighthouse label-content-name-mismatch), 1
  `[perf] [4.2]` (`/search` JS at 144.4/150 KB, confirmed again in
  this tick's own `size` leg at 144.5 KB).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 workspace projects.
- `lint` — green, all lintable workspaces.
- `test:run` — green, **166 files / 1,230 tests** (web: 109/850;
  content: 24/167; data: 19/129; seo: 5/44; ui: 7/31; e2e-unit:
  1/6; tokens: 1/3).
- `test:scripts` — green, **95 suites / 223 tests**.
- `data:validate` — green, **82 records**, all cross-refs resolve
  (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 16 trends).
- `build` — green, first attempt, no retries.
- `size` — green, homepage bundle **147.1 KB / 200 KB** budget;
  `/search` **144.5 KB / 150 KB** budget — the standing `[perf]
  [4.2]` AUDIT row's 5.5 KB headroom holds, unchanged since flagged.
- `e2e` — green, **1,201/1,201** in ~6.9m. Console `NoFallbackError`
  noise during the run is from intentional not-found-route probes,
  expected and non-blocking (same as prior digests).
- `pnpm deploy:check` at HEAD (`92cff507`) — deploy `READY`
  (`dpl_3jDqZkFV`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md` from
breadth itself.

## Needs you

1. **New this window: mirror-drain-gap live instance, `#915`.**
   The why-stabilizers-rattle-deep-dive cross-link fix shipped
   (`69ea1906`/`89099a9a`) but the commit carried no `Closes #915`
   trailer, so the issue is still open with its fix already live.
   Concrete evidence for the standing `[needs-user-call] [3.0]`
   `plan/AUDIT.md` row — worth a manual `gh issue close 915` and,
   longer-term, promoting that row so ship-time tooling verifies
   the trailer before commit.
2. **Standing, highest-leverage: `ACTIONS_PAT` lacks the
   `workflows` PAT scope (`#898`).** Still unresolved. No cloud
   tick can push a change to `.github/workflows/*.yml` until this
   is fixed — the local `/oversight` session had to fix
   `march.yml`/`heartbeat.yml` by hand this window because of it.
3. **Standing: `plan/CRITIQUE.md` is 106 days stale.** Root cause
   (no Chrome MCP on the cloud runner) is filed as a `[score 6.5]
   [needs-user-call]` candidate, ready for the next `/oversight`
   pass to act on directly.
4. **Good news, not an ask: the `/oversight` promotion backlog
   reset this window** (phase 50 promoted 2026-08-23T12:54Z,
   1 day ago vs. 70 days at last digest). 31 pending candidates
   remain; the `[7.5]` content-fact-vs-catalog audit (19 confirmed
   instances) is the clearest next pick.
5. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`plan/AUDIT.md`, `[4.2]`) — non-autonomous, unchanged.

## Today's intent

No phase or content-gap work is queued — the build plan is fully
shipped through phase 50, Rule 1 is comfortable. The 2 open
cross-link pairs and the 4-row catalog-correction-cascade cluster
in `plan/AUDIT.md` are the most likely next `/iterate` picks: both
are exactly the reactive-discovery pattern the `[6.0]`
catalog-verification and `[7.5]` content-fact-vs-catalog candidates
already name, so draining them by hand keeps adding evidence to
those candidates rather than closing the loop that keeps
re-finding them. `#915` is the one item that needs a human hand
today — a 10-second `gh issue close`.

## Tuning proposals

**None new this tick.** The mirror-drain-gap instance on `#915` is
fresh *evidence*, not a new mechanism — it's already the exact
shape the standing `[needs-user-call] [3.0]` `plan/AUDIT.md` row
and the `[6.0]` "loop:opened issue mirror-drain gap" `plan/PHASE_CANDIDATES.md`
candidate both name. No fresh candidate filed; the existing one
gets this instance as its next confirmation the next time `/expand`
runs its count.
