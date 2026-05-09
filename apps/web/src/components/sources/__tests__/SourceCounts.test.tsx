import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import { SourceCounts, type ArticleSourceCount } from '../SourceCounts'

function fixture(over: Partial<Article['frontmatter']> = {}): Article {
  const slug = over.slug ?? 'sample'
  return {
    slug,
    frontmatter: {
      slug,
      title: 'Sample article',
      lede: 'A lede long enough to satisfy the schema minimum length.',
      author: 'thock',
      pillar: 'news',
      tags: ['group-buy'],
      publishedAt: '2026-05-01T00:00:00.000Z',
      updatedAt: null,
      heroImage: null,
      heroImageAlt: null,
      featured: false,
      popularityScore: 0,
      guideSection: null,
      mentionedParts: [],
      ...over,
    },
    body: 'Body',
    readTime: 1,
    filePath: `/fake/${slug}.mdx`,
  }
}

describe('<SourceCounts>', () => {
  it('renders the empty state when no article is cited', () => {
    render(<SourceCounts rows={[]} />)
    expect(screen.getByTestId('source-counts-empty')).toBeInTheDocument()
    expect(screen.getByText(/no cited articles yet/i)).toBeInTheDocument()
  })

  it('omits articles with sourceCount = 0 from the populated list', () => {
    const rows: ArticleSourceCount[] = [
      { article: fixture({ slug: 'a', title: 'Cited piece' }), sourceCount: 3 },
      { article: fixture({ slug: 'b', title: 'Uncited piece' }), sourceCount: 0 },
    ]
    render(<SourceCounts rows={rows} />)
    expect(screen.getByText('Cited piece')).toBeInTheDocument()
    expect(screen.queryByText('Uncited piece')).not.toBeInTheDocument()
  })

  it('groups rows by pillar and labels each section', () => {
    const rows: ArticleSourceCount[] = [
      {
        article: fixture({ slug: 'n', title: 'News piece', pillar: 'news' }),
        sourceCount: 1,
      },
      {
        article: fixture({
          slug: 't',
          title: 'Trends piece',
          pillar: 'trends',
        }),
        sourceCount: 2,
      },
    ]
    render(<SourceCounts rows={rows} />)
    expect(screen.getByTestId('source-counts-section-news')).toBeInTheDocument()
    expect(
      screen.getByTestId('source-counts-section-trends'),
    ).toBeInTheDocument()
  })

  it('renders cite count with correct singular/plural form', () => {
    const rows: ArticleSourceCount[] = [
      { article: fixture({ slug: 'a', title: 'Single' }), sourceCount: 1 },
      { article: fixture({ slug: 'b', title: 'Multi' }), sourceCount: 4 },
    ]
    render(<SourceCounts rows={rows} />)
    expect(screen.getByText(/^1 cite$/i)).toBeInTheDocument()
    expect(screen.getByText(/^4 cites$/i)).toBeInTheDocument()
  })

  it('renders each row as a link to /article/<slug>', () => {
    const rows: ArticleSourceCount[] = [
      {
        article: fixture({ slug: 'oil-king-deep-dive', title: 'Oil Kings' }),
        sourceCount: 2,
      },
    ]
    render(<SourceCounts rows={rows} />)
    const link = screen.getByRole('link', { name: /oil kings/i })
    expect(link).toHaveAttribute('href', '/article/oil-king-deep-dive')
  })
})
