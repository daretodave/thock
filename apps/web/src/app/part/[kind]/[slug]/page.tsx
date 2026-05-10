import type { ReactElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import type { Tag } from '@thock/content'
import {
  getAllTags,
  getArticlesMentioningPart,
  getBoardBySlug,
  getKeycapSetBySlug,
  getSwitchBySlug,
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

const VALID_KINDS = ['switch', 'keycap-set', 'board'] as const
type ValidKind = (typeof VALID_KINDS)[number]

function isValidKind(kind: string): kind is ValidKind {
  return (VALID_KINDS as readonly string[]).includes(kind)
}

function resolvePart(kind: ValidKind, slug: string): ResolvedPart | null {
  if (kind === 'switch') {
    const record = getSwitchBySlug(slug)
    return record
      ? { id: `switch:${slug}`, kind: 'switch', slug, record }
      : null
  }
  if (kind === 'keycap-set') {
    const record = getKeycapSetBySlug(slug)
    return record
      ? { id: `keycap-set:${slug}`, kind: 'keycap-set', slug, record }
      : null
  }
  const record = getBoardBySlug(slug)
  return record ? { id: `board:${slug}`, kind: 'board', slug, record } : null
}

function shortDescription(description: string, max = 150): string {
  if (description.length <= max) return description
  const cut = description.slice(0, max).split(' ').slice(0, -1).join(' ')
  return cut.trimEnd() + '…'
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
    <main className="flex-1">
      <JsonLd
        graph={[
          {
            '@context': 'https://schema.org',
            '@type': part.kind === 'board' ? 'Thing' : 'Product',
            name: part.record.name,
            description: shortDescription(part.record.description),
            url: `https://thock-coral.vercel.app${path}`,
            ...(part.kind !== 'board' && {
              brand: {
                '@type': 'Brand',
                name: part.record.vendorSlug,
              },
            }),
            ...(part.record.releasedAt && {
              releaseDate: part.record.releasedAt,
            }),
          },
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Parts', path: '/part' },
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
          <Link
            href={`/part/${part.kind}`}
            data-testid="part-detail-back-link"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-3 hover:text-text"
          >
            ← all {kindHuman.toLowerCase()}s
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
