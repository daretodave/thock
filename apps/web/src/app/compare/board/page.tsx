import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  canonicalUrl,
  JsonLd,
} from '@thock/seo'
import { getAllBoards, getBoardBySlug } from '@/lib/data-runtime'
import { BoardCompareSelector } from '@/components/compare/BoardCompareSelector'
import { BoardCompareTable } from '@/components/compare/BoardCompareTable'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>
}) {
  const { a, b } = await searchParams
  const boardA = a ? getBoardBySlug(a) : null
  const boardB = b && b !== a ? getBoardBySlug(b) : null

  if (boardA && boardB) {
    return buildMetadata({
      title: `${boardA.name} vs ${boardB.name}`,
      description: `Compare ${boardA.name} and ${boardB.name} side by side — layout, mount style, case material, hotswap, and more.`,
      path: '/compare/board',
    })
  }

  return buildMetadata({
    title: 'Compare boards',
    description:
      'Side-by-side spec comparison of any two mechanical keyboard boards from the thock catalog.',
    path: '/compare/board',
  })
}

/**
 * Phase 48 — board comparison tool.
 *
 * /compare/board                       → selector only (empty state)
 * /compare/board?a=<slug>&b=<slug>     → selector + spec table
 *
 * Invalid slugs silently fall back to no-table state — a bad query param
 * shouldn't 404.
 */
export default async function CompareBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>
}): Promise<ReactElement> {
  const { a, b } = await searchParams
  const boards = getAllBoards()
  const boardA = a ? getBoardBySlug(a) : null
  const boardB = b && b !== a ? getBoardBySlug(b) : null
  const showTable = boardA !== null && boardB !== null

  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Parts', path: '/parts' },
    { name: 'Boards', path: '/part/board' },
    { name: 'Compare', path: '/compare/board' },
  ])

  const graph = showTable
    ? [
        breadcrumb,
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${boardA.name} vs ${boardB.name}`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              url: canonicalUrl(`/part/board/${boardA.slug}`),
              name: boardA.name,
            },
            {
              '@type': 'ListItem',
              position: 2,
              url: canonicalUrl(`/part/board/${boardB.slug}`),
              name: boardB.name,
            },
          ],
        },
      ]
    : [breadcrumb]

  const heading = showTable
    ? `${boardA.name} vs ${boardB.name}`
    : 'Compare boards'

  return (
    <main id="main" className="flex-1">
      <JsonLd graph={graph} />
      <Container>
        <div className="pt-8 pb-4">
          <p
            data-testid="compare-eyebrow"
            className="font-mono text-micro uppercase tracking-[0.12em] text-accent mb-2"
          >
            catalog · boards
          </p>
          <h1 data-testid="compare-h1" className="text-h1 font-serif text-text mb-6">
            {heading}
          </h1>
        </div>

        <BoardCompareSelector
          boards={boards}
          initialA={a ?? ''}
          initialB={b ?? ''}
        />

        {!showTable && (
          <p className="text-body text-text-2 pb-8">
            Select two boards above to see a side-by-side spec comparison.
          </p>
        )}
      </Container>

      {showTable && (
        <BoardCompareTable boardA={boardA} boardB={boardB} />
      )}
    </main>
  )
}
