import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { VercelAnalytics, __test_only__ } from '../VercelAnalytics'

describe('VercelAnalytics analytics gate', () => {
  const ORIGINAL = process.env['DISABLE_ANALYTICS']

  beforeEach(() => {
    delete process.env['DISABLE_ANALYTICS']
  })

  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env['DISABLE_ANALYTICS']
    else process.env['DISABLE_ANALYTICS'] = ORIGINAL
  })

  it('returns null when DISABLE_ANALYTICS=1 (e2e / automated traffic)', () => {
    process.env['DISABLE_ANALYTICS'] = '1'
    expect(__test_only__.isAnalyticsDisabled()).toBe(true)
    expect(VercelAnalytics()).toBeNull()
  })

  it('renders the Analytics element when DISABLE_ANALYTICS is unset', () => {
    expect(__test_only__.isAnalyticsDisabled()).toBe(false)
    expect(VercelAnalytics()).not.toBeNull()
  })

  it('only suppresses on the literal string "1" (not "true", not "0", not empty)', () => {
    for (const v of ['true', '0', '', 'yes']) {
      process.env['DISABLE_ANALYTICS'] = v
      expect(__test_only__.isAnalyticsDisabled(), `value="${v}"`).toBe(false)
    }
  })
})
