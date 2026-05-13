import Link from 'next/link'
import type { ReactElement } from 'react'
import { pillarLabel } from '@thock/seo'
import { searchArticles } from '@/lib/search/runtime'

export type SuggestedArticlesProps = {
  /**
   * The slug a reader was trying to reach. Used as the search
   * query (with hyphens normalized to spaces). Pass an empty
   * string to render nothing.
   */
  slug: string
  /** Cap on suggestions rendered. Defaults to 3. */
  limit?: number
  /** Optional override for the eyebrow label. */
  eyebrow?: string
}

const PUBLISHED_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

function slugToQuery(slug: string): string {
  return slug.replace(/[-_]/g, ' ').trim()
}

/**
 * Renders up to `limit` "did you mean…?" article suggestions
 * based on the slug a reader was trying to reach. Backed by the
 * MiniSearch index built at compile time (phase 14).
 *
 * Returns `null` when the slug yields no hits, so the host page
 * can render its plain not-found copy without a stranded heading.
 */
export function SuggestedArticles({
  slug,
  limit = 3,
  eyebrow = 'did you mean',
}: SuggestedArticlesProps): ReactElement | null {
  const query = slugToQuery(slug)
  if (query.length === 0) return null

  const hits = searchArticles(query, limit)
  if (hits.length === 0) return null

  return (
    <section
      data-testid="not-found-suggestions"
      className="flex flex-col gap-4"
    >
      <h2 className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
        {eyebrow}
      </h2>
      <ul className="flex flex-col gap-3">
        {hits.map((hit) => (
          <li key={hit.id}>
            <Link
              href={`/article/${hit.slug}`}
              data-testid="not-found-suggestion"
              data-slug={hit.slug}
              className="group flex flex-col gap-1 border-t border-border py-3 first:border-t-0 first:pt-0"
            >
              <span className="font-mono uppercase tracking-[0.1em] text-micro text-accent">
                {pillarLabel(hit.pillar)}
              </span>
              <span className="font-serif text-h3 text-text group-hover:text-accent transition-colors">
                {hit.title}
              </span>
              <span className="text-small text-text-3">
                {PUBLISHED_FORMATTER.format(new Date(hit.publishedAt))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * Extracts the trailing slug segment from a pathname. Used by
 * `not-found.tsx` files to recover the slug a reader was trying
 * to reach (Next 15 doesn't pass route params to not-found).
 *
 * Examples: `/article/gateron-oil-king` → `gateron-oil-king`;
 * `/tag/silent`  → `silent`. Returns an empty string for
 * malformed paths.
 */
export function pathnameToSlug(pathname: string | null): string {
  if (!pathname) return ''
  const parts = pathname.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? ''
}
