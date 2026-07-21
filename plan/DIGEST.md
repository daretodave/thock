# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.5h, 33-commit window — 21/21 `march` runs green, zero
crashes — that kept finding and fixing the same underlying bug
class (trend-snapshot semantic errors) faster than the loop can
promote the fix for it, plus one dependency-advisory pin and one
a11y focus fix. This tick's own fresh `pnpm verify` is green top to
bottom.** Since the last digest (`3991c2f`, 2026-07-20T11:42 UTC)
the loop landed 33 commits: 1 content-gap dispatch (newsletter issue
04), 2 `/expand` passes (206: 0 candidates; 207: 1 candidate — the
trend-snapshot data-quality gate, score 6.0), and 15 `/iterate`
fix+audit ticks. Seven of those fifteen were the *same* bug class:
trend-snapshot JSON shipping schema-valid but semantically wrong
content (misnamed platforms, mislinked articles, self-contradictory
notes, undercounted/fabricated numbers) — W25 undercount, newsletter
heading count, W30 note contradiction, W30 mislinked rows, "of 52"
hardcode, W24 platform mixup, newsletter MX2A direction, W30 Cherry
note contradiction, Prototypist spark fabrication, W23 undercount.
`/expand` pass 207 filed a candidate for this mid-window citing 5
instances; **3 more instances shipped after pass 207 filed it**,
all caught by ad-hoc general-purpose sweeps because the dedicated
survey script doesn't exist yet. This tick's full breadth
`pnpm verify` is green fresh, run as seven sequential foreground
legs: typecheck all 8 workspaces, 673 web unit tests / 97 files (up
from 664), 161 script tests / 59 suites (unchanged), 74 data records
(cross-refs resolve, unchanged), build all canonical routes (70
articles unchanged, 4 newsletters up from 3), homepage bundle flat
at 109.1 KB / 200 KB, and **1064/1064 e2e** (up from 1061). Deploy is
`READY` at HEAD (`c12972c`).

`plan/CRITIQUE.md` is now **72 days** since its last pass (11,
2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged diagnosis,
still the standing item, still unpromoted at `[score 6.5]` in
`plan/PHASE_CANDIDATES.md`. `plan/PHASE_CANDIDATES.md` sits at
**17 pending rows** (up 1, the new trend-snapshot candidate), now
**59 days** since the last promotion (2026-05-23). One dependency
security pin shipped this window (`7a3f711`, 9 advisories from
`pnpm audit`) — worth a note since it's a category that hasn't
appeared in recent digests.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-20 13:05-13:06 | ship-content | content — newsletter: "thock weekly — issue 04" (`fd125cd`), audit `a6cda02` |
| 07-20 13:39 | expand | pass 206 — 0 candidates, all 7 mechanical surveys clean |
| 07-20 15:59-16:00 | iterate | data — trends W25 Prototypist row undercounted GB count (`7adb3b6`/`9e0710b`) |
| 07-20 17:00-17:01 | iterate | content — newsletter issue 04 Trends heading GB count fix (`2073f94`/`f4d35d1`) |
| 07-20 18:02-18:03 | iterate | a11y — quiz results/reset transitions restore keyboard focus (`b9d3304`/`52f22b6`) |
| 07-20 18:58-18:59 | iterate | fix — pin 9 dependency advisories flagged by `pnpm audit` (`7a3f711`/`56f8c62`) |
| 07-20 19:51 | iterate | data — 2 articles missing `mentionedParts` entries `[3.6]` (`a21e18e`/`8900565`) |
| 07-20 21:01 | iterate | data — W30 tracker note GMK CYL OG Extensions self-contradiction `[5.4]` (`61ade1a`/`c49161e`) |
| 07-20 21:49 | iterate | fix — `/compare/switch` table missing Vendor row `[4.5]` (`faa74b2`/`ba5b92e`) |
| 07-20 22:43 | iterate | data — trends W30 Keychron/HE rows linked to unrelated articles `[4.2]` (`b2bea61`/`919f0b1`) |
| 07-20 23:52 | iterate | fix — Trends Tracker header hardcoded "of 52" weeks `[4.5]` (`23946fc`/`1b66e19`) |
| 07-21 03:23-03:24 | iterate | data — trends W24 Keychron row misnamed platform (Gizmodo/Gizmart) `[4.5]` (`76bdc60`/`deca0d4`) |
| 07-21 05:29 | iterate | content — newsletter issue 04 Cherry MX2A tracker direction fix, orphaned issue `#553` found+shipped directly (`e3b0bed`) |
| 07-21 07:05 | expand | pass 207 — 1 candidate filed: trend-snapshot data-quality gate, score 6.0 (`c80dbfc`) |
| 07-21 08:16 | iterate | content — group-buy vendor-link disclosure, `PartReference` omission `[5.4]` (`d471210`/`06e9814`) |
| 07-21 09:15 | iterate | data — trends W30 Cherry (GMK parent) note contradicts its own linked article `[7.2]` (`e011b54`/`b8212eb`) |
| 07-21 10:16 | iterate | content — Prototypist W29/W30 trend-signal spark fabricated a negative dip `[3.0]` (`408f806`/`fe04a5f`) |
| 07-21 11:13 | iterate | data — trends W23 Prototypist row undercounts concurrent GBs (2 vs 3) `[5.4]` (`df20436`/`c12972c`) |

33 commits total in the window (~23h31m, 3991c2f → c12972c). Of the
21 `march`-workflow runs since 07-20T11:42 UTC, all 21 report
`success` — no crashes, no half-shipped commits, no dirty tree at
any point. The `night` workflow's prior run (07-20, digest `3991c2f`)
also reports `success`.

## Shipped

- **content**: newsletter — "thock weekly — issue 04" (Rule 1
  content-gap dispatch), then 2 same-window fact-fixes to it (Trends
  heading GB count, Cherry MX2A tracker direction).
- **a11y**: quiz results/reset transitions now restore keyboard
  focus instead of dropping it.
- **security**: pinned 9 dependency advisories flagged by
  `pnpm audit`.
- **fix**: `/compare/switch` table was missing its Vendor row;
  Trends Tracker header no longer hardcodes "of 52" weeks.
- **data**: 7 trend-snapshot semantic-correctness fixes across
  W23/W24/W25/W30 — undercounted GB citations (×2), a misnamed
  crowdfunding platform, two mislinked `articleSlug` rows, a
  self-contradictory note, and a fabricated negative spark dip that
  three separate published surfaces (article, newsletter, hero SVG)
  had all repeated as fact. 2 articles' `mentionedParts` gaps closed;
  1 group-buy article's vendor-link disclosure (`PartReference`
  omission) fixed.
