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

  it('first candidate satisfies the strict tier (same pillar OR ≥2 shared tags)', () => {
    const trendsArticles = getAllArticles().filter(
      (a) => a.frontmatter.pillar === 'trends',
    )
    if (trendsArticles.length < 2) return // not enough overlap to test
    const subject = trendsArticles[0]!
    const related = getRelatedArticles(subject, 6)
    if (related.length === 0) return
    const r0 = related[0]!
    const sharedTags = r0.frontmatter.tags.filter((t) =>
      subject.frontmatter.tags.includes(t),
    ).length
    const samePillar = r0.frontmatter.pillar === subject.frontmatter.pillar
    expect(samePillar || sharedTags >= 2).toBe(true)
  })

  // Regression guard for /critique pass 5 [LOW] (line 47): the
  // strict-tier filter (same-pillar OR shared ≥ 2) was too aggressive
  // for thin pillars — news articles with 3 same-pillar siblings and
  // few cross-pillar tag overlaps would thin to a single related
  // tile. The loose-tier fallback fills remaining slots from the
  // shared-≥-1-tag pool sorted by weight + recency.
  it('backfills with shared-≥-1-tag candidates when the strict tier returns fewer than n', () => {
    const articles = getAllArticles()
    const newsArticles = articles.filter(
      (a) => a.frontmatter.pillar === 'news',
    )
    if (newsArticles.length === 0) return
    const subject = newsArticles[0]!

    const subjectTags = new Set(subject.frontmatter.tags)
    const strictPool = articles.filter((a) => {
      if (a.slug === subject.slug) return false
      const shared = a.frontmatter.tags.filter((t) => subjectTags.has(t)).length
      const samePillar = a.frontmatter.pillar === subject.frontmatter.pillar
      return samePillar || shared >= 2
    })
    if (strictPool.length >= 4) return // not testable; strict tier already full

    const related = getRelatedArticles(subject, 4)

    // The rail should not stop at the strict-pool size when the loose
    // pool has shared-≥-1 candidates — at minimum it should match
    // what backfill could provide.
    const looseCandidates = articles.filter((a) => {
      if (a.slug === subject.slug) return false
      const shared = a.frontmatter.tags.filter((t) => subjectTags.has(t)).length
      return shared >= 1
    })
    const expectedMinimum = Math.min(4, looseCandidates.length)
    expect(related.length).toBeGreaterThanOrEqual(expectedMinimum)
  })

  it('respects the cap when strict + loose pools combined exceed n', () => {
    const subject = getAllArticles()[0]!
    expect(getRelatedArticles(subject, 1).length).toBeLessThanOrEqual(1)
    expect(getRelatedArticles(subject, 3).length).toBeLessThanOrEqual(3)
  })
})
