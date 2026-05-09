import { describe, expect, it } from 'vitest'
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByPillar,
  getArticlesByTag,
  getRelatedArticles,
  getAllTags,
  getTagBySlug,
  getActiveGroupBuys,
  getAllGroupBuys,
  getLatestTrendSnapshot,
  manifestGeneratedAt,
} from '../index'

describe('data-runtime adapter', () => {
  it('exposes the seeded articles', () => {
    expect(getAllArticles().length).toBeGreaterThanOrEqual(6)
  })

  it('looks up an article by slug', () => {
    const article = getArticleBySlug('trends-tracker-preview')
    expect(article).not.toBeNull()
    expect(article!.slug).toBe('trends-tracker-preview')
  })

  it('returns null for an unknown slug', () => {
    expect(getArticleBySlug('this-does-not-exist')).toBeNull()
  })

  it('filters articles by pillar', () => {
    const news = getArticlesByPillar('news')
    expect(news.every((a) => a.frontmatter.pillar === 'news')).toBe(true)
  })

  it('filters articles by tag', () => {
    const linears = getArticlesByTag('linear')
    expect(linears.every((a) => a.frontmatter.tags.includes('linear'))).toBe(
      true,
    )
  })

  it('related articles excludes self', () => {
    const seed = getAllArticles()[0]!
    const related = getRelatedArticles(seed, 4)
    expect(related.every((a) => a.slug !== seed.slug)).toBe(true)
    expect(related.length).toBeLessThanOrEqual(4)
  })

  it('exposes tags sorted by slug', () => {
    const tags = getAllTags()
    expect(tags.length).toBeGreaterThan(0)
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i]!.slug.localeCompare(tags[i - 1]!.slug)).toBeGreaterThan(-1)
    }
  })

  it('looks up a tag by slug', () => {
    const tag = getTagBySlug('linear')
    expect(tag?.slug).toBe('linear')
  })

  it('exposes group buys', () => {
    expect(getAllGroupBuys().length).toBeGreaterThanOrEqual(1)
  })

  it('active group buys excludes closed/shipped and past dates', () => {
    const futureRef = new Date('2020-01-01T00:00:00Z')
    const active = getActiveGroupBuys(futureRef)
    for (const g of active) {
      expect(['closed', 'shipped']).not.toContain(g.status)
    }
  })

  it('returns latest trend snapshot when present', () => {
    const snap = getLatestTrendSnapshot()
    expect(snap).not.toBeNull()
    expect(snap!.isoWeek).toMatch(/^\d{4}-W\d{2}$/)
  })

  it('manifestGeneratedAt is an ISO timestamp', () => {
    expect(manifestGeneratedAt()).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    )
  })
})
