import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import { getAllVendors } from '@/lib/data-runtime'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'
import { VendorCard } from '@/components/vendor/VendorCard'

const PATH = '/vendors'

export const metadata = buildMetadata({
  title: 'Vendors',
  description:
    'Browse all keyboard vendors in the thock catalog — group buys, boards, and editorial coverage from each.',
  path: PATH,
})

export default function VendorsPage(): ReactElement {
  const vendors = getAllVendors()
    .slice()
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1
      return a.name.localeCompare(b.name)
    })

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: 'Vendors — thock',
            description:
              'Browse all keyboard vendors in the thock catalog.',
            path: PATH,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Vendors', path: PATH },
          ]),
          buildItemListJsonLd({
            name: 'Keyboard vendors',
            items: vendors.map((v) => ({
              name: v.name,
              path: `/vendor/${v.slug}`,
            })),
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker testId="vendors-eyebrow">
            catalog · vendors
          </PageSectionKicker>
          <h1
            data-testid="vendors-h1"
            className="font-serif italic text-h1 sm:text-display text-text"
          >
            Vendors
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">
            {vendors.length} vendors across keyboards, keycaps, switches, and
            group buys.
          </p>
        </Stack>
      </Container>

      <Container as="section" className="pb-16">
        <div data-testid="vendors-list">
          {vendors.map((vendor) => (
            <VendorCard key={vendor.slug} vendor={vendor} />
          ))}
        </div>
      </Container>
    </main>
  )
}
