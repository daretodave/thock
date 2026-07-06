import type { ReactElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import {
  getAllBoards,
  getAllKeycapSets,
  getAllSwitches,
  getVendorBySlug,
  type ResolvedPart,
} from '@/lib/data-runtime'
import { PartIndexCard } from '@/components/part/PartIndexCard'
import {
  isValidKind,
  sortParts,
  type ValidKind,
} from './helpers'

const KIND_HEADING: Record<ValidKind, string> = {
  switch: 'Switches',
  'keycap-set': 'Keycap sets',
  board: 'Boards',
}

const KIND_PLURAL: Record<ValidKind, string> = {
  switch: 'switches',
  'keycap-set': 'keycap-sets',
  board: 'boards',
}

const KIND_DESCRIPTION: Record<ValidKind, string> = {
  switch:
    'Every switch in the thock catalog — what they feel like, who makes them, and which articles dig in.',
  'keycap-set':
    'Every keycap set in the thock catalog — profile, material, designer, and which builds use them.',
  board:
    'Every board in the thock catalog — layout, mount style, and the articles that cover them.',
}

const KIND_TOOLS: Record<
  ValidKind,
  { quiz?: { href: string; label: string }; compare?: { href: string; label: string } }
> = {
  switch: {
    quiz: { href: '/quiz/switch', label: 'Find your switch →' },
    compare: { href: '/compare/switch', label: 'Compare switches →' },
  },
  'keycap-set': {
    quiz: { href: '/quiz/keycap-set', label: 'Find your keycap set →' },
  },
  board: {
    compare: { href: '/compare/board', label: 'Compare boards →' },
  },
}

function partsForKind(kind: ValidKind): ResolvedPart[] {
  if (kind === 'switch') {
    return getAllSwitches().map((record) => ({
      id: `switch:${record.slug}`,
      kind: 'switch',
      slug: record.slug,
      record,
    }))
  }
  if (kind === 'keycap-set') {
    return getAllKeycapSets().map((record) => ({
      id: `keycap-set:${record.slug}`,
      kind: 'keycap-set',
      slug: record.slug,
      record,
      vendorUrl: getVendorBySlug(record.vendorSlug)?.url ?? null,
    }))
  }
  return getAllBoards().map((record) => ({
    id: `board:${record.slug}`,
    kind: 'board',
    slug: record.slug,
    record,
    vendorUrl: getVendorBySlug(record.vendorSlug)?.url ?? null,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string }>
}) {
  const { kind } = await params
  if (!isValidKind(kind)) return {}
  return buildMetadata({
    title: KIND_HEADING[kind],
    description: KIND_DESCRIPTION[kind],
    path: `/part/${kind}`,
  })
}

/**
 * Phase 21 — kind-index page. Lists every part of one kind, active
 * statuses first, alphabetical within active vs. retired. Faceted
 * browse path; SEO surface for the parts catalog.
 */
export default async function PartIndexPage({
  params,
}: {
  params: Promise<{ kind: string }>
}): Promise<ReactElement> {
  const { kind } = await params
  if (!isValidKind(kind)) notFound()

  const parts = sortParts(partsForKind(kind))
  const path = `/part/${kind}`
  const heading = KIND_HEADING[kind]
  const description = KIND_DESCRIPTION[kind]
  const tools = KIND_TOOLS[kind]

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: `${heading} on thock`,
            description,
            path,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Parts', path: '/parts' },
            { name: heading, path },
          ]),
          buildItemListJsonLd({
            name: `${heading} — thock catalog`,
            items: parts.map((p) => ({
              name: p.record.name,
              path: `/part/${p.kind}/${p.slug}`,
            })),
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span
            data-testid="part-index-eyebrow"
            className="font-mono uppercase tracking-[0.12em] text-micro text-accent"
          >
            catalog · {kind}
          </span>
          <h1
            data-testid="part-index-h1"
            className="font-serif text-h1 sm:text-display text-text"
          >
            {heading}
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            {description}
          </p>
          <Link
            href="/parts"
            data-testid="part-kind-back-link"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← all parts
          </Link>
          {(tools.quiz ?? tools.compare) && (
            <div className="flex flex-wrap gap-4">
              {tools.quiz && (
                <Link
                  href={tools.quiz.href}
                  data-testid="part-kind-quiz-link"
                  className="font-mono text-small uppercase tracking-[0.08em] text-accent hover:text-text"
                >
                  {tools.quiz.label}
                </Link>
              )}
              {tools.compare && (
                <Link
                  href={tools.compare.href}
                  data-testid="part-kind-compare-link"
                  className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
                >
                  {tools.compare.label}
                </Link>
              )}
            </div>
          )}
        </Stack>
      </Container>

      <Container as="section" className="pb-12 sm:pb-16">
        <div data-testid="part-index-list" className="flex flex-col">
          {parts.map((part) => (
            <PartIndexCard key={`${part.kind}:${part.slug}`} part={part} />
          ))}
        </div>
        <p
          data-testid="part-index-count"
          className="mt-6 font-mono uppercase tracking-[0.08em] text-micro text-text-2"
        >
          {parts.length}{' '}
          {parts.length === 1 ? kind : KIND_PLURAL[kind]} in the catalog.
        </p>
      </Container>
    </main>
  )
}
