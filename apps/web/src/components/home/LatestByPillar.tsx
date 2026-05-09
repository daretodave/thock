import type { ReactElement } from 'react'
import type { Article, Tag } from '@thock/content'
import type { Pillar } from '@thock/seo'
import { ArticleCard } from './ArticleCard'

// Order matches the header nav ('news', 'trends', 'ideas', 'deep-dives',
// 'guides'). Earlier ('phase 6) the set dropped 'ideas' "until phase 9
// ships — ideas is the lowest-volume pillar in seed content." Critique
// pass 3 caught the mismatch: header advertises 5 pillars, by-pillar
// grid rendered 4. Ideas is back in the rotation; the resolver's
// fallback already handles empty pillars by surfacing the next-newest
// article from any other pillar.
const HOME_PILLAR_SET: readonly Pillar[] = [
  'news',
  'trends',
  'ideas',
  'deep-dives',
  'guides',
] as const

export type LatestByPillarProps = {
  /** All articles, already sorted by publishedAt desc by the page. */
  articles: Article[]
  tagsBySlug?: Map<string, Tag>
  /**
   * Slugs to exclude from both the per-pillar match AND the fallback
   * pool. Use case: home page passes the hero article's slug so the
   * grid never duplicates the hero card surfaced above the fold
   * (critique pass 3 [MED]).
   */
  excludeSlugs?: ReadonlySet<string>
}

/**
 * Resolve the latest article per home pillar. If a pillar has no
 * matching article, fall through to the next-newest article from
 * any other pillar (excluding ones already used or in `excludeSlugs`).
 *
 * Exported for testability — `<LatestByPillar>` consumes it.
 */
export function resolveLatestByPillar(
  articles: Article[],
  pillars: readonly Pillar[] = HOME_PILLAR_SET,
  excludeSlugs: ReadonlySet<string> = new Set(),
): Article[] {
  const sorted = [...articles].sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  )
  const used = new Set<string>()
  const out: Article[] = []

  for (const pillar of pillars) {
    const match = sorted.find(
      (a) =>
        !used.has(a.slug) &&
        !excludeSlugs.has(a.slug) &&
        a.frontmatter.pillar === pillar,
    )
    if (match) {
      used.add(match.slug)
      out.push(match)
      continue
    }
    const fallback = sorted.find(
      (a) => !used.has(a.slug) && !excludeSlugs.has(a.slug),
    )
    if (fallback) {
      used.add(fallback.slug)
      out.push(fallback)
    }
  }

  return out
}

/**
 * 5-up grid of "latest by pillar" cards on the home page. Falls
 * through to the newest article from any pillar when a slot is
 * empty (per `phase_6_home.md` decisions). The set covers all five
 * pillars the header nav advertises (news, trends, ideas, deep-dives,
 * guides). Critique pass 3 fixed the prior 4-pillar set that
 * silently excluded ideas.
 */
export function LatestByPillar({
  articles,
  tagsBySlug,
  excludeSlugs,
}: LatestByPillarProps): ReactElement | null {
  const picks = resolveLatestByPillar(articles, HOME_PILLAR_SET, excludeSlugs)
  if (picks.length === 0) return null

  return (
    <div
      data-testid="latest-by-pillar"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
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
