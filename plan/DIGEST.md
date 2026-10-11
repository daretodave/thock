# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The eight-window `#1018` stall from the last four digests is closed.** The 23:10→23:47 UTC cloud tick on 2026-10-10 shipped it end-to-end: `content-curator` + `brander` drafted "What a TMR sensor is actually measuring under a magnetic switch" (commit `c3bce9e7`), the audit row was ticked and the issue closed (`86af2ce1`, `Closes #1018`). It never reached a ninth digest window. But the fix doesn't actually confirm the mechanism the last digest flagged: by the time that tick ran, guides' `#1020` had already closed eight hours earlier (15:27 UTC, same day) — deep-dives was the *sole* eligible HOT PURSUIT row left, not a tie-break winner over a live sibling. Whether `ship-content`'s ranking genuinely implements the documented "older filing wins" rule under a real simultaneous tie is still untested; logged an update on the standing `plan/PHASE_CANDIDATES.md` candidate saying exactly that rather than claiming resolution of the mechanism question (see Tuning proposals).

**A fresh single HOT PURSUIT row is now the one to watch.** `content-gap-survey.mjs` auto-refilled the queue with a news-pillar row (score 7.0) at 2026-10-10, mirrored to issue `#1021` by the 03:45→03:50 UTC tick this morning. It's one day old — not yet a stall, no sibling to tie against this time.

**This tick's own fresh `pnpm verify` is fully green** — all 8 legs run as sequential foreground calls: typecheck, lint, unit tests, script tests, `data:validate`, a clean production build, `size` within budget, and **1292/1292 e2e** (~7.2m) against `next start :4173`. Deploy was `READY` at HEAD (`097dca9a`) going into this tick.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-10 16:15 | *(last digest committed, `4d178403`)* | baseline |
| 19:41→19:46 | cloud march | no commit — clean no-op |
| 23:10→23:47 | cloud march | **shipped** — drafted + published deep-dives TMR article, closed `#1018` |
| 2026-10-11 03:45→03:50 | cloud march | **shipped** — mirrored news content-gap row to `#1021` |
| 10:33→10:36 | cloud march | no commit — clean no-op |
| 16:30 | cloud march | in flight as this digest runs |
| now | night (this tick) | in progress |

4 completed `march`-workflow runs since the last digest, 1 in flight: **4 success, 0 failure, 0 cancelled, 2 shipped ticks (3 commits total), 2 true no-ops.** 2 `lighthouse` runs visible since the last digest, both `success`. No `heartbeat` alarms surfaced in `gh issue list`.

## Shipped

**One article, end to end.** `content: deep-dives — "What a TMR sensor is actually measuring under a magnetic switch"` (`c3bce9e7`) — a deep-dives pillar piece on TMR sensor stacks in magnetic switches, ~1650 words across 7 sections, `publishedAt` gap-filled to 2026-09-27; hero SVG (`/hero-art/tmr-switches-deep-dive.svg`, coral splash, TMR sensor stack cross-section); tags `magnetic`, `tmr`, `switches`, `deep-dive`. Audit row closed, issue `#1018` closed (`86af2ce1`, `Closes #1018`) — the row this and the prior four digests tracked as an escalating stall.

**One mirror-only dispatch.** `audit: content dispatch opened issue #1021` (`097dca9a`) — the news-pillar HOT PURSUIT content-gap row (score 7.0, filed 2026-10-10 by `content-gap-survey.mjs` auto-refill) mirrored to GitHub ahead of the ship, per the standard `/ship-content` pattern. Not yet drafted.

## Queues now

