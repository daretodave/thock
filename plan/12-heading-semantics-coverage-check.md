# 12 — Heading-semantics coverage check

> A mechanical survey that scans list/card-rendering components
> for a title/name prop rendered as a styled span or link instead
> of a real heading tag, so the next catalog surface doesn't need
> its own reactive audit-and-fix cycle to catch the same defect
> shape a fifth time.

## Why

Four independent reactive fixes landed within about a day, same
root cause each time: a list/card item's title rendered as a
styled span/link inside the card's `Link`, not a heading element,
so a screen-reader user navigating by heading found far fewer
headings than the page visually implies. `e72b4bfd`/`f7be550c`
(closes #696) — `/vendors`, `/parts`, `/tools`, `/vendor/[slug]`
item titles. `7b810d80`/`bf940e4d` (closes #699) — `/archive`'s
74-article listing, only the month-group label was a real
heading. `67f898dc`/`941fefe9` (closes #700) — part-kind index
cards. `2597054a`/`188a66b4` (closes #701) — quiz result cards
and compare tables. Each was caught only by a fresh audit sweep
discovering the next surface the previous fix hadn't touched.
Candidate `[score 6.0]` (proposed 2026-08-02, 113 days old),
auto-promoted (aged) `/march` depth promotion.

No existing mechanism covers this class: `apps/e2e/tests/a11y.spec.ts`'s
axe sweep only asserts WCAG rule violations on a fixed canonical-
page sample — it doesn't enumerate every list/card-rendering
component sitewide and assert its title element is a heading tag.
Unlike `og-coverage-check.mjs` (sweeps route directories) or
`a11y-spec-coverage-check.mjs` (sweeps the canonical-urls
fixture), there was no existing inventory this defect class could
be swept against — the same "survey the thing the loop keeps
independently discovering by hand" shape as both of those
precedents.

## Design

- **`scripts/heading-semantics-coverage-check.mjs`**, mirroring
  the shape of `og-coverage-check.mjs` / `a11y-spec-coverage-check.mjs`
  (gate / `--write` / `--json` modes, AUDIT.md row filing, dedup):
  - A curated list of known list/card-rendering components —
    seeded from the four fix commits
    (`VendorCard`, `VendorBoardSection`, `VendorSwitchSection`,
    `VendorKeycapSetSection`, `apps/web/src/app/parts/page.tsx`,
    `apps/web/src/app/tools/page.tsx`, the `/archive` item list,
    the part-kind index cards, quiz result cards, compare
    tables) plus any sibling component under
    `apps/web/src/components/**` whose props include a
    `title`/`name`/`label` field rendered as the primary visible
    text of a repeated list/card item (grep-detectable: a
    component file that both maps over an array prop and
    renders one of those prop names as the first text node of
    the mapped item).
  - For each listed component's source file, statically check
    that the title/name expression is rendered inside an `h1`–`h6`
    (or a component whose own name starts with `H` and wraps a
    heading tag, e.g. `<Heading>`) ancestor within the same JSX
    return block — not bare inside a `span`/`Link`/`div` with no
    heading ancestor. A per-component string/AST scan (regex over
    the JSX is acceptable, mirroring `truncation-call-site-check.mjs`'s
    receiver-name heuristic rather than a full TSX parser) is
    sufficient — this is a coverage survey, not a type-checker.
  - Gate mode (default, called from `pnpm verify`): exit 1 with
    every flagged component (file + prop name) if any hit.
  - `--write`: append an `a11y`-category `plan/AUDIT.md` row per
    hit, deduplicated against existing pending rows, same
    contract as `og-coverage-check.mjs --write`.
  - `--json`: `{ flagged: [...] }` for programmatic use (digest's
    nightly run).
- **Unit tests** (`scripts/__tests__/heading-semantics-coverage-check.test.mjs`,
  mirroring `scripts/__tests__/og-coverage-check.test.mjs`):
  - A fixture component whose title prop renders inside a bare
    `span`/`Link` → flagged.
  - A fixture component whose title prop renders inside an `h2`/`h3`
    → clean.
  - A fixture component whose title renders inside a `<Heading as="h3">`-style
    wrapper → clean (component-name heuristic).
  - Run via the existing `pnpm test:scripts` leg — no new verify
    leg for the test half.
- **Wiring**: add the gate invocation to `pnpm verify` (per-commit,
  since this catches a defect shape a *new* component can
  introduce at write time — unlike spec 10's corpus-drift shape,
  this is a per-commit regression risk the loop itself can
  reintroduce), plus `--write` in `skills/march.lanes.md`'s
  survey chain and `skills/digest.md`'s nightly breadth check,
  alongside the other mechanical surveys, for the existing-corpus
  sweep.

### Decisions made upfront (do not ask)

- **Per-commit gate, not survey-chain-only**: unlike spec 10's
  `stale-updated-at-check.mjs` (corpus drift from edits that
  already landed), this defect class is introduced at
  component-authoring time — a *new* list/card component can ship
  with the same span/link-not-heading mistake on day one. A
  per-commit `pnpm verify` leg (mirroring
  `truncation-call-site-check.mjs`'s placement) catches it before
  it ships, not days later via a nightly survey. The `--write`
  survey-chain pass still runs for the existing corpus — rows
  file against anything not yet covered by the curated component
  list.
- **Curated component list, not a fully generic sitewide scan**:
  page layouts and component shapes vary too much for a single
  generic "find every repeated list/card" heuristic without heavy
  false positives (e.g., a tag chip list is not a heading
  candidate). The curated list covers the four known-fixed
  surfaces plus any component matching the map-over-array +
  title/name/label-as-first-text-node heuristic; a human reviewing
  `--json` output can extend the curated list by hand when a new
  pattern is added, same one-time-authoring-cost tradeoff
  `og-coverage-check.mjs` already accepted for its own route
  enumeration.
- **No change to any component's rendered output**: this spec
  adds detection only. Any flagged component gets fixed in a
  follow-up iterate tick (the same `<h2>`/`<h3>` wrap pattern the
  four precedent fixes already used), not inline in this phase.

## Acceptance

- **A1** `scripts/heading-semantics-coverage-check.mjs` exists,
  mirrors the `og-coverage-check.mjs` shape (gate / `--write` /
  `--json`).
- **A2** Gate mode flags a fixture component whose title/name
  prop renders inside a bare `span`/`Link` with no heading
  ancestor, and passes a fixture component whose title renders
  inside an `h1`–`h6` (or `<Heading as="hN">`-style wrapper).
- **A3** `--write` appends an `a11y`-category `plan/AUDIT.md` row
  per hit, deduplicated against existing pending rows.
- **A4** `scripts/__tests__/heading-semantics-coverage-check.test.mjs`
  exercises A2's fixture cases, run via `pnpm test:scripts`.
- **A5** The gate invocation is wired into `pnpm verify` as a new
  script-check leg (mirroring `truncation-call-site-check.mjs`'s
  placement), and the `--write` invocation is added to
  `skills/march.lanes.md`'s survey chain and `skills/digest.md`'s
  nightly breadth-check list, same best-effort / non-blocking
  contract as their sibling surveys.
- **A6** Running the gate against the current corpus (post the
  four precedent fixes) exits 0 — no regression on the already-
  fixed surfaces.
- **A7** No schema, component, or URL-contract change; no change
  to any component's rendered markup.

## Open questions

None.

## Chunks

Measure: 7 open · 0 closed · next A8

Not chunked yet.
