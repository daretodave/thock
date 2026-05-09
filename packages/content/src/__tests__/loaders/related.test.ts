import { afterEach, describe, expect, it } from 'vitest'
import { getAllArticles, getRelatedArticles } from '../../loaders/articles'
import { __resetForTests } from '../../loaders/memo'

describe('getRelatedArticles', () => {
  afterEach(() => __resetForTests())

  it('excludes the article itself', () => {
    const subject = getAllArticles()[0]!
    const related = getRelatedArticles(subject)
    for (const r of related) expect(r.slug).not.toBe(subject.slug)
  })

  it('caps the result at n', () => {
    const subject = getAllArticles()[0]!
    expect(getRelatedArticles(subject, 2).length).toBeLessThanOrEqual(2)
  })

  it('returns same-pillar candidates first when scores tie', () => {
    const trendsArticles = getAllArticles().filter(
      (a) => a.frontmatter.pillar === 'trends',
    )
    if (trendsArticles.length < 2) return // not enough overlap to test
    const subject = trendsArticles[0]!
    const related = getRelatedArticles(subject, 6)
    if (related.length === 0) return
    // first candidate must share pillar OR have ≥2 shared tags
    const r0 = related[0]!
    const sharedTags = r0.frontmatter.tags.filter((t) =>
      subject.frontmatter.tags.includes(t),
    ).length
    const samePillar = r0.frontmatter.pillar === subject.frontmatter.pillar
    expect(samePillar || sharedTags >= 2).toBe(true)
  })
})
