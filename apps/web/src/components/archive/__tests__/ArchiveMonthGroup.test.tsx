import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArchiveMonthGroup } from '../ArchiveMonthGroup'
import { makeArticle } from '@/components/home/__tests__/testFixtures'

const DEFAULT_FM = makeArticle().frontmatter

function makeGroup(
  key: string,
  label: string,
  articles: ReturnType<typeof makeArticle>[],
) {
  return { key, label, articles }
}

describe('ArchiveMonthGroup', () => {
  it('renders the month heading and article count', () => {
    const articles = [
      makeArticle({ slug: 'a', frontmatter: { ...DEFAULT_FM, slug: 'a' } }),
      makeArticle({ slug: 'b', frontmatter: { ...DEFAULT_FM, slug: 'b' } }),
    ]
    const group = makeGroup('2026-05', 'May 2026', articles)
    render(<ArchiveMonthGroup group={group} />)
    expect(screen.getByTestId('archive-month-heading')).toHaveTextContent('May 2026')
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders article links with correct href and title', () => {
    const articles = [
      makeArticle({
        slug: 'switch-deep-dive',
        frontmatter: {
          ...DEFAULT_FM,
          slug: 'switch-deep-dive',
          title: 'Switch Deep Dive',
        },
      }),
    ]
    const group = makeGroup('2026-05', 'May 2026', articles)
    render(<ArchiveMonthGroup group={group} />)
    const link = screen.getByTestId('archive-article-link')
    expect(link).toHaveAttribute('href', '/article/switch-deep-dive')
    expect(link).toHaveTextContent('Switch Deep Dive')
  })

  it('shows the pillar label in the article row', () => {
    const articles = [
      makeArticle({
        slug: 'c',
        frontmatter: { ...DEFAULT_FM, slug: 'c', pillar: 'deep-dives' },
      }),
    ]
    const group = makeGroup('2026-05', 'May 2026', articles)
    render(<ArchiveMonthGroup group={group} />)
    expect(screen.getByTestId('archive-article-link')).toHaveTextContent('Deep Dives')
  })

  it('falls back to raw pillar slug for unknown pillars', () => {
    const articles = [
      makeArticle({
        slug: 'd',
        frontmatter: { ...DEFAULT_FM, slug: 'd', pillar: 'unknown-pillar' as never },
      }),
    ]
    const group = makeGroup('2026-05', 'May 2026', articles)
    render(<ArchiveMonthGroup group={group} />)
    expect(screen.getByTestId('archive-article-link')).toHaveTextContent('unknown-pillar')
  })

  it('uses data-testid keyed to the month for the section', () => {
    const group = makeGroup('2026-04', 'April 2026', [
      makeArticle({ slug: 'e', frontmatter: { ...DEFAULT_FM, slug: 'e' } }),
    ])
    render(<ArchiveMonthGroup group={group} />)
    expect(screen.getByTestId('archive-month-group-2026-04')).toBeInTheDocument()
  })
})
