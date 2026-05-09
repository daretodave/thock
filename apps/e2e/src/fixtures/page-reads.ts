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
    ...assertions,
  ],
})

export const pageReads: Record<string, PageRead> = {
  '/': {
    pattern: '/',
    ...html([{ kind: 'h1-matches', pattern: /thock/i }]),
  },
  '/news': { pattern: '/news', ...html([{ kind: 'h1-matches', pattern: /news/i }]) },
  '/trends': {
    pattern: '/trends',
    ...html([{ kind: 'h1-matches', pattern: /trends/i }]),
  },
  '/trends/tracker': {
    pattern: '/trends/tracker',
    ...html([{ kind: 'h1-matches', pattern: /trends tracker/i }]),
  },
  '/ideas': {
    pattern: '/ideas',
    ...html([{ kind: 'h1-matches', pattern: /ideas/i }]),
  },
  '/deep-dives': {
    pattern: '/deep-dives',
    ...html([{ kind: 'h1-matches', pattern: /deep dives/i }]),
  },
  '/guides': {
    pattern: '/guides',
    ...html([{ kind: 'h1-matches', pattern: /guides/i }]),
  },
  '/group-buys': {
    pattern: '/group-buys',
    ...html([{ kind: 'h1-matches', pattern: /group buys/i }]),
  },
  '/about': {
    pattern: '/about',
    ...html([{ kind: 'h1-matches', pattern: /about/i }]),
  },
  '/newsletter': {
    pattern: '/newsletter',
    ...html([{ kind: 'h1-matches', pattern: /newsletter/i }]),
  },
  '/search': {
    pattern: '/search',
    ...html([{ kind: 'h1-matches', pattern: /search/i }]),
  },
  '/sources': {
    pattern: '/sources',
    ...html([{ kind: 'h1-matches', pattern: /sources/i }]),
  },
  '/article/[slug]': {
    pattern: '/article/[slug]',
    ...html([]),
  },
  '/tag/[slug]': {
    pattern: '/tag/[slug]',
    ...html([{ kind: 'h1-matches', pattern: /^#/ }]),
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