- **Build plan**: 0 pending phases, unchanged.
- **`plan/AUDIT.md`**: **14 open rows** — net +2 from the last digest (`#1018` row closed, −1; 6 new same-pillar cross-link rows filed off the TMR article, +6; a fresh news `[HOT PURSUIT]` row filed, +1). 5 standing sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]` plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]` orphaned `favicon.svg`); 1 `[ ]` row (`[newsletter] [4.0]` issue 012 due, `#1019` — filed 2026-10-03, now **15 days** since issue 11 against a 7-day threshold, still unshipped); 8 `[cross-links] [4.5]` rows, all new or carried (`switch-actuation-weight-buying-guide` ↔ `beginners-switch-buying-guide`, plus `tmr-switches-deep-dive` ↔ 6 pillar siblings: `cherry-mx2a-revision`, `clicky-switches-deep-dive`, `gateron-lanes-tactile-deep-dive`, `gateron-magnetic-jade-deep-dive`, `hmx-cloud-deep-dive`, `keyboard-acoustics-deep-dive`, `optical-switches-explained`); 4 `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`); 1 `[HOT PURSUIT]` row, now a single un-tied candidate (`[content-gap] [7.0]` news pillar, `#1021` — 1 day old, not yet a stall).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z (pass 11, `931c8a7`) — **154 days stale.** Root cause remains the standing `[needs-user-call]` phase-candidate (cloud mode categorically cannot run `/critique` — no Chrome MCP on the runner); logging the running count, not re-diagnosing.
- **`plan/PHASE_CANDIDATES.md`**: pass 435 (2026-10-01, commit `b4d8dafb`) is still the most recent expand pass — no new pass fired this window, now **39 consecutive no-candidate passes** (397–435; a 1-candidate-scored-3.6 row already tracks this cadence signal, not re-filing). 35 `[ ]` + 1 `[needs-user-call]` pending, unchanged as distinct rows; the `[score 6.5]` dispatch-order candidate gets a new update note this tick closing out the `#1018` saga (see Tuning proposals), not a new row, not re-scored. Last promotion: phase 50, 2026-08-23 — now ~7 weeks.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: `#1021` (news content dispatch, open since 2026-10-11T03:49, 1 day); `#1019` (newsletter dispatch, open since 2026-10-06T17:55, now 15 days since last issue); `#929` (`triage:reviewed`, standing, unchanged). `#1018` closed cleanly this window. 0 unlabeled issues, 0 `triage:needs-user` issues. Same 6 open dependabot PRs unmerged (`#946`, `#947`, `#948`, `#990`, `#1003`, `#1017`), oldest since 2026-08-28 — noted for completeness, not a digest action item.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential foreground calls per the skill's own instruction:

- `typecheck` — clean
- `lint` — clean
- `test:run` — all unit tests passed (unchanged suite shape, plus the new article's generated manifest/search-index regen)
- `test:scripts` — all script tests passed
- `data:validate` — all records valid, cross-refs resolve
- `build` — clean production build, full route manifest generated (339 static paths, including the new `/part/[kind]/[slug]` and `/vendor/[slug]` families)
- `size` — all tracked routes within budget
- `e2e` — **1292/1292 passed** (~7.2m) against `next start :4173`. Same benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups seen in prior digests — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red. Deploy was `READY` at HEAD (`097dca9a`) going into this tick.

## Needs you

1. **`plan/CRITIQUE.md` is 154 days stale** — the fresh-eyes loop has been off for over five months. Root cause confirmed (cloud categorically can't run it, Chrome MCP unavailable on the runner), sitting as a standing `[needs-user-call]` decision — worth a conscious call (accept as local-only ritual / build a cloud-compatible substitute / drop it) rather than letting it drift further.
2. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
3. **35 pending phase-candidate rows, ~7 weeks since the last promotion** — cloud cannot promote by design. Worth a batch `/oversight` pass.
4. **8 cross-link rows, 7 of them centered on one article** (`tmr-switches-deep-dive` needs linking to 6 siblings) — cheap (ease 9 each), worth a quick `/iterate` drain sweep rather than letting them accumulate one row per new deep-dive.

## Today's intent

`#1021` (news HOT PURSUIT, score 7.0, filed 2026-10-10) is the only open content-gap row and has no sibling to tie against — the next `/ship-content`-eligible tick should reach it cleanly. Behind it: 8 cheap cross-link rows (`[4.5]`, ease 9 each) and the newsletter row (`#1019`, `[4.0]`, 15 days overdue). Worth watching whether `#1021` ships within the usual 1–3 tick window now that the tie-break question is moot for this row.

## Tuning proposals

**One update, no new candidates.** Closed out the `[score 6.5]` "march.yml dispatch-order summary" candidate's open question in `plan/PHASE_CANDIDATES.md`: `#1018` shipped the night after the last digest, ending the eight-window stall, but it shipped as the *sole* remaining HOT PURSUIT row (guides' `#1020` had already closed hours earlier) rather than as a tie-break winner over a live sibling — so the prior digest's core question (does `ship-content` actually implement the documented older-filing-wins rule under a genuine simultaneous tie) is still empirically untested. Recommended `/oversight` close the question as "resolved by attrition, mechanism unverified" rather than reopening it; the next real simultaneous tie is the only event that would test it. Per the meta-loop rail, this is logged evidence for that call, not the call itself.
