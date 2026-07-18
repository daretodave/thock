import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import type { Switch } from '@thock/data'
import { specLabel, SWITCH_TYPE_LABEL } from '@/lib/spec-labels'

const SECTION_HEADING_CLASS =
  'font-mono uppercase tracking-[0.12em] text-micro text-text-2'

const STATUS_LABEL: Record<Switch['status'], string> = {
  'in-production': 'In production',
  discontinued: 'Discontinued',
  limited: 'Limited',
}

function statusTint(status: Switch['status']): string {
  if (status === 'in-production') return 'text-accent'
  return 'text-text-2'
}

export type VendorSwitchSectionProps = {
  vendorName: string
  switches: Switch[]
}

export function VendorSwitchSection({
  vendorName,
  switches,
}: VendorSwitchSectionProps): ReactElement {
  return (
    <Container as="section" className="pb-12">
      <Stack gap={6}>
        <h2 data-testid="vendor-switches-kicker" className={SECTION_HEADING_CLASS}>
          switches
        </h2>
        {switches.length === 0 ? (
          <p
            data-testid="vendor-switches-empty"
            className="text-body text-text-2"
          >
            No switches from {vendorName} in the catalog yet.
          </p>
        ) : (
          <div
            data-testid="vendor-switches-list"
            className="flex flex-col divide-y divide-border"
          >
            {switches.map((s) => (
              <div
                key={s.slug}
                data-testid="vendor-switch-row"
                className="py-4 flex flex-col gap-1"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link
                    href={`/part/switch/${s.slug}`}
                    className="font-serif text-h3 text-text hover:text-accent transition-colors"
                  >
                    {s.name}
                  </Link>
                  <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-2">
                    {specLabel(SWITCH_TYPE_LABEL, s.type)}
                  </span>
                  <span
                    className={`font-mono text-micro uppercase tracking-[0.08em] ${statusTint(s.status)}`}
                  >
                    {STATUS_LABEL[s.status]}
                  </span>
                </div>
                <p className="max-w-[60ch] text-small text-text-2">
                  {s.description.length > 100
                    ? s.description.slice(0, 100).replace(/\s\S*$/, '').trimEnd() + '…'
                    : s.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </Container>
  )
}
