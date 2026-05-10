import type { ReactElement } from 'react'
import { Suspense } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { getAllTags } from '@/lib/data-runtime'
import { SearchPanel } from './SearchPanel'

const PATH = '/search'
const TITLE = 'Search'
const LEDE =
  'Search every article, tag, and part across thock. Built locally — no third-party indexing.'

export const metadata = {
  ...buildMetadata({
    title: TITLE,
    description: LEDE,
    path: PATH,
  }),
  // /search?q=… variants don't add value to the index; the bare
  // /search page stays indexable.
  robots: { index: true, follow: true },
}

/**
 * Phase 14 — search landing. Header shell + client-only
 * <SearchPanel> that owns input + results. Suspense boundary
 * required because <SearchPanel> reads `useSearchParams`.
 */
export default function SearchPage(): ReactElement {
  const allTags = getAllTags()

  return (
    <main className="flex-1">
      <JsonLd
        graph={[
          buildWebSiteJsonLd(),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: TITLE, path: PATH },
          ]),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent">
            search
          </span>
          <h1 className="font-serif italic text-h1 sm:text-display text-text">
            Search thock
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">{LEDE}</p>
        </Stack>
      </Container>

      <Suspense fallback={null}>
        <SearchPanel allTags={allTags} />
      </Suspense>
    </main>
  )
}
