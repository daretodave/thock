import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import { pickBuildOfTheWeek } from '../ideas/helpers'
import { makeArticle } from '@/components/home/__tests__/testFixtures'

function ideasArticle(slug: string, publishedAt: string, tags: string[] = []): Article {
  return makeArticle({
    slug,
    frontmatter: {
      ...makeArticle().frontmatter,
      slug,
      pillar: 'ideas',
      publishedAt,
      tags: tags.length > 0 ? tags : ['ideas'],
    },
  })
}

describe('pickBuildOfTheWeek', () => {
  it('returns null when no article carries the build-of-the-week tag', () => {
    const a = ideasArticle('a', '2026-05-01T00:00:00.000Z')
    const b = ideasArticle('b', '2026-05-02T00:00:00.000Z')
    expect(pickBuildOfTheWeek([a, b])).toBeNull()
  })

  it('returns the newest article tagged build-of-the-week', () => {
    const a = ideasArticle('a', '2026-05-01T00:00:00.000Z', ['build-of-the-week'])
    const b = ideasArticle('b', '2026-05-08T00:00:00.000Z', ['build-of-the-week'])
    const c = ideasArticle('c', '2026-05-05T00:00:00.000Z')
    expect(pickBuildOfTheWeek([a, b, c])?.slug).toBe('b')
  })

  it('returns null when the input list is empty', () => {
    expect(pickBuildOfTheWeek([])).toBeNull()
  })
})
