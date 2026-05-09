import { describe, expect, it } from 'vitest'
import { buildRssXml } from '../buildRss'
import type { Article } from '@thock/content'

const makeArticle = (overrides: Partial<Article> = {}): Article => ({
  slug: 'foo',
  body: '',
  readTime: 1,
  filePath: '/x',
  frontmatter: {
    slug: 'foo',
    title: 'Foo & bar',
    lede: '<one> "two"',
    author: 'Mara',
    pillar: 'news',
    tags: ['gateron-oil-king'],
    publishedAt: '2026-05-01T12:00:00Z',
    updatedAt: null,
    heroImage: null,
    heroImageAlt: null,
    featured: false,
    popularityScore: 0,
    guideSection: null,
    mentionedParts: [],
  },
  ...overrides,
})

describe('buildRssXml', () => {
  it('produces an RSS 2.0 envelope with channel + items', () => {
    const xml = buildRssXml({
      title: 'thock',
      link: 'https://thock-coral.vercel.app',
      description: 'desc',
      articles: [makeArticle()],
    })

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8" ?>')
    expect(xml).toContain('<rss version="2.0">')
    expect(xml).toContain('<channel>')
    expect(xml).toContain('</channel>')
    expect(xml).toContain('</rss>')
    expect(xml).toContain('<item>')
    expect(xml).toContain('<title>Foo &amp; bar</title>')
    expect(xml).toContain('<description>&lt;one&gt; &quot;two&quot;</description>')
    expect(xml).toContain(
      '<link>https://thock-coral.vercel.app/article/foo</link>',
    )
    expect(xml).toContain('<guid isPermaLink="true">')
    expect(xml).toContain('<pubDate>')
  })

  it('escapes ampersands in channel description', () => {
    const xml = buildRssXml({
      title: 't',
      link: 'https://x',
      description: 'A & B',
      articles: [],
    })
    expect(xml).toContain('<description>A &amp; B</description>')
  })

  it('handles an empty article list', () => {
    const xml = buildRssXml({
      title: 't',
      link: 'https://x',
      description: 'd',
      articles: [],
    })
    expect(xml).toContain('<channel>')
    expect(xml).not.toContain('<item>')
  })

  it('keeps articles in the order provided (callers sort)', () => {
    const a = makeArticle({
      slug: 'a',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'a',
        title: 'A',
        publishedAt: '2026-05-01T00:00:00Z',
      },
    })
    const b = makeArticle({
      slug: 'b',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'b',
        title: 'B',
        publishedAt: '2026-05-08T00:00:00Z',
      },
    })
    const xml = buildRssXml({
      title: 't',
      link: 'https://x',
      description: 'd',
      articles: [b, a],
    })
    const idxB = xml.indexOf('<title>B</title>')
    const idxA = xml.indexOf('<title>A</title>')
    expect(idxB).toBeGreaterThan(-1)
    expect(idxA).toBeGreaterThan(idxB)
  })
})
