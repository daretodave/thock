import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import type { KeycapSet } from '@thock/data'
import { KEYCAP_PROFILE_LABEL, specLabel } from '@/lib/spec-labels'

const SECTION_HEADING_CLASS =
  'font-mono uppercase tracking-[0.12em] text-micro text-text-2'

const STATUS_LABEL: Record<KeycapSet['status'], string> = {
  'in-stock': 'In stock',
  'sold-out': 'Sold out',
  'group-buy': 'Group buy',
  discontinued: 'Discontinued',
}

function statusTint(status: KeycapSet['status']): string {
  if (status === 'in-stock') return 'text-accent'
  return 'text-text-2'
}

export type VendorKeycapSetSectionProps = {
  vendorName: string
  keycapSets: KeycapSet[]
}

export function VendorKeycapSetSection({
  vendorName,
  keycapSets,
}: VendorKeycapSetSectionProps): ReactElement {
  return (
    <Container as="section" className="pb-12">
      <Stack gap={6}>
        <h2 data-testid="vendor-keycap-sets-kicker" className={SECTION_HEADING_CLASS}>
          keycap sets
        </h2>
        {keycapSets.length === 0 ? (
          <p
            data-testid="vendor-keycap-sets-empty"
            className="text-body text-text-2"
          >
            No keycap sets from {vendorName} in the catalog yet.
          </p>
        ) : (
          <div
            data-testid="vendor-keycap-sets-list"
            className="flex flex-col divide-y divide-border"
          >
            {keycapSets.map((k) => (
              <div
                key={k.slug}
                data-testid="vendor-keycap-set-row"
                className="py-4 flex flex-col gap-1"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link
                    href={`/part/keycap-set/${k.slug}`}
                    className="font-serif text-h3 text-text hover:text-accent transition-colors"
                  >
                    {k.name}
                  </Link>
                  <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-2">
                    {specLabel(KEYCAP_PROFILE_LABEL, k.profile)}
                  </span>
                  <span
                    className={`font-mono text-micro uppercase tracking-[0.08em] ${statusTint(k.status)}`}
                  >
                    {STATUS_LABEL[k.status]}
                  </span>
                </div>
                <p className="max-w-[60ch] text-small text-text-2">
                  {k.description.length > 100
                    ? k.description.slice(0, 100).replace(/\s\S*$/, '').trimEnd() + '…'
                    : k.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </Container>
  )
}
