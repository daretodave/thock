import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GoogleTagManager, __test_only__ } from '../GoogleTagManager'

describe('GoogleTagManager constants', () => {
  it('uses the locked container ID', () => {
    expect(__test_only__.GTM_CONTAINER_ID).toBe('GTM-58T839ZD')
  })

  it('embeds the container ID in the snippet body', () => {
    expect(__test_only__.GTM_SNIPPET).toContain("'GTM-58T839ZD'")
  })

  it('targets googletagmanager.com (not a typo or rebrand)', () => {
    expect(__test_only__.GTM_SNIPPET).toContain(
      'https://www.googletagmanager.com/gtm.js',
    )
  })

  it('uses the dataLayer global per Google convention', () => {
    expect(__test_only__.GTM_SNIPPET).toContain("'dataLayer'")
    expect(__test_only__.GTM_SNIPPET).toContain('gtm.start')
  })
})

describe('GoogleTagManager analytics gate', () => {
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
    expect(GoogleTagManager()).toBeNull()
  })

  it('renders the Script element when DISABLE_ANALYTICS is unset', () => {
    expect(__test_only__.isAnalyticsDisabled()).toBe(false)
    expect(GoogleTagManager()).not.toBeNull()
  })

  it('only suppresses on the literal string "1" (not "true", not "0", not empty)', () => {
    for (const v of ['true', '0', '', 'yes']) {
      process.env['DISABLE_ANALYTICS'] = v
      expect(__test_only__.isAnalyticsDisabled(), `value="${v}"`).toBe(false)
    }
  })
})
