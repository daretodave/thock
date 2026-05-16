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
import { getAllTags, getArticlesByPillar, getArticlesByTag } from '@/lib/data-runtime'
import { ArticleCard } from '@/components/home/ArticleCard'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { PillarHero } from '@/components/pillar/PillarHero'
import {
  PillarArchiveList,
  sortArticlesForArchive,
} from '@/components/pillar/PillarArchiveList'
import {
  BUILD_OF_THE_WEEK_TAG,
  isoWeekNumber,
  pickBuildOfTheWeek,
} from './helpers'

const PILLAR = 'ideas' as const
const PATH = '/ideas'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'Builds, mods, and the half-formed ideas that turn into hobbies. Hands-on, opinionated, photo-rich.'
const ARCHIVE_MAX = 25

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

/**
 * Phase 9 — Ideas pillar landing. Pillar header + optional
 * build-of-the-week featured slot + lead article + archive list.
 * Pure composition over phase 7 / 8 primitives.
 */
export default function IdeasPage(): ReactElement {
  const all = getArticlesByPillar(PILLAR)
  const sorted = sortArticlesForArchive(all)
  const allTags = getAllTags()
  const tagsBySlug = new Map<string, Tag>(allTags.map((t) => [t.slug, t]))

  const buildPickFromTag = pickBuildOfTheWeek(getArticlesByTag(BUILD_OF_THE_WEEK_TAG))
  const buildPick =
    buildPickFromTag && buildPickFromTag.frontmatter.pillar === PILLAR
      ? buildPickFromTag
      : null

  const remaining = buildPick
    ? sorted.filter((a) => a.slug !== buildPick.slug)
    : sorted
  const lead = remaining[0] ?? null
  const archive = remaining.slice(1)

  const itemListItems = sorted.slice(0, ARCHIVE_MAX).map((a) => ({
    name: a.frontmatter.title,
    path: `/article/${a.slug}`,
  }))

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({ name: TITLE, description: LEDE, path: PATH }),
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
        rssLink={{ href: '/feed/ideas.xml', label: 'Ideas RSS', sublabel: 'subscribe' }}
      />

      {buildPick && (
        <Container as="section" className="py-12 sm:py-16">
          <HomeSectionHeading
            kicker={`Build of the week · Week ${isoWeekNumber(
              buildPick.frontmatter.publishedAt,
            )}`}
            title="The build we keep coming back to"
          />
          <ArticleCard
            article={buildPick}
            variant="hero"
            tagsBySlug={tagsBySlug}
          />
        </Container>
      )}

      {lead ? (
        <Container as="section" className="py-12 sm:py-16">
          <HomeSectionHeading kicker="Latest" title="Newest from the workbench" />
          <ArticleCard article={lead} variant="hero" tagsBySlug={tagsBySlug} />
        </Container>
      ) : !buildPick ? (
        <Container as="section" className="py-16">
          <Stack gap={4}>
            <span data-testid="page-section-kicker" className="font-mono uppercase tracking-[0.12em] text-micro text-text-2">
              empty pillar
            </span>
            <h2 className="font-serif text-h2 text-text">No ideas pieces yet.</h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              The hands-on side warms up shortly.
            </p>
          </Stack>
        </Container>
      ) : null}

      {archive.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Archive" title="More Ideas pieces" />
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
