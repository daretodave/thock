/**
 * Per-URL-pattern assertions enforced by the smoke walker on top of
 * the universal "200 + no console errors + no horizontal scroll"
 * contract. Each later page-family phase (5-13) appends or upgrades
 * its entry here as the family ships.
 */
export type PageAssertion =
  | { kind: 'h1-present' }
  | { kind: 'h1-matches'; pattern: RegExp }
  | { kind: 'has-canonical-link' }
  | { kind: 'has-jsonld' }
  | { kind: 'main-count-one' }
  | { kind: 'min-link-count'; selector: string; min: number }
  | { kind: 'response-content-type'; matcher: RegExp }
  | { kind: 'body-contains'; needle: string }

export type PageRead = {
  pattern: string
  /** True when the URL serves HTML; false for /robots.txt, /feed.xml etc. */
  isHtml: boolean
  assertions: PageAssertion[]
}

const html = (assertions: PageAssertion[]): Pick<PageRead, 'isHtml' | 'assertions'> => ({
  isHtml: true,
  assertions: [
    { kind: 'h1-present' },
    { kind: 'has-canonical-link' },
    { kind: 'has-jsonld' },
    // Phase 22 — every HTML route owns its own <main> landmark.
    // Layout no longer wraps {children} in <main>; each
    // page/loading/not-found/error must emit exactly one.
    { kind: 'main-count-one' },
    ...assertions,
  ],
})

