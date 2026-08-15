# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.5h window — 24/24 completed `march` runs succeeded, 0
failures — 18 substantive ticks (12 shipped fix/data/content pairs +
6 `expand` passes) for 30 commits total, the other 6 completed runs
landing as silent no-ops.** Since the last digest (`bf5f0ad5`,
2026-08-14T11:08:28 UTC) the loop drained **12** findings, closing
GitHub issues #864–#875 cleanly (each opened and closed inside the
same tick — no orphaned mirrors this window, unlike the 3 confirmed
stale duplicates the prior digest flagged).

**Dominant shape: the "JSON-LD drifts from what's actually rendered"
defect kept recurring.** Three more instances landed this window —
`9ebbd294` (`/tags`, closes #864), `a850625d` (`/ideas`, closes
#865), and `03a6a392` (`/sources`, closes #866, and also drained the
standing `[seo] [3.6]` AUDIT row). Each commit message explicitly
named the prior fix as "same defect class." `/expand` pass 316
caught the pattern and filed a new `[6.0]` `plan/PHASE_CANDIDATES.md`
candidate ("ItemList JSON-LD parity check") citing all 5 known
instances (4 fixed, 1 confirmed-intentional-scope) against 14 still-
unaudited `ItemList`-bearing routes — see "Needs you."

