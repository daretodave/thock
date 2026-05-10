import { afterEach, describe, expect, it } from 'vitest'
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByPillar,
  getArticlesByTag,
} from '../../loaders/articles'
import { __resetForTests } from '../../loaders/memo'

describe('articles loader', () => {
  afterEach(() => __resetForTests())

  it('reads the seed articles plus any iterate-shipped pieces', () => {
    const all = getAllArticles()
    // 6 seed articles + N iterate-shipped pieces (Trends 75-percent-default
    // landed via /iterate 2026-05-10). Use a floor rather than a hard count
    // so future iterate ticks don't keep flipping this assertion.
    expect(all.length).toBeGreaterThanOrEqual(6)
  })

  it('sorts by publishedAt descending', () => {
    const dates = getAllArticles().map((a) => a.frontmatter.publishedAt)
    const sorted = [...dates].sort((a, b) => b.localeCompare(a))
    expect(dates).toEqual(sorted)
  })

  it('resolves a known slug', () => {
    const a = getArticleBySlug('beginners-switch-buying-guide')
    expect(a?.frontmatter.pillar).toBe('guides')
  })

  it('returns null for unknown slug', () => {
    expect(getArticleBySlug('does-not-exist-yet')).toBeNull()
  })

  it('filters by pillar', () => {
    const trends = getArticlesByPillar('trends')
    expect(trends.length).toBeGreaterThanOrEqual(1)
    for (const a of trends) expect(a.frontmatter.pillar).toBe('trends')
  })

  it('filters by tag', () => {
    const linear = getArticlesByTag('linear')
    expect(linear.length).toBeGreaterThanOrEqual(1)
    for (const a of linear) expect(a.frontmatter.tags).toContain('linear')
  })

  it('precomputes readTime as a positive integer', () => {
    for (const a of getAllArticles()) {
      expect(a.readTime).toBeGreaterThanOrEqual(1)
      expect(Number.isInteger(a.readTime)).toBe(true)
    }
  })
})
