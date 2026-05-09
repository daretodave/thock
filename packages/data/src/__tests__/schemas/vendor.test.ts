import { describe, expect, it } from 'vitest'
import { VendorSchema } from '../../schemas/vendor'

const VALID = {
  slug: 'cannonkeys',
  name: 'CannonKeys',
  url: 'https://cannonkeys.com',
  countryCode: 'US',
  description:
    'Boutique keyboard vendor based in the United States. Stocks switches, keycaps, and group buys.',
  status: 'active' as const,
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('VendorSchema', () => {
  it('accepts a valid record', () => {
    expect(VendorSchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects a lower-case country code', () => {
    expect(VendorSchema.safeParse({ ...VALID, countryCode: 'us' }).success).toBe(false)
  })

  it('rejects a non-URL website', () => {
    expect(VendorSchema.safeParse({ ...VALID, url: 'cannonkeys.com' }).success).toBe(false)
  })
})
