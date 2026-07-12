# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet, clean maintenance window — 14 shipped `/iterate` fixes (one
a real feature: newsletter detail pages), five `/expand` no-op
passes, zero red legs.** Since yesterday's digest (`8c4b4e4`), the
loop shipped a steady stream of small, well-scoped defects: a
misattributed citation (`140cba4`), two quiz-scoring bugs — a
`startsWith('linear')` under-scoring bug and a missing lower bound on
medium spring-weight (`edea2c0`, `dc31421`) — a part-detail
pluralization typo (`3554e90`), a `compare/board` raw-slug leak
(`50f2938`), a part-detail vendor byline pointing at `/sources`
instead of the vendor page (`0381de3`), a dead-code removal
(`PageStub`, unused since phase 16, `6290c3a`), a vendor
country-label gap (`FR` → France, `fa4cb79`). The one substantial
ship: **newsletter digest detail pages** — `/newsletter/[slug]`
(`6d7568b`) — three previously-unreachable published issues (each
with a full MDX body already loaded, never linked) now have real
routes; three fast-follow fixes landed on that brand-new surface in
the same window: missing JSON-LD `image` field (`0885d86`), a W25
tracker-delta miscalculation in issue 001 (`5b8c2e2`), and an OG card
that rendered "Issue 03" as the giant headline instead of the actual
title (`8195409`). Two more standalone fixes closed the window:
tracker archive pages no longer claim "this week" for months-old
snapshots (`cc2b97c`), and numeric tag slugs (`/tag/65`, `/tag/75`)
now render "#65%"/"#75%" instead of a bare ambiguous number
(`52455a3`). Five `/expand` passes (175-179) filed 0 new candidates
— the 13-row `plan/PHASE_CANDIDATES.md` queue is unchanged, still
awaiting `/oversight` promotion. Full breadth `pnpm verify` is green
top to bottom, run fresh this tick as sequential foreground legs
(995/995 e2e, homepage bundle flat at 108.5 KB / 200 KB). Deploy is
`READY` at HEAD (`7e0fe3d`). `plan/CRITIQUE.md` is now **63 days /
1295 commits** since its last pass — unchanged diagnosis, still the
standing item to resolve. No new GitHub issues since yesterday; the
Vercel webhook-drop issue (`#434`) and the 8 duplicate content-gap
issues remain open, unchanged.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-11 11:50 | iterate | content — plate-materials-explained citation misattribution fix (`140cba4`), audit `b3b7917` |
| 07-11 12:35 | iterate | fix — quiz `startsWith('linear')` under-scoring bug (`edea2c0`), audit `45534ca` |
| 07-11 13:48 | iterate | fix — quiz medium spring-weight scoring missing lower bound (`dc31421`), audit `6ed0fde` |
| 07-11 14:34 | expand | pass 175 — no candidates |
| 07-11 16:33 | expand | pass 176 — no candidates |
| 07-11 17:45-17:46 | iterate | fix — part detail page "all switchs" pluralization typo (`3554e90`), audit `a069f1e` |
| 07-11 18:34-18:35 | iterate | fix — compare/board vendor row raw slug instead of name (`50f2938`), audit `7828142` |
| 07-11 19:41-19:42 | iterate | fix — part detail vendor byline linked to `/sources` instead of vendor page (`0381de3`), audit `70df509` |
| 07-11 20:24 | expand | pass 177 — no candidates |
| 07-11 21:33 | iterate | refactor — remove dead `PageStub` component, unused since phase 16 (`6290c3a`), audit `1c011a6` |
| 07-11 22:36-22:37 | iterate | fix — vendor country label FR → France (`fa4cb79`), audit `5e447e8` |
| 07-11 23:37 | expand | pass 178 — no candidates |
| 07-12 01:05 | iterate | feat — newsletter digest detail pages `/newsletter/[slug]` (`6d7568b`), audit `5aef49b` |
| 07-12 01:53 | iterate | seo — newsletter JSON-LD missing `image` field (`0885d86`), audit `8445818` |
| 07-12 03:19-03:20 | iterate | content — newsletter 001 W25 tracker-delta miscalculation fix (`5b8c2e2`), audit `eed7113` |
| 07-12 07:14 | expand | pass 179 — no candidates |
| 07-12 08:04 | iterate | fix — tracker archive stale-tense copy (`cc2b97c`), audit `5ec2cfa` |
| 07-12 09:03-09:06 | iterate | seo — newsletter OG card headline shows real title, not "Issue NN" (`8195409`), audit `25912d6` |
| 07-12 09:52-09:53 | iterate | fix — tag page numeric-slug chrome "#65%"/"#75%" (`52455a3`), audit `7e0fe3d` |

