# Phase 44 — Switch comparison `/compare/switch`

> **Score:** 6.5 · pass-124 candidate · spec §13 Phase 3

## Outcome

A side-by-side spec-comparison page for any two switches in the catalog,
accessible at `/compare/switch?a=<slug>&b=<slug>`. Spec rows that differ
between the two switches are visually highlighted, so a reader comparing
e.g. Gateron Oil King vs Cherry MX Silent Black can immediately see where
they diverge without hunting through two separate `/part/switch/[slug]` pages.

## Why

The catalog now has 17 switches across linear, tactile, clicky, silent, and
hall-effect categories. The `/quiz/switch` recommender answers "which switch
should I get?"; the compare page answers "how do these two switches differ?"
— a natural follow-on in the discovery triangle. Spec §13 Phase 3 names this
surface explicitly.

## Scope (precise)

### Route

`apps/web/src/app/compare/switch/page.tsx`

Server component. Reads `searchParams: Promise<{ a?: string; b?: string }>`.

- **No params / one param** → renders selector UI + empty state copy.
- **Both params valid** → renders selector (pre-seeded) + `SwitchCompareTable`.
- **Invalid slug in param** → silently falls back to no-table state (treat
  bad slug the same as missing param — no hard 404, selector still usable).

`generateMetadata` is dynamic: if both slugs resolve, title is
`"<A> vs <B> — thock"`; otherwise `"Compare switches — thock"`.

JSON-LD graph:
- `BreadcrumbList`: Home → Parts → Switches → Compare
- `ItemList` (only when both switches resolved): two `ListItem` entries
  linking to each `/part/switch/[slug]` canonical.

Sitemap entry: `/compare/switch` at priority 0.6.

### Components

`apps/web/src/components/compare/`

**`SwitchCompareSelector.tsx`** (`'use client'`)
- Two `<select>` dropdowns pre-seeded from props (`initialA`, `initialB`).
- "Compare" button → `router.push('/compare/switch?a=<a>&b=<b>')`.
- Button disabled when either slot is empty OR `a === b`.
- `data-testid`: `compare-selector`, `compare-select-a`, `compare-select-b`,
  `compare-button`.

**`SwitchCompareTable.tsx`** (shared, no state)
- Takes `switchA: Switch`, `switchB: Switch`.
- Header row: each switch name is a `<Link>` to `/part/switch/[slug]`
  (`data-testid="compare-switch-a-link"` / `"compare-switch-b-link"`).
- Spec rows (reuse `PartSpec` row logic): type, top/bottom housing, stem,
  spring (actuation + bottom-out), travel mm, factory lubed, status, released.
- Rows where `valueA !== valueB` get `data-differs="true"` — use a slightly
  elevated text color (`text-text` vs `text-text-2`) to signal the difference.
- `data-testid`: `compare-table`, `compare-spec-row` (one per field).

### Cross-link retrofit

`apps/web/src/app/part/[kind]/[slug]/page.tsx`
- Add a "Compare this switch →" link (`href="/compare/switch?a=<slug>"`)
  rendered only when `part.kind === 'switch'`.
- `data-testid="part-compare-link"`.
- Place below `PartSpec` / `PartBody`, above the back-link.

### Fixtures + E2E

`apps/e2e/src/fixtures/canonical-urls.ts`
- Add `{ path: '/compare/switch', pattern: '/compare/switch', kind: 'html' }`.

`apps/e2e/src/fixtures/page-reads.ts`
- Add `/compare/switch` entry: h1-present (default), h1-matches `/compare/i`.

`apps/e2e/tests/compare.spec.ts`
1. Base route `/compare/switch` → H1 "Compare switches", selector visible.
2. Compare two valid switches via URL params → table visible, both switch
   name links present, at least one `data-differs="true"` row exists.
3. Compare the same switch to itself → table is NOT rendered (handled by
   selector validation; the URL itself is valid but `showTable` stays true
   since both slugs resolve — actually same slug resolves to same record so
   we should show the table but all rows have `data-differs="false"`). Wait,
   actually: same slug is legal, but the button is disabled when `a === b`
   so users can't get there via the selector. We don't need a test for this
   edge case since it doesn't affect the comparison semantics.
4. Part detail page for a switch shows "Compare →" link.
5. JSON-LD: ItemList present when two valid switches are in params.

`apps/e2e/tests/mobile/compare.mobile.spec.ts`
- 375px: no horizontal scroll + H1 within viewport.

### Unit tests

`apps/web/src/components/compare/__tests__/SwitchCompareTable.test.tsx`
- Renders both switch names with correct links.
- Row count equals spec fields count.
- Row with same value in both → `data-differs="false"`.
- Row with different values → `data-differs="true"`.

`apps/web/src/components/compare/__tests__/SwitchCompareSelector.test.tsx`
- Renders two selects + button.
- Button disabled when both values are empty.
- Button disabled when `a === b`.
- Button enabled when `a !== b` and both non-empty.

## Decisions (pre-made)

- **No hard 404 for invalid slug in query param** — the compare page is a
  tool, not an entity page; quietly falling back to the selector state is
  better UX than a 404 for a mistyped slug.
- **Compare affordance on detail page is slug-only** (`?a=<slug>`) — the
  user picks the second switch on the compare page itself. Pre-filling both
  would require knowing which "other" switch the reader wants to compare.
- **Diff highlight is text-color only** (text-text vs text-text-2) — no
  background color, no icon; restraint is the thock visual language.
- **No loading.tsx** — the page is static (no dynamic data fetching beyond
  manifest read); the Suspense boundary on RSC shell is sufficient.

## Not in scope

- Comparison of keycap-sets or boards (future phase if needed).
- "Save comparison" / shareable link via slug-pair canonical URL (the
  query-param URL IS the shareable link).
- Comparison of more than two switches (two-slot only for now).
