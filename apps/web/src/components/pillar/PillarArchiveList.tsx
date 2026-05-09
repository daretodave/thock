import type { ReactElement } from 'react'
import type { Article, Tag } from '@thock/content'
import { ArticleCard } from '@/components/home/ArticleCard'

export type PillarArchiveListProps = {
  /** Articles to render — already pre-filtered to the pillar by the caller. */
  articles: Article[]
  tagsBySlug?: Map<string, Tag>
  /** Optional cap; defaults to 25 per the pillar brief. */
  max?: number
}

/**
 * Chronological archive list for a pillar landing. Renders each
 * article as `<ArticleCard variant="row">`. Hides itself entirely
 * when the list is empty so the parent can drop the section
 * heading slot too.
 */
export function PillarArchiveList({
  articles,
  tagsBySlug,
  max = 25,
}: PillarArchiveListProps): ReactElement | null {
  if (articles.length === 0) return null
  const capped = articles.slice(0, max)

  return (
    <div data-testid="pillar-archive-list" className="flex flex-col">
      {capped.map((article) => (
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

export function sortArticlesForArchive(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    if (a.frontmatter.publishedAt !== b.frontmatter.publishedAt) {
      return b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
    }
    return a.slug.localeCompare(b.slug)
  })
}
