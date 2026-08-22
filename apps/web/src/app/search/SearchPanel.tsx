'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Tag } from '@thock/content'
import { Container, Stack } from '@thock/ui'
import type { SearchHit, PartSearchHit } from '@/lib/search/runtime'
import { ArticleResult } from '@/components/search/ArticleResult'
import { PartResult } from '@/components/search/PartResult'

type SearchRuntime = typeof import('@/lib/search/runtime')

const DEBOUNCE_MS = 120

export type SearchPanelProps = {
  allTags: Tag[]
}

const PILLAR_FALLBACKS: { label: string; href: string }[] = [
  { label: 'News', href: '/news' },
  { label: 'Trends', href: '/trends' },
  { label: 'Ideas & Builds', href: '/ideas' },
  { label: 'Deep Dives', href: '/deep-dives' },
  { label: 'Guides', href: '/guides' },
]

/**
 * Phase 14 search UI. Owns the input + results state. The runtime
 * module (MiniSearch + the generated index payload) is dynamically
 * imported on mount rather than statically, so its ~200 KB gzipped
 * payload ships as its own chunk instead of inflating /search's
 * First Load JS; subsequent queries are sub-millisecond. Reads `?q=`
 * on mount so deep-links (e.g. from phase 16's 404-soft) populate
 * the input, and writes it back after each debounced change so the
 * URL stays shareable and survives a refresh or back-navigation.
 */
export function SearchPanel({ allTags }: SearchPanelProps): ReactElement {
  const router = useRouter()
  const params = useSearchParams()
  const urlQ = params?.get('q') ?? ''
  const [query, setQuery] = useState(urlQ)
  const [debouncedQuery, setDebouncedQuery] = useState(urlQ)
  const [runtime, setRuntime] = useState<SearchRuntime | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // The MiniSearch payload embeds full tokenized article bodies (~200 KB
  // gzipped) — split it into its own chunk fetched after hydration instead
  // of bundling it into /search's initial First Load JS.
  useEffect(() => {
    let cancelled = false
    import('@/lib/search/runtime').then((mod) => {
      if (!cancelled) setRuntime(mod)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    // Coarse-pointer (touch) visits skip autofocus — stealing focus on
    // load raises the on-screen keyboard before the reader has seen the
    // heading/lede, and pushes AT focus past the page's own context.
    if (window.matchMedia?.('(pointer: coarse)').matches) return
    inputRef.current?.focus()
  }, [])

  // Sync when the URL `?q=` changes after mount (the page is
  // statically generated, so the first server render sees no
  // params; the real value arrives at hydration).
  useEffect(() => {
    setQuery(urlQ)
  }, [urlQ])

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => window.clearTimeout(id)
  }, [query])

  // Keep the URL in sync with the debounced query so a refresh, a
  // copied address bar, or the back button all restore the same search.
  useEffect(() => {
    const trimmedQuery = debouncedQuery.trim()
    const url = trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search'
    router.replace(url, { scroll: false })
  }, [debouncedQuery, router])

  const tagsBySlug = useMemo(
    () => new Map<string, Tag>(allTags.map((t) => [t.slug, t])),
    [allTags],
  )

  const results: SearchHit[] = useMemo(() => {
    if (!runtime) return []
    return runtime.searchArticles(debouncedQuery)
  }, [runtime, debouncedQuery])

  const partResults: PartSearchHit[] = useMemo(() => {
    if (!runtime) return []
    return runtime.searchParts(debouncedQuery)
  }, [runtime, debouncedQuery])

  const trimmed = debouncedQuery.trim()
  const showHint = trimmed.length === 0
  const showEmpty = !showHint && results.length === 0 && partResults.length === 0

  return (
    <Container as="section" className="pb-16">
      <Stack gap={6}>
        <label
          data-testid="search-input-label"
          className="font-mono uppercase tracking-[0.12em] text-micro text-text-2"
          htmlFor="search-input"
        >
          query
        </label>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          name="q"
          placeholder="Try a switch, brand, or tag…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="border border-border-hi bg-bg px-4 py-3 font-serif text-h3 text-text placeholder:text-text-2 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg"
        />
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {showHint
            ? ''
            : showEmpty
              ? `No matches for "${trimmed}"`
              : `${results.length + partResults.length} result${
                  results.length + partResults.length === 1 ? '' : 's'
                } for "${trimmed}"`}
        </div>
        {showHint && (
          <div data-testid="search-empty-query" className="font-serif text-h3 text-text-2">
            Type a switch name, brand, or tag. Hit slowly — the index is local.
          </div>
        )}
        {showEmpty && (
          <Stack gap={4} data-testid="search-no-results">
            <p className="font-serif text-h3 text-text-2">
              No matches for{' '}
              <span className="font-mono text-text">&ldquo;{trimmed}&rdquo;</span>.
            </p>
            <div className="flex flex-wrap gap-3">
              {PILLAR_FALLBACKS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="border border-border px-3 py-1.5 font-mono text-micro uppercase tracking-[0.08em] text-text-2 hover:text-text rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </Stack>
        )}
        {results.length > 0 && (
          <div data-testid="search-results" className="flex flex-col">
            {results.map((hit) => (
              <ArticleResult key={hit.id} hit={hit} tagsBySlug={tagsBySlug} />
            ))}
          </div>
        )}
        {partResults.length > 0 && (
          <div data-testid="search-part-results">
            <h2 className="font-mono uppercase tracking-[0.12em] text-micro text-text-2 pt-6 pb-2">
              catalog
            </h2>
            <div className="flex flex-col">
              {partResults.map((hit) => (
                <PartResult key={hit.id} hit={hit} />
              ))}
            </div>
          </div>
        )}
      </Stack>
    </Container>
  )
}
