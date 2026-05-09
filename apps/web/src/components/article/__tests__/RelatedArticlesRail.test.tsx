import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RelatedArticlesRail } from '../RelatedArticlesRail'
import type { Article } from '@thock/content'

const makeArticle = (slug: string, title: string): Article =>
  ({
    slug,
    body: '',
    readTime: 1,
    filePath: '/x',
    frontmatter: {
      slug,
      title,
      lede: 'lede',
      author: 'thock',
      pillar: 'news',
      tags: ['linear'],
      publishedAt: '2026-05-01T00:00:00Z',
      updatedAt: null,
      heroImage: null,
      heroImageAlt: null,
      featured: false,
      popularityScore: 0,
      guideSection: null,
      mentionedParts: [],
    },
  }) as unknown as Article

describe('<RelatedArticlesRail>', () => {
  it('renders one card per article (capped at 4)', () => {
    const articles = [
      makeArticle('a', 'A'),
      makeArticle('b', 'B'),
      makeArticle('c', 'C'),
      makeArticle('d', 'D'),
      makeArticle('e', 'E'),
    ]
    render(<RelatedArticlesRail articles={articles} />)
    const rail = screen.getByTestId('related-articles-rail')
    expect(rail.children).toHaveLength(4)
  })

  it('hides itself when there are zero related', () => {
    const { container } = render(<RelatedArticlesRail articles={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
