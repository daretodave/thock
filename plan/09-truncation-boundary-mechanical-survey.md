# 09 — Truncation-boundary mechanical survey

> A mechanical grep gate that flags any user-facing string
> truncation call site that bypasses the two vetted
> boundary-aware helpers, plus a regression-guard test battery
> on the helpers themselves — so a hard-cut-mid-word truncation
> bug never again ships undetected across 5+ independent call
> sites before anything catches the pattern.

## Why

Five independent hard-cut-mid-word truncation defects were
fixed in one ~24h digest window (2026-08-10T11:08 →
2026-08-11T11:16 UTC, 10 commits): quiz-card truncation
consolidated onto a shared helper; an article OG lede switched
onto that helper; three more OG-image routes found still
mid-word-truncating after the first consolidation; the shared
`apps/web/src/lib/truncate.ts` helper itself — the very thing
the first fix consolidated onto — still hard-cut mid-word with
no boundary search; and `packages/seo/src/buildMetadata.ts`'s
separate `truncateForMeta()` helper, an independent
implementation, carried the same defect. Five instances in one
digest window is denser than any other mechanically-surveyed
cluster in `plan/CANDIDATES.md`'s history. At least two
distinct truncation implementations existed, neither started
boundary-aware — each was reactively patched one call site at a
time, with three of the five fixes being the same defect
resurfacing in code the previous fix in the chain had just
touched. Candidate `[score 6.5]` (proposed 2026-08-11, 97 days
old), auto-promoted (aged) `/march` depth promotion, veto
#1082.

No existing mechanism covers this class the way
`og-coverage-check.mjs` covers OG route presence or
`article-language-check.mjs` covers stale-phrase drift: nothing
scans the codebase for a user-facing `.slice(0, N)` /
`.substring(0, N)` call that bypasses the two vetted helpers,
and nothing regression-tests that the helpers themselves stay
boundary-aware as they evolve.

(`truncate()` and `truncateForMeta()` are both already
boundary-aware today — fixed in the pass-5 commit chain above.
This spec is the mechanical net that stops the pattern from
resurfacing, not a fix for a currently-live defect.)

## Design

- **Regression-guard tests** on the two existing helpers:
  - `apps/web/src/lib/__tests__/truncate.test.ts` (extend if a
    test file already exists, else create): a fixture battery
    at and around boundary-adjacent lengths (exact `max`, one
    under, one over, a leading token longer than `max`, a
    leading token longer than `max + WORD_EXTENSION_BUDGET`, a
    string with no spaces at all) asserting the result never
    ends mid-word (no non-whitespace character immediately
    followed by what would have been a cut) and always ends in
    `…` when truncated.
  - `packages/seo/src/__tests__/buildMetadata.test.ts` (extend
    if present, else create a sibling test file) — the same
    fixture shape against `truncateForMeta()`.
  - Both run under the existing `vitest` per-workspace
    `test:run` leg already in `pnpm verify` — no new verify leg
    for this half.
- **Mechanical grep gate**, `scripts/truncation-call-site-check.mjs`,
  mirroring `og-coverage-check.mjs`'s shape (gate / `--write` /
  `--json` modes, AUDIT.md row filing, dedup):
  - Scans `apps/web/src` and `packages/*/src` (excluding
    `__tests__`, `*.test.ts(x)`, `node_modules`) for
    `.slice(0, <number>)` / `.substring(0, <number>)` calls.
  - A heuristic narrows to **user-facing display text**, not
    every array/date/id slice in the codebase (today's corpus
    has ~35 `.slice(0, N)` call sites, almost all array
    pagination or ISO-date-prefix extraction): flag a call only
    when its receiver is a property/variable whose name matches
    a display-text pattern (`description`, `summary`, `title`,
    `lede`, `excerpt`, `text`, `body`, `headline`, `name` — the
    same literal/regex list `article-language-check.mjs` or
    `og-coverage-check.mjs` use for their own narrowing) **and**
    the call is not inside `apps/web/src/lib/truncate.ts` or
    `packages/seo/src/buildMetadata.ts` (the two vetted
    implementations) **and** the result is not immediately
    `.length`-compared or array-indexed (which would mark it as
    non-text slicing).
  - Gate mode (no args, or called from `pnpm verify`): exit 1
    with every flagged call site (`file:line`) if any hit.
  - `--write`: append an `engineering` `plan/AUDIT.md` row per
    hit, deduplicated by `file:line`, same contract as
    `og-coverage-check.mjs --write`.
  - `--json`: `{ hits: [...] }` for programmatic use (digest's
    nightly run).
- **Wiring**:
  - Add `truncation-call-site-check.mjs` gate-mode call as a new
    `pnpm verify` leg (a `grep:*` or `check:*` step alongside
    the existing survey scripts' verify wiring — follow whatever
    convention the nearest sibling check uses in
    `package.json`/`pnpm-workspace` scripts today).
  - Add a `scripts/__tests__/truncation-call-site-check.test.mjs`
    (mirroring `scripts/__tests__/og-coverage-check.test.mjs`)
    exercising gate mode against a fixture violation and a clean
    fixture, run via the existing `pnpm test:scripts` leg.
  - Add the `--write` invocation to `skills/digest.md` §3's
    breadth-check list (alongside
    `article-internal-consistency-check.mjs` and
    `group-buy-article-staleness-check.mjs`), same `--write`
    contract, never blocking the digest commit.

### Decisions made upfront (do not ask)

- Narrow-by-identifier-name heuristic over full type-flow
  analysis: a type-checker-backed "is this a display string"
  pass would need real type information at grep-script scope
  (no TypeScript compiler API dependency exists in any sibling
  survey script); a name-pattern heuristic matches how
  `article-language-check.mjs` already narrows its own scans and
  keeps this a grep-script, not a new tool class. False
  negatives (a mis-named display variable) are an acceptable
  trade — the mechanical net's job is to catch the *next*
  five-instance cluster, not every instance ever.
- Gate (gate-mode call in `pnpm verify`) plus digest `--write`
  (AUDIT row), not digest-only: the defect class shipped 5 times
  with a passing `pnpm verify` each time; a per-commit gate is
  the whole point, mirroring `og-coverage-check.mjs`'s own
  per-commit placement rather than deferring detection to the
  nightly-only breadth check.
- No change to `truncate()` or `truncateForMeta()`'s runtime
  behavior — both are already boundary-aware. This spec adds
  tests and a gate, not a third implementation.

## Acceptance

- **A6** `skills/digest.md` §3's breadth-check list includes the
  `--write` invocation, same AUDIT-row-filing contract as its
  siblings, never blocking the digest commit.

## Open questions

None.

## Chunks

Measure: 1 open · 6 closed · next A8

- [ ] **09.3** Wire `--write` into digest's nightly breadth check · S · closes A6 · needs —
  - `skills/digest.md` §3's breadth-check list: add
    `node scripts/truncation-call-site-check.mjs --write`
    alongside `article-internal-consistency-check.mjs` and
    `group-buy-article-staleness-check.mjs`, same "non-zero exit
    logs and continues, never blocks the digest commit" contract.
  - No script change in this chunk — 09.2's `--write` contract
    already matches what the digest call site expects.
