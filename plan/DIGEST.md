# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A clean ~23.3h window — 20 `march` runs (15 success, 4 failure, 1
cancelled), 14 substantive ticks (10 shipped fixes/data + 4 `expand`
passes) and the rest no-ops or infra hiccups, for 24 commits total.**
Since the last digest (`37a3ca8e`, 2026-08-06T11:36:52 UTC) the loop
drained 10 `plan/AUDIT.md` findings — all self-discovered by fresh
`/iterate` audit sweeps (no pending build-plan phase, data backlog,
or cross-link work exists to draw from): a quiz scoring edge case
(result cards showed "0% match" for a legitimate no-signal answer
set instead of a distinct no-signal state), an `InlineViz` docstring
that had drifted from the desktop layout math actually shipped, the
primary nav's `Tools` item failing to mark itself current on
`/quiz/*`/`/compare/*` pages, a dead tag (`tray-mount` had zero
article usage despite `mounting-styles-compared` carrying a
dedicated section on it — tagged in the same tick), two stale
tracker-score superlatives in editorial copy (`work-louder-openai-
codex-micro`'s Update callout cited a since-rotated "highest of any
row" claim; `thock-weekly-004` claimed an unqualified "top score,
full stop" that a same-snapshot vendor row already beat — the third
and fourth instance of this exact false-superlative bug class this
week), two missing group-buy records (`gmk-cyl-og-extensions`, a
live buy fully described in its own article and the latest
newsletter but absent from `/group-buys`; `gmk-cyl-ta-neo`, a closed
buy in the same shape, absent from `/group-buys/past` — both shipped
with `brander`-rendered hero art per the Phase 23 rule), a homepage
a11y regression (group-buy thumbnails rendered `alt=""` instead of
each record's authored `heroImageAlt`), and a dead-field cleanup
(`GroupBuySchema.imageUrl` was never rendered anywhere — removed
along with its schema entry and the 6-day-old alt-text fix's own
data dependency). `/expand` ran 4 passes (290-293), all
zero-candidate — normal cadence. This tick's own fresh `pnpm verify`
is green across all eight legs, run as sequential foreground
blocking calls: typecheck (9 packages), lint (all lintable
workspaces), 975 unit tests site-wide (793 web / 106 files, up from
789/106; 182 script tests / 65 suites, unchanged), 78 data records /
cross-refs resolve (up from 76 — the two new group-buy records), a
clean build across all canonical routes, homepage bundle 108.7 KB /
200 KB (unchanged), and 1131/1131 e2e (up from 1128/1128, +3).
Deploy is `READY` at HEAD (`b207ecae`, `dpl_CSvtJd2c`).

Four consecutive `march` runs (16:34-20:12 UTC on 08-06) failed with
a distinct new signature — **"The job was not acquired by Runner of
type hosted even after multiple attempts"** — a GitHub Actions
hosted-runner capacity/queueing failure, not a thock code or gate
problem. No commit was lost (each failed run made no commit at all;
the job never started). Self-recovered by the 22:57 UTC run with no
manual intervention. See Needs you for why this is a distinct blind
spot from the standing `[6.3]` crash-gate row.

`plan/CRITIQUE.md` is now **89 days / 2063 commits** since its last
pass (11, 2026-05-10T20:35 UTC at commit `931c8a7`) — unchanged
diagnosis: cloud mode architecturally cannot reach `/critique` (no
Chrome MCP on the runner; `.github/workflows/march.yml` explicitly
skips it), and every commit this window again carries the
`Cloud-Run:` trailer, so the gap keeps growing by construction until
a human decision lands. `plan/PHASE_CANDIDATES.md` holds **22
pending rows + 1 needs-user-call**, unchanged (0 new candidates this
window — all 4 expand passes returned zero), now **54 days** since
the last promotion (2026-06-14, phases 46-49). `plan/AUDIT.md`
carries **4** open rows, all `/oversight`-gated or blocked, not
actionable by an autonomous tick — unchanged from yesterday: the
march.yml `[6.3]` crash-gate row, the Lighthouse-CI `[4.0]` row, the
soft-404 `[needs-user-call]` `[4.2]` row, and the heartbeat.yml
`[4.0]` row.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 08-06 11:37 | digest | 2026-08-06 |
| 08-06 11:46 | iterate | fix — quiz result cards "0% match" no-signal case `[3.5]` (`27cf2419`/`585e4950`) |
| 08-06 12:39 | iterate | engineering — InlineViz docstring drift `[3.6]` (`17740e29`/`3e303e1f`) |
| 08-06 13:33 | iterate | enhancement — primary nav Tools active-state gap `[4.0]` (`9180dc0a`/`a4d78d48`) |
| 08-06 14:47 | expand | pass 290 — 0 candidates filed (`28c63cb4`) |
| 08-06 15:46 | march | cancelled — committed expand pass 291 (`235680b4`) before the run itself was cancelled |
| 08-06 16:34 | march | failed — GH Actions runner-acquisition infra error, no commit |
| 08-06 17:33 | march | failed — same infra error, no commit |
| 08-06 18:30 | march | failed — same infra error, no commit |
| 08-06 20:12 | march | failed — same infra error, no commit; self-recovered next tick |
| 08-06 22:57 | march | no-op — nothing additionally actionable this tick |
| 08-07 00:46 | march | no-op — nothing additionally actionable this tick |
| 08-07 01:47 | expand | pass 292 — 0 candidates filed (`f582a46d`) |
| 08-07 03:01 | expand | pass 293 — 0 candidates filed (`27d89121`) |
| 08-07 04:39 | iterate | content — tray-mount dead tag `[3.6]` (`1e867d7b`/`f1c475e0`) |
| 08-07 05:32 | iterate | content — codex-micro stale snapshot superlative `[4.5]` (`cb7b80f4`/`2e1b5f13`) |
| 08-07 06:25 | iterate | content — thock-weekly-004 false tracker superlative `[4.5]` (`d428877c`/`f07c9a7f`) |
| 08-07 07:30 | iterate | data — gmk-cyl-og-extensions live buy missing from index `[4.2]` (`f3c31c06`/`89972cf5`) |
| 08-07 08:24 | iterate | data — gmk-cyl-ta-neo closed buy missing from index `[6.3]` (`cf8a0548`/`b1a4ae6f`) |
| 08-07 09:21 | iterate | a11y — homepage group-buy alt-text gap `[4.5]` (`c9c4b742`/`08c8479e`) |
| 08-07 10:19 | iterate | engineering — GroupBuySchema.imageUrl dead-field cleanup `[3.2]` (`a33bfa9a`/`b207ecae`) |

20 `march`-workflow runs since 2026-08-06T11:36:52 UTC: **15
`success`, 4 `failure`** (all four the same GH Actions
runner-acquisition infra error, clustered 16:34-20:12, cleared on
the next tick, no commit lost), **1 `cancelled`** (a partial run
that still landed its commit before being cancelled).

## Shipped

- **content fact-checks (3)**: `tray-mount` tag had zero article
  usage despite `mounting-styles-compared` carrying a dedicated
  section on it (tagged); `work-louder-openai-codex-micro`'s Update
  callout claimed a tracker score was "the highest of any row in the
  current snapshot" — true when written, false since the snapshot
  rotated (reworded to name the specific week); `thock-weekly-004`
  claimed a switch's score was "the tracker's top score, full stop"
  when a vendor row in the same snapshot scored higher (rescoped to
  "highest switch-category reading" — the third and fourth instance
  of this false-superlative bug class fixed this week, following
  `thock-weekly-006` and `hmx-cloud-deep-dive` in the prior two
  windows).
- **fix (2)**: quiz result cards rendered "0% match" for a
  legitimate no-signal answer set instead of a distinct no-signal
  state; primary nav's `Tools` item didn't mark itself current on
  `/quiz/*` or `/compare/*` pages (the four tools it links to don't
  nest under `/tools/`) — same nav-active-state bug class the site
  already fixed for pillar routes, but the Tools item's non-nesting
  children slipped through that fix's own test suite.
- **data (2)**: two group-buy records missing from their canonical
  indexes — `gmk-cyl-og-extensions` (live, absent from
  `/group-buys`) and `gmk-cyl-ta-neo` (closed, absent from
  `/group-buys/past`) — both fully described in their own articles
  and the latest newsletter but never given a `data/group-buys/*`
  record. Both shipped with `brander`-rendered hero art per the
  Phase 23 rule, vendor/date facts for TA Neo confirmed via `scout`
  research against the live vendor listing.
- **a11y (1)**: homepage group-buy thumbnails rendered `alt=""`
  instead of each record's authored `heroImageAlt`.
- **engineering (2)**: an `InlineViz` docstring that had drifted
  from the desktop layout math actually shipped; `GroupBuySchema`'s
  `imageUrl` field was dead code — never rendered anywhere — removed
  along with its schema entry, cleaning up after the alt-text fix
  landed in the same window.
- **expand**: 4 passes (290-293), all zero-candidate — fresh
  general-purpose sweeps found nothing above the 3.0 bar. Normal
  cadence, not starvation.

## Queues now

- **Build plan**: 0 pending phases (51 shipped), unchanged — pure
  `/iterate` maintenance mode.
- **Cross-link drain**: 0 pending rows, unchanged.
- **`plan/AUDIT.md`**: **4 open rows** (934 addressed, up from 924 —
  10 findings closed this window). `[6.3]` march.yml crash-gate
  (blocked-cloud-permission, filed 2026-07-05); `[4.0]` Lighthouse-CI
  disabled (filed 2026-07-18, confirmed still `disabled_manually` via
  `gh workflow list`); `[needs-user-call] [4.2]` soft-404 structurally
  blocked (filed 2026-07-18); `[4.0]` heartbeat.yml dedup
  (blocked-cloud-permission, filed 2026-07-26). All four unchanged
  from yesterday.
- **`plan/CRITIQUE.md`**: pass 11, last pass 2026-05-10T20:35 UTC at
  commit `931c8a7`. **89 days / 2063 commits stale.** Diagnosis
  unchanged: cloud mode architecturally cannot reach `/critique` (no
  Chrome MCP; every commit this window again carries `Cloud-Run:`).
  One `[needs-user-call]` row remains Pending (GA `/g/collect` 503s,
  filed pass 8) — outside the repo, not actionable by a shipping
  skill.
- **`plan/PHASE_CANDIDATES.md`**: **22 pending rows + 1
  needs-user-call**, unchanged (0 new candidates this window — all 4
  expand passes returned zero), **54 days** since the last promotion
  (2026-06-14, phases 46-49). Top of the cluster: three `7.0`s
  (trend-snapshot data-quality gate, automated
  content-fact-vs-catalog numeric-spec audit, article
  internal-consistency checker — all still unshipped). This window's
  two false-superlative content fixes are fresh evidence for the
  numeric-spec-audit candidate specifically (its third and fourth
  documented instance of the class it targets).
- **`data/BACKLOG.md`**: 0 pending rows, unchanged (all rows under
  `## Pending` are marked `[x]` shipped — a filing-hygiene quirk, not
  live work).
- **Triage**: **16 open issues**, 0 unlabeled — unchanged. Ten
  issues opened and closed same-window (`#761`-`#770`, one per
  finding shipped this tick). No new `triage:needs-user` issue this
  window — the four GH Actions runner-acquisition failures never
  reached a step that could file one (see Needs you). Four
  `triage:needs-user` issues remain open, all standing: `#756` (1
  day old), `#639` (10 days old), `#499` (22 days old), `#434` (28
  days old).
- **Expand cadence**: 4 passes this window (290-293), all
  zero-candidate. Normal cadence, no starvation signal.

## Breadth verdict

Full `pnpm verify` run fresh, foreground, as eight sequential blocking
legs (typecheck → lint → test:run → test:scripts → data:validate →
build → size → e2e) — all green:

- `typecheck` — green, all 9 workspace packages.
- `lint` — green, all lintable workspaces (`apps/web` via `next lint`
  — still flags its own deprecation ahead of Next.js 16 removal, a
  future-maintenance note rather than a defect; `packages/*` via
  `eslint`).
- `test:run` — green, 793 web unit tests (106 test files, up from
  789/106).
- `test:scripts` — green, 182 tests / 65 suites, unchanged.
- `data:validate` — green, 78 records walked, cross-refs resolve (10
  vendors, 18 switches, 10 keycap-sets, 10 boards, **16 group-buys**
  — up from 14, the two records shipped this window — 14 trend
  weeks).
- `build` — green, all canonical routes generated, unchanged.
- `size` — green, homepage gzip 108.7 KB / 200 KB budget, unchanged.
- `e2e` — green, **1131/1131**, up from 1128/1128 (~6.8m, single
  worker). Server stderr again logged `NoFallbackError` several dozen
  times against the five `dynamicParams = false` routes (`/part/[kind]`,
  `/part/[kind]/[slug]`, `/vendor/[slug]`, `/trends/tracker/[week]`,
  `/newsletter/[slug]`) — same non-blocking shape flagged in recent
  digests, Next's expected internal log for not-found-page e2e tests
  hitting a param outside the pre-generated set. Every one of the
  1131 tests still passed.
- `pnpm deploy:check` at HEAD (`b207ecae`) — deploy `READY`
  (`dpl_CSvtJd2c`).
- `lighthouse` — confirmed via `gh workflow list`: `state:
  disabled_manually`, same standing `[4.0]` AUDIT row, no new signal
  this window.

No red `pnpm verify` legs, and no new breadth-check finding this
tick.

## Needs you

1. **New: a distinct march-workflow failure shape — "job not
   acquired by Runner of type hosted."** Four consecutive runs
   (16:34-20:12 UTC, 08-06) failed before the job ever started —
   this is a GitHub Actions hosted-runner capacity/queueing issue,
   not a thock code or gate problem, and self-recovered with no
   commit lost. It's worth flagging separately from the standing
   `[6.3]` crash-gate row because that row's scope is "the job ran
   and a step failed, but `success()` swallowed it" — here, no step
   ever ran, so there was nothing inside the job that *could* file a
   crash issue. If this recurs, the loop has a genuine blind spot:
   a run that fails before it starts leaves no trace anywhere except
   the workflow-run list itself. No in-repo remediation exists today
   (GitHub Actions runner capacity is outside the repo); worth an
   `/oversight` look if it recurs more than this once.
2. **Standing, unclosed: orphaned duplicate GitHub issue `#719`.**
   Still open; the MobileNav focus-containment defect it names was
   fixed same-day by `6ef381e3` weeks ago (closed via a different
   issue, `#722`). Cheap to close by hand
   (`gh issue close 719 -c "duplicate of #722, fixed by 6ef381e3"`).
3. **Standing, growing: the `/oversight` promotion backlog.** 22
   pending candidates + 1 needs-user-call, now **54 days** since the
   last promotion. Three candidates sit at `7.0` (trend-snapshot
   data-quality gate, content-fact-vs-catalog numeric audit, article
   internal-consistency checker) — this window's two false-
   superlative content fixes are live evidence for the numeric-audit
   candidate specifically (its third and fourth documented instance).
4. **Standing: the Critique-gate mystery stays diagnosed but
   undecided.** 89 days / 2063 commits since pass 11. Needs a
   decision: accept `/critique` as local-only ritual, find a
   cloud-compatible path, or something else.
5. **Standing: Lighthouse CI has been disabled and failing for 8+
   weeks — `/oversight` call needed.** Unchanged since last digest.
6. **Standing: four unresolved `triage:needs-user` GitHub issues.**
   `#756` (1 day old), `#639` (10 days old), `#499` (22 days old,
   not self-resolved), `#434` (28 days old, not self-resolved).
7. **Standing: two blocked-cloud-permission rows** (march.yml `[6.3]`,
   heartbeat.yml `[4.0]`) — both fixes written and verified, neither
   can ship because the cloud push credential lacks `workflows` scope
   for `.github/workflows/*.yml` edits.
8. **Standing, out-of-repo: GA `/g/collect` 503s** — `plan/CRITIQUE.md`
   pass-8 `[needs-user-call]` row, unactionable by any shipping skill
   since the analytics property lives outside the codebase.

## Today's intent

No pending build-plan phase, no data backlog, no cross-link backlog,
no autonomously-actionable `plan/AUDIT.md` row (all four open rows
are blocked or `/oversight`-gated). The next `/march` tick will most
likely repeat this window's pattern: a fresh reactive `/iterate` fix
off a general-purpose sweep, or another `/expand` pass. The
highest-leverage next move isn't a new fix — it's an `/oversight`
pass covering, in one sitting: the standing 22-row candidate cluster
(three `7.0`s, now 54 days stale — two of them targeting exactly the
defect class this window's numeric fact-checks caught by hand), the
Critique-gate decision, the Lighthouse re-enable decision, the two
blocked workflow-permission fixes, and (small) closing the orphaned
`#719` duplicate issue by hand.

## Tuning proposals

None new this pass. 15/20 `march` runs succeeded this window; the 4
failures were a single clustered GH Actions runner-acquisition
infra incident (not a gate or ceiling problem) that self-recovered
without intervention — filed as a fresh observation under Needs you
rather than a tuning proposal, since one clustered incident doesn't
yet clear the §4A "3+ findings under the same category" bar and
there's no in-repo lever to pull for GitHub-side runner capacity.
`/expand`'s 4 passes this window (all zero-candidate) is within
normal cadence, not starvation. No cron-gap evidence of the
commit/24h ceiling hibernating a productive stretch (runs landed
roughly hourly all window outside the infra cluster, 24 commits
total). The critique-gate staleness (89 days), the 22-row
`/oversight` backlog, and the four standing `triage:needs-user`
issues remain standing, already-diagnosed decisions awaiting a human
call, not new tuning signals — all covered under Needs you rather
than re-proposed here.
