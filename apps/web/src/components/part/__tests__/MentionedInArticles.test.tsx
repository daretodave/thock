import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MentionedInArticles } from '../MentionedInArticles'
import type { Article, Tag } from '@thock/content'

const FAKE_TAGS: Map<string, Tag> = new Map([
  [
    'gateron',
    {
      slug: 'gateron',
      name: 'Gateron',
      category: 'brand',
    } as Tag,
  ],
])

const FAKE_ARTICLE = {
  slug: 'gateron-oil-king-deep-dive',
  pillar: 'deep-dives',
  body: '',
  wordCount: 1500,
  readingTimeMinutes: 8,
  frontmatter: {
    title: 'The Gateron Oil King, taken apart',
    pillar: 'deep-dives',
    publishedAt: '2026-04-30T09:00:00.000Z',
    tags: ['gateron'],
    lede: 'A 67g linear that everyone reaches for when they want a wet, factory-lubed sound profile out of the bag.',
    mentionedParts: [],
    heroImage: null,
    heroImageAlt: null,
    sources: [],
  },
} as unknown as Article

describe('<MentionedInArticles>', () => {
  it('renders a row card per article when articles exist', () => {
    render(
      <MentionedInArticles
        partName="Gateron Oil King"
        articles={[FAKE_ARTICLE]}
        tagsBySlug={FAKE_TAGS}
      />,
    )
    const list = screen.getByTestId('part-mentioned-list')
    expect(list.children.length).toBeGreaterThanOrEqual(1)
    expect(list).toHaveTextContent(/Gateron Oil King, taken apart/i)
  })

  it('renders the empty-state when no articles cite the part', () => {
    render(
      <MentionedInArticles
        partName="Akko V3 Cream Blue Pro"
        articles={[]}
        tagsBySlug={FAKE_TAGS}
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
        tagsBySlug={FAKE_TAGS}
      />,
    )
    expect(screen.getByText(/Mentioned in 1 article$/i)).toBeInTheDocument()

    rerender(
      <MentionedInArticles
        partName="Gateron Oil King"
        articles={[FAKE_ARTICLE, { ...FAKE_ARTICLE, slug: 'a2' } as Article]}
        tagsBySlug={FAKE_TAGS}
      />,
    )
    expect(screen.getByText(/Mentioned in 2 articles$/i)).toBeInTheDocument()
  })
})
