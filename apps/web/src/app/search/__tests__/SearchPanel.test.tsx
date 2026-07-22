import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import type { Tag } from '@thock/content'
import { SearchPanel } from '../SearchPanel'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => ({ get: (_key: string) => null })),
}))

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
  })

  it('shows the empty-query hint when no query is present', () => {
    render(<SearchPanel allTags={ALL_TAGS} />)
    expect(screen.getByTestId('search-empty-query')).toBeInTheDocument()
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })

  it('shows search results after debounce when searchArticles returns hits', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([FAKE_HIT])

    render(<SearchPanel allTags={ALL_TAGS} />)
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

  it('announces the empty-query hint as blank in the aria-live region', () => {
    render(<SearchPanel allTags={ALL_TAGS} />)
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('announces result count in the aria-live region after debounce', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([FAKE_HIT])

    render(<SearchPanel allTags={ALL_TAGS} />)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'oil king' } })

    act(() => { vi.advanceTimersByTime(120) })

    expect(screen.getByRole('status')).toHaveTextContent('1 result for "oil king"')
  })

  it('announces no-matches in the aria-live region for a non-matching query', async () => {
    const { searchArticles } = await import('@/lib/search/runtime')
    vi.mocked(searchArticles).mockReturnValue([])

    render(<SearchPanel allTags={ALL_TAGS} />)
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

    act(() => { vi.advanceTimersByTime(120) })

    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('gateron')
    expect(screen.getByTestId('search-results')).toBeInTheDocument()
  })
})
