# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The heartbeat's flatline alarm fired a THIRD false positive
(`#1010`, 2026-09-29T12:48:18Z) — same root cause as `#1007`, whose
fix this digest already diagnosed and scoped a day ago and which
still hasn't shipped.** `#1010` claimed "no completed march tick in
441h." march was never down: `gh run list --workflow march -L 30`
shows 30/30 success across 2026-09-27→2026-09-29 with no gap wider
than ~7h, and the last real tick before the alarm fired (11:02→11:14
UTC today) is well inside the hourly cadence. Reproducing the
heartbeat's own query live (`gh run list --workflow march --status
completed -L 1`, 5 back-to-back calls) returned the correct latest
run (`36559233498`) every time this tick — consistent with the
known ~20% miss rate being intermittent, not fixed. `.github/workflows/heartbeat.yml`
is byte-identical to what `#1007`'s evidence already flagged: still
filtering by `--status completed` instead of sorting an unfiltered
`-L 5` client-side. Closed `#1010` as a duplicate with the evidence
and escalated the existing `plan/AUDIT.md` `[user-issue #1007]`
row from `[4.2]` to `[5.6]` (impact 6→8) — a diagnosed, scoped,
one-line fix sitting unshipped through two more false alarms is a
sharper signal than the original finding.

**Otherwise: 4 completed `march` ticks since the last digest, all
`success`, 3 shipped real work.** 18:23→18:45 shipped the weekly
trend snapshot (`f8dd05f6`, 2026-W40). 23:39→23:55 drained the
`wooting-rapid-trigger-head-start` cross-link row (`482d0fa8` +
`69a83e92`) — **the standing `[cross-links] [4.5]` row flagged in
the last two digests is now closed.** 04:01→04:19 ran the full
content-gap cycle for the news pillar (row auto-filed, issue
`#1009` opened, `wooting-80he-plus-shipping-update.mdx` shipped,
finding closed) — Rule 1 hot-pursuit resolved same-tick. The 11:02
tick was a clean no-op. All issue trailers present and correctly
closed this window (`#1008`, `#1009`) — no repeat of the missing-
`Closes #N` process gap from two digests ago.

**This tick's own fresh `pnpm verify` is fully clean** — all 8 legs
green, run as sequential foreground calls per the standing rule:
typecheck (9 workspace projects), lint (0 warnings), 862/862 unit
tests (109 files), 230/230 script tests (83 suites), `data:validate`
(89 records, all cross-refs resolve: 11 vendors / 18 switches / 10
keycap-sets / 10 boards / 18 group-buys / 22 trends — trend count up
1 from the W40 snapshot), a clean production build, `size` OK (all
four tracked tool routes under budget, same figures as the prior
digest), and 1277/1277 e2e (~8.2m against `next start :4173`, up 6
tests from the new article + cross-link routes). Same benign `Error:
Internal: NoFallbackError` stderr noise on dynamic-route fallback
lookups as every prior digest — not attached to any failing test.
Deploy is `READY` at HEAD (`b6855ba8`) as of this tick's
`deploy:check`.

**Still the standing background item: `plan/CRITIQUE.md` is 142
days stale** (last real pass 2026-05-10T20:35:00Z, pass 11,
`931c8a7`) — unchanged this window, +1 day as expected. Same
structural root cause as every prior digest: cloud mode cannot run
`/critique` (the `reader` sub-agent needs Chrome MCP, unavailable on
the runner). Standing `[needs-user-call]` decision.

**The 2 standing `[data] [3.6]` stale-group-buy rows are still
unaddressed** (`divinikey-gmk-cyl-just-beachy`, endDate 2026-09-22
passed; `divinikey-gmk-cyl-orange-alert`, endDate 2026-09-14 passed)
— now passed over for a fourth consecutive digest window despite
being ease-9, single-field fixes. Flagged again below.

## While you were out

| When (UTC, 09-28/09-29) | Tick | Outcome |
|---|---|---|
| 18:23→18:45 | cloud march | **shipped** — weekly trend snapshot 2026-W40 (`f8dd05f6`) |
| 23:39→23:55 | cloud march | **shipped** — wooting-rapid-trigger-head-start cross-link drained (`482d0fa8`, `69a83e92`), closes #1008 |
| 04:01→04:19 | cloud march | **shipped** — news pillar content-gap cycle end-to-end: row filed, #1009 opened, article shipped, finding closed (`41fc3b15`…`b6855ba8`) |
| 11:02→11:14 | cloud march | no-op — nothing to dispatch |
| 12:48 | heartbeat | false-positive flatline, opened `#1010` (third occurrence) |
| 16:33 | night (this tick) | in progress |

4 completed `march`-workflow runs since the last digest: **4
success, 0 failure, 0 cancelled, 3 shipped ticks, 1 true no-op.**
`lighthouse` ran 3 times in this window (04:04, 04:06, 04:19 UTC,
clustered around the article ship), all `success`. `heartbeat` fired
its flatline alarm once in-window (12:48) — a false positive, see
Headline. `night` (this workflow) last completed run was the
2026-09-28 digest (`success`, 18:11→18:30); this tick is the
current one.

## Shipped

- **weekly trend snapshot 2026-W40** (`f8dd05f6`) — routine cadence.
- **`wooting-rapid-trigger-head-start` cross-link drain** (`482d0fa8`,
  `69a83e92`) — closed the standing `[cross-links] [4.5]` row,
  closes `#1008`.
- **news pillar content-gap fill** (`41fc3b15`, `3b7c469e`,
  `742493ee`, `b6855ba8`) — "Wooting's 80HE+ preorder starts shipping
  in two waves this fall," resolves Rule 1 hot-pursuit, closes
  `#1009`.