- **expand**: pass 206 (0 candidates) and pass 207 (1 candidate —
  trend-snapshot data-quality gate, `[score 6.0]`, citing the same
  bug class this window kept reinforcing).

## Queues now

- **Build plan**: 0 pending phases — pure `/iterate` maintenance
  mode, unchanged.
- **Cross-link drain**: 0 pending `[4.5]` rows, unchanged — stays at
  zero.
- **`plan/AUDIT.md`**: 3 open rows, all non-autonomous, all unchanged
  since the last several digests: `[blocked-cloud-permission] [6.3]`
  march.yml crash-issue gate; `[4.0]` Lighthouse-CI disabled
  (confirmed still `disabled_manually`, 98/100 recent runs failed);
  `[needs-user-call] [4.2]` soft-404-vs-not-found-UX. Every other
  finding this window was filed and drained same-tick.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **72 days stale**, up from 70 at the last digest.
  The `[score 6.5]` Critique gate diagnostic candidate is still
  standing, unpromoted, now 18 days since it was filed (2026-07-03).
- **`plan/PHASE_CANDIDATES.md`**: **17 pending rows** (up 1 from 16
  — pass 207's new trend-snapshot candidate), **59 days** since the
  last promotion (2026-05-23). Five candidates now cluster at the
  top: `[6.5]` `/quiz/board`, `[6.5]` stale group-buy
  frontmatter/prose gate, `[6.5]` Critique gate diagnostic, `[6.5]`
  content-fact-vs-catalog numeric-spec audit, and the new `[6.0]`
  trend-snapshot data-quality gate (which gained 3 more supporting
  instances in the 4h *after* it was filed — see Needs You).
- **`data/BACKLOG.md`**: 0 live pending rows (3 listed rows all
  already `[x]`, stale bookkeeping, unchanged from prior digests).
- **Triage**: 12 open issues (down from 13) — 0 unlabeled. 8
  duplicate content-gap issues (`#414-#416`, `#418-#422`) still await
  a manual consolidation pass; `#421` remains a *shipped* duplicate
  (its topic shipped under `#537` in a prior window) that still
  needs a manual close. Two `triage:needs-user` issues unresolved:
  `#434` (Vercel never ingested commit `e312e09`, now 11 days old)
  and `#499` (night digest crashed, now 5 days old). `#395` and
  `#437` are stable.
- **Expand cadence**: 2 passes this window (206: 0 candidates; 207:
  1 candidate) — all 7 mechanical surveys ran clean both times; the
  new candidate came from a disjoint general-purpose sweep reading
  the commit-pattern signal, same as usual.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 673 web unit tests (97 test files), up from
  664 (new a11y focus-restoration coverage on the quiz results/reset
  flow).
- `test:scripts` — green, 161 tests / 59 suites, unchanged.
- `data:validate` — green, 74 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 12
  trend weeks — unchanged this window, only existing rows edited).
