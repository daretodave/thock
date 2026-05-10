import type { ReactElement } from 'react'
import type { Article, Tag } from '@thock/content'
import { ArticleCard } from './ArticleCard'

export type HomeDeepDivesRailProps = {
  /** All articles, already sorted by publishedAt desc by the page. */
  articles: Article[]
  tagsBySlug?: Map<string, Tag>
  /** Cap at 3 by default — matches the design composition. */
  max?: number
  /**
   * Slugs to exclude from the rail. Use case: home page passes the
   * by-pillar grid's resolved picks so the long-reads rail never
   * surfaces the exact card a reader just saw under "By pillar /
   * Deep Dives" two scroll-lengths up (critique pass 4 [LOW]).
   */
  excludeSlugs?: ReadonlySet<string>
}

/**
 * "Long reads worth your weekend" rail — top N deep-dive articles
 * rendered as `<ArticleCard variant="row">`. Hidden entirely when
 * the deep-dives pillar has zero articles (per phase brief).
 */
export function HomeDeepDivesRail({
  articles,
  tagsBySlug,
  max = 3,
  excludeSlugs,
}: HomeDeepDivesRailProps): ReactElement | null {
  const picks = articles
    .filter((a) => a.frontmatter.pillar === 'deep-dives')
    .filter((a) => !excludeSlugs || !excludeSlugs.has(a.slug))
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    )
    .slice(0, max)

  if (picks.length === 0) return null

  return (
    <div data-testid="home-deep-dives-rail" className="flex flex-col">
      {picks.map((article) => (
        <ArticleCard
          key={article.slug}
          article={article}
          variant="row"
          tagsBySlug={tagsBySlug}
        />
      ))}
    </div>
  )
}
