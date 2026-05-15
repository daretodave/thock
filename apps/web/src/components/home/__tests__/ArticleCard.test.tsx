import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ArticleCard } from '../ArticleCard'
import { makeArticle, makeTag } from './testFixtures'

const TAGS = new Map([['linear', makeTag()]])

describe('<ArticleCard>', () => {
  it('hero variant renders an h1 with the article title', () => {
    const article = makeArticle({
      frontmatter: {
        ...makeArticle().frontmatter,
        title: 'Hero pick title',
      },
    })
    render(<ArticleCard article={article} variant="hero" tagsBySlug={TAGS} />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Hero pick title')
  })

  it('hero variant uses a placeholder when heroImage is null', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="hero" tagsBySlug={TAGS} />)
    expect(screen.getByTestId('article-card-placeholder')).toBeInTheDocument()
  })

  it('hero variant links to the article path', () => {
    const article = makeArticle({ slug: 'foo' })
    article.frontmatter.slug = 'foo'
    render(<ArticleCard article={article} variant="hero" tagsBySlug={TAGS} />)
    const card = screen.getByTestId('hero-card')
    expect(card.getAttribute('href')).toBe('/article/foo')
  })

  it('hero variant does not render tag chips (density-parity with archive rows)', () => {
    const article = makeArticle()
    article.frontmatter.tags = ['linear', 'gateron', 'vendor']
    render(<ArticleCard article={article} variant="hero" tagsBySlug={TAGS} />)
    expect(screen.queryByTestId('tag-chip')).toBeNull()
  })

  it('large variant renders an h3 not an h1', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="large" tagsBySlug={TAGS} />)
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull()
    const h3 = screen.getByRole('heading', { level: 3 })
    expect(h3).toBeInTheDocument()
  })

  it('row variant renders as a horizontal card with the row testid', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="row" tagsBySlug={TAGS} />)
    expect(screen.getByTestId('article-card-row')).toBeInTheDocument()
  })

  it('compact variant omits images and lede entirely', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="compact" tagsBySlug={TAGS} />)
    expect(screen.getByTestId('article-card-compact')).toBeInTheDocument()
    expect(screen.queryByTestId('article-card-placeholder')).toBeNull()
  })

  it('compact variant date uses text-text-2 not text-text-3 (WCAG AA contrast guard)', () => {
    const article = makeArticle()
    render(<ArticleCard article={article} variant="compact" tagsBySlug={TAGS} />)
    const dateEl = screen.getByTestId('article-card-compact-date')
    expect(dateEl.className).toContain('text-text-2')
    expect(dateEl.className).not.toContain('text-text-3')
  })
})
