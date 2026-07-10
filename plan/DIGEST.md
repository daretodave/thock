# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Quiet, clean window — three targeted `/iterate` fixes, one content
ship, two cross-link drains, nine `/expand` no-op passes.** Since
yesterday's digest (`f808d68`), the loop shipped: a real defect fix
(`/compare/switch` and `/compare/board` rendered a degenerate `a===b`
table with duplicate JSON-LD when both query-param slots pointed at
the same slug — `dc6baff`, closes #430), a content-accuracy fix
(the `thock-weekly-002` newsletter still pitched the DCS Dolch group
buy as open three days after it closed — `6f69db1`, closes #431), and
a fresh ideas-pillar article ("The brass weight mod: what added mass
actually buys you", `9066596`, closes #432) that content-gap-survey.mjs
auto-filed and drained same-window, plus its own cross-link pair
(`95aa229`). Nine consecutive `/expand` passes (162-170) filed 0 new
candidates — the 13-row `plan/PHASE_CANDIDATES.md` queue is unchanged
and still awaiting `/oversight` promotion (last oversight: **48 days
ago**, 2026-05-23). Full breadth `pnpm verify` is green top to bottom,
run fresh this tick (979/979 e2e, homepage bundle flat at 108.5 KB /
200 KB). Deploy is `READY` at HEAD (`d86a113`).
`plan/CRITIQUE.md` is now **61 days / 1236 commits** since its last
pass — unchanged diagnosis, still the standing item to resolve. One
correction to prior digests: the `lighthouse` workflow **does exist**
(`.github/workflows/lighthouse.yml`) — it was manually disabled
2026-06-14 after a run of failures; `gh run list --workflow lighthouse`
(by display name) silently returns nothing for a disabled workflow,
which is why prior digests reported "no workflow found." See Breadth
verdict.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 07-09 11:42 | digest | 2026-07-09 briefing committed |
| 07-09 14:12 | expand | pass 162 — no candidates |
| 07-09 17:57 | iterate | `/compare/switch` + `/compare/board` a===b degenerate-table fix (`dc6baff`), closes #430 |
| 07-09 18:56 | iterate | thock-weekly-002 newsletter DCS Dolch status drift fixed to past-tense (`6f69db1`), closes #431 |
| 07-09 19:48 | expand | pass 163 — no candidates |
| 07-09 21:01 | expand | pass 164 — no candidates |
| 07-09 21:38 | expand | pass 165 — no candidates |
| 07-09 23:33 | expand | pass 166 — no candidates |
| 07-10 00:40–00:41 | march | content-gap row auto-filed (ideas pillar hot-pursuit); dispatch opened issue #432 |
| 07-10 01:07 | march | content: ideas — "The brass weight mod: what added mass actually buys you" (`9066596`), closes #432 |
| 07-10 01:53–01:54 | iterate | brass-weight-mod ↔ gasket-mount-reality cross-link drained (`95aa229`) |
| 07-10 03:21 | expand | pass 167 — no candidates |
| 07-10 05:29 | expand | pass 168 — no candidates |
| 07-10 07:21 | expand | pass 169 — no candidates |
| 07-10 11:07 | expand | pass 170 — no candidates |

19 commits total in the window; every `march`-workflow run in the last
30 (going back to 07-08 19:31) reports `success` at the GitHub Actions
level.

## Shipped

- **bug**: `/compare/switch` and `/compare/board` guarded against
  `a === b` query-param pairs — previously rendered a duplicate-column
  table plus duplicate `ItemList` JSON-LD entries for every direct or
  shared "compare X to itself" URL. New e2e regression coverage for
  both routes' empty state. Closes #430.
- **content**: `thock-weekly-002.mdx` rewritten to past tense for the
  DCS Dolch group buy (closed 2026-07-01, newsletter published
  2026-07-03 still framed it as opening) — third surface hit by this
  bug class this week, first time in the newsletter archive
  specifically. Closes #431.
- **content**: "The brass weight mod: what added mass actually buys
  you" (ideas pillar) — content-gap-survey.mjs auto-filed a hot-pursuit
  row (1 of ≥2 articles in the 30d window) and the same window drained
  it; ideas pillar now comfortable at 2/2. Closes #432. Its cross-link
  pair to gasket-mount-reality (shared tags: modding, acoustic, mode)
  drained in the same window.
- Nine `/expand` passes (162-170) — 0 new candidates; the 13-row
  Pending queue is unchanged.

## Queues now

- **Build plan**: 0 pending phases (51/51 shipped) — pure `/iterate`
  maintenance mode, unchanged.
- **Cross-link drain**: 0 pending, unchanged (brass-weight-mod's one
  pair drained same-window it was filed).
- **`plan/AUDIT.md`**: 1 open row — the standing
  `[blocked-cloud-permission] [6.3]` `march.yml` crash-gate fix
  (unchanged, still stuck on the workflow-write permission wall; the
  two-line `always()` fix is written and verified, just unpushable
  from cloud).
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **61 days / 1236 commits stale** (up from
  59/1216 two days ago). Unchanged diagnosis: cloud `/march` hard-skips
  `/critique` by design (`.github/CLOUD_LOOP.md`); the `[6.5]` Critique
  gate diagnostic candidate is still standing, unpromoted since
  2026-07-03.
- **`plan/PHASE_CANDIDATES.md`**: 13 pending rows, unchanged for the
  third straight digest. Top incumbents: Stale group-buy
  frontmatter/prose gate (6.5), `/quiz/board` (6.5), Critique gate
  diagnostic (6.5), external link-rot survey (6.0), march.yml
  crash-issue gate `always()` fix (6.0), Parts catalog third data pass
  (5.5), `/compare/keycap-set` (5.5), Vitest coverage CI gate (5.5),
  ship-data mentionedParts rescan (5.5), Cloud loop workflow-push
  permission gap (5.5), Tracker 8-week editorial analysis (5.0),
  Accessory parts kind (5.0), Tracker topic history page (4.5). **Last
  `/oversight` promotion: 2026-05-23 — 48 days ago.**
- **`data/BACKLOG.md`**: 0 pending rows.
- **Triage**: 9 open issues — `#395` (cloud march crash-issue gate,
  unchanged, blocked) plus 8 duplicate content-gap issues (#414-#416,
  #418-#422) from the pre-fix ship-content duplicate-issue loop,
  unchanged and still awaiting a manual/oversight consolidation pass.
  0 unlabeled, 0 `triage:needs-user`.
- **Expand cadence**: 9 consecutive no-candidate passes (162-170); 19
  passes since the last candidate was filed (pass 151, 2026-06-19).
  Not a mistuning signal on its own — the queue is full (13 unpromoted
  rows), not empty; expand correctly isn't re-proposing what's already
  filed and awaiting `/oversight`.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, single blocking call — all
green:

- `typecheck` — green, all workspace packages.
- `test:run` / `test:scripts` / unit suites — green (reached the e2e
  leg, which only runs after every prior leg passes).
- `data:validate` — green (manifest rebuild logged 18 switches, 10
  keycap-sets, 9 boards, 9 vendors, 13 group-buys, 10 trend weeks, 63
  articles, 2 newsletters, 73 tags — cross-refs resolve).
- `build` — green, 48 routes generated, no manifest churn issues.
- `size` — green, homepage gzip 108.5 KB / 200 KB budget (unchanged).
- `e2e` — green, **979/979**. Benign `NoFallbackError` stderr noise
  logged mid-run on `/trends/tracker/[week]` for non-generated week
  params (expected 404-path behavior, same as prior digests) — did not
  fail any test.
- **Lighthouse — correction from prior digests**: the workflow exists
  (`.github/workflows/lighthouse.yml`, created 2026-05-14) but is
  **`disabled_manually`** as of 2026-06-14T23:59 UTC, right after its
  last recorded run failed. `gh run list --workflow lighthouse`
  (display-name lookup) returns nothing for a disabled workflow, which
  is why prior digests logged "no workflow found" — the correct query
  is `gh workflow list --all` or `gh run list --workflow
  lighthouse.yml` (filename). Its last 3 runs (all 2026-06-12/14) were
  genuine `minScore`/`categories.seo` assertion failures against
  production, not the earlier SSO-redirect bug (that was fixed at
  `d295d42`, 2026-05-23). `plan/PHASE_CANDIDATES.md`'s 2026-05-23
  oversight note says the user would "tackle interactively" — the
  manual disable one visible June evening later reads as that
  resolution. Not re-filing a candidate; flagging for awareness only,
  see Needs you.
- `pnpm deploy:check` at HEAD (`d86a113`) — deploy `READY`
  (`dpl_D3Bo1v9Z`).

No red legs, no new AUDIT.md finding from this breadth check.

## Needs you

1. **Standing: promote or resolve the `[6.5]` Critique gate
   diagnostic candidate.** 61 days / 1236 commits since the last local
   `/critique` pass — the fresh-eyes loop has been dark for two
   months. The candidate (filed 2026-07-03) already has a full
   diagnostic writeup and a proposed fix shape (resolve the AND/OR
   ambiguity between `march.md`'s Purpose section and its Step 2 body,
   add a trace log, manually re-baseline the header).
2. **Standing: cloud loop cannot push `.github/workflows/*.yml`
   changes** (`[score 5.5]` candidate, companion to the `[6.3]` blocked
   AUDIT row and open issue `#395`). Unchanged.
3. **Standing, now 48 days: the `/oversight` promotion backlog itself.**
   13 candidates pending, two at 6.5 (`/quiz/board`, Critique gate
   diagnostic), unpromoted since 2026-05-23. Not a code defect — just
   a wide gap between candidate supply and promotion cadence. Worth a
   look next `/oversight` pass regardless of which specific candidates
   get promoted or rejected.
4. **Housekeeping, low urgency: `lighthouse.yml` is disabled.** See
   Breadth verdict — this may already be the intended resolution (user
   manually disabled it 2026-06-14 after repeated real assertion
   failures against production), but flagging in case it was meant to
   be temporary and got forgotten. If it should stay off, no action
   needed; if it should come back, the `.lighthouserc.json` thresholds
   likely need loosening or the failing audits (SEO category,
   meta-description, insight audits) need a real look first.
5. **Housekeeping, low urgency: 8 duplicate open GitHub issues**
   (#414-#416, #418-#422) from the pre-fix ship-content duplicate-issue
   loop are still open — each still names a genuine unwritten
   deep-dives topic (not a shipped duplicate, per repeated expand-pass
   verification), so closing them would discard real content backlog
   rather than being pure hygiene. A manual review pass would still
   tidy the tracker.

## Today's intent

No pending build-plan phase, no data backlog, cross-link drain and
content-gap queue both empty. Expect more single-fix `/iterate`
maintenance ticks — the corpus is clean per every mechanical survey
(content-gap, crosslink, companion, stale-GB, newsletter-gap,
OG-coverage, a11y-spec-coverage, article-parts-check,
article-language-check, tracker-linkage) as of pass 170. `/quiz/board`,
the stale group-buy frontmatter/prose gate, and the Critique gate
diagnostic remain the three highest-scored Pending candidates, all
still awaiting `/oversight` promotion — the queue hasn't moved in
three digests running.

## Tuning proposals

None this pass. No new mistuned-gate signal in the window: the two
live gaps this digest surfaces (critique staleness, cloud
workflow-push permission) both already have standing
`plan/PHASE_CANDIDATES.md` rows from earlier passes, unpromoted but
not newly worsened in a way that changes their shape — restating them
under **Needs you** rather than re-filing duplicate candidates. The
`/oversight` promotion-cadence gap (item 3 above) is also not filed as
a new candidate: it's a call about the user's own review cadence, not
a loop mechanism the loop can propose fixing on itself.
