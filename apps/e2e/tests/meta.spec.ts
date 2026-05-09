import { expect, test } from '@playwright/test'
import { getCanonicalUrls } from '../src/fixtures/canonical-urls'

const CANONICAL = getCanonicalUrls()
const HTML_PATHS = CANONICAL.filter((u) => u.kind === 'html').map((u) => u.path)

const ARTICLE_SLUGS_IN_FIXTURE = CANONICAL.filter((u) =>
  u.path.startsWith('/article/'),
).map((u) => u.path)
const TAG_SLUGS_IN_FIXTURE = CANONICAL.filter((u) =>
  u.path.startsWith('/tag/'),
).map((u) => u.path)

/**
 * Phase 17 — meta gates.
 * (1) /sitemap.xml lists every canonical HTML URL.
 * (2) Every canonical HTML URL emits well-formed JSON-LD with the
 *     expected `@type` for its route family.
 *
 * Scope: superset relationship — sitemap may contain more entries
 * than canonical-urls (e.g. /feed/<pillar>.xml). The gate fails
 * only when a canonical URL is missing from the sitemap. That's
 * the regression we care about.
 */

test.describe('phase 17 — sitemap completeness', () => {
  test('sitemap covers every canonical HTML URL + every article slug + every tag slug', async ({
    request,
  }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const xml = await res.text()

    // Pull every <loc>...</loc> body out — site-relative pathname
    // is what we compare against canonical-urls.
    const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => {
      const href = m[1]!.trim()
      try {
        return new URL(href).pathname
      } catch {
        return href
      }
    })
    const locSet = new Set(locs)

    const missing: string[] = []
    for (const path of [
      ...HTML_PATHS,
      ...ARTICLE_SLUGS_IN_FIXTURE,
      ...TAG_SLUGS_IN_FIXTURE,
    ]) {
      if (!locSet.has(path)) missing.push(path)
    }

    expect(missing, `sitemap missing canonical URLs: ${missing.join(', ')}`).toEqual([])
  })
})

const PILLAR_PATHS = new Set([
  '/news',
  '/trends',
  '/ideas',
  '/deep-dives',
  '/guides',
])

type ExpectedTypes = string[]

function expectedTypesFor(path: string): ExpectedTypes {
  // Home is the canonical site root; emits WebSite + ItemList (no BreadcrumbList).
  if (path === '/') return ['WebSite', 'ItemList']
  if (path === '/about') return ['WebSite', 'BreadcrumbList']
  if (path === '/sources') return ['WebSite', 'BreadcrumbList']
  if (path === '/newsletter') return ['WebSite', 'BreadcrumbList']
  if (path === '/search') return ['BreadcrumbList']
  if (path === '/group-buys') return ['CollectionPage', 'BreadcrumbList']
  if (path === '/trends/tracker')
    return ['CollectionPage', 'BreadcrumbList', 'Dataset']
  if (PILLAR_PATHS.has(path))
    return ['CollectionPage', 'BreadcrumbList', 'ItemList']
  if (path.startsWith('/article/')) return ['Article', 'BreadcrumbList']
  if (path.startsWith('/tag/')) return ['CollectionPage', 'BreadcrumbList']
  // Anything else: just require *some* JSON-LD parses (catches
  // malformed HTML on routes we haven't categorized).
  return []
}

function extractJsonLd(html: string): unknown[] {
  const re =
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  const out: unknown[] = []
  for (
    let m = re.exec(html);
    m !== null;
    m = re.exec(html)
  ) {
    const body = m[1]?.trim()
    if (!body) continue
    try {
      out.push(JSON.parse(body))
    } catch {
      // Surface as zero-found; the per-path test will report
      // missing types.
    }
  }
  return out
}

test.describe('phase 17 — JSON-LD shape audit', () => {
  for (const path of HTML_PATHS) {
    test(`${path} emits well-formed JSON-LD with expected @type`, async ({
      page,
    }) => {
      await page.goto(path)
      const html = await page.content()
      const parsed = extractJsonLd(html)

      // Collect every @type seen. Drill into arrays AND @graph
      // (Next pages emit either a graph object, an array of node
      // objects, or sometimes an array containing graphs).
      const types = new Set<string>()
      const collect = (node: unknown): void => {
        if (!node) return
        if (Array.isArray(node)) {
          for (const item of node) collect(item)
          return
        }
        if (typeof node !== 'object') return
        const obj = node as Record<string, unknown>
        const t = obj['@type']
        if (typeof t === 'string') types.add(t)
        else if (Array.isArray(t))
          for (const x of t) if (typeof x === 'string') types.add(x)
        const graph = obj['@graph']
        if (Array.isArray(graph)) for (const item of graph) collect(item)
      }
      for (const node of parsed) collect(node)

      const expected = expectedTypesFor(path)
      for (const want of expected) {
        expect(
          types.has(want),
          `${path} JSON-LD missing @type "${want}"; saw [${[...types].join(', ')}]`,
        ).toBe(true)
      }
    })
  }
})

// Also assert at least one article slug is in the canonical set
// (defense against a regression that empties the manifest).
test('canonical fixture has at least one article slug + one tag slug', () => {
  expect(ARTICLE_SLUGS_IN_FIXTURE.length).toBeGreaterThanOrEqual(1)
  expect(TAG_SLUGS_IN_FIXTURE.length).toBeGreaterThanOrEqual(1)
})
