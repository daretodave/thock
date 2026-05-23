# Phase 36 — Content language quality gate

> Score: 4.5 (pass-24 candidate, strengthened pass 25)
> Status: in progress
> Issue: #194

## Outcome

A mechanical linter (`scripts/article-language-check.mjs`) that catches
static-MDX temporal anti-patterns at ship time — before they enter the
corpus and accumulate copy-fix debt.

## Why

Four consecutive copy-fix commits between 2026-05-21 and 2026-05-23 fixed
the same class of anti-pattern in five different articles:
- `75ad5a0` — gmk-cyl-ramune: "approximately 2026-06-20" imprecise dates
- `f98048f` — gmk-cyl-prussian-alert: "We will revisit when the GB closes"
- `6fba00d` — gmk-cyl-greg-2: "We will revisit when the order numbers settle"
- `9055ece` — building-mode-sonnet: "We'll report back if that swap happens"
- `0338e99` — keychron-q-ultra-zmk: three stale temporal phrases

Bearings Rule 4 documents the invariant ("static MDX articles must not
contain relative-time phrases that decay for every reader after publication")
but does not enforce it at write time. The `/ship-content` pipeline has no
checkpoint before committing a new article. This phase adds one.

## Deliverables

### 1. `scripts/article-language-patterns.json`

JSON-configurable forbidden-pattern list. Two pattern types:

- **literal** (default): plain string, matched case-insensitively
- **regex**: ECMAScript regex, matched with `gi` flags

Seed patterns:
- `will revisit` — unfulfillable editorial promise
- `report back` — unfulfillable editorial promise
- `check back` — implies future update that static MDX cannot deliver
- `stay tuned` — implies future broadcast
- `coming soon` — implies future content update
- `the buy is live` — stale after window closes; use absolute dates
- `approximately \d{4}` (regex) — imprecise year; use exact date
- `approximately Q[1-4]` (regex) — imprecise quarter
- `approximately (?:January|...|December)` (regex) — imprecise month+year
- `\d+\s+weeks?\s+from\s+now` (regex) — relative time reference
- `\d+\s+months?\s+from\s+now` (regex) — relative time reference

### 2. `scripts/article-language-check.mjs`

CLI:
```
node scripts/article-language-check.mjs <file.mdx> [...]
  Gate mode: exit 1 if violations, exit 0 if clean. Prints violations.

node scripts/article-language-check.mjs --write
  Scan mode: walks apps/web/src/content/articles/, appends AUDIT.md rows
  for articles with violations. Exits 0 on completion.

node scripts/article-language-check.mjs --json [file.mdx ...]
  JSON output: { violations: [...] } for programmatic use.
```

Scans body only (frontmatter stripped). Reports per-violation:
file, line number, matched text, pattern ID, description.

### 3. `scripts/__tests__/article-language-check.test.mjs`

Using `node:test` (consistent with other scripts tests):
- Positive test: MDX body with "we will revisit when numbers land" → violation detected
- Negative test: MDX body with "the buy opened on 2026-05-15" → no violation

### 4. `skills/ship-content.md` Step 7 amendment

Insert language gate as Step 7a before the commit:

```
node scripts/article-language-check.mjs apps/web/src/content/articles/<slug>.mdx
```

If violations found:
1. Pass violation list back to content-curator with revision brief
2. Re-run content-curator (once)
3. Re-run language check on revised article
4. If violations persist: hard-fail — do not commit. Stop per §8.

### 5. Optional one-time corpus scan (in ship commit)

Run `--write` mode in the ship commit to file AUDIT rows for any
existing violations in the 42-article corpus. Fixes drain in subsequent
iterate ticks.

## Non-goals

- Does not modify article content (linter only, no auto-fix)
- Does not add new routes, components, or schemas
- Does not change the verify gate (test:scripts already covers scripts tests)
