# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The quota-gate wedge that stalled four consecutive digests is over, and the loop immediately used the opening to ship the chunk that's been waiting.** Three more scheduled ticks ran after the last digest, all quota-skip no-ops on the same frozen `allowed_warning` cache the last four digests diagnosed — bringing the stall to **18 consecutive scheduled ticks over ~117 hours** (2026-10-31T19:11 → 2026-11-05T07:39). It broke when `5ec23cdd` landed directly (local commit, no `Cloud-Run:` trailer — outside the loop): `decide()`'s soft-cap branch now fails open once the cached reading's own `resetsAt` has passed, exactly option (a) from the standing `plan/CANDIDATES.md` `[score 4.2]` row this and the prior three digests kept updating. Confirmed working within the hour: scheduled run `42060851529` (16:01 UTC) logged `the cached reading's window reset... stale; the gate fails open` and shipped `/critique` pass 17; the next chained run `42063503224` (16:21 UTC) read a fresh `seven_day utilization 0.04` and shipped **chunk 01.4** end-to-end (`content-fact-audit.mjs` wired into the refill chain + `skills/digest.md`'s own nightly breadth check, closing spec 01's `A4`). Closed the candidate row this tick (`> Resolved`, addressed in `5ec23cdd`) — the `/oversight`-reserved meta-loop call this file has been building evidence for since 2026-11-02. A separate local fix, `c615d21d` (proxy only runs the uppercase-path redirect, not every request), also landed in the gap. **Tonight's own breadth pass is the headline's second act**: this is the content-fact-audit's first live `--write` run since chunk 01.4 wired it in, and it found real work — **14 numeric citation mismatches** across 9 articles/newsletters (switch spring-weight citations disagreeing with their own catalog records; two "N weeks ago" tracker citations off by one point), filed as `[content] [3.6]` `plan/AUDIT.md` rows, all above the 3.0 autonomous-pick floor. `plan/AUDIT.md` goes from 5 pending to 19. **This tick's own fresh `pnpm verify`, run as 8 sequential foreground legs plus the nightly `SMOKE_SAMPLE=full pnpm e2e` breadth leg, is fully green**: typecheck, lint, 1263 unit tests across workspaces (web 874, content 167, data 129, seo 44, ui 32, e2e 6, tokens 11), 375 script tests, `data:validate` (93 records, cross-refs resolve), a clean production build, `size` within budget on every route (largest 148.8 KB vs 200 KB budget), the per-commit 1348/1348 e2e against `next start :4173`, and the full-breadth 1348/1348 e2e sweep (8.8m) — no HIGH `plan/AUDIT.md` row to file tonight. The usual timestamp-only drift on the 3 generated manifest/search-index files (the standing `[2.4]` AUDIT row) reappeared twice and was reverted both times before this commit, as every prior digest has done. `pnpm deploy:check` confirmed `READY` at HEAD (`c52b2cc4`) going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-04 18:37 | *(last digest committed, `4e07d0e4`)* | baseline |
| 2026-11-04 18:24 → 2026-11-05 07:39 | 3× cloud `march` (scheduled) | **no-op**, every one — quota gate skip, same frozen `allowed_warning` 0.83 cache the last 4 digests diagnosed; stall reaches 18 ticks / ~117h |
| 2026-11-04 ~19:39 | local fix (`c615d21d`) | **shipped** — proxy only runs the case-normalizing redirect on uppercase article/tag paths |
| 2026-11-05 ~13:42 | local fix (`5ec23cdd`) | **shipped** — quota gate now fails open past a stale `resetsAt`; breaks the stall |
| 2026-11-05 16:01 | cloud `march` (scheduled, run `42060851529`) | **shipped** — `/critique` pass 17 (2 MED findings) |
| 2026-11-05 16:21 | cloud `march` (chained, run `42063503224`) | **shipped** — chunk 01.4 wired in, closed, settled (3 commits) |
| 2026-11-05 16:56 | cloud `march` (run `42069641122`) | **no-op**, clean — nothing ready right behind 01.4's close |
| 2026-11-05 ~18:30 → (now) | night (this tick) | in progress |

Since the last digest: **6 commits shipped** (2 local fixes, 4 cloud), **2 of 4 cloud `march` ticks shipped** (the other 2 were no-ops — 1 pre-fix quota skip folded into the 18-tick count above, 1 post-fix clean no-op). See Headline.

## Shipped

- `c615d21d` — perf: the case-normalizing redirect for article/tag paths now runs the proxy only on uppercase hits; lowercase page views stay pure CDN.
- `5ec23cdd` — fix: the quota gate's soft-cap branch now fails open once the cached reading's own `resetsAt` has passed, instead of gating every scheduled/chained run forever on a stale `allowed_warning`. Unblocks the 18-tick/~117h stall (see Headline, Needs you).
- `a2809976` — `/critique` pass 17: 2 new `[MED]` findings (home hero shows no tagline/description outside the dead empty-state branch; persistent nav + footer omit Group Buys entirely).
- `131df4ac` / `e882b4d3` / `c52b2cc4` — chunk 01.4: `content-fact-audit.mjs` wired into the refill chain and `skills/digest.md`'s nightly breadth check (closes spec 01's `A4`); phase closed and settled. Spec 01 now has 1 chunk left (01.5, live-corpus spot-check).

