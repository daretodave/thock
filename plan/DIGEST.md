# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A quiet, clean 15-commit window — 22/22 `march` runs green, zero
crashes, zero half-shipped state — and this tick's own breadth
check is the first fully-green `pnpm verify` in recent memory: no
new AUDIT.md row required.** Since the last digest (`7c35305`,
2026-07-18T11:09 UTC) the loop landed 15 commits: 6 self-contained
`/iterate` findings (SEO, a data-completeness gap, an investigated-
and-correctly-reverted structural block, content-copy accuracy, a
disclosure-attribute fix, and a shared error-boundary copy fix —
each closing its own GitHub issue, #530-#533), one `/ship-data` tick
(a new group-buy record + hero art), and one full content-gap
cycle (dispatch → companion article shipped, closing #535) plus a
fresh content-gap dispatch that opened #536 for the next tick. No
`/expand` pass fired this window (march's own 20-commit/48h cadence
gate wasn't met since pass 204 on 2026-07-18). This tick's full
breadth `pnpm verify` is green top to bottom, run fresh as seven
sequential foreground legs: 664 web unit tests (825 total across
workspaces incl. scripts), 161 script tests, 73 data records
(cross-refs resolve), 1040/1040 e2e, homepage bundle flat at 108.6
KB / 200 KB. Deploy is `READY` at HEAD (`87c86ce`).

`plan/CRITIQUE.md` is now **70 days / 1472 commits** since its last
pass — unchanged diagnosis, growing, still the standing item.
`plan/PHASE_CANDIDATES.md` sits at **16 pending rows** (unchanged),
now **57 days** since the last promotion (2026-05-23). The
`[4.0]` Lighthouse-CI AUDIT row filed by last night's digest is
still open and unchanged (confirmed still `disabled_manually` via
`gh api` this tick).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-18 13:52-13:53 | iterate | seo — vendor detail Organization JSON-LD swapped `url`/`sameAs` fixed (`7539cd3`), audit `4c98325`, closes #531 |
| 07-18 16:43 | iterate | fix — vendor detail pages now render a vendor's switches and keycap-sets (`ec46e1e`), audit `9cc71a9`, closes #532 |
| 07-18 17:50 | iterate | investigated — article/tag soft-404 fix confirmed structurally blocked under current Next.js routing; reverted, no code shipped, closes #533 as not-planned |
| 07-18 18:48-18:49 | iterate | content — newsletter 001 W25 recap false Cherry MX2A streak/low claim fixed (`b653a64`), audit `29ce7cd` |
| 07-18 20:44 | iterate | fix — vendor outbound links now carry `rel="sponsored noopener"` (`616e5d8`), closes #530 |
| 07-18 21:35 | iterate | fix — root error boundary no longer claims every route is the home page (`ca326b5`), audit `9c279d0` |
| 07-18 22:44 | ship-data | data — cannonkeys-blaine-v2-se group-buy record + hero art (`3b0b9b0`) |
| 07-18 23:21 | content-gap dispatch | opened issue #535 — Rule 3 companion article missing for Blaine V2: SE |
| 07-19 05:30-05:31 | ship-content | content — news: "The Blaine V2: SE puts three mount systems in one kit and asks the buyer to pick" (`151743c`), audit `5f141de`, closes #535 |
| 07-19 06:55 | content-gap dispatch | opened issue #536 — guides pillar hot pursuit (1 of ≥2 articles in 30d) |

15 commits total in the window. Of the 22 `march`-workflow runs
since 07-18 11:09 UTC, all 22 report `success` — no crashes, no
half-shipped commits, no dirty tree at any point. The `night`
workflow's own last run before this one (07-18, digest `7c35305`)
also reports `success`.

## Shipped

- **seo**: vendor detail `Organization` JSON-LD had `url` and
  `sameAs` swapped — fixed across all 10 vendor detail pages.
- **fix**: vendor detail pages (`/vendor/[slug]`) never rendered a
  vendor's switches or keycap-sets, only boards — now all three
  catalog sections render.
- **investigated, not shipped**: the `/article/[slug]` +
  `/tag/[slug]` soft-404 fix was implemented, verify-gated, and
  found to genuinely break the "did you mean" not-found UX — real
  404 status and segment-level suggestions are mutually exclusive
  under the current Next.js routing model. Reverted cleanly; filed
  as a `[needs-user-call] [4.2]` AUDIT row for an `/oversight` trade-
  off call rather than shipped half-broken.
- **content**: newsletter 001's W25 tracker recap claimed Cherry
  MX2A was "down for the sixth consecutive week" at "its lowest
  tracker position" — the real archived scores show a one-week
  streak (W24 was flat) and W23 was lower than W25. Rewrote to the
  real trajectory.
- **bug**: vendor outbound links used `rel="noopener noreferrer"`
  instead of the bearings-mandated `rel="sponsored noopener"` —
  every vendor link on `/vendors` and `/vendor/[slug]` violated the
  affiliate-disclosure rule. Fixed across both routes.
- **bug**: the root `error.tsx` boundary (shared fallback for ~19
  route families without their own local error boundary) was
  hardcoded as `HomeError` with "home page" copy and a link back to
  `/about` — misleading on every route except `/`, worst-case on
  `/about` itself. Genericized to route-agnostic copy and a "back to
  home" link.
- **data**: new group-buy record `cannonkeys-blaine-v2-se` + hero
  art shipped via `/ship-data`.
- **content**: companion news article for the Blaine V2: SE group
  buy shipped via `/ship-content`, closing the Rule 3 content-gap
  dispatch from the same window.

## Queues now

- **Build plan**: 0 pending phases (49 shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 2 pending `[4.5]` rows, both new this
  window — the freshly-added `cannonkeys-blaine-v2-se-group-buy`
  article has no prose cross-link yet to `cannonkeys-nyawice-group-
  buy` or `mode-sonnet-r2-group-buy-coverage` (same pillar, ≥2
  shared tags each).
- **`plan/AUDIT.md`**: 6 open rows (689 total, 683 `[x]`), up from
  1 going into this window. Breakdown: the standing
  `[blocked-cloud-permission] [6.3]` march.yml crash-gate row
  (unchanged since 2026-07-05); the standing `[4.0]` Lighthouse-CI
  row (unchanged, confirmed still `disabled_manually`); the new
  `[needs-user-call] [4.2]` soft-404-vs-not-found-UX row (this
  window); the 2 new `[cross-links] [4.5]` rows above; and 1
  `[HOT PURSUIT] [content-gap] [7]` row for the guides pillar (issue
  #536, filed this morning by the auto-refill survey — 1 of ≥2
  articles in the last 30 days).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **70 days / 1472 commits stale**, up from 68
  days / 1456 commits. Unchanged diagnosis: the `[6.5]` Critique
  gate diagnostic candidate is still standing, unpromoted, 16 days
  since it was filed (2026-07-03).
- **`plan/PHASE_CANDIDATES.md`**: 16 pending rows, unchanged count
  — no `/expand` pass fired this window (march's 20-commit/48h
  cadence gate wasn't met since pass 204). Four still tied at the
  top, all `[6.5]`: `/quiz/board`, Stale group-buy frontmatter/prose
  gate, Critique gate diagnostic, Automated content-fact-vs-catalog
  numeric-spec audit. File's header still records "Last oversight:
  2026-05-23" — **57 days**, no promotions since.
- **`data/BACKLOG.md`**: 0 live pending rows (the 3 rows still
  listed under "Pending" are all already marked `[x]` — stale
  bookkeeping the file hasn't moved to "Done," not live work).
- **Triage**: 13 open issues, up from 12 (+#536, opened this
  morning). 0 unlabeled. Two `triage:needs-user` issues still open
  and unresolved (see Needs you): `#434` (Vercel never ingested
  commit `e312e09`, 2026-07-10, now 9 days old) and `#499` (night
  digest crashed, 2026-07-16, now 3 days old). `#395` and `#437`
  are stable. 8 duplicate content-gap issues (`#414-#416`,
  `#418-#422`) still await a manual consolidation pass.
- **Expand cadence**: 0 passes this window (still pass 204 from
  2026-07-18). Not a mistuning signal — march's own cadence gate
  simply wasn't met yet in a 15-commit, ~19.5h window.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 664 web unit tests (97 test files); other
  workspaces ran under the same `pnpm -r` fan-out. Benign jsdom "Not
  implemented: navigation" stderr noise on `MobileNav.test.tsx` —
  doesn't fail the test, same as prior digests.
- `test:scripts` — green, 161 tests / 59 suites (survey-script unit
  coverage).
- `data:validate` — green, 73 records walked, cross-refs resolve
  (18 switches, 10 keycap-sets, 10 boards, 10 vendors, 14
  group-buys, 11 trend weeks).
- `build` — green, all canonical routes generated (67 articles, 3
  newsletters).
- `size` — green, homepage gzip 108.6 KB / 200 KB budget (flat).
- `e2e` — green, **1040/1040**. Benign `NoFallbackError` stderr
  noise mid-run on `/part/[kind]`, `/part/[kind]/[slug]`,
  `/vendor/[slug]`, `/trends/tracker/[week]`, and
  `/newsletter/[slug]` — the intentional not-found probes on routes
  carrying `dynamicParams = false`, not a regression.
- `pnpm deploy:check` at HEAD (`87c86ce`) — deploy `READY`
  (`dpl_ERffmpCh`).
- `lighthouse` — unchanged from last digest: `disabled_manually`
  per `gh api .../actions/workflows` (re-confirmed this tick), 98
  failures / 2 skips / 0 successes in its last 100 recorded runs.
  Already filed as `[4.0]` AUDIT.md row; no new signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick — the first fully clean breadth run since the Lighthouse gap
surfaced.

## Needs you

1. **Standing: Lighthouse CI has been disabled and failing for 5+
   weeks — `/oversight` call needed.** Unchanged since last digest.
   `.github/workflows/lighthouse.yml` is `disabled_manually` with
   98/100 recent runs failed, 0 successes. Filed `plan/AUDIT.md`
   `[4.0]`. Still the site's only automated a11y/perf/SEO regression
   gate, still dark.
2. **New: `/oversight` trade-off call on the article/tag soft-404
   fix.** `[needs-user-call] [4.2]` AUDIT row filed this window
   (issue #533, closed not-planned after a verified local repro).
   Real 404 status and the segment-level "did you mean" not-found
   UX are mutually exclusive for `/article/[slug]` and `/tag/[slug]`
   under the current Next.js routing model — needs a decision: keep
   the status quo (200 soft-404, working suggestions), accept
   `dynamicParams = false` (real 404, generic root not-found copy,
   same trade-off already made for the other 4 entity routes), or
   scope a future phase to build route-aware suggestions into the
   root not-found page.
3. **Standing, growing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 70 days / 1472 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the candidate diagnosing why has itself sat
   unpromoted for 16 days.
4. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until the push credential gains "Workflows: write."
5. **Standing, growing: the `/oversight` promotion backlog.** 16
   candidates pending, unchanged count, but now **57 days** since
   the last promotion (2026-05-23). Four candidates sit at 6.5.
6. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (Vercel silently dropped the deploy for commit `e312e09`,
   filed 2026-07-10, 9 days old) and `#499` (night digest crashed,
   filed 2026-07-16, 3 days old). Neither self-resolved; both still
   await a human look.
7. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (`#414-#416`, `#418-#422`) — unchanged, each still names a
   genuine unwritten deep-dives topic rather than a shipped
   duplicate, so closing them would discard real content backlog.

## Today's intent

Next queued work: the `[HOT PURSUIT] [content-gap] [7]` guides-
pillar row (issue #536, filed this morning) is the top-scored open
AUDIT item — the next `/march` tick should dispatch `/ship-content`
for a guides article. Behind it, the 2 new `[cross-links] [4.5]`
rows on the Blaine V2: SE companion article are queued for a normal
`/iterate` drain. No pending build-plan phase, no data backlog.
`/quiz/board`, the stale group-buy frontmatter/prose gate, the
Critique gate diagnostic, and the content-fact-audit survey remain
the four highest-scored `PHASE_CANDIDATES.md` rows, all still
awaiting `/oversight` promotion.

## Tuning proposals

None this pass. The three live gate-mistuning signals (critique
staleness, cloud workflow-push permission, the now-57-day
promotion-cadence gap) all already have standing
`plan/PHASE_CANDIDATES.md` rows or are tracked in Needs You above;
this window's ordinary loop output (6 iterate fixes, 1 ship-data
tick, 1 content-gap cycle) added no new signal beyond updated pulse
numbers on what's already on file.
