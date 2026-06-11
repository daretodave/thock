import { describe, it, expect } from 'vitest'
import { groupArticlesByMonth } from '../archiveUtils'
import { makeArticle } from '@/components/home/__tests__/testFixtures'

const DEFAULT_FM = makeArticle().frontmatter

describe('groupArticlesByMonth', () => {
  it('returns empty array for empty input', () => {
    expect(groupArticlesByMonth([])).toEqual([])
  })

  it('groups articles into correct months', () => {
    const articles = [
      makeArticle({ slug: 'a', frontmatter: { ...DEFAULT_FM, slug: 'a', publishedAt: '2026-05-10T00:00:00.000Z' } }),
      makeArticle({ slug: 'b', frontmatter: { ...DEFAULT_FM, slug: 'b', publishedAt: '2026-05-20T00:00:00.000Z' } }),
      makeArticle({ slug: 'c', frontmatter: { ...DEFAULT_FM, slug: 'c', publishedAt: '2026-04-15T00:00:00.000Z' } }),
    ]
    const groups = groupArticlesByMonth(articles)
    expect(groups).toHaveLength(2)
    expect(groups.at(0)!.key).toBe('2026-05')
    expect(groups.at(1)!.key).toBe('2026-04')
  })

  it('sorts months newest-first', () => {
    const articles = [
      makeArticle({ slug: 'a', frontmatter: { ...DEFAULT_FM, slug: 'a', publishedAt: '2026-03-01T00:00:00.000Z' } }),
      makeArticle({ slug: 'b', frontmatter: { ...DEFAULT_FM, slug: 'b', publishedAt: '2026-05-01T00:00:00.000Z' } }),
      makeArticle({ slug: 'c', frontmatter: { ...DEFAULT_FM, slug: 'c', publishedAt: '2026-04-01T00:00:00.000Z' } }),
    ]
    const groups = groupArticlesByMonth(articles)
    expect(groups.map((g) => g.key)).toEqual(['2026-05', '2026-04', '2026-03'])
  })

  it('sorts articles within a month newest-first', () => {
    const articles = [
      makeArticle({ slug: 'early', frontmatter: { ...DEFAULT_FM, slug: 'early', publishedAt: '2026-05-01T00:00:00.000Z' } }),
      makeArticle({ slug: 'late', frontmatter: { ...DEFAULT_FM, slug: 'late', publishedAt: '2026-05-30T00:00:00.000Z' } }),
      makeArticle({ slug: 'mid', frontmatter: { ...DEFAULT_FM, slug: 'mid', publishedAt: '2026-05-15T00:00:00.000Z' } }),
    ]
    const groups = groupArticlesByMonth(articles)
    expect(groups).toHaveLength(1)
    const slugs = groups.at(0)!.articles.map((a) => a.slug)
    expect(slugs).toEqual(['late', 'mid', 'early'])
  })

  it('produces human-readable labels', () => {
    const articles = [
      makeArticle({ slug: 'a', frontmatter: { ...DEFAULT_FM, slug: 'a', publishedAt: '2026-05-10T00:00:00.000Z' } }),
      makeArticle({ slug: 'b', frontmatter: { ...DEFAULT_FM, slug: 'b', publishedAt: '2026-01-10T00:00:00.000Z' } }),
    ]
    const groups = groupArticlesByMonth(articles)
    expect(groups.at(0)!.label).toBe('May 2026')
    expect(groups.at(1)!.label).toBe('January 2026')
  })

  it('counts articles per group correctly', () => {
    const articles = [
      makeArticle({ slug: 'a', frontmatter: { ...DEFAULT_FM, slug: 'a', publishedAt: '2026-05-01T00:00:00.000Z' } }),
      makeArticle({ slug: 'b', frontmatter: { ...DEFAULT_FM, slug: 'b', publishedAt: '2026-05-02T00:00:00.000Z' } }),
      makeArticle({ slug: 'c', frontmatter: { ...DEFAULT_FM, slug: 'c', publishedAt: '2026-05-03T00:00:00.000Z' } }),
    ]
    const groups = groupArticlesByMonth(articles)
    expect(groups).toHaveLength(1)
    expect(groups.at(0)!.articles).toHaveLength(3)
  })
})
