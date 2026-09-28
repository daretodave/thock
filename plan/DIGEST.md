# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**A genuinely quiet 27-hour window, and this digest's own pulse
review turned up the one thing worth knowing: the heartbeat's
flatline alarm fired a second false positive, and the fix that was
supposed to prevent it (`1e225605`, 2026-09-26) didn't hold.**
Issue `#1007` ("march has flatlined") was opened 2026-09-28T13:48:03Z
claiming no completed `march` tick in 418h. `march` was never down —
`gh run list --workflow march -L 5` at digest time shows unbroken
3-7h-apart successful ticks straight through. Reproducing the
heartbeat's own check live (`gh run list --workflow march --status
completed -L 1`) five times back-to-back turned up the mechanism: 4
of 5 calls returned the correct latest run, and 1 of 5 returned a
stable, 17-day-old stale run (`2026-09-11`, ~408h — matching the
issue's reported gap almost exactly) with zero other variable than
call timing. The 2026-09-26 fix assumed the failure mode was "a
single transient/empty read" and added a 60s-later retry of the
*same* query — but this class of flakiness returns a confident wrong
answer, not an empty one, so a bad-luck pair of reads 60s apart can
still confirm each other. Filed `plan/AUDIT.md` `[user-issue #1007]
[ci] [4.2]` with the live reproduction and a scoped fix (stop
filtering by `--status completed`; sort unfiltered results
client-side by `createdAt` and take the newest `success`). Closed
`#1007` with the evidence so the existing-issue dedupe doesn't
suppress the next alarm.

**Otherwise: 5 completed `march` ticks since the last digest, all
`success`, but only one produced a commit** — `expand: pass 433 — no
candidates` (`6747859f`). The other 4 ticks (17:26, 20:47, 23:35,
03:25, 10:29 UTC) shipped nothing at all, not even a plan-only
commit — no unlabeled issues, no pending phase/data work, content-gap
comfortable, expand's own 20-commit/48h gate not met, and `/iterate`
apparently found nothing it judged worth shipping despite 3 clearly
actionable open `AUDIT.md` rows (1 `[cross-links] [4.5]`, 2
`[data] [3.6]` stale group-buy statuses, all ease-9+ single-touch
fixes). This is now several consecutive ticks passing over the same
cheap, qualifying work — flagged below, not investigated further
this tick (out of scope for a notes-only digest commit).

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files), 230/230 script tests (83 suites), `data:validate`
(88 records, all cross-refs resolve: 11 vendors / 18 switches / 10
keycap-sets / 10 boards / 18 group-buys / 21 trends), a clean
production build, `size` OK (all four tracked tool routes under
budget, identical figures to the prior digest), and 1271/1271 e2e
(~8.3m against `next start :4173`). Same benign `Error: Internal:
NoFallbackError` stderr noise on dynamic-route fallback lookups as
every prior digest — not attached to any failing test. Deploy is
`READY` at HEAD (`6747859f`) as of this tick's `deploy:check`.

**Still the standing background item: `plan/CRITIQUE.md` is 140
days stale** (last real pass 2026-05-10T20:35:00Z, pass 11,
`931c8a7`) — unchanged this window, +1 day from yesterday's count as
expected. Same structural root cause as every prior digest: cloud
mode cannot run `/critique` (the `reader` sub-agent needs Chrome MCP,
unavailable on the runner). Standing `[needs-user-call]` decision.

## While you were out

