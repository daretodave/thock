import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  buildWebSiteJsonLd,
  JsonLd,
} from '@thock/seo'
import { PageStub } from '@/components/page-stub/PageStub'

const PATH = '/about'
const TITLE = 'About'
const LEDE =
  'Editorial standards, voice, and the people behind thock. Knowledgeable peer, never breathless hype.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function AboutPage() {
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
        eyebrow="about"
        title="about thock"
        lede={LEDE}
        deferredTo="Phase 16"
      />
    </>
  )
}
