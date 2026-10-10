# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The "two consecutive fully-idle windows" alarm from the last two digests is resolved by direct evidence — but the real mechanism behind `#1018`'s stall turns out sharper than "slow not broken."** Since the last digest (`a6b80c02`, 2026-10-09T17:18:31Z), 3 cloud `march` ticks ran clean no-ops (21:26, 2026-10-10 01:28, 08:02 UTC), then the 15:00→15:28 UTC tick shipped: it mirrored the standing guides HOT PURSUIT row to issue `#1020`, drafted "What a switch's gram number actually tells you before you buy" (`content-curator` + `brander`, commit `c29438f0`), and closed the audit row (`858f48f1`, `Closes #1020`). The dispatcher is demonstrably not stuck — it took 3 ticks to trip, not infinity.

**But it shipped the *wrong* row by the loop's own documented rule.** Going into that tick, two HOT PURSUIT `[7.0]` content-gap rows sat tied in `plan/AUDIT.md`: guides (filed 2026-10-07, `#1020`) and deep-dives (filed 2026-10-03, `#1018`) — both scored 7.0, both above the 3.0 floor. `skills/ship-content.md` §3 states the tie-break explicitly: *"If two rows tie, prefer the one with the older original filing date."* Deep-dives is four days older. The tick shipped guides anyway, with no reasoning logged in either commit (`a1c4b6e7`, `c29438f0`) that addresses the tie. `#1018` now clears an **eighth** consecutive digest window unshipped — a new high-water mark — not because the lane is dead, but because a newer sibling row keeps winning the pick instead of the older stalled one. This is a materially more actionable finding than the prior two digests' generic liveness worry: it's a concrete, reproducible rule-violation with a one-line fix candidate.

