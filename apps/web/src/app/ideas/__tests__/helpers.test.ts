import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import { BUILD_OF_THE_WEEK_TAG, isoWeekNumber, pickBuildOfTheWeek } from '../helpers'

function makeArticle(
  slug: string,
  publishedAt: string,
  tags: string[] = [],
): Article {
  return {
    slug,
    body: '',
    readTime: 5,
    filePath: `articles/${slug}.mdx`,
    frontmatter: {
      slug,
      title: slug,
      lede: 'A test article for unit testing purposes only.',
      author: 'thock',
      pillar: 'ideas',
      tags,
      publishedAt,
      updatedAt: null,
      heroImage: null,
      heroImageAlt: null,
      featured: false,
      popularityScore: 0,
      guideSection: null,
      mentionedParts: [],
    },
  }
}

describe('pickBuildOfTheWeek', () => {
  it('returns null for an empty article list', () => {
    expect(pickBuildOfTheWeek([])).toBeNull()
  })

  it('returns null when no article carries the build-of-the-week tag', () => {
    const articles = [
      makeArticle('article-a', '2026-05-01', ['modding']),
      makeArticle('article-b', '2026-05-10', ['switches']),
    ]
    expect(pickBuildOfTheWeek(articles)).toBeNull()
  })

  it('returns the single article that has the tag', () => {
    const articles = [
      makeArticle('article-a', '2026-05-01', ['modding']),
      makeArticle('article-b', '2026-05-10', [BUILD_OF_THE_WEEK_TAG]),
    ]
    expect(pickBuildOfTheWeek(articles)?.slug).toBe('article-b')
  })

  it('returns the newest (highest publishedAt) tagged article when multiple qualify', () => {
    const articles = [
      makeArticle('older-build', '2026-04-01', [BUILD_OF_THE_WEEK_TAG]),
      makeArticle('newest-build', '2026-05-10', [BUILD_OF_THE_WEEK_TAG]),
      makeArticle('mid-build', '2026-04-20', [BUILD_OF_THE_WEEK_TAG]),
    ]
    expect(pickBuildOfTheWeek(articles)?.slug).toBe('newest-build')
  })

  it('does not mutate the input array', () => {
    const articles = [
      makeArticle('a', '2026-05-10', [BUILD_OF_THE_WEEK_TAG]),
      makeArticle('b', '2026-04-01', [BUILD_OF_THE_WEEK_TAG]),
    ]
    const copy = [...articles]
    pickBuildOfTheWeek(articles)
    expect(articles).toEqual(copy)
  })
})

describe('isoWeekNumber', () => {
  it('returns 0 for an invalid date string', () => {
    expect(isoWeekNumber('not-a-date')).toBe(0)
  })

  it('returns 20 for 2026-05-11 (Monday, start of ISO week 20)', () => {
    expect(isoWeekNumber('2026-05-11')).toBe(20)
  })

  it('returns 20 for 2026-05-17 (Sunday, last day of ISO week 20)', () => {
    expect(isoWeekNumber('2026-05-17')).toBe(20)
  })

  it('returns 21 for 2026-05-18 (Monday, start of ISO week 21)', () => {
    expect(isoWeekNumber('2026-05-18')).toBe(21)
  })

  it('returns 1 for 2025-12-29 (Monday belonging to ISO week 1 of 2026)', () => {
    // ISO weeks start on Monday; the week containing Thursday Jan 1, 2026
    // runs from Mon Dec 29, 2025 → Sun Jan 4, 2026 → ISO week 1 of 2026.
    expect(isoWeekNumber('2025-12-29')).toBe(1)
  })

  it('returns 1 for 2026-01-01 (Thursday, ISO week 1 of 2026)', () => {
    expect(isoWeekNumber('2026-01-01')).toBe(1)
  })
})
