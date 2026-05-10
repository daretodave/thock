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
  type ResolvedPart,
} from '@/lib/data-runtime'
import { PartIndexCard } from '@/components/part/PartIndexCard'

const VALID_KINDS = ['switch', 'keycap-set', 'board'] as const
type ValidKind = (typeof VALID_KINDS)[number]

const KIND_HEADING: Record<ValidKind, string> = {
  switch: 'Switches',
  'keycap-set': 'Keycap sets',
  board: 'Boards',
}

const KIND_DESCRIPTION: Record<ValidKind, string> = {
  switch:
    'Every switch in the thock catalog — what they feel like, who makes them, and which articles dig in.',
  'keycap-set':
    'Every keycap set in the thock catalog — profile, material, designer, and which builds use them.',
  board:
    'Every board in the thock catalog — layout, mount style, and the articles that cover them.',
}

function isValidKind(kind: string): kind is ValidKind {
  return (VALID_KINDS as readonly string[]).includes(kind)
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
    }))
  }
  return getAllBoards().map((record) => ({
    id: `board:${record.slug}`,
    kind: 'board',
    slug: record.slug,
    record,
  }))
}

const PRODUCTION_STATUSES = new Set([
  'in-production',
  'in-stock',
  'group-buy',
  'limited',
])

function sortParts(parts: ResolvedPart[]): ResolvedPart[] {
  return [...parts].sort((a, b) => {
    const aActive = PRODUCTION_STATUSES.has(a.record.status)
    const bActive = PRODUCTION_STATUSES.has(b.record.status)
    if (aActive !== bActive) return aActive ? -1 : 1
    return a.record.name.localeCompare(b.record.name)
  })
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

  return (
    <>
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: `${heading} on thock`,
            description,
            path,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
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
            className="font-mono uppercase tracking-[0.12em] text-micro text-accent-mu"
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
            href="/"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-3 hover:text-text"
          >
            ← home
          </Link>
        </Stack>
      </Container>

      <Container as="section" className="pb-12 sm:pb-16">
        <div data-testid="part-index-list" className="flex flex-col">
          {parts.map((part) => (
            <PartIndexCard key={`${part.kind}:${part.slug}`} part={part} />
          ))}
        </div>
        <p className="mt-6 font-mono uppercase tracking-[0.08em] text-micro text-text-4">
          {parts.length}{' '}
          {parts.length === 1 ? `${kind}` : `${kind}s`} in the catalog.
        </p>
      </Container>
    </>
  )
}
