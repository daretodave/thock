import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import type { Article } from '@thock/content'
import { RelatedArticleCard } from './RelatedArticleCard'

export type RelatedArticlesRailProps = {
  articles: Article[]
}

/**
 * Up to 4 related articles in a responsive grid. Hides itself when
 * the related-articles list is empty (rare — only for the very
 * first article in a fresh archive).
 */
export function RelatedArticlesRail({
  articles,
}: RelatedArticlesRailProps): ReactElement | null {
  if (articles.length === 0) return null

  return (
    <Container as="section" className="border-t border-border py-12">
      <div className="flex flex-col gap-6">
        <h2 className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
          Keep reading
        </h2>
        <ul
          data-testid="related-articles-rail"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {articles.slice(0, 4).map((a) => (
            <li key={a.slug} className="flex">
              <RelatedArticleCard article={a} />
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
