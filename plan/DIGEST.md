# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A high-throughput maintenance window interrupted by a ~4-hour
Claude API outage that also crashed yesterday's scheduled digest —
the loop self-healed with no residue and shipped 12 audit-drain
fixes anyway.** Since the last digest (`aad3c52`, 2026-07-15), the
loop landed 26 commits: 12 self-contained `/iterate` findings (bugs,
data corrections, content fixes — each opening and same-tick-closing
its own GitHub issue, #500-#512 with #504 unused), one refactor
(group-buy "ended" predicate deduped into one shared helper), and
one `/expand` pass (201 — no candidates, all 7 mechanical surveys
clean). Four consecutive `march` runs failed between 08:47-12:34 UTC
on 2026-07-16, every one `api_error_status: 403` — a transient
Claude API auth/rate outage, not a code defect. The same outage
crashed the scheduled 2026-07-16 `night`/digest run
(`29493393083`), which opened issue #499 (already correctly labeled
`bug`/`triage:needs-user`) and left `plan/DIGEST.md` unwritten for a
day — this tick fills that gap. The loop resumed cleanly at 13:33
UTC with no half-shipped commits and no dirty tree, and ran 20
straight green `march` ticks after that. This tick's full breadth
`pnpm verify` is green top to bottom, run fresh as seven sequential
foreground legs: 985 unit tests, 161 script tests, 72 data records
(cross-refs resolve), 1031/1031 e2e, homepage bundle flat at 108.6
KB / 200 KB. Deploy is `READY` at HEAD (`0a2411f`).
`plan/CRITIQUE.md` is now **68 days / 1422 commits** since its last
pass — unchanged diagnosis, still the standing item.
`plan/PHASE_CANDIDATES.md` sits at **15 pending rows** (up from 14),
unchanged promotion cadence since `2026-05-23` (55 days) — and this
window handed the content-fact-audit candidate two more concrete
instances of the exact bug class it was proposed to catch.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-16 09:41 | march | failure — `api_error_status: 403` |
| 07-16 10:39 | march | failure — `api_error_status: 403` |
| 07-16 11:09 | night/digest | failure — `api_error_status: 403`; opened issue #499, `plan/DIGEST.md` not written this day |
| 07-16 11:32 | march | failure — `api_error_status: 403` |
| 07-16 12:34 | march | failure — `api_error_status: 403` |
| 07-16 13:33 | march | success — no-op |
| 07-16 14:40 | march | success — no-op |
| 07-16 16:01 | iterate | fix — `/quiz/keycap-set` recommends sold-out/discontinued sets over available ones (`72bf68b`), audit `c6580fe`, closes #500 |
| 07-16 16:50-16:51 | iterate | fix — `/quiz/switch` had no discontinued-status filter, same bug class (`01460bf`), audit `d92ea93`, closes #501 |
| 07-16 18:01 | iterate | fix — Trends Tracker delta sign contradicted the direction arrow on 19 rows (`02caf48`), audit `c7ed677`, closes #502 |
| 07-16 19:51 | iterate | seo — search index now covers vendors, newsletters, and group buys, not just articles (`450d1a5`), closes #503 |
| 07-16 20:41-20:45 | iterate | refactor — group-buy "ended" predicate unified into one shared helper (`70c12ca`), audit `54b6883` |
| 07-16 21:44 | iterate | content — drop-holy-panda-x spring-delta comparators corrected against catalog data (`1230ec9`), audit `a401162`, closes #505 |
| 07-17 00:52 | iterate | data — add board `wooting-60he`, closing an 8-article citation gap (`9a999b9`), audit `8826abb`, closes #506 |
| 07-17 01:51 | iterate | data — `wooting-60he` `mentionedParts` backfilled into 2 articles (`1f638ea`), audit `d09ca10`, closes #507 |
| 07-17 03:37-03:38 | iterate | data — durock-t1 spring spec corrected 67g/70g → 55g/67g, article + 2 SVG labels rewritten (`5cd11fd`), audit `e8c3d9d`, closes #508 |
| 07-17 05:20-05:21 | iterate | content — drop-holy-panda-x-deep-dive `akko-v3-cream-blue-pro` `mentionedParts` gap closed (`7f4beaf`), audit `87917f1`, closes #509 |
| 07-17 06:54 | expand | pass 201 — no candidates |
| 07-17 08:08-08:18 | iterate | content — thock-weekly-003 lede miscounted Orca Echo tracker categories, three → two (`0973b56`), audit `4167e47`, closes #510 |
| 07-17 09:07 | iterate | content — building-mode-sonnet-with-oil-kings stale present-tense R2 group-buy language (`1579519`), audit `0c79852`, closes #511 |
| 07-17 10:46 | iterate | seo — `/tools` "Compare boards" card copy no longer promises a price comparison the schema doesn't have (`b84444d`), audit `0a2411f`, closes #512 |

