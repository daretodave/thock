import type { MetadataRoute } from 'next'
import {
  getAllArticles,
  getAllBoards,
  getAllKeycapSets,
  getAllSwitches,
  getAllTags,
  getAllTrendSnapshots,
} from '@/lib/data-runtime'
import { canonicalUrl, PILLARS } from '@thock/seo'

/**
 * Enumerates every URL the site contracts in `bearings.md`. Article
 * and tag slugs come from `@thock/content` so adding new content
 * registers automatically — no manual sitemap edits.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const staticEntries: MetadataRoute.Sitemap = [
    { url: canonicalUrl('/'), lastModified: now, priority: 1.0 },
    { url: canonicalUrl('/news'), lastModified: now, priority: 0.7 },
    { url: canonicalUrl('/trends'), lastModified: now, priority: 0.7 },
    {
      url: canonicalUrl('/trends/tracker'),
      lastModified: now,
      priority: 0.8,
    },
    { url: canonicalUrl('/ideas'), lastModified: now, priority: 0.7 },
    { url: canonicalUrl('/deep-dives'), lastModified: now, priority: 0.7 },
    { url: canonicalUrl('/guides'), lastModified: now, priority: 0.7 },
    { url: canonicalUrl('/group-buys'), lastModified: now, priority: 0.6 },
    {
      url: canonicalUrl('/group-buys/past'),
      lastModified: now,
      priority: 0.5,
    },
    { url: canonicalUrl('/quiz/switch'), lastModified: now, priority: 0.7 },
    { url: canonicalUrl('/about'), lastModified: now, priority: 0.4 },
    { url: canonicalUrl('/newsletter'), lastModified: now, priority: 0.4 },
    { url: canonicalUrl('/search'), lastModified: now, priority: 0.4 },
    { url: canonicalUrl('/sources'), lastModified: now, priority: 0.4 },
    { url: canonicalUrl('/tags'), lastModified: now, priority: 0.5 },
    { url: canonicalUrl('/feed.xml'), lastModified: now, priority: 0.3 },
    ...PILLARS.map((p) => ({
      url: canonicalUrl(`/feed/${p.slug}.xml`),
      lastModified: now,
      priority: 0.3,
    })),
  ]

  const articleEntries: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: canonicalUrl(`/article/${a.slug}`),
    lastModified: a.frontmatter.updatedAt ?? a.frontmatter.publishedAt,
    priority: 0.8,
  }))

  const tagEntries: MetadataRoute.Sitemap = getAllTags().map((t) => ({
    url: canonicalUrl(`/tag/${t.slug}`),
    lastModified: now,
    priority: 0.5,
  }))

  const partKindEntries: MetadataRoute.Sitemap = [
    { url: canonicalUrl('/part/switch'), lastModified: now, priority: 0.6 },
    {
      url: canonicalUrl('/part/keycap-set'),
      lastModified: now,
      priority: 0.6,
    },
    { url: canonicalUrl('/part/board'), lastModified: now, priority: 0.6 },
  ]

  const switchEntries: MetadataRoute.Sitemap = getAllSwitches().map((s) => ({
    url: canonicalUrl(`/part/switch/${s.slug}`),
    lastModified: s.updatedAt,
    priority: 0.6,
  }))
  const keycapSetEntries: MetadataRoute.Sitemap = getAllKeycapSets().map(
    (k) => ({
      url: canonicalUrl(`/part/keycap-set/${k.slug}`),
      lastModified: k.updatedAt,
      priority: 0.6,
    }),
  )
  const boardEntries: MetadataRoute.Sitemap = getAllBoards().map((b) => ({
    url: canonicalUrl(`/part/board/${b.slug}`),
    lastModified: b.updatedAt,
    priority: 0.6,
  }))

  const trackerWeekEntries: MetadataRoute.Sitemap = getAllTrendSnapshots().map(
    (s) => ({
      url: canonicalUrl(`/trends/tracker/${s.isoWeek}`),
      lastModified: s.publishedAt,
      priority: 0.7,
    }),
  )

  return [
    ...staticEntries,
    ...articleEntries,
    ...tagEntries,
    ...partKindEntries,
    ...switchEntries,
    ...keycapSetEntries,
    ...boardEntries,
    ...trackerWeekEntries,
  ]
}
