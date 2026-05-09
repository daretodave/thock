import type { Article } from '@thock/content'

export type GuideSection = 'firmware' | 'modding' | 'switches' | 'keycaps'

export type GuideSectionKey = GuideSection | 'other'

export type GuideSectionGroup = {
  key: GuideSectionKey
  label: string
  articles: Article[]
}

const SECTION_ORDER: GuideSection[] = [
  'firmware',
  'modding',
  'switches',
  'keycaps',
]

const SECTION_LABEL: Record<GuideSectionKey, string> = {
  firmware: 'Firmware',
  modding: 'Modding',
  switches: 'Switches',
  keycaps: 'Keycaps',
  other: 'Other guides',
}

function freshness(article: Article): string {
  return article.frontmatter.updatedAt ?? article.frontmatter.publishedAt
}

function sortByFreshness(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const af = freshness(a)
    const bf = freshness(b)
    if (af !== bf) return bf.localeCompare(af)
    if (a.frontmatter.publishedAt !== b.frontmatter.publishedAt) {
      return b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
    }
    return a.slug.localeCompare(b.slug)
  })
}

/**
 * Group guides articles by `guideSection` in the canonical order.
 * Empty sections are dropped silently. Articles with `null`
 * `guideSection` collect into a final "Other guides" bucket.
 * Within each section, sort by `updatedAt ?? publishedAt` desc;
 * tie-break `publishedAt` desc; final tie-break `slug` asc for
 * build stability.
 *
 * Pure helper extracted out of `page.tsx` because Next.js's
 * route-typing forbids non-route exports from page modules.
 */
export function groupGuidesBySection(articles: Article[]): GuideSectionGroup[] {
  const buckets = new Map<GuideSectionKey, Article[]>()
  for (const article of articles) {
    const section = article.frontmatter.guideSection
    const key: GuideSectionKey = section ?? 'other'
    const existing = buckets.get(key)
    if (existing) {
      existing.push(article)
    } else {
      buckets.set(key, [article])
    }
  }

  const out: GuideSectionGroup[] = []
  for (const key of SECTION_ORDER) {
    const list = buckets.get(key)
    if (list && list.length > 0) {
      out.push({ key, label: SECTION_LABEL[key], articles: sortByFreshness(list) })
    }
  }
  const other = buckets.get('other')
  if (other && other.length > 0) {
    out.push({
      key: 'other',
      label: SECTION_LABEL.other,
      articles: sortByFreshness(other),
    })
  }
  return out
}
