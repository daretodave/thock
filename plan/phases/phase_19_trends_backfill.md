# Phase 19 — Trends backfill + `note` schema additive (scout-driven)

> Agent-facing brief. Concise, opinionated, decisive. The second
> phase of the **Real-data backfill** mini-plan promoted from
> PHASE_CANDIDATES (expand pass 1, score 8.0) via /oversight on
> 2026-05-09. Drains three open critique findings:
>
> - pass-3 [MED] `/trends/tracker` — every category section renders
>   exactly one row, so the table chrome dwarfs the data
>   (CRITIQUE.md line 95).
> - pass-2 [LOW] `/trends/tracker` — every editor's-note cell is a
>   uniform em dash (CRITIQUE.md line 212).
> - pass-3 [LOW] `/trends/tracker` — linked rows expose two
>   affordances pointing at the same URL (CRITIQUE.md line 113).
>
> Phase 18 already shipped its surface-mate (group-buys backfill).
> This phase ships a **schema additive** (`note: string?` on
> `TrendRowSchema`), a render branch in `<TrackerRow>` for that
> field, and a scout-driven content backfill from 5 rows → ≥15
> rows (≥3 per category).

## Routes (no new routes)

- `/trends/tracker` (already shipped phase 8). Phase 19 ships
  data, schema, and one render branch — no new surfaces.
