import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PATH = '/search'
const TITLE = 'Search'
const LEDE =
  'Search every article, tag, and part across thock. Built locally — no third-party indexing.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function SearchPage() {
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
        eyebrow="search"
        title="search"
        lede={LEDE}
        deferredTo="Phase 14"
      />
    </>
  )
}