26 commits total in the window. Of the last 24 `march`-workflow runs
since 07-16 09:00 UTC, 20 report `success` and 4 report `failure`
(all the same 403 outage); the 07-16 scheduled `night`/digest run
also failed to that outage.

## Shipped

- **bug**: `/quiz/keycap-set` recommender ranked sold-out/
  discontinued sets above available ones — added a status filter.
- **bug**: `/quiz/switch` had the identical missing discontinued-
  status filter — same bug class, fixed independently.
- **bug**: Trends Tracker delta sign contradicted the direction
  arrow on 19 rows — delta now follows direction, not the score's
  own sign.
- **seo**: search index now covers vendors, newsletters, and group
  buys, not just articles.
- **refactor**: group-buy "ended" predicate (`isGroupBuyEnded`)
  unified into one shared helper, replacing three independent
  copies across the codebase.
- **content**: drop-holy-panda-x-deep-dive — Sapphire/Boba U4T
  spring-delta comparators corrected against catalog data; also
  swapped in Akko V3 Cream Blue Pro as the catalog's actual
  widest-delta tactile.
- **data**: added board `wooting-60he` (Wooting 60HE+), closing a
  citation gap named by 8 published articles.
- **data**: `wooting-60he` `mentionedParts` backfilled into
  `hall-effect-mainstream` + `optical-switches-explained`.
- **data**: durock-t1 spring spec corrected (67g/70g actuation/
  bottom-out was wrong; real spec is 55g/67g) — rewrote the
  article's comparative framing and two baked SVG text labels to
  match.
- **content**: drop-holy-panda-x-deep-dive — `akko-v3-cream-blue-
  pro` `mentionedParts` gap closed.
- **content**: thock-weekly-003 — lede miscounted Orca Echo tracker
  categories (claimed three, body/data support two).
- **content**: building-mode-sonnet-with-oil-kings — stale present-
  tense Mode Sonnet R2 group-buy language updated to past tense
  (buy closed 2026-07-15).
- **seo**: `/tools` "Compare boards" card copy no longer promises a
  price comparison the board schema/table doesn't deliver.
- One `/expand` pass (201) — no candidates, all 7 mechanical surveys
  clean.

## Queues now

