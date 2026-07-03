import { afterEach, describe, expect, it } from 'vitest'
import { getAllNewsletters, getNewsletterBySlug } from '../../loaders/newsletters'
import { __resetForTests } from '../../loaders/memo'

describe('newsletters loader', () => {
  afterEach(() => __resetForTests())

  it('returns every issue, newest first', () => {
    const newsletters = getAllNewsletters()
    expect(newsletters).toHaveLength(2)
    const first = newsletters[0]!
    expect(first.slug).toBe('thock-weekly-002')
    expect(first.frontmatter.issue).toBe(2)
    expect(first.frontmatter.title).toBe('thock weekly — issue 002')
    const second = newsletters[1]!
    expect(second.slug).toBe('thock-weekly-001')
    expect(second.frontmatter.issue).toBe(1)
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

  it('getNewsletterBySlug returns null for unknown slug', () => {
    expect(getNewsletterBySlug('does-not-exist')).toBeNull()
  })
})
