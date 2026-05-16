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
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'
import { PillarHero } from '@/components/pillar/PillarHero'
import {
  PillarArchiveList,
  sortArticlesForArchive,
} from '@/components/pillar/PillarArchiveList'

const PILLAR = 'trends' as const
const PATH = '/trends'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'How taste in switches, layouts, and keycaps moves week-to-week. Editorial reads first; the tracker dashboard is one click away.'
const ARCHIVE_MAX = 25

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

/**
 * Phase 8 — Trends pillar landing. Mirrors phase 7 News, with a
 * dashboard pill stacked above the RSS pill so the tracker is one
 * click away.
 */
export default function TrendsPage(): ReactElement {
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
        pills={[
          {
            href: '/trends/tracker',
            label: 'Trends Tracker',
            sublabel: 'open the dashboard',
            testId: 'tracker',
          },
          {
            href: '/feed/trends.xml',
            label: 'Trends RSS',
            sublabel: 'subscribe',
            testId: 'rss',
          },
        ]}
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
            <PageSectionKicker>empty pillar</PageSectionKicker>
            <h2 className="font-serif text-h2 text-text">
              No trends pieces yet.
            </h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              The tracker dashboard is still live — open it to see the
              latest movers.
            </p>
          </Stack>
        </Container>
      )}

      {archive.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading
            kicker="Archive"
            title="More Trends pieces"
          />
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
