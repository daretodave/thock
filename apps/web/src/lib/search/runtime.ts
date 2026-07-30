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

export type PartSearchDocument = {
  id: string
  slug: string
  kind: 'switch' | 'keycap-set' | 'board' | 'vendor' | 'newsletter' | 'group-buy' | 'tracker-week'
  name: string
  href: string
}

export type PartSearchHit = PartSearchDocument & { score: number }

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
// Below this length, prefix/fuzzy expansion turns a single short term into
// a near-universal match (e.g. "SA" prefix-matching every "said", "same",
// "saturn" token in 74/74 article bodies) — gate expansion off below it.
const MIN_EXPANSION_LENGTH = 3
// Common English words that appear in nearly every article body verbatim.
// Left ungated, a bare stopword query ("a", "the") exact-matches the whole
// corpus and the aria-live region announces a materially false result count.
const STOPWORDS = new Set([
  'a', 'an', 'and', 'at', 'by', 'for', 'i', 'in', 'is', 'it',
  'of', 'on', 'or', 'the', 'to',
])
const SEARCH_OPTIONS = {
  boost: { title: 4, tags: 3, lede: 2, body: 1 },
  fuzzy: (term: string) => (term.length >= MIN_EXPANSION_LENGTH ? 0.2 : false),
  prefix: (term: string) => term.length >= MIN_EXPANSION_LENGTH,
} as const

function stripStopwords(query: string): string {
  return query
    .split(/\s+/)
    .filter((term) => term.length > 0 && !STOPWORDS.has(term.toLowerCase()))
    .join(' ')
}

/**
 * Run a query against the precomputed MiniSearch index. Returns
 * up to `limit` ranked hits, each enriched with the canonical
 * stored document fields.
 */
export function searchArticles(
  query: string,
  limit: number = DEFAULT_LIMIT,
): SearchHit[] {
  const trimmed = stripStopwords(query.trim())
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

/**
 * Simple substring search over the parts catalog embedded in the index
 * payload. 18 records — no MiniSearch needed; linear scan is fast enough.
 */
export function searchParts(query: string, limit = 10): PartSearchHit[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const parts = (payload as { parts?: PartSearchDocument[] }).parts ?? []
  return parts
    .filter((p) => `${p.name} ${p.kind}`.toLowerCase().includes(q))
    .slice(0, limit)
    .map((p) => ({ ...p, score: 1.0 }))
}

/** Reset the module-level cache. Test-only. */
export function __resetSearchCacheForTest(): void {
  cached = null
}