- **Build plan**: 0 pending phases (all shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending rows.
- **`plan/AUDIT.md`**: 1 open row (662 total, 661 `[x]`) — only the
  standing `[blocked-cloud-permission] [6.3]` `march.yml` crash-gate
  fix remains (filed 2026-07-05, unchanged, still stuck on the
  workflow-write permission wall).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **68 days / 1422 commits stale** (up from 65
  days / 1377 commits at the 2026-07-15 digest). Unchanged
  diagnosis: cloud `/march` hard-skips `/critique` by design
  (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique gate diagnostic
  candidate is still standing, unpromoted.
- **`plan/PHASE_CANDIDATES.md`**: 15 pending rows (up from 14). Top
  incumbents, all at 6.5: `/quiz/board`, Stale group-buy
  frontmatter/prose gate, Critique gate diagnostic, Automated
  content-fact-vs-catalog numeric-spec audit — the last of these now
  has two fresh instances from this window (drop-holy-panda-x
  spring-delta, durock-t1 spring spec) on top of the 5-instance
  cluster that originally motivated it. File's header still records
  "Last oversight: 2026-05-23" (55 days) — no promotions since.
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 12 open issues (up from 11) — new: `#499` ("Night
  digest crashed: 2026-07-16T11:10:07Z", `bug`/`triage:needs-user`).
  Unchanged: `#395` (blocked `[6.3]` march.yml crash-issue gate,
  companion to the AUDIT row above), 8 duplicate content-gap issues
  (`#414-#416`, `#418-#422`) awaiting a manual consolidation pass,
  `#437` (`triage:reviewed`, no action needed), `#434`
  (`triage:needs-user` — Vercel webhook drop, see Needs you). 0
  unlabeled — every issue opened this window (`#500-#512`, minus
  `#504`) closed same-tick when its fix shipped.
- **Expand cadence**: pass 201 ran clean — all 7 mechanical surveys
  (content-gap, crosslink, group-buy-companion, group-buy-status,
  newsletter-gap, OG-coverage, a11y-spec-coverage) clear, no
  candidates filed. Not a mistuning signal — the candidate queue is
  full (15 unpromoted rows), not empty.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as seven sequential
blocking legs (typecheck → test:run → test:scripts → data:validate
→ build → size → e2e) — all green:

- `typecheck` — green, all 8 workspace packages (apps/web, apps/e2e,
  packages/content, data, seo, tokens, ui).
- `test:run` — green, 985 unit tests / 151 test files across all
  workspaces (628 web + 127 data + 38 seo + 31 ui + 152 content + 6
  e2e-fixtures + 3 tokens); benign jsdom "Not implemented:
  navigation" stderr noise on `MobileNav.test.tsx`, doesn't fail the
  test — same as prior digests.
- `test:scripts` — green, 161 tests / 59 suites (survey-script unit
  coverage).
- `data:validate` — green, 72 records walked, cross-refs resolve
  (18 switches, 10 keycap-sets, 10 boards, 10 vendors, 13 group-buys
  — all closed/shipped, 11 trend weeks; 66 articles, 3 newsletters
  outside the walked-record count).
- `build` — green, all canonical routes generated.
- `size` — green, homepage gzip 108.6 KB / 200 KB budget (flat).
- `e2e` — green, **1031/1031**. Benign `NoFallbackError` stderr
  noise mid-run on `/trends/tracker/[week]` — the intentional
  not-found probe (route has `dynamicParams = false`), not a
  regression.
- `lighthouse` — no workflow named `lighthouse` exists in this repo
  (`gh run list --workflow lighthouse` errors "could not find any
  workflows named lighthouse"); nothing to report, same as every
  prior digest that's checked.
- `pnpm deploy:check` at HEAD (`0a2411f`) — deploy `READY`
  (`dpl_EwZy3Kxd`).

No red legs, no new AUDIT.md finding from this breadth check itself.

## Needs you

1. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 68 days / 1422 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months.
2. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until either the push credential gains "Workflows: write"
   or workflow-file changes move to a local/`/oversight`-only path.
3. **Standing, growing: the `/oversight` promotion backlog itself.**
   15 candidates pending (up from 14), unchanged promotion cadence
   since 2026-05-23 (55 days). Four now sit at 6.5.
4. **Strengthened: the content-fact-audit candidate now has 7+ total
   instances of its target bug class.** This window added two more
   "article prose cites a wrong number from the catalog" fixes
   (drop-holy-panda-x spring-delta comparators, durock-t1 spring
   spec — the latter had already leaked into two baked SVG text
   labels before being caught) on top of the 5-instance cluster that
   originally motivated the `[6.5]` candidate. This is the strongest
   recurring-defect signal in the queue right now.
5. **One-off, self-resolved: the 2026-07-16 scheduled digest run
   crashed** (`api_error_status: 403`, issue `#499`, already
   correctly labeled `bug`/`triage:needs-user`) during the same
   ~4-hour Claude API outage that failed 4 consecutive `march`
   ticks (08:47-12:34 UTC). The loop resumed cleanly at 13:33 UTC
   with no half-shipped state; this tick fills the missing 07-16
   digest gap. Single occurrence, not yet a pattern — matches
   `/expand` pass 201's own assessment — but worth a glance if it
   recurs.
6. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (`#414-#416`, `#418-#422`) — unchanged, each still names a
   genuine unwritten deep-dives topic rather than a shipped
   duplicate, so closing them would discard real content backlog.
7. **Unchanged: Vercel silently dropped the deploy for commit
   `e312e09`** (2026-07-10, issue `#434`, `triage:needs-user`).
   Self-resolved for subsequent commits; this tick's `deploy:check`
   at HEAD (`0a2411f`) confirms `READY`.

## Today's intent

No pending build-plan phase, no data backlog, content-gap queue
empty (both pillars comfortable — every content-gap survey this
window came back clean). `plan/AUDIT.md` is down to its single
standing blocked row, so the next `/iterate` tick will run a fresh
audit sweep rather than draining a queued finding — expect another
isolated fact-check, data-correction, or hygiene fix in the same
shape as this window's twelve. `/quiz/board`, the stale group-buy
frontmatter/prose gate, the Critique gate diagnostic, and the
content-fact-audit survey remain the four highest-scored Pending
candidates, all still awaiting `/oversight` promotion — the queue
has only grown since the last promotion on 2026-05-23.

## Tuning proposals

None this pass. No new mistuned-gate signal beyond what's already
filed: the three live gaps (critique staleness, cloud workflow-push
permission, and the numeric-fact-audit gap) all have standing
`plan/PHASE_CANDIDATES.md` rows, and this window's two fresh
content-fact-audit instances are restated under **Needs you** above
rather than filed as a duplicate candidate. The digest-crash/API-
outage incident is a single occurrence per `/expand` pass 201's own
self-assessment ("one audit row = wait, multiple independent signals
= real") — not yet a gate-mistuning signal, just logged for the next
pass to watch. The window's twelve fixes are ordinary `/iterate`
findings, not gate-mistuning signals.
