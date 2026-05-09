import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  PillarArchiveList,
  sortArticlesForArchive,
} from '../PillarArchiveList'
import { makeArticle } from '@/components/home/__tests__/testFixtures'

function pillarArticle(slug: string, publishedAt: string) {
  return makeArticle({
    slug,
    frontmatter: {
      ...makeArticle().frontmatter,
      slug,
      pillar: 'news',
      publishedAt,
    },
  })
}

describe('sortArticlesForArchive', () => {
  it('sorts by publishedAt desc', () => {
    const a = pillarArticle('a', '2026-04-01T00:00:00.000Z')
    const b = pillarArticle('b', '2026-05-08T00:00:00.000Z')
    const c = pillarArticle('c', '2026-04-15T00:00:00.000Z')
    expect(
      sortArticlesForArchive([a, b, c]).map((article) => article.slug),
    ).toEqual(['b', 'c', 'a'])
  })

  it('breaks ties by slug asc for deterministic order', () => {
    const a = pillarArticle('zzz', '2026-05-08T00:00:00.000Z')
    const b = pillarArticle('aaa', '2026-05-08T00:00:00.000Z')
    expect(
      sortArticlesForArchive([a, b]).map((article) => article.slug),
    ).toEqual(['aaa', 'zzz'])
  })
})

describe('<PillarArchiveList>', () => {
  it('renders nothing when articles is empty', () => {
    const { container } = render(<PillarArchiveList articles={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders one row per article in input order', () => {
    const a = pillarArticle('a', '2026-05-08T00:00:00.000Z')
    const b = pillarArticle('b', '2026-05-07T00:00:00.000Z')
    render(<PillarArchiveList articles={[a, b]} />)
    const rows = screen.getAllByTestId('article-card-row')
    expect(rows.map((r) => r.getAttribute('href'))).toEqual([
      '/article/a',
      '/article/b',
    ])
  })

  it('caps the rendered list at the max prop', () => {
    const items = Array.from({ length: 6 }, (_, i) =>
      pillarArticle(`a${i}`, `2026-05-${String(i + 1).padStart(2, '0')}T00:00:00.000Z`),
    )
    render(<PillarArchiveList articles={items} max={3} />)
    expect(screen.getAllByTestId('article-card-row')).toHaveLength(3)
  })
})
