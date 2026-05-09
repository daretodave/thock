import { afterEach, describe, expect, it } from 'vitest'
import { getAllNewsletters, getNewsletterBySlug } from '../../loaders/newsletters'
import { __resetForTests } from '../../loaders/memo'

describe('newsletters loader', () => {
  afterEach(() => __resetForTests())

  it('is empty-tolerant when no newsletters/ directory exists', () => {
    expect(getAllNewsletters()).toEqual([])
  })

  it('getNewsletterBySlug returns null when nothing has been seeded', () => {
    expect(getNewsletterBySlug('issue-001')).toBeNull()
  })
})
