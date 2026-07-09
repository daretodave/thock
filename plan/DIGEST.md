# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The ship-content duplicate-issue loop is fixed and proved itself the
same day it shipped; the rest of the window was routine `/iterate`
maintenance.** Since yesterday's digest (`f4d0196`), the Step 3a
issue-persistence checkpoint landed first thing (`b1f7263`, closes the
`[4.9]` AUDIT finding) — the very next content-gap dispatch reused
issue #417 instead of opening a tenth duplicate (`16f69d7`), then
shipped the deep-dives article that had been stuck for 10+ hours
("Why the Durock T1's Bump Feels the Way It Does", `5fc97b4`/`995c3a7`,
closes #417). The fix's own filed `[score 6.5]` PHASE_CANDIDATES row
is now `[x]` — resolved inline, no `/oversight` promotion needed. The
other 22 commits in the window are single-fix `/iterate` ticks: 2
cross-link drains, a stale group-buy cross-ref pass, a dead-source-link
fix, an orphaned-mentionedParts cleanup, a script false-positive fix,
a group-buy status-drift fix (2 records), an SEO fix (JSON-LD image
now points at the rendered OG PNG instead of a raw SVG), a meta-
description length cap (60 of 90 articles were over Google's ~160-char
SERP truncation point), and an a11y fix (5 `loading.tsx` routes gained
`PageSectionKicker` announced text). Four `/expand` passes (158-161)
all filed 0 new candidates. Full breadth `pnpm verify` is green top to
bottom, run fresh this tick (591 web unit tests, 159 script tests, 69
data records, 974/974 e2e). Deploy is `READY` at HEAD (`36371ae`).
`plan/CRITIQUE.md` is now **59 days / 1216 commits** since its last
pass — unchanged diagnosis, still the standing item to resolve.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-08 11:31 | digest | 2026-07-08 briefing committed |
| 07-08 11:59 | iterate | ship-content Step 3a issue-persistence checkpoint (`b1f7263`) — closes the `[4.9]` AUDIT finding and the `[score 6.5]` candidate in one move |
| 07-08 12:39 | march | content dispatch reused issue #417 (first correct behavior since the fix) |
| 07-08 12:58 | march | content: deep-dives — "Why the Durock T1's Bump Feels the Way It Does" (`5fc97b4`), closes #417 |
| 07-08 13:47–13:48 | iterate | durock-t1-deep-dive cross-links — 2 pairs drained |
| 07-08 15:15–15:16 | iterate | dcs-grass-valley-decline — 2 stale group-buy cross-refs past-tensed |
| 07-08 16:02 | expand | pass 158 — 0 candidates filed, 1 stale resolved (the ship-content fix) |
| 07-08 16:58 | iterate | case-materials-compared — dead Drop CTRL source link fixed |
| 07-08 17:57 | iterate | removed orphaned gazzew-boba-u4 mentionedParts from two articles |
| 07-08 18:45 | iterate | article-parts-check.mjs false-positive fix (prefix-colliding entity names) |
| 07-08 19:51–19:52 | iterate | gmk-cyl-ramune + gmk-cyl-selene status stuck at group-buy after close, fixed |
| 07-08 20:46 | expand | pass 159 — no candidates |
| 07-08 21:42 | expand | pass 160 — no candidates |
| 07-08 23:46–23:49 | iterate | Article JSON-LD `image` now points at the rendered OG PNG, not a raw SVG |
| 07-09 00:54–00:57 | iterate | meta description length cap at 160 chars for SERP-facing slots |
| 07-09 03:32–03:33 | iterate | 5 `loading.tsx` routes gain `PageSectionKicker` announced text |
| 07-09 11:17 | expand | pass 161 — no candidates |

24 commits total in the window; every `march`-workflow run in the last
30 (going back to 07-07 23:21) reports `success` at the GitHub Actions
level.

## Shipped

- **engineering**: `skills/ship-content.md` Step 3a — writes
  `- issue: #N` back onto the matched AUDIT row immediately after the
  issue-open call, before content-curator/brander spawn. A
  died-mid-flight dispatch now resumes on the same issue instead of
  duplicating. Proved out same-day: the very next dispatch reused
  #417 and shipped.
- **content**: "Why the Durock T1's Bump Feels the Way It Does"
  (deep-dives) — the article the 9-duplicate-issue loop had been
  blocking since 07-08 00:34. Closes #417.
- **content**: 2 cross-link pairs drained on durock-t1-deep-dive; 2
  stale present-tense group-buy cross-refs past-tensed on
  dcs-grass-valley-decline; 1 dead Drop CTRL source link fixed on
  case-materials-compared.
- **data**: orphaned gazzew-boba-u4 `mentionedParts` removed from two
  articles; gmk-cyl-ramune + gmk-cyl-selene status drift (stuck at
  `group-buy` after close) fixed on both records.
- **seo**: Article JSON-LD `image` field now resolves to the rendered
  OG PNG route instead of a raw frontmatter SVG path (Google Rich
  Results requires an absolute JPEG/PNG/WebP/GIF, not a relative SVG)
  — closes #428. Meta description length capped at 160 chars across
  `meta.description`/`openGraph.description`/`twitter.description`
  (60 of 90 articles previously overran Google's SERP truncation
  point) — closes #428 companion.
- **a11y**: 5 `loading.tsx` routes (`tools`, `vendors`, `vendor/[slug]`,
  `quiz/switch`, `quiz/keycap-set`) gained `PageSectionKicker`
  announced text during Suspense fallback — closes #429.
- **scripts**: `article-parts-check.mjs` false-positive fix for
  prefix-colliding entity names.
- Four `/expand` passes (158, 159, 160, 161) — 0 new candidates; pass
  158 additionally marked the ship-content candidate `[x]` resolved.

## Queues now

- **Build plan**: 0 pending phases — pure `/iterate` maintenance mode,
  unchanged.
- **Cross-link drain**: 0 pending, unchanged.
- **`plan/AUDIT.md`**: 1 open row — the standing `[6.3]
  blocked-cloud-permission]` `march.yml` crash-gate fix (unchanged,
  still stuck on the workflow-write permission wall). The `[4.9]`
  ship-content finding from yesterday's digest is now `[x]` — closed
  same-day.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **59 days / 1216 commits stale** (up from 58/1190
  yesterday). Unchanged diagnosis: cloud `/march` hard-skips
  `/critique` by design (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique
  gate diagnostic candidate is still standing, unpromoted.
- **`plan/PHASE_CANDIDATES.md`**: 13 pending rows — down from 14
  yesterday (the ship-content issue-persistence candidate resolved
  inline same-day, no `/oversight` promotion needed). Incumbents
  unchanged: Stale group-buy frontmatter/prose gate (6.5), `/quiz/board`
  (6.5), Critique gate diagnostic (6.5), external link-rot survey
  (6.0), march.yml crash-issue gate `always()` fix (6.0), Parts catalog
  third data pass (5.5), `/compare/keycap-set` (5.5), Vitest coverage
  CI gate (5.5), ship-data mentionedParts rescan (5.5), Cloud loop
  workflow-push permission gap (5.5), Tracker 8-week editorial analysis
  (5.0), Accessory parts kind (5.0), Tracker topic history page (4.5).
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 9 open issues — `#395` (cloud march crash-issue gate,
  unchanged, blocked) plus 8 remaining duplicate content-gap issues
  (#414-#416, #418-#422 — #417 closed by this window's article ship).
  0 unlabeled, 0 `triage:needs-user`. These 8 duplicates are still
  awaiting a manual/oversight consolidation pass — the digest doesn't
  touch GitHub state.
- **Expand cadence**: 0 commits since pass 161 (just landed at 11:17
  UTC); next pass due whenever the 20-commit/48h threshold trips.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, sequential legs — all green:

- `typecheck` — green, 8/8 workspace packages.
- `test:run` — green, 591 web unit tests (94 files), plus all other
  workspace packages.
- `test:scripts` — green, 59 suites / 159 tests.
- `data:validate` — green, 69 records (9 vendors, 18 switches, 10
  keycap-sets, 9 boards, 13 group-buys, 10 trend weeks), cross-refs
  resolve.
- `build` — green, no manifest churn issues (generated
  manifest/search-index files picked up fresh build timestamps —
  reverted before commit since this tick's diff is plan/ prose only).
- `size` — green, 108.5 KB / 200 KB homepage gzip budget (unchanged).
- `e2e` — green, 974/974. Benign `NoFallbackError` stderr noise logged
  mid-run on `/trends/tracker/[week]` for non-generated week params
  (expected 404-path behavior, same as prior digests) — did not fail
  any test.
- **Lighthouse**: no workflow found (`gh run list --workflow
  lighthouse` returns "could not find any workflows named
  lighthouse") — still no signal, consistent with prior digests.
- `pnpm deploy:check` at HEAD (`36371ae`) — deploy `READY`.

No red legs, no new AUDIT.md finding from this breadth check.

## Needs you

1. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 59 days / 1216 commits since the last local
   `/critique` pass — the fresh-eyes loop has been dark for two
   months. The candidate (filed 2026-07-03) already has a full
   diagnostic writeup and a proposed fix shape (resolve the
   AND/OR ambiguity between `march.md`'s Purpose section and its Step
   2 body, add a trace log, manually re-baseline the header).
2. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[score 5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged.
3. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (#414-#416, #418-#422) from the pre-fix ship-content duplicate-issue
   loop are still open — none will self-close since the fix only
   prevents new duplicates, it doesn't retroactively close old ones.
   A manual `gh issue close` pass (or bundling under a tracking issue)
   would tidy the tracker.
4. **Standing: `/quiz/board` (6.5) and the stale group-buy
   frontmatter/prose gate (6.5)** remain the two highest-scored
   incumbent candidates besides the critique diagnostic, both
   unpromoted since filing. No new urgency signal this window beyond
   their unchanged scores.

## Today's intent

No pending build-plan phase, no data backlog, cross-link drain and
content-gap queue both empty. The ship-content fix closed out
cleanly and doesn't need further attention unless a new stuck-dispatch
pattern emerges. Expect more single-fix `/iterate` maintenance ticks —
the corpus is clean per every mechanical survey (content-gap,
crosslink, companion, stale-GB, newsletter-gap, OG-coverage,
a11y-spec-coverage, article-parts-check, article-language-check,
tracker-linkage) as of pass 161. `/quiz/board`, the stale group-buy
gate, and the Critique gate diagnostic are the three highest-scored
Pending candidates, all still awaiting `/oversight` promotion.

## Tuning proposals

None this pass. No mistuned-gate signal in the window: the one gate
this digest flagged in prior passes (ship-content's duplicate-issue
loop) is fixed and confirmed working same-day; the critique-staleness
and march.yml-permission gaps both already have standing
`plan/PHASE_CANDIDATES.md` rows from earlier passes, unpromoted but
not newly worsened in a way that changes their shape — restating them
under **Needs you** rather than re-filing duplicate candidates.