- **this digest tick**: escalated `plan/AUDIT.md`
  `[user-issue #1007]` from `[4.2]` to `[5.6]` with `#1010`'s
  evidence; closed `#1010` as a duplicate false positive.

## Queues now

- **Build plan**: 52/52 phases shipped. 0 pending. Loop stays in
  `/iterate` mode until a new phase is promoted via `/oversight`.
- **`plan/AUDIT.md`**: **12 open rows** (8 `[ ]` + 4
  `[needs-user-call]`), down from 13 net of this window's churn —
  the `[cross-links] [4.5]` row closed, one `[content-gap] [7]` row
  opened and closed same-tick, and the `[user-issue #1007]` row
  escalated in place (not newly added). Breakdown: 5 standing
  sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art
  65%→75%, `[content] [2.4]` plate-materials tension, `[seo] [2.0]`
  cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-
  manifest drift, `[seo] [1.8]` orphaned `favicon.svg`); 4
  `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11
  `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off
  `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`); **2 standing
  `[data] [3.6]` rows unchanged** (`divinikey-gmk-cyl-just-beachy`,
  `divinikey-gmk-cyl-orange-alert`) — passed over for a fourth
  consecutive window (see Headline); **1 escalated
  `[user-issue #1007] [ci] [5.6]`** row — now the highest-scored
  open AUDIT item.
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z
  (pass 11, `931c8a7`) — **142 days stale, +1 day.** Standing
  `[needs-user-call]` decision; see Headline.
- **`plan/PHASE_CANDIDATES.md`**: pass 433 (2026-09-27) still the
  most recent expand pass, unchanged this window — **34 consecutive
  no-new-candidate passes** since pass 399. **36 pending rows**
  unchanged (35 `[ ]` + 1 `[needs-user-call]`). Last promotion:
  phase 50, 2026-08-23 — **37 days ago.** Highest-scored pending row
  is still `[7.5]` automated content-fact-vs-catalog numeric-spec
  audit.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: 2 open at pulse start (`#1010`, `#929`);
  `#1010` closed this digest tick as a duplicate false positive (see
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
- `data:validate` — 89 records valid, cross-refs resolve
  (11 vendors / 18 switches / 10 keycap-sets / 10 boards /
  18 group-buys / 22 trends — trend count +1 from the W40 snapshot)
- `build` — clean production build (regenerates the 3
  `*.generated.json` runtime files — discarded before this commit,
  same standing `[data] [2.4]` drift row, not re-filed)
- `size` — all tracked routes comfortably under budget, unchanged
  figures from the prior digest (`/quiz/switch` 145.2 KB,
  `/quiz/keycap-set` 145.3 KB, `/compare/switch` and
  `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — 1277/1277 passed (~8.2m), against `next start :4173` — up
  6 tests from the prior digest (new article + cross-link routes).
  Same benign `Error: Internal: NoFallbackError` stderr noise on
  dynamic-route fallback lookups as prior digests — not attached to
  any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red. The
escalation filed this tick (`#1007`, now `[5.6]`) came from pulse
review, not the verify gate. `deploy:check` at HEAD (`b6855ba8`)
reports `READY`.

## Needs you

1. **The heartbeat flatline alarm has now false-positived three
   times** (`#1001`-era, `#1007`, `#1010`) against the same
   unfixed root cause — a scoped, one-line query fix has sat
   diagnosed in `plan/AUDIT.md` since 2026-09-28 with no `/iterate`
   pick. Worth a direct nudge or promotion if autonomous
   prioritization keeps passing it over.
2. **`plan/CRITIQUE.md` is 142 days stale** — the fresh-eyes loop
   has been off for over four and a half months. Root cause
   confirmed (cloud categorically can't run it), sitting as a
   standing `[needs-user-call]` decision — worth a conscious call
   rather than letting it drift further.
3. **The 2 standing `[data] [3.6]` stale-group-buy rows have now
   been passed over for a fourth consecutive digest window** despite
   being ease-9, single-field fixes clearing the qualifying bar —
   same open question as the last two digests: whether `/iterate`'s
   selection logic is systematically deprioritizing small
   data-hygiene rows, or whether there's a reason these ticks keep
   choosing other work.
4. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast
   WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404
   structural trade-off `[4.2]`, `loop:opened` mirror-drain gap
   `[3.0]`.
5. **36 pending phase candidates, 37 days since the last
   promotion** — cloud cannot promote by design. Worth a batch
   `/oversight` pass, especially with the `[7.5]` fact-audit row
   still the highest-scored item waiting.

## Today's intent

The clearest next pick is now the escalated `[user-issue #1007]
[ci] [5.6]` heartbeat query fix — scoped, evidenced twice over, and
the highest-scored open AUDIT row. Right behind it: the 2
`[data] [3.6]` stale-group-buy rows, cheap and now four windows
overdue. The prior digest's cross-link and content-gap picks both
shipped this window, which is a good sign the loop is draining
qualifying work — the heartbeat fix and the group-buy rows sitting
unpicked despite clearing the bar is the one pattern worth watching.
Beyond those, `AUDIT.md` is otherwise down to the standing sub-3.0
and `needs-user-call` items, which need a local `/oversight` pass
rather than an autonomous pick.

## Tuning proposals

**None new this tick.** The third heartbeat false positive is a
recurrence of an already-filed, already-scoped `plan/AUDIT.md`
finding (a one-line query fix to an existing workflow step), not
fresh evidence of a mistuned gate, cadence, or ceiling — it's
routed via escalation of the existing row rather than a new
candidate. The 34-consecutive-no-candidate `/expand` streak is
unchanged from the prior digest and already tracked as a pending
`[score 3.6]` candidate. Nothing else in this window's pulse
suggests a new mistuned gate, ceiling, or cadence.
