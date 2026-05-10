import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import {
  PillarArchiveList,
  sortArticlesForArchive,
  sortArticlesForTagArchive,
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

// Regression guard for /critique pass 4 [LOW] (line 163 of plan/CRITIQUE.md):
// /tag/gateron put the trends-tracker article (which mentions Gateron Oil
// King in the rotation) above the Gateron Oil King deep-dive piece. The
// title-match heuristic separates "primary topic" from "secondary mention."
describe('sortArticlesForTagArchive', () => {
  function tagged(slug: string, title: string, publishedAt: string) {
    return makeArticle({
      slug,
      frontmatter: {
        ...makeArticle().frontmatter,
        slug,
        title,
        pillar: 'news',
        publishedAt,
      },
    })
  }

  it('puts title-match articles above non-title-match even when the latter is newer', () => {
    const tracker = tagged(
      'trends-tracker-preview',
      'Reading the Trends Tracker',
      '2026-05-08T00:00:00.000Z',
    )
    const oilKing = tagged(
      'gateron-oil-king-deep-dive',
      'Why the Gateron Oil King sounds the way it does',
      '2026-05-04T00:00:00.000Z',
    )
    const sorted = sortArticlesForTagArchive([tracker, oilKing], {
      slug: 'gateron',
      name: 'Gateron',
    })
    expect(sorted.map((a) => a.slug)).toEqual([
      'gateron-oil-king-deep-dive',
      'trends-tracker-preview',
    ])
  })

  it('sorts by publishedAt desc within each tier', () => {
    const a = tagged(
      'gateron-recent',
      'Gateron new release',
      '2026-05-08T00:00:00.000Z',
    )
    const b = tagged(
      'gateron-older',
      'Gateron deep dive',
      '2026-04-01T00:00:00.000Z',
    )
    const c = tagged(
      'tracker',
      'Reading the Trends Tracker',
      '2026-05-09T00:00:00.000Z',
    )
    const sorted = sortArticlesForTagArchive([c, b, a], {
      slug: 'gateron',
      name: 'Gateron',
    })
    expect(sorted.map((article) => article.slug)).toEqual([
      'gateron-recent',
      'gateron-older',
      'tracker',
    ])
  })

  it('matches the tag slug as well as the display name', () => {
    // Tag with a multi-word slug — name is "Group buys", slug is
    // "group-buy". Both forms should produce a title match.
    const a = tagged(
      'group-buy-explainer',
      'How a Group Buy Works',
      '2026-05-08T00:00:00.000Z',
    )
    const b = tagged(
      'unrelated',
      'Switch deep dive',
      '2026-05-09T00:00:00.000Z',
    )
    const sorted = sortArticlesForTagArchive([b, a], {
      slug: 'group-buy',
      name: 'Group buys',
    })
    expect(sorted[0]!.slug).toBe('group-buy-explainer')
  })

  it('falls back to publishedAt-desc when no article matches the tag in title', () => {
    const a = tagged('a', 'First piece', '2026-04-01T00:00:00.000Z')
    const b = tagged('b', 'Second piece', '2026-05-08T00:00:00.000Z')
    const sorted = sortArticlesForTagArchive([a, b], {
      slug: 'gateron',
      name: 'Gateron',
    })
    expect(sorted.map((article) => article.slug)).toEqual(['b', 'a'])
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
