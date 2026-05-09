import { describe, expect, it } from 'vitest'
import robots from '../robots'
import { siteConfig } from '@thock/seo'

describe('robots', () => {
  const r = robots()

  it('allows everything for all user agents', () => {
    expect(r.rules).toEqual([{ userAgent: '*', allow: '/' }])
  })

  it('points at the absolute sitemap url', () => {
    expect(r.sitemap).toBe(`${siteConfig.url}/sitemap.xml`)
  })
})
