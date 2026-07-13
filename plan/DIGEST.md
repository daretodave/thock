# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet, clean maintenance window — 10 `/iterate` fixes, 2 `/expand`
no-op passes, one Monday tracker-snapshot cadence tick, and 2
content-gap articles shipped end to end (each closing its own
dispatch issue), zero red legs.** Since yesterday's digest
(`7a7b6d2`), the loop drained ten small well-scoped findings: an
a11y heading-order skip on vendor detail pages (`45b6b5e`), a quiz
rapid-double-click question-skip bug (`70f2be4`), a raw status-enum
leak on compare tables (`1335723`), a missing per-pillar RSS item
cap (`2b59ca8`), a hardcoded-URL bug in the quiz `WebApplication`
JSON-LD (`7ecbda9`), a compare-selector/URL desync on browser
back/forward (`534c826`), a WCAG AA contrast failure on the quiz
result rank badge (`86e9f7c`), new a11y test coverage for the
compare tool's populated state (`7e75910`), and two raw-anchor →
`next/link` fixes on `/group-buys` nav (`30cb04f`, `173d07e`) — five
of the ten closed their own GitHub issue (`#457`–`#461`, `#462`
closes on the sixth). Monday's cadence gate fired on schedule: a
fresh 2026-W29 trend snapshot (`cf89448`) plus a tracker
Rule-2-linkage survey pass (`5935172`, clean — no new gaps). Two
content-gap dispatches ran end to end: a News piece on Work Louder's
OpenAI-hardware macro pad (`e97be92`, closes `#463`) and a Trends
piece on the GMK CYL OG Extensions interest-check outpacing its live
group buys (`afd551d`, closes `#464`) — the second one immediately
filed 2 fresh same-pillar cross-link rows against itself
(`gmk-cyl-og-extensions-interest-check` ↔ `dcs-grass-valley-decline`
/ `dcs-olivetti-comeback`), the only Pending rows in `AUDIT.md`
besides the standing blocked `[6.3]` permission row. Two `/expand`
passes (180, 181) filed 0 new candidates. Full breadth `pnpm verify`
is green top to bottom, run fresh this tick as one foreground call
(1015/1015 e2e, homepage bundle flat at 108.6 KB / 200 KB). Deploy
is `READY` at HEAD (`3031eb0`). `plan/CRITIQUE.md` is now **64 days
/ 1326 commits** since its last pass — unchanged diagnosis, still
the standing item to resolve. No new GitHub issues beyond the two
content-dispatch opens (both closed same-day); the Vercel
webhook-drop issue (`#434`) and the 8 duplicate content-gap issues
remain open, unchanged.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-12 11:45 | iterate | a11y — vendor detail page skips heading level h1→h3 (`45b6b5e`), audit `042810f` |
| 07-12 12:57-12:58 | iterate | fix — quiz rapid double-click silently skips a question (`70f2be4`), audit `dd41bb1` |
| 07-12 13:47 | iterate | fix — compare tables render raw status enum instead of human label (`1335723`), audit `1d166e3` |
| 07-12 14:41 | expand | pass 180 — no candidates |
| 07-12 15:41 | iterate | fix — per-pillar RSS feeds had no item cap (`2b59ca8`), audit `22fde9b` |
| 07-12 16:29 | expand | pass 181 — no candidates |
| 07-12 17:32-17:45 | iterate | fix — quiz `WebApplication` JSON-LD hardcoded absolute URL (`7ecbda9`), audit `95bdbf9`, closes `#457` |
| 07-12 18:38-18:39 | iterate | fix — compare selectors desync from URL on browser back/forward (`534c826`), audit `037a19d`, closes `#458` |
| 07-12 19:52-19:54 | iterate | fix — quiz result rank badge fails WCAG AA color contrast (`86e9f7c`), audit `80dbf74`, closes `#459` |
| 07-12 20:41-20:42 | iterate | test — compare tool populated-state a11y coverage (`7e75910`), audit `93eab27`, closes `#460` |
| 07-12 21:36-21:39 | iterate | fix — group-buys coverage link uses next/link instead of raw anchor (`30cb04f`), audit `936a229`, closes `#461` |
| 07-12 23:33 | iterate | fix — group-buys archive nav links use raw anchor instead of next/link (`173d07e`), audit `92f6859`, closes `#462` |
| 07-13 00:56 | march (Monday gate) | data — trend snapshot 2026-W29 (`cf89448`); audit — tracker Rule 2 linkage survey, no gaps (`5935172`) |
| 07-13 01:39 | ship-content | dispatch opened issue `#463` (news content-gap) |
| 07-13 05:44 | ship-content | content — news: "OpenAI's first hardware is a Work Louder macro pad" (`e97be92`), audit `26f05c1`, closes `#463` |
| 07-13 07:12 | ship-content | dispatch opened issue `#464` (trends content-gap) |
| 07-13 11:56-11:57 | ship-content | content — trends: "GMK CYL OG Extensions is climbing faster than any GMK CYL group buy that's open" (`afd551d`), audit `3031eb0`, closes `#464` |

