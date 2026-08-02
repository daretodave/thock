# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A fully clean ~23.5h window — 22 `march` runs, 22/22 success,
20 substantive ticks and 2 pure no-ops, for 36 commits total.**
Since the last digest (`9a4882dd`, 2026-08-01T11:16:52 UTC) the loop
drained 16 `plan/AUDIT.md` findings across 14 issues (one cross-link
cluster closed 3 rows under a single issue): a copy fix (article
meta descriptions now fit the 160-char SERP truncation limit), six
separate list/card heading-semantics sweeps (catalog list pages,
`TrackerRow` mobile score label, trend-direction glyph sibling
surfaces, `/archive` article titles, part-kind index cards, quiz
results + compare tables, then 4 more surfaces caught in a
same-cycle follow-up sweep), a data fix (W31 Prototypist trend note
misattributed to CannonKeys), a new regression test (frontmatter
description 160-char boundary), an a11y fix (compare table `<dd>`
values now identified per switch/board for screen readers), one
Rule-1 hot-pursuit content dispatch (deep-dives pillar had fallen to
1 article in 30 days — "How the 60% became the default
custom-keyboard layout" shipped same-tick, cross-linked to 3 sibling
articles in a follow-up commit), a bug fix (group-buy
`relatedArticle` FK now resolved through `getArticleBySlug()` at all
four render sites instead of built raw), and a dead-code removal
(`sortGroupBuysForWidget` deleted — the exported helper had 3 green
tests but was never called by the component it was named for).
`/expand` ran 4 passes (269-272): passes 269 and 270 each filed one
new candidate (heading-semantics coverage check, rolling-latest-
window consistency check), breaking a 21-pass no-candidate streak;
271 and 272 returned to zero. This tick's own fresh `pnpm verify` is
green across all eight legs, run as sequential foreground blocking
calls: typecheck (9 packages), lint (all lintable workspaces), 772
web unit tests / 105 files (up from 753/105), 155 content tests / 24
files (up from 153/24), 211 tests across tokens/seo/data/ui/
e2e-fixtures (3+42+129+31+6, unchanged) — 1138 unit tests site-wide,
175 script tests / 64 suites (unchanged), 75 data records /
cross-refs resolve (unchanged), build — all canonical routes
generated, homepage bundle 108.7 KB / 200 KB (unchanged), and
1110/1110 e2e (up from 1107/1107). Deploy is `READY` at HEAD
(`b7533ca7`, `dpl_FiKQv73h`).

