import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { getAllBoards, getAllKeycapSets, getAllSwitches } from '@/lib/data-runtime'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'

const PATH = '/parts'

export const metadata = buildMetadata({
  title: 'Parts catalog',
  description:
    'Browse every switch, keycap set, and board in the thock catalog — specs, context, and the articles that cover them.',
  path: PATH,
})

type CategorySection = {
  kind: 'switch' | 'keycap-set' | 'board'
  heading: string
  description: string
  count: number
}

export default function PartsPage(): ReactElement {
  const switches = getAllSwitches()
  const keycapSets = getAllKeycapSets()
  const boards = getAllBoards()

  const sections: CategorySection[] = [
    {
      kind: 'switch',
      heading: 'Switches',
      description:
        'Every switch in the thock catalog — what they feel like, who makes them, and which articles dig in.',
      count: switches.length,
    },
    {
      kind: 'keycap-set',
      heading: 'Keycap sets',
      description:
        'Every keycap set in the thock catalog — profile, material, designer, and which builds use them.',
      count: keycapSets.length,
    },
    {
      kind: 'board',
      heading: 'Boards',
      description:
        'Every board in the thock catalog — layout, mount style, and the articles that cover them.',
      count: boards.length,
    },
  ]

  const totalCount = switches.length + keycapSets.length + boards.length

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: 'Parts catalog — thock',
            description:
              'Browse every switch, keycap set, and board in the thock catalog.',
            path: PATH,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Parts', path: PATH },
          ]),
          buildItemListJsonLd({
            name: 'Parts categories',
            items: sections.map((s) => ({
              name: s.heading,
              path: `/part/${s.kind}`,
            })),
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker testId="parts-eyebrow">
            catalog · all parts
          </PageSectionKicker>
          <h1
            data-testid="parts-h1"
            className="font-serif italic text-h1 sm:text-display text-text"
          >
            Parts
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            {totalCount} parts across switches, keycap sets, and boards.
          </p>
        </Stack>
      </Container>

      <Container as="section" className="pb-16">
        <div
          data-testid="parts-section-list"
          className="flex flex-col divide-y divide-border"
        >
          {sections.map((s) => (
            <Link
              key={s.kind}
              href={`/part/${s.kind}`}
              data-testid="parts-section-row"
              className="group py-8 flex flex-col gap-3 hover:bg-surface-1 -mx-4 px-4 sm:-mx-6 sm:px-6 transition-colors"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-h2 text-text group-hover:text-accent transition-colors">
                  {s.heading}
                </span>
                <span className="font-mono text-small text-text-2">
                  {s.count}
                </span>
              </div>
              <p className="max-w-[60ch] text-body text-text-2">
                {s.description}
              </p>
              <span className="font-mono text-small uppercase tracking-[0.08em] text-text-2 group-hover:text-text transition-colors">
                Browse {s.heading.toLowerCase()} →
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}
