import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomeDeepDivesRail } from '../HomeDeepDivesRail'
import { makeArticle } from './testFixtures'

function deepDive(slug: string, publishedAt: string) {
  return makeArticle({
    slug,
    frontmatter: {
      ...makeArticle().frontmatter,
      slug,
      pillar: 'deep-dives',
      publishedAt,
    },
  })
}

describe('<HomeDeepDivesRail>', () => {
  it('renders nothing when no deep-dive articles are present', () => {
    const news = makeArticle()
    const { container } = render(<HomeDeepDivesRail articles={[news]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the top three deep-dives in publishedAt-desc order', () => {
    const a = deepDive('alpha', '2026-05-08T00:00:00.000Z')
    const b = deepDive('beta', '2026-05-07T00:00:00.000Z')
    const c = deepDive('gamma', '2026-05-06T00:00:00.000Z')
    const d = deepDive('delta', '2026-05-05T00:00:00.000Z')
    render(<HomeDeepDivesRail articles={[c, a, d, b]} />)
    const rows = screen.getAllByTestId('article-card-row')
    expect(rows.map((r) => r.getAttribute('href'))).toEqual([
      '/article/alpha',
      '/article/beta',
      '/article/gamma',
    ])
  })

  it('honors the max prop', () => {
    const a = deepDive('alpha', '2026-05-08T00:00:00.000Z')
    const b = deepDive('beta', '2026-05-07T00:00:00.000Z')
    const c = deepDive('gamma', '2026-05-06T00:00:00.000Z')
    render(<HomeDeepDivesRail articles={[a, b, c]} max={2} />)
    expect(screen.getAllByTestId('article-card-row')).toHaveLength(2)
  })

  it('excludes slugs in excludeSlugs (regression guard for /critique pass 4)', () => {
    // The home page passes the by-pillar grid's resolved picks so the
    // long-reads rail never re-surfaces the same Deep Dives card.
    const a = deepDive('alpha', '2026-05-08T00:00:00.000Z')
    const b = deepDive('beta', '2026-05-07T00:00:00.000Z')
    const c = deepDive('gamma', '2026-05-06T00:00:00.000Z')
    render(
      <HomeDeepDivesRail
        articles={[a, b, c]}
        excludeSlugs={new Set(['alpha'])}
      />,
    )
    const hrefs = screen
      .getAllByTestId('article-card-row')
      .map((r) => r.getAttribute('href'))
    expect(hrefs).not.toContain('/article/alpha')
    expect(hrefs).toEqual(['/article/beta', '/article/gamma'])
  })
})
