import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleResult } from '../ArticleResult'
import type { SearchHit } from '@/lib/search/runtime'
import type { Tag } from '@thock/content'

function makeHit(over: Partial<SearchHit> = {}): SearchHit {
  return {
    id: 'a',
    slug: 'gateron-oil-king-deep-dive',
    title: 'The Gateron Oil King deep dive',
    lede: 'Why this switch resonates.',
    pillar: 'deep-dives',
    tags: ['linear', 'gateron'],
    publishedAt: '2026-04-15T00:00:00.000Z',
    score: 4.567,
    ...over,
  }
}

function makeTagMap(entries: [string, Partial<Tag>][] = []): Map<string, Tag> {
  const base: Map<string, Tag> = new Map()
  for (const [slug, over] of entries) {
    base.set(slug, { slug, name: slug, category: 'misc', ...over })
  }
  return base
}

describe('<ArticleResult>', () => {
  it('renders the search-result testid', () => {
    render(<ArticleResult hit={makeHit()} />)
    expect(screen.getByTestId('search-result')).toBeInTheDocument()
  })

  it('sets data-slug from hit.slug', () => {
    render(<ArticleResult hit={makeHit({ slug: 'test-slug' })} />)
    expect(screen.getByTestId('search-result').getAttribute('data-slug')).toBe('test-slug')
  })

  it('sets data-score to hit.score fixed to 3 decimal places', () => {
    render(<ArticleResult hit={makeHit({ score: 3.14159 })} />)
    expect(screen.getByTestId('search-result').getAttribute('data-score')).toBe('3.142')
  })

  it('renders the pillar eyebrow via pillarLabel()', () => {
    render(<ArticleResult hit={makeHit({ pillar: 'deep-dives' })} />)
    expect(screen.getByTestId('search-result-eyebrow')).toHaveTextContent('Deep Dives')
  })

  it('renders the date as the first 10 chars of publishedAt', () => {
    render(<ArticleResult hit={makeHit({ publishedAt: '2026-04-15T00:00:00.000Z' })} />)
    expect(screen.getByTestId('search-result-date')).toHaveTextContent('2026-04-15')
  })

  it('renders the title in an h2 linking to /article/[slug]', () => {
    render(<ArticleResult hit={makeHit({ slug: 'my-article', title: 'My Article Title' })} />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('My Article Title')
    const link = heading.querySelector('a')
    expect(link?.getAttribute('href')).toBe('/article/my-article')
  })

  it('renders the lede paragraph', () => {
    render(<ArticleResult hit={makeHit({ lede: 'A distinctive lede sentence.' })} />)
    expect(screen.getByText('A distinctive lede sentence.')).toBeInTheDocument()
  })

  it('renders tag chips for each tag in hit.tags (up to 6)', () => {
    const tags = makeTagMap([
      ['linear', { name: 'Linear', category: 'switch' }],
      ['gateron', { name: 'Gateron', category: 'brand' }],
    ])
    render(<ArticleResult hit={makeHit({ tags: ['linear', 'gateron'] })} tagsBySlug={tags} />)
    const chips = screen.getAllByTestId('tag-chip')
    expect(chips).toHaveLength(2)
  })

  it('does not render any tag chips when hit.tags is empty', () => {
    render(<ArticleResult hit={makeHit({ tags: [] })} />)
    expect(screen.queryByTestId('tag-chip')).toBeNull()
  })

  it('truncates tag chips to a maximum of 6', () => {
    const slugs = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8']
    const tags = makeTagMap(slugs.map(s => [s, { name: s, category: 'misc' as const }]))
    render(<ArticleResult hit={makeHit({ tags: slugs })} tagsBySlug={tags} />)
    expect(screen.getAllByTestId('tag-chip')).toHaveLength(6)
  })
})
