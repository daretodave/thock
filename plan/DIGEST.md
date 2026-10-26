# thock — morning briefing

> Written nightly by `/digest` (the night shift,
> `.github/workflows/night.yml`). Overwritten whole each tick;
> history lives in git.

## Headline

**The big event this window: the repo cut over from nexus v1 (phases) to nexus v2 (specs + chunks)** — PR #1040, opened by `npx @usenexus/cli upgrade` and merged directly by the owner (not by a `march` tick) at 10:14 UTC today, rewrote 185 files: every `skills/*.md`, every `.claude/commands/*.md`, `plan/README.md` (phases → specs/chunks table), `plan/CANDIDATES.md` (renamed from `PHASE_CANDIDATES.md`), `plan/AUDIT.md` (restructured into `## Drained findings` + `## Open findings`), and a large new `scripts/plan/*` + `scripts/cloud/*` toolchain (`pulse.mjs`, `promote.mjs`, `support.mjs`, `improve.mjs`, quota/cadence/idle governors). Knobs landed conservative: `Improve: gentle`, `Support: triage-only`, `Promote: owner`, `stall_action: alert`, `loop: off`. **Since the merge, the loop has kept shipping** — the first post-merge `march` tick (16:26→17:06 UTC) shipped today's W44 trend snapshot, confirming v2 dispatch is live despite the PR's own "idle until `NEXUS_LOOP_MODE=owner` is set" caveat. Before the merge, two more cross-link/content items landed: a backfilled W43 trend snapshot and a factual correction to `gmk-cyl-zombie-group-buy` (confirmed-buy claim → interest-check, closing out AUDIT `[4.9]` and issue #1039). **This tick's own fresh `pnpm verify` is fully green**, run as 8 sequential foreground legs: typecheck, lint, 862/862 unit tests (109 files), 269/269 script tests, `data:validate` (93 records, cross-refs resolve), a clean production build, `size` within budget (largest tracked page 145.3 KB / 175 KB), and 1340/1340 e2e (~9.1m) against `next start :4173`. `pnpm deploy:check` confirms `READY` at HEAD. **One real finding filed tonight, not from the breadth check but from the pulse-gathering step itself:** `scripts/pulse.mjs` — the brand-new v2 instrumentation this digest now depends on — has four bugs, the worst of which means the "critique pending" number this and every future digest would print is off by roughly **69x** (67 of CRITIQUE.md's 69 "Pending" rows are already-resolved `[x]` entries that script never filters out; real pending is ~1). Filed as AUDIT `[4.8]` below — not fixed tonight, per digest's own rule that breadth/pulse findings become rows, not fixes.

## While you were out

| When (UTC) | Tick | Outcome |
|---|---|---|
| 2026-10-25 14:43 | *(last digest committed, `00e6af34`)* | baseline |
| 14:45→15:06 | cloud march | **shipped** — W43 trend snapshot, backfilled (missing Monday run) (`12f810da`) |
| 18:04→18:10 | cloud march | expand pass 439 — no candidates |
| 21:22→21:28 | cloud march | expand pass 440 — no candidates |
| 23:45→00:19 | cloud march | **shipped** — `gmk-cyl-zombie-group-buy` correction + AUDIT close, closes #1039 (`bd42429c`/`7c18cfb4`) |
| 03:00→03:21 | cloud march | no-op (no commit) |
| *10:14* | *owner merge, not a march tick* | **nexus v1 → v2 cutover**, PR #1040 (`217f39dc`/`f82707e5`) |
| 09:37→09:55 | cloud march | no-op (no commit; ran against pre-merge main) |
| 16:26→17:06 | cloud march | **shipped** — W44 trend snapshot, first post-v2-merge tick (`951de955`) |
| 16:50→ (now) | night (this tick) | in progress |

Since the last digest: **7 completed `march` runs, all `success`** (3 shipped, 2 expand no-ops, 2 no-commit no-ops) plus the owner's direct v2-cutover merge. **4 `heartbeat` runs**, all `success`. **Lighthouse ran on every push** (success, with a few `skipped` concurrency collisions around the merge) — still active, no regression. **2 Dependabot update PRs failed their own CI today** (`next` 16.3.5→16.4.1 and `zod` 4.4.3→4.6.6 both opened fine; two sibling bumps — `vite`, `@vitest/mocker` — failed); 7 Dependabot PRs are open total, the oldest three (#946-948) now ~2 months old. Not a loop concern tonight, just a silting queue nobody's draining — noted, not filed.

