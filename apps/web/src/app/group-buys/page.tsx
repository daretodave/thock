import { getActiveGroupBuys } from '@/lib/data-runtime'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PATH = '/group-buys'
const TITLE = 'Group buys'
const LEDE =
  'Active group buys for boards, keycap sets, and switches. Time-aware, region-aware, vendor-linked.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function GroupBuysPage() {
  const active = getActiveGroupBuys()

  return (
    <>
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({ name: TITLE, description: LEDE, path: PATH }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: TITLE, path: PATH },
          ]),
        ]}
      />
      <PageStub
        eyebrow="curated"
        title="group buys"
        lede={LEDE}
        deferredTo="Phase 13"
      >
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {active.length}{' '}
          {active.length === 1 ? 'active group buy' : 'active group buys'} ·
          full index lands phase 13
        </span>
      </PageStub>
    </>
  )
}
