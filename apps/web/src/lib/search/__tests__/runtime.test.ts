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
    const all = searchArticles('switch', 25)
    if (all.length === 0) return
    const limited = searchArticles('switch', 1)
    expect(limited.length).toBeLessThanOrEqual(1)
  })

  it('returns no results for a bare stopword query instead of the whole corpus', () => {
    expect(searchArticles('a')).toEqual([])
    expect(searchArticles('the')).toEqual([])
    expect(searchArticles('i')).toEqual([])
  })

  it('does not prefix/fuzzy-expand a short query into a near-total corpus match', () => {
    const hits = searchArticles('SA')
    expect(hits.length).toBeLessThan(20)
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

  it('returns the same top hit for "hotswap" and "hot swap" — the site label vs. majority prose spelling', () => {
    const bareWord = searchArticles('hotswap')
    const twoWords = searchArticles('hot swap')
    expect(bareWord.length).toBeGreaterThanOrEqual(1)
    expect(twoWords.length).toBeGreaterThanOrEqual(1)
    expect(bareWord[0]?.slug).toBe(twoWords[0]?.slug)
  })

  describe('requireStrongMatch', () => {
    it('drops a multi-word query for an off-catalog product whose only overlap is an incidental body mention of a common short word', () => {
      // No article covers this product; MiniSearch's default OR-combine still
      // returns hits purely off a body-only mention of a short, generic term
      // ("one"), which reads as a confidently wrong "did you mean" suggestion.
      const loose = searchArticles('razer huntsman v3')
      const strong = searchArticles('razer huntsman v3', undefined, {
        requireStrongMatch: true,
      })
      expect(loose.length).toBeGreaterThanOrEqual(1)
      expect(strong).toEqual([])
    })

    it('drops results for a nonsense query even though the loose search returns a body-only hit', () => {
      const loose = searchArticles('xyzzy quux plugh')
      const strong = searchArticles('xyzzy quux plugh', undefined, {
        requireStrongMatch: true,
      })
      expect(loose.length).toBeGreaterThanOrEqual(1)
      expect(strong).toEqual([])
    })

    it('still surfaces a genuine typo of a real article title', () => {
      // "gaetron" doesn't fuzzy-match "gateron" (edit distance 2, over the
      // fuzzy budget) but "oil"/"king" landing in the title is strong
      // enough evidence on its own.
      const strong = searchArticles('gaetron oil king', undefined, {
        requireStrongMatch: true,
      })
      expect(strong.length).toBeGreaterThanOrEqual(1)
      expect(strong[0]?.slug).toBe('gateron-oil-king-deep-dive')
    })

    it('still surfaces a genuine single-word typo of a tag/title term', () => {
      const strong = searchArticles('silnt', undefined, {
        requireStrongMatch: true,
      })
      expect(strong.length).toBeGreaterThanOrEqual(1)
    })
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
    const all = searchParts('switch', 100)
    const limited = searchParts('switch', 1)
    if (all.length === 0) return
    expect(limited.length).toBeLessThanOrEqual(1)
  })

  it('returns an empty array for a short or bare-stopword query instead of over-matching by substring', () => {
    expect(searchParts('a')).toEqual([])
    expect(searchParts('the')).toEqual([])
    expect(searchParts('ab')).toEqual([])
  })

  it('attaches a score of 1.0 to every hit', () => {
    const hits = searchParts('gateron')
    for (const h of hits) {
      expect(h.score).toBe(1.0)
    }
  })

  it('surfaces vendors, newsletters, and group buys, each with an href', () => {
    for (const kind of ['vendor', 'newsletter', 'group-buy']) {
      const hits = searchParts(kind)
      expect(hits.length).toBeGreaterThanOrEqual(1)
      expect(hits.every((h) => h.kind === kind)).toBe(true)
      for (const h of hits) {
        expect(typeof h.href).toBe('string')
        expect(h.href.length).toBeGreaterThan(0)
      }
    }
  })

  it('routes a past group buy to the /group-buys/past archive anchor', () => {
    const groupBuyHits = searchParts('group-buy')
    expect(groupBuyHits.length).toBeGreaterThanOrEqual(1)
    for (const h of groupBuyHits) {
      expect(h.href).toMatch(/^\/group-buys(\/past)?#.+/)
    }
  })

  it('surfaces Trends Tracker weeks, each linking to its archive page — except the latest week, which canonicalizes to /trends/tracker', () => {
    const weekHits = searchParts('tracker-week', 100)
    expect(weekHits.length).toBeGreaterThanOrEqual(1)
    for (const h of weekHits) {
      expect(h.kind).toBe('tracker-week')
      expect(h.href).toMatch(/^\/trends\/tracker(\/\d{4}-W\d{2})?$/)
    }
    const latestHits = weekHits.filter((h) => h.href === '/trends/tracker')
    expect(latestHits.length).toBe(1)
  })
})