- `/trends` pillar already reads from the same snapshot via
  `getLatestTrendSnapshot`; pillar archive count auto-grows.

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getLatestTrendSnapshot()` | manifest | the page reads this; backfill grows the row count |
| `groupByCategory(rows)` | helper | already shipped phase 8 |
| `presentCategories(snapshot)` | helper | filters categories with ≥1 row; auto-includes new ones |
| `getAllArticles()` | manifest | resolves `articleSlug` to article record for editor's-note linking; unchanged |

No new helpers. The page already calls every helper this phase
needs; only the row count and per-row `note` field grow.

## Schema additive

`packages/data/src/schemas/trend.ts`:

```ts
export const TrendRowSchema = z.object({
  name: z.string().min(2).max(80),
  category: z.enum(['switch', 'keycap', 'layout', 'vendor', 'brand']),
  direction: z.enum(['up', 'down', 'flat']),
  score: z.number().min(-100).max(100),
  spark: z.array(z.number()).min(2).max(16),
  articleSlug: z.string().min(2).nullable(),
  note: z.string().min(20).max(280).nullable().optional(),  // NEW
})
```

`note` is the editor's one-line take on **why** the row moved —
≤280 chars, knowledgeable-peer voice. The field is
`.nullable().optional()`:

- **`undefined`**: legacy rows pre-phase-19 stay valid (zero
  migration cost).
- **`null`**: explicit "no editorial take this week" signal —
  renders the existing em dash.
- **string**: rendered as the editor's-note column content
  (replaces the row title duplicate when `articleSlug` is set,
  replaces the em dash when `articleSlug` is null).

## Render branch — `<TrackerRow>` editor's-note column

Existing logic (TrackerRow.tsx lines 65–84) renders one of two
shapes in the desktop editor's-note column:

- **`noteHref` resolves**: `<Link>` with `noteText` = article
  title.
- **`noteHref` null**: bare `—` em dash.

Phase 19's branch:

| `articleSlug` | `note` | desktop column | mobile sub-link |
|---|---|---|---|
| set, resolves | string set | `<Link>` to `/article/<slug>` with `note` text + " →" | `<Link>` to `/article/<slug>` with `note` text + " →" |
| set, resolves | absent / null | `<Link>` with article title (legacy) | `<Link>` with article title (legacy) |
| null | string set | plain `<span>` with `note` text | plain `<span>` with `note` text |
| null | absent / null | `<span aria-hidden>—</span>` (legacy) | `<span aria-hidden>—</span>` (legacy) |

The two regressions this branch closes:

1. **Em dash** — when slug is null but `note` is set, the cell
   renders editorial copy instead of `—`. After backfill, no
   row in the snapshot has both `articleSlug: null` AND `note:
   absent` — so the bare em dash disappears in practice.
2. **Duplicate-link** — when slug is set, the editor's-note
   column renders the `note` (one-sentence editorial take), not
   a duplicate of the article title. The two affordances now
   carry distinct copy: row name says "go read the piece",
   editor's note says "here's why this is moving". Both link to
   the same URL but expose different reasons to click.

The mobile sub-link path (TrackerRow.tsx lines 56–63) shifts in
parallel: when `articleSlug` resolves AND `note` is set, the
sub-link's text becomes the `note` (with " →") instead of the
article title. When `articleSlug` resolves but `note` is absent,
the legacy article-title text stays.

## Components

### Reused (already shipped)

- `<TrackerRow>` (phase 8) — getting one render branch added.
- `<TrackerCategorySection>` (phase 8) — auto-renders ≥3 rows
  per category from the backfilled data; no edit.
- `<TrackerSummaryGrid>` (phase 8) — auto-picks top movers from
  the bigger row pool; no edit.
- `groupByCategory`, `presentCategories`, `weekKicker` (phase 8)
  — no edit.

### New

**Zero new components.** Phase 19 is a schema additive + one
render branch + a data backfill. The page-family code is fully
shipped.

## Scout brief (sub-agent prompt)

When this phase runs (`/ship-a-phase` will invoke), spawn the
`scout` sub-agent with this brief. Scout returns JSON for
≥10 new trend rows (≥2 per category beyond the existing 1 each)
with `note` text written in the knowledgeable-peer voice. The
existing 5 rows also get `note` text added so every backfilled
row carries one — the "uniform em dash" finding can't recur.

> Research **the last ~8 weeks** of mechanical-keyboard movement
> (2026-W11 through 2026-W19, roughly 2026-03-13 → 2026-05-09).
> Return a structured set of trend candidates ready for
> `data/trends/2026-W19.json` — 5 categories (switch, keycap,
> layout, vendor, brand) × ≥3 rows each = **≥15 rows total** —
> with `note` text for every row.
>
> Sources to consult (priority order):
> 1. **GeekHack** — interest-check counts (board=131.0), active
>    GBs (board=132.0), and the keycaps board for set-launch
>    chatter.
> 2. **r/mk** — what's getting upvoted in the last 8 weeks.
> 3. **Vendor storefront badges** — "back in stock", "sold out",
>    "GB live" labels at CannonKeys, NovelKeys, KBDfans, Mode,
>    Wuque (already HEAD-probed clean in phase 18).
> 4. **Theremin Goat** / **TaehaTypes** / **Hipyo Tech** — recent
>    YouTube uploads in the last 8 weeks; the most-viewed
>    topics correlate with what's trending in community chatter.
>
> For each candidate row, return JSON in this shape (matches
> the post-phase-19 `TrendRowSchema`):
>
> ```json
> {
>   "name": "<canonical product / vendor / brand / layout name>",
>   "category": "switch | keycap | layout | vendor | brand",
>   "direction": "up | down | flat",
>   "score": <integer -100..100>,
>   "spark": [<8 numeric values, monotonically reasonable for direction>],
>   "articleSlug": "<published-article slug if a thock piece covers this row, else null>",
>   "note": "<one-sentence editorial take, 20-280 chars, knowledgeable-peer voice>"
> }
> ```
>
> Score / direction / spark conventions:
> - **`up`**: positive score (typically +10 to +50). Spark
>   trends upward across the 8 values.
> - **`down`**: negative score. Spark trends downward.
> - **`flat`**: score in [-9, +9]. Spark wiggles around a
>   baseline.
> - Spark length is exactly 8 (one per week, oldest to newest).
> - Score is the most recent week's value.
>
> Voice rules for `note` (≤280 chars, ≥20 chars):
> - Knowledgeable peer; reasoning over hype.
> - State *what moved* and *why* in one sentence. Examples:
>   - "Holy Pandas 2 R3 GB closed in March; secondhand demand
>     filtered into r/mechmarket through April." (switch / up)
>   - "Stagger discourse cooling on r/mk after the GMK Bento
>     run sold through; community attention shifting to
>     ortho." (layout / down)
> - **Never**: "everyone's talking about", "you don't want to
>   miss", "explosive growth", "biggest" / "best".
> - Distinct from any matching article's title — phase 19's
>   second job is killing the duplicate-link surface.
>
> **Existing 5 rows** also need `note` text added (same voice
> rules). Keep their existing `articleSlug` mappings:
> - Gateron Oil King (switch, up, 42, articleSlug:
>   gateron-oil-king-deep-dive) — note distinct from the
>   article title "Why the Gateron Oil King sounds the way it
>   does."
> - MT3 profile (keycap, flat, 4, articleSlug: null)
> - Alice layout (layout, down, -18, articleSlug:
>   alice-layout-decline) — note distinct from the article
>   title "The slow decline of the Alice layout."
> - Mode Designs (vendor, up, 24, articleSlug: null)
> - Wuque Studio (brand, flat, 8, articleSlug: null)
>
> **`articleSlug` mapping** for new rows: only set when a
> published thock article covers the row's subject. The current
> article slugs are `beginners-switch-buying-guide`,
> `building-mode-sonnet-with-oil-kings`,
> `gateron-oil-king-deep-dive`, `alice-layout-decline`,
> `trends-tracker-preview`, `mode-sonnet-r2-group-buy-coverage`.
> Anything else → `articleSlug: null`.
>
> Return JSON only:
>
> ```json
> {
>   "rows": [{...}, ...],   // ≥15 entries (5 existing rewritten with `note` + ≥10 new)
>   "notes": "<one paragraph: research method, what surprised you, gaps>"
> }
> ```
>
> **Do not write any files.** The calling /ship-a-phase tick
> handles the writes.

## Cross-links

**In:**
- `/trends/tracker` reads the snapshot — auto-grows row count.
- `/trends` pillar archive count grows passively.

**Out:**
- Three CRITIQUE.md rows get marked [x] with this commit:
  - line 95 (single-row table chrome)
  - line 113 (duplicate-link affordance)
  - line 212 (uniform em dash)

**Retro-fit:** zero. No sibling phase needs an edit; the
schema additive is backwards-compatible (`.optional()`).

## Decisions made upfront — DO NOT ASK

- **`note` is `.nullable().optional()`, not required.** Rationale:
  legacy rows pre-phase-19 (none ship after this commit, but
  hypothetical migrations or fixtures) stay valid; explicit
  `null` carries the "no take" intent without a magic empty
  string.
- **`note` length range: 20–280 chars.** Mirrors the
  `description` floor on group-buys (≥20) and the
  one-sentence-tweet ceiling. Above 280 the column starts to
  fight the page; below 20 it's not editorial.
- **Backfill target: ≥3 per category.** Five categories × 3 =
  15 minimum. Cap at ~20 — beyond that the table-of-tables
  shape strains. Scout aims for the upper end of 15–20.
- **Spark length stays at exactly 8.** Schema permits 2–16; the
  shipped data stays consistent at 8 to keep the sparkline
  visual rhythm uniform across rows.
- **`note` rendering: when both `articleSlug` and `note` are
  set, the `note` text is the linked content** (replaces the
  article title in the column and mobile sub-link). The row's
  primary name link still points at the same article — the
  editor's note column adds a *second reason to click* with
  *different copy*, which is exactly what the duplicate-link
  finding asks for.
- **Existing rows are rewritten in-place, not appended.** The
  five existing rows stay at their current `score` /
  `direction` / `spark` / `articleSlug` values — only `note`
  is added. This keeps regression risk minimal: the
  TrackerRow tests and the e2e "row names link to their deep
  dive" test continue to assert the existing slugs.
- **`updatedAt` bumps to 2026-05-10** (today) when the snapshot
  is rewritten. `publishedAt` stays at 2026-05-08 — phase 19
  is an editorial *amendment*, not a republish.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `TrendRowSchema` | new test in `packages/data/src/__tests__/schemas/trend.test.ts`: `note` accepts string ≥20 ≤280; rejects 19; rejects 281; accepts null; accepts undefined | n/a |
| `data/trends/2026-W19.json` | `data:validate` (Zod parse against the new schema) | n/a |
| `<TrackerRow>` | new test: when `articleSlug` set + `note` set, the editor's-note column Link's text is the `note` (not article title) | n/a |
| `<TrackerRow>` | new test: when `articleSlug` null + `note` set, the desktop column renders `note` as plain text (no em dash, no link) | n/a |
| `/trends/tracker` | n/a | new e2e in `apps/e2e/tests/trends.spec.ts`: `screen.getAllByTestId('tracker-row')` count ≥3 per category section. Existing tests keep passing (row-name links, lede contract) |
| Page-reads fixture | n/a | bump `min-link-count` for `[data-testid="tracker-row"]` from current floor → 15 in `apps/e2e/src/fixtures/page-reads.ts` `/trends/tracker` entry |

## Hermetic e2e registration

Existing entry at `apps/e2e/src/fixtures/page-reads.ts` `/trends/tracker`. Bump
the row floor from current to **15** (we ship ≥15 rows post-backfill).

## Verify gate

```bash
pnpm verify
```

`pnpm --filter @thock/data validate` must green-light the
expanded snapshot. Build + e2e exercise the scaled-up tracker.

## Commit body template

```
data: trends backfill + `note` schema additive — phase 19

