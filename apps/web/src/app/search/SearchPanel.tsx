'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Tag } from '@thock/content'
import { Container, Stack } from '@thock/ui'
import { searchArticles, type SearchHit } from '@/lib/search/runtime'
import { ArticleResult } from '@/components/search/ArticleResult'

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
 * Phase 14 search UI. Owns the input + results state. The
 * MiniSearch index is loaded the first time `searchArticles`
 * runs; subsequent queries are sub-millisecond. Reads `?q=` on
 * mount so deep-links (e.g. from phase 16's 404-soft) populate
 * the input.
 */
export function SearchPanel({ allTags }: SearchPanelProps): ReactElement {
  const params = useSearchParams()
  const urlQ = params?.get('q') ?? ''
  const [query, setQuery] = useState(urlQ)
  const [debouncedQuery, setDebouncedQuery] = useState(urlQ)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
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

  const tagsBySlug = useMemo(
    () => new Map<string, Tag>(allTags.map((t) => [t.slug, t])),
    [allTags],
  )

  const results: SearchHit[] = useMemo(() => {
    return searchArticles(debouncedQuery)
  }, [debouncedQuery])

  const trimmed = debouncedQuery.trim()
  const showHint = trimmed.length === 0
  const showEmpty = !showHint && results.length === 0

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
          className="border border-border-hi bg-bg px-4 py-3 font-serif text-h3 text-text placeholder:text-text-4 focus:outline-none focus:border-accent"
        />
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
                  className="border border-border px-3 py-1.5 font-mono text-micro uppercase tracking-[0.08em] text-text-2 hover:text-text"
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
      </Stack>
    </Container>
  )
}