`plan/CRITIQUE.md` is now **84 days / 1915 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner), and every commit this window again carries
the `Cloud-Run:` trailer, so the gap keeps growing by construction
until a human decision lands. `plan/PHASE_CANDIDATES.md` holds **21
pending rows + 1 needs-user-call** (up from 19+1 — the two passes-
269/270 filings), now **49 days** since the last promotion
(2026-06-14, phases 46-49). `plan/AUDIT.md` carries **4** open rows,
all `/oversight`-gated or blocked, not actionable by an autonomous
tick — unchanged from yesterday: the Lighthouse-CI row, the
march.yml `[6.3]` crash-gate row, the soft-404 `[needs-user-call]`
`[4.2]` row, and the heartbeat.yml `[4.0]` row. No transient failures
this window — the third consecutive fully clean run.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-01 11:28 | iterate | seo — article meta descriptions fit the 160-char SERP truncation limit `[3.6]` (`47bbc016`/`9328ecad`) |
| 08-01 12:22 | expand | pass 269 — 1 candidate filed: heading-semantics coverage check (`aaa313b0`) |
| 08-01 13:30 | march | no-op — nothing additionally actionable this tick |
| 08-01 14:30 | iterate | a11y — catalog list pages get real item-title headings `[4.8]` (`f7be550c`/`e72b4bfd`) |
| 08-01 15:23 | iterate | a11y — tracker score delta gets an accessible label `[5.2]` (`2d4ac4ca`/`e8d3acb7`) |
| 08-01 16:21 | iterate | a11y — trend direction glyph gets an accessible label on two more surfaces `[5.85]` (`3871a519`/`7ae2dd33`) |
| 08-01 17:21 | iterate | a11y — archive article titles get real headings `[5.4]` (`bf940e4d`/`7b810d80`) |
| 08-01 18:20 | iterate | a11y — part-kind index cards get real headings `[5.4]` (`941fefe9`/`67f898dc`) |
| 08-01 19:26 | iterate | a11y — quiz results and compare tables get real headings `[5.4]` (`188a66b4`/`2597054a`) |
| 08-01 20:19 | march | no-op — nothing additionally actionable this tick |
| 08-01 21:18 | iterate | data — W31 Prototypist trend note misattributed to CannonKeys `[4.95]` (`738d5fba`/`38a50989`) |
| 08-01 22:19 | iterate | test — frontmatter description 160-char SERP boundary pinned `[4.0]` (`46deef91`/`efd42103`) |
| 08-01 23:19 | iterate | a11y — compare table `<dd>` values identified per switch/board for screen readers `[4.2]` (`5dd48132`/`4053be6f`) |
| 08-02 00:34 | march | content-gap auto-fill — deep-dives pillar hot pursuit filed + issue #705 opened (`92288ab1`/`ae484166`) |
| 08-02 01:34 | ship-content | content — deep-dives: "How the 60% became the default custom-keyboard layout" `[7]` (`039b053e`/`3e046ce8`) |
| 08-02 03:04 | expand | pass 270 — 1 candidate filed: rolling-latest-window consistency check (`4dc15e06`) |
| 08-02 05:05 | iterate | content — 60-percent-layout-history cross-links, 3 pairs drained `[4.5]` x3 (`cae27df4`/`8364120f`) |
| 08-02 06:54 | iterate | bug — group-buy `relatedArticle` FK guarded against dead links `[4.8]` (`ae1b06a9`/`0c463d3c`) |
| 08-02 07:46 | iterate | tests — dead `sortGroupBuysForWidget` helper removed `[3.6]` (`ba386ac9`/`dd47c8ab`) |
| 08-02 08:48 | iterate | a11y — 4 more list/card titles get real headings `[5.4]` (`ca86ba63`/`eb96a1be`) |
| 08-02 09:40 | expand | pass 271 — no candidates (`6d4d6fdb`) |
| 08-02 10:32 | expand | pass 272 — no candidates (`b7533ca7`) |

22 `march`-workflow runs since 2026-08-01T11:16:52 UTC: **22 `success`,
0 `failure`**.

## Shipped

- **a11y**: a six-tick heading-semantics sweep closing the loop on a
  defect class discovered piecemeal across the window — catalog list
  pages, `TrackerRow`'s mobile score delta label, trend-direction
  glyph on two more surfaces, `/archive` article titles, part-kind
  index cards, quiz results + compare tables, then a final pass
  catching 4 more surfaces (`TrackerRow`, `NewsletterArchive`,
  `CitationIndex`, `TrendingTile`) the prior sweeps missed. Same
  cycle also closed the compare-table `<dd>` screen-reader
  identification gap.
- **content**: the deep-dives pillar fell to 1 article in the last
  30 days (Rule 1 hot pursuit, score 7.0) — content-gap-survey filed
  the row and the same window shipped "How the 60% became the
  default custom-keyboard layout," then drained all 3 same-pillar
  cross-link pairs the new article opened up.
- **bug/tests**: group-buy `relatedArticle` now resolves through
  `getArticleBySlug()` at all four render sites instead of building
  the URL from an unvalidated raw string; dead
  `sortGroupBuysForWidget` helper (3 green tests, zero callers)
  deleted.
- **seo/data**: article meta descriptions now fit the 160-char SERP
  truncation limit (plus a new regression test pinning the
  boundary); W31 Prototypist trend note's misattribution to
  CannonKeys corrected.
- **expand**: 4 passes (269-272) — passes 269 and 270 each filed one
  new candidate, breaking a 21-pass no-candidate streak; 271 and 272
  returned to zero.

## Queues now

- **Build plan**: 0 pending phases, unchanged — pure `/iterate`
  maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged — every
  `[cross-links]`-category AUDIT row is `[x]` (including today's
  3-row 60-percent-layout-history cluster).
