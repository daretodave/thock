import { describe, expect, it } from 'vitest'
import sitemap from '../sitemap'
import { canonicalUrl, PILLARS } from '@thock/seo'
import { getAllArticles, getAllTags } from '@/lib/data-runtime'

describe('sitemap', () => {
  const map = sitemap()
  const urls = map.map((e) => e.url)

  it('includes the home page with priority 1', () => {
    const home = map.find((e) => e.url === canonicalUrl('/'))
    expect(home?.priority).toBe(1.0)
  })

  it('includes every pillar landing', () => {
    for (const p of PILLARS) {
      expect(urls).toContain(canonicalUrl(p.href))
    }
  })

  it('includes /trends/tracker', () => {
    expect(urls).toContain(canonicalUrl('/trends/tracker'))
  })

  it('includes /group-buys, /about, /newsletter, /search, /sources', () => {
    for (const path of [
      '/group-buys',
      '/about',
      '/newsletter',
      '/search',
      '/sources',
    ]) {
      expect(urls).toContain(canonicalUrl(path))
    }
  })

  it('includes the global RSS feed', () => {
    expect(urls).toContain(canonicalUrl('/feed.xml'))
  })

  it('includes per-pillar RSS feeds', () => {
    for (const p of PILLARS) {
      expect(urls).toContain(canonicalUrl(`/feed/${p.slug}.xml`))
    }
  })

  it('includes every article slug', () => {
    for (const a of getAllArticles()) {
      expect(urls).toContain(canonicalUrl(`/article/${a.slug}`))
    }
  })

  it('includes every tag slug', () => {
    for (const t of getAllTags()) {
      expect(urls).toContain(canonicalUrl(`/tag/${t.slug}`))
    }
  })

  it('uses absolute urls everywhere', () => {
    for (const e of map) {
      expect(e.url).toMatch(/^https?:\/\//)
    }
  })
})
