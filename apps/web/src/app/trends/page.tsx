import { getArticlesByPillar } from '@/lib/data-runtime'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
  pillarLabel,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PILLAR = 'trends' as const
const PATH = '/trends'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'How taste in switches, layouts, and keycaps moves week-to-week. Editorial reads first; the tracker dashboard is one click away.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function TrendsPage() {
  const articles = getArticlesByPillar(PILLAR)

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
        ]}
      />
      <PageStub eyebrow="pillar" title={TITLE.toLowerCase()} lede={LEDE} deferredTo="Phase 8">
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'} · the
          tracker lives at /trends/tracker
        </span>
      </PageStub>
    </>
  )
}
