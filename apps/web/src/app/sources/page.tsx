import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PATH = '/sources'
const TITLE = 'Sources'
const LEDE =
  'Citations and references collected from every article. Honesty about where we got the facts.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function SourcesPage() {
  return (
    <>
      <JsonLd
        graph={[
          buildWebSiteJsonLd(),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: TITLE, path: PATH },
          ]),
        ]}
      />
      <PageStub
        eyebrow="references"
        title="sources"
        lede={LEDE}
        deferredTo="Phase 16"
      />
    </>
  )
}
