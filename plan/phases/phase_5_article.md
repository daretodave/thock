# Phase 5 — Article page (canonical template)

> Agent-facing brief. Concise, opinionated, decisive. Ship without
> asking; document any judgment calls in the commit body. **This
> phase establishes the canonical structure every later page family
> mirrors. The `apps/web/src/app/article/`,
> `apps/web/src/components/article/`, `apps/web/src/lib/article/`
> triple is the literal template.**

## Routes (locked in `plan/bearings.md`)

- `/article/[slug]` — the entity hub for one editorial article

There are no article sub-pages. Articles are leaf entities; pillar
landings (phases 7–11) and tag pages (phase 12) handle aggregation.

## Content / data reads

| Helper | Lookup | Use |
|---|---|---|
| `getArticleBySlug(slug)` from `@thock/content` | `apps/web/src/content/articles/<slug>.mdx` + frontmatter parse | hero data, body MDX, page identity |
| `getRelatedArticles(article, n=4)` from `@thock/content` | other articles sharing pillar or ≥2 tags, weighted by tag overlap, sorted by recency | related-articles rail |
| `getAllTags()` from `@thock/content` | `tags.json` | resolve `<TagChip>` display names + categories |
| `getReferencedParts(article)` from `@thock/content` | parts in frontmatter `mentionedParts`; resolves each via `@thock/data` (`getSwitchBySlug`, `getKeycapSetBySlug`, `getBoardBySlug`) | "Mentioned in this article" rail |

If `getArticleBySlug` returns null, the route calls `notFound()` so
Next.js renders `not-found.tsx`.

## Components (in `apps/web/src/components/article/`, plus existing primitives)

- `<ArticleHero>` — eyebrow (pillar name as link to pillar) • H1 in
  serif • lede paragraph • byline + read-time • hero image
  (full-bleed on desktop, contained on mobile).
- `<ArticleBody>` — wraps MDX render with custom-component map.
- `<ArticleTagRail>` — `<TagChip>` for each tag, category-tinted.
- `<MentionedPartsRail>` — list of `<PartReference>` cards.
- `<RelatedArticlesRail>` — 4 `<ArticleCard variant="row">` items.
- `<ArticleByline>` — author + publish date + read time.

MDX components (registered in `@thock/content/mdx`):

- `<PullQuote>` — block quote, large serif. Inline.
- `<Callout type="note|warn|info">` — bordered block. Inline.
- `<Caption>` — small italicized line under an image. Inline.
- `<PartReference id="...">` — resolves a part by id from
  `frontmatter.mentionedParts`; renders as inline link with hover
  tooltip. Inline.
- `<Mono>` — monospace span; used liberally for switch names,
  firmware refs, SKUs.
- `<Source href="...">` — citation; collected into `/sources` index
  in phase 16.
- `<KeyboardImage src="..." alt="..." caption="..." />` — optimized
  image block.

## Cross-links

**In** (already shipped — verify still wired):
- The phase 3 home-page article list already renders cards linking
  to `/article/[slug]` ✓ — verify the variant cascade still works
  after this phase's CSS lands.

**Out** (this phase ships these):
- Eyebrow → `/news` / `/trends` / etc. (pillar landings exist as
  stubs from phase 4).
- Every `<TagChip>` → `/tag/[slug]` (tag pages don't exist yet
  until phase 12; chips render as `<a>` and route through
  `not-found.tsx` until then).
- Related articles → `/article/[slug]`.
- Inline `<PartReference>` vendor link → external (`rel="sponsored
  noopener"`).
- Inline `<Source>` citation → its `href` (external or `/sources`
  once phase 16 ships).

## SEO

`apps/web/src/lib/article/seo.ts`:

- `generateMetadata({ params })` — title from frontmatter `title`,
  description from `lede`, canonical via
  `canonicalUrl('/article/' + slug)` (from `@thock/seo`), OG image
  via `opengraph-image.tsx` route handler colocated with
  `[slug]/page.tsx`.
- `buildJsonLd(article)` from `@thock/seo` — type `Article`:
  - `headline` = title
  - `description` = lede
  - `image` = heroImage
  - `datePublished` = publishedAt
  - `dateModified` = updatedAt ?? publishedAt
  - `author` = `{ '@type': 'Person', name: author }`
  - `publisher` = siteConfig publisher block
  - `mainEntityOfPage` = canonical URL
  - Plus `BreadcrumbList`: Home → <Pillar> → article title.

## Hero composition (`apps/web/src/components/article/ArticleHero.tsx`)

```tsx
<header className="editorial-hero">
  <Container>
    <div className="eyebrow">
      <Link href={pillarHref}>{pillarName}</Link>
    </div>
    <h1 className="font-serif">{title}</h1>
    <p className="lede">{lede}</p>
    <ArticleByline author={author} date={publishedAt} readTime={readTime} />
  </Container>
  {heroImage && <HeroImage src={heroImage} alt={heroImageAlt} />}
</header>
```

`.editorial-hero` lives in `apps/web/src/styles/components.css` —
generous vertical padding, max-width content column, full-bleed
image below.

## Body composition (`apps/web/src/components/article/ArticleBody.tsx`)

```tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@thock/content/mdx'

<MDXRemote source={article.body} components={mdxComponents} />
```

`mdxComponents` registry includes custom atoms + overrides for
default tags (`a` → `<Link>`, `code` → `<Mono>`, `img` →
`<Image>`).

## Empty / loading / error states

- **Article not found** — `notFound()` triggers `not-found.tsx`
  with copy: `"That article doesn't exist (yet)."` + a search
  affordance (or pillar links until phase 14 ships).
