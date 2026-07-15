import { describe, expect, it, vi } from 'vitest'
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
  getGroupBuyBySlug,
  getLatestTrendSnapshot,
  getAllVendors,
  getVendorBySlug,
  getAllTrendSnapshots,
  getTrendSnapshot,
  getAllNewsletters,
  getNewsletterBySlug,
  getArticlesMentioningPart,
  manifestGeneratedAt,
  getAllSwitches,
  getSwitchBySlug,
  getAllKeycapSets,
  getKeycapSetBySlug,
  getAllBoards,
  getBoardBySlug,
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

  it('active group buys includes a non-closed buy whose endDate is in the future', async () => {
    // As of 2026-07-15 every real group-buy record has closed (see
    // cannonkeys-mode-sonnet-r2, flipped to 'closed' this tick), so this
    // invariant is exercised against a synthetic manifest rather than real
    // editorial data — avoids re-breaking every time the last live record
    // closes. Mirrors the same fixture pattern used in
    // packages/data/src/__tests__/loaders/group-buys.test.ts.
    vi.resetModules()
    vi.doMock('../manifest.generated.json', () => ({
      default: {
        switches: [],
        keycapSets: [],
        boards: [],
        vendors: [],
        groupBuys: [
          {
            slug: 'fixture-live-buy',
            name: 'Fixture Live Buy',
            vendorSlug: 'cannonkeys',
            productSlug: null,
            productKind: 'other',
            startDate: '2026-06-01',
            endDate: '2099-01-01',
            region: 'global',
            url: 'https://example.com',
            imageUrl: null,
            heroImage: null,
            status: 'live',
            description: 'Synthetic fixture group buy for date-window filter tests.',
            updatedAt: '2026-06-01T00:00:00.000Z',
          },
        ],
        trends: [],
        articles: [],
        newsletters: [],
        tags: [],
        generatedAt: '2026-06-01T00:00:00.000Z',
      },
    }))
    try {
      const mod = await import('../index')
      const active = mod.getActiveGroupBuys(new Date('2026-07-15T00:00:00Z'))
      expect(active.map((g) => g.slug)).toContain('fixture-live-buy')
    } finally {
      vi.doUnmock('../manifest.generated.json')
      vi.resetModules()
    }
  })

  it('active group buys excludes announced buy whose endDate is in the past', () => {
    // Same buy — a reference date after the end date must NOT include it.
    const afterEnd = new Date('2026-07-16T00:00:00Z')
    const active = getActiveGroupBuys(afterEnd)
    const slugs = active.map((g) => g.slug)
    expect(slugs).not.toContain('cannonkeys-mode-sonnet-r2')
  })

  it('past group buys includes closed/shipped + lapsed-live and lapsed-announced, sorted endDate desc', () => {
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

  it('past group buys includes lapsed-announced (status announced + endDate past)', () => {
    // cannonkeys-mode-sonnet-r2 is announced with endDate 2026-07-15.
    // A reference date after that endDate must include it in the closed list.
    const afterEnd = new Date('2026-07-16T00:00:00Z')
    const past = getAllClosedGroupBuys(afterEnd)
    const slugs = past.map((g) => g.slug)
    expect(slugs).toContain('cannonkeys-mode-sonnet-r2')
  })

  it('past group buys excludes a non-closed buy whose endDate is still in the future', async () => {
    // As of 2026-07-15 every real group-buy record has closed (see
    // cannonkeys-mode-sonnet-r2, flipped to 'closed' this tick), so this
    // invariant is exercised against a synthetic manifest rather than real
    // editorial data — mirrors the fixture pattern used in the sibling
    // "active group buys includes..." test above.
    vi.resetModules()
    vi.doMock('../manifest.generated.json', () => ({
      default: {
        switches: [],
        keycapSets: [],
        boards: [],
        vendors: [],
        groupBuys: [
          {
            slug: 'fixture-live-buy',
            name: 'Fixture Live Buy',
            vendorSlug: 'cannonkeys',
            productSlug: null,
            productKind: 'other',
            startDate: '2026-06-01',
            endDate: '2099-01-01',
            region: 'global',
            url: 'https://example.com',
            imageUrl: null,
            heroImage: null,
            status: 'live',
            description: 'Synthetic fixture group buy for date-window filter tests.',
            updatedAt: '2026-06-01T00:00:00.000Z',
          },
        ],
        trends: [],
        articles: [],
        newsletters: [],
        tags: [],
        generatedAt: '2026-06-01T00:00:00.000Z',
      },
    }))
    try {
      const mod = await import('../index')
      const past = mod.getAllClosedGroupBuys(new Date('2026-07-15T00:00:00Z'))
      expect(past.map((g) => g.slug)).not.toContain('fixture-live-buy')
    } finally {
      vi.doUnmock('../manifest.generated.json')
      vi.resetModules()
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

  it('exposes all switches', () => {
    const switches = getAllSwitches()
    expect(switches.length).toBeGreaterThanOrEqual(1)
    for (const sw of switches) {
      expect(sw.slug).toBeTruthy()
      expect(['linear', 'tactile', 'clicky', 'silent-linear', 'silent-tactile']).toContain(sw.type)
    }
  })

  it('looks up a switch by slug', () => {
    const sw = getSwitchBySlug('gateron-oil-king')
    expect(sw).not.toBeNull()
    expect(sw!.slug).toBe('gateron-oil-king')
  })

  it('returns null for an unknown switch slug', () => {
    expect(getSwitchBySlug('this-switch-does-not-exist')).toBeNull()
  })

  it('exposes all keycap sets', () => {
    const sets = getAllKeycapSets()
    expect(sets.length).toBeGreaterThanOrEqual(1)
    for (const ks of sets) {
      expect(ks.slug).toBeTruthy()
    }
  })

  it('looks up a keycap set by slug', () => {
    const ks = getKeycapSetBySlug('gmk-olivia')
    expect(ks).not.toBeNull()
    expect(ks!.slug).toBe('gmk-olivia')
  })

  it('returns null for an unknown keycap set slug', () => {
    expect(getKeycapSetBySlug('this-keycap-set-does-not-exist')).toBeNull()
  })

  it('exposes all boards', () => {
    const boards = getAllBoards()
    expect(boards.length).toBeGreaterThanOrEqual(1)
    for (const b of boards) {
      expect(b.slug).toBeTruthy()
    }
  })

  it('looks up a board by slug', () => {
    const board = getBoardBySlug('mode-sonnet')
    expect(board).not.toBeNull()
    expect(board!.slug).toBe('mode-sonnet')
  })

  it('returns null for an unknown board slug', () => {
    expect(getBoardBySlug('this-board-does-not-exist')).toBeNull()
  })

  it('looks up a group buy by slug', () => {
    const gb = getGroupBuyBySlug('kbdfans-gmk-cyl-greg-2')
    expect(gb).not.toBeNull()
    expect(gb!.slug).toBe('kbdfans-gmk-cyl-greg-2')
  })

  it('returns null for an unknown group buy slug', () => {
    expect(getGroupBuyBySlug('this-group-buy-does-not-exist')).toBeNull()
  })
})
