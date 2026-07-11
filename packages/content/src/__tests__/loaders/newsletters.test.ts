import { afterEach, describe, expect, it } from 'vitest'
import { getAllNewsletters, getNewsletterBySlug } from '../../loaders/newsletters'
import { __resetForTests } from '../../loaders/memo'

describe('newsletters loader', () => {
  afterEach(() => __resetForTests())

  it('returns every issue, newest first', () => {
    const newsletters = getAllNewsletters()
    expect(newsletters).toHaveLength(3)
    const first = newsletters[0]!
    expect(first.slug).toBe('thock-weekly-003')
    expect(first.frontmatter.issue).toBe(3)
    expect(first.frontmatter.title).toBe('thock weekly — issue 003')
    const second = newsletters[1]!
    expect(second.slug).toBe('thock-weekly-002')
    expect(second.frontmatter.issue).toBe(2)
    const third = newsletters[2]!
    expect(third.slug).toBe('thock-weekly-001')
    expect(third.frontmatter.issue).toBe(1)
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

  it('getNewsletterBySlug returns null for unknown slug', () => {
    expect(getNewsletterBySlug('does-not-exist')).toBeNull()
  })
})
