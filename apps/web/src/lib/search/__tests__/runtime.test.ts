import { describe, expect, it } from 'vitest'
import { searchArticles } from '../runtime'

describe('searchArticles', () => {
  it('returns an empty array for an empty query', () => {
    expect(searchArticles('')).toEqual([])
    expect(searchArticles('   ')).toEqual([])
  })

  it('finds the deep-dive article when the query matches the title', () => {
    const hits = searchArticles('oil king')
    expect(hits.length).toBeGreaterThanOrEqual(1)
    const slugs = hits.map((h) => h.slug)
    expect(slugs).toContain('gateron-oil-king-deep-dive')
  })

  it('matches via the tags field when the term is a tag slug', () => {
    const hits = searchArticles('linear')
    expect(hits.length).toBeGreaterThanOrEqual(1)
    expect(hits.every((h) => h.score > 0)).toBe(true)
  })

  it('caps the result list at the requested limit', () => {
    const all = searchArticles('a', 25)
    if (all.length === 0) return
    const limited = searchArticles('a', 1)
    expect(limited.length).toBeLessThanOrEqual(1)
  })

  it('returns hits enriched with stored fields', () => {
    const hits = searchArticles('switch')
    if (hits.length === 0) return
    const first = hits[0]
    expect(first).toHaveProperty('title')
    expect(first).toHaveProperty('lede')
    expect(first).toHaveProperty('pillar')
    expect(first).toHaveProperty('tags')
    expect(first).toHaveProperty('publishedAt')
    expect(first).toHaveProperty('score')
  })

  it('orders hits by descending score', () => {
    const hits = searchArticles('switch')
    if (hits.length < 2) return
    for (let i = 1; i < hits.length; i++) {
      const prev = hits[i - 1]
      const curr = hits[i]
      expect(prev?.score ?? 0).toBeGreaterThanOrEqual(curr?.score ?? 0)
    }
  })

  it('handles a typo via the fuzzy default', () => {
    // "swich" → "switch"
    const hits = searchArticles('swich')
    expect(hits.length).toBeGreaterThanOrEqual(1)
  })
})
