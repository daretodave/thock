# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The loudest standing blocker in this repo just cleared, and nobody
had filed the paperwork.** Issue `#898` ("`ACTIONS_PAT` lacks
`workflows` scope — blocks all cloud fixes to
`.github/workflows/*.yml`") set its own closing condition on
2026-08-23: *"Close this issue once a cloud tick lands a
workflow-file change."* That happened on 2026-09-26T18:42:12Z —
commit `1e225605` (`Cloud-Run:` trailer present, run `36261927926`)
is a cloud `/march` tick that edited `.github/workflows/heartbeat.yml`
(the flatline-alarm debounce for `#1001`) and pushed clean, no
`workflows`-permission rejection. Nobody had come back to close the
issue in the 30+ hours since. This digest closed it, with the commit
as evidence, and updated the two `plan/PHASE_CANDIDATES.md` rows that
named it as their blocker — the standing `[score 6.0]` march.yml
crash-issue-dedupe fix and the `[score 5.5]` "cloud can't push
workflow files" candidate itself (recommended for closing at the next
`/oversight` pass) — both are now fully cloud-shippable once
promoted.

**Also a genuinely clean drain window otherwise.** Since the last
digest (`8c1d5bb7`, 2026-09-26T14:51:27Z), 5 cloud `march` ticks
completed — all `success`, HEAD advanced 8 commits (`8c1d5bb7` →
`7cdce8b0`, ~24.4h). One tick shipped the heartbeat debounce fix
itself (closes `#1001`); the next three consecutive ticks each
drained a full cross-link hub in one commit — `pcb-flex-cuts-explained`
(5 pairs, `8829de53`), `keyboard-cleaning-maintenance-guide` (4 pairs,
`2a67db98`), `wireless-keyboard-buying-guide` (2 pairs, `a4873e46`) —
11 of the 12 open `[cross-links] [4.5]` rows gone in one window.
`plan/AUDIT.md` open rows dropped from 24 to 12 (before this digest's
own additions). One process gap surfaced in the pulse review: issue
`#1006` (the pcb-flex-cuts hub finding) was fully addressed by
`8829de53` but that commit omitted the mandatory `Closes #N` trailer
(`skills/iterate.md:412`), so the issue sat open despite the fix
being live. Filed as `plan/AUDIT.md` `[process] [2.7]` and closed
in the same tick — metadata-only, no code change.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files), 230/230 script tests (83 suites), `data:validate`
(88 records, all cross-refs resolve: 11 vendors / 18 switches / 10
keycap-sets / 10 boards / 18 group-buys / 21 trends), a clean
production build, `size` OK (all four tracked tool routes under
budget), and 1271/1271 e2e (~8.3m against `next start :4173`). Same
benign `Error: Internal: NoFallbackError` stderr noise on
dynamic-route fallback lookups as every prior digest — not attached
to any failing test. Deploy is `READY` at HEAD (`7cdce8b0`).

**Still the second-loudest standing item: `plan/CRITIQUE.md` is 139
days stale** (last real pass 2026-05-10T20:35:00Z, pass 11,
`931c8a7`) — unchanged this window. Root cause is structural, not a
bug: cloud mode categorically cannot run `/critique` (the `reader`
sub-agent needs Chrome MCP, unavailable on the runner), and every
commit in the last several months has been a cloud tick. This is a
standing `[needs-user-call]` decision, not something today's `#898`
resolution touches — it needs a conscious `/oversight` call.

## While you were out

| When (UTC, 09-26/09-27) | Tick | Outcome |
|---|---|---|
| 18:16→18:44 | cloud march | **shipped** — heartbeat.yml flatline-alarm debounce (`1e225605`), closes `#1001`; this is also the commit that resolved `#898` (unnoticed until this digest) |
| 21:46→22:03 | cloud march | opened issue `#1006` (pcb-flex-cuts-explained cross-links hub, 5 pairs) |
| 00:10→00:25 | cloud march | **shipped** — pcb-flex-cuts-explained cross-links, 5 pairs drained (`8829de53`) — commit omitted the `Closes #1006` trailer |
| 06:08→06:35 | cloud march | **shipped** — keyboard-cleaning-maintenance-guide cross-links, 4 pairs drained (`2a67db98`) |
| 12:41→13:07 | cloud march | **shipped** — wireless-keyboard-buying-guide cross-links, 2 pairs drained (`a4873e46`) |

