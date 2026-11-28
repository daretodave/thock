# 13 — ItemList JSON-LD parity check

> A mechanical survey that diffs each route's `ItemList` JSON-LD
> `itemListElement[].url` order against the actual rendered anchor
> hrefs in that route's list section, so the next catalog surface
> doesn't need its own reactive audit-and-fix cycle to catch the
> same "JSON-LD computed separately from what's rendered" defect
> shape a sixth time.

## Why

Four independent reactive fixes landed across two ticks, same
root cause each time: a route's `page.tsx` computed its `ItemList`
JSON-LD from a separately-derived query/sort/filter instead of
reusing the exact array already used to render the visible list.
`ac241f7e` (closes #862) — home's `itemListPaths` was an
independently computed top-4-most-recent sort labeled "Latest by
pillar," while the rendered `<LatestByPillar>` grid shows one pick
per pillar (`byPillarPicks`) — the JSON-LD omitted real rendered
content. `9ebbd294` (closes #864) — `/tags`' `itemListItems` was
built from the raw alphabetical tags array while `<TagsIndex>`
renders tags grouped by category via `groupTagsByCategory` —
orders diverged completely; the commit message names it the same
defect class as the home-page fix. `a850625d` (closes #865) —
`/ideas`' `itemListItems` was an independent publishedAt-desc sort
over all articles while the page renders `buildPick` first, then
`lead`, then `archive` (excluding both) — orders diverged whenever
the build-of-the-week pick wasn't also the most recent article,
and could drop the pick from the JSON-LD entirely. `03a6a392`
(closes #866) — `/sources`' `ItemList` now mirrors exactly what
`<SourceCounts>` renders via a shared `getSortedCitedRows()`
helper (`/group-buys`' narrower "— active" scope was confirmed
intentional, no change needed there). Candidate `[score 6.0]`
(proposed 2026-08-14, 104 days old), auto-promoted (aged) `/march`
depth promotion.

`grep -rl "ItemList" apps/web/src/app` returns 19 route files
(archive, compare/board, compare/switch, deep-dives, group-buys,
group-buys/past, guides, ideas, news, newsletter, page [home],
part/[kind], parts, sources, tag/[slug], tags, tools, trends,
vendors) — 5 confirmed drifted (4 fixed, 1 confirmed-intentional-
scope), 14 unaudited. No existing mechanism covers this class:
`og-coverage-check.mjs` detects missing OG files;
`a11y-spec-coverage-check.mjs` detects missing test assertions;
neither renders a page and diffs its JSON-LD `ItemList`
`itemListElement` URLs against the actual rendered anchor hrefs in
the corresponding list section. This is a distinct "JSON-LD ↔
rendered-DOM parity" class from every currently-shipped survey.

## Design

- **`scripts/itemlist-jsonld-parity-check.mjs`**, mirroring the
  shape of `og-coverage-check.mjs` / `a11y-spec-coverage-check.mjs`
  / `heading-semantics-coverage-check.mjs` (gate / `--write` /
  `--json` modes, AUDIT.md row filing, dedup):
  - A curated per-route mapping (route file → the JSON-LD
    `ItemList` literal's source location → the rendered list
    section's component/boundary), seeded from the 19 grep-
    matched route files, since page layouts vary too much for a
    single generic diff — the same one-time-authoring-cost
    tradeoff `og-coverage-check.mjs` already accepted for its own
    route enumeration.
  - Static extraction (regex/string scan over the route's source,
    mirroring `truncation-call-site-check.mjs`'s receiver-name
    heuristic rather than a full render-and-diff, since a full
    Next.js render per route is too heavy for a mechanical
    per-commit or nightly script) of: (a) the JSON-LD
    `itemListElement[].url` array in declared order, and (b) the
    array variable actually passed to the rendered list section's
    map/iteration.
  - Flag two shapes: an **order mismatch** (same URL set, different
    sequence) and a **set difference** (JSON-LD narrower or wider
    than what's rendered) — both as `seo`-category findings.
  - Gate mode (default, called from `pnpm verify`): exit 1 with
    every flagged route (file + mismatch shape) if any hit.
  - `--write`: append a `seo`-category `plan/AUDIT.md` row per
    hit, deduplicated against existing pending rows, same contract
    as `og-coverage-check.mjs --write`.
  - `--json`: `{ flagged: [...] }` for programmatic use (digest's
    nightly run).
- **Unit tests** (`scripts/__tests__/itemlist-jsonld-parity-check.test.mjs`,
  mirroring `scripts/__tests__/heading-semantics-coverage-check.test.mjs`):
  - A fixture route whose JSON-LD array and rendered array match
    exactly → clean.
  - A fixture route whose JSON-LD array has the same URLs in a
    different order than the rendered array → flagged as an order
    mismatch.
  - A fixture route whose JSON-LD array omits a URL the rendered
    array includes (or includes one it doesn't) → flagged as a set
    difference.
  - Run via the existing `pnpm test:scripts` leg — no new verify
    leg for the test half.
- **Wiring**: add the gate invocation to `pnpm verify` (per-commit,
  since this defect shape is introduced at route-authoring time —
  a *new* or *edited* `ItemList` route can ship with its JSON-LD
  computed from a separately-derived array on day one, the same
  "loop itself can reintroduce this" risk spec 12 reasoned about
  for its own per-commit placement), plus `--write` in
  `skills/march.lanes.md`'s survey chain and `skills/digest.md`'s
  nightly breadth check, alongside the other mechanical surveys,
  for the existing-corpus sweep across the 14 unaudited routes.

### Decisions made upfront (do not ask)

- **Per-commit gate, not survey-chain-only.** Same reasoning as
  spec 12's heading-semantics check: this is a shape a route can
  ship with on day one, not only corpus drift from an edit that
  already landed, so a `pnpm verify` leg catches it before it
  ships. The `--write` survey-chain pass still runs for the
  existing corpus — rows file against any of the 14 unaudited
  routes not yet covered.
- **Curated per-route mapping, not a fully generic diff.** Page
  layouts vary (home's pillar-pick merge, `/tags`' category
  grouping, `/ideas`' pick/lead/archive triage are each shaped
  differently) — a human extends the curated mapping by hand when
  a new `ItemList` route is added, same tradeoff
  `og-coverage-check.mjs` accepted for its own route enumeration.
- **Detection only, no component or route-logic change in this
  phase.** All 5 known instances are already fixed by hand; this
  phase's value going forward is the 14 unaudited routes plus
  regression prevention. Any route this script newly flags gets
  fixed in a follow-up iterate tick, not inline here.

## Acceptance

- **A1** `scripts/itemlist-jsonld-parity-check.mjs` exists,
  mirrors the `og-coverage-check.mjs` shape (gate / `--write` /
  `--json`), with a curated mapping covering all 19 grep-matched
  `ItemList` route files.
- **A2** Gate mode flags a fixture route whose JSON-LD
  `itemListElement` order diverges from its rendered list order
  (same URL set), and separately flags a fixture route whose
  JSON-LD URL set is narrower or wider than what's rendered; a
  fixture route where both match passes clean.
- **A3** `--write` appends a `seo`-category `plan/AUDIT.md` row
  per hit, deduplicated against existing pending rows.
- **A4** `scripts/__tests__/itemlist-jsonld-parity-check.test.mjs`
  exercises A2's fixture cases, run via `pnpm test:scripts`.
- **A5** The gate invocation is wired into `pnpm verify` as a new
  script-check leg, and the `--write` invocation is added to
  `skills/march.lanes.md`'s survey chain and `skills/digest.md`'s
  nightly breadth-check list, same best-effort / non-blocking
  contract as their sibling surveys.
- **A6** Running the gate against the current corpus (post the 4
  precedent fixes plus the confirmed-intentional `/group-buys`
  scope) exits 0 — no regression on the already-resolved
  surfaces.
- **A7** No schema, component, or URL-contract change; no change
  to any route's rendered markup or JSON-LD content beyond what a
  follow-up fix tick addresses.

## Open questions

None.

## Chunks

Measure: 7 open · 0 closed · next A8

- [ ] **13.1** `scripts/itemlist-jsonld-parity-check.mjs` scanner (gate / `--write` / `--json`) · M · closes A1, A2, A3, A7 · needs —
  - New script mirroring `og-coverage-check.mjs`'s shape (gate /
    `--write` / `--json` modes, `plan/AUDIT.md` row filing with
    dedup, same CLI/exit-code contract).
  - Curated per-route mapping covering all 19 grep-matched route
    files named in the Why section (`archive`, `compare/board`,
    `compare/switch`, `deep-dives`, `group-buys`, `group-buys/past`,
    `guides`, `ideas`, `news`, `newsletter`, home `page.tsx`,
    `part/[kind]`, `parts`, `sources`, `tag/[slug]`, `tags`,
    `tools`, `trends`, `vendors`): for each, the file path, the
    JSON-LD `ItemList` literal's source location, and the rendered
    list section's component/boundary — seeded from the 5 already-
    confirmed instances (home's `byPillarPicks`, `/tags`'
    `groupTagsByCategory`, `/ideas`'
    buildPick/lead/archive triage, `/sources`'
    `getSortedCitedRows()`, `/group-buys`' narrower "— active"
    scope marked intentional) and extended by hand for the
    remaining 14 unaudited routes.
  - Static extraction (regex/string scan over each route's source,
    mirroring `truncation-call-site-check.mjs`'s receiver-name
    heuristic — no full render): pulls (a) the JSON-LD
    `itemListElement[].url` array in declared order, and (b) the
    array variable actually iterated by the rendered list section.
  - Flags two shapes as `seo`-category findings: an **order
    mismatch** (same URL set, different sequence) and a **set
    difference** (JSON-LD narrower or wider than rendered).
  - Gate mode (no args): exit 1 printing every flagged route (file
    + mismatch shape) if any hit, exit 0 otherwise.
  - `--write`: append one `seo` `plan/AUDIT.md` row per hit,
    deduplicated against existing pending rows, same contract as
    `og-coverage-check.mjs --write`.
  - `--json`: `{ flagged: [...] }`.
  - No change to any route's rendered markup or JSON-LD content —
    detection only (A7).
- [ ] **13.2** Unit tests + live-corpus regression gate · S · closes A4, A6 · partial A5 · needs 13.1
  - `scripts/__tests__/itemlist-jsonld-parity-check.test.mjs`
    (mirroring `scripts/__tests__/heading-semantics-coverage-check.test.mjs`):
    a fixture route whose JSON-LD array and rendered array match
    exactly (clean), a fixture route whose JSON-LD array has the
    same URLs in a different order than rendered (order-mismatch
    flag), and a fixture route whose JSON-LD array omits a URL the
    rendered array includes, or includes one it doesn't (set-
    difference flag).
  - A further test with no fixture: runs gate mode against the
    real `apps/web/src/app` tree and asserts exit 0 today (A6) —
    covers the 4 already-fixed instances plus the confirmed-
    intentional `/group-buys` scope, and makes any future
    regression on the live corpus fail `test:scripts`, already a
    hard `pnpm verify` leg, satisfying A5's "wired into `pnpm
    verify`" clause with no new top-level script line — the same
    convention `truncation-call-site-check.mjs` relies on.
  - Runs via the existing `pnpm test:scripts` leg.
- [ ] **13.3** Wire `--write` into the survey chain and nightly digest · S · closes A5 · needs 13.1, 13.2
  - `skills/march.lanes.md`'s `empty-queue-refill-post-phase-30`
    survey chain: add `node scripts/itemlist-jsonld-parity-check.mjs
    --write` alongside the other mechanical surveys, same
    "non-zero exit logs and continues, never blocks the commit"
    contract.
  - `skills/digest.md`'s nightly breadth-check list: add the same
    `--write` invocation alongside its siblings.
  - No script change in this chunk — 13.1's `--write` contract
    already matches what both call sites expect.

Not chunked yet.
