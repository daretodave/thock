import MiniSearch from 'minisearch'
import payload from './index.generated.json'

export type SearchDocument = {
  id: string
  slug: string
  title: string
  lede: string
  pillar: 'news' | 'trends' | 'ideas' | 'deep-dives' | 'guides'
  tags: string[]
  publishedAt: string
}

export type SearchHit = SearchDocument & { score: number }

type IndexBundle = {
  index: MiniSearch<SearchDocument>
  documents: Record<string, SearchDocument>
}

let cached: IndexBundle | null = null

function load(): IndexBundle {
  if (cached) return cached
  const docs = payload.documents as SearchDocument[]
  const documents: Record<string, SearchDocument> = {}
  for (const d of docs) documents[d.id] = d

  const index = MiniSearch.loadJSON<SearchDocument>(
    JSON.stringify(payload.serialized),
    {
      fields: ['title', 'tags', 'lede', 'body'],
      storeFields: ['slug', 'title', 'lede', 'pillar', 'tags', 'publishedAt'],
    },
  )

  cached = { index, documents }
  return cached
}

const DEFAULT_LIMIT = 25
const SEARCH_OPTIONS = {
  boost: { title: 4, tags: 3, lede: 2, body: 1 },
  fuzzy: 0.2,
  prefix: true,
} as const

/**
 * Run a query against the precomputed MiniSearch index. Returns
 * up to `limit` ranked hits, each enriched with the canonical
 * stored document fields.
 */
export function searchArticles(
  query: string,
  limit: number = DEFAULT_LIMIT,
): SearchHit[] {
  const trimmed = query.trim()
  if (trimmed.length === 0) return []
  const { index, documents } = load()
  const raw = index.search(trimmed, SEARCH_OPTIONS)
  const hits: SearchHit[] = []
  for (const r of raw) {
    if (hits.length >= limit) break
    const doc = documents[r.id]
    if (!doc) continue
    hits.push({ ...doc, score: r.score })
  }
  return hits
}

/** Reset the module-level cache. Test-only. */
export function __resetSearchCacheForTest(): void {
  cached = null
}
