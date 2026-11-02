# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The cloud loop has been fully quota-gated for 51 straight hours — 9 consecutive scheduled `march` ticks, every one a no-op — while the only shipped work this window came from a local `/oversight` session.** Every scheduled tick since 2026-10-31T19:11 through tonight's 2026-11-02T19:06 hit the identical wall: the cached `seven_day` utilization reading is frozen at `0.83` (`allowed_warning`), at or above `NEXUS_QUOTA_MAX` 0.8, so each run skips the model before spending anything — and a skip never produces a fresh reading, so the cache can never update itself. Traced `scripts/cloud/quota.mjs`'s `decide()`: its soft-cap branch checks only the cached number against the cap, never `resetsAt`, so an `allowed_warning` reading (unlike a `rejected` one) has no time-based expiry at all. `night.yml` runs unconditionally once a day and does spend a live model call (this tick included), but has no `quota.mjs read`/cache step to feed that fresh reading back to `march.yml` — so even the one thing that *could* unstick the loop daily currently doesn't. Filed as a new `plan/CANDIDATES.md` row (`[score 4.2]`) — see Needs you. Separately, a 2026-11-01 local `/oversight` pass shipped 4 commits: resolved every open `[needs-user-call]` row (dropped GTM/GA4 for the already-wired cookieless Vercel Web Analytics, fixed the route-aware 404 hydration mismatch, added a contrast-safe border token, wired the mirrored-issue backfill), fixed a CRLF schema-drift false-positive, and opened the promotion valve — promoting specs 02–05 and adopting upstream nexus mechanics (depth-aware promotion, `Research <n>d`, a stock mirror-orphan generator). **This tick's own fresh `pnpm verify`, run as 8 sequential foreground legs per the cloud instructions, is fully green**: typecheck, lint, 1250 unit tests across 6 workspaces (data 129, seo 44, ui 32, e2e 6, content 167, web 872), 375 script tests, `data:validate` (93 records, cross-refs resolve), a clean production build, `size` within budget on every route, and 1348/1348 e2e against `next start :4173` — no HIGH `plan/AUDIT.md` row to file tonight. `pnpm deploy:check` confirmed `READY` at HEAD (`f5ee932e`) going in.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-31 16:20 | *(last digest committed, `d2be0817`)* | baseline |
| 2026-11-01 07:46 | local `/oversight` | **shipped** — resolve all open `[needs-user-call]` rows (`c5878bdd`) |
| 2026-11-01 08:01 | local fix | **shipped** — route-aware 404 swaps after mount, not during hydration (`9647362b`) |
| 2026-11-01 08:59 | local fix | **shipped** — schema-drift check ignores CRLF line endings (`20eb2812`) |
| 2026-11-01 08:59 | local `/oversight` | **shipped** — open the promotion valve, promote specs 02–05, adopt nexus `ca3c79f` (`f5ee932e`) |
| 2026-10-31 19:11 → 2026-11-02 19:06 | 9× cloud `march` (scheduled) | **no-op**, every one — quota gate skip (cached `seven_day` utilization 0.83 ≥ `NEXUS_QUOTA_MAX` 0.8), cache never refreshed |
| 2026-11-02 20:28 → (now) | night (this tick) | in progress |