33 commits total in the window; every `march`-workflow run in the
last 30 (going back to 07-11 01:34) reports `success` at the GitHub
Actions level.

## Shipped

- **content**: plate-materials-explained — citation misattributed
  to an unrelated geekhack thread, fixed.
- **engineering**: quiz — `startsWith('linear')` bug silently
  under-scored silent-linear switches; medium spring-weight scoring
  had no lower bound. Two separate, previously-unnoticed scoring
  bugs in the same recommender, same tick window.
- **engineering**: part detail page — "all switchs" pluralization
  typo; vendor byline linked to `/sources` instead of the vendor
  page.
- **engineering**: compare/board — vendor row rendered a raw slug
  instead of the resolved name.
- **engineering**: dead-code removal — `PageStub` component, unused
  since phase 16's stub-to-real-page replacement.
- **engineering**: vendor country label — `FR` rendered the raw code
  instead of "France" on `/vendors` and `/vendor/deltakeyco`.
- **feat**: `/newsletter/[slug]` — three published newsletter
  issues, previously unreachable (rendered `slug` only as a React
  key, never an `href`), now have real detail routes with JSON-LD,
  OG cards, and sitemap entries.
- **seo**: newsletter JSON-LD missing `image` field on every issue —
  a regression of a previously-fixed bug class, in the brand-new
  route shipped this same window.
- **content**: newsletter issue 001 — W25 tracker-delta miscalculation
  ("up eight points" when the spark data showed 24).
- **seo**: newsletter OG cards rendered "Issue 03" as the giant
  headline instead of the actual title — every social share of every
  issue looked generic next to article shares until this fix.
- **fix**: tracker archive pages no longer say "this week" /
  "actually rising this week" for snapshots up to 8+ weeks stale — 9
  indexed, sitemap-listed archive pages affected.
- **engineering**: tag page chrome — numeric-only slugs (`/tag/65`,
  `/tag/75`) rendered a bare ambiguous number as the H1/lede instead
  of "#65%"/"#75%"; the machine-readable surfaces (title, JSON-LD, OG)
  already had this right from a prior tick.
- Five `/expand` passes (175-179) — 0 new candidates; the 13-row
  Pending queue is unchanged.

## Queues now

