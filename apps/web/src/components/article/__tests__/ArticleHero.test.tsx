import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleHero } from '../ArticleHero'

const baseProps = {
  pillar: 'news' as const,
  title: 'Why the Gateron Oil King sounds the way it does',
  lede: 'Few stock linears earn the word creamy on first press.',
  author: 'thock',
  publishedAt: '2026-05-04T15:00:00.000Z',
  readTime: 6,
  heroImage: null,
  heroImageAlt: null,
}

describe('<ArticleHero>', () => {
  it('renders the H1 title', () => {
    render(<ArticleHero {...baseProps} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(baseProps.title)
  })

  it('renders the eyebrow as a link to the pillar landing', () => {
    render(<ArticleHero {...baseProps} />)
    const eyebrow = screen.getByTestId('article-hero-eyebrow')
    const link = eyebrow.querySelector('a')
    expect(link).toHaveAttribute('href', '/news')
    expect(eyebrow).toHaveTextContent(/news/i)
  })

  it('renders the lede', () => {
    render(<ArticleHero {...baseProps} />)
    expect(screen.getByText(baseProps.lede)).toBeInTheDocument()
  })

  it('omits the hero image when heroImage is null', () => {
    render(<ArticleHero {...baseProps} />)
    expect(screen.queryByTestId('article-hero-image')).toBeNull()
  })

  it('renders the hero image when heroImage is set', () => {
    render(
      <ArticleHero
        {...baseProps}
        heroImage="https://example.com/h.jpg"
        heroImageAlt="A keyboard."
      />,
    )
    expect(screen.getByTestId('article-hero-image')).toBeInTheDocument()
  })
})
