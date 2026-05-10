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
import {
  LatestByPillar,
  resolveLatestByPillar,
} from '@/components/home/LatestByPillar'
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
  // Critique pass 3 [MED]: the hero card and the by-pillar Trends slot
  // both surfaced trends-tracker-preview, duplicating it above the fold.
  // Excluding the hero's slug from the by-pillar resolver guarantees the
  // grid always picks the next-most-recent article in any pillar that
  // already supplied the hero.
  const heroExcludeSlugs = heroArticle
    ? new Set<string>([heroArticle.slug])
    : undefined
  // Critique pass 4 [LOW]: the "Long reads worth your weekend" rail
  // independently picks the newest deep-dive while <LatestByPillar>
  // also picks one for its Deep Dives slot — readers saw the same
  // card twice on the same screen. Resolve the by-pillar picks once
  // and exclude them from the long-reads rail (same pattern as the
  // e10a8b6 hero/by-pillar dedup, one slot deeper).
  const byPillarPicks = resolveLatestByPillar(
    latestByPillar,
    undefined,
    heroExcludeSlugs,
  )
  const longReadsExcludeSlugs = new Set<string>(
    byPillarPicks.map((a) => a.slug),
  )
  // Critique pass 5 [MED]: the long-reads column rendered its
  // "Deep Dives / Long reads worth your weekend" eyebrow + heading
  // even when HomeDeepDivesRail's pick list was empty (the only
  // Deep Dives piece had been deduped by e68959e). Compute whether
  // the column will have content at the page level so the heading
  // wrapper can be skipped when the rail would render nothing —
  // and so the grid can reflow to give the group-buys widget the
  // full container width when long-reads is empty.
  const longReadsHasContent = articles.some(
    (a) =>
      a.frontmatter.pillar === 'deep-dives' &&
      !longReadsExcludeSlugs.has(a.slug),
  )
  const groupBuysHasContent = activeGroupBuys.length > 0
  const itemListPaths = [...articles]
    .sort((a, b) =>
      b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
    )
    .slice(0, 4)

  return (
    <main className="flex-1">
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
          excludeSlugs={heroExcludeSlugs}
        />
      </Container>

      {/* Two-up: long reads + group buys */}
      {(longReadsHasContent || groupBuysHasContent) && (
        <Container as="section" className="pb-12 sm:pb-16">
          <div
            className={
              longReadsHasContent && groupBuysHasContent
                ? 'grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-12'
                : 'grid grid-cols-1 gap-10'
            }
          >
            {longReadsHasContent && (
              <div data-testid="home-long-reads-column">
                <HomeSectionHeading
                  kicker="Deep Dives"
                  title="Long reads worth your weekend"
                />
                <HomeDeepDivesRail
                  articles={articles}
                  tagsBySlug={tagsBySlug}
                  excludeSlugs={longReadsExcludeSlugs}
                />
              </div>
            )}
            {groupBuysHasContent && (
              <div data-testid="home-group-buys-column">
                <GroupBuysWidget
                  groupBuys={activeGroupBuys}
                  vendors={vendors}
                />
              </div>
            )}
          </div>
        </Container>
      )}
    </main>
  )
}
