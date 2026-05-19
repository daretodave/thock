import { describe, expect, it } from 'vitest'
import { searchArticles, searchParts } from '../runtime'

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

describe('searchParts', () => {
  it('returns an empty array for an empty query', () => {
    expect(searchParts('')).toEqual([])
  })

  it('returns an empty array for a whitespace-only query', () => {
    expect(searchParts('   ')).toEqual([])
  })

  it('matches by name substring (case-insensitive)', () => {
    const hits = searchParts('gateron oil king')
    expect(hits.length).toBeGreaterThanOrEqual(1)
    expect(hits[0]?.name.toLowerCase()).toContain('gateron oil king')
  })

  it('matches by kind substring', () => {
    const switches = searchParts('switch')
    expect(switches.length).toBeGreaterThanOrEqual(1)
    expect(switches.every((h) => h.kind === 'switch')).toBe(true)
  })

  it('respects the limit cap', () => {
    const all = searchParts('a', 100)
    const limited = searchParts('a', 1)
    if (all.length === 0) return
    expect(limited.length).toBeLessThanOrEqual(1)
  })

  it('attaches a score of 1.0 to every hit', () => {
    const hits = searchParts('gateron')
    for (const h of hits) {
      expect(h.score).toBe(1.0)
    }
  })
})