Since the last digest: **4 local commits shipped (all 2026-11-01 morning), 0 of 9 cloud `march` ticks shipped (0 no-ops' worth of chain depth gained — every one skipped for the identical quota reason).** See Headline + Needs you.

## Shipped

1. **Resolve all open `[needs-user-call]` rows** — drop GTM/GA4 in favor of the already-wired cookieless Vercel Web Analytics (no consent banner needed, `bearings.md`/`spec.md` reconciled, e2e guards against GTM/GA4 reintroduction); `/article/[slug]` and `/tag/[slug]` set `dynamicParams = false` for a real 404 status; a new `--thock-border-control` token fixes the WCAG 1.4.11 contrast failure on inputs/selects/bordered buttons; `scripts/plan/orphan-issues.mjs` + `/iterate` Step 1.5 backfill rows for mirrored `loop:opened` issues (`c5878bdd`)
2. **Route-aware 404 hydration fix** — the entity copy and "did you mean" suggestions now render after mount instead of causing a server/client mismatch against Vercel's prerendered `/_not-found` page (`9647362b`)
3. **Schema-drift CRLF fix** — `data:validate` no longer false-positives on a Windows checkout's CRLF line endings in `data/schemas/*.json` (`20eb2812`)
4. **Promotion valve opened** — specs 02 (`/quiz/board`), 03 (switch sensing), 04 (group-buy delays/non-fulfillment), 05 (sitewide focus-visible default) promoted; promotion knobs tuned aggressive (3/wk, 7d age, 1d veto, queue depth 2, prefer product); adopted upstream nexus's depth-aware promotion + `Research <n>d` + stock mirror-orphan generator; state diet trimmed `CANDIDATES.md` 1389 KB → 228 KB (`f5ee932e`)

## Queues now

**plan:** 5 specs, 2 chunks left, 0 held. Spec 01 (content-fact-audit) has the only ready chunks — 01.4 (wire into refill chain + digest) and 01.5 (live-corpus spot-check). Specs 02–05 are promoted but **not yet chunked** — the next `/plan-a-spec` tick should pick one.
**audit:** 5 pending, all below the 3.0 autonomous-pick floor, all unchanged from the last digest: two Mode Sonnet hero-art rows (`[2.7]`/`[2.0]`, need `brander` key-layout redraws), one plate-materials content-tension row (`[2.4]`, needs scout research), one generated-manifest/search-index drift row (`[2.4]`, reproduced live this tick — `pnpm verify` regenerated and drifted all three generated files by a trivial timestamp-shaped diff, reverted before commit), one orphaned-favicon row (`[1.8]`, trivial dedup). Zero `[needs-user-call]` rows — all resolved this window (`c5878bdd`).
**critique:** 4 pending, last pass 16 ~3d ago. 2 `[MED]` (tracker summary-card ranking-vs-display mismatch; `/quiz/switch` missing kicker/breadcrumb) — both still drainable, undrained only because every cloud tick in the window was a quota no-op. 2 standing `[LOW]` (`/group-buys` "recently ended" said twice; `/tools`+`/group-buys` heroes have no illustration).
**candidates:** 12 pending (11 `>21d`), oldest 119d. `Promote: aged`. Down from 18 (15 `>21d`) at the last digest — local `/oversight` (`f5ee932e`) promoted 4 (specs 02–05) and rejected 2 already-resolved rows; this tick files 1 new candidate (the quota-gate self-refresh row below), netting 12.
**Support (fix-all):** 0 open user issues · first response none (1 opened in 7d) · close 3.1h mean (1 closed in 7d).
**Quota:** unknown — no cached `seven_day` reading in this checkout (`night.yml` carries no cache-restore step for `.nexus/quota.json`; see Needs you). `march.yml`'s own cache last read `0.83` (`allowed_warning`, stated reset 2026-11-02T08:00:00Z, now passed with no re-measurement).
**data/BACKLOG.md:** 0 pending (3 rows on file, all `[x]` done).

## Needs you

- No `escalate #N` lines (0 open `triage:needs-user` issues) — 0 open GitHub issues at all right now.
- No standing `[needs-user-call]` rows — the last 4 were resolved this window by local `/oversight` (`c5878bdd`).
- **oversight needed: candidate queue silting (11 pending >21d, oldest 119d)** — both thresholds still trip (≥5 pending >21d, oldest >45d), though both counts improved from last digest's 15/139d via the `f5ee932e` promotions.
- **New candidate filed this tick — `[score 4.2]` `quota.mjs`'s soft-cap gate has no self-refresh path.** 9 consecutive scheduled `march` ticks (2026-10-31T19:11→2026-11-02T19:06, ~51h) all skipped on the identical frozen reading (`seven_day` utilization 0.83, `allowed_warning`, cap 0.8) — a skip never spends a model call, so the cache that caused the skip can never refresh itself, and the soft-cap branch in `decide()` never consults `resetsAt` the way the `rejected`-status branch does, so there's no time-based escape either. The only thing that currently un-wedges a capped scheduled loop is a human hand-dispatching `march.yml` (a `manual`-kind run is exempt from the soft cap). Two independent, either-sufficient fixes proposed: time-bound the soft-cap branch on `resetsAt` too, or give `night.yml` (which already spends a live call daily, unconditionally) the same `quota.mjs read` + cache-save step `march.yml` has, so the digest can refresh the shared reading once a day even while `march` stays capped. `/oversight` call per the meta-loop rail — this touches the gate's own mechanism.
- `Promote: aged` — `node scripts/plan/promote.mjs sweep`: auto-promoted none this sweep, 0 awaiting (no Held lines currently outstanding).
- Candidates cut by the pending cap since the last digest (`node scripts/plan/promote.mjs cuts --since 2026-10-31` → none): no cuts this window — the 2026-10-31→2026-11-02 reduction in Pending came from `/oversight` promotions and rejections (`f5ee932e`), not the pending-cap sweep.
- No motion-stalled alert — shipped 21 last full week vs. 6.25 baseline (floor 3.13, reads `ok`); 0 shipped so far this week (2026-W45), but the motion floor is measured against the last *full* week, not the in-progress one, so it doesn't yet reflect the 51-hour quota stall above.
- No secrets-rotation note — `secrets.mjs audit` read 0 events (this cloud checkout carries no local secrets-audit log).

## Today's intent

Next ready chunk: **01.4** (wire `content-fact-audit.mjs` into the refill chain + digest, S, closes A4, needs nothing) — the next `/march`/`/ship-a-chunk` tick ships it, once a tick actually runs past the quota gate (see Needs you). Top finding for the next `/iterate` pass once the phase queue clears: critique pass 16's 2 fresh `[MED]` rows (tracker summary-card ranking-vs-display mismatch; `/quiz/switch` missing kicker/breadcrumb) are both still drainable now — they've simply had no non-no-op tick to drain them since. Specs 02–05 need a `/plan-a-spec` pass to get chunked before they can ship anything either.

## Tuning proposals

One filed tonight: `plan/CANDIDATES.md` `[score 4.2]` — `quota.mjs`'s soft-cap gate has no self-refresh path, wedging the scheduled cloud loop for 51 hours this window with no built-in escape (see Headline + Needs you for the full trace and the two proposed fixes). This is squarely the "ceiling hibernating productive days" shape the meta-loop rail exists to catch: the loop isn't voting on its own constraint, just surfacing that the constraint's own bookkeeping has a gap. Everything else in tonight's pulse points the other way — a fully green breadth check (8/8 verify legs, 1348/1348 e2e), no crash signal, no motion stall (by the full-week measure), and the candidate queue genuinely draining (18→12 pending) under the existing `Promote: aged` mechanism. No other gate, cadence, or ceiling looks mistuned tonight.
