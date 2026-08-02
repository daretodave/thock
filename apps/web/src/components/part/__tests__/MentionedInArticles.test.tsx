import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MentionedInArticles } from '../MentionedInArticles'
import type { Article } from '@thock/content'

const FAKE_ARTICLE = {
  slug: 'gateron-oil-king-deep-dive',
  body: '',
  readTime: 8,
  filePath: '/tmp/gateron-oil-king-deep-dive.mdx',
  frontmatter: {
    slug: 'gateron-oil-king-deep-dive',
    title: 'The Gateron Oil King, taken apart',
    author: 'thock',
    pillar: 'deep-dives',
    publishedAt: '2026-04-30T09:00:00.000Z',
    updatedAt: null,
    tags: ['gateron'],
    lede: 'A 67g linear that everyone reaches for when they want a wet, factory-lubed sound profile out of the bag.',
    description: null,
    featured: false,
    popularityScore: 0,
    guideSection: null,
    mentionedParts: [],
    heroImage: null,
    heroImageAlt: null,
  },
} as unknown as Article

describe('<MentionedInArticles>', () => {
  it('renders a row card per article when articles exist', () => {
    render(
      <MentionedInArticles
        partName="Gateron Oil King"
        articles={[FAKE_ARTICLE]}
      />,
    )
    const list = screen.getByTestId('part-mentioned-list')
    expect(list.children.length).toBeGreaterThanOrEqual(1)
    expect(list).toHaveTextContent(/Gateron Oil King, taken apart/i)
    expect(screen.getByTestId('article-card-meta')).toHaveTextContent(
      /thock.*8 min read/i,
    )
  })

  it('renders the empty-state when no articles cite the part', () => {
    render(
      <MentionedInArticles
        partName="Akko V3 Cream Blue Pro"
        articles={[]}
      />,
    )
    expect(screen.getByTestId('part-mentioned-empty')).toHaveTextContent(
      /Not yet mentioned in any article/i,
    )
  })

  it('uses singular vs plural noun in the heading', () => {
    const { rerender } = render(
      <MentionedInArticles
        partName="Gateron Oil King"
        articles={[FAKE_ARTICLE]}
      />,
    )
    expect(screen.getByText(/Mentioned in 1 article$/i)).toBeInTheDocument()

    rerender(
      <MentionedInArticles
        partName="Gateron Oil King"
        articles={[FAKE_ARTICLE, { ...FAKE_ARTICLE, slug: 'a2' } as Article]}
      />,
    )
    expect(screen.getByText(/Mentioned in 2 articles$/i)).toBeInTheDocument()
  })
})