- Adds `note: z.string().min(20).max(280).nullable().optional()` to
  TrendRowSchema (additive, backwards-compatible).
- Backfills data/trends/2026-W19.json from 5 rows -> N rows
  (>=3 per category) sourced via the scout sub-agent. Every row
  now carries a `note` field with the editor's one-sentence take.
- Render branch in TrackerRow: when `note` is set, the
  editor's-note column renders the note (linked when an article
  resolves, plain text when not). Replaces the duplicate-of-
  article-title affordance and the bare em-dash cell.
- Three CRITIQUE.md rows drained:
  * pass-3 MED single-row table chrome
  * pass-3 LOW duplicate-link affordance
  * pass-2 LOW uniform em dash
- /trends/tracker e2e bumped: page-reads.ts min-row floor 1->15;
  new spec assertion >=3 rows per category.

Decisions locked in the brief:
- `note` 20-280 chars
- existing 5 rows rewritten in-place (only `note` added)
- spark length stays at 8
- when both articleSlug and note are set, the column Link's
  text is the note (not article title) -> kills duplicate-link
```

## DoD

Flip Phase 19's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Mark the three CRITIQUE rows [x] with the
addressing commit. Commit and push. Confirm green deploy.

## Follow-ups (out of scope)

- Phase 20 (switches / keycap-sets / boards backfill) ships
  next.
- New article opportunities surfaced by the backfill (e.g. a
  switch row with strong upward movement that lacks coverage)
  feed `/iterate`'s content-gaps audit.
- A second snapshot file (`2026-W20.json`) is *not* in scope;
  this phase amends the current week's data.
- Updating the tracker's "Methodology" callout (if one exists)
  to reflect the `note` field is *not* in scope; the lede
  copy already says "weighted weekly score across community
  chatter, retail availability, and editorial mentions" —
  `note` fits under "editorial mentions" without a copy edit.
