# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.6h window — 24/24 completed `march` runs succeeded, 0
failures — 17 substantive ticks (15 shipped fix/data/content pairs +
2 `expand` zero-candidate passes) for 30 commits total, the other 7
completed runs landing as silent no-ops.** Since the last digest
(`21f0cc14`, 2026-08-13T11:08:28 UTC) the loop drained **15**
findings. The dominant shape is still the **trends-tracker
sparkline/data-quality cluster**: 5 of the 15 fix/data/content ticks
(`3df33d36` DCS Dolch rename-boundary spark repair closes #849,
`4d9fe621` GMK CYL OG Extensions stale note tense closes #851,
`eb8ec9a9` DCS Dolch W32 fabricated sparkline closes #854, `2843e742`
Wuque Studio direction/spark contradiction closes #856, and
`5755d884` gmk-cyl-ta-neo-production-tracking's own InlineViz chart
citing fabricated W31/W32 sparks closes #863) are all instances of
the already-Pending `[7.5]` "Trend-snapshot data-quality gate"
candidate — see "Needs you," this candidate now has a 25th instance
the candidate's own notes haven't caught up to yet.

**Second shape, new this window: a freshly-published article needed
three follow-up fixes within about 4 hours of shipping.**
`wuque-studio-summer-update` shipped at 04:34 (content-gap dispatch,
closes #857) and by 08:28 had accumulated a cross-link fix (`dee2405e`
closes #859), a W32/W33 tracker-recovery mislabel fix (`0d13cb7e`
closes #860), and a "confirmed vs. rumored" section rewrite plus an
unsupported Mammoth75 group-buy claim fix (`97de2cd3` closes #861) —
all found by the loop's own reactive audit sweeps, not by anything
that checked the article before or at publish time. No new candidate
filed for this — it's covered by the existing `[7.0]` "Article
internal-consistency checker" and `[7.5]` trend-snapshot candidates —
but it's worth naming as a concrete instance of both landing on the
same brand-new page in one morning.

**Third, and the one action item in this digest: while reconciling
this window's issue closures, three GitHub issues (#843, #845, #858)
turned up open despite their underlying findings already being fixed
in the repo** — each is a near-duplicate of a *different* issue
number that actually got the closing commit, orphaned because the
"reuse #N" dedup check is defeated by title-format drift (`/` vs.
`<->`, or a second independent re-mirror before the first issue was
picked). This is exactly the failure mode the standing
`plan/AUDIT.md` `[needs-user-call] [3.0]` mirror-gap row predicted
from 2 historical instances (#776, #799) filed 2026-08-09 — now
confirmed 3 more times in this window alone. Filed as a new
`plan/PHASE_CANDIDATES.md` `[3.5]` candidate this tick (see "Tuning
proposals") so it has a promotable target instead of sitting as a
`needs-user-call` AUDIT row indefinitely.

**This tick's own fresh `pnpm verify` was clean start to finish — all
8 legs green on the first attempt, no retries, no new `plan/AUDIT.md`
row needed.** typecheck (9 packages), lint (all workspaces, `next
lint`'s Next-16-deprecation notice is cosmetic), 1199 unit tests
across 7 workspaces (829 web, up 1 — the home ItemList JSON-LD
regression guard — + 157 content + 129 data + 44 seo + 31 ui + 6 e2e
+ 3 tokens), 207 script tests / 74 suites (unchanged), 81 data
records / cross-refs resolve (unchanged), homepage bundle 108.7 KB /
200 KB (unchanged), and 1150/1150 e2e (up from 1143). Deploy is
`READY` at HEAD (`a3c44182`, `dpl_HRzCYp2E`).

`plan/CRITIQUE.md` is now **96 days / 2281 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
architectural diagnosis (no Chrome MCP on the cloud runner).
`plan/PHASE_CANDIDATES.md` holds **25 pending rows** (up from 24 —
this digest's own mirror-gap candidate), **61 days** since the last
promotion (2026-06-14, phases 46-49). `plan/AUDIT.md` carries **5
open rows**, all standing non-autonomous items, unchanged — this
tick's breadth check filed no new row. Confirmed via the GitHub API
this tick: `lighthouse.yml` is still `disabled_manually` (disabled
2026-06-14T23:59:43 UTC, ~61 days now).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-13 11:17 | data | trends tracker DCS Dolch rename-boundary spark discontinuity `[3.6]` (`3df33d36`/`5b1565a1`, closes #849) |
| 08-13 12:18 | content | hall-effect-keyboard-guide MX reset-point contradiction `[5.4]` (`a0902ff3`/`143cb2c1`, closes #850) |
| 08-13 13:30 | data | trends tracker W33 GMK CYL OG Extensions note stuck in future tense `[4.5]` (`4d9fe621`/`1b14880d`, closes #851) |
| 08-13 14:27 | expand | pass 314 — 0 candidates filed (`5c0ff53b`) |
| 08-13 15:21 | content | buckling-spring-deep-dive wrong patent year `[4.5]` (`0abadc15`/`4f1cea1b`, closes #852) |
| 08-13 17:20 | fix | trends tracker "Updated"/dateModified read `publishedAt` instead of `updatedAt` `[5.4]` (`f3009e34`/`e13afcb6`, closes #853) |
| 08-13 19:23 | data | DCS Dolch W32 fabricated sparkline discontinuity `[4.25]` (`eb8ec9a9`/`3661e43f`, closes #854) |
| 08-13 20:12 | content | gmk-cyl-og-extensions-interest-check Update callout add W33 close read `[5.4]` (`ddc62ff8`/`9f33a4fb`, closes #855) |
| 08-13 22:15 | data | trends tracker W33 Wuque Studio direction contradicts +6 spark swing `[4.5]` (`2843e742`/`bc6764f6`, closes #856) |
| 08-13 23:15 | expand | pass 315 — 0 candidates filed (`498b7668`) |
| 08-14 00:22 | content-gap | news pillar dispatch opened (`f9be6576`/`c8cc0c6a`, issue #857) |
| 08-14 04:34 | content | news — "Wuque Studio's summer update, and the Ikki68 Aurora holdover" `[7]` (`54df3d26`/`5bc199ca`, closes #857) |
| 08-14 06:30 | cross-links | wuque-studio-summer-update ↔ mode-sonnet-r2-group-buy-coverage `[4.5]` (`dee2405e`/`1d311656`, closes #859) |
| 08-14 07:31 | content | wuque-studio-summer-update W32/W33 tracker recovery mislabel `[5.4]` (`0d13cb7e`/`61a75d05`, closes #860) |
| 08-14 08:28 | content | wuque-studio-summer-update confirmed-vs-rumored contradiction + unsupported Mammoth75 claim `[4.9]` (`97de2cd3`/`beb0bce1`, closes #861) |
| 08-14 09:23 | seo | home ItemList JSON-LD drifts from rendered latest-by-pillar grid `[4.5]` (`ac241f7e`/`d3814ff8`, closes #862) |
| 08-14 10:22 | content | gmk-cyl-ta-neo-production-tracking fabricated W31/W32 spark chart data `[4.9]` (`5755d884`/`a3c44182`, closes #863) |

24 `march`-workflow runs since 2026-08-13T11:08:28 UTC: **24
completed, all `success`, 0 `failure`, 0 `cancelled`** — a fully
clean window. `night` (prior run 2026-08-13, success) green; this
tick is the current `night` run. 17 of the 24 completed runs produced
a commit (15 fix/data/content ticks, each a two-commit audit+fix
pair, plus 2 expand zero-candidate passes = 30 commits); the other 7
completed runs were silent no-ops.

## Shipped

- **Trends-tracker sparkline/data-quality cluster (5 fixes)**: DCS
  Dolch rename-boundary spark repair, GMK CYL OG Extensions note
  stuck in future tense, DCS Dolch W32 fabricated sparkline, Wuque
  Studio direction/spark contradiction, and — the newest instance —
  the just-shipped `gmk-cyl-ta-neo-production-tracking` article's own
  hand-authored InlineViz chart citing fabricated W31/W32 sparks. All
  five are instances of the already-Pending `[7.5]` data-quality-gate
  candidate — see "Needs you."
- **New news-pillar article + same-morning follow-up drain**: shipped
  `wuque-studio-summer-update` from the content-gap queue, then
  caught and fixed a missing cross-link, a tracker-recovery mislabel,
  a "confirmed vs. rumored" section that contradicted the site's own
  tracker archive, and an unsupported Mammoth75 group-buy claim — all
  within about 4 hours of publish.
- **Two isolated content-fact fixes**: hall-effect-keyboard-guide's
  self-contradicting MX reset-point delta; buckling-spring-deep-dive
  citing the wrong patent year against its own inline source link.
- **One code fix**: the tracker "Updated" label and Dataset JSON-LD
  `dateModified` now read `updatedAt` instead of `publishedAt` across
  all 5 display/JSON-LD call sites, so post-publish snapshot
  corrections are finally reflected in the displayed/structured
  "last modified" signal.
- **One SEO fix**: home's ItemList JSON-LD now reuses the same
  `byPillarPicks` array `<LatestByPillar>` renders, closing a drift
  where the structured data omitted two of the four rendered pillar
  picks.

## Queues now

- **Build plan**: all 49 phases shipped, 0 pending. No phase work
  queued.
- **Cross-link drain**: 0 open `[cross-links]` rows — this window's
  one finding (#859) drained same-tick.
- **Critique**: pass 11, 2026-05-10 — **96 days / 2281 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner), not neglect. Unchanged from prior digests.
- **Phase candidates**: **25 pending** in `plan/PHASE_CANDIDATES.md`
  (up from 24 — this digest filed 1: the mirror-gap issue-drain
  candidate, see below). 61 days since the last `/oversight`
  promotion (2026-06-14, phases 46-49). The `[7.5]` trend-snapshot
  data-quality candidate is still the top Pending row — its own notes
  count 24 instances through pass 315, but this window's 25th
  (`5755d884`, closes #863) shipped after that pass's anchor and
  hasn't been folded in yet.
- **Data backlog**: unchanged bookkeeping quirk noted in prior
  digests — `data/BACKLOG.md`'s "Pending" section lists 3 rows, all
  already `[x]`-checked with records already shipped; never moved to
  "## Done." Cosmetic only, `/ship-data` already treats it as empty.
- **Open GitHub issues**: 21 open (up from 20), 0 unlabeled (triage
  gate clean). 4 labeled `triage:needs-user` (#756, #639, #499, #434
  — all historical cloud-march/deploy-check or digest-crash reports,
  unchanged this window). New this tick: 3 confirmed stale duplicate
  `loop:opened` issues (#843, #845, #858) whose underlying findings
  are already fixed in the repo but never got a closing commit — see
  "Needs you" and "Tuning proposals."

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint` prints a
  Next-16 deprecation notice; cosmetic, not a failure).
- `test:run` — green, **1199 tests / 166 files** across 7 workspaces
  (829 web, up 1 + 157 content + 129 data + 44 seo + 31 ui + 6 e2e +
  3 tokens).
- `test:scripts` — green, **207 tests / 74 suites** — unchanged.
- `data:validate` — green, **81 records**, all cross-refs resolve —
  unchanged (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 15 trends).
- `build` — green, **first attempt, no retries**.
- `size` — green, homepage bundle 108.7 KB / 200 KB budget —
  unchanged.
- `e2e` — green, **1150/1150** (up from 1143). Console noise from
  intentional not-found-route `NoFallbackError` probes during the
  run is expected, not a regression.
- `pnpm deploy:check` at HEAD (`a3c44182`) — deploy `READY`
  (`dpl_HRzCYp2E`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md`.

## Needs you

1. **Escalating: the Pending `[7.5]` "Trend-snapshot data-quality
   gate" candidate now has a 25th instance and is 24 days overdue for
   promotion.** Five more instances shipped in this window alone
   (#849, #851, #854, #856, #863 — the last not yet folded into the
   candidate's own pass notes). It's sat Pending since 2026-07-21
   (expand pass 207), reinforced at 8+ subsequent passes without
   promotion, and the proposed scope
   (`scripts/trend-snapshot-quality-check.mjs`, including the
   spark-array-vs-direction/score consistency check that would have
   caught at least 3 of this window's 5 instances mechanically) is
   fully drafted. This remains the strongest single candidate in the
   queue for the next `/oversight` promotion pass.
2. **New: 3 GitHub issues (#843, #845, #858) are confirmed stale
   duplicates — their findings are already fixed in the repo, but the
   issues themselves are still open.** #843 ("novelkeys-gmk-cyl-og-
   extensions group buy status stale," filed 2026-08-13T00:25) was
   superseded by an independently re-mirrored #844 which got the
   actual closing commit (`8f2be166`) — `data/group-buys/novelkeys-
   gmk-cyl-og-extensions.json` reads `status: "closed"` today, but
   #843 has no closing commit of its own. #845 ("gmk-cyl-ta-neo-
   production-tracking chart still shows pre-repair sparklines,"
   filed 2026-08-13T03:57) sat open >24h until the same finding was
   re-mirrored as #863 and closed by this window's own `5755d884`.
   #858 (cross-link gap, filed 2026-08-14T05:34) is a near-duplicate
   of #859, differing only by a `/` vs. `<->` title separator — #859
   got the closing commit (`dee2405e`), #858 didn't. This is the
   exact failure mode the standing `plan/AUDIT.md` `[needs-user-call]
   [3.0]` mirror-gap row (filed 2026-08-09 from 2 historical
   instances, #776/#799) predicted — now confirmed 3 more times in
   one digest window. Filed a new `[3.5]`
   `plan/PHASE_CANDIDATES.md` candidate this tick (proposal only, no
   direct action) naming both the standing row's own proposed fixes
   as the candidate scope.
3. **Standing: `/critique` is 96 days / 2281 commits stale.**
   Diagnosis unchanged — cloud mode architecturally cannot reach
   `/critique` (no Chrome MCP on the runner).
4. **Standing: Lighthouse CI disabled ~61 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original disable reason first.
   Confirmed still `disabled_manually` via the GitHub API this tick.
5. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[blocked-cloud-permission] [6.3]`/`[4.0]` AUDIT rows,
   companion `[5.5]` candidate, open issue `#395`). No PAT/App scope
   currently satisfies GitHub's workflow-write restriction. Unchanged.
6. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) — non-autonomous, unchanged.
7. **Standing, growing: the `/oversight` promotion backlog.** 25
   candidates pending (up 1 this window), 61 days since the last
   promotion. Item 1 above remains the clearest single candidate to
   act on next; item 2 is the freshest.

## Today's intent

No pending build-plan phase — the loop stays in maintenance mode.
This tick's breadth check was fully clean, so there's no fresh
autonomously-actionable AUDIT.md row to point the next `/iterate`
tick at; expect it to keep running fresh general-purpose sweeps. This
window's two dominant shapes — the trends-tracker sparkline cluster
and a freshly-published article needing 3 same-morning follow-up
fixes — both suggest the site's newest or most-recently-touched
surfaces are currently the highest-yield place to keep looking.

## Tuning proposals

Filed **1** this tick: a new `plan/PHASE_CANDIDATES.md` `[3.5]`
candidate for the `loop:opened` issue mirror-drain gap, citing 3
fresh concrete un-drained duplicates (#843, #845, #858) surfaced
while reconciling this window's issue closures — escalation evidence
beyond the 2 historical instances the standing `plan/AUDIT.md`
`[needs-user-call] [3.0]` row already carried. The candidate names
the standing row's own two proposed remedies as its scope; no new
investigation was needed. The trend-snapshot data-quality cluster's
continued escalation is already fully captured in "Needs you" above
(item 1) — its candidate is unchanged in the queue, not duplicated
here. Everything else in the pulse reads as expected: `/expand` filed
0 new candidates across both passes this window and correctly
reinforced the trend-snapshot candidate in place, the ceiling isn't
hibernating (24/24 clean march runs, 17 substantive ticks), and
`/digest`'s own breadth check needed no follow-up.