31 commits total in the window; every `march`-workflow run in the
last 30 (going back to 07-11 23:18) reports `success` at the GitHub
Actions level.

## Shipped

- **a11y**: vendor detail page — heading order skipped a level
  (h1 → h3), now h1 → h2.
- **engineering**: quiz — a rapid double-click on one question
  silently skipped the next question.
- **engineering**: compare tables — rendered the raw status enum
  value instead of the human-readable label.
- **engineering**: per-pillar RSS feeds — had no item cap, unlike
  the global feed.
- **seo**: quiz `WebApplication` JSON-LD — hardcoded an absolute URL
  instead of using `canonicalUrl`.
- **engineering**: compare tool — selectors desynced from the URL on
  browser back/forward navigation.
- **a11y**: quiz result rank badge — failed WCAG AA color contrast.
- **test**: compare tool populated state — new a11y coverage.
- **engineering**: `/group-buys` — two separate raw-anchor-instead-
  of-`next/link` findings (archive nav + coverage link), same bug
  class, different surfaces, drained same day.
- **data**: 2026-W29 trend snapshot (Monday cadence gate) + a clean
  tracker Rule-2-linkage survey pass (no unlinked-topic gaps).
- **content**: News — "OpenAI's first hardware is a Work Louder
  macro pad."
- **content**: Trends — "GMK CYL OG Extensions is climbing faster
  than any GMK CYL group buy that's open."
- Two `/expand` passes (180-181) — 0 new candidates.

## Queues now

