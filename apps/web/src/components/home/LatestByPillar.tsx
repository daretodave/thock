import type { ReactElement } from 'react'
import type { Article, Tag } from '@thock/content'
import type { Pillar } from '@thock/seo'
import { ArticleCard } from './ArticleCard'

const HOME_PILLAR_SET: readonly Pillar[] = [
  'news',
  'trends',
  'deep-dives',
  'guides',
] as const

export type LatestByPillarProps = {
  /** All articles, already sorted by publishedAt desc by the page. */
  articles: Article[]
  tagsBySlug?: Map<string, Tag>
}

/**
 * Resolve the latest article per home pillar. If a pillar has no
 * matching article, fall through to the next-newest article from
 * any other pillar (excluding ones already used).
 *
 * Exported for testability — `<LatestByPillar>` consumes it.
 */
export function resolveLatestByPillar(
  articles: Article[],
  pillars: readonly Pillar[] = HOME_PILLAR_SET,
): Article[] {
  const sorted = [...articles].sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  )
  const used = new Set<string>()
  const out: Article[] = []

  for (const pillar of pillars) {
    const match = sorted.find(
      (a) => !used.has(a.slug) && a.frontmatter.pillar === pillar,
    )
    if (match) {
      used.add(match.slug)
      out.push(match)
      continue
    }
    const fallback = sorted.find((a) => !used.has(a.slug))
    if (fallback) {
      used.add(fallback.slug)
      out.push(fallback)
    }
  }

  return out
}

/**
 * 4-up grid of "latest by pillar" cards on the home page. Falls
 * through to the newest article from any pillar when a slot is
 * empty (per `phase_6_home.md` decisions). Drops `ideas` from the
 * default set until phase 9 ships — ideas is the lowest-volume
 * pillar in seed content.
 */
export function LatestByPillar({
  articles,
  tagsBySlug,
}: LatestByPillarProps): ReactElement | null {
  const picks = resolveLatestByPillar(articles)
  if (picks.length === 0) return null

  return (
    <div
      data-testid="latest-by-pillar"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {picks.map((article) => (
        <div
          key={article.slug}
          data-testid="latest-by-pillar-card"
          className="contents"
        >
          <ArticleCard
            article={article}
            variant="large"
            tagsBySlug={tagsBySlug}
          />
        </div>
      ))}
    </div>
  )
}

export { HOME_PILLAR_SET }
