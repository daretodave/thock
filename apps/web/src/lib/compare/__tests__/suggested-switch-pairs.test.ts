import { describe, expect, it } from 'vitest'
import type { Switch } from '@thock/data'
import { getSuggestedSwitchPairs } from '../suggested-switch-pairs'

const STUB: Omit<Switch, 'slug' | 'name' | 'type'> = {
  vendorSlug: 'vendor-x',
  housingTop: 'pc',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 45, bottomOut: 55 },
  travelMm: 4,
  factoryLubed: false,
  releasedAt: null,
  status: 'in-production',
  description: 'Test stub, long enough to pass schema validation easily.',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

function sw(slug: string, name: string, type: Switch['type']): Switch {
  return { ...STUB, slug, name, type }
}

describe('getSuggestedSwitchPairs', () => {
  it('returns no pairs when fewer than 2 switches exist', () => {
    expect(getSuggestedSwitchPairs([], 3)).toEqual([])
    expect(getSuggestedSwitchPairs([sw('a', 'A', 'linear')], 3)).toEqual([])
  })

  it('pairs switches across distinct types, never the same switch twice', () => {
    const switches = [
      sw('cherry-mx2a-red', 'Cherry MX2A Red', 'linear'),
      sw('gazzew-boba-u4t', 'Gazzew Boba U4T', 'tactile'),
      sw('kailh-box-jade', 'Kailh Box Jade', 'clicky'),
      sw('cherry-mx2a-silent-black', 'Cherry MX2A Silent Black', 'silent-linear'),
      sw('gazzew-boba-u4', 'Gazzew Boba U4', 'silent-tactile'),
    ]

    const pairs = getSuggestedSwitchPairs(switches, 3)

    expect(pairs).toHaveLength(3)
    for (const { a, b } of pairs) {
      expect(a.slug).not.toBe(b.slug)
      expect(a.type).not.toBe(b.type)
    }

    // No duplicate pair (order-independent).
    const keys = pairs.map(({ a, b }) => [a.slug, b.slug].sort().join('|'))
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('is deterministic for the same input', () => {
    const switches = [
      sw('cherry-mx2a-red', 'Cherry MX2A Red', 'linear'),
      sw('gazzew-boba-u4t', 'Gazzew Boba U4T', 'tactile'),
      sw('kailh-box-jade', 'Kailh Box Jade', 'clicky'),
    ]

    expect(getSuggestedSwitchPairs(switches, 2)).toEqual(
      getSuggestedSwitchPairs(switches, 2),
    )
  })

  it('falls back to adjacent catalog switches when fewer distinct types than requested', () => {
    const switches = [
      sw('a-switch', 'A Switch', 'linear'),
      sw('b-switch', 'B Switch', 'linear'),
      sw('c-switch', 'C Switch', 'linear'),
    ]

    const pairs = getSuggestedSwitchPairs(switches, 2)
    expect(pairs).toHaveLength(2)
    for (const { a, b } of pairs) {
      expect(a.slug).not.toBe(b.slug)
    }
  })

  it('respects the requested count', () => {
    const switches = [
      sw('cherry-mx2a-red', 'Cherry MX2A Red', 'linear'),
      sw('gazzew-boba-u4t', 'Gazzew Boba U4T', 'tactile'),
    ]

    expect(getSuggestedSwitchPairs(switches, 1)).toHaveLength(1)
  })
})