**This tick's own fresh `pnpm verify` is fully green** — all 8 legs run as sequential foreground calls: typecheck (9 workspace projects), lint (0 warnings), 1243/1243 unit tests across 166 files (862 `apps/web` + 167 `packages/content` + 129 `packages/data` + 44 `packages/seo` + 32 `packages/ui` + 6 `apps/e2e` + 3 `packages/tokens` — all unchanged except the new article's search-index/manifest regen), 230/230 script tests (83 suites), `data:validate` (90 records, cross-refs resolve, unchanged), a clean production build, `size` OK (all routes under budget, unchanged), and **1289/1289 e2e** (~8.3m against `next start :4173`, +6 over the prior digest's 1283 — consistent with one new article + its hero art + a new cross-link finding). Deploy was `READY` at HEAD (`858f48f1`) going into this tick.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-09 17:18 | *(last digest committed, `a6b80c02`)* | baseline |
| 21:26→21:31 | cloud march | no commit — clean no-op |
| 2026-10-10 01:28→01:32 | cloud march | no commit — clean no-op |
| 08:02→08:07 | cloud march | no commit — clean no-op |
| 15:00→15:28 | cloud march | **shipped** — mirrored `#1020`, drafted + published guides article, closed audit row |
| now | night (this tick) | in progress |

4 completed `march`-workflow runs since the last digest: **4 success, 0 failure, 0 cancelled, 1 shipped tick (3 commits), 3 true no-ops.** 2 `lighthouse` runs visible since the last digest, both `success` (recovering from the prior digest's one `skipped` conclusion). 1 `night` run visible (this tick). No `heartbeat` alarms surfaced in `gh issue list`.

## Shipped

**One article, end to end.** `content: guides — "What a switch's gram number actually tells you before you buy"` (`c29438f0`) — a guides-pillar buying guide on actuation vs. bottom-out gram weights, grounded in 5 catalog switches (Gateron Magnetic Jade, Cherry MX2A Red, Durock T1, Kailh Box Jade, C3 Equalz Tangerine R2); ~1325 words, 5 sections, `publishedAt` gap-filled to 2026-10-01; hero SVG + 3 inline diagrams from `brander`; 1 new tag (`weight`). Audit row closed, issue `#1020` closed (`858f48f1`). Mirror commit `a1c4b6e7` opened `#1020` ahead of the ship, per the standard `/ship-content` pattern.

## Queues now

- **Build plan**: 0 pending phases (52/52 shipped), unchanged.
- **`plan/AUDIT.md`**: **12 open rows, net unchanged** (guides row closed, −1; a new same-pillar cross-link row filed, +1). 5 standing sub-3.0 `[ ]` rows unchanged (`[seo] [2.7]` Mode Sonnet hero-art 65%→75%, `[content] [2.4]` plate-materials tension, `[seo] [2.0]` cannonkeys-mode-sonnet-r2 hero-art, `[data] [2.4]` generated-manifest drift, `[seo] [1.8]` orphaned `favicon.svg`); 1 `[ ]` row (`[newsletter] [4.0]` issue 012 due, `#1019` — filed 2026-10-03, now **14 days** since issue 11 against a 7-day threshold, still unshipped); 1 new `[cross-links] [4.5]` row (`switch-actuation-weight-buying-guide` ↔ `beginners-switch-buying-guide`, filed today by `article-crosslink-survey.mjs` off the new article); 4 `[needs-user-call]` rows unchanged (border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`); 1 `[HOT PURSUIT]` row still open (`[content-gap] [7.0]` deep-dives, `#1018` — **eighth consecutive digest window unshipped, new high-water mark**, see Headline for the tie-break-violation mechanism).
- **`plan/CRITIQUE.md`**: last real pass still 2026-05-10T20:35:00Z (pass 11, `931c8a7`) — **153 days stale.** Root cause remains the standing `[needs-user-call]` phase-candidate (cloud mode categorically cannot run `/critique` — no Chrome MCP on the runner); not re-diagnosing, just logging the running count.
- **`plan/PHASE_CANDIDATES.md`**: pass 435 (2026-10-01, commit `9b2cbfda`) is still the most recent expand pass — no new pass fired this window. 35 `[ ]` + 1 `[needs-user-call]` pending, unchanged as distinct rows — 1 existing candidate (the `[score 6.5]` dispatch-order row) gets a new update note this tick with the tie-break-violation finding (see Tuning proposals), not a new row, not re-scored. Last promotion: phase 50, 2026-08-23 — now ~7 weeks.
- **`data/BACKLOG.md`**: 0 pending, unchanged.
- **GitHub issues**: `#1018` (deep-dives dispatch, open since 2026-10-03T00:10, eighth digest window); `#1019` (newsletter dispatch, open since 2026-10-06T17:55, 14 days since last issue); `#929` (`triage:reviewed`, standing, unchanged). `#1020` closed cleanly this window. 0 unlabeled issues, 0 `triage:needs-user` issues. Same 6 open dependabot PRs unmerged (`#946`, `#947`, `#948`, `#990`, `#1003`, `#1017`), oldest since 2026-08-28 — noted for completeness, not a digest action item.

## Breadth verdict

**`pnpm verify` — fully green, all 8 legs**, run as sequential foreground calls per the skill's own instruction:

- `typecheck` — clean (9 workspace projects)
- `lint` — clean (0 warnings across all packages)
- `test:run` — **1243/1243** passed across 166 files: `apps/web` 862 (109 files), `packages/content` 167 (24 files), `packages/data` 129 (19 files), `packages/seo` 44 (5 files), `packages/ui` 32 (7 files), `apps/e2e` 6 (1 file), `packages/tokens` 3 (1 file) — all unchanged counts except the generated manifests/search-index touched by today's new article
- `test:scripts` — 230/230 passed (83 suites) — unchanged
- `data:validate` — 90 records valid, cross-refs resolve (11 vendors / 18 switches / 10 keycap-sets / 10 boards / 18 group-buys / 23 trends) — unchanged
- `build` — clean production build
- `size` — all tracked routes comfortably under budget, unchanged figures (`/quiz/switch` 145.2 KB, `/quiz/keycap-set` 145.3 KB, `/compare/switch` and `/compare/board` 142.1 KB, all against a 175 KB budget)
- `e2e` — **1289/1289 passed** (~8.3m) against `next start :4173` — +6 over the prior digest's 1283, consistent with one new article landing. Same benign `Error: Internal: NoFallbackError` stderr noise on dynamic-route fallback lookups seen in every prior digest — not attached to any failing test, not re-filing.

No HIGH AUDIT row filed from the breadth check — nothing red. Deploy was `READY` at HEAD (`858f48f1`) going into this tick.

## Needs you

1. **The `#1018` stall now has a concrete mechanism, not just a liveness worry — worth an `/oversight` look at `skills/ship-content.md`'s tie-break enforcement.** Two HOT PURSUIT rows tied at `[7.0]` going into today's shipping tick; the skill's own documented rule says the older filing wins (deep-dives, 2026-10-03); the tick shipped the newer one (guides, 2026-10-07) with no logged reasoning. If this isn't a one-off, every future sibling row that files while `#1018` waits will keep jumping the queue ahead of it. Recommend confirming whether the tie-break is actually implemented in practice (vs. documented but not followed), and manually dispatching `/ship-content` against `#1018` specifically in the meantime rather than waiting for the rule to self-correct.
2. **`plan/CRITIQUE.md` is 153 days stale** — the fresh-eyes loop has been off for over five months. Root cause confirmed (cloud categorically can't run it, Chrome MCP unavailable on the runner), sitting as a standing `[needs-user-call]` decision — worth a conscious call (accept as local-only ritual / build a cloud-compatible substitute / drop it) rather than letting it drift further.
3. **4 `[needs-user-call]` AUDIT rows, unchanged**: border-contrast WCAG 1.4.11 `[1.3]`, GTM consent-gate `[3.6]`, soft-404 structural trade-off `[4.2]`, `loop:opened` mirror-drain gap `[3.0]`.
4. **35 pending phase-candidate rows, ~7 weeks since the last promotion** — cloud cannot promote by design. Worth a batch `/oversight` pass.

## Today's intent

`#1018` (deep-dives HOT PURSUIT, score 7.0, filed 2026-10-03) is the correct next pick by the loop's own tie-break rule — "how TMR switches work," already mirrored to GitHub, now at an eighth-window stall. The new same-pillar cross-link row (`switch-actuation-weight-buying-guide` ↔ `beginners-switch-buying-guide`, `[4.5]`) and the newsletter row (`#1019`, `[4.0]`, 14 days overdue) sit behind it. Whether the next tick actually reaches `#1018` or lets another sibling jump it again is the thing worth watching.

## Tuning proposals

**One update, no new candidates.** Appended a new finding to the existing `[score 6.5]` "march.yml dispatch-order summary" candidate in `plan/PHASE_CANDIDATES.md`: the prior two digests' "fully-idle window" worry is resolved (the dispatcher shipped this window after 3 no-ops), but the replacement finding is sharper — a concrete instance of `skills/ship-content.md`'s own documented tie-break rule ("older filing date wins") apparently not being followed when two HOT PURSUIT rows tie, which plausibly explains `#1018`'s repeated stalls better than generic queueing noise does. Logged as evidence for the next `/oversight` call, not a resolution — per the meta-loop rail, only `/oversight` promotes or edits the gate itself.
