import { describe, expect, it, vi } from 'vitest'
import type { Article } from '@thock/content'
import { FEED_ITEM_LIMIT } from '@/lib/rss/buildRss'

const makeArticle = (n: number): Article => ({
  slug: `article-${n}`,
  body: '',
  readTime: 1,
  filePath: '/x',
  frontmatter: {
    slug: `article-${n}`,
    title: `Article ${n}`,
    lede: 'lede',
    description: null,
    author: 'Mara',
    pillar: 'news',
    tags: [],
    publishedAt: '2026-05-01T00:00:00Z',
    updatedAt: null,
    heroImage: null,
    heroImageAlt: null,
    featured: false,
    popularityScore: 0,
    guideSection: null,
    mentionedParts: [],
  },
})

const xmlOf = async (response: Response) => {
  expect(response.headers.get('content-type')).toMatch(/application\/rss\+xml/)
  return response.text()
}

const countItems = (xml: string) => (xml.match(/<item>/g) ?? []).length

describe('global feed.xml', () => {
  it('returns RSS 2.0 with at least one item', async () => {
    const { GET: getGlobalFeed } = await import('../feed.xml/route')
    const xml = await xmlOf(getGlobalFeed())
    expect(xml).toContain('<rss version="2.0">')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('<item>')
  })
})

describe('pillar feed.xml', () => {
  const call = async (pillar: string) => {
    const { GET: getPillarFeed } = await import('../feed/[pillar]/route')
    const req = new Request(`http://localhost/feed/${pillar}`)
    return getPillarFeed(req, {
      params: Promise.resolve({ pillar }),
    })
  }

  it('returns RSS for a known pillar', async () => {
    const res = await call('news.xml')
    expect(res.status).toBe(200)
    const xml = await xmlOf(res)
    expect(xml).toContain('<rss version="2.0">')
  })

  it('returns RSS without the .xml suffix too', async () => {
    const res = await call('news')
    expect(res.status).toBe(200)
  })

  it('404s on an unknown pillar', async () => {
    const res = await call('unknown.xml')
    expect(res.status).toBe(404)
  })
})

describe('feed item caps', () => {
  const manyArticles = Array.from({ length: FEED_ITEM_LIMIT + 10 }, (_, i) =>
    makeArticle(i),
  )

  it('caps the global feed at FEED_ITEM_LIMIT items', async () => {
    vi.resetModules()
    vi.doMock('@/lib/data-runtime', async () => {
      const actual = await vi.importActual<typeof import('@/lib/data-runtime')>(
        '@/lib/data-runtime',
      )
      return { ...actual, getAllArticles: () => manyArticles }
    })
    const { GET: getGlobalFeed } = await import('../feed.xml/route')
    const xml = await xmlOf(getGlobalFeed())
    expect(countItems(xml)).toBe(FEED_ITEM_LIMIT)
    vi.doUnmock('@/lib/data-runtime')
    vi.resetModules()
  })

  it('caps a pillar feed at FEED_ITEM_LIMIT items', async () => {
    vi.resetModules()
    vi.doMock('@/lib/data-runtime', async () => {
      const actual = await vi.importActual<typeof import('@/lib/data-runtime')>(
        '@/lib/data-runtime',
      )
      return { ...actual, getArticlesByPillar: () => manyArticles }
    })
    const { GET: getPillarFeed } = await import('../feed/[pillar]/route')
    const req = new Request('http://localhost/feed/news.xml')
    const res = await getPillarFeed(req, {
      params: Promise.resolve({ pillar: 'news.xml' }),
    })
    const xml = await xmlOf(res)
    expect(countItems(xml)).toBe(FEED_ITEM_LIMIT)
    vi.doUnmock('@/lib/data-runtime')
    vi.resetModules()
  })
})
