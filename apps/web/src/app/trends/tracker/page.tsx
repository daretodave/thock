import { getLatestTrendSnapshot } from '@thock/data'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PATH = '/trends/tracker'
const TITLE = 'Trends Tracker'
const LEDE =
  'A weekly read of the meta — switches, keycaps, layouts, vendors. Table-first; sparklines support, never lead.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function TrendsTrackerPage() {
  const snapshot = getLatestTrendSnapshot()
  const week = snapshot?.isoWeek ?? 'no snapshot yet'
  const rowCount = snapshot?.rows.length ?? 0

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
            { name: 'Trends', path: '/trends' },
            { name: 'Tracker', path: PATH },
          ]),
        ]}
      />
      <PageStub
        eyebrow="signature feature"
        title="trends tracker"
        lede={LEDE}
        deferredTo="Phase 8"
      >
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          latest snapshot: {week} · {rowCount}{' '}
          {rowCount === 1 ? 'row' : 'rows'}
        </span>
      </PageStub>
    </>
  )
}
