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
import { PillarArchiveList } from '@/components/pillar/PillarArchiveList'
import { sortDeepDivesByLength } from './helpers'

const PILLAR = 'deep-dives' as const
const PATH = '/deep-dives'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'Long-form, sourced, and unhurried. The pieces that earn a quiet evening and a fresh cup of coffee.'
const ARCHIVE_MAX = 25

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

/**
 * Phase 10 — Deep Dives pillar landing. Mirrors phase 7/9 in shape;
 * the only twist is the sort axis: longest reads surface first so
 * the most ambitious pieces lead.
 */
export default function DeepDivesPage(): ReactElement {
  const all = sortDeepDivesByLength(getArticlesByPillar(PILLAR))
  const allTags = getAllTags()
  const tagsBySlug = new Map<string, Tag>(allTags.map((t) => [t.slug, t]))

  const lead = all[0] ?? null
  const archive = all.slice(1)

  const itemListItems = all.slice(0, ARCHIVE_MAX).map((a) => ({
    name: a.frontmatter.title,
    path: `/article/${a.slug}`,
  }))

  return (
    <>
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
          href: '/feed/deep-dives.xml',
          label: 'Deep Dives RSS',
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
            <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
              empty pillar
            </span>
            <h2 className="font-serif text-h2 text-text">
              No deep dives yet.
            </h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              The long reads land soon.
            </p>
          </Stack>
        </Container>
      )}

      {archive.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Archive" title="More Deep Dives" />
          <PillarArchiveList
            articles={archive}
            tagsBySlug={tagsBySlug}
            max={ARCHIVE_MAX - 1}
          />
        </Container>
      )}
    </>
  )
}