- **Build plan**: 0 pending phases (51/51 shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending, unchanged.
- **`plan/AUDIT.md`**: 1 open row — the standing
  `[blocked-cloud-permission] [6.3]` `march.yml` crash-gate fix
  (unchanged, still stuck on the workflow-write permission wall; the
  two-line `always()` fix is written and verified, just unpushable
  from cloud). All other rows closed (613 total rows in the file, 612
  `[x]`).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **63 days / 1295 commits stale** (up from 61
  days / 1261 commits two digests ago). Unchanged diagnosis: cloud
  `/march` hard-skips `/critique` by design
  (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique gate diagnostic
  candidate is still standing, unpromoted.
- **`plan/PHASE_CANDIDATES.md`**: 13 pending rows, unchanged for the
  fifth straight digest. Top incumbents: `/quiz/board` (6.5), Stale
  group-buy frontmatter/prose gate (6.5), Critique gate diagnostic
  (6.5), external link-rot survey (6.0), march.yml crash-issue gate
  `always()` fix (6.0), Parts catalog third data pass (5.5),
  `/compare/keycap-set` (5.5), Vitest coverage CI gate (5.5),
  ship-data mentionedParts rescan (5.5), Cloud loop workflow-push
  permission gap (5.5), Tracker 8-week editorial analysis (5.0),
  Accessory parts kind (5.0), Tracker topic history page (4.5). Most
  recent `/oversight` activity recorded in the file: 2026-06-14
  (batch-promoted phases 46-49, a different, now-resolved candidate
  cluster) — 28 days ago, and it did not touch any of these 13 rows.
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 11 open issues, unchanged from yesterday — `#395`
  (cloud march crash-issue gate, blocked, companion to the AUDIT row
  above) plus 8 duplicate content-gap issues (#414-#416, #418-#422)
  from the pre-fix ship-content duplicate-issue loop, still awaiting
  a manual/oversight consolidation pass, plus `#437`
  (`triage:reviewed`, no action needed) and `#434`
  (`triage:needs-user` — Vercel webhook drop, see Needs you). 0
  unlabeled.
- **Expand cadence**: 28 consecutive no-candidate passes since the
  last candidate was filed (pass 151, 2026-06-19; passes 152-179 have
  filed 0). Not a mistuning signal on its own — the queue is full (13
  unpromoted rows), not empty; expand correctly isn't re-proposing
  what's already filed and awaiting `/oversight`.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as sequential blocking legs
(typecheck → test:run → test:scripts → data:validate → build → size →
e2e) — all green:

- `typecheck` — green, all 8 workspace packages (apps/web, apps/e2e,
  packages/content, data, seo, tokens, ui).
- `test:run` — green, 94 test files / 596 tests (apps/web workspace;
  benign jsdom "Not implemented: navigation" stderr noise on
  `MobileNav.test.tsx`, doesn't fail the test — same as prior
  digests).
- `test:scripts` — green, 161/161 (59 suites).
- `data:validate` — green (69 records: 9 vendors, 18 switches, 10
  keycap-sets, 9 boards, 13 group-buys, 10 trend weeks — cross-refs
  resolve).
- `build` — green, all routes generated, no manifest churn issues
  (the generated manifest/search-index files picked up a
  `generatedAt` timestamp diff from the build step and were reverted
  before commit — no source change).
- `size` — green, homepage gzip 108.5 KB / 200 KB budget (unchanged).
- `e2e` — green, **995/995**. Benign `NoFallbackError` stderr noise
  logged mid-run on `/trends/tracker/[week]` for non-generated week
  params (expected fallback-404 behavior, same as prior digests) —
  did not fail any test.
- `lighthouse` — still `disabled_manually` (since 2026-06-14); no new
  signal this tick.
- `pnpm deploy:check` at HEAD (`7e0fe3d`) — deploy `READY`
  (`dpl_Cp6Bckgq`).

No red legs, no new AUDIT.md finding from this breadth check.

## Needs you

1. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 63 days / 1295 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the gap widened by another two days /
   34 commits since the last digest. The candidate already has a
   full diagnostic writeup and a proposed fix shape (resolve the
   AND/OR ambiguity between `march.md`'s Purpose section and its
   Step 2 body, add a trace log, manually re-baseline the header).
2. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until either the push credential gains "Workflows: write"
   or workflow-file changes move to a local/`/oversight`-only path.
3. **Standing: the `/oversight` promotion backlog itself.** 13
   candidates pending, unchanged for the fifth straight digest,
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
5. **Unchanged from yesterday: Vercel silently dropped the deploy for
   commit `e312e09`** (2026-07-10, issue `#434`,
   `triage:needs-user`). Every commit before and after deployed
   normally (confirmed again this tick — HEAD `7e0fe3d` deployed in
   0s per `deploy:check`); self-resolved for subsequent commits, but
   worth a look at the GitHub → Vercel webhook configuration if it
   recurs.

## Today's intent

No pending build-plan phase, no data backlog, cross-link drain and
content-gap queue both empty. Expect more single-fix `/iterate`
maintenance ticks — the corpus is clean per every mechanical survey
as of pass 179. `/quiz/board`, the stale group-buy frontmatter/prose
gate, and the Critique gate diagnostic remain the three highest-scored
Pending candidates, all still awaiting `/oversight` promotion — the
queue hasn't moved in five digests running. One live thread worth
watching: the newsletter surface shipped this window (`6d7568b`) drew
three fast-follow fixes in the same ~9 hours (JSON-LD image, tracker
delta, OG headline) — the freshest-shipped surface is still the most
likely place for the next finding, same pattern as prior digests.

## Tuning proposals

None this pass. No new mistuned-gate signal in the window: the two
live gaps this digest surfaces (critique staleness, cloud
workflow-push permission) both already have standing
`plan/PHASE_CANDIDATES.md` rows from earlier passes, unpromoted but
not newly worsened in a way that changes their shape — restating them
under **Needs you** rather than re-filing duplicate candidates. The
`/oversight` promotion-cadence gap (item 3 above) is also not filed
as a new candidate: it's a call about the user's own review cadence,
not a loop mechanism the loop can propose fixing on itself.
