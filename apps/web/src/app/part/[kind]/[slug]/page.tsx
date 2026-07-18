import type { ReactElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  canonicalUrl,
  JsonLd,
} from '@thock/seo'
import type { Tag } from '@thock/content'
import {
  getAllBoards,
  getAllKeycapSets,
  getAllSwitches,
  getAllTags,
  getArticlesMentioningPart,
  getBoardBySlug,
  getKeycapSetBySlug,
  getSwitchBySlug,
  getVendorBySlug,
  type ResolvedPart,
} from '@/lib/data-runtime'
import { PartHero } from '@/components/part/PartHero'
import { PartSpec } from '@/components/part/PartSpec'
import { PartBody } from '@/components/part/PartBody'
import { MentionedInArticles } from '@/components/part/MentionedInArticles'

const KIND_HUMAN: Record<ResolvedPart['kind'], string> = {
  switch: 'Switch',
  'keycap-set': 'Keycap set',
  board: 'Board',
}

const KIND_PLURAL: Record<ResolvedPart['kind'], string> = {
  switch: 'switches',
  'keycap-set': 'keycap sets',
  board: 'boards',
}

const VALID_KINDS = ['switch', 'keycap-set', 'board'] as const
type ValidKind = (typeof VALID_KINDS)[number]

function isValidKind(kind: string): kind is ValidKind {
  return (VALID_KINDS as readonly string[]).includes(kind)
}

function resolvePart(kind: ValidKind, slug: string): ResolvedPart | null {
  if (kind === 'switch') {
    const record = getSwitchBySlug(slug)
    return record
      ? {
          id: `switch:${slug}`,
          kind: 'switch',
          slug,
          record,
          vendorUrl: getVendorBySlug(record.vendorSlug)?.url ?? null,
        }
      : null
  }
  if (kind === 'keycap-set') {
    const record = getKeycapSetBySlug(slug)
    return record
      ? {
          id: `keycap-set:${slug}`,
          kind: 'keycap-set',
          slug,
          record,
          vendorUrl: getVendorBySlug(record.vendorSlug)?.url ?? null,
        }
      : null
  }
  const record = getBoardBySlug(slug)
  return record
    ? {
        id: `board:${slug}`,
        kind: 'board',
        slug,
        record,
        vendorUrl: getVendorBySlug(record.vendorSlug)?.url ?? null,
      }
    : null
}

function shortDescription(description: string, max = 150): string {
  if (description.length <= max) return description
  const cut = description.slice(0, max).split(' ').slice(0, -1).join(' ')
  return cut.trimEnd() + '…'
}

export const dynamicParams = false

export async function generateStaticParams(): Promise<
  { kind: string; slug: string }[]
> {
  return [
    ...getAllSwitches().map((s) => ({ kind: 'switch', slug: s.slug })),
    ...getAllKeycapSets().map((k) => ({ kind: 'keycap-set', slug: k.slug })),
    ...getAllBoards().map((b) => ({ kind: 'board', slug: b.slug })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>
}) {
  const { kind, slug } = await params
  if (!isValidKind(kind)) return {}
  const part = resolvePart(kind, slug)
  if (!part) return {}
  return buildMetadata({
    title: part.record.name,
    description: shortDescription(part.record.description),
    path: `/part/${part.kind}/${part.slug}`,
  })
}

/**
 * Phase 21 — canonical per-part page. Renders identity (PartHero),
 * kind-specific spec sheet (PartSpec), description prose (PartBody),
 * and the "mentioned in" article rail (MentionedInArticles).
 *
 * URL contract: `/part/<kind>/<slug>` where kind is one of
 * `switch`, `keycap-set`, `board`. Unknown kind or slug → 404.
 */
export default async function PartDetailPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>
}): Promise<ReactElement> {
  const { kind, slug } = await params
  if (!isValidKind(kind)) notFound()
  const part = resolvePart(kind, slug)
  if (!part) notFound()

  const articles = getArticlesMentioningPart(part.kind, part.slug)
  const tagsBySlug = new Map<string, Tag>(
    getAllTags().map((t) => [t.slug, t]),
  )
  const path = `/part/${part.kind}/${part.slug}`
  const kindHuman = KIND_HUMAN[part.kind]

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          {
            '@context': 'https://schema.org',
            '@type': 'Thing',
            name: part.record.name,
            description: shortDescription(part.record.description),
            url: canonicalUrl(path),
          },
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Parts', path: '/parts' },
            { name: kindHuman, path: `/part/${part.kind}` },
            { name: part.record.name, path },
          ]),
        ]}
      />

      <PartHero part={part} />
      <PartSpec part={part} />
      <PartBody description={part.record.description} />
      <Container as="section" className="pb-8">
        <Stack gap={2}>
          {part.kind === 'switch' && (
            <Link
              href={`/compare/switch?a=${part.slug}`}
              data-testid="part-compare-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
            >
              Compare this switch →
            </Link>
          )}
          {part.kind === 'switch' && (
            <Link
              href="/quiz/switch"
              data-testid="part-switch-quiz-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
            >
              Find your switch →
            </Link>
          )}
          {part.kind === 'board' && (
            <Link
              href={`/compare/board?a=${part.slug}`}
              data-testid="part-compare-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
            >
              Compare this board →
            </Link>
          )}
          {part.kind === 'keycap-set' && (
            <Link
              href="/quiz/keycap-set"
              data-testid="part-keycapset-quiz-link"
              className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
            >
              Find your keycap set →
            </Link>
          )}
          <Link
            href={`/part/${part.kind}`}
            data-testid="part-detail-back-link"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← all {KIND_PLURAL[part.kind]}
          </Link>
        </Stack>
      </Container>
      <MentionedInArticles
        partName={part.record.name}
        articles={articles}
        tagsBySlug={tagsBySlug}
      />
    </main>
  )
}
