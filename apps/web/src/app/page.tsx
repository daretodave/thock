import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildItemListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
  siteConfig,
} from '@thock/seo'
import {
  getActiveGroupBuys,
  getAllArticles,
  getAllTags,
  getAllVendors,
  getLatestTrendSnapshot,
} from '@/lib/data-runtime'
import { ArticleCard } from '@/components/home/ArticleCard'
import { GroupBuysWidget } from '@/components/home/GroupBuysWidget'
import { HomeDeepDivesRail } from '@/components/home/HomeDeepDivesRail'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { LatestByPillar } from '@/components/home/LatestByPillar'
import { TrendingStrip } from '@/components/home/TrendingStrip'
import type { Article, Tag } from '@thock/content'

export const metadata = buildMetadata({
  title: siteConfig.tagline,
  description: siteConfig.description,
  path: '/',
})

function pickHero(articles: Article[]): Article | null {
  if (articles.length === 0) return null
  return [...articles].sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  )[0] ?? null
}

function isoWeekKicker(snapshotIsoWeek: string): string {
  const match = /^(\d{4})-W(\d{2})$/.exec(snapshotIsoWeek)
  if (!match) return snapshotIsoWeek
  return `Week ${match[2]} / ${match[1]}`
}

/**
 * Phase 6 — full home composition. Hero pick + trending strip +
 * latest-by-pillar grid + deep-dives long-reads rail + group-buys
 * widget. This is the first page that reads from every loader at
 * once; the manifest amortizes the cost across one render.
 */
export default function HomePage(): ReactElement {
  const articles = getAllArticles()
  const heroArticle = pickHero(articles)
  const allTags = getAllTags()
  const tagsBySlug = new Map<string, Tag>(allTags.map((t) => [t.slug, t]))
  const trendSnapshot = getLatestTrendSnapshot()
  const activeGroupBuys = getActiveGroupBuys()
  const vendors = getAllVendors()

  const latestByPillar = articles
  const itemListPaths = [...articles]
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    )
    .slice(0, 4)

  return (
    <>
      <JsonLd
        graph={[
          buildWebSiteJsonLd(),
          buildItemListJsonLd({
            name: 'Latest by pillar',
            items: itemListPaths.map((a) => ({
              name: a.frontmatter.title,
              path: `/article/${a.slug}`,
            })),
          }),
        ]}
      />

      {/* Hero */}
      <Container as="section" className="py-12 sm:py-16">
        {heroArticle ? (
          <ArticleCard
            article={heroArticle}
            variant="hero"
            tagsBySlug={tagsBySlug}
          />
        ) : (
          <Stack gap={4}>
            <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
              {siteConfig.tagline}
            </span>
            <h1 className="font-serif text-h1 sm:text-display text-text">
              {siteConfig.name}
            </h1>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              No articles yet — the editorial side warms up shortly.
            </p>
          </Stack>
        )}
      </Container>

      {/* Trending strip */}
      {trendSnapshot && trendSnapshot.rows.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading
            kicker={isoWeekKicker(trendSnapshot.isoWeek)}
            title="Trending — what's moving on the tracker"
            more={{
              label: 'open trends tracker',
              href: '/trends/tracker',
            }}
          />
          <TrendingStrip snapshot={trendSnapshot} />
        </Container>
      )}

      {/* Latest by pillar */}
      <Container as="section" className="pb-12 sm:pb-16">
        <HomeSectionHeading kicker="Latest" title="By pillar" />
        <LatestByPillar
          articles={latestByPillar}
          tagsBySlug={tagsBySlug}
        />
      </Container>

      {/* Two-up: long reads + group buys */}
      <Container as="section" className="pb-12 sm:pb-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12">
          <div data-testid="home-long-reads-column">
            <HomeSectionHeading
              kicker="Deep Dives"
              title="Long reads worth your weekend"
            />
            <HomeDeepDivesRail
              articles={articles}
              tagsBySlug={tagsBySlug}
            />
          </div>
          <div data-testid="home-group-buys-column">
            <GroupBuysWidget
              groupBuys={activeGroupBuys}
              vendors={vendors}
            />
          </div>
        </div>
      </Container>
    </>
  )
}
