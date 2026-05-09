# Phase 13 — Group Buys (`/group-buys` + home widget retrofit)

> Agent-facing brief. Concise, opinionated, decisive. Replaces
> the phase 4 stub at `/group-buys` with the canonical index,
> grouped into **Live now** + **Announced** + **Closed/shipped**
> sections with countdown chrome on the live rows. The home
> widget already reads from the same loader; this phase is a
> verify-only retrofit there.

## Routes (locked in `plan/bearings.md`)

- `/group-buys` — replace the phase 4 stub with the canonical
  index.

## Sections (top → bottom)

1. **Page header** — eyebrow `curated`, italic display H1
   `Group buys`, lede paragraph (locked from the existing stub),
   single-line meta (`{N} active · {M} announced · {K} ended`).
2. **Live now** — `status === 'live'` + `endDate >= today`.
   Sorted by `endDate` asc; ties by `name` asc. Rendered as a
   stack of `<GroupBuyRow variant="live">` cards: image (or
   vendor placeholder), name + vendor, dates, region badge,
   countdown ("X days left"), CTA link with
   `rel="sponsored noopener"`.
3. **Announced** — `status === 'announced'` (regardless of
   `endDate`). Sorted by `startDate` asc; ties by `name` asc.
   Rendered as `<GroupBuyRow variant="announced">` (countdown
   replaced by "Opens in X days" or absolute start date).
4. **Recently ended** — `status === 'closed' || status ===
   'shipped'`, OR live with `endDate < today`. Sorted by
   `endDate` desc (newest-closed first). Cap 6. Rendered as
   `<GroupBuyRow variant="ended">` (muted, no CTA, status pill).

Empty pillar with zero rows across all three: pillar header +
single empty panel ("No active group buys right now. Check back
weekly.").

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getAllGroupBuys()` | manifest | full list |
| `getActiveGroupBuys(now)` | manifest | already-filtered convenience |
| `getAllVendors()` | manifest | vendor name + URL lookup |

The page partitions `getAllGroupBuys()` itself rather than
calling `getActiveGroupBuys()` so it can also surface
announced + ended sections in one read. `now` is bound at module
load (`new Date()`); all filtering / sorting is deterministic
once `now` is fixed.

## Components

### Reused (already shipped)

- `<HomeSectionHeading>` (phase 6) — for section dividers.
- `<GroupBuyCountdownRow>` lives in
  `apps/web/src/components/home/`. The home widget uses it.
  Phase 13 introduces a richer `<GroupBuyRow>` for the index;
  the home widget keeps its existing compact countdown row
  (different density target).

### New

- `<GroupBuyRow>` in
  `apps/web/src/components/group-buys/GroupBuyRow.tsx`.
  Variants `live` / `announced` / `ended`. Image (or vendor
  placeholder square), name + vendor, dates, region badge, CTA
  with `rel="sponsored noopener"`. Tested.
- Page-local `partitionGroupBuys` helper in
  `apps/web/src/app/group-buys/helpers.ts` — pure
  partition-and-sort that returns
  `{ live, announced, ended }`. Pure, unit-tested. (Mirrors
  ideas/deep-dives/guides helper-extraction pattern.)

## Cross-links

**In:**
- Home page right-rail group-buys widget (phase 6) already links
  to `/group-buys`. **Verify the data path is identical** — the
  widget calls `getActiveGroupBuys()` and the index calls
  `getAllGroupBuys()` then partitions. They must agree on what
  "active" means; if they diverge, the widget rewrite is
  in-scope.

**Out:**
- Each row's CTA: external `url` with `rel="sponsored noopener"`
  and `target="_blank"`.
- Section labels link nowhere (they're dividers).

**Retro-fit:** verify-only on the home widget. No code change
expected unless the divergence check above flags one.

## SEO

- `generateMetadata` — title `Group buys`, description = lede,
  canonical `/group-buys`.
- JSON-LD: `CollectionPage` + `BreadcrumbList` + `ItemList` of
  the **live + announced** group buys (not ended ones — they're
  archive padding, not the offering). Each ItemList entry has
  `name` + `url` (the external vendor URL, since group buys
  don't have an on-site detail page).

## Empty / loading / error states

- **No group buys at all** — pillar header + one-paragraph
  empty panel.
- **Loading** — colocated `loading.tsx`, header + 3 row
  skeletons.
- **Error** — colocated `error.tsx` 'use client' identical in
  shape to phase 9–12.

## Decisions made upfront — DO NOT ASK

- **Lede copy (locked):** "Active group buys for boards, keycap
  sets, and switches. Time-aware, region-aware, vendor-linked."
  Same as the phase 4 stub.
- **External link policy:** every CTA gets
  `rel="sponsored noopener" target="_blank"`. The `sponsored`
  signal is honest — vendors haven't paid for placement, but the
  links *are* commercial; using `sponsored` keeps SEO neutral
  and signals the external nature.
- **Region badges:** show the region as a small mono pill
  (`GLOBAL`, `US`, `EU`, etc.). No flag emoji — keeps the page
  text-only consistent with the rest of the site.
- **Countdown granularity:** integer days. No hours/minutes.
  Group buys close at 23:59 vendor-local but the index doesn't
  track timezones, so "1 day left" is honest within ±1.
- **Closed/shipped cap:** 6. Beyond that, drop silently;
  pagination is phase 16+ if it ever matters.
- **No filtering UI.** No region filter, no product-kind filter,
  no status toggle. The page is small enough that scanning is
  fine. Filters land if/when seed grows past ~30 active rows.

## Mobile reflow

Inherits the article-card row's existing mobile collapse: image
+ text stack vertically below `sm`. Region badge wraps inline.
Countdown row still fits because the text is short.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/group-buys` | n/a | renders /group buys/i H1, ≥1 group-buy-row, JSON-LD ItemList present, CTA `rel` contains "sponsored" |
| `partitionGroupBuys` | partitions by status + endDate; sorts each section per spec; caps ended at 6; handles empty input | n/a |
| `<GroupBuyRow>` | renders name + vendor + region; CTA carries rel="sponsored noopener" target="_blank"; live variant shows countdown; ended variant has no CTA | n/a |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/group-buys`:

```ts
'/group-buys': {
  pattern: '/group-buys',
  ...html([
    { kind: 'h1-matches', pattern: /group buys/i },
    {
      kind: 'min-link-count',
      selector: '[data-testid="group-buy-row"]',
      min: 1,
    },
  ]),
},
```

Add `apps/e2e/tests/group-buys.spec.ts` covering H1, the row
list, the rel="sponsored" attribute, and JSON-LD shape.

## Verify gate

```bash
pnpm verify
```

## Commit body template

```
feat: group-buys index — phase 13

- /group-buys replaces the phase 4 stub with the canonical
  index — Live now + Announced + Recently ended sections,
  sorted per the spec.
- New <GroupBuyRow> component with live/announced/ended
  variants. Page-local helper partitionGroupBuys handles the
  state machine.
- CollectionPage + BreadcrumbList + ItemList JSON-LD; canonical
  /group-buys. CTAs rel="sponsored noopener" target="_blank".
- Home widget retrofit verified — same loader, same active
  semantics.

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 13's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Commit and push.

## Follow-ups

- Region/product-kind filter UI (phase 16+ if seed grows).
- Per-group-buy detail page (post-MVP — currently CTAs go
  off-site; an on-site article covers the editorial case).
- Sponsored-link disclosure copy (post-MVP; not commercial yet).
- Vendor logo affordance (when we have logos).
