import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
  pillarLabel,
} from '@thock/seo'
import type { Tag } from '@thock/content'
import { getAllTags, getArticlesByPillar } from '@/lib/data-runtime'
import { ArticleCard } from '@/components/home/ArticleCard'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { PillarHero } from '@/components/pillar/PillarHero'
import {
  PillarArchiveList,
  sortArticlesForArchive,
} from '@/components/pillar/PillarArchiveList'

const PILLAR = 'news' as const
const PATH = '/news'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'Curated coverage of mechanical keyboard releases, vendor moves, and the broader industry beat.'
const ARCHIVE_MAX = 25

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

/**
 * Phase 7 — News pillar landing. Pillar header + lead article +
 * chronological archive. Canonical shape mirrored by the remaining
 * four pillars in phases 8–11.
 */
export default function NewsPage(): ReactElement {
  const all = sortArticlesForArchive(getArticlesByPillar(PILLAR))
  const allTags = getAllTags()
  const tagsBySlug = new Map<string, Tag>(allTags.map((t) => [t.slug, t]))

  const lead = all[0] ?? null
  const archive = all.slice(1)

  const itemListItems = all.slice(0, ARCHIVE_MAX).map((a) => ({
    name: a.frontmatter.title,
    path: `/article/${a.slug}`,
  }))

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: TITLE,
            description: LEDE,
            path: PATH,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: TITLE, path: PATH },
          ]),
          buildItemListJsonLd({
            name: `${TITLE} — articles`,
            items: itemListItems,
          }),
        ]}
      />

      <PillarHero
        pillar={PILLAR}
        lede={LEDE}
        rssLink={{
          href: '/feed/news.xml',
          label: 'News RSS',
          sublabel: 'subscribe',
        }}
      />

      {lead ? (
        <Container as="section" className="py-12 sm:py-16">
          <ArticleCard
            article={lead}
            variant="hero"
            tagsBySlug={tagsBySlug}
          />
        </Container>
      ) : (
        <Container as="section" className="py-16">
          <Stack gap={4}>
            <span data-testid="page-section-kicker" className="font-mono uppercase tracking-[0.12em] text-micro text-text-2">
              empty pillar
            </span>
            <h2 className="font-serif text-h2 text-text">
              No news yet.
            </h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              The editorial side warms up shortly. Until then, the
              other pillars have stories worth your time.
            </p>
          </Stack>
        </Container>
      )}

      {archive.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Archive" title="More News pieces" />
          <PillarArchiveList
            articles={archive}
            tagsBySlug={tagsBySlug}
            max={ARCHIVE_MAX - 1}
          />
        </Container>
      )}
    </main>
  )
}
