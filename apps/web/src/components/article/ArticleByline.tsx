import type { ReactElement } from 'react'

const PUBLISHED_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long',
  timeZone: 'UTC',
})

export type ArticleBylineProps = {
  /** Article author name (already resolved). */
  author: string
  /** ISO 8601 timestamp from frontmatter. */
  publishedAt: string
  /** Read time in whole minutes (clamped ≥ 1 by the loader). */
  readTime: number
}

/**
 * Article byline — author + publish date + read time.
 * Stacks vertically on mobile, flows in a row on `md:` and up.
 */
export function ArticleByline({
  author,
  publishedAt,
  readTime,
}: ArticleBylineProps): ReactElement {
  const formatted = PUBLISHED_FORMATTER.format(new Date(publishedAt))

  return (
    <div
      data-testid="article-byline"
      className="flex flex-col gap-1 text-small text-text-2 md:flex-row md:items-center md:gap-3"
    >
      <span className="text-text-2">{author}</span>
      <span aria-hidden="true" className="hidden md:inline">
        ·
      </span>
      <time dateTime={publishedAt}>{formatted}</time>
      <span aria-hidden="true" className="hidden md:inline">
        ·
      </span>
      <span>{readTime} min read</span>
    </div>
  )
}
