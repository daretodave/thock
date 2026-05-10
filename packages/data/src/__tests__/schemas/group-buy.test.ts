import { describe, expect, it } from 'vitest'
import { GroupBuySchema } from '../../schemas/group-buy'

const VALID = {
  slug: 'cannonkeys-nyawice',
  name: 'Nyawice',
  vendorSlug: 'cannonkeys',
  productSlug: null,
  productKind: 'board' as const,
  startDate: '2026-04-17',
  endDate: '2026-05-17',
  region: 'global' as const,
  url: 'https://cannonkeys.com/products/nyawice',
  imageUrl: null,
  status: 'live' as const,
  description: 'Alice-layout board with leaf-spring F1 mount and 9-degree typing angle.',
  updatedAt: '2026-05-09T20:00:00.000Z',
}

describe('GroupBuySchema', () => {
  it('accepts a valid record', () => {
    expect(GroupBuySchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects endDate before startDate', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      startDate: '2026-06-15',
      endDate: '2026-05-01',
    })
    expect(result.success).toBe(false)
  })

  it("rejects productKind 'other' with a non-null productSlug", () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      productKind: 'other',
      productSlug: 'something',
    })
    expect(result.success).toBe(false)
  })

  it("accepts productKind 'other' with a null productSlug", () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      productKind: 'other',
      productSlug: null,
    })
    expect(result.success).toBe(true)
  })
})
