import { describe, expect, it } from 'vitest'
import { pathnameToSlug } from '../SuggestedArticles'

describe('pathnameToSlug', () => {
  it('extracts the trailing segment from /article/<slug>', () => {
    expect(pathnameToSlug('/article/gateron-oil-king-deep-dive')).toBe(
      'gateron-oil-king-deep-dive',
    )
  })

  it('extracts the trailing segment from /tag/<slug>', () => {
    expect(pathnameToSlug('/tag/silent')).toBe('silent')
  })

  it('returns empty string for null pathname (header missing)', () => {
    expect(pathnameToSlug(null)).toBe('')
  })

  it('returns empty string for root path', () => {
    expect(pathnameToSlug('/')).toBe('')
  })

  it('handles trailing slash gracefully', () => {
    expect(pathnameToSlug('/article/foo/')).toBe('foo')
  })
})