5 completed `march`-workflow runs since the last digest: **5 success,
0 failure, 0 cancelled, 4 shipped ticks, 1 issue-open tick.**
`lighthouse` ran 5 times this window (18:43:50, 00:25:44, 06:35:08,
13:07:34, plus the 14:52:36 tick right after the last digest landed —
all `success`). `night` (this workflow) last completed run was the
2026-09-26 digest (`success`); this tick is the current one.

## Shipped

- **fix**: heartbeat.yml flatline-alarm debounce (`1e225605`) —
  closes `#1001`, requires two confirming reads ≥14h apart before
  filing a flatline issue. Also the commit that satisfied `#898`'s
  own closing condition (a cloud tick landing a workflow-file
  change) — see Headline.
- **content/cross-links**: `pcb-flex-cuts-explained` — 5 pairs
  drained in one commit (`8829de53`), hub-clustered per phase 46.
- **content/cross-links**: `keyboard-cleaning-maintenance-guide` —
  4 pairs drained in one commit (`2a67db98`).
- **content/cross-links**: `wireless-keyboard-buying-guide` — 2
  pairs drained in one commit (`a4873e46`).
- **this digest tick**: closed `#898` (evidence: `1e225605`) and
  `#1006` (evidence: `8829de53`, retroactive — the shipping commit
  omitted the mandatory trailer); annotated the two
  `plan/PHASE_CANDIDATES.md` rows that named `#898` as their
  blocker; filed and immediately resolved `plan/AUDIT.md`
  `[process] [2.7]` for the missing trailer.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **12 open rows, down from 24** in the prior
  digest (the `[process] [2.7]` row this digest filed was also
  resolved in the same tick, so it doesn't add to this count).
  Breakdown: 5 standing sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]`
  Mode Sonnet hero-art 65%→75%, `[content] [2.4]` plate-materials
  tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art, `[data]
  [2.4]` generated-manifest drift, `[seo] [1.8]` orphaned
  `favicon.svg`); 4 `[needs-user-call]` rows unchanged
  (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`,
  soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain
  gap `[3.0]`); **1 remaining `[cross-links] [4.5]` row** (down from
  12 — `wooting-rapid-trigger-head-start` ↔
  `hall-effect-rapid-trigger-plateau`, the only pair left after this
  window's 3 hub drains); **2 standing `[data] [3.6]` rows**
  unchanged (`divinikey-gmk-cyl-just-beachy`,
  `divinikey-gmk-cyl-orange-alert` — both stale group-buy statuses,
  ease-9 single-field fixes, passed over for 3 consecutive ticks in
  favor of the cross-link hubs). The `[user-issue #1001] [4.8]` row
  is now `[x]` addressed.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **139 days stale, unchanged.** Standing
  `[needs-user-call]` decision; see Headline.
- **`plan/PHASE_CANDIDATES.md`**: pass 432 (2026-09-25) still the
  most recent expand pass — unchanged this window (no new commits
  crossed the 20-commit/48h gate threshold since). **36 pending rows**
  (35 `[ ]` + 1 `[needs-user-call]`), unchanged in count, but **2 of
  them just got their blocking condition resolved this tick** (see
  Headline): the `[score 6.0]` march.yml crash-dedupe fix and the
  `[score 5.5]` cloud-workflow-push candidate (recommended for
  closing outright — its own fix already shipped locally in August).
  Last promotion: phase 50, 2026-08-23 — **35 days ago.** Highest-
  scored pending row is still `[7.5]` automated
  content-fact-vs-catalog numeric-spec audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 3 open — `#1006` closed this digest tick (fix
  already shipped, trailer missing), `#1001` closed this window
  (heartbeat fix), `#898` closed this digest tick (condition met).
  Currently open: none of those three remain; `#929`
  (`triage:reviewed`, informational, unchanged) is the only
  longstanding item still open. 0 unlabeled issues.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential
foreground calls:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — 862/862 unit tests passed (109 files, apps/web) —
  unchanged from the prior digest
- `test:scripts` — 230/230 passed (83 suites) — unchanged
- `data:validate` — 88 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 21 trends) — unchanged from the prior digest
- `build` — clean production build (regenerates the 3
  `*.generated.json` runtime files — discarded before this commit,
  same standing `[data] [2.4]` drift row, not re-filed)
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1271/1271 passed (~8.3m), against `next start :4173` —
  unchanged count from the prior digest (this window's cross-link
  edits don't add new canonical URLs). Same benign `Error: Internal:
  NoFallbackError` stderr noise on dynamic-route fallback lookups as
  prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red.
`deploy:check` at HEAD (`7cdce8b0`) reports `READY`.

## Needs you

1. **`plan/CRITIQUE.md` is 139 days stale** — the fresh-eyes loop
   has been off for over four and a half months. Root cause
   confirmed (cloud categorically can't run it), sitting as a
   standing `[needs-user-call]` decision — worth a conscious call
   rather than letting it drift further.
2. **Two `plan/PHASE_CANDIDATES.md` rows are ready for a promotion
   decision now that `#898` is resolved**: the `[score 6.0]`
   march.yml crash-issue-dedupe fix (one-line query fix, fully
   scoped, no longer blocked) and the `[score 5.5]` "cloud can't
   push workflow files" candidate itself (recommend closing outright
   — the underlying capability gap is gone). Both can ship as
   ordinary cloud picks once promoted.
3. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast
   WCAG 1.4.11 `[1.3]` (accept heavier dark-mode borders or a
   lighter-touch alternative), GTM consent-gate `[3.6]` (consent-gate
   vs. revert to cookieless Plausible), soft-404 structural
   trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
4. **36 pending phase candidates**, 35 days since the last
   promotion — cloud cannot promote by design. Worth a batch
   `/oversight` pass, especially now that the two `#898`-blocked
   rows are unblocked and the `[7.5]` fact-audit row is still the
   highest-scored item waiting.

## Today's intent

The clearest next pick is the single remaining `[cross-links] [4.5]`
row: `wooting-rapid-trigger-head-start` ↔
`hall-effect-rapid-trigger-plateau` — one pair, one commit, no
cluster to batch since the hubs are drained. After that, the 2
standing `[data] [3.6]` stale-group-buy rows are the next-cheapest
pick (single-field status flips, ease 9) — they've now been passed
over for 3 consecutive ticks in favor of cross-link hubs; worth
picking up before a 4th tick skips them again. Beyond those,
`AUDIT.md` is otherwise down to the standing sub-3.0 and
`needs-user-call` items, which need a local `/oversight` pass rather
than an autonomous pick. The bigger news for cloud capability: with
`#898` resolved, the `[score 6.0]` crash-dedupe fix and the `[score
5.5]` workflow-push candidate are both ready for `/oversight`
promotion — once promoted, either can ship from a normal cloud tick
rather than waiting on a local session.

## Tuning proposals

**None new this tick.** The `#898` resolution and the `#1006`
trailer gap are both filed as findings/updates to existing rows
(`plan/PHASE_CANDIDATES.md`, `plan/AUDIT.md`), not new gate-tuning
proposals — `#898` was a capability gap that's already fixed (just
undocumented), and the missing `Closes #N` trailer was a one-off
execution slip against an existing, otherwise-consistently-followed
rule (`skills/iterate.md:412`), not evidence of a mistuned gate. All
5 ticks this window completed with a genuine `success` conclusion
and a clean commit or issue-open — no masked-crash evidence to
corroborate the standing crash-dedupe candidate beyond what's already
recorded. Nothing else in this window's pulse suggests a new
mistuned gate, ceiling, or cadence.
