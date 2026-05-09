import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PATH = '/newsletter'
const TITLE = 'Newsletter'
const LEDE =
  'A weekly digest of the best of thock — trends, deep dives, and the group buys you should know about.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function NewsletterPage() {
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
        eyebrow="newsletter"
        title="join the newsletter"
        lede={LEDE}
        deferredTo="Phase 15"
      />
    </>
  )
}