**Second shape, new this window: a rank-vs-label sign mismatch hit
two unrelated tracker selectors within 8 hours.** `e1687134` (tracker
summary slot, closes #867) found `pickRiser`/`pickFaller`/
`pickBreakout` filtered candidates by `direction` but labelled the
winner from `sparkSlope` without checking the two agree — reproduced
live on `/trends/tracker/2026-W24`. `85f9a3aa` (home's
`TrendingStrip`, closes #872) found the identical shape one surface
over, its commit explicitly framing itself as "porting the identical
sign-agreement guard" from the first fix. `/expand` pass 319 filed a
new `[5.0]` candidate to extract a shared helper instead of a third
hand-written guard.

**Third shape: the readTime fix from earlier this tick didn't fully
generalize.** `dc4eb368` (closes #874) fixed `computeReadTime()`
discarding `caption="..."` text on `<InlineViz>`/`<KeyboardImage>`
before word-counting. Two hours later `7a3f5e85` (closes #875) found
the same fix hadn't generalized to `<Callout title="...">`, which
also renders as visible `<h2>` text but was still being stripped —
the regex went from caption-only to `caption|title`. Only 2 instances
so far (below the site's own "3+" candidate-filing bar), but it's the
same "a fix's own stated scope turns out incomplete" meta-sub-shape
already recognized on 2 other standing candidates in this file —
worth `/expand`'s attention if a third call site turns up.

**This tick's own fresh `pnpm verify` was clean start to finish — all
8 legs green on the first attempt, no retries, no new
`plan/AUDIT.md` row needed.** typecheck (9 packages), lint (all
workspaces, `next lint`'s Next-16-deprecation notice is cosmetic),
1207 unit tests across 7 workspaces (up from 1199 — 835 web + 159
content, up 2 from the readTime fixes' new tests + 129 data + 44 seo
+ 31 ui + 6 e2e + 3 tokens), 207 script tests / 74 suites
(unchanged), 81 data records / cross-refs resolve (unchanged),
homepage bundle 108.7 KB / 200 KB (unchanged), and 1153/1153 e2e (up
from 1150). Deploy is `READY` at HEAD (`02baf0f5`, `dpl_EvSVNJrk`).

`plan/CRITIQUE.md` is now **97 days / 2312 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
architectural diagnosis (no Chrome MCP on the cloud runner).
`plan/PHASE_CANDIDATES.md` holds **28 pending rows** (up from 25 —
3 filed this window: the ItemList-parity, rank-vs-label, and a
`[6.5]` stale-`updatedAt` candidate from pass 320), **62 days** since
the last promotion (2026-06-14, phases 46-49). `plan/AUDIT.md`
carries **5 open rows**, all standing non-autonomous items, unchanged
— this tick's breadth check filed no new row. Confirmed via the
GitHub API this tick: `lighthouse.yml` is still `disabled_manually`
(disabled 2026-06-14T23:59:43 UTC, ~62 days now).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-14 11:36 | fix | `/tags` ItemList JSON-LD drifts from rendered grouped tag grid `[4.5]` (`9ebbd294`/`1d3ff5a2`, closes #864) |
| 08-14 12:45 | fix | `/ideas` ItemList JSON-LD drifts from rendered build-pick order `[4.5]` (`a850625d`/`d4919205`, closes #865, `[3.6]` filed) |
| 08-14 13:34 | expand | pass 316 — 1 candidate filed (`9afd99bf`) |
| 08-14 14:38 | fix | `/sources` ItemList JSON-LD lists uncited articles never rendered `[3.6]` (`03a6a392`/`ae86c9bc`, closes #866) |
| 08-14 15:49 | expand | pass 317 — 0 candidates filed (`b9113e89`) |
| 08-14 17:42 | expand | pass 318 — 0 candidates filed (`c537f9c1`) |
| 08-14 18:43 | fix | trends tracker summary slot can mislabel a row against its own trend `[4.8]` (`e1687134`/`0a2aad7c`, closes #867) |
| 08-14 19:49 | a11y | sparkline aria-label now names the item, not a generic description `[4.5]` (`c3e50b7a`/`65dbd86a`, closes #868) |
| 08-14 21:26 | seo | bump stale `updatedAt` on 4 articles missed by their own content fixes `[4.5]` (`00a98895`/`22538e57`, closes #869) |
| 08-14 22:34 | data | normalize Unikeys vendor-name capitalization across 4 trend snapshots `[3.6]` (`638fe158`/`26fb5285`, closes #870) |
| 08-14 23:23 | content | gmk-cyl-ta-neo-production-tracking — append W33 update, no longer a week behind its own tracker linkage `[4.8]` (`94e3b673`/`2915a707`, closes #871) |
| 08-15 02:45 | fix | home trending strip can crown a sign-mismatched mover `[4.9]` (`85f9a3aa`/`73178186`, closes #872) |
| 08-15 03:29 | expand | pass 319 — 1 candidate filed (`61832029`) |
| 08-15 04:30 | content | group-buys/past lede says "freshest four," live index caps at six `[4.5]` (`b07ca689`/`21686191`, closes #873) |
| 08-15 05:25 | expand | pass 320 — 1 candidate filed (`94e32e60`) |
| 08-15 07:30 | expand | pass 321 — no candidates (`a579dc5b`) |
| 08-15 08:25 | fix | read time undercounts articles with InlineViz/KeyboardImage captions `[4.2]` (`dc4eb368`/`175a357f`, closes #874) |
| 08-15 10:22 | fix | readTime still undercounts articles with Callout title text `[3.5]` (`7a3f5e85`/`02baf0f5`, closes #875) |

24 `march`-workflow runs since 2026-08-14T11:08:28 UTC: **24
completed, all `success`, 0 `failure`, 0 `cancelled`** — a fully
clean window. `night` (prior run 2026-08-14T10:46:02Z, success)
green; this tick is the current `night` run. 18 of the 24 completed
runs produced a commit (12 fix/data/content ticks, each a two-commit
audit+fix pair, plus 6 expand passes = 30 commits); the other 6
completed runs were silent no-ops.

## Shipped

- **ItemList JSON-LD parity drain (3 fixes)**: `/tags`, `/ideas`, and
  `/sources` JSON-LD now reuse the exact array each page renders,
  instead of an independently-derived sort/filter that could diverge
  from the visible list. Closes the standing `[seo] [3.6]` AUDIT row.
  4 of 5 known instances are now fixed by hand (home, /tags, /ideas,
  /sources); a new candidate proposes a mechanical survey for the
  remaining 14 unaudited `ItemList`-bearing routes.
- **Rank-vs-label sign-agreement (2 fixes)**: the tracker's
  `pickRiser`/`pickFaller`/`pickBreakout` selectors and home's
  `TrendingStrip` both independently added a guard so a candidate's
  rendered glyph/tone always agrees with the field used to rank it —
  each guard hand-written, no shared helper yet (that's the new
  candidate's proposed scope).
- **readTime undercount (2 fixes)**: `computeReadTime()` now folds in
  visible `caption="..."` text on `<InlineViz>`/`<KeyboardImage>` and
  `title="..."` text on `<Callout>` before word-counting — 13
  articles' "N min read" badges bumped up (always +1, never down).
- **Three isolated fixes**: sparkline `aria-label` now names the
  specific item instead of a generic description; 4 articles' stale
  `updatedAt` bumped to match their actual last content edit;
  "Unikeys" vendor-name capitalization normalized across 4 trend
  snapshots.
- **Two content fixes**: `gmk-cyl-ta-neo-production-tracking` gained
  its W33 tracker update (was a week behind its own linkage);
  `group-buys/past`'s lede corrected to match the live index's actual
  6-item cap (previously said "freshest four").

## Queues now

- **Build plan**: all 49 phases shipped, 0 pending. No phase work
  queued.
- **Cross-link drain**: 0 open `[cross-links]` rows — unchanged, this
  window shipped no cross-link-category findings.
- **Critique**: pass 11, 2026-05-10 — **97 days / 2312 commits**
  stale. Diagnosed as architectural (no Chrome MCP on the cloud
  runner), not neglect. Unchanged from prior digests.
- **Phase candidates**: **28 pending** in `plan/PHASE_CANDIDATES.md`
  (up from 25 — this window filed 3: ItemList JSON-LD parity `[6.0]`,
  rank-vs-label sign-agreement `[5.0]`, stale-`updatedAt` mechanical
  check `[6.5]`). 62 days since the last `/oversight` promotion
  (2026-06-14, phases 46-49). The `[7.5]` trend-snapshot
  data-quality candidate gained its 25th confirmed instance this
  window (`638fe158`, closes #870) — still the strongest single
  candidate for the next promotion pass.
- **Data backlog**: unchanged bookkeeping quirk noted in prior
  digests — `data/BACKLOG.md`'s "Pending" section lists 3 rows, all
  already `[x]`-checked with records already shipped; never moved to
  "## Done." Cosmetic only, `/ship-data` already treats it as empty.
- **Open GitHub issues**: 21 open, unchanged from last digest. 0
  unlabeled (triage gate clean). 4 labeled `triage:needs-user`
  (#756, #639, #499, #434 — all historical cloud-march/deploy-check
  or digest-crash reports, unchanged this window). All 12 issues
  opened this window (#864–#875) closed cleanly the same tick — no
  new orphaned mirrors, a positive data point against last window's
  3-instance mirror-drain-gap finding, though not proof the standing
  `[3.5]` candidate is moot (small sample, still Pending).

## Breadth verdict

Full `pnpm verify`, run as sequential foreground legs (per the
standing rule — never backgrounded):

- `typecheck` — green, 9 packages.
- `lint` — green, all lintable workspaces (`next lint` prints a
  Next-16 deprecation notice; cosmetic, not a failure).
- `test:run` — green, **1207 tests / 166 files** across 7 workspaces
  (835 web + 159 content, up 2 + 129 data + 44 seo + 31 ui + 6 e2e +
  3 tokens).
- `test:scripts` — green, **207 tests / 74 suites** — unchanged.
- `data:validate` — green, **81 records**, all cross-refs resolve —
  unchanged (11 vendors, 18 switches, 10 keycap-sets, 10 boards, 17
  group-buys, 15 trends).
- `build` — green, **first attempt, no retries**, 266 static pages.
- `size` — green, homepage bundle 108.7 KB / 200 KB budget —
  unchanged.
- `e2e` — green, **1153/1153** (up from 1150). Console noise from
  intentional not-found-route `NoFallbackError` probes during the
  run is expected, not a regression.
- `pnpm deploy:check` at HEAD (`02baf0f5`) — deploy `READY`
  (`dpl_EvSVNJrk`).

Zero red legs this tick — nothing new filed to `plan/AUDIT.md`.

## Needs you

1. **Standing, escalating: the Pending `[7.5]` "Trend-snapshot
   data-quality gate" candidate gained its 25th confirmed instance
   this window** (`638fe158`, closes #870 — "Unikeys" vendor-name
   capitalization drift, exactly the candidate's own proposed-scope
   item 1). It's sat Pending since 2026-07-21 (expand pass 207),
   reinforced at 9+ subsequent passes without promotion, and the
   proposed scope (`scripts/trend-snapshot-quality-check.mjs`) is
   fully drafted. Remains the strongest single candidate in the queue
   for the next `/oversight` promotion pass.
2. **New: ItemList JSON-LD parity check `[6.0]`, filed pass 316.**
   3 more same-shape instances landed this window (`/tags`, `/ideas`,
   `/sources`, on top of home from the prior window) — 4 of 5 known
   instances now fixed by hand, 14 of 19 `ItemList`-bearing routes
   still unaudited for the identical gap. Proposed scope:
   `scripts/itemlist-jsonld-parity-check.mjs`.
3. **New: Rank-vs-label sign-agreement coverage check `[5.0]`, filed
   pass 319.** 2 independent same-day instances (tracker summary
   slot + home `TrendingStrip`), each hand-written with no shared
   helper. Proposed scope: extract `pickWithSignAgreement()` plus a
   mechanical grep-based check for a third divergent implementation.
4. **New: Stale-`updatedAt` mechanical check `[6.5]`, filed pass
   320.** 5 separate reactive fixes across 3 weeks (14 articles
   total, escalating not tapering) with no gate catching the class —
   same shape that justified mechanizing the OG-coverage and
   mentionedParts gates at comparable instance counts.
5. **Standing: `/critique` is 97 days / 2312 commits stale.**
   Diagnosis unchanged — cloud mode architecturally cannot reach
   `/critique` (no Chrome MCP on the runner).
6. **Standing: Lighthouse CI disabled ~62 days**, `[4.0]`
   `plan/AUDIT.md` row, `needs: /oversight call` on whether to
   re-enable now or investigate the original disable reason first.
   Confirmed still `disabled_manually` via the GitHub API this tick.
7. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[blocked-cloud-permission] [6.3]`/`[4.0]` AUDIT rows,
   companion `[5.5]` candidate, open issue `#395`). No PAT/App scope
   currently satisfies GitHub's workflow-write restriction. Unchanged.
8. **Standing: `[needs-user-call]` soft-404 structural conflict**
   (`[4.2]`) — non-autonomous, unchanged.
9. **Standing, growing: the `/oversight` promotion backlog.** 28
   candidates pending (up 3 this window), 62 days since the last
   promotion. Item 1 above remains the clearest single candidate to
   act on next; items 2–4 are this window's fresh additions.

## Today's intent

No pending build-plan phase — the loop stays in maintenance mode.
This tick's breadth check was fully clean, so there's no fresh
autonomously-actionable AUDIT.md row to point the next `/iterate`
tick at. This window's two paired-instance shapes — ItemList JSON-LD
parity and rank-vs-label sign-agreement, both caught and fixed twice
in one day each — suggest that any surface deriving two independent
views of the same underlying data (a rendered list vs. its JSON-LD, a
ranking field vs. a labelling field) is currently the highest-yield
place to keep looking by hand until one of the new candidates ships.

## Tuning proposals

None filed this tick. The readTime fix's own incomplete-scope
follow-up (`dc4eb368` → `7a3f5e85`, 2 hours apart) is a real pattern
but sits at only 2 instances — below the site's own "3+" bar for a
new `/expand` candidate, and candidate-filing for defect clusters is
`/expand`'s lane, not `/digest`'s (this skill's meta-loop rail is
gate/cadence mistuning specifically). No gate mistuning found this
tick: `/expand`'s cadence and hit-rate look healthy (3 candidates
filed across 6 passes this window, not hibernating), the ceiling
completed 24/24 runs clean, and this tick's own breadth check needed
no follow-up.
