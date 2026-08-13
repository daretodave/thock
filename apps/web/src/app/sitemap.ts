import type { MetadataRoute } from 'next'
import {
  getAllArticles,
  getAllBoards,
  getAllGroupBuys,
  getAllKeycapSets,
  getAllNewsletters,
  getAllSwitches,
  getAllTags,
  getAllTrendSnapshots,
  getAllVendors,
  getArticlesByTag,
  getLatestTrendSnapshot,
} from '@/lib/data-runtime'
import { canonicalUrl, PILLARS } from '@thock/seo'

/** Latest of a list of ISO date strings, or undefined for an empty list. */
function latestOf(dates: string[]): string | undefined {
  return dates.length === 0
    ? undefined
    : dates.reduce((latest, d) => (d > latest ? d : latest))
}

/**
 * Enumerates every URL the site contracts in `bearings.md`. Article
 * and tag slugs come from `@thock/content` so adding new content
 * registers automatically — no manual sitemap edits.
 *
 * `lastModified` is derived from real content-change data wherever
 * a page has underlying records driving it — including interactive
 * tools (quiz, compare) that render the switch/keycap-set/board
 * catalog. Only genuinely static prose pages with no backing data
 * (`/about`, `/search`, `/tools`) omit the field rather than
 * stamping build-time "now" — a build-time timestamp on an
 * unchanged page reports a false "just updated" signal on every
 * deploy, which search engines can discount site-wide once detected.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()
  const articleDate = (a: (typeof articles)[number]) =>
    a.frontmatter.updatedAt ?? a.frontmatter.publishedAt
  const latestArticleDate = latestOf(articles.map(articleDate))
  const latestByPillar = (pillarSlug: string) =>
    latestOf(
      articles
        .filter((a) => a.frontmatter.pillar === pillarSlug)
        .map(articleDate),
    )

  const groupBuys = getAllGroupBuys()
  const activeGroupBuys = groupBuys.filter(
    (g) => g.status === 'live' || g.status === 'announced',
  )
  const closedGroupBuys = groupBuys.filter(
    (g) => g.status === 'closed' || g.status === 'shipped',
  )

  const vendors = getAllVendors()
  const switches = getAllSwitches()
  const keycapSets = getAllKeycapSets()
  const boards = getAllBoards()
  const newsletters = getAllNewsletters()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: canonicalUrl('/'), lastModified: latestArticleDate, priority: 1.0 },
    {
      url: canonicalUrl('/news'),
      lastModified: latestByPillar('news'),
      priority: 0.7,
    },
    {
      url: canonicalUrl('/trends'),
      lastModified: latestByPillar('trends'),
      priority: 0.7,
    },
    {
      url: canonicalUrl('/trends/tracker'),
      lastModified: getLatestTrendSnapshot()?.updatedAt,
      priority: 0.8,
    },
    {
      url: canonicalUrl('/ideas'),
      lastModified: latestByPillar('ideas'),
      priority: 0.7,
    },
    {
      url: canonicalUrl('/deep-dives'),
      lastModified: latestByPillar('deep-dives'),
      priority: 0.7,
    },
    {
      url: canonicalUrl('/guides'),
      lastModified: latestByPillar('guides'),
      priority: 0.7,
    },
    {
      url: canonicalUrl('/group-buys'),
      lastModified: latestOf(activeGroupBuys.map((g) => g.updatedAt)),
      priority: 0.6,
    },
    {
      url: canonicalUrl('/group-buys/past'),
      lastModified: latestOf(closedGroupBuys.map((g) => g.updatedAt)),
      priority: 0.5,
    },
    {
      url: canonicalUrl('/quiz/switch'),
      lastModified: latestOf(switches.map((s) => s.updatedAt)),
      priority: 0.7,
    },
    {
      url: canonicalUrl('/quiz/keycap-set'),
      lastModified: latestOf(keycapSets.map((k) => k.updatedAt)),
      priority: 0.7,
    },
    { url: canonicalUrl('/about'), priority: 0.4 },
    {
      url: canonicalUrl('/newsletter'),
      lastModified: latestOf(newsletters.map((n) => n.frontmatter.publishedAt)),
      priority: 0.4,
    },
    { url: canonicalUrl('/search'), priority: 0.4 },
    {
      url: canonicalUrl('/sources'),
      lastModified: latestArticleDate,
      priority: 0.4,
    },
    {
      url: canonicalUrl('/archive'),
      lastModified: latestArticleDate,
      priority: 0.5,
    },
    {
      url: canonicalUrl('/tags'),
      lastModified: latestArticleDate,
      priority: 0.5,
    },
    {
      url: canonicalUrl('/parts'),
      lastModified: latestOf([
        ...switches.map((s) => s.updatedAt),
        ...keycapSets.map((k) => k.updatedAt),
        ...boards.map((b) => b.updatedAt),
      ]),
      priority: 0.6,
    },
    {
      url: canonicalUrl('/compare/switch'),
      lastModified: latestOf(switches.map((s) => s.updatedAt)),
      priority: 0.6,
    },
    {
      url: canonicalUrl('/compare/board'),
      lastModified: latestOf(boards.map((b) => b.updatedAt)),
      priority: 0.6,
    },
    { url: canonicalUrl('/tools'), priority: 0.7 },
    {
      url: canonicalUrl('/vendors'),
      lastModified: latestOf(vendors.map((v) => v.updatedAt)),
      priority: 0.6,
    },
    {
      url: canonicalUrl('/feed.xml'),
      lastModified: latestArticleDate,
      priority: 0.3,
    },
    ...PILLARS.map((p) => ({
      url: canonicalUrl(`/feed/${p.slug}.xml`),
      lastModified: latestByPillar(p.slug),
      priority: 0.3,
    })),
  ]

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: canonicalUrl(`/article/${a.slug}`),
    lastModified: articleDate(a),
    priority: 0.8,
  }))

  const tagEntries: MetadataRoute.Sitemap = getAllTags()
    .map((t) => ({ tag: t, articles: getArticlesByTag(t.slug) }))
    .filter(({ articles }) => articles.length > 0)
    .map(({ tag, articles }) => ({
      url: canonicalUrl(`/tag/${tag.slug}`),
      lastModified: articles
        .map((a) => a.frontmatter.updatedAt ?? a.frontmatter.publishedAt)
        .reduce((latest, d) => (d > latest ? d : latest)),
      priority: 0.5,
    }))

  const partKindEntries: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl('/part/switch'),
      lastModified: latestOf(switches.map((s) => s.updatedAt)),
      priority: 0.6,
    },
    {
      url: canonicalUrl('/part/keycap-set'),
      lastModified: latestOf(keycapSets.map((k) => k.updatedAt)),
      priority: 0.6,
    },
    {
      url: canonicalUrl('/part/board'),
      lastModified: latestOf(boards.map((b) => b.updatedAt)),
      priority: 0.6,
    },
  ]

  const switchEntries: MetadataRoute.Sitemap = switches.map((s) => ({
    url: canonicalUrl(`/part/switch/${s.slug}`),
    lastModified: s.updatedAt,
    priority: 0.6,
  }))
  const keycapSetEntries: MetadataRoute.Sitemap = keycapSets.map((k) => ({
    url: canonicalUrl(`/part/keycap-set/${k.slug}`),
    lastModified: k.updatedAt,
    priority: 0.6,
  }))
  const boardEntries: MetadataRoute.Sitemap = boards.map((b) => ({
    url: canonicalUrl(`/part/board/${b.slug}`),
    lastModified: b.updatedAt,
    priority: 0.6,
  }))

  // The latest week canonicalizes to the evergreen /trends/tracker
  // dashboard (already a static entry above) — see [week]/page.tsx
  // generateMetadata. Listing it again under its own path here would
  // put a non-canonical URL in the sitemap.
  const latestIsoWeek = getLatestTrendSnapshot()?.isoWeek
  const trackerWeekEntries: MetadataRoute.Sitemap = getAllTrendSnapshots()
    .filter((s) => s.isoWeek !== latestIsoWeek)
    .map((s) => ({
      url: canonicalUrl(`/trends/tracker/${s.isoWeek}`),
      lastModified: s.updatedAt,
      priority: 0.7,
    }))

  const vendorEntries: MetadataRoute.Sitemap = vendors.map((v) => ({
    url: canonicalUrl(`/vendor/${v.slug}`),
    lastModified: v.updatedAt,
    priority: 0.6,
  }))

  const newsletterEntries: MetadataRoute.Sitemap = newsletters.map((n) => ({
    url: canonicalUrl(`/newsletter/${n.slug}`),
    lastModified: n.frontmatter.publishedAt,
    priority: 0.4,
  }))

  return [
    ...staticEntries,
    ...articleEntries,
    ...tagEntries,
    ...partKindEntries,
    ...switchEntries,
    ...keycapSetEntries,
    ...boardEntries,
    ...trackerWeekEntries,
    ...vendorEntries,
    ...newsletterEntries,
  ]
}
