# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~22.5h, 35-commit window — 21/22 `march` runs green, one
silent crash repeating the already-known crash-issue-gate bug — that
surfaced a brand-new recurring defect class (article lede/body/chart
self-contradiction, 4 fresh instances) sharp enough for `/expand` to
file it as a new `[score 7.0]` candidate same-day. This tick's own
fresh `pnpm verify` is green top to bottom.** Since the last digest
(`49f23b7`, 2026-07-21T11:33 UTC) the loop landed 35 commits: 17
audit close-outs, 9 content fact-fixes, 3 general fixes, 2 a11y
fixes, 1 data fix, 1 test-coverage addition, and 2 `/expand` passes
(208: 0 new candidates, 1 updated in place; 209: 1 new candidate
filed, 1 updated in place). The standout signal this window is a
21-commit-wide cluster of articles whose lede/heading numeric or
count claims contradict their own body or embedded chart:
gasket-mount-reality ($400 lede vs $350 body, `991c3d2`/`cf68987`),
zmk-mainstream-shift ("five-board" framing vs a six-model list,
`2b241f9`/`4c6fbbe`), keychron-q-ultra-zmk (same defect, sibling
article, `3e650f4`/`d633cb5`), and computex-2026-keyboard-highlights
(an `InlineViz` chart fabricating a 7-week climb that contradicted
both `data/trends/` and the article's own body text,
`4e32764`/`2d9924c`). `/expand` pass 209 filed this as a new
`[score 7.0]` "Article internal-consistency checker" candidate and,
separately, raised the existing numeric-spec-audit candidate from
6.5 to 7.0 on a 6th instance (`#566`, newsletter tracker-figure
citations). This tick's full breadth `pnpm verify` is green fresh,
run as seven sequential foreground legs: typecheck all 8 workspaces,
675 web unit tests / 97 files (up from 673), 161 script tests / 59
suites (unchanged), 74 data records (cross-refs resolve, unchanged),
build all canonical routes (71 articles, up from 70; 4 newsletters
unchanged), homepage bundle flat at 109.1 KB / 200 KB, and
**1071/1071 e2e** (up from 1064). Deploy is `READY` at HEAD
(`6701830`).