- **Build plan**: 0 pending phases (all shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 2 pending rows, both fresh today — both
  involve the same hub article
  (`gmk-cyl-og-extensions-interest-check` ↔ `dcs-grass-valley-decline`
  and ↔ `dcs-olivetti-comeback`, same-pillar, score 4.5 each). Phase
  46's cluster-aware drain logic means the next `/iterate` tick that
  picks this up should clear both in one commit.
- **`plan/AUDIT.md`**: 3 open rows (627 total, 624 `[x]`) — the 2
  fresh cross-link rows above plus the standing
  `[blocked-cloud-permission] [6.3]` `march.yml` crash-gate fix
  (unchanged, still stuck on the workflow-write permission wall; the
  two-line `always()` fix is written and verified, just unpushable
  from cloud).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **64 days / 1326 commits stale** (up from 63
  days / 1295 commits yesterday). Unchanged diagnosis: cloud
  `/march` hard-skips `/critique` by design
  (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique gate diagnostic
  candidate is still standing, unpromoted.
- **`plan/PHASE_CANDIDATES.md`**: 13 pending rows, unchanged for the
  sixth straight digest. Top incumbents: `/quiz/board` (6.5), Stale
  group-buy frontmatter/prose gate (6.5), Critique gate diagnostic
  (6.5), external link-rot survey (6.0), march.yml crash-issue gate
  `always()` fix (6.0), Parts catalog third data pass (5.5),
  `/compare/keycap-set` (5.5), Vitest coverage CI gate (5.5),
  ship-data mentionedParts rescan (5.5), Cloud loop workflow-push
  permission gap (5.5), Tracker 8-week editorial analysis (5.0),
  Accessory parts kind (5.0), Tracker topic history page (4.5). Most
  recent `/oversight` activity recorded in the file: 2026-06-14
  (batch-promoted phases 46-49, a different, now-resolved candidate
  cluster) — 29 days ago, still hasn't touched any of these 13 rows.
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 11 open issues, unchanged in composition from
  yesterday — `#395` (cloud march crash-issue gate, blocked,
  companion to the AUDIT row above) plus 8 duplicate content-gap
  issues (#414-#416, #418-#422) from the pre-fix ship-content
  duplicate-issue loop, still awaiting a manual/oversight
  consolidation pass, plus `#437` (`triage:reviewed`, no action
  needed) and `#434` (`triage:needs-user` — Vercel webhook drop, see
  Needs you). 0 unlabeled — the two content-dispatch issues opened
  this window (`#463`, `#464`) both closed same-day when their
  articles shipped.
- **Expand cadence**: 30 consecutive no-candidate passes since the
  last candidate was filed (pass 151, 2026-06-19; passes 152-181
  have filed 0). Not a mistuning signal on its own — the queue is
  full (13 unpromoted rows), not empty; expand correctly isn't
  re-proposing what's already filed and awaiting `/oversight`.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as one blocking call
(typecheck → test:run → test:scripts → data:validate → build → size
→ e2e) — all green:

- `typecheck` — green, all workspace packages (apps/web, apps/e2e,
  packages/content, data, seo, tokens, ui).
- `test:run` — green, 94 web-workspace test files plus green runs
  across tokens (1), seo (5), data (19), ui (7), e2e-fixtures (1),
  content (24); benign jsdom "Not implemented: navigation" stderr
  noise, doesn't fail the test — same as prior digests.
- `data:validate` — green (manifest build reports 18 switches, 10
  keycap-sets, 9 boards, 9 vendors, 13 group-buys, 11 trend weeks,
  65 articles, 3 newsletters, 75 tags — cross-refs resolve).
- `build` — green, all 52 static pages generated, no manifest churn
  issues.
- `size` — green, homepage gzip 108.6 KB / 200 KB budget (flat).
- `e2e` — green, **1015/1015**. Benign `NoFallbackError` stderr
  noise logged mid-run on `/trends/tracker/[week]` for
  non-generated week params (expected fallback-404 behavior, same
  as prior digests) — did not fail any test.
- `lighthouse` — no workflow named `lighthouse` exists in this repo
  (confirmed via `gh workflow list`); nothing to report, same as
  every prior digest that's checked.
- `pnpm deploy:check` at HEAD (`3031eb0`) — deploy `READY`
  (`dpl_ELfPHA9Q`).

No red legs, no new AUDIT.md finding from this breadth check.

## Needs you

1. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 64 days / 1326 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the gap widened by another day / 31 commits
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
   candidates pending, unchanged for the sixth straight digest,
   three at 6.5 (`/quiz/board`, Critique gate diagnostic, stale
   group-buy frontmatter gate). Not a code defect — just a wide gap
   between candidate supply and promotion cadence. Worth a look next
   `/oversight` pass regardless of which specific candidates get
   promoted or rejected.
4. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (#414-#416, #418-#422) from the pre-fix ship-content
   duplicate-issue loop are still open — each still names a genuine
   unwritten deep-dives topic (not a shipped duplicate), so closing
   them would discard real content backlog rather than being pure
   hygiene. A manual review pass would still tidy the tracker.
5. **Unchanged from prior digests: Vercel silently dropped the
   deploy for commit `e312e09`** (2026-07-10, issue `#434`,
   `triage:needs-user`). Every commit before and after deployed
   normally (confirmed again this tick — HEAD `3031eb0` deployed
   `READY` per `deploy:check`); self-resolved for subsequent
   commits, but worth a look at the GitHub → Vercel webhook
   configuration if it recurs.

## Today's intent

No pending build-plan phase, no data backlog, content-gap queue
empty (both pillars that were cold this window got their articles).
The 2 fresh cross-link rows from the trends article are the only
immediately actionable AUDIT.md work — expect the next `/iterate`
tick to cluster-drain both in one commit per phase 46's hub-article
logic. `/quiz/board`, the stale group-buy frontmatter/prose gate,
and the Critique gate diagnostic remain the three highest-scored
Pending candidates, all still awaiting `/oversight` promotion — the
queue hasn't moved in six digests running. One live thread worth
watching: the new trends article filed cross-link findings against
itself within the same tick window it shipped in — same pattern as
prior digests where freshly-shipped surfaces are the most likely
source of the next finding.

## Tuning proposals

None this pass. No new mistuned-gate signal in the window: the two
live gaps this digest surfaces (critique staleness, cloud
workflow-push permission) both already have standing
`plan/PHASE_CANDIDATES.md` rows from earlier passes, unpromoted but
not newly worsened in a way that changes their shape — restating
them under **Needs you** rather than re-filing duplicate candidates.
The `/oversight` promotion-cadence gap (item 3 above) is also not
filed as a new candidate: it's a call about the user's own review
cadence, not a loop mechanism the loop can propose fixing on itself.
