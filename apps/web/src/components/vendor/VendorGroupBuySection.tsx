import type { ReactElement } from 'react'
import { Container, Stack } from '@thock/ui'
import type { GroupBuy, Vendor } from '@thock/data'
import { GroupBuyRow } from '@/components/group-buys/GroupBuyRow'

const SECTION_HEADING_CLASS =
  'font-mono uppercase tracking-[0.12em] text-micro text-text-2'

export type VendorGroupBuySectionProps = {
  vendorName: string
  active: GroupBuy[]
  past: GroupBuy[]
  vendor: Vendor
  now?: Date
}

function sectionVariant(gb: GroupBuy, now: Date): 'live' | 'announced' | 'ended' {
  const today = now.toISOString().slice(0, 10)
  if (gb.status === 'closed' || gb.status === 'shipped') return 'ended'
  if ((gb.status === 'live' || gb.status === 'announced') && gb.endDate < today) return 'ended'
  // A record can be left at status:'announced' after its startDate has
  // already passed (the same stale-status class of bug as critique #44
  // on the canonical /group-buys page, see group-buys/helpers.ts#isLive).
  // Only render the "opens in Xd" copy while the start date is still
  // ahead of us; otherwise treat it as live so GroupBuyRow shows a
  // countdown to close instead of a countdown to an open date that has
  // already happened.
  if (gb.status === 'announced' && gb.startDate > today) return 'announced'
  return 'live'
}

export function VendorGroupBuySection({
  vendorName,
  active,
  past,
  vendor,
  now = new Date(),
}: VendorGroupBuySectionProps): ReactElement {
  return (
    <>
      <Container as="section" className="pb-12">
        <Stack gap={6}>
          <h2 data-testid="vendor-active-buys-kicker" className={SECTION_HEADING_CLASS}>
            active group buys
          </h2>
          {active.length === 0 ? (
            <p
              data-testid="vendor-active-buys-empty"
              className="text-body text-text-2"
            >
              No active group buys from {vendorName} right now.
            </p>
          ) : (
            <div
              data-testid="vendor-active-buys-list"
              className="flex flex-col"
            >
              {active.map((gb) => (
                <GroupBuyRow
                  key={gb.slug}
                  groupBuy={gb}
                  vendor={vendor}
                  variant={sectionVariant(gb, now)}
                  now={now}
                />
              ))}
            </div>
          )}
        </Stack>
      </Container>

      <Container as="section" className="pb-12">
        <Stack gap={6}>
          <h2 data-testid="vendor-past-buys-kicker" className={SECTION_HEADING_CLASS}>
            past group buys
          </h2>
          {past.length === 0 ? (
            <p
              data-testid="vendor-past-buys-empty"
              className="text-body text-text-2"
            >
              No past group buys recorded for {vendorName}.
            </p>
          ) : (
            <div
              data-testid="vendor-past-buys-list"
              className="flex flex-col"
            >
              {past.map((gb) => (
                <GroupBuyRow
                  key={gb.slug}
                  groupBuy={gb}
                  vendor={vendor}
                  variant="ended"
                  now={now}
                />
              ))}
            </div>
          )}
        </Stack>
      </Container>
    </>
  )
}
