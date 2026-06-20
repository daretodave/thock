import { afterEach, describe, expect, it } from 'vitest'
import { getAllNewsletters, getNewsletterBySlug } from '../../loaders/newsletters'
import { __resetForTests } from '../../loaders/memo'

describe('newsletters loader', () => {
  afterEach(() => __resetForTests())

  it('returns the inaugural issue (thock-weekly-001)', () => {
    const newsletters = getAllNewsletters()
    expect(newsletters).toHaveLength(1)
    const first = newsletters[0]!
    expect(first.slug).toBe('thock-weekly-001')
    expect(first.frontmatter.issue).toBe(1)
    expect(first.frontmatter.title).toBe('thock weekly — issue 001')
  })

  it('getNewsletterBySlug returns the inaugural issue by slug', () => {
    const newsletter = getNewsletterBySlug('thock-weekly-001')
    expect(newsletter).not.toBeNull()
    expect(newsletter?.frontmatter.issue).toBe(1)
  })

  it('getNewsletterBySlug returns null for unknown slug', () => {
    expect(getNewsletterBySlug('does-not-exist')).toBeNull()
  })
})
