import type { ReactElement } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import {
  getAllVendors,
  getBoardsByVendor,
  getGroupBuysByVendor,
  getKeycapSetsByVendor,
  getSwitchesByVendor,
  getVendorBySlug,
} from '@/lib/data-runtime'
import { countryLabel } from '@/lib/vendor-country'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'
import { VendorGroupBuySection } from '@/components/vendor/VendorGroupBuySection'
import { VendorSwitchSection } from '@/components/vendor/VendorSwitchSection'
import { VendorKeycapSetSection } from '@/components/vendor/VendorKeycapSetSection'
import { VendorBoardSection } from '@/components/vendor/VendorBoardSection'

export const dynamicParams = false

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return getAllVendors().map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vendor = getVendorBySlug(slug)
  if (!vendor) return {}
  const short =
    vendor.description.length > 160
      ? vendor.description.slice(0, 160).replace(/\s\S*$/, '').trimEnd() + '…'
      : vendor.description
  return buildMetadata({
    title: vendor.name,
    description: short,
    path: `/vendor/${slug}`,
  })
}

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<ReactElement> {
  const { slug } = await params
  const vendor = getVendorBySlug(slug)
  if (!vendor) notFound()

  const now = new Date()
  const todayIso = now.toISOString().slice(0, 10)

  const allGroupBuys = getGroupBuysByVendor(slug)
  const activeGroupBuys = allGroupBuys.filter((gb) => {
    if (gb.status === 'closed' || gb.status === 'shipped') return false
    if (gb.endDate < todayIso) return false
    return true
  })
  const pastGroupBuys = allGroupBuys.filter((gb) => {
    if (gb.status === 'closed' || gb.status === 'shipped') return true
    if (gb.endDate < todayIso) return true
    return false
  })
  const boards = getBoardsByVendor(slug)
  const switches = getSwitchesByVendor(slug)
  const keycapSets = getKeycapSetsByVendor(slug)
  const path = `/vendor/${slug}`
  const country = countryLabel(vendor.countryCode)

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: vendor.name,
            url: vendor.url,
            description: vendor.description,
          },
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Vendors', path: '/vendors' },
            { name: vendor.name, path },
          ]),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <PageSectionKicker testId="vendor-detail-eyebrow">
            vendor
          </PageSectionKicker>
          <h1
            data-testid="vendor-detail-h1"
            className="font-serif italic text-h1 sm:text-display text-text"
          >
            {vendor.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-small uppercase tracking-[0.08em] text-text-2">
            <span data-testid="vendor-detail-country">{country}</span>
            <a
              href={vendor.url}
              target="_blank"
              rel="sponsored noopener"
              data-testid="vendor-detail-url"
              className="hover:text-text transition-colors"
            >
              {vendor.url.replace(/^https?:\/\//, '')} ↗
            </a>
          </div>
          <p
            data-testid="vendor-detail-description"
            className="max-w-[66ch] font-serif text-body text-text-2 leading-relaxed"
          >
            {vendor.description}
          </p>
          <Link
            href="/vendors"
            data-testid="vendor-detail-back-link"
            className="font-mono text-small uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← all vendors
          </Link>
        </Stack>
      </Container>

      <VendorGroupBuySection
        vendorName={vendor.name}
        active={activeGroupBuys}
        past={pastGroupBuys}
        vendor={vendor}
        now={now}
      />

      <VendorSwitchSection vendorName={vendor.name} switches={switches} />

      <VendorKeycapSetSection vendorName={vendor.name} keycapSets={keycapSets} />

      <VendorBoardSection vendorName={vendor.name} boards={boards} />
    </main>
  )
}
