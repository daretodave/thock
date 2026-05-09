import { describe, expect, it } from 'vitest'
import { NewsletterFrontmatterSchema } from '../../schema/newsletter'

const VALID = {
  slug: 'issue-001',
  title: 'thock weekly — issue 001',
  lede: 'A short rundown of switches, builds, and the group buys closing this week.',
  issue: 1,
  publishedAt: '2026-05-15T08:00:00.000Z',
}

describe('NewsletterFrontmatterSchema', () => {
  it('accepts a well-formed digest frontmatter', () => {
    expect(NewsletterFrontmatterSchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects a non-positive issue number', () => {
    expect(
      NewsletterFrontmatterSchema.safeParse({ ...VALID, issue: 0 }).success,
    ).toBe(false)
    expect(
      NewsletterFrontmatterSchema.safeParse({ ...VALID, issue: -3 }).success,
    ).toBe(false)
  })

  it('rejects a non-integer issue number', () => {
    expect(
      NewsletterFrontmatterSchema.safeParse({ ...VALID, issue: 1.5 }).success,
    ).toBe(false)
  })

  it('rejects a too-short title', () => {
    expect(
      NewsletterFrontmatterSchema.safeParse({ ...VALID, title: 'hi' }).success,
    ).toBe(false)
  })

  it('rejects a too-short lede', () => {
    expect(
      NewsletterFrontmatterSchema.safeParse({ ...VALID, lede: 'too short' })
        .success,
    ).toBe(false)
  })
})