- **`plan/AUDIT.md`**: **4 open rows** (869 addressed, up from 852 —
  16 findings closed this window across 14 issues). `[6.3]` march.yml
  crash-gate (blocked-cloud-permission, filed 2026-07-05); `[4.0]`
  Lighthouse-CI disabled (`next: /oversight call`, filed 2026-07-18);
  `[needs-user-call] [4.2]` soft-404 structurally blocked (filed
  2026-07-18); `[4.0]` heartbeat.yml dedup (blocked-cloud-permission,
  filed 2026-07-26). All four unchanged from yesterday — non-
  autonomous, either genuinely blocked on the cloud push credential or
  gated to `/oversight`.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **84 days / 1915 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **21 pending rows + 1
  needs-user-call** (up from 19+1 — passes 269 and 270 each filed one:
  heading-semantics coverage check `[6.0]`, rolling-latest-window
  consistency check `[5.0]`), **49 days** since the last promotion
  (2026-06-14, phases 46-49). Top of the cluster, all still `7.0`:
  trend-snapshot data-quality gate, automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker. Several `6.5`s follow: `/quiz/board`,
  stale group-buy frontmatter/prose gate, sitewide focus-visible
  default + coverage check, plus the `[6.5]` needs-user-call
  critique-gate decision.
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: 14 open issues, unchanged, 0 unlabeled. 8 duplicate
  content-gap issues (`#414-#422`) still await a manual consolidation
  pass. Three `triage:needs-user` issues remain open: `#639` (Vercel
  deploy-webhook drop, now 5 days old), `#434` (Vercel never ingested
  commit `e312e09`, now 23 days old), `#499` (night digest crashed,
  now 17 days old). `#395`, `#437`, `#620` are stable.
- **Expand cadence**: 4 passes this window (269-272) — 2 filed new
  candidates, 2 came back clean; the 21-pass no-candidate streak
  ended.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 772 web unit tests (105 test files, up from
  753/105); 155 content tests (24 files, up from 153/24); tokens
  (3/1) + seo (42/5) + data (129/19) + ui (31/7) + e2e-fixtures (6/1)
  all green and unchanged. 1138 unit tests site-wide.
- `test:scripts` — green, 175 tests / 64 suites, unchanged.
- `data:validate` — green, 75 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, 14 group-buys, 13
  trend weeks — unchanged).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1110/1110**, up from 1107/1107 (7.8m, single
  worker).
- `pnpm deploy:check` at HEAD (`b7533ca7`) — deploy `READY`
  (`dpl_FiKQv73h`).
- `lighthouse` — confirmed via `gh workflow list --all`:
  `state: disabled_manually`, same standing `[4.0]` AUDIT row, no new
  signal this window.

One non-blocking observation, repeated from prior digests: the e2e
run's server stderr again logged `NoFallbackError` several dozen times
against the five `dynamicParams = false` routes (`/part/[kind]`,
`/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
`/newsletter/[slug]`) — Next's expected internal log for not-found-
page e2e tests hitting a param outside the pre-generated set, not a
real failure. Every one of the 1110 tests still passed.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **Standing, growing: the `/oversight` promotion backlog.** 21
   pending candidates + 1 needs-user-call, now **49 days** since the
   last promotion. Three candidates sit at `7.0`, several more at
   `6.5`. Two new candidates arrived this window after a 21-pass
   quiet streak — worth a look even if not yet urgent.
2. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 84 days / 1915 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
3. **Standing: Lighthouse CI has been disabled and failing for 7+
   weeks — `/oversight` call needed.** Unchanged since last digest.
4. **Standing: two unresolved `triage:needs-user` GitHub issues.**
   `#434` (23 days old) and `#499` (17 days old). Neither
   self-resolved. `#639` (5 days old) looks like it already
   self-resolved (deploy is `READY` at HEAD) but stays open pending a
   look.
5. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.
6. **Standing, out-of-repo: GA `/g/collect` 503s** — `plan/CRITIQUE.md`
   pass-8 `[needs-user-call]` row, unactionable by any shipping skill
   since the analytics property lives outside the codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows are
blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep, or another `/expand` pass now that the
no-candidate streak has broken. The highest-leverage next move isn't
a new fix — it's an `/oversight` pass covering, in one sitting: the
growing 21-row candidate cluster (three `7.0`s), the Critique-gate
decision, the Lighthouse re-enable decision, and the two blocked
workflow-permission fixes.

## Tuning proposals

None new this pass. 22/22 `march` runs succeeded this window — no
crash-gate signal to add to. `/expand`'s 21-pass no-candidate streak
ended this window (passes 269, 270 each filed one), which reads as
healthy cadence rather than a starved gate — no tuning needed there.
The 21-candidate `/oversight` backlog and 84-day critique staleness
remain standing, already-diagnosed decisions awaiting a human call,
not new tuning signals.
