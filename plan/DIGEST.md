# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean 33-commit maintenance window — 23/23 `march` runs green,
zero crashes, zero half-shipped state — but this tick's own pulse
check turned up a real gap: Lighthouse CI has been silently
disabled and failing on effectively every run for five-plus weeks,
and every prior digest since at least 2026-07-15 mis-reported it as
"no such workflow" rather than catching it.** Since the last digest
(`e9eef67`, 2026-07-17T11:20 UTC), the loop landed 33 commits: 15
self-contained `/iterate` findings (bugs, content/copy corrections,
a11y fixes, SEO fixes — each closing its own GitHub issue, #513-#529
with #519 folded into #520's commit), and 3 `/expand` passes (202,
203 — both no-candidate; 204 — 1 candidate filed, a `[score 5.0]`
`/tools` blurb-accuracy check). This tick's full breadth `pnpm
verify` is green top to bottom, run fresh as seven sequential
foreground legs: 648 web unit tests (895 total across all
workspaces incl. scripts), 161 script tests, 72 data records
(cross-refs resolve), 1033/1033 e2e, homepage bundle flat at 108.6
KB / 200 KB. Deploy is `READY` at HEAD (`8f58c79`).

**The Lighthouse finding, in short:** `gh run list --workflow
lighthouse` — the exact command `skills/digest.md` Step 2
prescribes — errors "could not find any workflows named lighthouse"
for a *disabled* workflow, which reads identically to "the workflow
doesn't exist." It isn't gone: `gh api .../actions/workflows` shows
`lighthouse.yml` in state `disabled_manually`, and `gh run list
--workflow lighthouse.yml` (by filename, not display name) surfaces
its real history — 98 failures / 2 skips out of the last 100
recorded runs, zero successes on record. Filed as a new `[4.0]`
`plan/AUDIT.md` row (see Breadth verdict + Needs you below); not
fixed by this digest per the standing "breadth findings become
rows, not fixes" rule.

`plan/CRITIQUE.md` is now **68 days / 1456 commits** since its last
pass — unchanged diagnosis, still the standing item.
`plan/PHASE_CANDIDATES.md` sits at **16 pending rows** (up from 15;
pass 204's new `/tools` blurb-accuracy candidate), unchanged
promotion cadence since `2026-05-23` (56 days).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-17 11:39 | expand | pass 202 — no candidates |
| 07-17 13:03-13:13 | iterate | content — divinikey-dcs-dolch-group-buy lede undercounts regional storefronts, 8 vs 9 (`12bbbfa`), audit `3384f99`, closes #513 |
| 07-17 13:49 | iterate | a11y — newsletter detail route gains axe coverage (`761475e`), closes #514 |
| 07-17 14:57-14:58 | iterate | fix — /search Trends Tracker weeks now join the parts catalog (`b92df2b`), audit `7abcf0e`, closes #515 |
| 07-17 15:55-15:58 | iterate | content — sponsored-link disclosure copy overclaims rel=sponsored coverage (`d2545c8`), audit `5fd13e8`, closes #516 |
| 07-17 16:33 | expand | pass 203 — no candidates |
| 07-17 17:41 | iterate | seo — publisher Organization JSON-LD gains logo field (`2a1a113`), closes #517 |
| 07-17 18:53-18:54 | iterate | content — work-louder-openai-codex-micro publish date corrected, fixes a tracker-citation timeline bug (`a04f5f2`), audit `faeb9f1`, closes #518 |
| 07-17 19:45-20:37 | iterate | seo — part pages emit valid `Thing` JSON-LD instead of invalid `Product`-only properties (`85bafa6`, `1325c46`), audit `d7abab2`, closes #519 and #520 |
| 07-17 21:38-21:39 | iterate | a11y — quiz question transitions move focus to the new heading (`7421b6b`), audit `b6ce4f7`, closes #521 |
| 07-17 22:35 | iterate | content — /tools + /quiz/keycap-set quiz description copy incomplete/self-contradictory (`9805f06`), audit `bfc1b19`, closes #522 |
| 07-17 23:33-23:34 | iterate | a11y — MobileNav Escape-close restores focus to the toggle button (`9d9def6`), audit `af8f95d`, closes #523 |
| 07-18 01:04 | iterate | fix — 4 of 6 dynamic entity routes soft-404'd (HTTP 200) on unknown slugs (`a764cb7`), closes #524 |
| 07-18 01:57-02:03 | iterate | fix — /quiz/keycap-set no-pref availability still surfaced sold-out/discontinued sets (`91bd3ea`), audit `b396f02` |
| 07-18 03:21 | iterate | content — /tools switch-quiz blurb undercounts its 4 quiz dimensions (`8ecbac5`), audit `1e53778`, closes #526 |
| 07-18 05:15 | iterate | content — /tools compare-boards blurb undercounts its 8 spec fields (`d3fd59e`), audit `2209099`, closes #527 |
| 07-18 06:10 | expand | pass 204 — 1 candidate filed: `/tools` blurb-accuracy check `[score 5.0]` |
| 07-18 07:50-07:53 | iterate | fix — catalog spec fields render human labels, not raw enum slugs (`de6bd3a`), audit `9bf8934`, closes #528 |
| 07-18 08:57-08:58 | iterate | fix — quiz keycap-set "group-buy" pref no longer surfaces sold-out sets (`fbb2570`), audit `8f58c79`, closes #529 |

33 commits total in the window. Of the 23 `march`-workflow runs
since 07-17 11:20 UTC, all 23 report `success` — no crashes, no
half-shipped commits, no dirty tree at any point. The `night`
workflow's own last run before this one (07-17, digest `e9eef67`)
also reports `success`.

## Shipped

- **content**: divinikey-dcs-dolch-group-buy lede undercounted
  regional storefronts (8 vs the real 9).
- **a11y**: newsletter detail route (`/newsletter/[slug]`) gains
  axe coverage in `a11y.spec.ts` — the last dynamic route family
  missing it.
- **fix**: `/search` now surfaces Trends Tracker weeks alongside
  the parts catalog — previously invisible on the primary
  discovery surface.
- **content**: sponsored-link disclosure copy overclaimed
  `rel="sponsored"` coverage beyond what actually carries the
  attribute.
- **seo**: publisher `Organization` JSON-LD gains a `logo` field
  (Google's recommended field for rich-result eligibility).
- **content**: work-louder-openai-codex-micro's publish date was
  wrong, which broke a tracker-citation timeline (the article cited
  data that, per its stated publish date, didn't exist yet).
- **seo**: part pages (`/part/[kind]/[slug]`) now emit valid
  `Thing` JSON-LD — dropped invalid `Product`-only properties
  (`brand`, `releaseDate`) that schema.org doesn't permit on
  `Thing`.
- **a11y**: quiz question transitions move keyboard focus to the
  new question heading instead of dropping it silently.
- **content**: `/tools` + `/quiz/keycap-set` quiz description copy
  was incomplete and self-contradictory between the two surfaces.
- **a11y**: `MobileNav` Escape-close now restores focus to the
  toggle button instead of dropping it.
- **bug**: 4 of 6 dynamic entity routes (`/vendor/[slug]`,
  `/newsletter/[slug]`, `/part/[kind]`, `/part/[kind]/[slug]`)
  returned HTTP 200 for unknown slugs instead of a real 404 — soft-
  404 risk for Search Console. `/article/[slug]` and `/tag/[slug]`
  are a documented follow-up (their not-found pages need `headers()`
  for "did you mean" suggestions, which conflicts with
  `dynamicParams = false`).
- **bug**: `/quiz/keycap-set`'s no-pref branch still surfaced sold-
  out/discontinued sets ahead of purchasable ones — third and
  final branch of a bug class already fixed twice in sibling
  branches this window.
- **content**: `/tools` switch-quiz and compare-boards blurbs both
  undercounted their real dimension/field counts (4 quiz questions,
  8 spec rows) — the same bug class expand pass 204 turned into a
  new mechanization candidate (see Queues now).
- **bug**: catalog spec fields (switch type/housing/stem, keycap
  profile/material/legend, board layout/material/mount-style)
  rendered raw enum slugs instead of human labels across
  `PartSpec`, `SwitchCompareTable`, and `BoardCompareTable` — fixed
  with one shared label-mapping module.
- **bug**: quiz keycap-set's `'group-buy'` availability preference
  still surfaced sold-out sets — the last of three branches sharing
  this bug class, all fixed this window.
- Two `/expand` passes (202, 203) — no candidates, all mechanical
  surveys clean; one (204) — 1 candidate filed.

## Queues now

- **Build plan**: 0 pending phases (all shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending rows.
- **`plan/AUDIT.md`**: 1 open row (678 total, 677 `[x]`) going into
  this tick, **+1 filed by this digest** — the Lighthouse CI
  finding above, `[4.0]`. The pre-existing open row is unchanged:
  the standing `[blocked-cloud-permission] [6.3]` `march.yml`
  crash-gate fix (filed 2026-07-05, still stuck on the workflow-
  write permission wall).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **68 days / 1456 commits stale.** Unchanged
  diagnosis: the `[6.5]` Critique gate diagnostic candidate is still
  standing, unpromoted, since 2026-07-03.
- **`plan/PHASE_CANDIDATES.md`**: 16 pending rows (up from 15). Four
  tied at the top, all `[6.5]`: `/quiz/board`, Stale group-buy
  frontmatter/prose gate, Critique gate diagnostic, Automated
  content-fact-vs-catalog numeric-spec audit. New this window:
  `[5.0]` Automated `/tools` blurb-accuracy check (pass 204) —
  three same-shape content fixes in one window (this digest's own
  "switch-quiz blurb," "compare-boards blurb," and a prior
  keycap-set-quiz blurb fix) all undercounted or disagreed with the
  quiz/compare surface they link to, with no mechanized check the
  way `og-coverage-check.mjs` covers its class. File's header still
  records "Last oversight: 2026-05-23" (56 days) — no promotions
  since.
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 12 open issues, unchanged from the last digest. 0
  unlabeled. Two `triage:needs-user` issues still open and
  unresolved (see Needs you): `#434` (Vercel never ingested commit
  `e312e09`, 2026-07-10) and `#499` (night digest crashed,
  2026-07-16). `#395` (blocked `[6.3]` march.yml crash-issue gate,
  companion to the AUDIT row above) and `#437`
  (`triage:reviewed`, no action needed) are stable. 8 duplicate
  content-gap issues (`#414-#416`, `#418-#422`) still await a manual
  consolidation pass.
