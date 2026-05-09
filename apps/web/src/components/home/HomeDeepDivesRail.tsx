import type { ReactElement } from 'react'
import type { Article, Tag } from '@thock/content'
import { ArticleCard } from './ArticleCard'

export type HomeDeepDivesRailProps = {
  /** All articles, already sorted by publishedAt desc by the page. */
  articles: Article[]
  tagsBySlug?: Map<string, Tag>
  /** Cap at 3 by default — matches the design composition. */
  max?: number
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
}: HomeDeepDivesRailProps): ReactElement | null {
  const picks = articles
    .filter((a) => a.frontmatter.pillar === 'deep-dives')
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
