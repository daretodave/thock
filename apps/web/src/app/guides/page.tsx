import { getArticlesByPillar } from '@/lib/data-runtime'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
  pillarLabel,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

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

export default function GuidesPage() {
  const articles = getArticlesByPillar(PILLAR)
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
        eyebrow="pillar"
        title="guides"
        lede={LEDE}
        deferredTo="Phase 11"
      >
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </span>
      </PageStub>
    </>
  )
}