| When (UTC, 09-27/09-28) | Tick | Outcome |
|---|---|---|
| 17:26→17:30 | cloud march | no-op — nothing to dispatch |
| 17:29 | cloud march (same window) | **shipped** — `expand: pass 433 — no candidates` (`6747859f`) |
| 20:47→21:01 | cloud march | no-op — nothing to dispatch |
| 23:35→23:48 | cloud march | no-op — nothing to dispatch |
| 03:25→03:27 | cloud march | no-op — nothing to dispatch |
| 10:29→10:45 | cloud march | no-op — nothing to dispatch |
| 13:46 | heartbeat | flagged false-positive flatline, opened `#1007` |
| 18:23 | cloud march | in progress at digest time (started during this tick's breadth check) |

5 completed `march`-workflow runs since the last digest: **5
success, 0 failure, 0 cancelled, 1 shipped tick (plan-only), 4
true no-ops.** `lighthouse` ran twice in this window (17:30:22Z,
15:34:49Z — the latter right after the last digest's own push), both
`success`; no further runs since, consistent with no site-content
commits landing. `heartbeat` ran twice (05:17:50Z, 13:46:53Z), both
`success` by GitHub Actions conclusion — but the 13:46 firing's own
judgment (the flatline alarm) was a false positive, see Headline.
`night` (this workflow) last completed run was the 2026-09-27 digest
(`success`); this tick is the current one.

## Shipped

- **`expand` pass 433** (`6747859f`) — no new candidates filed;
  routine plan-only commit.
- **this digest tick**: filed `plan/AUDIT.md` `[user-issue #1007]
  [ci] [4.2]` (heartbeat flatline false positive, root cause
  reproduced live) and closed `#1007` with the evidence.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **13 open rows, up from 12** (this digest's
  new `[user-issue #1007] [ci] [4.2]` row). Breakdown: 5 standing
  sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art
  65%→75%, `[content] [2.4]` plate-materials tension, `[seo] [2.0]`
  cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-manifest
  drift, `[seo] [1.8]` orphaned `favicon.svg`); 4 `[needs-user-call]`
  rows unchanged (border-contrast WCAG 1.4.11 `[1.3]`, GTM
  consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`,
  `loop:opened` mirror-drain gap `[3.0]`); **1 `[cross-links] [4.5]`
  row unchanged** (`wooting-rapid-trigger-head-start` ↔
  `hall-effect-rapid-trigger-plateau`); **2 standing `[data] [3.6]`
  rows unchanged** (`divinikey-gmk-cyl-just-beachy`,
  `divinikey-gmk-cyl-orange-alert`) — now passed over for even more
  consecutive ticks (see Headline); **1 new `[user-issue #1007]
  [ci] [4.2]`** row, this digest's finding.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **140 days stale, +1 day.** Standing
  `[needs-user-call]` decision; see Headline.
- **`plan/PHASE_CANDIDATES.md`**: pass 433 (2026-09-27) still the
  most recent expand pass — **34 consecutive no-new-candidate passes**
  since pass 399 (the last pass that filed one). **36 pending rows**
  unchanged (35 `[ ]` + 1 `[needs-user-call]`). Last promotion: phase
  50, 2026-08-23 — **36 days ago.** Highest-scored pending row is
  still `[7.5]` automated content-fact-vs-catalog numeric-spec audit.
  Worth noting: one existing pending row (`[score 5.5]` "heartbeat.yml's
  flatline alarm measures 'last completed' not 'last successful'")
  is a *related but distinct* issue from this tick's `#1007` finding —
  that row is about fail-fast loops never tripping the alarm; today's
  finding is about the alarm's own read query returning wrong data.
  Both live in the loop's monitoring layer; worth a combined look at
  the next `/oversight` pass.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 2 open at pulse time (`#1007`, `#929`); `#1007`
  closed this digest tick with evidence (false positive, see
  Headline). Currently open: `#929` only (`triage:reviewed`,
  informational, unchanged, standing since 2026-08-25). 0 unlabeled
  issues.

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
  unchanged count from the prior digest (no new canonical URLs this
  window). Same benign `Error: Internal: NoFallbackError` stderr
  noise on dynamic-route fallback lookups as prior digests — not
  attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red. The
row filed this tick (`#1007`) came from pulse review, not the
verify gate. `deploy:check` at HEAD (`6747859f`) reports `READY`.

## Needs you

1. **`plan/CRITIQUE.md` is 140 days stale** — the fresh-eyes loop
   has been off for over four and a half months. Root cause
   confirmed (cloud categorically can't run it), sitting as a
   standing `[needs-user-call]` decision — worth a conscious call
   rather than letting it drift further.
2. **Two `plan/PHASE_CANDIDATES.md` rows have been ready for a
   promotion decision since 2026-09-27** (unchanged this window):
   the `[score 6.0]` march.yml crash-issue-dedupe fix and the
   `[score 5.5]` "cloud can't push workflow files" candidate
   (recommend closing outright — the underlying capability gap is
   gone per `#898`'s resolution). Both can ship as ordinary cloud
   picks once promoted.
3. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast
   WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404
   structural trade-off `[4.2]`, `loop:opened` mirror-drain gap
   `[3.0]`.
4. **36 pending phase candidates, 36 days since the last
   promotion** — cloud cannot promote by design. Worth a batch
   `/oversight` pass, especially with the `[7.5]` fact-audit row
   still the highest-scored item waiting and the two `#898`-unblocked
   rows sitting ready.
5. **The 2 standing `[data] [3.6]` stale-group-buy rows have now
   been passed over for several consecutive ticks** despite being
   ease-9, single-field fixes clearing the qualifying bar — worth a
   look at whether `/iterate`'s selection logic is systematically
   deprioritizing small data-hygiene rows in favor of other work, or
   whether these ticks are simply choosing not to act for reasons
   this digest's notes-only scope didn't dig into.

## Today's intent

The clearest next picks remain unshipped from the prior digest: the
single `[cross-links] [4.5]` row (`wooting-rapid-trigger-head-start`
↔ `hall-effect-rapid-trigger-plateau`) and the 2 `[data] [3.6]`
stale-group-buy rows — all three are cheap, qualifying, and have now
sat through multiple no-op ticks. Freshly available this tick: the
`[user-issue #1007] [ci] [4.2]` heartbeat query fix — scoped, evidenced,
and higher-priority than the standing sub-3.0 items. Beyond those,
`AUDIT.md` is otherwise down to the standing sub-3.0 and
`needs-user-call` items, which need a local `/oversight` pass rather
than an autonomous pick. The bigger standing opportunity for cloud
capability: with `#898` resolved, the `[score 6.0]` crash-dedupe fix
and the `[score 5.5]` workflow-push candidate are both ready for
`/oversight` promotion.

## Tuning proposals

**None new this tick.** The `#1007` false positive and its root
cause are filed as a normal `plan/AUDIT.md` finding (autonomously
drainable by the next `/iterate` tick, same as `#1001`'s fix was) —
not a gate/cadence/ceiling tuning proposal, since the fix is a
one-line query change to an existing workflow step, not a change to
loop policy. The 4-consecutive-no-op stretch and the
34-consecutive-no-candidate `/expand` streak are both real, but
both are already-tracked patterns (the `[score 3.6]` expand-cadence
candidate already sits in `plan/PHASE_CANDIDATES.md` Pending from an
earlier window) rather than fresh evidence of a newly mistuned gate.
Nothing else in this window's pulse suggests a new mistuned gate,
ceiling, or cadence.