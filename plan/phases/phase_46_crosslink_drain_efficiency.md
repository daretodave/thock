# Phase 46 — Cross-link drain efficiency

> **Status:** pending  
> **Score:** 6.0 (pass-125 candidate)  
> **Ships:** skills/iterate.md + skills/march.md + one unit test. No URL/schema/app-code change.

## Outcome

`/iterate` becomes cluster-aware for cross-link findings: when the top-scored row is
`category: cross-links` for article X, it drains **all** pending cross-link pairs touching X
in one commit instead of one pair per tick. Collapses the ~52 surviving same-pillar `[4.5]`
rows from ~52 ticks to ~15–20 ticks.

## Why

The 65 weakest adjacent-pillar rows were pruned at the 2026-06-14 oversight. The 52
same-pillar `[4.5]` rows remain and drain at 1/tick. At the current cloud cadence that is
~52 ticks of maintenance, blocking every other iterate improvement. The drain can be ~3–4×
faster by batching per article: instead of fixing X↔A alone, pick up X↔A, X↔B, X↔C in
the same commit.

The mechanism already exists: `scripts/article-crosslink-survey.mjs --slug X --json`
returns all unlinked pairs involving X. `skills/iterate.md` just needs to use it.

## Scope

### 1. Unit test (scripts/__tests__/article-crosslink-survey.test.mjs)

Add one node:test case under "findUnlinkedPairs — scope slug":

```
3 X-pairs (X↔A, X↔B, X↔C) + 1 non-X pair (Y↔Z) → findUnlinkedPairs(all, 'X') returns 3
```

This proves the cluster-size invariant the cluster-aware iterate relies on.

### 2. skills/iterate.md — Step 3 amendment (cross-links cluster-aware)

Add a sub-section under Step 3 for `category: cross-links`:

> When the winning row is `category: cross-links`, extract the slug X (whichever of
> `article-a` / `article-b` appears in more other pending cross-link rows — call it the
> "hub article"). Collect **all** pending `[ ] [cross-links]` rows in `plan/AUDIT.md`
> involving X. Fix all of them in a single commit. For each pair (X, sibling), add a
> markdown link in whichever article body has the cleaner insertion point.
>
> Confirm the full X-pairs set at drain time:
> ```bash
> node scripts/article-crosslink-survey.mjs --json --slug X
> ```
>
> Commit subject: `content: <X> cross-links — N pairs drained`
>
> Tick all addressed rows (mark `[x]`, append hash) in the single `audit:` follow-up.

### 3. skills/march.md — Step 3b.5a note

Add a parenthetical after the cross-link survey invocation noting that when `/iterate`
picks a cross-link finding, the cluster-aware Step 3 logic batches all X-pairs — no
additional march-level orchestration needed.

## Decisions

- **node:test not Vitest:** the crosslink survey's existing tests use `node:test` (run by
  `pnpm test:scripts`). The new test goes in the same file for consistency.
- **Hub-article selection:** when both slugs in the winning row appear in the same number
  of pending rows, pick the one that is `article-a` in the row (alphabetically earlier).
  Simple deterministic tie-break; documented in the commit body.
- **AUDIT.md tick:** all addressed rows tick in one `audit:` follow-up commit, not one per
  pair. Keeps the Phase log linear.

## Verify contract

`pnpm verify` (typecheck → test:run → test:scripts → data:validate → build → size → e2e)
must pass. The unit test is the only new gate addition.
