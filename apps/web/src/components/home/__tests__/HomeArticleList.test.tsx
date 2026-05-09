import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeArticleList } from '../HomeArticleList'
import type { Article } from '@thock/content'

const article = (over: Partial<Article['frontmatter']> & { slug: string }): Article => ({
  slug: over.slug,
  body: 'body',
  readTime: 5,
  filePath: 'fake.mdx',
  frontmatter: {
    slug: over.slug,
    title: over.title ?? 'A title with at least four characters',
    lede: over.lede ?? 'A lede that satisfies the twenty-character minimum.',
    author: over.author ?? 'Reza Patel',
    pillar: over.pillar ?? 'guides',
    tags: over.tags ?? ['linear'],
    publishedAt: over.publishedAt ?? '2026-04-30T09:00:00.000Z',
    updatedAt: null,
    heroImage: null,
    heroImageAlt: null,
    featured: false,
    popularityScore: 0,
    guideSection: null,
    mentionedParts: [],
  },
})

describe('<HomeArticleList>', () => {
  it('renders one item per article', () => {
    const articles = [
      article({ slug: 'a', title: 'First post' }),
      article({ slug: 'b', title: 'Second post' }),
    ]
    const { getAllByRole } = render(<HomeArticleList articles={articles} />)
    expect(getAllByRole('link').length).toBe(2)
  })

  it('links each item to /article/<slug>', () => {
    const articles = [article({ slug: 'first-post', title: 'First post' })]
    render(<HomeArticleList articles={articles} />)
    const link = screen.getByRole('link', { name: /First post/ })
    expect(link).toHaveAttribute('href', '/article/first-post')
  })

  it('shows the pillar label and read-time', () => {
    const articles = [
      article({ slug: 'a-piece', pillar: 'deep-dives', title: 'Deep dive piece' }),
    ]
    render(<HomeArticleList articles={articles} />)
    expect(screen.getByText('Deep Dive')).toBeInTheDocument()
    expect(screen.getByText(/5 min read/)).toBeInTheDocument()
  })
})
