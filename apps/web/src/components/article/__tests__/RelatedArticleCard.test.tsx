import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RelatedArticleCard } from '../RelatedArticleCard'
import type { Article } from '@thock/content'

const ARTICLE: Article = {
  slug: 'my-article',
  body: '',
  readTime: 3,
  filePath: '/x',
  frontmatter: {
    slug: 'my-article',
    title: 'A great article about switches',
    lede: 'This is the lede paragraph for the article.',
    author: 'thock',
    pillar: 'news',
    tags: ['linear'],
    publishedAt: '2026-05-01T00:00:00.000Z',
    updatedAt: null,
    heroImage: null,
    heroImageAlt: null,
    featured: false,
    popularityScore: 0,
    guideSection: null,
    mentionedParts: [],
  },
} as unknown as Article

describe('<RelatedArticleCard>', () => {
  it('renders with data-testid="related-article-card"', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(screen.getByTestId('related-article-card')).toBeInTheDocument()
  })

  it('links to /article/<slug>', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(screen.getByTestId('related-article-card')).toHaveAttribute(
      'href',
      '/article/my-article',
    )
  })

  it('renders the pillar label eyebrow via pillarLabel()', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(screen.getByText('News')).toBeInTheDocument()
  })

  it('renders the article title as an h3', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(
      screen.getByRole('heading', { level: 3, name: /A great article about switches/i }),
    ).toBeInTheDocument()
  })

  it('renders the lede text', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(
      screen.getByText('This is the lede paragraph for the article.'),
    ).toBeInTheDocument()
  })

  it('renders a <time> with the correct dateTime attribute', () => {
    const { container } = render(<RelatedArticleCard article={ARTICLE} />)
    const time = container.querySelector('time')
    expect(time).not.toBeNull()
    expect(time?.getAttribute('dateTime')).toBe('2026-05-01T00:00:00.000Z')
  })

  it('renders the formatted publish date', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(screen.getByText('May 1, 2026')).toBeInTheDocument()
  })

  it('renders the author name', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(screen.getByText('thock')).toBeInTheDocument()
  })

  it('renders the read time', () => {
    render(<RelatedArticleCard article={ARTICLE} />)
    expect(screen.getByText('3 min read')).toBeInTheDocument()
  })
})
