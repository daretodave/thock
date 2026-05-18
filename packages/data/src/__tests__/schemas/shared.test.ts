import { describe, expect, it } from 'vitest'
import {
  CountryCodeSchema,
  DateOnlySchema,
  HousingMaterialSchema,
  IsoDateSchema,
  IsoWeekSchema,
  SlugSchema,
  StemMaterialSchema,
  UrlSchema,
} from '../../schemas/shared'

describe('SlugSchema', () => {
  it('accepts a valid kebab-case slug', () => {
    expect(SlugSchema.safeParse('gateron-oil-king').success).toBe(true)
  })

  it('accepts a single-segment slug', () => {
    expect(SlugSchema.safeParse('cannonkeys').success).toBe(true)
  })

  it('rejects an uppercase slug', () => {
    expect(SlugSchema.safeParse('Gateron-Oil-King').success).toBe(false)
  })

  it('rejects a slug with spaces', () => {
    expect(SlugSchema.safeParse('gateron oil king').success).toBe(false)
  })

  it('rejects a single-character slug (min 2)', () => {
    expect(SlugSchema.safeParse('g').success).toBe(false)
  })
})

describe('IsoDateSchema', () => {
  it('accepts a valid ISO 8601 timestamp with UTC offset', () => {
    expect(IsoDateSchema.safeParse('2026-05-08T00:00:00.000Z').success).toBe(true)
  })

  it('rejects a date-only string', () => {
    expect(IsoDateSchema.safeParse('2026-05-08').success).toBe(false)
  })
})

describe('DateOnlySchema', () => {
  it('accepts a valid YYYY-MM-DD date', () => {
    expect(DateOnlySchema.safeParse('2026-05-08').success).toBe(true)
  })

  it('rejects a full ISO timestamp', () => {
    expect(DateOnlySchema.safeParse('2026-05-08T00:00:00.000Z').success).toBe(false)
  })

  it('rejects slash-separated dates', () => {
    expect(DateOnlySchema.safeParse('2026/05/08').success).toBe(false)
  })
})

describe('UrlSchema', () => {
  it('accepts a valid https URL', () => {
    expect(UrlSchema.safeParse('https://thock.xyz').success).toBe(true)
  })

  it('accepts a valid http URL', () => {
    expect(UrlSchema.safeParse('http://example.com').success).toBe(true)
  })

  it('rejects a bare domain without scheme', () => {
    expect(UrlSchema.safeParse('thock.xyz').success).toBe(false)
  })
})

describe('CountryCodeSchema', () => {
  it('accepts a valid 2-letter uppercase code', () => {
    expect(CountryCodeSchema.safeParse('US').success).toBe(true)
  })

  it('rejects a lowercase code', () => {
    expect(CountryCodeSchema.safeParse('us').success).toBe(false)
  })

  it('rejects a 3-letter code', () => {
    expect(CountryCodeSchema.safeParse('USA').success).toBe(false)
  })
})

describe('IsoWeekSchema', () => {
  it('accepts a valid ISO 8601 week (2026-W19)', () => {
    expect(IsoWeekSchema.safeParse('2026-W19').success).toBe(true)
  })

  it('accepts week 01', () => {
    expect(IsoWeekSchema.safeParse('2026-W01').success).toBe(true)
  })

  it('accepts week 53 boundary', () => {
    expect(IsoWeekSchema.safeParse('2020-W53').success).toBe(true)
  })

  it('rejects a non-padded week number', () => {
    expect(IsoWeekSchema.safeParse('2026-W9').success).toBe(false)
  })

  it('rejects year-last format', () => {
    expect(IsoWeekSchema.safeParse('W19-2026').success).toBe(false)
  })

  it('rejects a plain date', () => {
    expect(IsoWeekSchema.safeParse('2026-19').success).toBe(false)
  })
})

describe('HousingMaterialSchema', () => {
  it('accepts a valid housing material (nylon)', () => {
    expect(HousingMaterialSchema.safeParse('nylon').success).toBe(true)
  })

  it('accepts the "unknown" sentinel', () => {
    expect(HousingMaterialSchema.safeParse('unknown').success).toBe(true)
  })

  it('rejects an unlisted material', () => {
    expect(HousingMaterialSchema.safeParse('titanium').success).toBe(false)
  })
})

describe('StemMaterialSchema', () => {
  it('accepts a valid stem material (pom)', () => {
    expect(StemMaterialSchema.safeParse('pom').success).toBe(true)
  })

  it('accepts the "unknown" sentinel', () => {
    expect(StemMaterialSchema.safeParse('unknown').success).toBe(true)
  })

  it('rejects an unlisted material', () => {
    expect(StemMaterialSchema.safeParse('brass').success).toBe(false)
  })
})
