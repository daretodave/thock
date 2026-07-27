import { describe, expect, it } from 'vitest'
import manifest from '../manifest'
import { siteConfig } from '@thock/seo'

describe('manifest', () => {
  const m = manifest()
  const hexColor = /^#[0-9a-f]{6}$/i

  it('names the app after siteConfig', () => {
    expect(m.name).toBe(siteConfig.name)
    expect(m.short_name).toBe(siteConfig.name)
    expect(m.description).toBe(siteConfig.description)
  })

  it('opens at the site root in standalone display mode', () => {
    expect(m.start_url).toBe('/')
    expect(m.display).toBe('standalone')
  })

  it('carries valid hex colors for theme and background', () => {
    expect(m.theme_color).toMatch(hexColor)
    expect(m.background_color).toMatch(hexColor)
  })

  it('lists resolvable icons with sizes and mime types', () => {
    expect(m.icons?.length).toBeGreaterThan(0)
    for (const icon of m.icons ?? []) {
      expect(icon.src).toMatch(/^\//)
      expect(icon.sizes).toBeTruthy()
      expect(icon.type).toBeTruthy()
    }
  })
})