export const pageReads: Record<string, PageRead> = {
  '/': {
    pattern: '/',
    ...html([
      // Phase 6: hero pick is the only h1 in the page; we no longer
      // brand-anchor the heading text since the hero swaps with the
      // newest published article. Trending tiles + at least one
      // latest-by-pillar card + at least one group-buy row carry the
      // composition coverage.
      { kind: 'min-link-count', selector: '[data-testid="hero-card"]', min: 1 },
      { kind: 'min-link-count', selector: '[data-testid="trending-tile"]', min: 1 },
      { kind: 'min-link-count', selector: '[data-testid="latest-by-pillar-card"]', min: 1 },
      { kind: 'min-link-count', selector: '[data-testid="group-buy-row"]', min: 1 },
    ]),
  },
  '/news': {
    pattern: '/news',
    ...html([
      { kind: 'h1-matches', pattern: /news/i },
      // Phase 7: pillar landing always renders at least one card,
      // either the hero pick or an archive row from the seed dataset.
      {
        kind: 'min-link-count',
        selector:
          '[data-testid="hero-card"], [data-testid="article-card-row"]',
        min: 1,
      },
    ]),
  },
  '/trends': {
    pattern: '/trends',
    ...html([
      { kind: 'h1-matches', pattern: /trends/i },
      {
        kind: 'min-link-count',
        selector:
          '[data-testid="hero-card"], [data-testid="article-card-row"]',
        min: 1,
      },
      { kind: 'min-link-count', selector: '[data-testid="pillar-hero-tracker"]', min: 1 },
    ]),
  },
  '/trends/tracker': {
    pattern: '/trends/tracker',
    ...html([
      { kind: 'h1-matches', pattern: /rising/i },
      {
        kind: 'min-link-count',
        selector: '[data-testid="tracker-row"]',
        min: 15,
      },
    ]),
  },
  '/trends/tracker/[week]': {
    pattern: '/trends/tracker/[week]',
    ...html([
      // Phase 27: archive week page carries the same H1 as the
      // latest view; week number block visible; at least one row.
      { kind: 'h1-matches', pattern: /rising/i },
    ]),
  },
  '/ideas': {
    pattern: '/ideas',
    ...html([
      { kind: 'h1-matches', pattern: /ideas/i },
      {
        kind: 'min-link-count',
        selector:
          '[data-testid="hero-card"], [data-testid="article-card-row"]',
        min: 1,
      },
    ]),
  },
  '/deep-dives': {
    pattern: '/deep-dives',
    ...html([
      { kind: 'h1-matches', pattern: /deep dives/i },
      {
        kind: 'min-link-count',
        selector:
          '[data-testid="hero-card"], [data-testid="article-card-row"]',
        min: 1,
      },
    ]),
  },
  '/guides': {
    pattern: '/guides',
    ...html([
      { kind: 'h1-matches', pattern: /guides/i },
      {
        kind: 'min-link-count',
        selector: '[data-testid="article-card-row"]',
        min: 1,
      },
    ]),
  },
  '/group-buys': {
    pattern: '/group-buys',
    ...html([
      { kind: 'h1-matches', pattern: /group buys/i },
      {
        kind: 'min-link-count',
        selector: '[data-testid="group-buy-row"]',
        min: 4,
      },
    ]),
  },
  '/group-buys/past': {
    pattern: '/group-buys/past',
    ...html([
      { kind: 'h1-matches', pattern: /past group buys/i },
      {
        kind: 'min-link-count',
        selector: '[data-testid="group-buy-row"]',
        min: 1,
      },
    ]),
  },
  '/about': {
    pattern: '/about',
    ...html([{ kind: 'h1-matches', pattern: /who we are/i }]),
  },
  '/newsletter': {
    pattern: '/newsletter',
    ...html([{ kind: 'h1-matches', pattern: /newsletter/i }]),
  },
  '/search': {
    pattern: '/search',
    ...html([
      { kind: 'h1-matches', pattern: /search/i },
      {
        kind: 'min-link-count',
        selector: 'input[type="search"]',
        min: 1,
      },
    ]),
  },
  '/sources': {
    pattern: '/sources',
    ...html([{ kind: 'h1-matches', pattern: /where we got the facts/i }]),
  },
  '/tags': {
    pattern: '/tags',
    ...html([
      // Phase 28: tags index groups all tags by category; H1 is "All tags".
      { kind: 'h1-matches', pattern: /all tags/i },
      { kind: 'min-link-count', selector: 'a[data-testid="tag-chip"]', min: 5 },
    ]),
  },
  '/article/[slug]': {
    pattern: '/article/[slug]',
    ...html([
      // The hero, byline, body, and tag rail are the canonical-template
      // assertions every article inherits as of phase 5.
      { kind: 'min-link-count', selector: '[data-testid="article-hero"]', min: 1 },
      { kind: 'min-link-count', selector: '[data-testid="article-byline"]', min: 1 },
      { kind: 'min-link-count', selector: '[data-testid="article-body"]', min: 1 },
      { kind: 'min-link-count', selector: '[data-testid="tag-chip"]', min: 1 },
    ]),
  },
  '/tag/[slug]': {
    pattern: '/tag/[slug]',
    // Some tag slugs in the seed have zero articles; the smoke
    // walker hits all of them, so we don't require an article-card
    // here. Phase 12's tag.spec.ts covers the populated case.
    ...html([{ kind: 'h1-matches', pattern: /^#/ }]),
  },
  '/part/[kind]': {
    pattern: '/part/[kind]',
    ...html([
      // Phase 21: kind-index pages carry their per-kind heading and
      // at least one part row.
      { kind: 'h1-matches', pattern: /(switches|keycap sets|boards)/i },
      {
        kind: 'min-link-count',
        selector: '[data-testid="part-index-card"]',
        min: 1,
      },
    ]),
  },
  '/part/[kind]/[slug]': {
    pattern: '/part/[kind]/[slug]',
    ...html([
      // Phase 21: detail page carries the part name as h1, plus the
      // spec list and either an article rail or the empty state.
      { kind: 'h1-present' },
    ]),
  },
  '/sitemap.xml': {
    pattern: '/sitemap.xml',
    isHtml: false,
    assertions: [{ kind: 'response-content-type', matcher: /xml/ }],
  },
  '/robots.txt': {
    pattern: '/robots.txt',
    isHtml: false,
    assertions: [
      { kind: 'response-content-type', matcher: /text\/plain/ },
      { kind: 'body-contains', needle: 'Sitemap:' },
    ],
  },
  '/feed.xml': {
    pattern: '/feed.xml',
    isHtml: false,
    assertions: [
      { kind: 'response-content-type', matcher: /application\/rss\+xml/ },
      { kind: 'body-contains', needle: '<rss version="2.0">' },
    ],
  },
  '/feed/[pillar].xml': {
    pattern: '/feed/[pillar].xml',
    isHtml: false,
    assertions: [
      { kind: 'response-content-type', matcher: /application\/rss\+xml/ },
      { kind: 'body-contains', needle: '<rss version="2.0">' },
    ],
  },
}
