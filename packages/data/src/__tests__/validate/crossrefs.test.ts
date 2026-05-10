import { describe, expect, it } from 'vitest'
import { checkCrossRefs, type RecordSet } from '../../validate/crossrefs'

const NOW = '2026-05-08T00:00:00.000Z'

const VENDOR = {
  slug: 'cannonkeys',
  name: 'CannonKeys',
  url: 'https://cannonkeys.com',
  countryCode: 'US',
  description: 'Boutique keyboard vendor based in the United States.',
  status: 'active' as const,
  updatedAt: NOW,
}

const BOARD = {
  slug: 'mode-sonnet',
  name: 'Mode Sonnet',
  vendorSlug: 'cannonkeys',
  layout: '65' as const,
  caseMaterial: 'aluminum' as const,
  mountStyle: 'gasket' as const,
  hotswap: true,
  wireless: false,
  releasedAt: '2024-09-01',
  status: 'in-stock' as const,
  imageUrl: null,
  description: '65 percent gasket-mounted aluminum board.',
  updatedAt: NOW,
}

const baseRecords = (): RecordSet => ({
  vendors: [VENDOR],
  switches: [],
  keycapSets: [],
  boards: [BOARD],
  groupBuys: [],
  trends: [],
})

const groupBuy = (
  overrides: Partial<RecordSet['groupBuys'][number]> = {},
): RecordSet['groupBuys'][number] => ({
  slug: 'gb-1',
  name: 'Test',
  vendorSlug: 'cannonkeys',
  productSlug: 'mode-sonnet',
  productKind: 'board',
  startDate: '2026-05-01',
  endDate: '2026-06-15',
  region: 'global',
  url: 'https://example.com/gb',
  imageUrl: null,
  status: 'live',
  description: 'A test group buy with enough copy to satisfy the schema.',
  updatedAt: NOW,
  ...overrides,
})

describe('checkCrossRefs', () => {
  it('returns no errors when every reference resolves', () => {
    const records = baseRecords()
    records.groupBuys.push(groupBuy())
    expect(checkCrossRefs(records)).toEqual([])
  })

  it('flags a missing vendorSlug on a switch', () => {
    const records = baseRecords()
    records.switches.push({
      slug: 'mystery-switch',
      name: 'Mystery',
      vendorSlug: 'phantom-vendor',
      type: 'linear',
      housingTop: 'pc',
      housingBottom: 'pc',
      stem: 'pom',
      springGrams: { actuation: 50, bottomOut: 60 },
      travelMm: 4,
      factoryLubed: false,
      releasedAt: null,
      status: 'in-production',
      description: 'Mystery switch from a vendor that does not exist in the dataset.',
      updatedAt: NOW,
    })
    const errors = checkCrossRefs(records)
    expect(errors).toHaveLength(1)
    expect(errors[0]?.field).toBe('vendorSlug')
    expect(errors[0]?.message).toMatch(/vendor "phantom-vendor"/)
  })

  it("flags productKind 'other' with a non-null productSlug", () => {
    const records = baseRecords()
    records.groupBuys.push(
      groupBuy({ productKind: 'other', productSlug: 'mode-sonnet' }),
    )
    const errors = checkCrossRefs(records)
    expect(errors.find((e) => e.field === 'productSlug')).toBeDefined()
  })

  it('flags a board productSlug that does not exist', () => {
    const records = baseRecords()
    records.groupBuys.push(groupBuy({ productSlug: 'imaginary-board' }))
    const errors = checkCrossRefs(records)
    expect(
      errors.find(
        (e) => e.slug === 'gb-1' && e.message.includes('imaginary-board'),
      ),
    ).toBeDefined()
  })

  it('permits a null productSlug on a board/keycap-set/switch group buy when no matching product record exists yet', () => {
    // Phase 18 backfilled real GBs ahead of phase 20's product backfill,
    // so a non-'other' kind with null productSlug is valid until the
    // matching board/keycap-set/switch records land.
    const records = baseRecords()
    records.groupBuys.push(groupBuy({ productSlug: null }))
    expect(checkCrossRefs(records)).toEqual([])
  })
})
