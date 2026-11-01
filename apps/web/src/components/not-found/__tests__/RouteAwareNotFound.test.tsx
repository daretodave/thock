import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { RouteAwareNotFound, matchEntityRoute } from '../RouteAwareNotFound'

let pathname = '/article/gateron-oil'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))
vi.mock('@/lib/search/suggestions', () => ({ getSuggestedArticles: vi.fn(async () => []) }))

const fallback = <h1>generic 404</h1>

describe('<RouteAwareNotFound>', () => {
  it('server-renders the fallback, never route-specific copy (no hydration mismatch)', () => {
    const html = renderToString(<RouteAwareNotFound fallback={fallback} />)
    expect(html).toContain('generic 404')
    expect(html).not.toContain('article')
  })

  it('swaps in article copy on the client', () => {
    pathname = '/article/gateron-oil'
    render(<RouteAwareNotFound fallback={fallback} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/that article doesn/i)
  })

  it('swaps in tag copy on the client', () => {
    pathname = '/tag/gateron-fake'
    render(<RouteAwareNotFound fallback={fallback} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/no tag with that name/i)
  })

  it('keeps the fallback for other routes', () => {
    pathname = '/vendor/nope'
    render(<RouteAwareNotFound fallback={fallback} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('generic 404')
  })
})

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