`plan/CRITIQUE.md` is now **72 days / 1567 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis, still the standing item, still unpromoted at `[score 6.5]`
in `plan/PHASE_CANDIDATES.md` (filed 2026-07-03, now 19 days pending
itself). `plan/PHASE_CANDIDATES.md` sits at **18 pending rows** (up 1
— pass 209's new article-internal-consistency candidate), now **60
days** since the last promotion (2026-05-23). One `march` run failed
silently this window (2026-07-21T23:19:41Z) with no crash-issue
opened — a fresh, unlogged instance of the already-filed `[6.3]`
crash-issue-gate bug, reinforcing rather than adding to that
standing candidate.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-21 11:55 | iterate | content — newsletter tracker recaps cite wrong "eight weeks ago" figures `[4.0]` (`3fd26a8`/`56bf030`) |
| 07-21 13:01 | iterate | content — magnetic-switches-deep-dive.mdx duplicated "feature" phrase `[4.5]` (`bd5fde4`/`754ba42`) |
| 07-21 13:57-13:58 | iterate | data — trends W23 DCS Grass Valley spark fabricates a 7-week decline `[5.4]` (`4b280c6`/`dd2d1ef`) |
| 07-21 15:08-15:09 | iterate | a11y — compare page Compare buttons + result links missing focus-visible ring `[4.0]` (`575e78e`/`5478213`) |
| 07-21 15:40 | ship-content (dispatch) | audit — content-gap survey opened issue #563 |
| 07-21 16:03 | ship-content | content — trends: "Nova Socket: Keychron's bet on not choosing a switch technology" (`b789217`/`6c63f03`) |
| 07-21 16:37 | expand | pass 208 — 0 new candidates, 1 updated in place |
| 07-21 17:43 | iterate | content — keychron-nova-socket-hybrid cross-links, 1 pair drained `[4.5]` (`8dc6311`/`4dac6e4`) |
| 07-21 18:47-18:48 | iterate | content — drop-holy-panda-x deep-dive: false U4T factory-lube claim fixed `[5.4]` (`693fd87`/`ef574e3`) |
| 07-21 19:51 | iterate | a11y — sitewide focus-visible ring: ArticleCard, VendorCard, TrackerRow, CitationIndex, AboutBody `[7.2]` (`0037770`/`7b1fd1e`) |
| 07-21 21:45 | iterate | fix — `<Source>` component misused for internal tracker links `[3.2]` (`fc65f92`/`ab83d7f`) |
| 07-21 22:37-22:38 | iterate | fix — building-mode-sonnet-with-oil-kings misnames Sonnet mount as leaf-spring `[5.4]` (`bc6c114`/`1f7cc57`) |
| 07-21 23:19 | march (crashed) | **failure** — action crashed, no crash-issue opened (known `[6.3]` gate bug recurring) |
| 07-22 00:54 | iterate | fix — group-buys with catalog matches never link to their /part page `[5.4]` (`3411d81`/`6c5eda3`) |
| 07-22 02:01 | iterate | content — computex-2026-keyboard-highlights tracker chart fabricates a 7-week climb `[4.8]` (`4e32764`/`2d9924c`) |
| 07-22 03:22-03:22 | iterate | content — gasket-mount-reality price figures contradict lede vs body `[6.0]` (`991c3d2`/`cf68987`) |
| 07-22 05:27 | iterate | content — zmk-mainstream-shift Q Ultra lineup contradicts its own five-board framing `[5.0]` (`2b241f9`/`4c6fbbe`) |
| 07-22 07:12 | iterate | content — keychron-q-ultra-zmk lede contradicts its own five-board framing `[5.4]` (`3e650f4`/`d633cb5`) |
| 07-22 07:55 | expand | pass 209 — 1 candidate filed (article internal-consistency checker, `[7.0]`), 1 updated in place (numeric-spec-audit → 7.0) |
| 07-22 10:08-10:09 | iterate | test — newsletter not-found route added to a11y suite coverage `[3.2]` (`06f477d`/`6701830`) |

35 commits total in the window (~22h36m, `49f23b7` → `6701830`). Of
the 22 `march`-workflow runs since 07-21T11:33 UTC, 21 report
`success` and 1 reports `failure` (07-21T23:19:41Z) — the action
crashed outright with no transcript upload and no crash-issue opened,
a fresh instance of the standing `[blocked-cloud-permission] [6.3]`
gate bug (issue #395), not a new defect. The `night` workflow's prior
run (07-21, digest `49f23b7`) also reports `success`.

## Shipped

- **content**: 1 Rule-1 content-gap dispatch (trends — "Nova Socket:
  Keychron's bet on not choosing a switch technology"), plus 8
  fact/copy fixes: a duplicated phrase, a false factory-lube claim, a
  mount-type mislabel, and — the dominant pattern this window — 4
  lede/body/chart self-contradictions (gasket-mount-reality price,
  zmk-mainstream-shift board count, keychron-q-ultra-zmk lede,
  computex tracker-chart fabrication).
- **data**: 1 trend-snapshot fix (W23 DCS Grass Valley spark
  fabricated a 7-week decline).
- **a11y**: sitewide focus-visible ring added across 5 components
  (ArticleCard, VendorCard, TrackerRow, CitationIndex, AboutBody);
  compare-page buttons/links focus-visible ring.
- **fix**: `<Source>` component no longer misused for internal
  tracker links; group-buys with catalog matches now link to their
  `/part` page.
- **test**: newsletter not-found route added to a11y suite coverage.
- **expand**: pass 208 (0 new, 1 updated) and pass 209 (1 new —
  article internal-consistency checker `[7.0]`; 1 updated —
  numeric-spec-audit raised 6.5 → 7.0).
- **cross-links**: 1 pair drained (keychron-nova-socket-hybrid ↔
  zmk-mainstream-shift).

## Queues now

- **Build plan**: 0 pending phases (49 shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending `[4.5]` rows, unchanged — stays at
  zero.
- **`plan/AUDIT.md`**: 3 open rows, all non-autonomous, all unchanged
  since the last several digests: `[blocked-cloud-permission] [6.3]`
  march.yml crash-issue gate (recurred silently this window, see
  above); `[4.0]` Lighthouse-CI disabled (confirmed still
  `disabled_manually`); `[needs-user-call] [4.2]`
  soft-404-vs-not-found-UX. Every other finding this window was
  filed and drained same-tick.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **72 days / 1567 commits stale.** The `[score
  6.5]` Critique gate diagnostic candidate is still standing,
  unpromoted, now 19 days since it was filed (2026-07-03).
- **`plan/PHASE_CANDIDATES.md`**: **18 pending rows** (up 1 from 17
  — pass 209's new article-internal-consistency candidate), **60
  days** since the last promotion (2026-05-23). Six candidates now
  cluster at 6.5–7.0: `[7.0]` trend-snapshot data-quality gate,
  `[7.0]` numeric-spec-audit (raised today), `[7.0]` article
  internal-consistency checker (new today), `[6.5]` `/quiz/board`,
  `[6.5]` stale group-buy frontmatter/prose gate, `[6.5]` Critique
  gate diagnostic.
- **`data/BACKLOG.md`**: 0 live pending rows (3 listed rows all
  already `[x]`, stale bookkeeping, unchanged from prior digests).
- **Triage**: 13 open issues (up from 12) — 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#416`, `#418-#422`) still await a manual
  consolidation pass; `#421` remains a *shipped* duplicate that still
  needs a manual close. Two `triage:needs-user` issues unresolved:
  `#434` (Vercel never ingested commit `e312e09`, now 12 days old)
  and `#499` (night digest crashed, now 6 days old). `#395` and
  `#437` are stable.
- **Expand cadence**: 2 passes this window (208: 0 new/1 updated;
  209: 1 new/1 updated) — all 7 mechanical surveys ran clean both
  times; both fresh signals came from commit-pattern reads over the
  window, not the mechanical surveys.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 675 web unit tests (97 test files), up from
  673 (new newsletter-not-found a11y coverage test). Full monorepo
  tally: 1033 tests across tokens/data/seo/ui/e2e-fixtures/content/web.
- `test:scripts` — green, 161 tests / 59 suites, unchanged.
- `data:validate` — green, 74 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 12
  trend weeks — unchanged this window).
- `build` — green, all canonical routes generated (71 articles, up
  from 70 — Nova Socket landed this window; 4 newsletters
  unchanged).
- `size` — green, homepage gzip 109.1 KB / 200 KB budget (flat).
- `e2e` — green, **1071/1071** (up from 1064). Benign
  `NoFallbackError` stderr noise mid-run on `/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  and `/newsletter/[slug]` — the intentional not-found probes on
  routes carrying `dynamicParams = false`, same as every prior
  digest, not a regression.
- `pnpm deploy:check` at HEAD (`6701830`) — deploy `READY`
  (`dpl_BjgGgYUf`).
- `lighthouse` — unchanged: `gh run list --workflow lighthouse`
  still errors "could not find any workflows named lighthouse" (the
  known display-name-vs-disabled-workflow quirk); workflow remains
  `disabled_manually` per the standing `[4.0]` AUDIT.md row. No new
  signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New, sharp: two content-integrity candidates just hit `[7.0]`
   in the same expand pass.** Pass 209 filed "Article
   internal-consistency checker" (`[7.0]`, new) after 4 fresh
   lede/body/chart self-contradictions in a 21-commit window, and
   separately raised the numeric-spec-audit candidate (`[7.0]`, was
   6.5) on a 6th instance spanning newsletters as well as articles.
   Combined with the standing `[7.0]` trend-snapshot data-quality
   gate, three candidates at the same top score now compete for the
   next `/oversight` promotion slot — worth a look together rather
   than one at a time.
2. **Standing, growing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 72 days / 1567 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the candidate diagnosing why has itself sat
   unpromoted for 19 days.
3. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
   `.github/workflows/lighthouse.yml` is `disabled_manually`. Filed
   `plan/AUDIT.md` `[4.0]`. Still the site's only automated
   a11y/perf/SEO regression gate, still dark.
4. **Standing: the march.yml crash-issue gate failed silently again
   this window** (2026-07-21T23:19:41Z) — reinforcing, not adding
   to, the already-filed `[6.3]` AUDIT row / `[6.0]` candidate. Still
   blocked on the separate `[5.5]` workflow-push-permission gap: the
   two-line `always()` fix is written and verified, just unpushable
   from cloud until the push credential gains "Workflows: write."
5. **Standing: `#421` is a shipped duplicate, not just an unwritten
   one.** Worth a manual close-as-duplicate pass, separate from the
   other 7 duplicate issues that still name genuinely unwritten
   topics.
6. **Standing, growing: the `/oversight` promotion backlog.** 18
   candidates pending (up 1), now **60 days** since the last
   promotion (2026-05-23). Six candidates now sit at 6.5–7.0.
7. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (Vercel silently dropped the deploy for commit `e312e09`,
   filed 2026-07-10, 12 days old) and `#499` (night digest crashed,
   filed 2026-07-16, 6 days old). Neither self-resolved; both still
   await a human look.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all 3 open rows are
`/oversight`-gated). The next `/march` tick will most likely repeat
this window's pattern: a fresh general-purpose sweep finding one more
reactive content-integrity or trend-data fix via `/iterate`
failure-mode 6, or an `/expand` dispatch once the 20-commit/48h gate
trips again. The highest-leverage next move isn't a new fix — it's
an `/oversight` pass over the three `[7.0]`-tier candidates (article
internal-consistency checker, numeric-spec-audit, trend-snapshot
data-quality gate) that would mechanize away this window's dominant
bug class, alongside the still-open Critique gate diagnostic.

## Tuning proposals

None new this pass. This window's meta-loop signals — the recurring
march.yml crash-issue-gate failure, the growing Critique staleness,
and the fresh content-integrity cluster — are all already tracked as
standing `plan/PHASE_CANDIDATES.md` rows or Needs-You items (`/expand`
pass 209 filed and updated the relevant candidates same-day). This
window's ordinary loop output (1 content dispatch, 2 expand passes,
~15 iterate ticks) added reinforcing evidence, not a new proposal.
