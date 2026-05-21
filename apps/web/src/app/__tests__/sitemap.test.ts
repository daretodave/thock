import { describe, expect, it } from 'vitest'
import sitemap from '../sitemap'
import { canonicalUrl, PILLARS } from '@thock/seo'
import {
  getAllArticles,
  getAllBoards,
  getAllKeycapSets,
  getAllSwitches,
  getAllTags,
  getAllTrendSnapshots,
  getArticlesByTag,
} from '@/lib/data-runtime'

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

  it('includes every tag slug that has at least one article', () => {
    for (const t of getAllTags()) {
      if (getArticlesByTag(t.slug).length > 0) {
        expect(urls).toContain(canonicalUrl(`/tag/${t.slug}`))
      }
    }
  })

  it('excludes orphaned tag slugs (tags with no articles) from the sitemap', () => {
    for (const t of getAllTags()) {
      if (getArticlesByTag(t.slug).length === 0) {
        expect(urls).not.toContain(canonicalUrl(`/tag/${t.slug}`))
      }
    }
  })

  it('includes /tags, /quiz/switch, /group-buys/past, /parts (phases 28, 33, 29, 35)', () => {
    for (const path of ['/tags', '/quiz/switch', '/group-buys/past', '/parts']) {
      expect(urls).toContain(canonicalUrl(path))
    }
  })

  it('includes every tracker archive week (phase 27)', () => {
    for (const s of getAllTrendSnapshots()) {
      expect(urls).toContain(canonicalUrl(`/trends/tracker/${s.isoWeek}`))
    }
  })

  it('includes all /part/[kind] index pages (phase 21)', () => {
    for (const kind of ['switch', 'keycap-set', 'board']) {
      expect(urls).toContain(canonicalUrl(`/part/${kind}`))
    }
  })

  it('includes every part detail slug (phase 21)', () => {
    for (const s of getAllSwitches()) {
      expect(urls).toContain(canonicalUrl(`/part/switch/${s.slug}`))
    }
    for (const k of getAllKeycapSets()) {
      expect(urls).toContain(canonicalUrl(`/part/keycap-set/${k.slug}`))
    }
    for (const b of getAllBoards()) {
      expect(urls).toContain(canonicalUrl(`/part/board/${b.slug}`))
    }
  })

  it('uses absolute urls everywhere', () => {
    for (const e of map) {
      expect(e.url).toMatch(/^https?:\/\//)
    }
  })
})
