import { describe, expect, it } from 'vitest'
import {
  getAllArticles,
  getArticleBySlug,
  getArticlesByPillar,
  getArticlesByTag,
  getRelatedArticles,
  getReferencedParts,
  getAllTags,
  getTagBySlug,
  getActiveGroupBuys,
  getAllClosedGroupBuys,
  getAllGroupBuys,
  getLatestTrendSnapshot,
  getAllVendors,
  getVendorBySlug,
  getAllTrendSnapshots,
  getTrendSnapshot,
  getAllNewsletters,
  getNewsletterBySlug,
  getArticlesMentioningPart,
  manifestGeneratedAt,
} from '../index'

describe('data-runtime adapter', () => {
  it('exposes the seeded articles', () => {
    expect(getAllArticles().length).toBeGreaterThanOrEqual(6)
  })

  it('looks up an article by slug', () => {
    const article = getArticleBySlug('trends-tracker-preview')
    expect(article).not.toBeNull()
    expect(article!.slug).toBe('trends-tracker-preview')
  })

  it('returns null for an unknown slug', () => {
    expect(getArticleBySlug('this-does-not-exist')).toBeNull()
  })

  it('filters articles by pillar', () => {
    const news = getArticlesByPillar('news')
    expect(news.every((a) => a.frontmatter.pillar === 'news')).toBe(true)
  })

  it('filters articles by tag', () => {
    const linears = getArticlesByTag('linear')
    expect(linears.every((a) => a.frontmatter.tags.includes('linear'))).toBe(
      true,
    )
  })

  it('related articles excludes self', () => {
    const seed = getAllArticles()[0]!
    const related = getRelatedArticles(seed, 4)
    expect(related.every((a) => a.slug !== seed.slug)).toBe(true)
    expect(related.length).toBeLessThanOrEqual(4)
  })

  it('exposes tags sorted by slug', () => {
    const tags = getAllTags()
    expect(tags.length).toBeGreaterThan(0)
    for (let i = 1; i < tags.length; i++) {
      expect(tags[i]!.slug.localeCompare(tags[i - 1]!.slug)).toBeGreaterThan(-1)
    }
  })

  it('looks up a tag by slug', () => {
    const tag = getTagBySlug('linear')
    expect(tag?.slug).toBe('linear')
  })

  it('exposes group buys', () => {
    expect(getAllGroupBuys().length).toBeGreaterThanOrEqual(1)
  })

  it('active group buys excludes closed/shipped and past dates', () => {
    const futureRef = new Date('2020-01-01T00:00:00Z')
    const active = getActiveGroupBuys(futureRef)
    for (const g of active) {
      expect(['closed', 'shipped']).not.toContain(g.status)
    }
  })

  it('past group buys includes closed/shipped + lapsed-live, sorted endDate desc', () => {
    // Pick a reference date far in the future so every record qualifies as past.
    const farFuture = new Date('2099-12-31T00:00:00Z')
    const past = getAllClosedGroupBuys(farFuture)
    expect(past.length).toBeGreaterThanOrEqual(1)
    expect(past.length).toBe(getAllGroupBuys().length)
    for (let i = 1; i < past.length; i++) {
      expect(
        past[i - 1]!.endDate.localeCompare(past[i]!.endDate),
      ).toBeGreaterThanOrEqual(0)
    }
  })

  it('past group buys excludes future-dated live buys', () => {
    const pastRef = new Date('2000-01-01T00:00:00Z')
    const past = getAllClosedGroupBuys(pastRef)
    for (const g of past) {
      expect(['closed', 'shipped']).toContain(g.status)
    }
  })

  it('returns latest trend snapshot when present', () => {
    const snap = getLatestTrendSnapshot()
    expect(snap).not.toBeNull()
    expect(snap!.isoWeek).toMatch(/^\d{4}-W\d{2}$/)
  })

  it('resolves mentioned parts against the manifest', () => {
    const article = getAllArticles().find(
      (a) => a.frontmatter.mentionedParts.length > 0,
    )
    if (!article) return // skip when no seed article references parts
    const parts = getReferencedParts(article)
    expect(parts.length).toBeGreaterThanOrEqual(1)
    for (const p of parts) {
      expect(['switch', 'keycap-set', 'board']).toContain(p.kind)
      expect(p.record).toBeTruthy()
    }
  })

  it('drops mentioned parts whose slug does not resolve', () => {
    const article = getAllArticles()[0]!
    const fakeArticle = {
      ...article,
      frontmatter: {
        ...article.frontmatter,
        mentionedParts: [
          { id: 'fake', kind: 'switch' as const, slug: 'this-does-not-exist' },
        ],
      },
    }
    expect(getReferencedParts(fakeArticle)).toEqual([])
  })

  it('manifestGeneratedAt is an ISO timestamp', () => {
    expect(manifestGeneratedAt()).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    )
  })

  it('exposes all vendors sorted by slug', () => {
    const vendors = getAllVendors()
    expect(vendors.length).toBeGreaterThanOrEqual(1)
    for (let i = 1; i < vendors.length; i++) {
      expect(
        vendors[i]!.slug.localeCompare(vendors[i - 1]!.slug),
      ).toBeGreaterThanOrEqual(0)
    }
  })

  it('looks up a vendor by slug', () => {
    const vendor = getVendorBySlug('cannonkeys')
    expect(vendor).not.toBeNull()
    expect(vendor!.slug).toBe('cannonkeys')
  })

  it('returns null for an unknown vendor slug', () => {
    expect(getVendorBySlug('this-vendor-does-not-exist')).toBeNull()
  })

  it('exposes all trend snapshots', () => {
    const snaps = getAllTrendSnapshots()
    expect(snaps.length).toBeGreaterThanOrEqual(3)
    for (const s of snaps) {
      expect(s.isoWeek).toMatch(/^\d{4}-W\d{2}$/)
    }
  })

  it('looks up a trend snapshot by ISO week', () => {
    const snap = getTrendSnapshot('2026-W21')
    expect(snap).not.toBeNull()
    expect(snap!.isoWeek).toBe('2026-W21')
    expect(snap!.rows.length).toBeGreaterThan(0)
  })

  it('returns null for an unknown ISO week', () => {
    expect(getTrendSnapshot('2026-W99')).toBeNull()
  })

  it('exposes newsletters (empty is valid)', () => {
    const newsletters = getAllNewsletters()
    expect(Array.isArray(newsletters)).toBe(true)
  })

  it('returns null for an unknown newsletter slug', () => {
    expect(getNewsletterBySlug('this-newsletter-does-not-exist')).toBeNull()
  })

  it('getArticlesMentioningPart returns articles referencing a known switch', () => {
    const articles = getArticlesMentioningPart('switch', 'gateron-oil-king')
    expect(articles.length).toBeGreaterThanOrEqual(1)
    for (let i = 1; i < articles.length; i++) {
      expect(
        articles[i - 1]!.frontmatter.publishedAt.localeCompare(
          articles[i]!.frontmatter.publishedAt,
        ),
      ).toBeGreaterThanOrEqual(0)
    }
  })

  it('getArticlesMentioningPart returns empty array for unknown slug', () => {
    expect(
      getArticlesMentioningPart('switch', 'this-switch-does-not-exist'),
    ).toEqual([])
  })
})
