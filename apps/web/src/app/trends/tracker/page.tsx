import Link from 'next/link'
import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
  canonicalUrl,
  siteConfig,
} from '@thock/seo'
import type { Article } from '@thock/content'
import {
  getAllArticles,
  getLatestTrendSnapshot,
} from '@/lib/data-runtime'
import { TrackerHeader } from '@/components/tracker/TrackerHeader'
import { TrackerSummaryGrid } from '@/components/tracker/TrackerSummaryGrid'
import { TrackerCategorySection } from '@/components/tracker/TrackerCategorySection'
import {
  groupByCategory,
  presentCategories,
  weekKicker,
} from '@/lib/tracker'

const PATH = '/trends/tracker'
const BASE_TITLE = 'Trends Tracker'
const LEDE =
  'A weighted weekly score across community chatter, retail availability, and editorial mentions. Row names link to their deep dive when one has been published.'

export function generateMetadata() {
  const snapshot = getLatestTrendSnapshot()
  const wk = snapshot ? weekKicker(snapshot.isoWeek) : null
  const title = wk
    ? `${BASE_TITLE} — Week ${wk.week}, ${wk.year}`
    : BASE_TITLE
  return buildMetadata({
    title,
    description: LEDE,
    path: PATH,
  })
}

function buildDatasetJsonLd(snapshot: NonNullable<
  ReturnType<typeof getLatestTrendSnapshot>
>) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Dataset' as const,
    name: BASE_TITLE,
    description: LEDE,
    url: canonicalUrl(PATH),
    temporalCoverage: snapshot.isoWeek,
    dateModified: snapshot.publishedAt,
    publisher: siteConfig.publisher,
  }
}

/**
 * Phase 8 — Trends Tracker dashboard. Header strip with week
 * number, top-movers summary grid, per-category tables. Reads from
 * `getLatestTrendSnapshot()` and resolves `articleSlug` references
 * against the article manifest for editor's-note links.
 */
export default function TrendsTrackerPage(): ReactElement {
  const snapshot = getLatestTrendSnapshot()

  const baseGraph = [
    buildCollectionPageJsonLd({
      name: BASE_TITLE,
      description: LEDE,
      path: PATH,
    }),
    buildBreadcrumbListJsonLd([
      { name: 'Home', path: '/' },
      { name: 'Trends', path: '/trends' },
      { name: 'Tracker', path: PATH },
    ]),
  ]

  if (!snapshot) {
    return (
      <main className="flex-1">
        <JsonLd graph={baseGraph} />
        <TrackerHeader snapshot={null} lede={LEDE} />
        <Container as="section" className="py-16">
          <Stack gap={4}>
            <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
              tracker · empty
            </span>
            <h2 className="font-serif text-h2 text-text">
              No tracker snapshot has shipped yet.
            </h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              Check back next Monday at 09:00 EST.
            </p>
            <Link
              href="/trends"
              className="font-mono text-small uppercase tracking-[0.08em] text-accent hover:text-accent-hi"
            >
              ← Trends pillar
            </Link>
          </Stack>
        </Container>
      </main>
    )
  }

  const grouped = groupByCategory(snapshot.rows)
  const categories = presentCategories(snapshot)

  const articlesBySlug = new Map<string, Article>(
    getAllArticles().map((a) => [a.slug, a]),
  )

  return (
    <main className="flex-1">
      <JsonLd graph={[...baseGraph, buildDatasetJsonLd(snapshot)]} />
      <TrackerHeader snapshot={snapshot} lede={LEDE} />

      {snapshot.rows.length > 0 ? (
        <Container as="section" className="py-12 sm:py-16">
          {/* h2 wrapper restores the heading sequence from h1 → h3*4
           * (skip) to h1 → h2 → h3*4. WCAG 1.3.1 (AA). Closes the
           * a11y audit-pass row filed at this commit's predecessor. */}
          <h2
            data-testid="tracker-summary-heading"
            className="mb-6 font-serif text-h2 text-text"
          >
            This week at a glance
          </h2>
          <TrackerSummaryGrid snapshot={snapshot} />
        </Container>
      ) : (
        <Container as="section" className="py-16">
          <Stack gap={3}>
            <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
              snapshot · zero rows
            </span>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              The latest snapshot has no rows. The next issue should
              fix that.
            </p>
          </Stack>
        </Container>
      )}

      {categories.map((category) => (
        <TrackerCategorySection
          key={category}
          category={category}
          rows={grouped.get(category) ?? []}
          articlesBySlug={articlesBySlug}
        />
      ))}
    </main>
  )
}