- **Expand cadence**: 3 passes this window (202, 203 no-candidate;
  204 filed 1). Healthy cadence, not a mistuning signal.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 648 web unit tests (95 test files); other
  workspaces (data, seo, tokens, ui, content, e2e-fixtures) run
  under their own `test:run` scripts and were green as part of the
  same `pnpm -r` fan-out. Benign jsdom "Not implemented: navigation"
  stderr noise on `MobileNav.test.tsx` — doesn't fail the test, same
  as prior digests.
- `test:scripts` — green, 161 tests / 59 suites (survey-script unit
  coverage).
- `data:validate` — green, 72 records walked, cross-refs resolve
  (18 switches, 10 keycap-sets, 10 boards, 10 vendors, 13 group-buys
  — all closed/shipped, 11 trend weeks).
- `build` — green, all canonical routes generated.
- `size` — green, homepage gzip 108.6 KB / 200 KB budget (flat).
- `e2e` — green, **1033/1033**. Benign `NoFallbackError` stderr
  noise mid-run on `/part/[kind]`, `/part/[kind]/[slug]`,
  `/vendor/[slug]`, `/trends/tracker/[week]`, and
  `/newsletter/[slug]` — the intentional not-found probes (all five
  now carry `dynamicParams = false` after this window's soft-404
  fix), not a regression.
