import { afterEach, describe, expect, it } from 'vitest'
import { getAllKeycapSets, getKeycapSetBySlug } from '../../loaders/keycap-sets'
import { __resetForTests } from '../../loaders/memo'

describe('keycap-sets loader', () => {
  afterEach(() => __resetForTests())

  it('reads the seed keycap-set', () => {
    const all = getAllKeycapSets()
    expect(all.length).toBeGreaterThanOrEqual(1)
    expect(all.map((k) => k.slug)).toContain('gmk-olivia')
  })

  it('returns sorted-by-slug order', () => {
    const slugs = getAllKeycapSets().map((k) => k.slug)
    const sorted = [...slugs].sort()
    expect(slugs).toEqual(sorted)
  })

  it('resolves a known slug', () => {
    const ks = getKeycapSetBySlug('gmk-olivia')
    expect(ks?.name).toBe('GMK Olivia')
  })

  it('returns null for an unknown slug', () => {
    expect(getKeycapSetBySlug('does-not-exist')).toBeNull()
  })
})
