import type { ReactElement } from 'react'
import { Container } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  canonicalUrl,
  JsonLd,
} from '@thock/seo'
import { getAllSwitches, getSwitchBySlug } from '@/lib/data-runtime'
import { SwitchCompareSelector } from '@/components/compare/SwitchCompareSelector'
import { SwitchCompareTable } from '@/components/compare/SwitchCompareTable'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>
}) {
  const { a, b } = await searchParams
  const switchA = a ? getSwitchBySlug(a) : null
  const switchB = b && b !== a ? getSwitchBySlug(b) : null

  if (switchA && switchB) {
    return buildMetadata({
      title: `${switchA.name} vs ${switchB.name}`,
      description: `Compare ${switchA.name} and ${switchB.name} side by side — type, housing, spring weight, travel, and more.`,
      path: '/compare/switch',
    })
  }

  return buildMetadata({
    title: 'Compare switches',
    description:
      'Side-by-side spec comparison of any two mechanical keyboard switches from the thock catalog.',
    path: '/compare/switch',
  })
}

/**
 * Phase 44 — switch comparison tool.
 *
 * /compare/switch                       → selector only (empty state)
 * /compare/switch?a=<slug>&b=<slug>     → selector + spec table
 *
 * Invalid slugs silently fall back to no-table state — this is a tool,
 * not an entity page; a bad query param shouldn't 404.
 */
export default async function CompareSwitchPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>
}): Promise<ReactElement> {
  const { a, b } = await searchParams
  const switches = getAllSwitches()
  const switchA = a ? getSwitchBySlug(a) : null
  const switchB = b && b !== a ? getSwitchBySlug(b) : null
  const showTable = switchA !== null && switchB !== null

  const breadcrumb = buildBreadcrumbListJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Parts', path: '/parts' },
    { name: 'Switches', path: '/part/switch' },
    { name: 'Compare', path: '/compare/switch' },
  ])

  const graph = showTable
    ? [
        breadcrumb,
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${switchA.name} vs ${switchB.name}`,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              url: canonicalUrl(`/part/switch/${switchA.slug}`),
              name: switchA.name,
            },
            {
              '@type': 'ListItem',
              position: 2,
              url: canonicalUrl(`/part/switch/${switchB.slug}`),
              name: switchB.name,
            },
          ],
        },
      ]
    : [breadcrumb]

  const heading = showTable
    ? `${switchA.name} vs ${switchB.name}`
    : 'Compare switches'

  return (
    <main id="main" className="flex-1">
      <JsonLd graph={graph} />
      <Container>
        <div className="pt-8 pb-4">
          <p
            data-testid="compare-eyebrow"
            className="font-mono text-micro uppercase tracking-[0.12em] text-accent mb-2"
          >
            catalog · switches
          </p>
          <h1 data-testid="compare-h1" className="text-h1 font-serif text-text mb-6">
            {heading}
          </h1>
        </div>

        <SwitchCompareSelector
          switches={switches}
          initialA={a ?? ''}
          initialB={b ?? ''}
        />

        {!showTable && (
          <p className="text-body text-text-2 pb-8">
            Select two switches above to see a side-by-side spec comparison.
          </p>
        )}
      </Container>

      {showTable && (
        <SwitchCompareTable switchA={switchA} switchB={switchB} />
      )}
    </main>
  )
}
