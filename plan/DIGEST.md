# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Both open HOT PURSUIT rows from yesterday's digest shipped clean, same-day.** News `#1021` (filed 2026-10-10) shipped at the 06:54→07:28 UTC tick (`65b30e52`, "GMK CYL Zombie's group buy, open through October 31, is already thock's steepest Halloween climb"); the content-gap queue immediately refilled trends `#1022`, which shipped in the *same* 16:27→17:02 UTC tick that opened it (`06336a7e`, "TMR is closing the gap on Hall-effect. It hasn't caught it."). A fresh ideas-pillar HOT PURSUIT row (score 7.0, filed 2026-10-12, no sibling) is open now — the loop's usual shape.

**Side effect: the cross-link queue nearly tripled (8 → 23 rows) in one window.** Both new articles' own `article-crosslink-survey.mjs` passes filed a large batch of same-pillar, shared-tag pairs — 12 centered on the new GMK CYL Zombie piece alone, 3 on the new TMR tracker piece, plus the 7 carried `tmr-switches-deep-dive` pairs and 1 standalone. This is exactly the shape phase 46's cluster-aware drain exists for (one `/iterate` tick can drain all N pairs touching a hub article in a single commit) — logged as a queue-size fact, not an action item.

**Newsletter cadence is now materially stale, and this tick names a sharper reason why.** `#1019` (score 4.0, filed 2026-10-03) is **16 days** since the last issue against a 7-day threshold — up from 14 at the last digest. Tracing the standing `[score 6.5]` dispatch-order candidate in `plan/PHASE_CANDIDATES.md`: five separate HOT PURSUIT rows (`#1005`, `#1011`, `#1018`, `#1021`, `#1022`) have filed-and-shipped at a fixed score of 7.0 since the newsletter row was filed, while the newsletter's fixed 4.0 never had a chance under straight score-ranking. Filed an update to that candidate (not a new row) naming the mechanism precisely — see Tuning proposals.

**This tick's own fresh `pnpm verify` is fully green** — all 8 legs run as sequential foreground calls: typecheck, lint, 1243 unit tests (7 workspaces), 230 script tests, data:validate (91 records), a clean production build, `size` within budget, and **1301/1301 e2e** (~6.1m) against `next start :4173`. Deploy was `READY` at HEAD (`3abb5e4a`) going into this tick.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-11 16:36 | *(last digest committed, `1e2c688a`)* | baseline |
| 16:30→16:45 | cloud march | no commit — clean no-op |
| 20:45→20:49 | cloud march | no commit — clean no-op |
| 2026-10-12 00:10→00:26 | cloud march | **shipped** — Monday trend snapshot 2026-W42 |
| 06:54→07:28 | cloud march | **shipped** — news article, closed `#1021` |
| 16:27→17:02 | cloud march | **shipped** — opened + closed trends `#1022` same tick |
| now | night (this tick) | in progress |

5 completed `march`-workflow runs since the last digest: **5 success, 0 failure, 0 cancelled, 3 shipped ticks (6 commits total), 2 true no-ops.** 5 `lighthouse` runs visible since the last digest, all `success`. No `heartbeat` alarms surfaced in `gh issue list`.

## Shipped

**One Monday trend snapshot.** `data: trend snapshot 2026-W42` (`1f77988d`) — the weekly tracker cadence gate, routine.

**One news article.** `content: news — "GMK CYL Zombie's group buy, open through October 31, is already thock's steepest Halloween climb"` (`65b30e52`), audit row closed and issue `#1021` closed (`0735cfab`).

**One trends article, same-tick dispatch-and-close.** `audit: content dispatch opened issue #1022` (`c08a7380`) → `content: trends — "TMR is closing the gap on Hall-effect. It hasn't caught it."` (`06336a7e`) → `audit: content-gap finding addressed … closes #1022` (`3abb5e4a`), all inside one 35-minute tick window.

## Queues now

