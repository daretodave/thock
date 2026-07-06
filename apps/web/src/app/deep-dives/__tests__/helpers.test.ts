import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import { sortDeepDivesByLength } from '../helpers'

function makeArticle(
  slug: string,
  publishedAt: string,
  readTime = 5,
): Article {
  return {
    slug,
    body: '',
    readTime,
    filePath: `articles/${slug}.mdx`,
    frontmatter: {
      slug,
      title: slug,
      lede: 'A test article for unit testing purposes only.',
      description: null,
      author: 'thock',
      pillar: 'deep-dives',
      tags: [],
      publishedAt,
      updatedAt: null,
      heroImage: null,
      heroImageAlt: null,
      featured: false,
      popularityScore: 0,
      guideSection: null,
      mentionedParts: [],
    },
  }
}

describe('sortDeepDivesByLength', () => {
  it('returns an empty array for an empty input', () => {
    expect(sortDeepDivesByLength([])).toEqual([])
  })

  it('returns a single article unchanged', () => {
    const article = makeArticle('only-article', '2026-05-01', 10)
    const result = sortDeepDivesByLength([article])
    expect(result).toHaveLength(1)
    expect(result[0]!.slug).toBe('only-article')
  })

  it('sorts by readTime descending — longest reads first', () => {
    const articles = [
      makeArticle('short', '2026-05-01', 4),
      makeArticle('long', '2026-05-01', 12),
      makeArticle('mid', '2026-05-01', 8),
    ]
    const result = sortDeepDivesByLength(articles)
    expect(result.map(a => a.slug)).toEqual(['long', 'mid', 'short'])
  })

  it('tie-breaks equal readTime by publishedAt desc', () => {
    const articles = [
      makeArticle('older', '2026-04-01', 10),
      makeArticle('newer', '2026-05-01', 10),
    ]
    const result = sortDeepDivesByLength(articles)
    expect(result.map(a => a.slug)).toEqual(['newer', 'older'])
  })

  it('tie-breaks equal readTime and publishedAt by slug asc for build stability', () => {
    const articles = [
      makeArticle('zzz-dive', '2026-05-01', 10),
      makeArticle('aaa-dive', '2026-05-01', 10),
    ]
    const result = sortDeepDivesByLength(articles)
    expect(result.map(a => a.slug)).toEqual(['aaa-dive', 'zzz-dive'])
  })

  it('applies all three sort keys in the correct cascade', () => {
    const articles = [
      makeArticle('a-long', '2026-04-01', 15),
      makeArticle('b-mid-newer', '2026-05-01', 10),
      makeArticle('a-mid-older', '2026-04-01', 10),
      makeArticle('short', '2026-05-01', 5),
    ]
    const result = sortDeepDivesByLength(articles)
    expect(result.map(a => a.slug)).toEqual([
      'a-long',
      'b-mid-newer',
      'a-mid-older',
      'short',
    ])
  })

  it('does not mutate the input array', () => {
    const articles = [
      makeArticle('article-b', '2026-05-01', 4),
      makeArticle('article-a', '2026-05-01', 8),
    ]
    const copy = [...articles]
    sortDeepDivesByLength(articles)
    expect(articles).toEqual(copy)
  })
})
