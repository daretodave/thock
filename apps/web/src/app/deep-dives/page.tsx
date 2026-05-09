import { getArticlesByPillar } from '@thock/content'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
  pillarLabel,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PILLAR = 'deep-dives' as const
const PATH = '/deep-dives'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'Long-form, sourced, and unhurried. The pieces that earn a quiet evening and a fresh cup of coffee.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function DeepDivesPage() {
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
        title="deep dives"
        lede={LEDE}
        deferredTo="Phase 10"
      >
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'} ·
          longest first when the family ships
        </span>
      </PageStub>
    </>
  )
}
