# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Another steady maintenance window — 9 `/iterate` fix ticks (18
commits, each opening and same-day-closing its own GitHub issue), 5
`/expand` passes (1 candidate filed, 4 no-ops), zero red legs, zero
content-gap dispatches.** Since yesterday's digest (`70b6415`), the
loop drained nine self-contained findings: a home-page group-buy
widget missing `announced`-status handling (`e78ffde`, closes
#473 — the same bug class flagged as dormant in yesterday's digest,
now shipped), the `rapid-trigger-gaming-crossover.mdx`
W21/W22-sparkline scoping question flagged yesterday as
needs-a-decision (`0d8d9f3`, closes #474 — resolved cleanly once the
SVG's own provenance JSON confirmed W22 was the intended week),
`spring-swaps-explained` citing the wrong HMX Cloud actuation weight
(`8633c9c`, closes #475), MDX article internal links rendering as
raw `<a>` instead of `next/link` (`2b6f034`, closes #476 — a
site-wide perf/UX fix across all 65 articles' 376+ internal links),
a newsletter issue-badge zero-padding mismatch (`f1ff3a4`, closes
#477), a dead `yushakobo.jp` vendor citation (`d9bef4e`, closes
#478), the QK75 board wrongly attributed to CannonKeys instead of
Qwertykeys (`a5e5bf8`, closes #479 — added a missing
`data/vendors/qwertykeys.json` record), the last live group-buy
record (`cannonkeys-mode-sonnet-r2`) flipped to closed past its
endDate (`fa0c09e`, closes #481 — all 13 group-buy records are now
closed/shipped), and the addition of site-wide security response
headers (`d371e55`, closes #482 — X-Frame-Options,
X-Content-Type-Options, Referrer-Policy, CSP `frame-ancestors`).
`/expand` pass 192 filed one new `[6.5]` candidate (automated
content-fact-vs-catalog numeric-spec audit, reacting to a 5-fix
cluster of "article cites a wrong number" bugs in a 15-commit
window); passes 193-196 filed nothing further. No Monday snapshot
gate this window (not Monday), no content-gap dispatches (both
pillars stayed comfortable — content-gap survey clean on every
pass), no data backlog activity. Full breadth `pnpm verify` is green
top to bottom, run fresh this tick as seven sequential foreground
legs (1019/1019 e2e, homepage bundle flat at 108.6 KB / 200 KB).
Deploy is `READY` at HEAD (`e5f2629`). `plan/CRITIQUE.md` is now
**65 days / 1377 commits** since its last pass — unchanged diagnosis,
still the standing item to resolve, and the candidate queue grew
again (13 → 14 Pending rows) while `/oversight` promotion stayed
flat.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-14 11:49 | iterate | fix — home-page group-buy widget misses `announced`-status handling (`e78ffde`), audit `bc344f7`, closes #473 |
| 07-14 12:53-12:54 | iterate | fix — rapid-trigger-gaming-crossover W21/W22 sparkline/prose scoping resolved (`0d8d9f3`), audit `2090366`, closes #474 |
| 07-14 14:55 | iterate | fix — spring-swaps-explained cites wrong HMX Cloud actuation weight (`8633c9c`), audit `24401d8`, closes #475 |
| 07-14 15:47-15:48 | iterate | fix — MDX internal links use next/link instead of raw anchors (`2b6f034`), audit `46ad283`, closes #476 |
| 07-14 16:54-16:55 | iterate | fix — newsletter issue badge zero-padding mismatch (`f1ff3a4`), audit `ba844a8`, closes #477 |
| 07-14 17:44 | expand | pass 192 — 1 candidate filed (automated content-fact-vs-catalog numeric-spec audit, score 6.5) |
| 07-14 19:53-19:54 | iterate | fix — dead yushakobo.jp vendor link in GMK CYL Ramune article (`d9bef4e`), audit `33ab48a`, closes #478 |
| 07-14 20:52 | expand | pass 193 — no candidates |
| 07-14 22:52 | iterate | fix — QK75 board wrongly attributed to CannonKeys instead of Qwertykeys (`a5e5bf8`), audit `37672af`, closes #479 |
| 07-14 23:37 | expand | pass 194 — no candidates |
| 07-15 02:23 | iterate | fix — cannonkeys-mode-sonnet-r2 group-buy status stale, flip to closed (`fa0c09e`), audit `2b4b239`, closes #481 |
| 07-15 03:23 | expand | pass 195 — no candidates |
| 07-15 05:09 | expand | pass 196 — no candidates |
| 07-15 10:53 | iterate | fix — no security response headers site-wide (`d371e55`), audit `e5f2629`, closes #482 |

23 commits total in the window; every `march`-workflow run in the
last 30 (going back to 07-14T01:34) reports `success` at the GitHub
Actions level.

## Shipped

- **content**: home-page group-buy widget (`GroupBuyCountdownRow`)
  had no `announced`-status handling — same bug class fixed on the
  vendor-page sibling the day before, now closed on both surfaces.
- **content**: rapid-trigger-gaming-crossover — resolved the
  W21/W22 sparkline-vs-prose scoping question flagged yesterday, via
  the SVG's own provenance JSON.
- **content**: spring-swaps-explained — cited the wrong HMX Cloud
  actuation weight.
- **engineering**: MDX article internal links now render via
  `next/link` instead of raw `<a>` — client-side navigation across
  all 65 articles' internal cross-links.
- **content**: newsletter issue badge zero-padding normalized to
  match the shared 2-digit convention.
- **bug**: dead `yushakobo.jp` vendor citation swapped for the live
  `shop.yushakobo.jp` storefront.
- **data**: QK75 board's vendor misattribution fixed — added the
  missing `data/vendors/qwertykeys.json` record, corrected
  `vendorSlug`, fixed one article's prose.
- **data**: last live group-buy record (`cannonkeys-mode-sonnet-r2`)
  flipped to closed past its endDate — all 13 group-buy records are
  now closed/shipped.
- **seo**: baseline security response headers added site-wide
  (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
  `Content-Security-Policy`).
- Five `/expand` passes (192-196) — 1 new candidate, 4 no-ops.

## Queues now

- **Build plan**: 0 pending phases (all shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending rows.
- **`plan/AUDIT.md`**: 1 open row (643 total, 642 `[x]`) — only the
  standing `[blocked-cloud-permission] [6.3]` `march.yml` crash-gate
  fix remains (unchanged, still stuck on the workflow-write
  permission wall). Both fresh rows carried over from yesterday's
  digest (`[needs-scoping] [3.5]` rapid-trigger sparkline,
  `[content] [4.2]` home-page group-buy widget) drained this window.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **65 days / 1377 commits stale** (up from 1353
  commits yesterday; day count holds at 65 since under 24h have
  elapsed since yesterday's snapshot). Unchanged diagnosis: cloud
  `/march` hard-skips `/critique` by design
  (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique gate diagnostic
  candidate is still standing, unpromoted.
- **`plan/PHASE_CANDIDATES.md`**: 14 pending rows (up from 13 —
  pass 192 filed a new `[6.5]` candidate: automated
  content-fact-vs-catalog numeric-spec audit, proposing
  `scripts/content-fact-audit.mjs` to mechanically catch the "article
  cites a wrong number" bug class that produced 5 near-identical
  fixes in a 15-commit window). Top incumbents: `/quiz/board` (6.5),
  Stale group-buy frontmatter/prose gate (6.5), Critique gate
  diagnostic (6.5), automated content-fact-vs-catalog audit (6.5,
  new), external link-rot survey (6.0), march.yml crash-issue gate
  `always()` fix (6.0), Parts catalog third data pass (5.5),
  `/compare/keycap-set` (5.5), Vitest coverage CI gate (5.5),
  ship-data mentionedParts rescan (5.5), Cloud loop workflow-push
  permission gap (5.5), Tracker 8-week editorial analysis (5.0),
  Accessory parts kind (5.0), Tracker topic history page (4.5).
  File's own header still records "Last oversight: 2026-05-23" — no
  promotions since.
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 11 open issues, unchanged in composition from
  yesterday — `#395` (cloud march crash-issue gate, blocked,
  companion to the AUDIT row above) plus 8 duplicate content-gap
  issues (#414-#416, #418-#422) from the pre-fix ship-content
  duplicate-issue loop, still awaiting a manual/oversight
  consolidation pass, plus `#437` (`triage:reviewed`, no action
  needed) and `#434` (`triage:needs-user` — Vercel webhook drop, see
  Needs you). 0 unlabeled — all issues opened this window
  (#473-#479, #481, #482) closed same-day when their fixes shipped.
- **Expand cadence**: pass 192 filed a candidate reacting to a real
  commit-pattern signal (5 numeric-fact fixes in 15 commits); passes
  193-196 then ran 4 consecutive no-candidate ticks. Not a mistuning
  signal on its own — every mechanical survey stayed clean and the
  queue is full (14 unpromoted rows), not empty.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all workspace packages (apps/web, apps/e2e,
  packages/content, data, seo, tokens, ui).
- `test:run` — green across all workspaces: 94 web-workspace test
  files / 613 tests, all other workspaces reported `Done` with no
  failures; benign jsdom "Not implemented: navigation" stderr noise
  on `MobileNav.test.tsx`, doesn't fail the test — same as prior
  digests.
- `test:scripts` — green, 161 tests / 59 suites (survey-script unit
  coverage: content-gap, crosslink, companion, stale-GB,
  newsletter-gap, OG-coverage, a11y-spec-coverage, tracker-linkage,
  article-parts-check, article-language-check).
- `data:validate` — green, 71 records walked, cross-refs resolve
  (18 switches, 10 keycap-sets, 9 boards, 10 vendors, 13 group-buys
  — all now closed/shipped, 11 trend weeks; 65 articles, 3
  newsletters outside the walked-record count).
- `build` — green, all 52 static/dynamic routes generated. The
  `generatedAt` timestamp bump in the three `*.generated.json`
  manifests was reverted before commit — build artifacts, not part
  of this tick's notes-only diff.
- `size` — green, homepage gzip 108.6 KB / 200 KB budget (flat).
- `e2e` — green, **1019/1019**. This leg exceeded the tool's 120s
  foreground default and was auto-moved to a tracked background
  process by the harness; waited on it to completion rather than
  proceeding — still a single blocking wait, not a backgrounded gate
  skip. Benign `NoFallbackError` stderr noise logged mid-run on
  `/trends/tracker/[week]` — confirmed this is the intentional
  `/trends/tracker/2099-W99` not-found probe in
  `apps/e2e/tests/a11y.spec.ts` (route has `dynamicParams = false`),
  not a regression; same as prior digests.
- `lighthouse` — no workflow named `lighthouse` exists in this repo
  (`gh run list --workflow lighthouse` errors "could not find any
  workflows named lighthouse"); nothing to report, same as every
  prior digest that's checked.
- `pnpm deploy:check` at HEAD (`e5f2629`) — deploy `READY`
  (`dpl_2LXceEtp`).

No red legs, no new AUDIT.md finding from this breadth check itself.

## Needs you

1. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 65 days / 1377 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months. The candidate already has a full diagnostic
   writeup and a proposed fix shape (resolve the AND/OR ambiguity
   between `march.md`'s Purpose section and its Step 2 body, add a
   trace log, manually re-baseline the header).
2. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until either the push credential gains "Workflows: write"
   or workflow-file changes move to a local/`/oversight`-only path.
3. **Standing, growing: the `/oversight` promotion backlog itself.**
   14 candidates pending (up from 13), unchanged promotion cadence
   since 2026-05-23, four now at 6.5 (`/quiz/board`, Critique gate
   diagnostic, stale group-buy frontmatter gate, and the new
   content-fact-vs-catalog audit). Not a code defect — the supply of
   well-diagnosed candidates keeps outpacing promotion.
4. **New: the content-fact-audit candidate is itself evidence of a
   real, recurring bug class.** Five separate "article cites a wrong
   number from the catalog/tracker" fixes shipped in a 15-commit
   window (Oil King spring weight ×2, W21 hall-effect score ×2, HMX
   Cloud actuation weight ×1), plus a sixth adjacent one-level-up
   variant (a stale product-age claim). The proposed
   `scripts/content-fact-audit.mjs` survey would catch this
   mechanically instead of one Explore-agent sweep at a time — worth
   prioritizing given the fix rate.
5. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (#414-#416, #418-#422) from the pre-fix ship-content
   duplicate-issue loop are still open — each still names a genuine
   unwritten deep-dives topic (not a shipped duplicate), so closing
   them would discard real content backlog rather than being pure
   hygiene. A manual review pass would still tidy the tracker.
6. **Unchanged from prior digests: Vercel silently dropped the
   deploy for commit `e312e09`** (2026-07-10, issue `#434`,
   `triage:needs-user`). Every commit before and after deployed
   normally (confirmed again this tick — HEAD `e5f2629` deployed
   `READY` per `deploy:check`); self-resolved for subsequent commits,
   but worth a look at the GitHub → Vercel webhook configuration if
   it recurs.

## Today's intent

No pending build-plan phase, no data backlog, content-gap queue
empty (both pillars comfortable — every content-gap survey this
window came back clean). `plan/AUDIT.md` is down to its single
standing blocked row, so the next `/iterate` tick will run a fresh
audit sweep rather than draining a queued finding — expect another
isolated fact-check or hygiene fix in the same shape as this
window's nine. `/quiz/board`, the stale group-buy frontmatter/prose
gate, the Critique gate diagnostic, and the new content-fact-audit
survey remain the four highest-scored Pending candidates, all still
awaiting `/oversight` promotion — the queue has only grown since the
last promotion on 2026-05-23.

## Tuning proposals

None this pass. No new mistuned-gate signal in the window beyond
what's already filed: the three live gaps (critique staleness, cloud
workflow-push permission, and the numeric-fact-audit gap) all have
standing `plan/PHASE_CANDIDATES.md` rows — the third was filed by
`/expand` pass 192 itself during this window, exactly the meta-loop
behavior this step exists to encourage, so restating it under
**Needs you** rather than re-filing a duplicate candidate. The
window's nine fixes are ordinary `/iterate` findings, not
gate-mistuning signals.
