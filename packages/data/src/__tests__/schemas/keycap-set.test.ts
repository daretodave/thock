import { describe, expect, it } from 'vitest'
import { KeycapSetSchema } from '../../schemas/keycap-set'

const VALID = {
  slug: 'gmk-olivia',
  name: 'GMK Olivia',
  vendorSlug: 'cannonkeys',
  profile: 'cherry' as const,
  material: 'abs' as const,
  legendType: 'doubleshot' as const,
  designer: 'Olivia',
  releasedAt: '2018-04-01',
  status: 'discontinued' as const,
  imageUrl: null,
  description:
    'Soft pink-and-cream Cherry-profile set with black accents. Designed by Olivia and produced by GMK.',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('KeycapSetSchema', () => {
  it('accepts a valid record', () => {
    expect(KeycapSetSchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects an unknown profile value', () => {
    const result = KeycapSetSchema.safeParse({ ...VALID, profile: 'osa' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown material value', () => {
    const result = KeycapSetSchema.safeParse({ ...VALID, material: 'pvc' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown legendType value', () => {
    const result = KeycapSetSchema.safeParse({ ...VALID, legendType: 'laser-etched' })
    expect(result.success).toBe(false)
  })

  it('accepts a null designer for anonymous or unattributed sets', () => {
    const result = KeycapSetSchema.safeParse({ ...VALID, designer: null })
    expect(result.success).toBe(true)
  })
})