- **Build plan**: 0 pending phases, unchanged.
- **`plan/AUDIT.md`**: **34 open rows**, up from 14 at the last digest (the AUDIT.md-counting method is consistent; the jump is almost entirely the cross-link batch below). Breakdown: 5 standing sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]` plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]` orphaned `favicon.svg`); 1 `[newsletter] [4.0]` row (`#1019`, now **16 days** since issue 11 against a 7-day threshold, still unshipped); **23 `[cross-links] [4.5]` rows** (up from 8) — 12 centered on `gmk-cyl-zombie-group-buy`, 7 on `tmr-switches-deep-dive` (carried), 3 on `tmr-switches-five-week-climb`, 1 standalone (`switch-actuation-weight-buying-guide` ↔ `beginners-switch-buying-guide`); 4 `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`); 1 `[HOT PURSUIT]` row, a fresh single un-tied candidate (`[content-gap] [7.0]` ideas pillar, filed 2026-10-12, 0 days old).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z (pass 11, `931c8a7`) — **155 days stale.** Root cause remains the standing `[needs-user-call]` phase-candidate (cloud mode categorically cannot run `/critique` — no Chrome MCP on the runner); logging the running count, not re-diagnosing.
- **`plan/PHASE_CANDIDATES.md`**: pass 435 (2026-10-01, commit `b4d8dafb`) is still the most recent expand pass — no new pass fired this window. 35 `[ ]` + 1 `[needs-user-call]` pending, unchanged as distinct rows; the standing `[score 6.5]` dispatch-order candidate gets a new dated update this tick naming the newsletter-starvation mechanism (see Tuning proposals), not a new row, not re-scored. Last promotion: phase 50, 2026-08-23 — now ~7 weeks.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: `#1022` (trends content dispatch, opened and closed same tick, 2026-10-12); `#1019` (newsletter dispatch, open since 2026-10-06T17:55, now 16 days since last issue); `#929` (`triage:reviewed`, standing, unchanged). `#1021` closed cleanly this window. 0 unlabeled issues, 0 `triage:needs-user` issues. Same 6 open dependabot PRs unmerged (`#946`, `#947`, `#948`, `#990`, `#1003`, `#1017`), oldest since 2026-08-28 — noted for completeness, not a digest action item.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential foreground calls per the skill's own instruction:

- `typecheck` — clean
- `lint` — clean
- `test:run` — 1243/1243 unit tests passed across 7 workspaces (tokens 3, seo 44, data 129, ui 32, e2e 6, content 167, web 862)
- `test:scripts` — 230/230 script tests passed
- `data:validate` — 91 records valid, cross-refs resolve (vendors 11, switches 18, keycap-sets 10, boards 10, group-buys 18, trends 24)
- `build` — clean production build, full route manifest generated
- `size` — all tracked routes within budget (largest tracked: `/quiz/keycap-set` 145.3 KB vs 175 KB budget)
- `e2e` — **1301/1301 passed** (~6.1m) against `next start :4173`. Same benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups seen in prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red. Deploy was `READY` at HEAD (`3abb5e4a`) going into this tick.

## Needs you

1. **`plan/CRITIQUE.md` is 155 days stale** — the fresh-eyes loop has been off for over five months. Root cause confirmed (cloud categorically can't run it, Chrome MCP unavailable on the runner), sitting as a standing `[needs-user-call]` decision — worth a conscious call (accept as local-only ritual / build a cloud-compatible substitute / drop it) rather than letting it drift further.
2. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
3. **Newsletter cadence (`#1019`) is 16 days stale against a 7-day target, and this tick's own analysis says it structurally cannot win a score-based dispatch** against auto-refilling pillar HOT PURSUIT rows. Worth an `/oversight` call on the bounded priority override proposed in the tuning update below, rather than waiting for every pillar to go quota-comfortable at once.
4. **35 pending phase-candidate rows, ~7 weeks since the last promotion** — cloud cannot promote by design. Worth a batch `/oversight` pass.
5. **23 cross-link rows, 12 centered on one article** (`gmk-cyl-zombie-group-buy`) — cheap (ease 9 each), a clean target for phase 46's cluster-aware drain on the next `/iterate` tick rather than letting the queue grow further.

## Today's intent

The fresh ideas HOT PURSUIT row (score 7.0, filed 2026-10-12, no sibling) is the next content-gap target and should ship cleanly within the usual 1–3 tick window. Behind it: the 23-row cross-link queue (cluster-drain candidate: `gmk-cyl-zombie-group-buy`'s 12 pairs) and the newsletter row (`#1019`, now 16 days overdue) — worth watching whether the newsletter ships before a sixth HOT PURSUIT row refills and pushes it further behind.

## Tuning proposals

**One update, no new candidates.** Appended a dated update to the standing `[score 6.5]` "march.yml dispatch-order" candidate in `plan/PHASE_CANDIDATES.md`, naming a mechanism distinct from the tie-break question that candidate has tracked since 09-12: the newsletter-cadence row (fixed score 4.0) cannot win a straight score-ranked dispatch against pillar HOT PURSUIT rows (fixed score 7.0) that auto-refill roughly as often as they drain — five have shipped since the newsletter row was filed on 2026-10-03, none of them a genuine tie against it. Recommended `/oversight` consider a bounded priority override in `skills/march.md` §3b.5 (dispatch the newsletter row ahead of HOT PURSUIT once its `days-since` exceeds some multiple of the 7-day threshold) rather than relying on score parity the newsletter row can structurally never reach. Per the meta-loop rail, this is logged evidence for that call, not the call itself.
