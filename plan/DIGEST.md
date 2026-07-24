# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean 23h38m, 34-commit window — 22/22 `march` runs green,
unchanged from the last digest — and the standing Critique-gate
mystery is finally closed: expand pass 218 confirmed it isn't a
`march.md` bug at all, it's architectural (cloud mode categorically
can't run `/critique` — no Chrome MCP on the runner — and every
single commit in the last 20 days carries the `Cloud-Run:` trailer,
meaning zero local ticks have occurred in that window to ever reach
the check).** Since the last digest (`857495c0`, 2026-07-23T11:29:40Z)
the loop landed 34 commits: 15 fix+audit-drain pairs (3 more
focus-visible a11y instances — 5 components in one commit, vendor
part links + `PartHero` byline, 18 route-level nav links across 8
pages — plus a dependency-vulnerability patch, an ISR-revalidation
gap fix, 3 content self-contradiction fixes, 2 copy/data-hygiene
fixes, an SEO description fix, and a name-drift bug in the
tracker-linkage-survey script itself) and 4 `/expand` passes
(218–221: pass 218 confirmed the Critique-gate root cause in place;
219 filed nothing; 220 and 221 each updated the standing
focus-visible candidate in place with a new instance, now at 10
cumulative). This tick's own fresh `pnpm verify` is green across all
seven legs: typecheck, 697 web unit tests / 97 files (up from 684),
168 script tests / 61 suites (up from 161), 74 data records
(cross-refs resolve, unchanged), build — all canonical routes (72
articles, 4 newsletters, unchanged), homepage bundle 108.7 KB / 200
KB (down slightly from 109.1 KB), and **1074/1074 e2e** (unchanged).
Deploy is `READY` at HEAD (`b2e327f3`).

`plan/CRITIQUE.md` is still **74 days / 1640 commits** since its
last pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — but the
diagnosis is no longer open-ended: pass 218 traced the last
no-`Cloud-Run:`-trailer commit to `f4c92bc` on 2026-07-03 (the exact
day this candidate was first filed) and confirmed all 514+ commits
since carry the trailer. `/critique` was never going to fire in that
window regardless of `march.md` Step 2's condition wording, because
the only path that reaches Step 2 (a local tick) hasn't occurred.
`plan/PHASE_CANDIDATES.md` holds steady at **19 pending rows**
(unchanged — pass 220/221 updated the focus-visible candidate in
place rather than adding new rows), still **43 days** since the last
promotion (2026-06-11, phases 43/44/45). No `march` runs failed this
window (22/22 green, matching the last digest).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-23 11:53 | expand | pass 218 — 0 new candidates; Critique-gate diagnostic updated in place with the confirmed root cause |
| 07-23 12:55 | iterate | content — gmk-cyl-pandemonium-group-buy tracker paragraph self-contradiction fixed `[4.8]` (`da298fd5`/`f10249c9`) |
| 07-23 13:52 | iterate | fix — high-severity next.js + transitive dependency vulnerabilities patched `[6.5]` (`316d937d`/`4d13136c`) |
| 07-23 15:02-15:03 | iterate | a11y — focus-visible ring missing on 5 card/rail-item components `[4.8]` (`c2b889a5`/`976caf3f`) |
| 07-23 15:58 | expand | pass 219 — no candidates |
| 07-23 16:36 | expand | pass 220 — no candidates; focus-visible candidate updated with 8th instance |
| 07-23 17:51-17:52 | iterate | a11y — /search catalog results section gets a real heading `[3.6]` (`2468d360`/`bb5925d5`) |
| 07-23 19:02 | iterate | perf — ISR revalidation added to date-sensitive group-buy pages `[4.0]` (`31f16355`/`0c98c218`) |
| 07-23 20:46-20:47 | iterate | content — gazzew-boba-u4t-deep-dive Oil King spring-lube contradiction fixed `[5.6]` (`6bac932e`/`69e7adb4`) |
| 07-23 21:42 | iterate | data — cherry-xtrfy-tmr-pivot mentionedParts fictitious switch reference dropped `[3.6]` (`4e71cd25`/`1103b1ab`) |
| 07-23 22:37-22:38 | iterate | a11y — vendor part links + PartHero byline focus ring `[4.5]` (`bfb2c833`/`d77e002b`) |
| 07-23 23:45-23:46 | iterate | fix — quiz ResultCard switch-type label drifted from shared spec-labels `[3.6]` (`d48544e3`/`baf02deb`) |
| 07-24 00:48 | iterate | a11y — 18 route-level nav links across 8 pages gain focus ring `[5.6]` (`5dc7ac8a`/`77ccec8b`) |
| 07-24 01:49 | iterate | content — stale updatedAt frontmatter bumped on 2 recently-edited articles `[3.6]` (`945836f0`/`05bd289c`) |
| 07-24 03:24-03:25 | iterate | seo — distinct per-week descriptions for Trends Tracker archive pages `[4.2]` (`1bc742b0`/`4da36b85`) |
| 07-24 08:19-08:20 | iterate | content — gmk-cyl-prussian-alert proxy-vendor contradiction fixed `[5.4]` (`018b5cb3`/`c8c134ab`) |
| 07-24 08:56 | expand | pass 221 — no new candidates; focus-visible candidate updated with 9th + 10th instances |
| 07-24 10:10 | iterate | data — trends W30 Hall Effect/Rapid Trigger row linked to companion article `[6.3]` (`e2cd04fc`/`d6222dd7`, tick `e026ecad`) |
| 07-24 11:07 | iterate | fix — tracker-linkage-survey topic matching broke on name spelling drift `[4.8]` (`f811b20b`/`b2e327f3`) |

