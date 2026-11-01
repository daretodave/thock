import { describe, expect, it } from 'vitest'
import { matchEntityRoute } from '../RouteAwareNotFound'

describe('matchEntityRoute', () => {
  it('matches /article/<slug>', () => {
    expect(matchEntityRoute('/article/gateron-oil')).toEqual({
      kind: 'article',
      slug: 'gateron-oil',
    })
  })
  it('matches /tag/<slug> with a trailing slash', () => {
    expect(matchEntityRoute('/tag/silent/')).toEqual({ kind: 'tag', slug: 'silent' })
  })
  it('falls through for other routes and deeper paths', () => {
    expect(matchEntityRoute('/vendor/nope')).toBeNull()
    expect(matchEntityRoute('/article')).toBeNull()
    expect(matchEntityRoute('/article/a/b')).toBeNull()
    expect(matchEntityRoute(null)).toBeNull()
  })
})
