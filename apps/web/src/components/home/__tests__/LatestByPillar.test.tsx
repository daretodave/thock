import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LatestByPillar, resolveLatestByPillar } from '../LatestByPillar'
import { makeArticle } from './testFixtures'

describe('resolveLatestByPillar', () => {
  it('returns one article per pillar in the configured order (5 pillars including ideas)', () => {
    const news = makeArticle({
      slug: 'news-1',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'news-1',
        pillar: 'news',
        publishedAt: '2026-05-08T00:00:00.000Z',
      },
    })
    const trends = makeArticle({
      slug: 'trends-1',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'trends-1',
        pillar: 'trends',
        publishedAt: '2026-05-07T00:00:00.000Z',
      },
    })
    const ideas = makeArticle({
      slug: 'ideas-1',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'ideas-1',
        pillar: 'ideas',
        publishedAt: '2026-05-06T12:00:00.000Z',
      },
    })
    const deep = makeArticle({
      slug: 'deep-1',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'deep-1',
        pillar: 'deep-dives',
        publishedAt: '2026-05-06T00:00:00.000Z',
      },
    })
    const guides = makeArticle({
      slug: 'guides-1',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'guides-1',
        pillar: 'guides',
        publishedAt: '2026-05-05T00:00:00.000Z',
      },
    })
    const picks = resolveLatestByPillar([trends, news, guides, deep, ideas])
    // Regression guard for /critique pass 3: header advertises 5 pillars,
    // by-pillar grid was rendering 4. Ideas must appear in the slot order
    // implied by HOME_PILLAR_SET (news, trends, ideas, deep-dives, guides).
    expect(picks.map((a) => a.slug)).toEqual([
      'news-1',
      'trends-1',
      'ideas-1',
      'deep-1',
      'guides-1',
    ])
  })

  it('falls through to the next-newest article when a pillar slot is empty', () => {
    const news = makeArticle({
      slug: 'news-old',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'news-old',
        pillar: 'news',
        publishedAt: '2026-04-01T00:00:00.000Z',
      },
    })
    const ideas = makeArticle({
      slug: 'ideas-new',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'ideas-new',
        pillar: 'ideas',
        publishedAt: '2026-05-08T00:00:00.000Z',
      },
    })
    // No trends / deep-dives / guides articles — three slots fall through.
    const picks = resolveLatestByPillar([news, ideas])
    expect(picks.map((a) => a.slug)).toEqual(['news-old', 'ideas-new'])
  })

  it('handles an empty article list', () => {
    expect(resolveLatestByPillar([])).toEqual([])
  })
})

describe('<LatestByPillar>', () => {
  it('renders one card per resolved pillar', () => {
    const news = makeArticle({
      slug: 'news-1',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'news-1',
        pillar: 'news',
        publishedAt: '2026-05-08T00:00:00.000Z',
      },
    })
    const guides = makeArticle({
      slug: 'guides-1',
      frontmatter: {
        ...makeArticle().frontmatter,
        slug: 'guides-1',
        pillar: 'guides',
        publishedAt: '2026-05-05T00:00:00.000Z',
      },
    })
    render(<LatestByPillar articles={[news, guides]} />)
    const cards = screen.getAllByTestId('latest-by-pillar-card')
    expect(cards.length).toBeGreaterThanOrEqual(2)
  })

  it('renders nothing when no articles are present', () => {
    const { container } = render(<LatestByPillar articles={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
