import { afterEach, describe, expect, it } from 'vitest'
import { getAllSwitches, getSwitchBySlug } from '../../loaders/switches'
import { __resetForTests } from '../../loaders/memo'

describe('switches loader', () => {
  afterEach(() => __resetForTests())

  it('reads the seed switch', () => {
    const all = getAllSwitches()
    expect(all.length).toBeGreaterThanOrEqual(1)
    expect(all.map((s) => s.slug)).toContain('gateron-oil-king')
  })

  it('returns sorted-by-slug order', () => {
    const slugs = getAllSwitches().map((s) => s.slug)
    const sorted = [...slugs].sort()
    expect(slugs).toEqual(sorted)
  })

  it('resolves a known slug', () => {
    const sw = getSwitchBySlug('gateron-oil-king')
    expect(sw?.name).toBe('Gateron Oil King')
  })

  it('returns null for an unknown slug', () => {
    expect(getSwitchBySlug('does-not-exist')).toBeNull()
  })
})
