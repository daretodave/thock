import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import type { Vendor } from '@thock/data'
import { getAllClosedGroupBuys, getAllVendors } from '@/lib/data-runtime'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { PageSectionKicker } from '@/components/ui/PageSectionKicker'
import { GroupBuyRow } from '@/components/group-buys/GroupBuyRow'

const PATH = '/group-buys/past'
const TITLE = 'Past group buys'
const LEDE =
  'Every group buy that has closed or shipped. The live index keeps only the freshest six in its rail; this is the full history.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

export default function PastGroupBuysPage(): ReactElement {
  const now = new Date()
  const past = getAllClosedGroupBuys(now)
  const vendors: Vendor[] = getAllVendors()
  const vendorBySlug = new Map<string, Vendor>(
    vendors.map((v) => [v.slug, v]),
  )

  const itemListItems = past.map((gb) => ({
    name: gb.name,
    url: gb.url,
  }))

  return (
    <main id="main" className="flex-1">
      <JsonLd
        graph={[
          buildCollectionPageJsonLd({
            name: TITLE,
            description: LEDE,
            path: PATH,
          }),
          buildBreadcrumbListJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Group buys', path: '/group-buys' },
            { name: 'Past', path: PATH },
          ]),
          buildItemListJsonLd({
            name: TITLE,
            items: itemListItems,
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent">
            archive
          </span>
          <h1 className="font-serif italic text-h1 sm:text-display text-text">
            {TITLE}
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">{LEDE}</p>
          <div
            data-testid="group-buys-past-summary"
            className="font-mono uppercase tracking-[0.08em] text-micro text-text-2"
          >
            {past.length} closed buys
          </div>
          <a
            href="/group-buys"
            className="font-mono text-micro uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            ← back to live group buys
          </a>
        </Stack>
      </Container>

      {past.length === 0 ? (
        <Container as="section" className="pb-16">
          <Stack gap={4}>
            <PageSectionKicker>empty archive</PageSectionKicker>
            <h2 className="font-serif text-h2 text-text">
              No closed buys yet.
            </h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              The archive fills as buys close. Check back later.
            </p>
          </Stack>
        </Container>
      ) : (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Archive" title="All past buys" />
          <div className="flex flex-col">
            {past.map((gb) => (
              <GroupBuyRow
                key={gb.slug}
                groupBuy={gb}
                vendor={vendorBySlug.get(gb.vendorSlug) ?? null}
                variant="ended"
                now={now}
              />
            ))}
          </div>
        </Container>
      )}
    </main>
  )
}
