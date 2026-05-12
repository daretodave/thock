import { notFound } from 'next/navigation'
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
  getAllTrendSnapshots,
  getTrendSnapshot,
} from '@/lib/data-runtime'
import { TrackerHeader } from '@/components/tracker/TrackerHeader'
import { TrackerSummaryGrid } from '@/components/tracker/TrackerSummaryGrid'
import { TrackerCategorySection } from '@/components/tracker/TrackerCategorySection'
import {
  groupByCategory,
  presentCategories,
  weekKicker,
} from '@/lib/tracker'

const LEDE =
  'A weighted weekly score across community chatter, retail availability, and editorial mentions. Row names link to their deep dive when one has been published.'

export const dynamicParams = false

export function generateStaticParams(): Array<{ week: string }> {
  return getAllTrendSnapshots().map((s) => ({ week: s.isoWeek }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ week: string }>
}) {
  const { week } = await params
  const snapshot = getTrendSnapshot(week)
  if (!snapshot) return {}
  const wk = weekKicker(snapshot.isoWeek)
  const title = wk
    ? `Trends Tracker — Week ${wk.week}, ${wk.year}`
    : 'Trends Tracker'
  return buildMetadata({
    title,
    description: LEDE,
    path: `/trends/tracker/${week}`,
  })
}

function buildDatasetJsonLd(
  snapshot: NonNullable<ReturnType<typeof getTrendSnapshot>>,
  week: string,
) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'Dataset' as const,
    name: 'Trends Tracker',
    description: LEDE,
    url: canonicalUrl(`/trends/tracker/${week}`),
    temporalCoverage: snapshot.isoWeek,
    dateModified: snapshot.publishedAt,
    publisher: siteConfig.publisher,
  }
}

function getAdjacentWeeks(week: string): {
  prev: string | null
  next: string | null
} {
  const all = getAllTrendSnapshots()
  const idx = all.findIndex((s) => s.isoWeek === week)
  return {
    prev: idx > 0 ? (all[idx - 1]?.isoWeek ?? null) : null,
    next: idx < all.length - 1 ? (all[idx + 1]?.isoWeek ?? null) : null,
  }
}

export default async function TrackerWeekPage({
  params,
}: {
  params: Promise<{ week: string }>
}): Promise<ReactElement> {
  const { week } = await params
  const snapshot = getTrendSnapshot(week)

  if (!snapshot) {
    notFound()
  }

  const wk = weekKicker(snapshot.isoWeek)
  const grouped = groupByCategory(snapshot.rows)
  const categories = presentCategories(snapshot)
  const { prev, next } = getAdjacentWeeks(week)

  const articlesBySlug = new Map<string, Article>(
    getAllArticles().map((a) => [a.slug, a]),
  )

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Trends', path: '/trends' },
    { name: 'Tracker', path: '/trends/tracker' },
    {
      name: wk ? `Week ${wk.week}, ${wk.year}` : week,
      path: `/trends/tracker/${week}`,
    },
  ]

  const jsonLdGraph = [
    buildCollectionPageJsonLd({
      name: wk ? `Trends Tracker — Week ${wk.week}, ${wk.year}` : 'Trends Tracker',
      description: LEDE,
      path: `/trends/tracker/${week}`,
    }),
    buildBreadcrumbListJsonLd(breadcrumbs),
    buildDatasetJsonLd(snapshot, week),
  ]

  return (
    <main id="main" className="flex-1">
      <JsonLd graph={jsonLdGraph} />

      {/* Back-to-latest navigation */}
      <Container className="pt-6">
        <Link
          href="/trends/tracker"
          className="font-mono text-small uppercase tracking-[0.08em] text-text-3 hover:text-text"
        >
          ← Back to latest
        </Link>
      </Container>

      <TrackerHeader snapshot={snapshot} lede={LEDE} />

      {snapshot.rows.length > 0 ? (
        <Container as="section" className="py-12 sm:py-16">
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
              This snapshot has no rows.
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

      {/* Prev / Next week navigation */}
      <Container as="section" aria-label="Weekly archive navigation" className="py-8 border-t border-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            {prev ? (
              <Link
                href={`/trends/tracker/${prev}`}
                data-testid="tracker-prev-week"
                className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
              >
                ← {weekKicker(prev) ? `Week ${weekKicker(prev)!.week}, ${weekKicker(prev)!.year}` : prev}
              </Link>
            ) : (
              <span className="font-mono text-small uppercase tracking-[0.08em] text-text-4">
                ← No earlier weeks
              </span>
            )}
          </div>
          <div>
            {next ? (
              <Link
                href={`/trends/tracker/${next}`}
                data-testid="tracker-next-week"
                className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
              >
                {weekKicker(next) ? `Week ${weekKicker(next)!.week}, ${weekKicker(next)!.year}` : next} →
              </Link>
            ) : (
              <Link
                href="/trends/tracker"
                data-testid="tracker-next-week"
                className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
              >
                Latest →
              </Link>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