- **No related articles** (rare — only for the very first article)
  — the rail hides instead of showing an empty state.
- **No mentioned parts** — the rail hides.
- **No tags** — the chip row hides.
- **Loading** — skeleton hero + skeleton body lines via
  `loading.tsx`.
- **MDX error** — caught by error boundary in `error.tsx`; renders
  red-tinted mono text with the article slug + a link to home.

## Decisions made upfront — DO NOT ASK

- **Hero image scaling:** full-bleed on desktop (≥1024px), contained
  with rounded corners on mobile. No parallax. `next/image` blur
  placeholder.
- **Read time:** computed at build time from word count at 200 wpm,
  rounded up. `< 1 min` clamps to `"1 min read"`.
- **Author:** single string (no author taxonomy yet). Resolves to
  plain text byline.
- **Publish date format:** `"May 8, 2026"` — `Intl.DateTimeFormat
  ('en-US', { dateStyle: 'long' })`.
- **Tag chip category tints:** read from `tags.json`; one of
  `switch` / `layout` / `material` / `brand` / `profile` / `misc`.
  Default `misc` if the frontmatter tag isn't in the taxonomy.
  Console-warn at build time but ship.
- **Related articles algorithm:** score each candidate by
  `(samePillar ? 2 : 0) + tagOverlapCount`. Sort desc, take top 4.
  Tie-break by `publishedAt` desc.
- **`<PartReference>`:** if the part isn't in
  `frontmatter.mentionedParts`, render the children as plain text
  with a console warning. Don't break the page.
- **`<Source>`:** in phase 5, just renders the href. Phase 16
  collects them site-wide for `/sources`.
- **Mobile reflow:** hero image becomes contained (not full-bleed),
  byline drops to a stacked column, body type drops one step.
  Tailwind responsive utilities — no new media queries.
- **Print styles:** out of scope.
- **Comments:** out of scope (forever, per spec).

## Mobile reflow

- `<ArticleHero>`: H1 sizes down via `text-4xl md:text-6xl`.
- `<HeroImage>`: full-bleed on `lg:`, contained below.
- `<ArticleByline>`: row on `md:`, stacked column below.
- `<RelatedArticlesRail>`: grid 4-up on `lg:`, 2-up on `md:`,
  stacked below.
- `<MentionedPartsRail>`: horizontal scroll on mobile (no overflow
  on the page itself).

## Pages × tests matrix

| Page | Unit tests | E2E |
|---|---|---|
| `/article/[slug]` (existing seed slug) | renders H1, lede, body, tag rail, related rail | renders H1 + canonical + ≥1 tag chip + ≥1 related card + footer |
| `/article/[slug]` (404 path) | n/a | 404 page renders correctly |
| `<ArticleHero>` | renders all hero fields, falls back when fields missing | n/a |
| `<ArticleBody>` | renders MDX with custom components mapped | n/a |
| `<RelatedArticlesRail>` | hides when N=0, renders top-4 when N≥1 | n/a |
| MDX components | each renders without crashing | n/a |
| Mobile spec | n/a | hero stacks at 375px, no horizontal overflow, body type readable |

## Hermetic e2e registration (every page family does this)

Phase 4 shipped the harness. Phase 5 (and every later page family)
appends its entry to `apps/e2e/src/fixtures/page-reads.ts`:

```ts
// apps/e2e/src/fixtures/page-reads.ts
export const pageReads: PageReads = {
  '/article/[slug]': {
    sample: '/article/<a-real-seed-slug>',
    assertions: [
      'renders H1 from frontmatter.title',
      'renders canonical link tag matching the URL',
      'renders ≥1 <TagChip>',
      'renders ≥1 related-article card OR no rail (graceful)',
      'renders global footer',
      'no console errors',
      '375px viewport: scrollWidth - innerWidth ≤ 1',
    ],
  },
  // … other families append here as they ship
}
```

The `canonical-urls.ts` fixture from phase 4 already derives every
real article URL from `@thock/content` — no manual updates needed.
The smoke walker hits every URL; the per-page-pattern assertions in
`page-reads.ts` provide the depth checks. Phase 5 also ships
`apps/e2e/tests/article.spec.ts` for any article-specific
interactivity (currently none — the smoke walker covers the static
contract).

## Verify gate

```bash
pnpm verify
```

(typecheck + unit + data:validate + build + e2e). All must pass
before commit.

## Commit body template

```
feat: article page family — phase 5

- /article/[slug] renders hero, MDX body, tag rail, mentioned-parts
  rail, related-articles rail.
- Reads from @thock/content (article + related + tags) and
  @thock/data (referenced parts).
- @thock/seo buildMetadata + JSON-LD Article + BreadcrumbList.
- Per-route OG image via opengraph-image.tsx.
- Canonical sibling for every later page family — phases 6–13
  mirror this triple (apps/web/src/app/<family>/,
  apps/web/src/components/<family>/, apps/web/src/lib/<family>/).

Decisions:
- <design call 1>
- <design call 2>
```

## DoD

Flip Phase 5's `[ ]` → `[x]` in
`plan/steps/01_build_plan.md`, append commit hash, add to phase
log. Commit and push.

## Follow-ups (out of scope this phase)

- Author taxonomy / author pages.
- Per-article OG image art beyond the route-handler default
  (phase 16 finalizes templates).
- Comment / reaction layer (out of roadmap).
- "Save for later" affordance (out of roadmap until v2).
- `<Source>` aggregation into `/sources` (phase 16).
- "Did you mean?" search-fallback on 404 (phase 16, depends on
  phase 14).