- `lighthouse` — **not green, and not "absent" either.** `gh run
  list --workflow lighthouse` (display name) errors as if no such
  workflow exists — every prior digest took that at face value.
  `gh api .../actions/workflows` shows it's real and in state
  `disabled_manually`; `gh run list --workflow lighthouse.yml` (by
  filename) shows 98 failures / 2 skips out of its last 100 recorded
  runs, zero successes. New `[4.0]` `plan/AUDIT.md` row filed this
  tick — see Needs you.
- `pnpm deploy:check` at HEAD (`8f58c79`) — deploy `READY`
  (`dpl_AGY6Yegt`).

One new AUDIT.md finding from this breadth check: the Lighthouse CI
gap above. No red `pnpm verify` legs.

## Needs you

1. **New: Lighthouse CI has been silently disabled and failing for
   5+ weeks — `/oversight` call needed.** `.github/workflows/
   lighthouse.yml` is in GitHub's `disabled_manually` state (a
   human or an out-of-band API call turned it off — no commit, no
   AUDIT/PHASE_CANDIDATES trail explains when or why). Its last 100
   recorded runs: 98 failures, 2 skipped, 0 successes. The last real
   run before it went dark caught one genuine SEO regression
   (`categories.seo` 0.92, needs ≥0.95) and one genuine a11y hit
   (`label-content-name-mismatch`), mixed in with assertion-drift
   noise against newer Lighthouse "Insight" audits that
   `.lighthouserc.json` wasn't written to handle. Filed as
   `plan/AUDIT.md` `[4.0]`. This has been the site's only automated
   a11y/perf/SEO regression gate, dark the whole time — worth
   deciding whether to re-enable now or investigate the original
   disable first.
2. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 68 days / 1456 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the candidate diagnosing why has itself sat
   unpromoted for 15 days.
3. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until the push credential gains "Workflows: write."
4. **Standing, growing: the `/oversight` promotion backlog.** 16
   candidates pending (up from 15), unchanged promotion cadence
   since 2026-05-23 (56 days). Four now sit at 6.5.
5. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (Vercel silently dropped the deploy for commit `e312e09`,
   filed 2026-07-10, 8 days old) and `#499` (night digest crashed
   during a Claude API outage, filed 2026-07-16, 2 days old).
   Neither self-resolved; both still await a human look.
6. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (`#414-#416`, `#418-#422`) — unchanged, each still names a
   genuine unwritten deep-dives topic rather than a shipped
   duplicate, so closing them would discard real content backlog.

## Today's intent

No pending build-plan phase, no data backlog, content-gap queue
empty. `plan/AUDIT.md` is back down to two open rows (the standing
blocked `[6.3]` row plus this tick's new `[4.0]` Lighthouse row), so
the next `/iterate` tick has a real queued finding to drain for the
first time in a while, rather than needing a fresh audit sweep.
`/quiz/board`, the stale group-buy frontmatter/prose gate, the
Critique gate diagnostic, and the content-fact-audit survey remain
the four highest-scored Pending candidates, all still awaiting
`/oversight` promotion.

## Tuning proposals

None this pass. The Lighthouse CI gap is a real breadth-check
finding, filed as an AUDIT.md row per the standing rule (breadth
failures become findings, not fixes) — it isn't a march
cadence/ceiling mistuning, so it doesn't belong in this section.
The three live gate-mistuning gaps already have standing
`plan/PHASE_CANDIDATES.md` rows (critique staleness, cloud
workflow-push permission, numeric-fact-audit) and this window added
no new signal to any of them beyond what's already on file. This
window's fifteen `/iterate` fixes and one expand-filed candidate are
ordinary loop output, not gate-mistuning signals.
