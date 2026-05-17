import { describe, expect, it } from 'vitest'
import { BoardSchema } from '../../schemas/board'

const VALID = {
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
  description:
    '65 percent gasket-mounted aluminum board from Mode Designs with hotswap PCBs and a soft, balanced typing feel.',
  updatedAt: '2026-05-08T00:00:00.000Z',
}

describe('BoardSchema', () => {
  it('accepts a valid record', () => {
    expect(BoardSchema.safeParse(VALID).success).toBe(true)
  })

  it('rejects an unknown layout value', () => {
    const result = BoardSchema.safeParse({ ...VALID, layout: '40' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown mountStyle value', () => {
    const result = BoardSchema.safeParse({ ...VALID, mountStyle: 'sandwich' })
    expect(result.success).toBe(false)
  })

  it('rejects an unknown caseMaterial value', () => {
    const result = BoardSchema.safeParse({ ...VALID, caseMaterial: 'carbon-fiber' })
    expect(result.success).toBe(false)
  })

  it('accepts a null releasedAt for pre-release records', () => {
    const result = BoardSchema.safeParse({ ...VALID, releasedAt: null })
    expect(result.success).toBe(true)
  })
})
