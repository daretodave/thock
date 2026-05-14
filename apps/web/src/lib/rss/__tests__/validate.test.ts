import { describe, expect, it } from 'vitest'
import { validateRssXml } from '../validate'
import { buildRssXml } from '../buildRss'
import type { Article } from '@thock/content'

function article(over: Partial<Article['frontmatter']> = {}): Article {
  return {
    slug: 'sample',
    frontmatter: {
      slug: 'sample',
      title: 'Sample article',
      lede: 'A sample lede long enough to satisfy the schema minimum length.',
      author: 'thock',
      pillar: 'news',
      tags: ['group-buy'],
      publishedAt: '2026-05-01T00:00:00.000Z',
      updatedAt: null,
      heroImage: null,
      heroImageAlt: null,
      featured: false,
      popularityScore: 0,
      guideSection: null,
      mentionedParts: [],
      ...over,
    },
    body: 'Body',
    readTime: 1,
    filePath: '/fake/sample.mdx',
  }
}

describe('validateRssXml', () => {
  it('passes a feed produced by buildRssXml', () => {
    const xml = buildRssXml({
      title: 'thock — News',
      link: 'https://thock.xyz/news',
      description: 'News stories from thock.',
      articles: [article(), article({ slug: 'second', title: 'Second piece' })],
    })
    const result = validateRssXml(xml)
    expect(result.itemCount).toBe(2)
    expect(result.channelTitle).toMatch(/thock/i)
  })

  it('rejects a feed missing the rss root', () => {
    const broken = '<channel><title>x</title></channel>'
    expect(() => validateRssXml(broken)).toThrow(/<rss version="2\.0">/)
  })

  it('rejects a feed missing the channel element', () => {
    const broken = '<rss version="2.0"></rss>'
    expect(() => validateRssXml(broken)).toThrow(/`<channel>`/)
  })

  it('rejects a feed missing the channel title', () => {
    const broken =
      '<rss version="2.0"><channel><link>x</link><description>y</description><item><title>i</title><link>l</link><pubDate>d</pubDate></item></channel></rss>'
    expect(() => validateRssXml(broken)).toThrow(/channel is missing `<title>`/)
  })

  it('rejects a feed with zero items', () => {
    const broken =
      '<rss version="2.0"><channel><title>t</title><link>l</link><description>d</description></channel></rss>'
    expect(() => validateRssXml(broken)).toThrow(/no `<item>`/)
  })

  it('rejects an item missing its pubDate', () => {
    const broken =
      '<rss version="2.0"><channel><title>t</title><link>l</link><description>d</description><item><title>i</title><link>l</link></item></channel></rss>'
    expect(() => validateRssXml(broken)).toThrow(/missing `<pubDate>`/)
  })
})
