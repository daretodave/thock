'use server'

import { searchArticles, type SearchHit } from './runtime'

export type SuggestionHit = Pick<
  SearchHit,
  'id' | 'slug' | 'title' | 'pillar' | 'publishedAt'
>

/**
 * Server Action wrapping `searchArticles`. Keeps the MiniSearch
 * index + library server-side — a client component (e.g. the
 * article/tag not-found "did you mean" suggestions) can call this
 * instead of statically importing `./runtime`, which would ship the
 * ~750 KB index payload to the browser on every 404 hit.
 */
export async function getSuggestedArticles(
  query: string,
  limit = 3,
): Promise<SuggestionHit[]> {
  if (query.trim().length === 0) return []
  const hits = searchArticles(query, limit, { requireStrongMatch: true })
  return hits.map(({ id, slug, title, pillar, publishedAt }) => ({
    id,
    slug,
    title,
    pillar,
    publishedAt,
  }))
}
