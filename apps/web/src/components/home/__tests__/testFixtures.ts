import type { Article, Tag } from '@thock/content'
import type { GroupBuy, TrendSnapshot, Vendor } from '@thock/data'

/**
 * Tiny fixtures shared across home component tests. Kept explicit
 * so each test reads as a single statement of intent.
 */

export function makeArticle(over: Partial<Article> = {}): Article {
  const fm: Article['frontmatter'] = {
    slug: 'a',
    title: 'Article A',
    lede: 'A lede that meets the schema minimum length requirement.',
    author: 'thock',
    pillar: 'news',
    tags: ['linear'],
    publishedAt: '2026-05-01T12:00:00.000Z',
    updatedAt: null,
    heroImage: null,
    heroImageAlt: null,
    featured: false,
    popularityScore: 10,
    guideSection: null,
    mentionedParts: [],
    ...((over.frontmatter as object) ?? {}),
  }
  return {
    slug: fm.slug,
    body: '',
    readTime: 5,
    filePath: `/tmp/${fm.slug}.mdx`,
    ...over,
    frontmatter: fm,
  }
}

export function makeTag(over: Partial<Tag> = {}): Tag {
  return {
    slug: 'linear',
    name: 'Linear',
    category: 'switch',
    ...over,
  }
}

export function makeGroupBuy(over: Partial<GroupBuy> = {}): GroupBuy {
  return {
    slug: 'gb',
    name: 'Group Buy',
    vendorSlug: 'novelkeys',
    productSlug: null,
    productKind: 'other',
    startDate: '2026-04-01',
    endDate: '2026-05-30',
    region: 'global',
    url: 'https://example.com/gb',
    imageUrl: null,
    heroImage: null,
    status: 'live',
    description:
      'A short description that is long enough to satisfy the schema minimum.',
    updatedAt: '2026-05-08T00:00:00.000Z',
    ...over,
  }
}

export function makeVendor(over: Partial<Vendor> = {}): Vendor {
  return {
    slug: 'novelkeys',
    name: 'NovelKeys',
    url: 'https://novelkeys.com',
    countryCode: 'US',
    description:
      'A short description that is long enough to satisfy the schema minimum.',
    status: 'active',
    updatedAt: '2026-05-08T00:00:00.000Z',
    ...over,
  }
}

export function makeTrendSnapshot(
  over: Partial<TrendSnapshot> = {},
): TrendSnapshot {
  return {
    isoWeek: '2026-W19',
    publishedAt: '2026-05-08T00:00:00.000Z',
    rows: [
      {
        name: 'Gateron Oil King',
        category: 'switch',
        direction: 'up',
        score: 42,
        spark: [10, 20, 30, 42],
        articleSlug: null,
      },
      {
        name: 'MT3',
        category: 'keycap',
        direction: 'flat',
        score: 0,
        spark: [4, 4, 4, 4],
        articleSlug: null,
      },
    ],
    updatedAt: '2026-05-08T00:00:00.000Z',
    ...over,
  }
}
