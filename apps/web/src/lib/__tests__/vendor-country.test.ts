import { describe, it, expect } from 'vitest'
import { countryLabel } from '../vendor-country'

describe('countryLabel', () => {
  it('resolves known country codes to display names', () => {
    expect(countryLabel('US')).toBe('United States')
    expect(countryLabel('FR')).toBe('France')
  })

  it('falls back to the raw code for unknown countries', () => {
    expect(countryLabel('ZZ')).toBe('ZZ')
  })
})
