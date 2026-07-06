# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Clean day, zero crashes, heavy dead-link cleanup.** 20 `march`
ticks in the ~24 hours since the last digest, all `success` — no
repeat of yesterday's 22:19 crash. The window drained a real
external-link-rot cluster: 3 separate dead-link discoveries (2
group-buy vendor URLs feeding `/group-buys/past` JSON-LD, then 9
dead `<Source>` citations across 8 articles, the last 8 researched
and fixed in one `scout`-backed commit) plus the still-open
CannonKeys URL from yesterday (#391) and its regression guard.
`/expand` noticed the pattern itself — pass 151 filed a `[score
6.0]` candidate to mechanize link-rot detection instead of relying
on another manual sweep next time. 8 of 9 issues opened this window
are now closed; only `#395` (the blocked `march.yml` crash-issue
gate fix) remains open, still stuck on the same cloud
workflow-write permission wall found yesterday. One minor blip: two
consecutive stalled ticks (03:07, 05:27 UTC) each opened their own
mirror issue for the same ideas-pillar content-gap row before a
third tick actually shipped the article — self-healed same window,
noted below in case it recurs. Full breadth `pnpm verify` is green
top to bottom (968/968 e2e, up from 959 — new regression-guard
tests), deploy is `READY` at HEAD. `plan/CRITIQUE.md` is now 57
days / 1157 commits since its last pass — unchanged diagnosis from
yesterday (cloud hard-skips `/critique` by design; still an
`/oversight` question).

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-05 11:32–11:48 | iterate | issue #391 fix shipped — dead CannonKeys vendor URL on the only live group buy (`74e897a`) |
| 07-05 12:30–12:55 | iterate | regression guard added pinning the CannonKeys URL (`5845ad4`), closes #393 |
| 07-05 13:32–13:51 | expand | pass 147 — no candidates |
| 07-05 14:32–14:56 | iterate | a11y drain — duplicate H1 on 4 pillar pages fixed (`98f6d99`), closes #394 |
| 07-05 15:27–15:34 | expand | pass 148 — no candidates |
| 07-05 16:23–16:45 | iterate | engineering audit — wrote the `march.yml` crash-gate `always()` fix, hit cloud workflow-push permission wall, reverted and filed blocked row + candidate (`7f2c2b4`) |
| 07-05 17:26–17:38 | march | no-op |
| 07-05 18:24–18:43 | expand | pass 149 — no candidates |
| 07-05 19:30–19:47 | expand | pass 150 — no candidates |
| 07-05 20:25–20:54 | iterate | data drain — 2 dead group-buy vendor URLs on `/group-buys/past` JSON-LD swapped for stable homepages (`b7ff688`), closes #396 |
| 07-05 21:23–21:45 | iterate | content drain — 1-of-9 dead `<Source>` citation fixed, trivial slug swap (`349b81e`), closes #397 |
| 07-05 22:21–22:42 | iterate | content drain — remaining 8 dead `<Source>` citations across 7 articles researched via `scout` and fixed (`d83c2e9`), closes #398 |
| 07-05 23:23–23:35 | march | no-op |
| 07-06 00:38–00:40 | march | no-op |
| 07-06 01:36–02:03 | iterate | data drain — trend snapshot `2026-W28` backfilled (`3768e8b`) |
| 07-06 03:07–03:13 | iterate | content-gap row auto-filed for ideas pillar (`f90b8ba`) — stalled, opened mirror issue #399 without a completing commit |
| 07-06 05:27–05:32 | iterate | stalled again on the same content-gap row — opened a second mirror issue #400, still no commit |
| 07-06 07:34–07:39 | march | no-op |
| 07-06 09:23–09:48 | iterate | content shipped — "Retrobrighting" ideas article (`ec6f080`), closes the content-gap row and supersedes #399/#400 |
| 07-06 11:32–11:51 | expand | pass 151 — 1 candidate filed (external link-rot survey, `[score 6.0]`) |

## Shipped

- **Link-rot cleanup (the window's dominant theme)**: dead
  CannonKeys vendor URL (#391) + regression guard, 2 dead group-buy
  vendor URLs on `/group-buys/past` JSON-LD (#396), and 9 dead
  `<Source>` citations across 8 articles (#397, #398) — vendor
  blog reorgs, 404s from domain moves, and one changed YouTube
  handle, all researched and replaced with verified-live URLs.
- a11y: duplicate H1 removed from 4 pillar hero cards
  (deep-dives/ideas/trends/news) via a `titleAs` prop on
  `ArticleCard`.
- Content: "Retrobrighting: what UV and peroxide actually reverse
  in yellowed ABS" published to the ideas pillar, closing a Rule 1
  hot-pursuit content-gap.
- Data: `data/trends/2026-W28.json` trend snapshot backfilled.
- Engineering: root-caused (but could not ship) a real
  `march.yml` bug — the crash-issue-opening gate never fires when
  the action step itself fails, because its `if:` conditions lack
  `always()`. The fix is written and verify-green; it's blocked on
  a cloud push-permission wall (see Needs You #1).

## Queues now

- **Build plan**: 0 pending phases — pure `/iterate` maintenance
  mode, unchanged.
- **Cross-link drain**: 0 pending, unchanged.
- **`plan/AUDIT.md`**: 1 open row — `[blocked-cloud-permission]
  [6.3]` the `march.yml` crash-gate fix, still stuck on the same
  workflow-write permission wall diagnosed yesterday. No other
  pending rows; everything else this window was audit-closed in
  the same tick that shipped its fix.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC
  at commit `931c8a7`. **57 days / 1157 commits stale** (up from
  55/1135 yesterday — expected, not a regression; unchanged
  diagnosis: cloud hard-skips `/critique` by design, so the real
  question is what local cadence should exist).
- **`plan/PHASE_CANDIDATES.md`**: 12 pending rows — up from 10
  yesterday. Two new this window: **external link-rot survey
  (`[score 6.0]`, pass 151)** — a self-observed pattern (3
  dead-link fix cycles in 11 commits) proposing a scheduled
  HEAD-probe survey; and **cloud loop cannot push
  `.github/workflows/*.yml` (`[score 5.5]`)** — the standing-gap
  companion to the blocked AUDIT row above. Other incumbents
  unchanged: `/quiz/board` (6.5), Critique gate diagnostic (6.5),
  Parts catalog third data pass (5.5), `/compare/keycap-set` (5.5),
  Vitest coverage CI gate (5.5), ship-data mentionedParts rescan
  (5.5), Tracker 8-week editorial analysis (5.0), Accessory parts
  kind (5.0), Tracker topic history page (4.5).
- **`data/BACKLOG.md`**: 0 actionable rows (3 rows sit under
  `## Pending` marked `[x]` — done but not yet relocated to
  `## Done`; cosmetic, not a queue-pressure signal).
- **Triage**: 1 open issue — `#395` "cloud march crash-issue gate
  silently skips on action failure" (bug, `severity:med`,
  `loop:opened`, `source:audit`), still open and still blocked by
  the same push-permission wall. 0 unlabeled, 0
  `triage:needs-user`.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, sequential legs — all
green:

- `typecheck` — green, 8/8 workspace packages.
- `test:run` — green, 928 tests across 7 workspaces (591 web + 121
  data + 32 seo + 31 ui + 144 content + 6 e2e-fixtures + 3 tokens).
- `test:scripts` — green, 57 suites / 156 tests.
- `data:validate` — green, 69 records (9 vendors, 18 switches, 10
  keycap-sets, 9 boards, 13 group-buys, 10 trend weeks — up from 68
  with the W28 backfill), cross-refs resolve.
- `build` — green, no manifest churn issues.
- `size` — green, 108.5 KB / 200 KB homepage gzip budget
  (unchanged).
- `e2e` — green, 968/968 (up from 959 — new regression-guard
  tests this window). Same benign `NoFallbackError` logged mid-run
  on `/trends/tracker/[week]` (expected 404-path behavior for a
  non-generated week param) as prior digests; did not fail any
  test.
- **Lighthouse**: no signal — workflow still `disabled_manually`
  (unchanged since 2026-06-14).
- `pnpm deploy:check` at HEAD (`ecb6a0b`) — deploy `READY`.

No red legs. No new AUDIT rows filed by this breadth check itself.

## Needs you

1. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[score 5.5]` candidate, companion to the `[6.3]`
   blocked AUDIT row and open issue `#395`). Confirmed twice now —
   the cloud push credential (a `ghs_`-prefixed GitHub App
   installation token) lacks the `workflows` permission GitHub
   requires for any push touching `.github/workflows/*`, regardless
   of the `ACTIONS_PAT` secret's intended purpose. Two paths: (a)
   re-scope the PAT backing `ACTIONS_PAT` with "Workflows: write"
   and confirm it's actually the push credential (not just the
   `gh` CLI credential), restoring full cloud autonomy; or (b)
   accept the constraint and document workflow-file edits as
   local/`/oversight`-only, same as brand-setup taste calls. The
   two-line `march.yml` fix itself is ready to apply verbatim once
   either path is chosen.
2. **Standing: refine or resolve the `[6.5]` Critique gate
   diagnostic candidate.** Unchanged from yesterday — cloud
   `/march` hard-skips `/critique` by design; the open question is
   what local `/critique` cadence, if any, should exist, now that
   57 days and 1157 commits have passed with zero local passes.
3. **Minor, not blocking: duplicate mirror-issue opening on a
   stalled retry.** Two consecutive ticks (03:07 and 05:27 UTC)
   each opened a fresh GitHub issue for the same ideas-pillar
   content-gap row instead of finding and reusing the one already
   open — #399 and #400, both closed as superseded once the
   article actually shipped at 09:44. Self-healed within the same
   window with no lasting effect; flagging in case the pattern
   recurs, in which case a dedup check before opening a new mirror
   issue for an already-open signal would be the fix. Not filing a
   candidate for a single two-tick blip.

## Today's intent

No pending build-plan phase, no AUDIT/BACKLOG queue pressure — the
loop is in clean maintenance mode. With the link-rot cluster fully
drained, the most likely next `/iterate` tick is either a fresh
mechanical-survey finding or another `/expand` no-op. The freshly
filed `[score 6.0]` external link-rot survey candidate is the
natural next mechanization if `/oversight` wants to shrink the
12-row candidate backlog — it directly prevents a repeat of this
window's 3-cycle manual dead-link sweep. `/quiz/board` (6.5) and
Critique gate diagnostic (6.5) remain the highest-scored
incumbents overall.

## Tuning proposals

None filed by this digest pass. The two new `plan/PHASE_CANDIDATES.md`
rows this window (external link-rot survey `[6.0]`, cloud-loop
workflow-push gap `[5.5]`) were both self-filed by `/iterate`/`/expand`
during the day, not by this digest. The standing `[6.5]` Critique
gate diagnostic candidate is unchanged and carried forward, not
re-filed.
