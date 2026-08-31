import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import { SuggestedArticles, pathnameToSlug } from '../SuggestedArticles'
import { getSuggestedArticles } from '@/lib/search/suggestions'

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
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing immediately after mount, before the skeleton delay elapses', async () => {
    render(<SuggestedArticles slug="gateron-oil-king" />)
    expect(screen.queryByTestId('not-found-suggestions')).not.toBeInTheDocument()
    // Let the mocked lookup's microtask settle before the test ends, so its
    // state update lands inside this test's act() scope instead of leaking
    // a warning into whichever test runs next.
    await waitFor(() =>
      expect(screen.getByTestId('not-found-suggestion')).toBeInTheDocument(),
    )
  })

  it('shows a skeleton only once the lookup outlasts the flash-guard delay', async () => {
    vi.useFakeTimers()
    let resolveHits: (hits: (typeof FAKE_HIT)[]) => void = () => {}
    vi.mocked(getSuggestedArticles).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveHits = resolve
      }),
    )
    render(<SuggestedArticles slug="gateron-oil-king" />)
    expect(screen.queryByTestId('not-found-suggestions')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId('not-found-suggestions')).toBeInTheDocument()
    expect(screen.queryByTestId('not-found-suggestion')).not.toBeInTheDocument()

    await act(async () => {
      resolveHits([FAKE_HIT])
      await Promise.resolve()
    })
    vi.useRealTimers()
  })

  it('never flashes a skeleton for a resolution that lands before the delay (the common empty-hit path)', async () => {
    render(<SuggestedArticles slug="zzzzz-no-match" />)
    expect(screen.queryByTestId('not-found-suggestions')).not.toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByTestId('not-found-suggestions')).not.toBeInTheDocument(),
    )
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
