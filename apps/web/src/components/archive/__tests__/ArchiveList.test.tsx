import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArchiveList } from '../ArchiveList'
import { makeArticle } from '@/components/home/__tests__/testFixtures'
import { groupArticlesByMonth } from '../archiveUtils'

const DEFAULT_FM = makeArticle().frontmatter

describe('ArchiveList', () => {
  it('renders empty state when no groups provided', () => {
    render(<ArchiveList groups={[]} />)
    expect(screen.getByText(/no articles yet/i)).toBeInTheDocument()
  })

  it('renders a month heading for each group', () => {
    const articles = [
      makeArticle({ slug: 'a', frontmatter: { ...DEFAULT_FM, slug: 'a', publishedAt: '2026-05-10T00:00:00.000Z' } }),
      makeArticle({ slug: 'b', frontmatter: { ...DEFAULT_FM, slug: 'b', publishedAt: '2026-04-10T00:00:00.000Z' } }),
    ]
    const groups = groupArticlesByMonth(articles)
    render(<ArchiveList groups={groups} />)
    const headings = screen.getAllByTestId('archive-month-heading')
    expect(headings).toHaveLength(2)
    expect(headings[0]).toHaveTextContent('May 2026')
    expect(headings[1]).toHaveTextContent('April 2026')
  })

  it('renders article links with correct href and title', () => {
    const articles = [
      makeArticle({
        slug: 'test-slug',
        frontmatter: {
          ...DEFAULT_FM,
          slug: 'test-slug',
          title: 'Test Article',
          publishedAt: '2026-05-10T00:00:00.000Z',
        },
      }),
    ]
    const groups = groupArticlesByMonth(articles)
    render(<ArchiveList groups={groups} />)
    const link = screen.getByTestId('archive-article-link')
    expect(link).toHaveAttribute('href', '/article/test-slug')
    expect(link).toHaveTextContent('Test Article')
  })
})
