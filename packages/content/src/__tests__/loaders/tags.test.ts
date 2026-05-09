import { afterEach, describe, expect, it } from 'vitest'
import { getAllTags, getTagBySlug } from '../../loaders/tags'
import { __resetForTests } from '../../loaders/memo'

describe('tags loader', () => {
  afterEach(() => __resetForTests())

  it('reads the seed tag taxonomy', () => {
    const tags = getAllTags()
    expect(tags.length).toBeGreaterThanOrEqual(20)
  })

  it('returns tags sorted by slug', () => {
    const slugs = getAllTags().map((t) => t.slug)
    expect(slugs).toEqual([...slugs].sort())
  })

  it('resolves a known tag', () => {
    const t = getTagBySlug('linear')
    expect(t?.category).toBe('switch')
  })

  it('returns null for an unknown tag', () => {
    expect(getTagBySlug('made-up-tag')).toBeNull()
  })

  it('every tag has an allowed category', () => {
    const allowed = ['switch', 'layout', 'brand', 'material', 'profile', 'misc']
    for (const t of getAllTags()) {
      expect(allowed).toContain(t.category)
    }
  })
})
