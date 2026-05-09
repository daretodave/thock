import { describe, expect, it } from 'vitest'
import { getCanonicalUrls } from '../canonical-urls'
import { PILLARS } from '@thock/seo'

describe('getCanonicalUrls', () => {
  const urls = getCanonicalUrls()
  const paths = urls.map((u) => u.path)

  it('includes every static landing path', () => {
    for (const path of [
      '/',
      '/news',
      '/trends',
      '/trends/tracker',
      '/ideas',
      '/deep-dives',
      '/guides',
      '/group-buys',
      '/about',
      '/newsletter',
      '/search',
      '/sources',
      '/sitemap.xml',
      '/robots.txt',
      '/feed.xml',
    ]) {
      expect(paths).toContain(path)
    }
  })

  it('includes at least one dynamic /article/<slug>', () => {
    expect(
      paths.some((p) => p.startsWith('/article/')),
      'expected at least one /article/* canonical URL',
    ).toBe(true)
  })

  it('includes at least one dynamic /tag/<slug>', () => {
    expect(
      paths.some((p) => p.startsWith('/tag/')),
      'expected at least one /tag/* canonical URL',
    ).toBe(true)
  })

  it('includes per-pillar feeds', () => {
    for (const p of PILLARS) {
      expect(paths).toContain(`/feed/${p.slug}.xml`)
    }
  })

  it('contains no duplicates', () => {
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('every entry has a known kind', () => {
    for (const u of urls) {
      expect(['html', 'xml', 'text']).toContain(u.kind)
    }
  })
})