34 commits total in the window (~23h38m, `857495c0` → `b2e327f3`).
All 22 `march`-workflow runs since 2026-07-23T11:37 UTC report
`success` — no crash-issue-gate recurrence this window.

## Shipped

- **a11y**: 3 more focus-visible ring fixes — 5 card/rail-item
  components (PartIndexCard, RelatedArticleCard,
  MentionedPartsRail items, NewsletterArchive, TrackerArchiveStrip),
  vendor part links + PartHero byline, and 18 route-level nav links
  across 8 pages. Same recurring defect class the standing `[6.5]`
  candidate tracks — now at 10 cumulative instances.
- **content**: 3 self-contradiction fixes (gmk-cyl-pandemonium-group-buy
  tracker paragraph, gazzew-boba-u4t-deep-dive Oil King spring lube,
  gmk-cyl-prussian-alert proxy-vendor data) plus a stale-`updatedAt`
  bump on 2 articles.
- **fix**: quiz ResultCard switch-type label drift corrected against
  the shared spec-labels source; tracker-linkage-survey's own topic
  matching fixed for name spelling drift (the script that files
  content-gap rows had a bug in its own matching logic).
- **security**: high-severity next.js + transitive dependency
  vulnerabilities patched.
- **perf**: ISR revalidation (`revalidate = 3600`) added to
  date-sensitive group-buy pages that were previously frozen at
  build/deploy time.
- **data**: cherry-xtrfy-tmr-pivot's fictitious mentionedParts
  reference dropped; trends W30 Hall Effect/Rapid Trigger row linked
  to its companion article.
- **seo**: distinct per-week meta descriptions for Trends Tracker
  archive pages (previously identical across all weeks).
- **expand**: 4 passes (218–221). Pass 218 closed the 20-day
  Critique-gate mystery with a confirmed root cause (architectural,
  not a bug). Passes 220 and 221 each updated the standing
  focus-visible candidate in place with a fresh instance (8th, then
  9th + 10th). Pass 219 filed nothing.

## Queues now

- **Build plan**: 0 pending phases (51 shipped, unchanged) — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending `[4.5]` rows, unchanged.
- **`plan/AUDIT.md`**: 1 open row, unchanged from several digests
  running: `[4.0]` Lighthouse-CI disabled (confirmed still
  `disabled_manually` via `gh api .../actions/workflows`; the two
  most recent recorded runs, 2026-06-12 and 2026-06-14, both
  `failure`; still `next: /oversight call`). Every other finding
  this window was filed and drained same-tick.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **74 days / 1640 commits stale.** No longer an
  open mystery — pass 218 confirmed cloud mode architecturally
  cannot reach `/critique` (no Chrome MCP; every commit since
  2026-07-03 carries `Cloud-Run:`), so the standing `[6.5]`
  candidate is now a `[needs-user-call]` decision row, not a bug fix
  waiting on scope.
- **`plan/PHASE_CANDIDATES.md`**: **19 pending rows** (unchanged —
  this window's two focus-visible-instance updates landed in the
  existing row, not new ones), **43 days** since the last promotion
  (2026-06-11, phases 43/44/45). Top of the cluster: `[7.0]`
  trend-snapshot data-quality gate, `[7.0]` content-fact-vs-catalog
  numeric-spec audit, `[7.0]` article internal-consistency checker,
  `[6.5]` `/quiz/board`, `[6.5]` stale group-buy frontmatter/prose
  gate, `[6.5]` Critique gate diagnostic (needs-user-call), `[6.5]`
  sitewide focus-visible default + coverage check (now 10 instances).
