import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import { groupGuidesBySection } from '../helpers'

function makeArticle(
  slug: string,
  publishedAt: string,
  guideSection: 'firmware' | 'modding' | 'switches' | 'keycaps' | null = null,
  updatedAt: string | null = null,
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
      author: 'thock',
      pillar: 'guides',
      tags: [],
      publishedAt,
      updatedAt,
      heroImage: null,
      heroImageAlt: null,
      featured: false,
      popularityScore: 0,
      guideSection,
      mentionedParts: [],
    },
  }
}

describe('groupGuidesBySection', () => {
  it('returns an empty array for an empty article list', () => {
    expect(groupGuidesBySection([])).toEqual([])
  })

  it('places an article with guideSection="firmware" in the Firmware section', () => {
    const article = makeArticle('firmware-guide', '2026-05-01', 'firmware')
    const result = groupGuidesBySection([article])
    expect(result).toHaveLength(1)
    expect(result[0]!.key).toBe('firmware')
    expect(result[0]!.label).toBe('Firmware')
    expect(result[0]!.articles[0]!.slug).toBe('firmware-guide')
  })

  it('places an article with null guideSection in the "Other guides" bucket', () => {
    const article = makeArticle('unclassified-guide', '2026-05-01', null)
    const result = groupGuidesBySection([article])
    expect(result).toHaveLength(1)
    expect(result[0]!.key).toBe('other')
    expect(result[0]!.label).toBe('Other guides')
  })

  it('emits sections in canonical order: firmware, modding, switches, keycaps, other', () => {
    const articles = [
      makeArticle('keycaps-guide', '2026-05-01', 'keycaps'),
      makeArticle('firmware-guide', '2026-05-02', 'firmware'),
      makeArticle('other-guide', '2026-05-03', null),
      makeArticle('modding-guide', '2026-05-04', 'modding'),
      makeArticle('switches-guide', '2026-05-05', 'switches'),
    ]
    const result = groupGuidesBySection(articles)
    expect(result.map(g => g.key)).toEqual([
      'firmware',
      'modding',
      'switches',
      'keycaps',
      'other',
    ])
  })

  it('drops sections that have no articles', () => {
    const article = makeArticle('firmware-guide', '2026-05-01', 'firmware')
    const result = groupGuidesBySection([article])
    const keys = result.map(g => g.key)
    expect(keys).toEqual(['firmware'])
  })

  it('sorts articles within a section by updatedAt desc', () => {
    const articles = [
      makeArticle('older-update', '2026-04-01', 'modding', '2026-04-15'),
      makeArticle('newest-update', '2026-04-01', 'modding', '2026-05-10'),
      makeArticle('mid-update', '2026-04-01', 'modding', '2026-04-30'),
    ]
    const result = groupGuidesBySection(articles)
    expect(result[0]!.articles.map(a => a.slug)).toEqual([
      'newest-update',
      'mid-update',
      'older-update',
    ])
  })

  it('uses publishedAt as freshness when updatedAt is null', () => {
    const articles = [
      makeArticle('older-pub', '2026-04-01', 'switches', null),
      makeArticle('newer-pub', '2026-05-01', 'switches', null),
    ]
    const result = groupGuidesBySection(articles)
    expect(result[0]!.articles.map(a => a.slug)).toEqual(['newer-pub', 'older-pub'])
  })

  it('tie-breaks same updatedAt by publishedAt desc', () => {
    const articles = [
      makeArticle('older-pub', '2026-04-01', 'keycaps', '2026-05-10'),
      makeArticle('newer-pub', '2026-05-01', 'keycaps', '2026-05-10'),
    ]
    const result = groupGuidesBySection(articles)
    expect(result[0]!.articles.map(a => a.slug)).toEqual(['newer-pub', 'older-pub'])
  })

  it('tie-breaks identical freshness and publishedAt by slug asc for build stability', () => {
    const articles = [
      makeArticle('zzz-guide', '2026-05-01', 'firmware', '2026-05-10'),
      makeArticle('aaa-guide', '2026-05-01', 'firmware', '2026-05-10'),
    ]
    const result = groupGuidesBySection(articles)
    expect(result[0]!.articles.map(a => a.slug)).toEqual(['aaa-guide', 'zzz-guide'])
  })

  it('does not mutate the input array', () => {
    const articles = [
      makeArticle('guide-b', '2026-04-01', 'switches'),
      makeArticle('guide-a', '2026-05-01', 'switches'),
    ]
    const copy = [...articles]
    groupGuidesBySection(articles)
    expect(articles).toEqual(copy)
  })
})
