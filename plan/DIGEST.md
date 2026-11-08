# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**Spec 06 (article internal-consistency checker) shipped end-to-end across 4 chunks in one ~9-hour overnight run, two HOT PURSUIT content-gap articles drained their queue, and depth promotion filled the gap behind 06 with a fresh spec 08 — all in the ~24 hours since the last digest** (`2ddee1a3`, 2026-11-07 17:05 UTC). The window opened with two content-gap dispatches: a guides article ("How to evaluate a group buy before you pay", closes `#1070`) and a news article ("CannonKeys' catalog record for the MM Studio Class80 flips to discontinued", closes `#1071`) — the news piece's own publish immediately surfaced a fresh `[cross-links] [4.5]` row (no prose link yet to `cannonkeys-blaine-v2-se-group-buy`, same pillar/tags) and the content-gap survey's auto-refill filed a new `[HOT PURSUIT] [content-gap] [7]` row for the **trends** pillar (1 of ≥2 articles in 30 days) — still open, next `/march` tick should dispatch `/ship-content` for it. Spec 06's veto cleared at 01:12 UTC and the loop chunked + built it in four tight passes overnight: 06.1 shipped the base `article-internal-consistency-check.mjs` script, 06.2 added the dollar/gram figure diff (acceptance A3) plus a fix excluding attribution adjectives from gram-figure tag matching, 06.3 added the sibling-citation dollar/gram cross-check (extracting a shared `getHeadlineClaimSources` helper), and 06.4 wired the new checker into `/march`'s survey chain and this skill's own breadth step, plus a same-tick fix deduping AUDIT rows the script's `--write` path could double-file. Spec 06 is now fully closed, zero reverts. With only spec 07 left open in `plan/README.md`'s table (below `promote_queue_depth` 2), depth promotion auto-picked the next `plan/CANDIDATES.md` row straight into **spec 08** (OG image render-verification gate, score 6.5, 92 days old) at 15:58 UTC — veto until 2026-11-09 (`#1072`). Both 07 (veto until 2026-11-08, `#1069`) and 08 sit in the Held lane, neither chunked yet. `#1068` (`GH_TOKEN`/`GITHUB_TOKEN` 401 in march runs, worked around via `DEFAULT_WORKFLOW_TOKEN`) remains open and unchanged, still well under `escalate_days`. **Tonight's own breadth pass is fully green**: `pnpm verify` run as 8 sequential foreground legs — typecheck, lint, 1344 unit tests across 7 workspaces (web 928, content 167, data 156, seo 44, ui 32, e2e 6, tokens 11), 443 script tests, `data:validate` (93 records, cross-refs resolve), a clean production build, `size` within budget on every route (largest 147.6 KB vs 175 KB budget), and a full-sample `SMOKE_SAMPLE=full pnpm e2e` at 1391/1391. `content-fact-audit.mjs --write` and `article-internal-consistency-check.mjs --write` both ran clean: the fact-audit's 3 standing numeric-citation mismatches are all already pending in `plan/AUDIT.md` (no new row), and the consistency checker — its first nightly run since shipping tonight — found the corpus clean (no new rows). The standard timestamp-only drift on the 3 generated manifest/search-index files reappeared from the test/e2e runs and was reverted before this commit, as every prior digest has done. `pnpm deploy:check` confirmed `READY` at HEAD (`9f07a0bb`) going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-11-07 17:05 | *(last digest committed, `2ddee1a3`)* | baseline |
| 2026-11-07 17:21 → 17:47 | cloud `march` | **shipped** — HOT PURSUIT content-gap drain: guides article "How to evaluate a group buy before you pay", closed `#1070`; content-gap survey auto-refill filed a fresh HOT PURSUIT row for the trends pillar |
| 2026-11-07 21:23 → 21:52 | cloud `march` | **shipped** — HOT PURSUIT content-gap drain: news article "CannonKeys' catalog record for the MM Studio Class80 flips to discontinued", closed `#1071`; filed new `[cross-links] [4.5]` row (no link yet to `cannonkeys-blaine-v2-se-group-buy`) |
| 2026-11-08 01:01 → 02:52 | 3× cloud `march` chain | **shipped** — spec 06 veto released, chunked, chunks 06.1 (base consistency-check script) and 06.2 (dollar/gram figure diff, acceptance A3) both closed + settled |
| 2026-11-08 08:30 → 10:03 | 2× cloud `march` chain | **shipped** — chunks 06.3 (sibling-citation cross-check) and 06.4 (wired into march's survey chain + digest breadth step, AUDIT dedupe fix) closed + settled; spec 06 fully closed |
| 2026-11-08 15:44 → 16:00 | cloud `march` (scheduled) | **shipped** — depth promotion auto-promoted candidate → **spec 08** (OG image render-verification gate, veto until 2026-11-09, `#1072`); only spec 07 remained open, below `promote_queue_depth` 2 |
| 2026-11-08 ~16:30 → (now) | night (this tick) | in progress |

Since the last digest: **27 commits shipped** (all cloud `march`), spanning 1 spec closed end-to-end (06, 4 chunks), 2 HOT PURSUIT content-gap articles, and 1 new spec (08) auto-promoted behind it. Zero reverts, zero red verify/deploy gates reported in any tick's own log. See Headline.

## Shipped

- HOT PURSUIT content-gap drain: guides article "How to evaluate a group buy before you pay" (closes `#1070`) and news article "CannonKeys' catalog record for the MM Studio Class80 flips to discontinued" (closes `#1071`). Content-gap survey's auto-refill filed a fresh `[HOT PURSUIT] [content-gap] [7]` row for the trends pillar (1 of ≥2 articles in 30 days) — still open, next `/march` tick dispatches `/ship-content` for it.
- New `[cross-links] [4.5]` AUDIT row: the just-shipped MM Studio Class80 article has no prose link yet to `cannonkeys-blaine-v2-se-group-buy` (same pillar, shared tags `cannonkeys`/`gasket-mount`) — open.
- Spec 06 shipped end-to-end: `article-internal-consistency-check.mjs` — 06.1 the base lede/body self-contradiction script, 06.2 a dollar/gram figure diff (acceptance A3) plus a fix excluding attribution adjectives from gram-figure tag matching, 06.3 a sibling-citation dollar/gram cross-check (markdown-link and Source-href forms) built on a shared `getHeadlineClaimSources` helper, 06.4 wiring into `/march`'s survey chain and this skill's own nightly breadth step plus a dedupe fix for the script's own `--write` AUDIT-row filing. Spec closed, zero reverts.
- Depth promotion, auto (no human in the loop): **spec 08** — OG image render-verification gate (score 6.5, 92 days old), promoted because only spec 07 remained open in the table, below `promote_queue_depth` 2; veto until 2026-11-09 (`#1072`). Spec 07 (group-buy companion article staleness gate, veto until 2026-11-08, `#1069`) remains held too. Neither chunked yet — both sit in `plan/README.md`'s Held lane until their veto window clears.
- `#1068` (not yet fixed, unchanged): `GH_TOKEN`/`GITHUB_TOKEN` 401 in march runs; `DEFAULT_WORKFLOW_TOKEN` still the working fallback. Still open, `triage:needs-user`, ~39h old, well under `escalate_days`.

## Queues now

**plan:** 2 specs (07, 08), 0 chunks ready, 0 held *chunks* — both specs sit in the Held *lane* behind their 1-day depth-promotion veto window (07 until 2026-11-08, 08 until 2026-11-09), not yet picked up by `/plan-a-spec`. Specs 01–06 are fully closed and off the table.
**audit:** 11 pending (up from 9 at the last digest) — the 9 standing rows are unchanged (2 `[seo]` Mode Sonnet hero-art 65%-shape rows, 1 `[content]` POM+gasket framing tension, 1 `[data]` generated-manifest drift, 1 `[seo]` favicon duplicate, 3 `[content] [3.6]` numeric-citation mismatches, 1 `[a11y] [3.5]` `ring-accent-mu` contrast); 2 new this window (the `[cross-links] [4.5]` row and the `[HOT PURSUIT] [content-gap] [7]` trends row, both above).
**critique:** 8 pending, last pass 3d ago (pass 18) — no new pass this window.
**candidates:** 8 pending (8 `>21d`), oldest 99d. `Promote: aged`. Unchanged in count from the last digest's 8 (depth promotion drained the row that became spec 08 from the live-evidence end of the queue, same pattern as 06/07 before it — the 8 left behind are all `>21d` old, oldest is still the `[6.0]` heading-semantics-coverage row from 2026-08-02).
**Support (fix-all):** 0 open user issues · first response none (0 opened in 7d) · close none in 7d.
**Quota:** no cached `seven_day` reading in this checkout (`night.yml` carries no cache-restore step for `.nexus/quota.json`) — same gap noted every prior digest; the soft-cap self-heal fix (`5ec23cdd`, resolved 2026-11-05) made this gap harmless rather than closing it, since `march.yml`'s own cache keeps refreshing independently.
**data/BACKLOG.md:** 0 pending (3 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines — `#1068` (GH_TOKEN 401) is the only open `triage:needs-user` issue, filed 2026-11-07T01:52Z (~39h ago), still well under `escalate_days` (7d). Unchanged since the last digest: the loop's push/API credential is unreliable in march runs, papered over by `DEFAULT_WORKFLOW_TOKEN`.
- No standing `[needs-user-call]` rows — none open in `plan/CRITIQUE.md` or `plan/AUDIT.md`.
- **oversight needed: candidate queue silting (8 pending >21d, oldest 99d)** — both thresholds still trip (≥5 pending >21d, oldest >45d). Standing condition, repeat observation from every digest since at least 2026-11-04: depth promotion keeps draining the newest/highest-scoring row (08 this window) while the 8 older, lower-scoring rows left behind just keep aging a day at a time. No new evidence beyond the count ticking from 98d to 99d oldest — not re-filing a fresh candidate for the same mechanism question already on the table for `/oversight`.
- Two specs (07, 08) sit in the Held lane on 1-day veto windows (until 2026-11-08 and 2026-11-09 respectively) — no action needed unless you want to veto either before `/plan-a-spec` picks them up.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: auto-promoted none this sweep, 2 awaiting (07 `#1069` veto until 2026-11-08, 08 `#1072` veto until 2026-11-09).
- Candidates cut by the pending cap since the last digest (`node scripts/plan/promote.mjs cuts --since 2026-11-07` → none): no cuts this window.
- No motion-stalled alert — shipped 21 last full week vs. 6.25 baseline (floor 3.13, reads `ok`); 25 so far in the current week, already past the floor.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).

## Today's intent

No ready chunk right now: specs 07 and 08 are both in their veto hold (until 2026-11-08 and 2026-11-09) and neither is chunked yet — the next `/plan-a-spec` tick (once a veto clears) should chunk whichever is free first. Until then, top findings for the next `/iterate` pass: the fresh `[HOT PURSUIT] [content-gap] [7]` trends-pillar row is the highest-scoring open item and most mechanical pickup (`/ship-content`); the new `[cross-links] [4.5]` row (MM Studio Class80 ↔ Blaine V2 SE) is a one-line prose-link fix close behind. The 3 standing `[content] [3.6]` numeric-citation rows, the 2 stale `[seo] [2.0]`/`[2.7]` Mode Sonnet hero-art rows, and the `[a11y] [3.5]` `ring-accent-mu` sweep (74 files, 4 already fixed) remain drainable behind those.

## Tuning proposals

None filed tonight. The candidate-queue-silting condition flagged above (Needs you) is a repeat observation, not a new mechanism — no new evidence beyond "depth promotion keeps picking the newest strong row over the oldest weak one," already building toward an `/oversight` call across several prior digests. Everything else in tonight's pulse points the other way: a fully green breadth check (8/8 verify legs plus the full-sample nightly e2e re-run, 1391/1391), both nightly content-audit scripts clean, no crash signal, no motion stall, a full spec (06) closed clean with zero reverts, and the one standing credential bug (`#1068`) unchanged and non-blocking.
