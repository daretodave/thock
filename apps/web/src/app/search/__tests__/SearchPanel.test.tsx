import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { Tag } from '@thock/content'
import { SearchPanel } from '../SearchPanel'

const mockRouterReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({ get: (_key: string) => null })),
  useRouter: vi.fn(() => ({ replace: mockRouterReplace })),
}))

// A router.replace stub that actually updates what useSearchParams()
// returns, mirroring real App Router behavior (the committed mocks above
// stay static after replace, which can't reproduce a self-triggered
// URL round-trip clobbering live state).
function mockReflectiveRouter() {
  let currentQ: string | null = null
  return {
    replace: vi.fn((url: string) => {
      const match = /[?&]q=([^&]*)/.exec(url)
      currentQ = match?.[1] ? decodeURIComponent(match[1]) : null
    }),
    getQ: () => currentQ,
  }
}

vi.mock('@/lib/search/runtime', () => ({
  searchArticles: vi.fn(() => []),
  searchParts: vi.fn(() => []),
}))

const ALL_TAGS: Tag[] = [
  { slug: 'linear', name: 'linear', category: 'switch' },
  { slug: 'tactile', name: 'tactile', category: 'switch' },
]

const FAKE_HIT = {
  id: 'gateron-oil-king-deep-dive',
  slug: 'gateron-oil-king-deep-dive',
  title: 'Gateron Oil King: deep dive',
  lede: 'Everything about the Oil King.',
  pillar: 'deep-dives' as const,
  tags: ['linear', 'gateron'],
  publishedAt: '2026-04-10',
  score: 8.5,
}

describe('<SearchPanel>', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the empty-query hint when no query is present', async () => {
    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    expect(screen.getByTestId('search-empty-query')).toBeInTheDocument()
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })

  it('shows search results after debounce when searchArticles returns hits', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([FAKE_HIT])

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'oil king' } })

    act(() => { vi.advanceTimersByTime(120) })

    expect(screen.getByTestId('search-results')).toBeInTheDocument()
    expect(screen.queryByTestId('search-empty-query')).not.toBeInTheDocument()
    expect(screen.queryByTestId('search-no-results')).not.toBeInTheDocument()
  })

  it('shows no-results state with five pillar fallback links for a non-matching query', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([])

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'zzznomatch' } })

    act(() => { vi.advanceTimersByTime(120) })

    // Stack component doesn't forward data-testid; assert by text content instead.
    // The aria-live status region also contains this phrase, so scope to the visible <p>.
    expect(screen.getByText(/no matches for/i, { selector: 'p' })).toBeInTheDocument()
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
    expect(screen.queryByTestId('search-empty-query')).not.toBeInTheDocument()

    const links = screen.getAllByRole('link')
    const hrefs = links.map((l) => l.getAttribute('href'))
    expect(hrefs).toContain('/news')
    expect(hrefs).toContain('/trends')
    expect(hrefs).toContain('/ideas')
    expect(hrefs).toContain('/deep-dives')
    expect(hrefs).toContain('/guides')
  })

  it('announces the empty-query hint as blank in the aria-live region', async () => {
    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('announces result count in the aria-live region after debounce', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([FAKE_HIT])

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'oil king' } })

    act(() => { vi.advanceTimersByTime(120) })

    expect(screen.getByRole('status')).toHaveTextContent('1 result for "oil king"')
  })

  it('announces no-matches in the aria-live region for a non-matching query', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([])

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'zzznomatch' } })

    act(() => { vi.advanceTimersByTime(120) })

    expect(screen.getByRole('status')).toHaveTextContent('No matches for "zzznomatch"')
  })

  it('pre-populates the input from the ?q= URL param on mount', async () => {
    const { useSearchParams } = await import('next/navigation')
    vi.mocked(useSearchParams).mockReturnValue({ get: (key: string) => (key === 'q' ? 'gateron' : null) } as ReturnType<typeof useSearchParams>)

    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([FAKE_HIT])

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module

    act(() => { vi.advanceTimersByTime(120) })

    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('gateron')
    expect(screen.getByTestId('search-results')).toBeInTheDocument()
  })

  it('writes the debounced query back to the URL so refresh/back/share all restore it', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([FAKE_HIT])

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'oil king' } })

    act(() => { vi.advanceTimersByTime(120) })

    expect(mockRouterReplace).toHaveBeenCalledWith('/search?q=oil%20king', { scroll: false })
  })

  it('replaces the URL back to the bare path when the query is cleared', async () => {
    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'oil king' } })
    act(() => { vi.advanceTimersByTime(120) })
    fireEvent.change(input, { target: { value: '' } })
    act(() => { vi.advanceTimersByTime(120) })

    expect(mockRouterReplace).toHaveBeenLastCalledWith('/search', { scroll: false })
  })

  it('does not strip a trailing space mid-typing when the URL round-trip reflects the trimmed query back', async () => {
    const { useRouter, useSearchParams } = await import('next/navigation')
    const reflective = mockReflectiveRouter()
    vi.mocked(useRouter).mockReturnValue(reflective as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useSearchParams).mockImplementation(
      () => ({ get: (key: string) => (key === 'q' ? reflective.getQ() : null) }) as ReturnType<typeof useSearchParams>,
    )

    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([])

    const { rerender } = render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module

    const input = screen.getByRole('searchbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'gateron' } })
    act(() => { vi.advanceTimersByTime(120) })
    expect(reflective.getQ()).toBe('gateron')

    // Re-render so the component observes the reflected (trimmed) urlQ,
    // mimicking a real App Router re-render after router.replace() lands.
    rerender(<SearchPanel allTags={ALL_TAGS} />)

    // The reader keeps typing a trailing space before the next word settles.
    fireEvent.change(input, { target: { value: 'gateron ' } })
    expect(input.value).toBe('gateron ')

    act(() => { vi.advanceTimersByTime(120) }) // debounce → URL-sync effect fires, trims to 'gateron'
    rerender(<SearchPanel allTags={ALL_TAGS} />) // observe the reflected urlQ

    expect(input.value).toBe('gateron ')
  })

  it('autofocuses the input on a fine-pointer (desktop) visit', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module

    expect(document.activeElement).toBe(screen.getByRole('searchbox'))
  })

  it('does not steal focus on a coarse-pointer (touch) visit', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))

    render(<SearchPanel allTags={ALL_TAGS} />)
    await act(async () => {}) // flush the dynamic import of the runtime module

    expect(document.activeElement).not.toBe(screen.getByRole('searchbox'))
  })
})
