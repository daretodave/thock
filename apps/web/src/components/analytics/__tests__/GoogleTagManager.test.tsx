import { describe, expect, it } from 'vitest'
import { __test_only__ } from '../GoogleTagManager'

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
