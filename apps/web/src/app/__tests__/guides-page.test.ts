import { describe, expect, it } from 'vitest'
import type { Article } from '@thock/content'
import { groupGuidesBySection } from '../guides/helpers'
import { makeArticle } from '@/components/home/__tests__/testFixtures'

type GuideSection = 'firmware' | 'modding' | 'switches' | 'keycaps' | null

function guidesArticle(
  slug: string,
  section: GuideSection,
  publishedAt: string,
  updatedAt: string | null = null,
): Article {
  return makeArticle({
    slug,
    frontmatter: {
      ...makeArticle().frontmatter,
      slug,
      pillar: 'guides',
      publishedAt,
      updatedAt,
      guideSection: section,
    },
  })
}

describe('groupGuidesBySection', () => {
  it('returns an empty array for empty input', () => {
    expect(groupGuidesBySection([])).toEqual([])
  })

  it('groups in canonical order: firmware, modding, switches, keycaps', () => {
    const sw = guidesArticle('sw', 'switches', '2026-05-01T00:00:00.000Z')
    const fw = guidesArticle('fw', 'firmware', '2026-05-01T00:00:00.000Z')
    const kc = guidesArticle('kc', 'keycaps', '2026-05-01T00:00:00.000Z')
    const md = guidesArticle('md', 'modding', '2026-05-01T00:00:00.000Z')
    const groups = groupGuidesBySection([sw, fw, kc, md])
    expect(groups.map((g) => g.key)).toEqual([
      'firmware',
      'modding',
      'switches',
      'keycaps',
    ])
  })

  it('drops empty sections silently', () => {
    const sw = guidesArticle('sw', 'switches', '2026-05-01T00:00:00.000Z')
    const groups = groupGuidesBySection([sw])
    expect(groups.map((g) => g.key)).toEqual(['switches'])
  })

  it('bundles null-section articles into "Other guides" last', () => {
    const sw = guidesArticle('sw', 'switches', '2026-05-01T00:00:00.000Z')
    const ng = guidesArticle('ng', null, '2026-05-01T00:00:00.000Z')
    const groups = groupGuidesBySection([sw, ng])
    expect(groups.map((g) => g.key)).toEqual(['switches', 'other'])
    const other = groups[1]
    expect(other?.label).toBe('Other guides')
  })

  it('sorts within section by updatedAt or publishedAt desc', () => {
    const a = guidesArticle('a', 'firmware', '2026-04-01T00:00:00.000Z', null)
    const b = guidesArticle(
      'b',
      'firmware',
      '2026-03-01T00:00:00.000Z',
      '2026-05-01T00:00:00.000Z',
    )
    const c = guidesArticle('c', 'firmware', '2026-04-15T00:00:00.000Z', null)
    const groups = groupGuidesBySection([a, b, c])
    const firmware = groups[0]
    expect(firmware?.articles.map((x) => x.slug)).toEqual(['b', 'c', 'a'])
  })

  it('breaks freshness ties by publishedAt desc, then slug asc', () => {
    const a = guidesArticle('a', 'firmware', '2026-05-01T00:00:00.000Z')
    const b = guidesArticle('b', 'firmware', '2026-05-01T00:00:00.000Z')
    const c = guidesArticle('c', 'firmware', '2026-04-01T00:00:00.000Z')
    const groups = groupGuidesBySection([b, a, c])
    const firmware = groups[0]
    expect(firmware?.articles.map((x) => x.slug)).toEqual(['a', 'b', 'c'])
  })
})
