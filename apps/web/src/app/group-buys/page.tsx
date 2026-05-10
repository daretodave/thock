import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import {
  buildBreadcrumbListJsonLd,
  buildCollectionPageJsonLd,
  buildItemListJsonLd,
  buildMetadata,
  JsonLd,
} from '@thock/seo'
import type { GroupBuy, Vendor } from '@thock/data'
import { getAllGroupBuys, getAllVendors } from '@/lib/data-runtime'
import { HomeSectionHeading } from '@/components/home/HomeSectionHeading'
import { GroupBuyRow } from '@/components/group-buys/GroupBuyRow'
import { partitionGroupBuys, splitLiveByUrgency } from './helpers'

const PATH = '/group-buys'
const TITLE = 'Group buys'
const LEDE =
  'Active group buys for boards, keycap sets, and switches. Time-aware, region-aware, vendor-linked.'

export const metadata = buildMetadata({
  title: TITLE,
  description: LEDE,
  path: PATH,
})

/**
 * Phase 13 — canonical group-buys index. Live now + Announced +
 * Recently ended sections, sorted per the brief. Pulls every group
 * buy and partitions in-memory; the home widget keeps its own
 * `getActiveGroupBuys()` read for compactness.
 */
export default function GroupBuysPage(): ReactElement {
  const now = new Date()
  const all = getAllGroupBuys()
  const { live, announced, ended } = partitionGroupBuys(all, now)
  // Critique pass 2 [MED]: "Closing soon" framing applied to a buy with
  // 37 days left was hype-bro voice. Split the live array so "Closing
  // soon" only renders when at least one buy is inside the 72h band;
  // the rest goes under a neutral "Open now" heading. Bearings rule:
  // brass urgency is reserved for the last 72 hours.
  const { closingSoon, liveOpen } = splitLiveByUrgency(live, now)
  const vendors: Vendor[] = getAllVendors()
  const vendorBySlug = new Map<string, Vendor>(
    vendors.map((v) => [v.slug, v]),
  )

  const itemListItems = [...live, ...announced].map((gb) => ({
    name: gb.name,
    url: gb.url,
  }))

  const totalActive = live.length + announced.length

  return (
    <main className="flex-1">
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
          buildItemListJsonLd({
            name: `${TITLE} — active`,
            items: itemListItems,
          }),
        ]}
      />

      <Container as="header" className="py-12 sm:py-16">
        <Stack gap={4}>
          <span className="font-mono uppercase tracking-[0.12em] text-micro text-accent">
            curated
          </span>
          <h1 className="font-serif italic text-h1 sm:text-display text-text">
            Group buys
          </h1>
          <p className="max-w-[60ch] font-serif text-h3 text-text-2">{LEDE}</p>
          <div className="font-mono uppercase tracking-[0.08em] text-micro text-text-3">
            {live.length} live · {announced.length} announced · {ended.length}{' '}
            recently ended
          </div>
        </Stack>
      </Container>

      {totalActive === 0 && ended.length === 0 ? (
        <Container as="section" className="pb-16">
          <Stack gap={4}>
            <span className="font-mono uppercase tracking-[0.12em] text-micro text-text-3">
              quiet week
            </span>
            <h2 className="font-serif text-h2 text-text">
              No active group buys right now.
            </h2>
            <p className="max-w-[60ch] font-serif text-h3 text-text-2">
              Check back weekly. We track every credible vendor.
            </p>
          </Stack>
        </Container>
      ) : null}

      {closingSoon.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Last 72h" title="Closing soon" />
          <SectionStack
            items={closingSoon}
            variant="live"
            now={now}
            vendorBySlug={vendorBySlug}
          />
        </Container>
      )}

      {liveOpen.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Live now" title="Open now" />
          <SectionStack
            items={liveOpen}
            variant="live"
            now={now}
            vendorBySlug={vendorBySlug}
          />
        </Container>
      )}

      {announced.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Announced" title="On the horizon" />
          <SectionStack
            items={announced}
            variant="announced"
            now={now}
            vendorBySlug={vendorBySlug}
          />
        </Container>
      )}

      {ended.length > 0 && (
        <Container as="section" className="pb-12 sm:pb-16">
          <HomeSectionHeading kicker="Recently ended" title="Just closed" />
          <SectionStack
            items={ended}
            variant="ended"
            now={now}
            vendorBySlug={vendorBySlug}
          />
        </Container>
      )}
    </main>
  )
}

function SectionStack({
  items,
  variant,
  now,
  vendorBySlug,
}: {
  items: GroupBuy[]
  variant: 'live' | 'announced' | 'ended'
  now: Date
  vendorBySlug: Map<string, Vendor>
}): ReactElement {
  return (
    <div className="flex flex-col">
      {items.map((gb) => (
        <GroupBuyRow
          key={gb.slug}
          groupBuy={gb}
          vendor={vendorBySlug.get(gb.vendorSlug) ?? null}
          variant={variant}
          now={now}
        />
      ))}
    </div>
  )
}
