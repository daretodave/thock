# Phase 9 — Ideas & Builds pillar (`/ideas`)

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body.
>
> Phase 9 mirrors phase 7 News and phase 8 Trends: canonical
> pillar-landing shape. The only ideas-specific addition is the
> "build of the week" featured slot above the lead.

## Routes (locked in `plan/bearings.md`)

- `/ideas` — replace the phase 4 stub with the canonical pillar
  landing.

No sub-routes. The reader-build submission flow is out of scope
forever per the critique-loop discussion (form submissions need
backend infra not in roadmap).

## Sections (top → bottom)

1. **Pillar header** (`<PillarHero>`) — eyebrow `PILLAR · 03 of 05`,
   italic display H1 `Ideas`, lede paragraph (locked), single
   right-rail RSS pill.
2. **Build of the week** (only when present) — top article
   currently tagged `build-of-the-week`, sorted by `publishedAt`
   desc. Rendered as `<ArticleCard variant="hero">` with a small
   eyebrow override `BUILD OF THE WEEK · WEEK NN`.
3. **Lead article** — newest article in `pillar = "ideas"`
   excluding the build-of-the-week pick (if any). Rendered as
   `<ArticleCard variant="hero">`. Hidden if the only article is
   already the build-of-the-week pick.
4. **Archive list** — every other ideas article in
   publishedAt-desc order, rendered as `<ArticleCard variant="row">`
   via `<PillarArchiveList>`. Cap 25.

The design's three-up "reader builds" grid is **deferred** — no
real reader-builds data source exists yet. When user submissions
land (post-roadmap), phase 16 polish or a follow-up phase swaps
in the grid.

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getArticlesByPillar('ideas')` | manifest | hero + archive |
| `getArticlesByTag('build-of-the-week')` | manifest | featured slot |
| `getAllTags()` | manifest | tag-name + category for chips |

## Components

### Reused (already shipped)

- `<PillarHero>` (phase 7) — pillar header.
- `<ArticleCard variant="hero">` and `variant="row">` (phase 6).
- `<PillarArchiveList>` (phase 7) — archive list.
- `<HomeSectionHeading>` (phase 6) — section dividers.

### New

None. Phase 9 is pure composition over the phase 7 / 8 primitives.
A small page-local helper in `apps/web/src/app/ideas/page.tsx`
selects the build-of-the-week article (`pickBuildOfTheWeek`); kept
inline since it's a 4-line pure function.

## Cross-links

**In:**
- Article-page eyebrow for `pillar="ideas"` articles already links
  to `/ideas`; verify it now lands on the real H1.

**Out:**
- All cards → `/article/<slug>`.
- RSS pill → `/feed/ideas.xml` (already served).
- Tag chips inside cards → `/tag/<slug>` (stub until phase 12).

**Retro-fit:** none. Header nav already lists Ideas; verify post-
deploy.

## SEO

- `generateMetadata` — title `Ideas`, description = lede,
  canonical `/ideas`.
- JSON-LD: `CollectionPage` + `BreadcrumbList` + `ItemList` of
  ideas articles (≤ 25). Same shape as phases 7 / 8.

## Empty / loading / error states

- **No articles in pillar** — pillar header + one-paragraph
  empty panel: "No ideas pieces yet. The hands-on side warms up
  shortly." with a back-to-`/` link. Production has 1 ideas
  article (`building-mode-sonnet-with-oil-kings`) so this branch
  is defensive.
- **No build-of-the-week** — slot is hidden entirely; the lead
  article moves up.
- **Loading** — skeleton hero + 3 row skeletons; copy-paste from
  phase 7's news/loading.tsx.
- **Error** — 'use client' identical in shape to phase 7's
  news/error.tsx.

## Decisions made upfront — DO NOT ASK

- **Lede copy (locked):** "Builds, mods, and the half-formed
  ideas that turn into hobbies. Hands-on, opinionated, photo-
  rich." Same as the phase 4 stub.
- **Build-of-the-week selection:** articles with the
  `build-of-the-week` tag, sorted by `publishedAt` desc. Top one
  wins. If the same article is also the newest in the pillar
  overall, suppress the lead-article slot to avoid double-
  rendering.
- **Build-of-the-week eyebrow override:** `BUILD OF THE WEEK ·
  WEEK NN` where `NN` is derived from `publishedAt` ISO week.
  Use `formatIsoWeek` inline (small util, no need to extract).
- **Archive sort:** `publishedAt` desc, tie-break by slug asc.
- **Archive cap:** 25 (same as phase 7).
- **No reader-builds grid:** deferred.
- **No "submit a build" CTA:** out of roadmap.

## Mobile reflow

- Inherits phase 7's pillar reflow (hero stacks, RSS pill below
  lede on mobile).
- Build-of-the-week + lead are both `<ArticleCard variant="hero">`
  which already reflows.
- Archive rows inherit `<ArticleCard variant="row">` reflow.

## Pages × tests matrix

| Surface | Unit | E2E |
|---|---|---|
| `/ideas` | n/a | renders H1 matching `/ideas/i`, ≥1 article-card link, RSS pill links to /feed/ideas.xml, ItemList JSON-LD present |
| `pickBuildOfTheWeek` | returns the latest article tagged build-of-the-week or null when none exist | n/a |

## Hermetic e2e registration

Update `apps/e2e/src/fixtures/page-reads.ts` for `/ideas`:

```ts
'/ideas': {
  pattern: '/ideas',
  ...html([
    { kind: 'h1-matches', pattern: /ideas/i },
    {
      kind: 'min-link-count',
      selector: '[data-testid="hero-card"], [data-testid="article-card-row"]',
      min: 1,
    },
  ]),
},
```

Add `apps/e2e/tests/ideas.spec.ts` covering the build-of-the-week
eyebrow when present, RSS pill href, and JSON-LD shape.

## Verify gate

```bash
pnpm verify
```

(typecheck + unit + data:validate + build + e2e). All must pass
before commit.

## Commit body template

```
feat: ideas pillar — phase 9

- /ideas replaces the phase 4 stub with the canonical pillar
  landing — pillar header + optional build-of-the-week slot +
  lead article + archive list.
- Pure composition over the phase 7 / 8 primitives (PillarHero,
  PillarArchiveList, ArticleCard, HomeSectionHeading). No new
  components.
- CollectionPage + BreadcrumbList + ItemList JSON-LD; canonical
  /ideas. RSS pill links to /feed/ideas.xml.

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 9's `[ ]` → `[x]` in `plan/steps/01_build_plan.md`,
append commit hash. Commit and push.

## Follow-ups (out of scope)

- Reader-builds 3-up grid (needs user-submission infra).
- "Submit a build" CTA (out of roadmap).
- Per-pillar OG image art (phase 16).
- "Build of the week" curation flag separate from the tag (post-
  MVP — for now the tag is the curation surface).
