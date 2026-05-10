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

/**
 * Tag-page article sort with a title-match boost.
 *
 * `sortArticlesForArchive` (above) sorts strictly by publishedAt
 * desc — fine for pillar archives where every article is "about"
 * the pillar. But on a tag page, articles can carry a tag because
 * they *mention* the tagged subject without being about it (e.g.
 * the trends-tracker article tags `gateron` because Gateron Oil
 * King is in the rotation that week, but the article is methodology,
 * not a Gateron piece). Strict latest-first puts those tangentially-
 * tagged articles above core articles whose titles announce the
 * subject.
 *
 * Heuristic: articles whose `title` contains the tag's `name` or
 * `slug` (case-insensitive) sort above articles that don't, with
 * publishedAt-desc + slug tie-break inside each tier. This is the
 * cheapest path that reliably separates "primary topic" from
 * "secondary mention" without a frontmatter schema change. Critique
 * pass 4 [LOW] drain (line 163 of plan/CRITIQUE.md).
 */
export function sortArticlesForTagArchive(
  articles: Article[],
  tag: { slug: string; name: string },
): Article[] {
  const slugNeedle = tag.slug.toLowerCase().replace(/-/g, ' ')
  const nameNeedle = tag.name.toLowerCase()

  function matchesTitle(article: Article): boolean {
    const title = article.frontmatter.title.toLowerCase()
    if (title.includes(nameNeedle)) return true
    if (title.includes(slugNeedle)) return true
    if (title.includes(tag.slug.toLowerCase())) return true
    return false
  }

  function compareWithinTier(a: Article, b: Article): number {
    if (a.frontmatter.publishedAt !== b.frontmatter.publishedAt) {
      return b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt)
    }
    return a.slug.localeCompare(b.slug)
  }

  const titleMatched: Article[] = []
  const titleUnmatched: Article[] = []
  for (const article of articles) {
    ;(matchesTitle(article) ? titleMatched : titleUnmatched).push(article)
  }
  titleMatched.sort(compareWithinTier)
  titleUnmatched.sort(compareWithinTier)

  return [...titleMatched, ...titleUnmatched]
}
