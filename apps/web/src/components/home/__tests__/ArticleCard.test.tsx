import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from '../ArticleCard'
import { makeArticle } from './testFixtures'

describe('<ArticleCard>', () => {
  it('hero variant renders an h1 with the article title', () => {
    const article = makeArticle({
      frontmatter: {
        ...makeArticle().frontmatter,
        title: 'Hero pick title',
      },
    })
    render(<ArticleCard article={article} variant="hero" />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Hero pick title')
  })

  it('hero variant renders an h2 when titleAs="h2" (pillar pages already have an H1)', () => {
    const article = makeArticle({
      frontmatter: {
        ...makeArticle().frontmatter,
        title: 'Pillar lead title',
      },
    })
    render(<ArticleCard article={article} variant="hero" titleAs="h2" />)
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
    const h2 = screen.getByRole('heading', { level: 2 })
    expect(h2).toHaveTextContent('Pillar lead title')
  })

  it('hero variant uses a placeholder when heroImage is null', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="hero" />)
    expect(screen.getByTestId('article-card-placeholder')).toBeInTheDocument()
  })

  it('hero variant defaults to priority-loading its image (LCP candidate)', () => {
    const article = makeArticle({
      frontmatter: { ...makeArticle().frontmatter, heroImage: '/hero-art/a.svg' },
    })
    const { container } = render(<ArticleCard article={article} variant="hero" />)
    const img = container.querySelector('img')
    expect(img).not.toHaveAttribute('loading', 'lazy')
  })

  it('hero variant lazy-loads its image when priority={false} (a second same-page hero card is never the LCP element)', () => {
    const article = makeArticle({
      frontmatter: { ...makeArticle().frontmatter, heroImage: '/hero-art/a.svg' },
    })
    const { container } = render(
      <ArticleCard article={article} variant="hero" priority={false} />,
    )
    const img = container.querySelector('img')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('hero variant links to the article path', () => {
    const article = makeArticle({ slug: 'foo' })
    article.frontmatter.slug = 'foo'
    render(<ArticleCard article={article} variant="hero" />)
    const card = screen.getByTestId('hero-card')
    expect(card.getAttribute('href')).toBe('/article/foo')
  })

  it('hero variant does not render tag chips (density-parity with archive rows)', () => {
    const article = makeArticle()
    article.frontmatter.tags = ['linear', 'gateron', 'vendor']
    render(<ArticleCard article={article} variant="hero" />)
    expect(screen.queryByTestId('tag-chip')).toBeNull()
  })

  it('large variant renders an h3 not an h1', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="large" />)
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toBeInTheDocument()
  })

  it('row variant renders as a horizontal card with the row testid', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="row" />)
    expect(screen.getByTestId('article-card-row')).toBeInTheDocument()
  })

  it('compact variant omits images and lede entirely', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="compact" />)
    expect(screen.getByTestId('article-card-compact')).toBeInTheDocument()
    expect(screen.queryByTestId('article-card-placeholder')).toBeNull()
  })

  it('compact variant date uses text-text-2 not text-text-3 (WCAG AA contrast guard)', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="compact" />)
    const dateEl = screen.getByTestId('article-card-compact-date')
    expect(dateEl.className).toContain('text-text-2')
    expect(dateEl.className).not.toContain('text-text-3')
  })
})
