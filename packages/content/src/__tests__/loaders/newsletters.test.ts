import { afterEach, describe, expect, it } from 'vitest'
import { getAllNewsletters, getNewsletterBySlug } from '../../loaders/newsletters'
import { __resetForTests } from '../../loaders/memo'

describe('newsletters loader', () => {
  afterEach(() => __resetForTests())

  it('returns every issue, newest first', () => {
    const newsletters = getAllNewsletters()
    // Floor rather than a hard count so future cadence ticks don't keep
    // flipping this assertion (same pattern as the articles loader test).
    expect(newsletters.length).toBeGreaterThanOrEqual(4)
    const publishedDates = newsletters.map((n) => n.frontmatter.publishedAt)
    expect(publishedDates).toEqual([...publishedDates].sort((a, b) => b.localeCompare(a)))
    const first = newsletters[0]!
    expect(first.frontmatter.issue).toBe(Math.max(...newsletters.map((n) => n.frontmatter.issue)))
  })

  it('getNewsletterBySlug returns the inaugural issue by slug', () => {
    const newsletter = getNewsletterBySlug('thock-weekly-001')
    expect(newsletter).not.toBeNull()
    expect(newsletter?.frontmatter.issue).toBe(1)
  })

  it('getNewsletterBySlug returns issue 002 by slug', () => {
    const newsletter = getNewsletterBySlug('thock-weekly-002')
    expect(newsletter).not.toBeNull()
    expect(newsletter?.frontmatter.issue).toBe(2)
  })

  it('getNewsletterBySlug returns issue 003 by slug', () => {
    const newsletter = getNewsletterBySlug('thock-weekly-003')
    expect(newsletter).not.toBeNull()
    expect(newsletter?.frontmatter.issue).toBe(3)
  })

  it('getNewsletterBySlug returns issue 004 by slug', () => {
    const newsletter = getNewsletterBySlug('thock-weekly-004')
    expect(newsletter).not.toBeNull()
    expect(newsletter?.frontmatter.issue).toBe(4)
  })

  it('getNewsletterBySlug returns null for unknown slug', () => {
    expect(getNewsletterBySlug('does-not-exist')).toBeNull()
  })
})
