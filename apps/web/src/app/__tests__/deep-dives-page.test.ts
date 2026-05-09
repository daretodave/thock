import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import { sortDeepDivesByLength } from '../deep-dives/helpers'
import { makeArticle } from '@/components/home/__tests__/testFixtures'

function deepDivesArticle(
  slug: string,
  readTime: number,
  publishedAt: string,
): Article {
  return makeArticle({
    slug,
    readTime,
    frontmatter: {
      ...makeArticle().frontmatter,
      slug,
      pillar: 'deep-dives',
      publishedAt,
    },
  })
}

describe('sortDeepDivesByLength', () => {
  it('returns an empty array unchanged', () => {
    expect(sortDeepDivesByLength([])).toEqual([])
  })

  it('sorts by readTime descending', () => {
    const a = deepDivesArticle('a', 5, '2026-05-01T00:00:00.000Z')
    const b = deepDivesArticle('b', 30, '2026-05-01T00:00:00.000Z')
    const c = deepDivesArticle('c', 12, '2026-05-01T00:00:00.000Z')
    expect(sortDeepDivesByLength([a, b, c]).map((x) => x.slug)).toEqual([
      'b',
      'c',
      'a',
    ])
  })

  it('breaks ties on readTime by publishedAt descending', () => {
    const older = deepDivesArticle('older', 20, '2026-04-01T00:00:00.000Z')
    const newer = deepDivesArticle('newer', 20, '2026-05-01T00:00:00.000Z')
    expect(
      sortDeepDivesByLength([older, newer]).map((x) => x.slug),
    ).toEqual(['newer', 'older'])
  })

  it('breaks readTime + publishedAt ties on slug ascending for stability', () => {
    const z = deepDivesArticle('z', 20, '2026-05-01T00:00:00.000Z')
    const a = deepDivesArticle('a', 20, '2026-05-01T00:00:00.000Z')
    expect(sortDeepDivesByLength([z, a]).map((x) => x.slug)).toEqual([
      'a',
      'z',
    ])
  })

  it('does not mutate the input array', () => {
    const a = deepDivesArticle('a', 5, '2026-05-01T00:00:00.000Z')
    const b = deepDivesArticle('b', 30, '2026-05-01T00:00:00.000Z')
    const input = [a, b]
    sortDeepDivesByLength(input)
    expect(input.map((x) => x.slug)).toEqual(['a', 'b'])
  })
})
