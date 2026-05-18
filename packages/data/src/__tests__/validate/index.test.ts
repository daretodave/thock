import { describe, expect, it } from 'vitest'
import { validateAll } from '../../validate/index'
import type { Switch } from '../../schemas/switch'
import type { Vendor } from '../../schemas/vendor'

const NOW = '2026-05-08T00:00:00.000Z'

const VENDOR: Vendor = {
  slug: 'cannonkeys',
  name: 'CannonKeys',
  url: 'https://cannonkeys.com',
  countryCode: 'US',
  description: 'Boutique keyboard vendor based in the United States.',
  status: 'active',
  updatedAt: NOW,
}

const SWITCH: Switch = {
  slug: 'gateron-oil-king',
  name: 'Gateron Oil King',
  vendorSlug: 'cannonkeys',
  type: 'linear',
  housingTop: 'nylon',
  housingBottom: 'nylon',
  stem: 'pom',
  springGrams: { actuation: 45, bottomOut: 55 },
  travelMm: 4,
  factoryLubed: true,
  releasedAt: null,
  status: 'in-production',
  description: 'Popular linear switch with factory oil lubing from Gateron.',
  updatedAt: NOW,
}

describe('validateAll', () => {
  it('returns ok:true with all-zero counts for empty input', () => {
    const result = validateAll({ records: {} })
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.counts).toMatchObject({
      vendors: 0,
      switches: 0,
      'keycap-sets': 0,
      boards: 0,
      'group-buys': 0,
      trends: 0,
    })
  })

  it('counts each entity kind accurately', () => {
    const result = validateAll({ records: { vendors: [VENDOR], switches: [SWITCH] } })
    expect(result.counts.vendors).toBe(1)
    expect(result.counts.switches).toBe(1)
    expect(result.counts['keycap-sets']).toBe(0)
    expect(result.counts['group-buys']).toBe(0)
    expect(result.counts.boards).toBe(0)
    expect(result.counts.trends).toBe(0)
  })

  it('returns ok:true when all cross-references resolve', () => {
    const result = validateAll({ records: { vendors: [VENDOR], switches: [SWITCH] } })
    expect(result.ok).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('returns ok:false and surfaces a cross-ref error for a missing vendor', () => {
    const orphan: Switch = { ...SWITCH, slug: 'orphan-switch', vendorSlug: 'ghost-vendor' }
    const result = validateAll({ records: { switches: [orphan] } })
    expect(result.ok).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(1)
    const err = result.errors.find((e) => e.field === 'vendorSlug')
    expect(err).toBeDefined()
    expect(err!.message).toMatch(/ghost-vendor/)
  })

  it('fills omitted record arrays with [] so partial input never produces undefined counts', () => {
    const result = validateAll({ records: { vendors: [VENDOR] } })
    expect(result.counts.switches).toBe(0)
    expect(result.counts['keycap-sets']).toBe(0)
    expect(result.counts['group-buys']).toBe(0)
  })
})