## Queues now

**plan:** 5 specs, 1 chunk left, 0 held. Chunk 01.4 (above) shipped this window — 01.5 (live-corpus spot-check) is now the only ready chunk under spec 01. Specs 02–05 remain promoted but **not yet chunked** — the next `/plan-a-spec` tick should pick one.
**audit:** **19 pending (up from 5)** — tonight's content-fact-audit `--write` run (chunk 01.4's own deliverable, firing live for the first time) filed 14 new `[content] [3.6]` rows: 9 switch spring-weight citations across 7 articles disagreeing with their own catalog records (`durock-t1-deep-dive`, `gazzew-boba-family-deep-dive` ×3, `gazzew-boba-u4t-deep-dive`, `silent-switch-damping-deep-dive` ×2, `split-ergo-parts-pairing`, `switch-actuation-weight-buying-guide` ×3), plus 3 "N weeks ago" tracker-score citations off by one point (`hall-effect-rapid-trigger-plateau`, `thock-weekly-011` ×2). All 14 score above the 3.0 autonomous-pick floor — real, fresh work for the next `/iterate` tick. The standing 5 sub-3.0 rows are unchanged (two Mode Sonnet hero-art rows, one plate-materials content-tension row, one generated-manifest drift row, one orphaned-favicon row).
**critique:** 6 pending, last pass 3h ago (pass 17). 2 new `[MED]` this window (home hero tagline/description; nav+footer missing Group Buys) + 2 standing `[MED]` (tracker summary-card ranking-vs-display mismatch; `/quiz/switch` missing kicker/breadcrumb) + 2 standing `[LOW]` (`/group-buys` "recently ended" said twice; `/tools`+`/group-buys` heroes have no illustration).
**candidates:** 11 pending (11 `>21d`), oldest 122d. `Promote: aged`. Down from 12 — the standing quota-gate `[score 4.2]` row closed out this tick (resolved directly in `5ec23cdd`, see Headline); every remaining pending row is now `>21d` old.
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** unknown in this checkout (no cached `seven_day` reading — `night.yml` carries no cache-restore step for `.nexus/quota.json`). `march.yml`'s own last read is fresh and healthy: `0.04` (`allowed`, resets 2026-11-09T08:00:00Z) as of run `42063503224` — the stall is over.
**data/BACKLOG.md:** 0 pending (3 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines (0 open `triage:needs-user` issues) — 0 open GitHub issues at all right now.
- No standing `[needs-user-call]` rows — none open in `plan/CRITIQUE.md` or `plan/AUDIT.md`.
- **oversight needed: candidate queue silting (11 pending >21d, oldest 122d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Unchanged in substance from the last digest: the one row that resolved this tick (quota gate) was the newest pending row, not one of the aged ones.
- **Quota gate wedge resolved — no longer a watch item.** Four consecutive digests (2026-11-02 through 2026-11-04) flagged the same stall; it reached 18 consecutive scheduled ticks over ~117 hours before `5ec23cdd` landed directly (local, outside the loop) with the time-bound `resetsAt` fix this file's candidate row recommended as option (a). Confirmed working the same hour it landed (see Headline). Option (b) (`night.yml` refresh path) was never needed — closing the candidate on (a) alone.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: auto-promoted none this sweep, 0 awaiting (no Held lines currently outstanding).
- Candidates cut by the pending cap since the last digest (`node scripts/plan/promote.mjs cuts --since 2026-11-04` → none): no cuts this window.
- No motion-stalled alert — shipped 21 last full week vs. 6.25 baseline (floor 3.13, reads `ok`); same caveat as recent digests: the motion floor only measures the last *full* week, so it doesn't yet reflect tonight's 14-row audit influx.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).

## Today's intent

Next ready chunk: **01.5** (live-corpus spot-check, needs 01.4 — now satisfied) — the next `/march`/`/ship-a-chunk` tick ships it. Top finding for the next `/iterate` pass: the 14 fresh `[content] [3.6]` content-fact-audit rows (all tied at score 3.6) are the highest-scored open work in the queue — any one is a clean, well-evidenced one-field data or prose fix (e.g. the `durock-t1` actuation citation disagreeing with `data/switches/durock-t1.json` across three separate articles). Critique's 4 still-fresh `[MED]` rows (2 new, 2 standing) remain drainable behind that. Specs 02–05 still need a `/plan-a-spec` pass to get chunked before they can ship anything.

## Tuning proposals

None filed tonight. The standing `[score 4.2]` quota-gate candidate is closed (see Headline/Needs you) rather than updated again. Everything else in tonight's pulse points the other way — a fully green breadth check (8/8 verify legs plus the full-sample nightly e2e, 1348/1348 twice over), no crash signal, no motion stall (by the full-week measure), and the candidate queue shrinking rather than growing. Worth a watch-note rather than a filing: tonight's content-fact-audit run surfaced 14 above-floor rows in one pass where `/iterate` normally drains one per tick — if the next several digests show this backlog not shrinking, that would be a tuning signal (e.g. a batched-drain allowance for same-category audit rows) worth proposing then, not pre-emptively tonight.
