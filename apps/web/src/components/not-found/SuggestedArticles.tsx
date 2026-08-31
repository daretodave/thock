'use client'

import Link from 'next/link'
import { useEffect, useState, type ReactElement } from 'react'
import { pillarLabel } from '@thock/seo'
import {
  getSuggestedArticles,
  type SuggestionHit,
} from '@/lib/search/suggestions'

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

// `requireStrongMatch` (see `suggestions.ts`) means most 404 slugs
// resolve to zero hits, not to suggestions — the common case. If the
// skeleton painted immediately, that common case would flash a
// reserved-height skeleton and then collapse it to nothing, shifting
// the "back to home" link that follows this component (the exact
// class of CLS the skeleton itself was added to prevent, just on the
// empty-result path instead of the hits path). Delaying the
// skeleton's first paint means near-instant resolutions (typical for
// a same-origin Server Action call) never paint it at all, so there's
// nothing to collapse.
const SKELETON_DELAY_MS = 150

/**
 * Renders up to `limit` "did you mean…?" article suggestions
 * based on the slug a reader was trying to reach. Backed by the
 * MiniSearch index built at compile time (phase 14), queried via
 * a Server Action (`getSuggestedArticles`) so the index itself
 * never ships to the browser — this component renders inside the
 * client-side article/tag not-found boundary (phase 4b-adjacent
 * edge-cache fix), and a static import of the search runtime here
 * would otherwise bundle its ~750 KB payload into every 404 hit.
 *
 * Renders a skeleton if the lookup is still pending after
 * `SKELETON_DELAY_MS` (reserving layout space so a slow resolution
 * to real hits doesn't shift surrounding content) and announces
 * arrival via an `aria-live` region. Returns `null` before that
 * delay elapses, once the slug is empty, or once the lookup yields
 * no hits, so the host page can render its plain not-found copy
 * without a stranded heading or a skeleton that has nothing to
 * resolve into.
 */
export function SuggestedArticles({
  slug,
  limit = 3,
  eyebrow = 'did you mean',
}: SuggestedArticlesProps): ReactElement | null {
  const query = slugToQuery(slug)
  const [hits, setHits] = useState<SuggestionHit[]>([])
  const [status, setStatus] = useState<'loading' | 'empty' | 'hits'>(
    query.length === 0 ? 'empty' : 'loading',
  )
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    let cancelled = false
    setShowSkeleton(false)
    if (query.length === 0) {
      setHits([])
      setStatus('empty')
      return
    }
    setStatus('loading')
    const skeletonTimer = window.setTimeout(() => {
      if (!cancelled) setShowSkeleton(true)
    }, SKELETON_DELAY_MS)
    getSuggestedArticles(query, limit).then((result) => {
      if (cancelled) return
      window.clearTimeout(skeletonTimer)
      setHits(result)
      setStatus(result.length > 0 ? 'hits' : 'empty')
    })
    return () => {
      cancelled = true
      window.clearTimeout(skeletonTimer)
    }
  }, [query, limit])

  if (status === 'empty') return null
  if (status === 'loading' && !showSkeleton) return null

  return (
    <section
      data-testid="not-found-suggestions"
      className="flex flex-col gap-4"
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status === 'hits'
          ? `${hits.length} suggested article${hits.length === 1 ? '' : 's'} found`
          : ''}
      </div>
      <h2
        data-testid="not-found-suggestion-eyebrow"
        className="font-mono uppercase tracking-[0.12em] text-micro text-text-2"
      >
        {eyebrow}
      </h2>
      {status === 'loading' ? (
        <ul className="flex flex-col gap-3" aria-hidden="true">
          {Array.from({ length: limit }).map((_, i) => (
            <li
              key={i}
              className="flex flex-col gap-2 border-t border-border py-3 first:border-t-0 first:pt-0"
            >
              <div className="h-4 w-1/4 animate-pulse bg-surface" />
              <div className="h-6 w-3/4 animate-pulse bg-surface" />
              <div className="h-4 w-1/3 animate-pulse bg-surface" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-3">
          {hits.map((hit) => (
            <li key={hit.id}>
              <Link
                href={`/article/${hit.slug}`}
                data-testid="not-found-suggestion"
                data-slug={hit.slug}
                className="group flex flex-col gap-1 rounded-sm border-t border-border py-3 first:border-t-0 first:pt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
              >
                <span className="font-mono uppercase tracking-[0.1em] text-micro text-accent">
                  {pillarLabel(hit.pillar)}
                </span>
                <span className="font-serif text-h3 text-text group-hover:text-accent transition-colors">
                  {hit.title}
                </span>
                <span
                  data-testid="not-found-suggestion-date"
                  className="text-small text-text-2"
                >
                  {PUBLISHED_FORMATTER.format(new Date(hit.publishedAt))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
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
