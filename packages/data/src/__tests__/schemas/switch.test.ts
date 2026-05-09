import { describe, expect, it } from 'vitest'
import { SwitchSchema } from '../../schemas/switch'

const VALID = {
  slug: 'gateron-oil-king',
  name: 'Gateron Oil King',
  vendorSlug: 'cannonkeys',
  type: 'linear' as const,
  housingTop: 'pc' as const,
  housingBottom: 'nylon' as const,
  stem: 'pom' as const,
  springGrams: { actuation: 55, bottomOut: 65 },
  travelMm: 4,
  factoryLubed: true,
  releasedAt: '2022-08-01',
  status: 'in-production' as const,
  description:
    'Mid-weight linear with a heavily lubed POM stem in a polycarbonate over nylon housing.',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('SwitchSchema', () => {
  it('accepts a valid record', () => {
    expect(SwitchSchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects an upper-case slug', () => {
    const result = SwitchSchema.safeParse({ ...VALID, slug: 'Gateron-Oil-King' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown housingTop material', () => {
    const result = SwitchSchema.safeParse({ ...VALID, housingTop: 'titanium' })
    expect(result.success).toBe(false)
  })

  it('rejects negative spring grams', () => {
    const result = SwitchSchema.safeParse({
      ...VALID,
      springGrams: { actuation: -1, bottomOut: 65 },
    })
    expect(result.success).toBe(false)
  })

  it('accepts a null releasedAt for legacy records', () => {
    const result = SwitchSchema.safeParse({ ...VALID, releasedAt: null })
    expect(result.success).toBe(true)
  })
})
