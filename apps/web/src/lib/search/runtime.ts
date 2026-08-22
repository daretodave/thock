import MiniSearch, { type MatchInfo, type SearchResult } from 'minisearch'
import payload from './index.generated.json'
import { normalizeHotswapSpelling } from './normalize'

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
      fields: ['searchTitle', 'searchTags', 'searchLede', 'searchBody'],
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
  boost: { searchTitle: 4, searchTags: 3, searchLede: 2, searchBody: 1 },
  fuzzy: (term: string) => (term.length >= MIN_EXPANSION_LENGTH ? 0.2 : false),
  prefix: (term: string) => term.length >= MIN_EXPANSION_LENGTH,
} as const

// A matched term this short (e.g. "one", "3") is too generic to trust as a
// standalone relevance signal — it inflates scores on documents that share
// no real topical overlap with the query. Below this length, a match only
// counts toward `hasStrongMatch` if paired with a longer matched term.
const MIN_STRONG_MATCH_TERM_LENGTH = 4
// Fields worth trusting as evidence the query is actually *about* this
// document, as opposed to a term that happens to appear once in body prose.
const STRONG_MATCH_FIELDS = new Set(['searchTitle', 'searchTags'])

function stripStopwords(query: string): string {
  return query
    .split(/\s+/)
    .filter((term) => term.length > 0 && !STOPWORDS.has(term.toLowerCase()))
    .join(' ')
}

/**
 * True when at least one matched term (post fuzzy/prefix expansion) landed
 * in the title or tags — the fields that indicate the query is actually
 * about this document, not an incidental body mention. Used to gate
 * "did you mean" suggestions, where a plausible-looking but topically
 * unrelated top hit is worse than no suggestion at all.
 */
function hasStrongMatch(match: MatchInfo): boolean {
  return Object.entries(match).some(
    ([term, fields]) =>
      term.length >= MIN_STRONG_MATCH_TERM_LENGTH &&
      fields.some((field) => STRONG_MATCH_FIELDS.has(field)),
  )
}

/**
 * Run a query against the precomputed MiniSearch index. Returns
 * up to `limit` ranked hits, each enriched with the canonical
 * stored document fields.
 *
 * `requireStrongMatch` filters out hits whose only evidence is a weak
 * body/lede mention (see `hasStrongMatch`) — intended for "did you mean"
 * style suggestions rather than the explicit `/search` results page,
 * where a body-only match is still a legitimate result the reader asked
 * for.
 */
export function searchArticles(
  query: string,
  limit: number = DEFAULT_LIMIT,
  options?: { requireStrongMatch?: boolean },
): SearchHit[] {
  const trimmed = stripStopwords(normalizeHotswapSpelling(query.trim()))
  if (trimmed.length === 0) return []
  const { index, documents } = load()
  const raw: SearchResult[] = index.search(trimmed, SEARCH_OPTIONS)
  const hits: SearchHit[] = []
  for (const r of raw) {
    if (hits.length >= limit) break
    if (options?.requireStrongMatch && !hasStrongMatch(r.match)) continue
    const doc = documents[r.id]
    if (!doc) continue
    hits.push({ ...doc, score: r.score })
  }
  return hits
}

/**
 * Simple substring search over the parts catalog embedded in the index
 * payload. 18 records — no MiniSearch needed; linear scan is fast enough.
 * Shares `searchArticles`'s stopword/short-query guard — a raw substring
 * scan is even more prone to over-matching (e.g. "the" matching "King of
 * the Seas") since it has no prefix/fuzzy length floor of its own.
 */
export function searchParts(query: string, limit = 10): PartSearchHit[] {
  const trimmed = stripStopwords(query.trim())
  if (trimmed.length < MIN_EXPANSION_LENGTH) return []
  const q = trimmed.toLowerCase()
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
