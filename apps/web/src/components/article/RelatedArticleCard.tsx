import Link from 'next/link'
import type { ReactElement } from 'react'
import type { Article } from '@thock/content'
import { pillarLabel } from '@thock/seo'

export type RelatedArticleCardProps = {
  article: Article
}

const PUBLISHED_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

/**
 * "Row" variant of an article card — used by the related-articles
 * rail. Other variants (hero/large/compact) land when phases 6-11
 * need them.
 */
export function RelatedArticleCard({
  article,
}: RelatedArticleCardProps): ReactElement {
  const fm = article.frontmatter
  return (
    <Link
      href={`/article/${article.slug}`}
      data-testid="related-article-card"
      className="group flex flex-col gap-2 border border-border p-4 transition-colors hover:border-border-hi"
    >
      <span className="font-mono uppercase tracking-[0.1em] text-micro text-accent">
        {pillarLabel(fm.pillar)}
      </span>
      <h3 className="font-serif text-h3 text-text group-hover:text-accent transition-colors">
        {fm.title}
      </h3>
      <p className="text-small text-text-2 line-clamp-3">{fm.lede}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-2 text-small text-text-2">
        <span>{fm.author}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={fm.publishedAt}>
          {PUBLISHED_FORMATTER.format(new Date(fm.publishedAt))}
        </time>
        <span aria-hidden="true">·</span>
        <span>{article.readTime} min read</span>
      </div>
    </Link>
  )
}
