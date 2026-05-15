import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import type { Article, Tag } from '@thock/content'
import { ArticleCard } from '@/components/home/ArticleCard'

export type MentionedInArticlesProps = {
  partName: string
  articles: Article[]
  tagsBySlug: Map<string, Tag>
}

/**
 * Phase 21 — "Mentioned in" rail on every per-part page. Renders
 * one row per article whose `frontmatter.mentionedParts` includes
 * the surface part. Empty-state is intentionally honest rather
 * than hidden — keeps the page structure readable when no article
 * has cited the part yet.
 */
export function MentionedInArticles({
  partName,
  articles,
  tagsBySlug,
}: MentionedInArticlesProps): ReactElement {
  if (articles.length === 0) {
    return (
      <Container as="section" className="pb-16">
        <Stack gap={3}>
          <span data-testid="part-mentioned-kicker" className="font-mono uppercase tracking-[0.12em] text-micro text-text-2">
            mentioned in · 0 articles
          </span>
          <p
            data-testid="part-mentioned-empty"
            className="max-w-[60ch] font-serif text-h3 text-text-2"
          >
            Not yet mentioned in any article. Check back as the catalog
            grows.
          </p>
        </Stack>
      </Container>
    )
  }

  return (
    <Container as="section" className="pb-12 sm:pb-16">
      <Stack gap={5}>
        <h2 data-testid="part-mentioned-heading" className="font-mono uppercase tracking-[0.12em] text-micro text-text-2">
          Mentioned in {articles.length}{' '}
          {articles.length === 1 ? 'article' : 'articles'}
        </h2>
        <div data-testid="part-mentioned-list" className="flex flex-col">
          {articles.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
              variant="row"
              tagsBySlug={tagsBySlug}
            />
          ))}
        </div>
        <p className="font-mono uppercase tracking-[0.08em] text-micro text-text-4">
          {partName} appears in editor-curated build sheets.
        </p>
      </Stack>
    </Container>
  )
}
