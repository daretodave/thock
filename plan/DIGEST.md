# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Spec 10 fully drained, spec 11 chunked and ready to build, two content-gap articles shipped end to end, and the loop's first full-corpus stale-`updatedAt` sweep just quadrupled the real AUDIT backlog.** Since the last digest (`e14dd649`, 2026-11-18T19:27:40Z): a cloud tick auto-promoted spec 11 (`e13816dc`, the march.yml dispatch-summary one-liner, aged out of a 67-day-old candidate), then the next tick released + chunked spec 10 (Stale-`updatedAt` mechanical check, `cda0a5ab`/`7f92e724`) and two chained ticks built and closed it — chunk 10.1 (`7401df32`→`1c7e1ec7`, the `stale-updated-at-check.mjs` script + fixtures) and chunk 10.2 (`dcc8983b`→`2436ae90`, wiring it into the survey chain and this very skill's breadth checks), fully draining spec 10. A later tick ran the content-gap pipeline for the trends pillar, shipping "Mode's vendor score broke its six-week lull — on news about a different board's mounting system" (`9e9fdf73`/`006d3fa7`, closes `#1088`). The 19:01 UTC tick then ran the newly-wired `stale-updated-at-check.mjs` across the full 97-article corpus for the first time (`93359b71`) — it filed **97** new `[seo] [5.4]` AUDIT rows (one per article whose `updatedAt` predates the last commit that actually changed its body or frontmatter), by far the largest single-tick AUDIT filing this project has seen. Overnight, a tick released + chunked spec 11 (`03927e4a`/`ed0de5df`), critique pass 20 ran (`dd86c217`, 1 new `[LOW]` finding on `/compare/switch`'s suggestion pairing), and this evening's tick ran the content-gap pipeline again for the newsletter pillar, shipping "thock weekly — issue 15" (`c4cb5464`/`327508be`, closes `#1091`). Tonight's own breadth pass is fully green: `pnpm verify` run as sequential foreground legs — typecheck, lint, unit tests (1341 total across workspaces), `test:scripts` (504/504), `data:validate` (96 records), build, size (all 6 budgeted routes under budget) — plus the full-corpus `SMOKE_SAMPLE=full pnpm e2e` (1766/1766, 9.5m, every canonical URL, doubling as both the verify gate's e2e leg and the nightly breadth leg). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, and `truncation-call-site-check.mjs --write` all came back clean — every mismatch each found (including all 97 of tonight's stale-`updatedAt` rows) was already filed; zero new AUDIT rows from this run. `pnpm deploy:check` confirmed `READY` at HEAD before this tick started.

