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
  heroImage: '/group-buy-art/cannonkeys-nyawice.svg',
  heroImageAlt: 'Top-down Alice-layout keyboard silhouette with focal cat-ear silhouettes.',
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

  it('accepts a null heroImage (phase 23 — partial backfill safe)', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      heroImage: null,
    })
    expect(result.success).toBe(true)
  })

  it('accepts a string heroImage (phase 23)', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      heroImage: '/group-buy-art/cannonkeys-nyawice.svg',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a non-string non-null heroImage', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      heroImage: 42,
    })
    expect(result.success).toBe(false)
  })

  it('accepts a null heroImageAlt (partial backfill safe)', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      heroImageAlt: null,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a heroImageAlt shorter than 2 characters', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      heroImageAlt: 'x',
    })
    expect(result.success).toBe(false)
  })
})

const STATUS_NOTE = {
  text: 'Vendor pushed shipping two months citing tariff-driven cost changes.',
  sourceUrl: 'https://example.com/updates/42',
  asOf: '2026-06-01',
}

describe('GroupBuySchema status: delayed / cancelled (Spec 04)', () => {
  it('accepts a delayed record with a statusNote', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
      statusNote: STATUS_NOTE,
    })
    expect(result.success).toBe(true)
  })

  it('accepts a cancelled record with a statusNote', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'cancelled',
      statusNote: STATUS_NOTE,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a delayed record missing statusNote', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a cancelled record missing statusNote', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'cancelled',
    })
    expect(result.success).toBe(false)
  })

  it('accepts statusNote present on an unaffected status (e.g. live)', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'live',
      statusNote: STATUS_NOTE,
    })
    expect(result.success).toBe(true)
  })

  it('accepts an existing status with no statusNote (additive, backward compatible)', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'closed',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty statusNote.text', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
      statusNote: { ...STATUS_NOTE, text: '' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects a statusNote.text longer than 280 characters', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
      statusNote: { ...STATUS_NOTE, text: 'x'.repeat(281) },
    })
    expect(result.success).toBe(false)
  })

  it('accepts a statusNote.text at exactly 280 characters', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
      statusNote: { ...STATUS_NOTE, text: 'x'.repeat(280) },
    })
    expect(result.success).toBe(true)
  })

  it('rejects a malformed statusNote.sourceUrl', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
      statusNote: { ...STATUS_NOTE, sourceUrl: 'not-a-url' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects a statusNote.asOf that is not date-only (e.g. a full datetime)', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
      statusNote: { ...STATUS_NOTE, asOf: '2026-06-01T00:00:00.000Z' },
    })
    expect(result.success).toBe(false)
  })

  it('rejects a statusNote with an unrecognized extra property (strict)', () => {
    const result = GroupBuySchema.safeParse({
      ...VALID,
      status: 'delayed',
      statusNote: { ...STATUS_NOTE, extra: 'nope' },
    })
    expect(result.success).toBe(false)
  })
})
