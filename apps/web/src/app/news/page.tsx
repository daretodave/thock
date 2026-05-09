import { getArticlesByPillar } from '@/lib/data-runtime'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
  pillarLabel,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PILLAR = 'news' as const
const PATH = '/news'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'Curated coverage of mechanical keyboard releases, vendor moves, and the broader industry beat.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function NewsPage() {
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
      <PageStub eyebrow="pillar" title={TITLE.toLowerCase()} lede={LEDE} deferredTo="Phase 7">
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'} ·{' '}
          newest first
        </span>
      </PageStub>
    </>
  )
}