**Standing:** the `pulse.mjs` `pendingSection()` AUDIT-undercount bug (filed 2026-11-09, score 4.0) is now off by two orders of magnitude — real unresolved AUDIT rows are **131** (1 `[needs-user-call]` Pending row + 130 unchecked `### [ ]` Open findings, dominated by tonight's 97-row stale-`updatedAt` batch) against pulse's still-reported "1 pending." Added an update note with tonight's number; not re-filed or re-scored, per the meta-loop rail. The held-line-counter bug (filed 2026-11-16, score 3.2) happens to read correctly tonight — `promote.mjs sweep` confirms zero Held lines exist right now (spec 11 was released and chunked, nothing is currently waiting out a veto window) — so pulse's "0 held" is accidentally accurate this instance, not a fix; noted on the candidate without re-scoring.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-18 19:27 | *(last digest committed, `e14dd649`)* | baseline |
| 2026-11-18 19:54 → 20:12 | cloud `march` (scheduled) | **shipped** — depth promotion: auto-promoted spec 11 (veto until 2026-11-19) |
| 2026-11-18 20:12 → 2026-11-19 01:40 | *(no scheduled fire logged)* | **quiet** — ~5.5h gap, no error signal |
| 2026-11-19 01:40 → 01:56 | cloud `march` (scheduled) | **shipped** — veto sweep released spec 10; chunked spec 10 |
| 2026-11-19 01:56 → 02:37 | cloud `march` (chain) | **shipped** — chunk 10.1 (`stale-updated-at-check.mjs` script + fixtures) |
| 2026-11-19 02:37 → 03:04 | cloud `march` (chain) | **shipped** — chunk 10.2 (wired into survey chain + digest); spec 10 fully drained |
| 2026-11-19 03:04 → 09:49 | *(no scheduled fire logged)* | **quiet** — ~6.8h gap, no error signal |
| 2026-11-19 09:49 → 10:13 | cloud `march` (scheduled) | **shipped** — content-gap pipeline: trends article closing `#1088` |
| 2026-11-19 10:13 → 18:49 | *(no scheduled fire logged)* | **quiet** — ~8.6h gap, no error signal |
| 2026-11-19 18:49 → 19:04 | cloud `march` (scheduled) | **shipped** — survey chain: newsletter cadence check + stale-`updatedAt` corpus sweep (97 new AUDIT rows) |
| 2026-11-19 19:04 → 2026-11-20 00:59 | *(no scheduled fire logged)* | **quiet** — ~5.9h gap, no error signal |
| 2026-11-20 00:59 → 01:15 | cloud `march` (scheduled) | **shipped** — veto sweep released spec 11; chunked spec 11 |
| 2026-11-20 01:15 → 01:46 | cloud `march` (chain) | **quiet** — no commits |
| 2026-11-20 01:46 → 08:21 | *(no scheduled fire logged)* | **quiet** — ~6.6h gap, no error signal |
| 2026-11-20 08:21 → 08:41 | cloud `march` (scheduled) | **shipped** — critique pass 20 (1 new `[LOW]` finding) |
| 2026-11-20 08:41 → 17:29 | *(no scheduled fire logged)* | **quiet** — ~8.8h gap, no error signal |
| 2026-11-20 17:29 → 17:51 | cloud `march` (scheduled) | **shipped** — content-gap pipeline: newsletter issue 15 closing `#1091` |
| 2026-11-20 17:51 → (now) | night (this tick) | in progress |

Since the last digest: **19 commits shipped**, all via cloud `march` (10 workflow runs, 9 of which shipped; 1 quiet chain), 0 local owner commits, 1 spec closed (10, fully drained), 1 spec chunked and queued (11), 2 new articles (both content-gap fills), 1 critique pass (1 new finding), 97 new AUDIT rows filed by a single generator's first full-corpus run, 2 issues closed same-tick as opened (`#1088`, `#1091`), 0 failed ticks, 0 reverts.

## Shipped

- `e13816dc` — plan: depth promotion auto-promoted spec 11 (`.github/workflows/march.yml`'s dispatch-summary one-liner), veto until 2026-11-19.
- `cda0a5ab` / `7f92e724` — veto sweep released spec 10 (Stale-`updatedAt` mechanical check); chunked.
- `7401df32` → `1c7e1ec7` (3 commits) — chunk 10.1 shipped: `stale-updated-at-check.mjs` + fixture tests.
- `dcc8983b` → `2436ae90` (3 commits) — chunk 10.2 shipped: wired the new check into the survey chain and `/digest`'s own breadth checks. Spec 10 (Stale-`updatedAt` mechanical check) is now fully drained from `plan/README.md`.
- `6e8f254e` / `9e9fdf73` / `006d3fa7` — content-gap pipeline: trends article "Mode's vendor score broke its six-week lull — on news about a different board's mounting system" shipped, closing `#1088`.
- `93359b71` — audit: survey chain — newsletter-gap-survey filed 1 content-gap row; `stale-updated-at-check.mjs` ran across the full article corpus for the first time since chunk 10.2 wired it in, filing **97** `[seo] [5.4]` rows where an article's `updatedAt` predates the last commit that changed its body or other frontmatter.
- `03927e4a` / `ed0de5df` — veto sweep released spec 11; chunked. 1 chunk ready for the next dispatcher tick.
- `dd86c217` — critique: pass 20 — 1 new `[LOW]` finding (`/compare/switch`'s "OR TRY A PAIR" suggestions daisy-chain the same switch across adjacent rows).
- `bf0d48ee` / `c4cb5464` / `327508be` — content-gap pipeline: newsletter "thock weekly — issue 15" shipped, closing `#1091`.
- Tonight's breadth pass: `pnpm verify` run as sequential foreground legs — typecheck, lint, `test:run` (1341 tests across 9 workspace projects), `test:scripts` (504/504), `data:validate` (96 records, cross-refs resolve), `build`, `size` (all 6 budgeted routes under budget) — plus `SMOKE_SAMPLE=full pnpm e2e` (1766/1766, 9.5m, every canonical URL — this run doubles as both the verify gate's e2e leg and the nightly full-breadth leg). `content-fact-audit.mjs --write`, `article-internal-consistency-check.mjs --write`, `group-buy-article-staleness-check.mjs --write`, `truncation-call-site-check.mjs --write` all clean — every mismatch found (incl. all 97 stale-`updatedAt` rows) already pending in `plan/AUDIT.md`; zero new rows filed by tonight's run. `pnpm deploy:check` confirmed `READY` at HEAD before this tick's breadth pass began.

## Queues now

**plan:** 1 spec (11, march.yml dispatch-summary one-liner), 1 chunk ready, 0 held. Spec 10 fully drained this window.
**audit:** 131 total unresolved rows by hand count (1 `[needs-user-call]` `[HIGH]` Pending row, 130 `### [ ]` rows under `## Open findings`: 97 `[seo] [5.4]` stale-`updatedAt` rows filed tonight's window, 18 `[cross-links] [4.5]`, 9 `[content] [3.6]`, 1 `[a11y] [3.5]`, 1 `[seo] [2.7]`, 2 `[content]/[data] [2.4]`, 1 `[seo] [2.0]`, 1 `[seo] [1.8]`) — up from 31 two digests ago, ~131x off pulse's own undercounted "1 pending" (standing, unpromoted 2026-11-09 candidate, now updated with tonight's count).
**critique:** 9 pending, last pass 0d ago (pass 20, 2026-11-20T08:40Z at commit `ed0de5df`) — fresh this window, unlike the prior two digests' stale read.
**candidates:** 11 pending (5 `>21d`, oldest 111d) — 1 promoted this window (spec 11, score 6.5, 67 days old). `node scripts/plan/promote.mjs sweep` → `clean` (0 Held lines exist right now — auto-promoted none, 0 awaiting). `node scripts/plan/promote.mjs cuts --since 2026-11-18` → none.
**Improve:** `bold` · overrides: Research 3d.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout — same standing gap noted every prior digest.
**data/BACKLOG.md:** 0 pending (4 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `support.mjs digest` reports 0 open user issues, so nothing crosses `escalate_days` by that definition.
- **`[needs-user-call]` — `#1068`** (GH_TOKEN/GITHUB_TOKEN invalid in march.yml, masking triage/critique gh checks): opened 2026-11-07T01:52Z, now ~13.7d old — still open, still `triage:needs-user`. Needs an owner call on push-credential strategy — a repo-secret decision the loop can't make unilaterally. Locked (`issue-1068-credential-call`, since 2026-11-12, until owner comments or closes #1068, max_age 14d — expires 2026-11-26).
- **oversight needed: candidate queue silting (5 pending >21d, oldest 111d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04.
- No motion-stalled alert — shipped 10 last full week (2026-W46) vs. 16.25 baseline (floor 8.13, reads `ok`); 11 shipped so far in 2026-W47, already past the floor.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).
- **Standing item, unchanged:** critique's `[HIGH]` `/trends/tracker` Sleeper/Faller-magnitude mismatch is still unaddressed, still has no GitHub issue filed. Re-observed pass 19, unchanged by pass 20 (which found one unrelated `[LOW]`).
- **Standing item, unchanged:** critique's `[HIGH]` `/group-buys` finding — the page's "Active group buys" lede is never true while every group-buy record is closed — is still unaddressed, still has no GitHub issue filed.
- **New, worth watching, not yet an oversight call:** tonight's stale-`updatedAt` corpus sweep filed 97 same-score (`5.4`) rows in one tick — a one-time backlog spike from a first-ever full-corpus run, not a recurring drip. Each is a trivial one-line frontmatter-date bump, but 97 of them now outrank everything else in the AUDIT queue by score. Worth watching over the next few digests whether `/iterate`'s per-tick throughput clears this spike at a reasonable rate without starving the `[cross-links]`/`[content]` categories (or the two standing `[HIGH]` critique findings above, which carry no score in this queue and could get crowded out further). No candidate filed for this yet — one data point, not a pattern.

## Today's intent

Spec 11's 1 ready chunk (the march.yml dispatch-summary one-liner) is next up — small and mechanical, should close in a single tick. After that, the AUDIT queue is dominated by tonight's 97 `[seo] [5.4]` stale-`updatedAt` rows (mechanical frontmatter-date bumps), then the 18 `[cross-links] [4.5]` rows, then the 9 `[content] [3.6]` rows (numeric-citation mismatches + present-tense group-buy copy), then critique's two unscored `[HIGH]` findings (the `/trends/tracker` Sleeper/Faller mismatch and the `/group-buys` "active buys" lede contradiction — neither has a filed issue, both worth a deliberate pick even though the AUDIT queue's raw scores would bury them under the stale-`updatedAt` batch), then the smaller legacy rows (`[a11y] [3.5]` contrast sweep, `[seo] [2.7]`/`[2.0]` hero-art layout drift, `[content]/[data] [2.4]`, `[seo] [1.8]` duplicate favicon).

## Tuning proposals

No new candidate filed tonight — added update notes to two still-unpromoted candidates with tonight's fresh numbers, neither re-scored:
- The `pulse.mjs` `pendingSection()` AUDIT-undercount candidate (score 4.0, filed 2026-11-09): real unresolved-row count is now 131, up from 31 two digests ago — the gap widened sharply this window because tonight's 97-row stale-`updatedAt` filing landed in the same section pulse undercounts.
- The `pulse.mjs` held-line-counter candidate (score 3.2, filed 2026-11-16): tonight pulse's "0 held" happens to be correct — `promote.mjs sweep` confirms zero Held lines exist right now — so this instance doesn't reproduce the bug; noted for continuity, not evidence against the fix.

Both are small, low-risk script edits already scoped in their respective rows; `/oversight` promotes.
