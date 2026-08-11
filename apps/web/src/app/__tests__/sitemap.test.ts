import { describe, expect, it } from 'vitest'
import sitemap from '../sitemap'
import { canonicalUrl, PILLARS } from '@thock/seo'
import {
  getAllArticles,
  getAllBoards,
  getAllGroupBuys,
  getAllKeycapSets,
  getAllSwitches,
  getAllTags,
  getAllTrendSnapshots,
  getAllVendors,
  getArticlesByTag,
  getLatestTrendSnapshot,
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

  it('derives tag lastModified from the newest tagged article, not the build timestamp', () => {
    for (const t of getAllTags()) {
      const articles = getArticlesByTag(t.slug)
      if (articles.length === 0) continue
      const expected = articles
        .map((a) => a.frontmatter.updatedAt ?? a.frontmatter.publishedAt)
        .reduce((latest, d) => (d > latest ? d : latest))
      const entry = map.find((e) => e.url === canonicalUrl(`/tag/${t.slug}`))
      expect(entry?.lastModified).toBe(expected)
    }
  })

  it('includes /tags, /quiz/switch, /quiz/keycap-set, /group-buys/past, /parts (phases 28, 33, 47, 29, 35)', () => {
    for (const path of ['/tags', '/quiz/switch', '/quiz/keycap-set', '/group-buys/past', '/parts']) {
      expect(urls).toContain(canonicalUrl(path))
    }
  })

  it('includes every archived tracker week, but not the latest week under its own path (it canonicalizes to /trends/tracker)', () => {
    const latestIsoWeek = getLatestTrendSnapshot()?.isoWeek
    for (const s of getAllTrendSnapshots()) {
      if (s.isoWeek === latestIsoWeek) {
        expect(urls).not.toContain(canonicalUrl(`/trends/tracker/${s.isoWeek}`))
      } else {
        expect(urls).toContain(canonicalUrl(`/trends/tracker/${s.isoWeek}`))
      }
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

  it('derives home/pillar/feed lastModified from the newest article, not the build timestamp', () => {
    const articles = getAllArticles()
    const articleDate = (a: (typeof articles)[number]) =>
      a.frontmatter.updatedAt ?? a.frontmatter.publishedAt
    const expectedLatest = articles
      .map(articleDate)
      .reduce((latest, d) => (d > latest ? d : latest))
    for (const path of ['/', '/sources', '/archive', '/tags', '/feed.xml']) {
      const entry = map.find((e) => e.url === canonicalUrl(path))
      expect(entry?.lastModified).toBe(expectedLatest)
    }
    for (const p of PILLARS) {
      const expected = articles
        .filter((a) => a.frontmatter.pillar === p.slug)
        .map(articleDate)
        .reduce((latest, d) => (d > latest ? d : latest))
      const entry = map.find((e) => e.url === canonicalUrl(p.href))
      expect(entry?.lastModified).toBe(expected)
    }
  })

  it('omits lastModified on genuinely static prose pages (no build-time timestamp)', () => {
    for (const path of ['/about', '/search', '/tools']) {
      const entry = map.find((e) => e.url === canonicalUrl(path))
      expect(entry?.lastModified).toBeUndefined()
    }
  })

  it('derives quiz/compare lastModified from the catalog they render, not the build timestamp', () => {
    const expectedSwitches = getAllSwitches()
      .map((s) => s.updatedAt)
      .reduce((latest, d) => (d > latest ? d : latest))
    const expectedKeycapSets = getAllKeycapSets()
      .map((k) => k.updatedAt)
      .reduce((latest, d) => (d > latest ? d : latest))
    const expectedBoards = getAllBoards()
      .map((b) => b.updatedAt)
      .reduce((latest, d) => (d > latest ? d : latest))

    expect(
      map.find((e) => e.url === canonicalUrl('/quiz/switch'))?.lastModified,
    ).toBe(expectedSwitches)
    expect(
      map.find((e) => e.url === canonicalUrl('/compare/switch'))
        ?.lastModified,
    ).toBe(expectedSwitches)
    expect(
      map.find((e) => e.url === canonicalUrl('/quiz/keycap-set'))
        ?.lastModified,
    ).toBe(expectedKeycapSets)
    expect(
      map.find((e) => e.url === canonicalUrl('/compare/board'))?.lastModified,
    ).toBe(expectedBoards)
  })

  it('is stable across calls for static pages (no Date.now() drift)', () => {
    const second = sitemap()
    const about = map.find((e) => e.url === canonicalUrl('/about'))
    const aboutAgain = second.find((e) => e.url === canonicalUrl('/about'))
    expect(about?.lastModified).toBe(aboutAgain?.lastModified)
    const home = map.find((e) => e.url === canonicalUrl('/'))
    const homeAgain = second.find((e) => e.url === canonicalUrl('/'))
    expect(home?.lastModified).toBe(homeAgain?.lastModified)
  })

  it('derives /group-buys, /group-buys/past, /vendors, /parts lastModified from their own records', () => {
    const groupBuys = getAllGroupBuys()
    const active = groupBuys.filter(
      (g) => g.status === 'live' || g.status === 'announced',
    )
    const closed = groupBuys.filter(
      (g) => g.status === 'closed' || g.status === 'shipped',
    )
    const expectedActive = active
      .map((g) => g.updatedAt)
      .reduce((latest, d) => (d > latest ? d : latest), '')
    const expectedClosed = closed
      .map((g) => g.updatedAt)
      .reduce((latest, d) => (d > latest ? d : latest), '')
    expect(
      map.find((e) => e.url === canonicalUrl('/group-buys'))?.lastModified,
    ).toBe(expectedActive || undefined)
    expect(
      map.find((e) => e.url === canonicalUrl('/group-buys/past'))
        ?.lastModified,
    ).toBe(expectedClosed || undefined)

    const vendors = getAllVendors()
    const expectedVendor = vendors
      .map((v) => v.updatedAt)
      .reduce((latest, d) => (d > latest ? d : latest))
    expect(
      map.find((e) => e.url === canonicalUrl('/vendors'))?.lastModified,
    ).toBe(expectedVendor)

    const parts = [
      ...getAllSwitches().map((s) => s.updatedAt),
      ...getAllKeycapSets().map((k) => k.updatedAt),
      ...getAllBoards().map((b) => b.updatedAt),
    ]
    const expectedParts = parts.reduce((latest, d) => (d > latest ? d : latest))
    expect(
      map.find((e) => e.url === canonicalUrl('/parts'))?.lastModified,
    ).toBe(expectedParts)
  })
})
