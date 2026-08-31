import { describe, expect, it } from 'vitest'
import nextConfig from '../../next.config.mjs'

describe('next.config.mjs — security headers', () => {
  const REQUIRED_HEADERS = [
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Content-Security-Policy',
    'Permissions-Policy',
  ]

  it('sends every required security header on every route', async () => {
    const rules = await nextConfig.headers!()
    const siteWide = rules.find((rule) => rule.source === '/(.*)')
    expect(siteWide).toBeDefined()

    const keys = siteWide!.headers.map((h) => h.key)
    for (const required of REQUIRED_HEADERS) {
      expect(keys).toContain(required)
    }
  })

  it('Permissions-Policy disables unused browser features', async () => {
    const rules = await nextConfig.headers!()
    const siteWide = rules.find((rule) => rule.source === '/(.*)')
    const permissionsPolicy = siteWide!.headers.find(
      (h) => h.key === 'Permissions-Policy',
    )

    expect(permissionsPolicy?.value).toContain('camera=()')
    expect(permissionsPolicy?.value).toContain('microphone=()')
    expect(permissionsPolicy?.value).toContain('geolocation=()')
  })

  it('Strict-Transport-Security covers subdomains and is preload-eligible', async () => {
    const rules = await nextConfig.headers!()
    const siteWide = rules.find((rule) => rule.source === '/(.*)')
    const hsts = siteWide!.headers.find((h) => h.key === 'Strict-Transport-Security')

    expect(hsts?.value).toContain('max-age=63072000')
    expect(hsts?.value).toContain('includeSubDomains')
    expect(hsts?.value).toContain('preload')
  })
})
