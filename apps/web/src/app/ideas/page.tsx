import { getArticlesByPillar } from '@/lib/data-runtime'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildMetadata,
  JsonLd,
  pillarLabel,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PILLAR = 'ideas' as const
const PATH = '/ideas'
const TITLE = pillarLabel(PILLAR)
const LEDE =
  'Builds, mods, and the half-formed ideas that turn into hobbies. Hands-on, opinionated, photo-rich.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function IdeasPage() {
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
      <PageStub eyebrow="pillar" title="ideas &amp; builds" lede={LEDE} deferredTo="Phase 9">
        <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </span>
      </PageStub>
    </>
  )
}
