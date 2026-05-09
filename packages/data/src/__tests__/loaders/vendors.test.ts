import { afterEach, describe, expect, it } from 'vitest'
import { getAllVendors, getVendorBySlug } from '../../loaders/vendors'
import { __resetForTests } from '../../loaders/memo'

describe('vendors loader', () => {
  afterEach(() => __resetForTests())

  it('reads the seed vendor', () => {
    expect(getAllVendors().map((v) => v.slug)).toContain('cannonkeys')
  })

  it('resolves cannonkeys', () => {
    const v = getVendorBySlug('cannonkeys')
    expect(v?.countryCode).toBe('US')
  })

  it('returns null for unknown vendor', () => {
    expect(getVendorBySlug('made-up-vendor')).toBeNull()
  })
})