## Shipped

1. **W43 trend snapshot** (backfilled) — `data/trends/2026-W43.json` (`12f810da`)
2. **`gmk-cyl-zombie-group-buy` correction** — title/lede/section rewritten from "confirmed open group buy" to "interest check," matching the W43 tracker's own reversal (score 70→45) and the live vendor page; AUDIT `[4.9]` addressed, closes #1039 (`bd42429c`/`7c18cfb4`)
3. **Nexus v1 → v2 cutover** — owner-merged PR #1040, 185 files (tooling/process, not product code)
4. **W44 trend snapshot** — `data/trends/2026-W44.json` (`951de955`), first commit dispatched under v2

## Queues now

**plan:** 0 specs, 0 chunks left, 0 held (v2 spec table starts empty — nothing queued yet for `/plan-a-spec`/`/ship-a-chunk` to pick up).
**audit:** 5 pending (all parked sub-3.0: `[2.7]` stale Mode Sonnet hero-art ×2 variants, `[2.4]` plate-materials tension, `[2.4]` generated-file drift, `[1.8]` orphaned favicon.svg) + 1 new `[3.2]`-and-up-rated finding filed tonight (see Tuning proposals — actually filed as a straight bug row, not a candidate; see below). Note: `pulse.mjs` itself currently reports "0 pending" for this file — that's the bug, not the truth (see Tuning proposals / AUDIT `[4.8]`).
**critique:** pulse says 69 pending, last pass "NaNd ago" — both numbers are wrong (see AUDIT `[4.8]`). Real count: ~1 genuine pending item, the standing `[needs-user-call]` GA-beacon row; real last real pass was 2026-05-10 (~165d ago).
**candidates:** 51 pending (50 >21d), oldest 166d. `Promote: owner` — nothing auto-drains; `/oversight` is the only valve.
**Support (triage-only):** 1 open user issue · first response none (0 opened in 7d) · close 106.4h mean (1 closed in 7d).
**Quota:** unknown — no cached `seven_day` reading yet (first day of the v2 quota governor; `.nexus/quota.json` doesn't exist until a run writes it).

## Needs you

- **oversight needed: candidate queue silting (50 pending >21d, oldest 166d)** — `Promote: owner` means this only drains through `/oversight`; it has been accumulating since before this digest's tracking window and nothing changed it tonight.
- **5 standing `[needs-user-call]` rows awaiting an `/oversight` decision**, unchanged this tick: GTM consent-gate vs. reverting to Plausible (AUDIT `[3.6]`); `/article`/`/tag` soft-404 structural block (AUDIT `[4.2]`); mirrored `loop:opened` GitHub issues that can go permanently un-drained (AUDIT `[3.0]`) — **live example right now: issue #1025 (11 days old) is exactly this, still open**; default-state UI border contrast, needs a global dark-theme lightness call (AUDIT `[1.3]`); production GA `/g/collect` 503s, config lives outside the repo (CRITIQUE, the file's only real pending row).
- No `escalate #N` lines (no open `triage:needs-user` issue past the 7-day `escalate_days` default) and no `triage:needs-user`/`loop:do` issues open at all.
- No motion-stalled alert — shipped 10 last full week vs. 6.25 baseline, floor 3.13, reads `ok`.
- No secrets rotation due (`secrets.mjs audit`: 0 events).

## Today's intent

No ready spec/chunk (v2's table is empty — this is expected the first day after cutover, not a gap). Top actionable finding for the next `/iterate` tick: the new AUDIT `[4.8]` `scripts/pulse.mjs` bug row below — a same-file, four-bug, mechanical fix with no gate/schema implications, scoring above everything else currently open. Runner-up: whatever a fresh general-purpose audit sweep turns up, since all 5 pre-existing AUDIT rows are parked sub-3.0 and CRITIQUE's only real pending row is non-actionable by the loop.

## Tuning proposals

None filed as `plan/CANDIDATES.md` rows tonight. The one instrumentation defect found (`scripts/pulse.mjs` under/over-counting across four separate bugs) is a plain bug in freshly-landed v2 tooling, not a gate/cadence/rule mistuning — filed as AUDIT `[4.8]` instead, per `skills/digest.md` §4.2 ("breadth/pulse-discovered findings become AUDIT rows, not fixes") and the meta-loop rail (proposals only for gate/cadence/rule tuning, never plain bugs). The candidate-queue-silting symptom already has its own dedicated "Needs you" line in this template; no separate tuning candidate needed for it tonight.
