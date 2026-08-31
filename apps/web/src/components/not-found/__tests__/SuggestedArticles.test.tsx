import { describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SuggestedArticles, pathnameToSlug } from '../SuggestedArticles'

const FAKE_HIT = {
  id: 'gateron-oil-king-deep-dive',
  slug: 'gateron-oil-king-deep-dive',
  title: 'Gateron Oil King: deep dive',
  pillar: 'deep-dives' as const,
  publishedAt: '2026-04-10',
}

vi.mock('@/lib/search/suggestions', () => ({
  getSuggestedArticles: vi.fn(async (query: string) =>
    query === 'gateron oil king' ? [FAKE_HIT] : [],
  ),
}))

describe('<SuggestedArticles>', () => {
  it('renders a skeleton (no data-testid results) while the lookup is in flight', () => {
    render(<SuggestedArticles slug="gateron-oil-king" />)
    expect(screen.getByTestId('not-found-suggestions')).toBeInTheDocument()
    expect(screen.queryByTestId('not-found-suggestion')).not.toBeInTheDocument()
  })

  it('announces arrival via the aria-live status region once hits resolve', async () => {
    render(<SuggestedArticles slug="gateron-oil-king" />)
    await waitFor(() =>
      expect(screen.getByTestId('not-found-suggestion')).toBeInTheDocument(),
    )
    expect(screen.getByRole('status')).toHaveTextContent(
      '1 suggested article found',
    )
  })

  it('renders nothing once the lookup resolves with no hits', async () => {
    const { container } = render(<SuggestedArticles slug="zzzzz-no-match" />)
    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })

  it('renders nothing for an empty slug', () => {
    const { container } = render(<SuggestedArticles slug="" />)
    expect(container).toBeEmptyDOMElement()
  })
})

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