- **`data/BACKLOG.md`**: 0 live pending rows, unchanged.
- **Triage**: 12 open issues, unchanged shape — 0 unlabeled. 8
  duplicate content-gap issues (`#414-#416`, `#418-#422`) still await
  a manual consolidation pass; `#421` remains a *shipped* duplicate
  (`gazzew-boba-u4t-deep-dive.mdx` already exists in corpus). Two
  `triage:needs-user` issues unresolved: `#434` (Vercel never
  ingested commit `e312e09`, now 13 days old) and `#499` (night
  digest crashed, now 8 days old). `#395` and `#437` are stable.
- **Expand cadence**: 4 passes this window (218: root-cause update;
  219: nothing; 220–221: focus-visible instance updates) — all
  mechanical surveys ran clean every pass.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 697 web unit tests (97 test files), up from
  684.
- `test:scripts` — green, 168 tests / 61 suites, up from 161.
- `data:validate` — green, 74 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 12
  trend weeks — unchanged this window).
- `build` — green, all canonical routes generated (72 articles, 4
  newsletters — unchanged).
- `size` — green, homepage gzip 108.7 KB / 200 KB budget (down
  slightly from 109.1 KB).
- `e2e` — green, **1074/1074**, unchanged.
- `pnpm deploy:check` at HEAD (`b2e327f3`) — deploy `READY`
  (`dpl_5yE4j2xr`).
- `lighthouse` — unchanged: workflow remains `disabled_manually`,
  last two recorded runs (2026-06-12, 2026-06-14) both `failure`.
  Standing `[4.0]` AUDIT.md row. No new signal this window.

One non-blocking observation: the e2e run's server stderr logged
`NoFallbackError` several dozen times against `/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
and `/newsletter/[slug]` — all five routes declare `dynamicParams =
false`. This looks like Next's expected internal log for a
legitimate 404 lookup against a param outside the pre-generated set
(the e2e suite's own not-found-page tests), not a real failure —
every one of the 1074 tests still passed. Not filed as an AUDIT row;
noting it here in case the pattern changes shape in a future run.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New: the Critique-gate mystery is solved — the standing
   `[6.5]` candidate is now a live `/oversight` decision, not an
   open investigation.** Cloud mode cannot run `/critique` (no
   Chrome MCP on the runner) and every commit since 2026-07-03 has
   been a cloud tick, so the gate has been architecturally
   unreachable for the entire 74-day stale window — not a
   `march.md` bug. Options on the table: (a) accept `/critique` as a
   local-only ritual and run it by hand periodically, (b) find a way
   to run the reader sub-agent's checks without Chrome MCP on cloud,
   (c) something else. This needs a decision, not more diagnosis.
2. **Standing, still growing: the sitewide focus-visible default +
   coverage-check candidate is now at 10 confirmed instances**
   (`[6.5]`, unpromoted since 2026-07-22). Two more landed reactively
   this window alone. This is the single highest-leverage promotion
   available right now — it stops a defect class the reactive model
   has now failed to fully catch ten times running.
3. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
   `.github/workflows/lighthouse.yml` is `disabled_manually`. Filed
   `plan/AUDIT.md` `[4.0]`. Still the site's only automated
   a11y/perf/SEO regression gate, still dark.
4. **Standing: `#421` is a shipped duplicate, not just an unwritten
   one.** Worth a manual close-as-duplicate pass, separate from the
   other 7 duplicate issues that still name genuinely unwritten
   topics.
5. **Standing, growing: the `/oversight` promotion backlog.** 19
   candidates pending, now **43 days** since the last promotion
   (2026-06-11). Three candidates now sit at 7.0, three more at 6.5.
6. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (Vercel silently dropped the deploy for commit `e312e09`,
   filed 2026-07-10, 13 days old) and `#499` (night digest crashed,
   filed 2026-07-16, 8 days old). Neither self-resolved; both still
   await a human look.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (the sole open row is
`/oversight`-gated). The next `/march` tick will most likely repeat
this window's pattern: another `/expand` pass or a reactive
`/iterate` fix if a fresh one-off surfaces. The highest-leverage next
move isn't a new fix — it's an `/oversight` pass over the candidate
cluster, starting with the sitewide focus-visible default (stops a
10-instance-and-counting drain immediately) and a decision on the
now-diagnosed Critique-gate question (does the fresh-eyes loop stay
local-only, or does it need a cloud-compatible path).

## Tuning proposals

None new this pass. This window's dominant meta-loop signal — two
more focus-visible instances landing after the candidate was already
filed — updated the existing `plan/PHASE_CANDIDATES.md` row rather
than warranting a new one; the right action is promotion, not
another candidate. The Critique-gate root-cause finding (cloud mode
architecturally can't reach `/critique`) was likewise folded into the
existing `[6.5]` candidate by expand pass 218, reclassifying it as
`[needs-user-call]` rather than filing fresh — the diagnosis is
complete; what remains is a user decision, not more automation work.
