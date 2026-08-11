# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~24.1h window — 24/24 completed `march` runs succeeded (1
more still in progress at digest time) — 16 substantive ticks (11
shipped fix+audit pairs + 5 `expand` zero-candidate passes) for 27
commits total, the other 8 completed runs landing as silent no-ops
(clean sweeps, nothing ≥3.0).** Since the last digest
(`1f9a7b4e`, 2026-08-10T11:08:20 UTC) the loop drained **11**
`plan/AUDIT.md` findings, all self-discovered by fresh `/iterate`
audit sweeps. The window's dominant shape is a **truncation-bug
cluster**: 5 of the 11 fixes chase the same underlying defect
(hard-cutting a string mid-word with no boundary search) across five
independent call sites — quiz cards, article OG ledes, three more
OG-image routes the first consolidation missed, the shared
`truncate()` helper itself, and `buildMetadata`'s separate
`truncateForMeta()` — each caught only after the previous fix left a
sibling call site (or the helper's own contract) still broken. That
density is new evidence, filed below as a fresh tuning proposal (no
existing candidate covered this shape). The other 6 fixes are a
scattered mix: a dead-code RSS validator wired into real tests
(closes #813), a fabricated Wuque Studio quote removed from
`gateron-oil-king-deep-dive`, a nanoid CVE override pin
(CVE-2026-67213), and three GMK Just Beachy content/data
corrections (a missing group-buy record, a "five continents"
overclaim walked back to "five regions", and a cross-link-survey
dedup bug that ignored `[x]` vs `[ ]` row status). `/expand` ran 5
passes (304-308), all zero-new-candidate — none of them flagged the
truncation cluster despite 3 of the 5 instances landing inside pass
308's own 9-commit lookback window (see "Tuning proposals"). This
tick's own fresh `pnpm verify` is green across all eight legs, run
as sequential foreground blocking calls (the one 10-minute-timeout
single-call attempt was stopped and re-run leg-by-leg per the
standing rule): typecheck (9 packages), lint (all lintable
workspaces), 968 unit tests (811 web + 157 content), 205 script
tests / 88 suites (up from 202/73), 80 data records / cross-refs
resolve (up from 79 — the new GMK Just Beachy group-buy record), a
clean build across all canonical routes, homepage bundle 108.7 KB /
200 KB (unchanged), and 1137/1137 e2e (unchanged — no new canonical
URLs this window). Deploy is `READY` at HEAD (`e2535fc7`,
`dpl_38xr82oN`).

`plan/CRITIQUE.md` is now **92 days / 2196 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`). Diagnosis
unchanged (confirmed root cause, expand pass 218): cloud mode
architecturally cannot reach `/critique` (no Chrome MCP on the
runner); every commit this window again carries the `Cloud-Run:`
trailer. `plan/PHASE_CANDIDATES.md` holds **24 pending rows + 1
needs-user-call** (23 carried forward + this tick's new truncation
candidate), **58 days** since the last promotion (2026-06-14, phases
46-49). `plan/AUDIT.md` carries **1 open row** (the standing `[4.0]`
Lighthouse-CI row, now ~60 days disabled) plus **4 more**
`/oversight`-gated or blocked rows, unchanged in count. A fresh
`loop:opened` issue (`#814`, quiz `setTimeout` unmount leak, filed
2026-08-10T13:42 UTC) landed mid-window, wasn't the top-scored pick
in any tick since, and — consistent with the already-diagnosed
mirror-gap pattern — left no `plan/AUDIT.md` Pending row behind. See
"Needs you" below.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-10 11:39 | iterate | engineering — `validateRssXml` wired into real feed route tests `[3.0]` (`ec19a0c9`/`63f17474`, closes #813) |
| 08-10 12:33 | expand | pass 304 — 0 new candidates, three candidates reinforced in place (`abdee1af`) |
| 08-10 14:58 | iterate | fix — consolidate truncation logic, fix mid-word breaks on quiz cards `[4.0]` (`bedf02ed`/`1f8f84d3`) |
| 08-10 16:26 | expand | pass 305 — 0 new candidates (`41a74943`) |
| 08-10 17:32 | iterate | fix — article OG lede truncation onto shared `truncate()` helper `[5.4]` (`5ca3b08f`/`17176bc5`) |
| 08-10 18:38 | iterate | data — group-buy record for GMK Just Beachy (announced) `[4.8]` (`1c541662`/`279468fd`) |
| 08-10 19:37 | iterate | content — gmk-cyl-just-beachy "five continents" overclaim → "five regions" `[5.0]` (`e0fac0eb`/`87bf92e7`) |
| 08-10 20:29 | iterate | engineering — pin nanoid override, closes CVE-2026-67213 `[4.5]` (`7c3f89a2`/`07d43051`) |
| 08-10 21:38 | expand | pass 306 — 0 new candidates (`01e957d5`) |
| 08-10 22:23 | expand | pass 307 — 0 new candidates (`e1000ff9`) |
| 08-11 00:36 | iterate | fix — 3 more OG-image routes still mid-word truncate, missed by consolidation `[5.4]` (`37867e52`/`ae297015`) |
| 08-11 03:48 | iterate | content — gateron-oil-king-deep-dive fabricated Wuque Studio quote removed `[5.4]` (`4e36fb49`/`2a3c60f6`) |
| 08-11 04:57 | iterate | fix — shared `truncate()` helper itself still hard-cuts mid-word `[3.2]` (`95bf2341`/`bde7234c`) |
| 08-11 05:43 | iterate | fix — `buildMetadata`'s `truncateForMeta()` same defect, independent implementation `[3.2]` (`56cfbc30`/`3a99a891`) |
| 08-11 06:34 | expand | pass 308 — 0 new candidates (`d10e0bf9`) |
| 08-11 10:48 | iterate | fix — `article-crosslink-survey` dedup ignored `[x]` vs `[ ]` row status `[3.6]` (`98aa4989`/`e2535fc7`) |

25 `march`-workflow runs since 2026-08-10T11:08:20 UTC: **24
completed, all `success`, 0 `failure`, 0 `cancelled`, 1 still
`pending`** at digest time — a fully clean window, no GH Actions
infra hiccups. `night` (1 prior run, 2026-08-10, success) green;
this tick is the current `night` run. 16 of the 24 completed runs
produced a commit (11 fix+audit pairs × 2 commits + 5 expand passes
× 1 commit = 27 commits); the other 8 completed runs were silent
no-ops — a fresh `/iterate` sweep or mechanical survey ran and found
nothing scoring ≥3.0.

## Shipped

- **truncation-bug cluster (5 fixes, one recurring defect class)**:
  quiz cards' mid-word breaks fixed and consolidated onto a shared
  `truncate()` helper; article OG lede truncation switched onto that
  same helper; 3 further OG-image routes found still mid-word
  truncating (missed by the first consolidation); the shared
  `truncate()` helper itself found still hard-cutting mid-word with
  no boundary search in its window; `buildMetadata`'s separate
  `truncateForMeta()` implementation found with the identical
  defect. Five independent call sites, one root cause, fixed one
  reactive audit sweep at a time — flagged as a fresh tuning
  proposal below since no mechanical survey holds this line.
- **engineering (2)**: `validateRssXml` (previously dead code) wired
  into the real feed route tests, closing #813; `nanoid` pinned via
  a pnpm override to close CVE-2026-67213.
- **content (2)**: `gmk-cyl-just-beachy`'s unsupported "five
  continents" claim walked back to "five regions"; a fabricated
  Wuque Studio quote attribution removed from
  `gateron-oil-king-deep-dive`.
- **data (1)**: group-buy record added for GMK Just Beachy
  (announced status), closing the gap the sibling content fix's
  audit sweep surfaced.
- **engineering (1)**: `article-crosslink-survey.mjs`'s dedup check
  ignored a filed row's `[x]`/`[ ]` completion-status marker,
  risking duplicate cross-link rows for an already-addressed pair.
- **expand**: 5 passes (304-308), all zero-new-candidate. Passes 304
  reinforced three existing candidates in place with this window's
  early fixes; passes 305-308 found nothing scoring above the
  iterate 3.0 action bar on fresh general-purpose sweeps. None of
  the five passes flagged the truncation cluster as a commit-pattern
  signal, despite pass 308 running immediately after 3 of the 5
  instances landed inside its own lookback window — see "Tuning
  proposals."

## Queues now

- **Build plan**: 0 pending phases, unchanged.
- **Cross-link drain**: 0 pending rows, unchanged.
- **`plan/AUDIT.md`**: **1 open row** (the standing `[4.0]`
  Lighthouse-CI-disabled row, ~60 days disabled, filed 2026-07-18)
  plus **4 more** `/oversight`-gated or blocked rows, unchanged in
  count from yesterday: `[6.3]` march.yml crash-gate
  (blocked-cloud-permission, issue #395); `[needs-user-call] [4.2]`
  soft-404 structurally blocked (issue #533); `[4.0]` heartbeat.yml
  dedup (blocked-cloud-permission, issue #620); `[needs-user-call]
  [3.0]` mirrored `loop:opened` issues can go permanently un-drained
  (citing #776/#799, both since closed — now reinforced by a fourth
  live instance, #814, unresolved this window).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **92 days / 2196 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **24 pending rows + 1
  needs-user-call**, up 1 from yesterday (this tick's new
  truncation-boundary-survey candidate). **58 days** since the last
  promotion (2026-06-14, phases 46-49).
- **`data/BACKLOG.md`**: 0 pending rows, unchanged.
- **Triage**: **17 open issues**, 0 unlabeled — flat vs. yesterday
  (net zero: #813 closed this window, #814 opened this window).
  Four `triage:needs-user` issues remain standing, ages up:
  `#756` (5 days old), `#639` (14 days old), `#499` (26 days old),
  `#434` (32 days old). Orphaned duplicate `#719` (MobileNav
  focus-containment, fixed weeks ago by `6ef381e3`) remains open, 8
  days since filed, unchanged.
- **Expand cadence**: 5 passes this window (304-308), all
  zero-new-candidate (3 reinforced existing rows, 2 found nothing).
  Denser-than-usual cadence (5 passes in one 24h digest window vs.
  the typical 2-3) — a symptom of march's Step 3c 20-commit/48h gate
  never firing this window (max gap since any anchor was ~9
  commits/~8h), so every non-Step-3c tick fell through `/iterate`'s
  failure-mode 6 to a fresh `/expand` dispatch instead. Not itself a
  starvation signal — see "Tuning proposals" for what this cadence
  *did* miss.

## Breadth verdict

Full `pnpm verify` run fresh, as eight sequential foreground blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green. Note: the first attempt ran the
whole `pnpm verify` as one call and was auto-backgrounded by the tool
harness at its 10-minute timeout; per the standing "never background
the gate" rule that run was stopped unused and every leg was re-run
individually as its own blocking foreground call.

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next
  lint` — still flags its own deprecation ahead of Next.js 16
  removal, a future-maintenance note, not a defect; `packages/*` via
  `eslint`).
- `test:run` — green, **968 unit tests** (811 web / 108 files + 157
  content / package tests).
- `test:scripts` — green, **205 tests / 88 suites**, up from 202/73
  — new coverage from the cross-link-survey dedup fix.
- `data:validate` — green, **80 records** walked, cross-refs
  resolve (10 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 15 trends, up from 79 — the new GMK Just Beachy
  group-buy record).
- `build` — green, all 262 canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1137/1137** (~8.0m, single worker), unchanged —
  no new canonical URLs this window. Server stderr again logged
  `NoFallbackError` several dozen times against the five
  `dynamicParams = false` routes (`/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  `/newsletter/[slug]`) — same non-blocking shape flagged in recent
  digests, Next's expected internal log for not-found-page e2e tests
  hitting a param outside the pre-generated set. Every one of the
  1137 tests still passed.
- `pnpm deploy:check` at HEAD (`e2535fc7`) — deploy `READY`
  (`dpl_38xr82oN`).
- `lighthouse` — workflow state remains `disabled_manually`, same
  standing `[4.0]` AUDIT row, no new signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New this window: a truncation-boundary defect class hit 5
   times in ~14 hours, and `/expand` didn't flag it.** See "Tuning
   proposals" — filed as a fresh `[score 6.5]` candidate directly by
   this digest, since the meta-loop rail lets digest propose but not
   apply.
2. **New this window: a fourth live instance of the mirror-gap
   process finding.** `#814` (quiz `setTimeout` unmount leak, filed
   2026-08-10T13:42 UTC) was mirrored to GitHub but wasn't any
   subsequent tick's top-scored pick, so it shipped no fix and left
   no `plan/AUDIT.md` Pending row — the same shape as #776/#799/#813
   before it. The diagnosing `[needs-user-call] [3.0]` row already
   exists; this is now its fourth live example.
3. **Standing: `/critique` is 92 days / 2196 commits stale.**
   Diagnosis confirmed (expand pass 218): cloud mode architecturally
   cannot reach `/critique` (no Chrome MCP on the runner). Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or retire the gate formally. A matching
   `[needs-user-call] [score 6.5]` candidate already sits in
   `plan/PHASE_CANDIDATES.md`.
4. **Standing, growing: the `/oversight` promotion backlog.** 24
   pending candidates + 1 needs-user-call, now **58 days** since the
   last promotion. Three candidates cluster at 7.0-7.5 (numeric-spec
   audit, trend-snapshot data-quality gate, article
   internal-consistency checker); this window adds a fourth
   dense-cluster candidate (truncation-boundary survey, filed this
   tick).
5. **Standing, unclosed: orphaned duplicate GitHub issue `#719`.**
   Still open; the MobileNav focus-containment defect it names was
   fixed weeks ago by `6ef381e3` (closed via a different issue,
   `#722`). Cheap to close by hand.
6. **Standing: Lighthouse CI has been disabled and failing for
   ~60 days** — `/oversight` call needed. Unchanged since last
   digest.
7. **Standing: four unresolved `triage:needs-user` GitHub issues.**
   `#756` (5 days), `#639` (14 days), `#499` (26 days, not
   self-resolved), `#434` (32 days, not self-resolved).
8. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`
   issue #395, heartbeat.yml `[4.0]` issue #620) — both fixes
   written and verified, neither can ship because the cloud push
   credential lacks `workflows` scope for `.github/workflows/*.yml`
   edits.
9. **Standing, out-of-repo: GA `/g/collect` 503s** —
   `plan/CRITIQUE.md` pass-8 `[needs-user-call]` row, unactionable
   by any shipping skill since the analytics property lives outside
   the codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (the one open row is
`/oversight`-gated). The most concrete near-term target is shipping
the new truncation-boundary regression-guard tests + mechanical
survey script this digest just proposed — a clean 1-phase scope with
five already-fixed instances as its test fixtures. Otherwise the
next `/march` tick will most likely repeat this window's pattern: a
fresh reactive `/iterate` fix off a general-purpose sweep, or another
`/expand` pass (5 ran this window without March's own 20-commit gate
ever firing — worth an `/oversight` look at whether that cadence
imbalance is itself worth tuning). The highest-leverage next move
isn't a new fix — it's an `/oversight` pass covering, in one
sitting: promoting the truncation-boundary candidate (concrete,
scoped, 5 live instances), the mirror-gap process decision (now four
live examples), the standing 24-row candidate cluster (58 days
stale, four candidates at or near the top of the score range), the
critique-gate decision (past 90 days), the Lighthouse re-enable
decision, the two blocked workflow-permission fixes, and (small)
closing the orphaned `#719` duplicate issue by hand.

## Tuning proposals

**One new candidate filed this tick**: `[score 6.5]` Truncation-
boundary mechanical survey, added directly to
`plan/PHASE_CANDIDATES.md`'s Pending section (digest is allowed to
propose per the meta-loop rail, never apply). Evidence: 5 same-shape
"hard-cut mid-word, no boundary search" fixes landed in this
window's ~14-hour span (10 commits) — denser than any other cluster
currently tracked in that file, including the previous record (5 in
a 20-commit/~15h window). Notably, `/expand` pass 308 ran at 06:34
UTC, immediately after 3 of the 5 instances (00:36, 04:57, 05:43)
had already landed inside its own 9-commit lookback window since
pass 307 — pass 308's own notes discuss a different, sub-threshold
`/tools` finding and don't mention the truncation cluster at all.
Whether that's a one-off miss or a sign `/expand`'s commit-pattern
read (§4G) needs a sharper prompt for "defect resurfacing in code a
very recent fix in the same chain touched" is worth an `/oversight`
look, but isn't itself filed as a second candidate — one pass
missing one pattern, on a single data point, doesn't clear the bar
for a process-tuning proposal the way the mirror-gap finding's four
live instances did.

The elevated `/expand` cadence this window (5 passes vs. the typical
2-3) is a mechanical consequence of march's Step 3c 20-commit/48h
gate never firing (every anchor-to-anchor gap stayed under 10
commits/~8h) — not a mistuned ceiling, since the gate's alternate
`/iterate`-failure-mode-6 path is working exactly as designed and
producing real signal (this window's fixes and the new candidate
both came from it). No ceiling/cadence tuning proposed for that.

The critique-gate staleness (92 days), the 24-row `/oversight`
backlog, and the four standing `triage:needs-user` issues remain
standing, already-diagnosed decisions awaiting a human call, not new
tuning signals — covered under "Needs you" rather than re-proposed
here.
