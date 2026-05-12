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
import { groupGuidesBySection } from './helpers'

const PILLAR = 'guides' as const
const PATH = '/guides'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'Practical reference: firmware, modding, switches, keycaps. Sectioned and freshness-stamped so the answers age honestly.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

/**
 * Phase 11 — Guides pillar landing. Pillar header +
 * freshness-stamped sections grouped by `guideSection`. No hero
 * lead: reference content has no "newest pick" identity, so the
 * section grid is the visual anchor. Empty sections drop silently.
 */
export default function GuidesPage(): ReactElement {
  const all = getArticlesByPillar(PILLAR)
  const groups = groupGuidesBySection(all)
  const allTags = getAllTags()
  const tagsBySlug = new Map<string, Tag>(allTags.map((t) => [t.slug, t]))

  const itemListItems = groups.flatMap((g) =>
    g.articles.map((a) => ({
      name: a.frontmatter.title,
      path: `/article/${a.slug}`,
    })),
  )

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
          href: '/feed/guides.xml',
          label: 'Guides RSS',
          sublabel: 'subscribe',
        }}
      />

      {groups.length === 0 ? (
        <Container as="section" className="py-16">
          <Stack gap={4}>
            <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
              empty pillar
            </span>
            <h2 className="font-serif text-h2 text-text">No guides yet.</h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              The reference shelf fills in soon.
            </p>
          </Stack>
        </Container>
      ) : (
        groups.map((group) => (
          <Container
            as="section"
            key={group.key}
            className="pb-12 sm:pb-16"
          >
            <HomeSectionHeading kicker="Section" title={group.label} />
            <div data-testid={`guide-section-${group.key}`} className="flex flex-col">
              {group.articles.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  variant="row"
                  tagsBySlug={tagsBySlug}
                />
              ))}
            </div>
          </Container>
        ))
      )}
    </main>
  )
}
