# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Steady maintenance window — 8 `/iterate` fix ticks (16 commits,
each opening and same-day-closing its own GitHub issue), 10
`/expand` no-op passes, zero red legs, zero content-gap dispatches.**
Since yesterday's digest (`4f67feb`), the loop drained eight
self-contained editorial-correctness findings: two separate Oil
King spring-weight citation fixes on different articles
(`2160a6b` drop-holy-panda-x, `d369778`
building-mode-sonnet-with-oil-kings, closes `#469`/`#467`), a
gmk-cyl-og-extensions closing-date self-contradiction (`28f732d`,
closes `#468`), a gmk-cyl-og-extensions same-week tracker-comparison
wording bug (`d5f9e36`, closes `#466`), a missing 2-link cross-link
cluster on gmk-cyl-og-extensions-interest-check (`c2d2fb0`, closes
`#465`), a durock-t1-deep-dive "five-year-old" claim off by a year
(`564abb6`, closes `#470`), a vendor-page group-buy widget missing
stale-announced-status handling (`99aeaf5`, closes `#471`), and a
computex-2026-keyboard-highlights article citing the wrong W21
hall-effect score (`cee903d`, closes `#472`). The last two ticks each
surfaced a second finding they didn't ship: the vendor-page fix
noted the same bug class is dormant on the home-page
`GroupBuyCountdownRow` widget (now filed `[4.2]`), and the
computex-2026 fix's sweep surfaced a `[3.5]` `needs-scoping` row on
`rapid-trigger-gaming-crossover.mdx` where the prose and its own
hand-authored sparkline SVG disagree on which week ("W21" vs the
SVG's "W22" label) — flagged as needing a scoped decision before
editing, not a blind fix. Ten `/expand` passes (182-191) filed 0 new
candidates — the 13-row Pending queue is unchanged. No Monday
snapshot gate this window (not Monday), no content-gap dispatches
(both pillars stayed comfortable), no data backlog activity. Full
breadth `pnpm verify` is green top to bottom, run fresh this tick as
eight sequential foreground legs (1015/1015 e2e, homepage bundle
flat at 108.6 KB / 200 KB). Deploy is `READY` at HEAD (`34f26bc`).
`plan/CRITIQUE.md` is now **65 days / 1353 commits** since its last
pass — the gap widened by another day / 27 commits since yesterday,
unchanged diagnosis, still the standing item to resolve.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-13 12:53 | expand | pass 182 — no candidates |
| 07-13 13:56 | iterate | fix — gmk-cyl-og-extensions-interest-check missing 2 cross-links to DCS siblings (`c2d2fb0`), audit `474dedc`, closes #465 |
| 07-13 16:14 | expand | pass 183 — no candidates |
| 07-13 18:53-18:54 | iterate | fix — gmk-cyl-og-extensions implies same-week tracker comparison across 3 weeks (`d5f9e36`), audit `fbc0c8c`, closes #466 |
| 07-13 19:45 | expand | pass 184 — no candidates |
| 07-13 20:43 | iterate | fix — building-mode-sonnet-with-oil-kings cites wrong Oil King spring weight (`d369778`), audit `e20d662`, closes #467 |
| 07-13 21:39-21:40 | iterate | fix — gmk-cyl-og-extensions self-contradicts on closing date (`28f732d`), audit `928b1b7`, closes #468 |
| 07-13 22:39 | expand | pass 185 — no candidates |
| 07-13 23:26 | expand | pass 186 — no candidates |
| 07-14 00:54 | expand | pass 187 — no candidates |
| 07-14 01:48 | expand | pass 188 — no candidates |
| 07-14 03:18 | expand | pass 189 — no candidates |
| 07-14 05:15 | expand | pass 190 — no candidates |
| 07-14 07:16 | expand | pass 191 — no candidates |
| 07-14 07:52-07:53 | iterate | fix — drop-holy-panda-x deep-dive cites wrong Oil King spring weights (`2160a6b`), audit `8589230`, closes #469 |
| 07-14 09:02 | iterate | fix — durock-t1-deep-dive "five-year-old" claim off by a year (`564abb6`), audit `bd4db77`, closes #470 |
| 07-14 09:54 | iterate | fix — vendor page group-buy variant misses stale-announced fix (`99aeaf5`), audit `3fac223`, closes #471 — files new `[4.2]` finding on the home-page sibling widget |
| 07-14 10:57 | iterate | fix — computex-2026-keyboard-highlights cites wrong W21 hall-effect score (`cee903d`), audit `34f26bc`, closes #472 — files new `[3.5]` needs-scoping finding |

26 commits total in the window; every `march`-workflow run in the
last 30 (going back to 07-12 21:17) reports `success` at the GitHub
Actions level.

## Shipped

- **content**: two Oil King spring-weight citation fixes on
  different articles (drop-holy-panda-x HPX deep-dive,
  building-mode-sonnet-with-oil-kings).
- **content**: gmk-cyl-og-extensions — self-contradicted on its own
  closing date.
- **content**: gmk-cyl-og-extensions — implied a same-week tracker
  comparison that actually spanned 3 weeks.
- **content**: durock-t1-deep-dive — "five-year-old" product-age
  claim was off by a year.
- **content**: computex-2026-keyboard-highlights — cited the wrong
  W21 hall-effect score (60 instead of 55).
- **cross-links**: gmk-cyl-og-extensions-interest-check now links to
  its 2 DCS siblings (dcs-grass-valley-decline,
  dcs-olivetti-comeback).
- **engineering**: vendor-page group-buy widget
  (`VendorGroupBuySection`) had no `announced`-status handling —
  same bug class the earlier home-widget finding names, fixed on
  the vendor-detail surface first.
- Ten `/expand` passes (182-191) — 0 new candidates.

## Queues now

- **Build plan**: 0 pending phases (all shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending rows — the 2 fresh rows from
  yesterday's digest both drained this window (`c2d2fb0`).
- **`plan/AUDIT.md`**: 3 open rows (636 total, 633 `[x]`) — the
  standing `[blocked-cloud-permission] [6.3]` `march.yml` crash-gate
  fix (unchanged, still stuck on the workflow-write permission
  wall) plus 2 fresh rows filed today: `[needs-scoping] [3.5]`
  rapid-trigger-gaming-crossover.mdx's prose vs. its own sparkline
  SVG disagree on which week is the inflection point (needs a scoped
  decision, not a blind fix) and `[content] [4.2]` the home-page
  `GroupBuyCountdownRow` widget lacks `announced`-status handling —
  dormant today (no current record triggers it) but the same bug
  class just fixed on the vendor-page sibling.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **65 days / 1353 commits stale** (up from 64
  days / 1326 commits yesterday). Unchanged diagnosis: cloud
  `/march` hard-skips `/critique` by design
  (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique gate diagnostic
  candidate is still standing, unpromoted.
- **`plan/PHASE_CANDIDATES.md`**: 13 pending rows, unchanged for the
  seventh straight digest. Top incumbents: `/quiz/board` (6.5),
  Stale group-buy frontmatter/prose gate (6.5), Critique gate
  diagnostic (6.5), external link-rot survey (6.0), march.yml
  crash-issue gate `always()` fix (6.0), Parts catalog third data
  pass (5.5), `/compare/keycap-set` (5.5), Vitest coverage CI gate
  (5.5), ship-data mentionedParts rescan (5.5), Cloud loop
  workflow-push permission gap (5.5), Tracker 8-week editorial
  analysis (5.0), Accessory parts kind (5.0), Tracker topic history
  page (4.5). File's own header records "Last oversight: 2026-05-23"
  for phase-candidate promotions specifically — none of these 13
  rows have moved since.
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 11 open issues, unchanged in composition from
  yesterday — `#395` (cloud march crash-issue gate, blocked,
  companion to the AUDIT row above) plus 8 duplicate content-gap
  issues (#414-#416, #418-#422) from the pre-fix ship-content
  duplicate-issue loop, still awaiting a manual/oversight
  consolidation pass, plus `#437` (`triage:reviewed`, no action
  needed) and `#434` (`triage:needs-user` — Vercel webhook drop, see
  Needs you). 0 unlabeled — all 8 content-dispatch issues opened
  this window (`#465`-`#472`) closed same-day when their fixes
  shipped.
- **Expand cadence**: 10 consecutive no-candidate passes this
  window (182-191). Not a mistuning signal on its own — the queue is
  full (13 unpromoted rows), not empty; expand correctly isn't
  re-proposing what's already filed and awaiting `/oversight`.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all workspace packages (apps/web, apps/e2e,
  packages/content, data, seo, tokens, ui).
- `test:run` — green across all 8 workspaces; confirmed counts on
  the two largest (94 web-workspace test files / 609 tests, 24
  content-workspace test files / 152 tests), tokens/seo/data/ui/
  e2e-fixtures all reported `Done` with no failures; benign jsdom
  "Not implemented: navigation" stderr noise on `MobileNav.test.tsx`,
  doesn't fail the test — same as prior digests.
- `test:scripts` — green, 161 tests / 59 suites (survey-script unit
  coverage: content-gap, crosslink, companion, stale-GB,
  newsletter-gap, OG-coverage, a11y-spec-coverage, tracker-linkage,
  article-parts-check, article-language-check).
- `data:validate` — green (manifest build reports 18 switches, 10
  keycap-sets, 9 boards, 9 vendors, 13 group-buys, 11 trend weeks,
  65 articles, 3 newsletters, 75 tags — cross-refs resolve, 70
  records walked).
- `build` — green, all 52 static pages generated, no manifest churn
  issues (the `generatedAt` timestamp bump in the three
  `*.generated.json` manifests was reverted before commit — build
  artifacts, not part of this tick's notes-only diff).
- `size` — green, homepage gzip 108.6 KB / 200 KB budget (flat).
- `e2e` — green, **1015/1015**. Benign `NoFallbackError` stderr
  noise logged mid-run on `/trends/tracker/[week]` — confirmed this
  is the intentional `/trends/tracker/2099-W99` not-found probe in
  `apps/e2e/tests/a11y.spec.ts` (route has `dynamicParams = false`),
  not a regression; same as prior digests.
- `lighthouse` — no workflow named `lighthouse` exists in this repo
  (`gh run list --workflow lighthouse` errors "could not find any
  workflows named lighthouse"); nothing to report, same as every
  prior digest that's checked.
- `pnpm deploy:check` at HEAD (`34f26bc`) — deploy `READY`
  (`dpl_88vZWDmf`).

No red legs, no new AUDIT.md finding from this breadth check itself
(the two fresh AUDIT rows this window came from `/iterate`'s own
sweeps, not the nightly breadth gate).

## Needs you

1. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 65 days / 1353 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the gap widened by another day / 27 commits
   since the last digest. The candidate already has a full
   diagnostic writeup and a proposed fix shape (resolve the AND/OR
   ambiguity between `march.md`'s Purpose section and its Step 2
   body, add a trace log, manually re-baseline the header).
2. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until either the push credential gains "Workflows: write"
   or workflow-file changes move to a local/`/oversight`-only path.
3. **Standing: the `/oversight` promotion backlog itself.** 13
   candidates pending, unchanged for the seventh straight digest,
   three at 6.5 (`/quiz/board`, Critique gate diagnostic, stale
   group-buy frontmatter gate). Not a code defect — just a wide gap
   between candidate supply and promotion cadence.
4. **New: `[needs-scoping] [3.5]` rapid-trigger-gaming-crossover.mdx
   sparkline/prose entanglement.** The article's prose calls a data
   point "the W21 inflection" while its own hand-authored SVG
   highlights the same point with a coral "W22" axis label — an
   internal text-vs-image inconsistency. The fix needs a decision
   first (align prose to the real per-week data files, align it to
   the SVG's own label, or both) before touching the hand-authored
   SVG paths — flagged by `/iterate` as needing judgment rather than
   a mechanical find-replace.
5. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (#414-#416, #418-#422) from the pre-fix ship-content
   duplicate-issue loop are still open — each still names a genuine
   unwritten deep-dives topic (not a shipped duplicate), so closing
   them would discard real content backlog rather than being pure
   hygiene. A manual review pass would still tidy the tracker.
6. **Unchanged from prior digests: Vercel silently dropped the
   deploy for commit `e312e09`** (2026-07-10, issue `#434`,
   `triage:needs-user`). Every commit before and after deployed
   normally (confirmed again this tick — HEAD `34f26bc` deployed
   `READY` per `deploy:check`); self-resolved for subsequent
   commits, but worth a look at the GitHub → Vercel webhook
   configuration if it recurs.

## Today's intent

No pending build-plan phase, no data backlog, content-gap queue
empty (both pillars comfortable). The two fresh AUDIT.md rows are
the only immediately available work: the `[content] [4.2]`
home-page group-buy widget gap is mechanical and unambiguous (same
fix shape as the just-shipped vendor-page sibling), so expect the
next `/iterate` tick to pick it up first; the `[needs-scoping]
[3.5]` rapid-trigger row needs its scoping question answered before
it can ship and may sit longer. `/quiz/board`, the stale group-buy
frontmatter/prose gate, and the Critique gate diagnostic remain the
three highest-scored Pending candidates, all still awaiting
`/oversight` promotion — the queue hasn't moved in seven digests
running.

## Tuning proposals

None this pass. No new mistuned-gate signal in the window: the two
live gaps (critique staleness, cloud workflow-push permission) both
already have standing `plan/PHASE_CANDIDATES.md` rows from earlier
passes, unpromoted but not newly worsened in a way that changes
their shape — restating them under **Needs you** rather than
re-filing duplicate candidates. The new `[needs-scoping]` and
`[content] [4.2]` AUDIT rows are ordinary findings for `/iterate` to
drain, not gate-mistuning signals.
