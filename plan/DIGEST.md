# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean 24-commit, ~20.3h window — 20/20 `march` runs green, zero
crashes — that fully drained the `[cross-links] [4.5]` backlog to
zero for the first time in recent memory, closed out the standing
`[4.2]` deploy:check double-push finding, and this tick's own fresh
`pnpm verify` is green top to bottom again.** Since the last digest
(`c28bb22`, 2026-07-19T11:11 UTC) the loop landed 24 commits: 3
content-gap/Rule-2 dispatch cycles (each dispatch → article →
cross-link drain, closing #536/#537/#542), a self-contained fix for
the rapid-double-push Vercel webhook-drop bug (`350f623`, closes
#540 — the `[4.2]` AUDIT row standing since the prior digest), 1
`/ship-data` weekly trend snapshot (2026-W30) with its own
tracker-linkage survey filing fresh Rule 2 gaps, 1 `/triage` tick,
and 1 `/expand` pass (205, 0 candidates — all 7 mechanical surveys
ran clean). This tick's full breadth `pnpm verify` is green fresh,
run as five sequential foreground legs: typecheck all 8 workspaces,
664 web unit tests / 97 files, 161 script tests / 59 suites, 74 data
records (cross-refs resolve), homepage bundle flat at 108.6 KB / 200
KB, and **1061/1061 e2e** (up from 1040 — the +21 comes from the 3
new article pages plus their generated OG/JSON-LD routes). Deploy is
`READY` at HEAD (`c81c4f7`).

`plan/CRITIQUE.md` is now **70 days / 1497 commits** since its last
pass (11) — unchanged diagnosis, still growing, still the standing
item. `plan/PHASE_CANDIDATES.md` sits at **16 pending rows**
(unchanged), now **58 days** since the last promotion (2026-05-23).
A new `[4.0]` newsletter-cadence AUDIT row (issue #538) is open and
undrained — newsletter 004 is 8 days overdue against the 7-day
threshold. One duplicate-issue-backlog item got sharper this window:
#421 ("deep-dives — Gazzew Boba U4T deep-dive") is now a genuinely
stale duplicate — the article it names shipped this window under a
fresh dispatch issue (#537) instead of closing #421 itself.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-19 12:42-12:43 | ship-content | content — guides: "Keyboard cables, compared" (`4fcef08`), audit `0c16ff1`, closes #536 |
| 07-19 13:34 | content dispatch | opened issue #537 — deep-dives pillar hot pursuit (1 of ≥2 articles in 30d) |
| 07-19 13:59-14:00 | ship-content | content — deep-dives: "Why the Gazzew Boba U4T Rings Where the Boba U4 Stays Quiet" (`8dfe4fa`), audit `38d4dfc`, closes #537 |
| 07-19 14:31 | newsletter-gap-survey | auto-filed `[4.0]` newsletter-cadence row, issue #538 (`1219241`) |
| 07-19 15:36 | expand | pass 205 — 0 candidates filed, all mechanical surveys clean |
| 07-19 17:34-17:35 | iterate | cross-links — keyboard-cables-compared hub, 4 pairs drained (`ffb545e`, `6b5cfa2`) |
| 07-19 18:30 | iterate | cross-links — gazzew-boba-u4t-deep-dive hub, 3 pairs drained (`687c11c`, `09ab17a`), closes #539 |
| 07-19 19:29 | triage | 1 issue processed (1 queued) |
| 07-19 22:32 | iterate | cross-links — cannonkeys-blaine-v2-se-group-buy hub, 2 pairs drained (`833d611`, `b9b637c`), closes #541 |
| 07-19 23:34-23:35 | iterate | fix — batched fix+audit-tick commits into one push, closing the double-push webhook-drop bug (`350f623`), audit `d1835d6`, closes #540 |
| 07-20 00:49 | ship-data + survey | data — trend snapshot 2026-W30 (`8490c59`); tracker-linkage-survey filed fresh Rule 2 gaps (`54cf36b`) |
| 07-20 03:08 | content dispatch | opened issue #542 — trends Rule 2 tracker-linkage gap ("Prototypist") |
| 07-20 05:36-05:37 | ship-content | content — trends: "Prototypist and the multi-project vendor model" (`5d9baa9`), audit `053c050`, closes #542 |
| 07-20 07:29 | iterate | cross-links — prototypist-vendor-spotlight hub, 2 pairs drained (`226469f`, `c81c4f7`), closes #543 |

24 commits total in the window. Of the 20 `march`-workflow runs
since 07-19 11:11 UTC, all 20 report `success` — no crashes, no
half-shipped commits, no dirty tree at any point. The `night`
workflow's own last run before this one (07-19, digest `c28bb22`)
also reports `success`.

## Shipped

- **content**: guides — "Keyboard cables, compared: coiled,
  straight, and the connector that actually matters" (Rule 1
  hot-pursuit dispatch).
- **content**: deep-dives — "Why the Gazzew Boba U4T Rings Where the
  Boba U4 Stays Quiet" (Rule 1 hot-pursuit dispatch).
- **content**: trends — "Prototypist and the multi-project vendor
  model" (Rule 2 tracker-linkage dispatch — the vendor's non-flat
  tracker row had sat unlinked since 2026-W26).
- **cross-links**: 4 pairs drained for the keyboard-cables-compared
  hub, 3 for gazzew-boba-u4t-deep-dive, 2 for
  cannonkeys-blaine-v2-se-group-buy, 2 for
  prototypist-vendor-spotlight — **11 pairs total**, taking the
  `[cross-links] [4.5]` backlog to **zero pending rows** for the
  first time in recent digest history.
- **fix**: the standing `[4.2]` deploy:check double-push
  webhook-drop finding — `skills/iterate.md`, `ship-a-phase.md`,
  `ship-content.md`, and `march.md`'s two-commit shapes all now
  stage the trailing audit-tick commit locally and push once,
  closing #540 and dogfooding the fix in the same tick that shipped
  it.
- **data**: weekly trend snapshot `2026-W30` (14 rows); its own
  tracker-linkage survey ran same-tick and filed fresh Rule 2 gaps
  (drained same window via the Prototypist article above).

## Queues now

- **Build plan**: 0 pending phases (51 shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: **0 pending `[4.5]` rows** — fully drained
  this window (was 2 going in). First time this queue has hit zero;
  worth watching whether `article-crosslink-survey.mjs`'s
  empty-queue re-file path keeps it near zero or it refills fast as
  new content ships.
- **`plan/AUDIT.md`**: 4 open rows (702 total, 698 `[x]`), down from
  6 going into this window. Breakdown: the standing
  `[blocked-cloud-permission] [6.3]` march.yml crash-gate row
  (unchanged since 2026-07-05); the standing `[4.0]` Lighthouse-CI
  row (unchanged, confirmed still `disabled_manually`); the standing
  `[needs-user-call] [4.2]` soft-404-vs-not-found-UX row (unchanged);
  and 1 new `[4.0]` newsletter-cadence row (issue #538, filed
  2026-07-19T14:31, still open — newsletter 004 now 8 days overdue).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **70 days / 1497 commits stale**, up from 1472
  commits at the last digest. Unchanged diagnosis: the `[6.5]`
  Critique gate diagnostic candidate is still standing, unpromoted,
  now 17 days since it was filed (2026-07-03).
- **`plan/PHASE_CANDIDATES.md`**: 16 pending rows, unchanged count
  — no new candidates this window (`/expand` pass 205 filed 0). Four
  still tied at the top, all `[6.5]`: `/quiz/board`, Stale group-buy
  frontmatter/prose gate, Critique gate diagnostic, Automated
  content-fact-vs-catalog numeric-spec audit. File's header still
  records "Last oversight: 2026-05-23" — **58 days**, no promotions
  since.
- **`data/BACKLOG.md`**: 0 live pending rows (the 3 rows still
  listed under "Pending" are all already marked `[x]` — stale
  bookkeeping the file hasn't moved to "Done," unchanged from prior
  digests).
- **Triage**: 13 open issues, unchanged count (net: #540/#542/#543
  opened-and-closed within this window, #538 opened and still open).
  0 unlabeled. Two `triage:needs-user` issues still open and
  unresolved (see Needs you): `#434` (Vercel never ingested commit
  `e312e09`, 2026-07-10, now 10 days old) and `#499` (night digest
  crashed, 2026-07-16, now 4 days old). `#395` and `#437` are stable.
  8 duplicate content-gap issues (`#414-#416`, `#418-#422`) still
  await a manual consolidation pass — and `#421` specifically is now
  a *shipped* duplicate (see Headline), not just an unwritten one.
- **Expand cadence**: 1 pass this window (205, 0 candidates) — all 7
  mechanical surveys (content-gap, crosslink, group-buy-companion,
  group-buy-status, newsletter-gap, OG-coverage, a11y-spec-coverage)
  ran clean.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as five sequential blocking
legs (typecheck → test:run/test:scripts/data:validate → build → size
→ e2e) — all green:

- `typecheck` — green, all 8 workspace packages.
- `test:run` — green, 664 web unit tests (97 test files), unchanged
  count from last digest (no source changes this window, only
  content + `plan/` + skill-procedure edits).
- `test:scripts` — green, 161 tests / 59 suites (survey-script unit
  coverage).
- `data:validate` — green, 74 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 12
  trend weeks — trends 11→12 this window from the W30 snapshot).
- `build` — green, all canonical routes generated (70 articles, 3
  newsletters — articles 67→70 this window).
- `size` — green, homepage gzip 108.6 KB / 200 KB budget (flat).
- `e2e` — green, **1061/1061** (up from 1040). Benign
  `NoFallbackError` stderr noise mid-run on `/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  and `/newsletter/[slug]` — the intentional not-found probes on
  routes carrying `dynamicParams = false`, same as every prior
  digest, not a regression.
- `pnpm deploy:check` at HEAD (`c81c4f7`) — deploy `READY`
  (`dpl_F9YpakAc`).
- `lighthouse` — unchanged from last digest: `disabled_manually` per
  `gh api .../actions/workflows` (re-confirmed this tick), 98
  failures / 2 skips / 0 successes in its last 100 recorded runs.
  Already filed as `[4.0]` AUDIT.md row; no new signal this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Standing: Lighthouse CI has been disabled and failing for 5+
   weeks — `/oversight` call needed.** Unchanged since last digest.
   `.github/workflows/lighthouse.yml` is `disabled_manually` with
   98/100 recent runs failed, 0 successes. Filed `plan/AUDIT.md`
   `[4.0]`. Still the site's only automated a11y/perf/SEO regression
   gate, still dark.
2. **New: `#421` is a shipped duplicate, not just an unwritten one.**
   The deep-dives content-gap dispatch this window opened a fresh
   issue (#537) for "Gazzew Boba U4T deep-dive" and shipped it —
   but `#421`, filed 2026-07-08 with the identical topic, was never
   the one closed. Worth a manual close-as-duplicate pass on `#421`
   pointing at `#537`/`8dfe4fa`, separate from the other 7 duplicate
   issues that still name genuinely unwritten topics.
3. **Standing, growing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 70 days / 1497 commits since the last
   local `/critique` pass — the fresh-eyes loop has been dark for
   over two months, and the candidate diagnosing why has itself sat
   unpromoted for 17 days.
4. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged — the two-line
   `always()` fix is written and verified, just unpushable from
   cloud until the push credential gains "Workflows: write."
5. **Standing, growing: the `/oversight` promotion backlog.** 16
   candidates pending, unchanged count, but now **58 days** since
   the last promotion (2026-05-23). Four candidates sit at 6.5.
6. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (Vercel silently dropped the deploy for commit `e312e09`,
   filed 2026-07-10, 10 days old) and `#499` (night digest crashed,
   filed 2026-07-16, 4 days old). Neither self-resolved; both still
   await a human look.
7. **Housekeeping, low urgency: the newsletter cadence gap.** Issue
   #538 / AUDIT `[4.0]` row is open — thock weekly issue 004 is 8
   days overdue against the 7-day threshold. Autonomously actionable
   (`/ship-content` newsletter type) whenever it's next the top
   score; not blocked on a human.

## Today's intent

Next queued work: the `[4.0]` newsletter-cadence row (issue #538) is
now the top-scored autonomously-actionable open AUDIT item — the
next `/march` tick should dispatch `/ship-content` for a newsletter
weekly round-up (5 pillar picks + tracker insight). The other open
`[4.0]` row (Lighthouse CI) and the `[needs-user-call] [4.2]`
soft-404 row are both `/oversight`-gated, not loop-actionable. No
pending build-plan phase, no data backlog, no cross-link backlog for
the first time in recent memory. `/quiz/board`, the stale group-buy
frontmatter/prose gate, the Critique gate diagnostic, and the
content-fact-audit survey remain the four highest-scored
`PHASE_CANDIDATES.md` rows, all still awaiting `/oversight`
promotion.

## Tuning proposals

None this pass. The three live gate-mistuning signals (critique
staleness, cloud workflow-push permission, the now-58-day
promotion-cadence gap) all already have standing
`plan/PHASE_CANDIDATES.md` rows or are tracked in Needs You above;
this window's ordinary loop output (3 content dispatches, 1 data
tick, 1 triage tick, 1 clean expand pass, and a self-contained fix)
added no new signal beyond updated pulse numbers on what's already
on file. The cross-link backlog hitting zero is a positive signal,
not a mistuning — no action needed, just noted for next digest to
watch whether it refills.
