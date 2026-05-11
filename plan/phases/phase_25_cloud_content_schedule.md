# Phase 25 — Cloud autonomous content schedule

> **Status:** pending → in progress  
> **Prerequisites:** Phase 24 (ship-content skill) — shipped at `8b49296`

---

## Outcome

The cloud loop produces content autonomously. Every march tick — including the hourly scheduled run — dispatches `/ship-content` when `plan/AUDIT.md` has content-gap rows scoring ≥ 3.0. The content pipeline drains the pillar-quota shortfall (ideas 3/8, deep-dives 3/8, guides 2/8) article by article across subsequent ticks.

---

## Why

Phase 24 codified the `/ship-content` skill and wired it into `skills/march.md` Step 3b.5. That's the verb. Phase 25 is the noun: it primes the content queue so the dispatch machinery has work to pick up. Without seeded audit rows in the `category: content-gaps` format, march Step 3b.5 always exits "no content queue — falling through" even though the four bearings rules clearly identify shortfalls.

The original brief called for a `cron: '0 14 * * 1'` (Monday 14:00 UTC) addition to `march.yml`. As of 2026-05-11 the workflow already runs hourly (`cron: '0 * * * *'`), which naturally covers Monday 14:00 UTC and every other hour of every day. Adding a second cron for the same job at the same time would queue a duplicate tick behind the hourly tick in the `march` concurrency group — net effect: two ticks instead of one, one redundant. Decision: document the existing cadence in the workflow instead of adding a redundant entry.

---

## Scope

### 1. Phase brief (this file)

Commit separately before any code changes — per `skills/ship-a-phase.md` §2.

### 2. Content-gap rows in `plan/AUDIT.md`

Seed one finding row per Rule-1 pillar shortfall (the immediate bottleneck):

| Pillar | Current | Quota | Shortfall | Impact | Ease | Raw score | ×1.5 bias |
|--------|---------|-------|-----------|--------|------|-----------|-----------|
| ideas | 3 | 8 | 5 | 7 | 5 | 3.5 | **5.25** |
| deep-dives | 3 | 8 | 5 | 7 | 5 | 3.5 | **5.25** |
| guides | 2 | 8 | 6 | 6 | 5 | 3.0 | **4.5** |

All three score ≥ 3.0 after the bias multiplier → march Step 3b.5 dispatches `/ship-content` starting on the next tick.

Rule 2 (tracker linkage): W19 has one unlinked non-flat row (DCS Olivetti) but it hasn't crossed the 2-week threshold yet — the audit will surface it naturally when it does.

Rule 3 (group-buy companions): all five live group buys already have companion articles — no rows needed.

### 3. Workflow annotation

Add a human-readable comment to `.github/workflows/march.yml` beside the existing hourly cron entry documenting that Monday 14:00 UTC content-schedule intent is served by the `'0 * * * *'` cadence. No new cron entry.

### 4. Verify gate

`pnpm verify` — no new code or data schemas ship in this phase, so the gate is checking that the brief commit and AUDIT.md edit didn't break anything. Expected: green on first run.

### 5. Build plan tick

Flip `[ ] Phase 25` → `[x] Phase 25` in `plan/steps/01_build_plan.md`. Separate commit.

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monday cron vs. hourly | No new cron added; existing `'0 * * * *'` subsumes it | Adding a duplicate cron at 14:00 Monday would enqueue a second tick in the `march` concurrency group at the exact moment the hourly cron already fires — waste, not value |
| Seed rows vs. wait for /iterate | Seed now | `/iterate` generates rows dynamically but only when dispatched; seeding primes the queue so /ship-content fires on the NEXT tick instead of waiting for an /iterate tick to generate the rows first |
| How many rows to seed | One per pillar shortfall (3 rows) | One row per pillar is enough to keep /ship-content dispatching across multiple ticks; the shortfall count (5 or 6 articles per pillar) is documented in each row's body so future ticks know when to retire the finding |

---

## Verification (how to confirm Phase 25 is working)

After this phase ships, the next cloud march tick should dispatch `/ship-content` rather than fall through to `/iterate` or `/expand`, because AUDIT.md now has content-gap rows scoring ≥ 3.0 after the 1.5× bias. The shipped article's commit (from that subsequent tick) is the empirical proof. The phase is complete when the dispatch loop is live — proof-by-shipment follows naturally.