- `build` — green, all canonical routes generated (70 articles
  unchanged; 4 newsletters, up from 3 — issue 04 landed this
  window).
- `size` — green, homepage gzip 109.1 KB / 200 KB budget (flat).
- `e2e` — green, **1064/1064** (up from 1061). Benign
  `NoFallbackError` stderr noise mid-run on `/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  and `/newsletter/[slug]` — the intentional not-found probes on
  routes carrying `dynamicParams = false`, same as every prior
  digest, not a regression.
- `pnpm deploy:check` at HEAD (`c12972c`) — deploy `READY`
  (`dpl_AWqRgBTe`).
- `lighthouse` — unchanged: `disabled_manually` per
  `gh workflow list --all` (re-confirmed this tick), last 3 recorded
  runs all `failure` (2026-06-12 ×2, 2026-06-14). Already filed as
  `[4.0]` AUDIT.md row; no new signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Sharpening: the trend-snapshot data-quality gate candidate
   (`[score 6.0]`, filed pass 207) gained 3 more supporting instances
   in the 4 hours after it was filed.** Pass 207 cited 5 instances
   across a 22-commit window; this same digest window then shipped 3
   more (W30 Cherry note contradiction `[7.2]`, Prototypist
   fabricated spark `[3.0]`, W23 undercount `[5.4]`) — 8 instances of
   the identical bug class now on record, each caught reactively by
   an ad-hoc general-purpose sweep because `data:validate` checks
   shape, not semantic correctness, and no dedicated survey script
   exists yet. This is the single strongest promotion signal
   currently in the queue.
2. **Standing: Lighthouse CI has been disabled and failing for 6+
   weeks — `/oversight` call needed.** Unchanged since last digest.
   `.github/workflows/lighthouse.yml` is `disabled_manually`, last 3
   recorded runs all failed. Filed `plan/AUDIT.md` `[4.0]`. Still the
   site's only automated a11y/perf/SEO regression gate, still dark.
3. **Standing: `#421` is a shipped duplicate, not just an unwritten
   one.** Its topic ("Gazzew Boba U4T deep-dive") shipped under
   `#537` in an earlier window, but `#421` itself was never closed.
   Worth a manual close-as-duplicate pass, separate from the other 7
   duplicate issues that still name genuinely unwritten topics.
4. **Standing, growing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 72 days / 1091+ commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the candidate diagnosing why has itself sat
   unpromoted for 18 days.
5. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until the push credential gains "Workflows: write."
6. **Standing, growing: the `/oversight` promotion backlog.** 17
   candidates pending (up 1), now **59 days** since the last
   promotion (2026-05-23). Five candidates now sit at 6.0-6.5.
7. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (Vercel silently dropped the deploy for commit `e312e09`,
   filed 2026-07-10, 11 days old) and `#499` (night digest crashed,
   filed 2026-07-16, 5 days old). Neither self-resolved; both still
   await a human look.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all 3 open rows are
`/oversight`-gated). The next `/march` tick will most likely repeat
this window's pattern: a fresh general-purpose sweep finding one more
reactive fix (trend-snapshot data or otherwise) via `/iterate`
failure-mode 6, or an `/expand` dispatch once the 20-commit/48h gate
trips again. The highest-leverage next move isn't a new fix — it's
promoting the trend-snapshot data-quality gate candidate (item 1
above) so this window's 7-instance pattern stops recurring one tick
at a time. `/quiz/board`, the stale group-buy frontmatter/prose gate,
and the Critique gate diagnostic remain the other top-scored
`PHASE_CANDIDATES.md` rows, all still awaiting `/oversight`
promotion.

## Tuning proposals

None new this pass. The trend-snapshot data-quality gap already has
a standing `plan/PHASE_CANDIDATES.md` row (filed pass 207, this
window's own commits are reinforcing evidence, not a new proposal —
see Needs You #1). Critique staleness and the promotion-cadence gap
are likewise already tracked as standing candidates/Needs-You items.
This window's ordinary loop output (1 content dispatch, 2 expand
passes, 15 iterate ticks) added no signal beyond sharpening what's
already on file.
