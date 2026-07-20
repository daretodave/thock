import type { ReactElement } from 'react'
import Link from 'next/link'
import type { Switch } from '@thock/data'
import { Container, Mono } from '@thock/ui'
import { getVendorBySlug } from '@/lib/data-runtime'
import { HOUSING_MATERIAL_LABEL, specLabel, STEM_MATERIAL_LABEL, SWITCH_TYPE_LABEL } from '@/lib/spec-labels'

const DATE_FMT = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeZone: 'UTC',
})

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return DATE_FMT.format(d)
}

const STATUS_LABEL: Record<Switch['status'], string> = {
  'in-production': 'in production',
  discontinued: 'discontinued',
  limited: 'limited',
}

type SpecRow = { label: string; value: string }

function switchSpecRows(s: Switch): SpecRow[] {
  return [
    { label: 'Type', value: specLabel(SWITCH_TYPE_LABEL, s.type) },
    { label: 'Top housing', value: specLabel(HOUSING_MATERIAL_LABEL, s.housingTop) },
    { label: 'Bottom housing', value: specLabel(HOUSING_MATERIAL_LABEL, s.housingBottom) },
    { label: 'Stem', value: specLabel(STEM_MATERIAL_LABEL, s.stem) },
    {
      label: 'Spring',
      value: `${s.springGrams.actuation}g actuation · ${s.springGrams.bottomOut}g bottom-out`,
    },
    { label: 'Travel', value: `${s.travelMm} mm` },
    { label: 'Factory lubed', value: s.factoryLubed ? 'yes' : 'no' },
    { label: 'Status', value: STATUS_LABEL[s.status] },
    { label: 'Released', value: formatDate(s.releasedAt) },
    { label: 'Vendor', value: getVendorBySlug(s.vendorSlug)?.name ?? s.vendorSlug },
  ]
}

export type SwitchCompareTableProps = {
  switchA: Switch
  switchB: Switch
}

export function SwitchCompareTable({
  switchA,
  switchB,
}: SwitchCompareTableProps): ReactElement {
  const rowsA = switchSpecRows(switchA)
  const rowsB = switchSpecRows(switchB)

  return (
    <Container
      as="section"
      data-testid="compare-table"
      className="pb-12 overflow-x-auto"
    >
      {/* Column headers */}
      <div className="grid grid-cols-[14ch_1fr_1fr] gap-x-8 mb-4 pb-3 border-b border-surface-3">
        <div />
        <div>
          <Link
            href={`/part/switch/${switchA.slug}`}
            data-testid="compare-switch-a-link"
            className="font-serif text-h3 text-text hover:text-accent transition-colors"
          >
            {switchA.name}
          </Link>
        </div>
        <div>
          <Link
            href={`/part/switch/${switchB.slug}`}
            data-testid="compare-switch-b-link"
            className="font-serif text-h3 text-text hover:text-accent transition-colors"
          >
            {switchB.name}
          </Link>
        </div>
      </div>

      {/* Spec rows */}
      <dl className="grid grid-cols-[14ch_1fr_1fr] gap-x-8 gap-y-3">
        {rowsA.map((rowA, i) => {
          const rowB = rowsB[i]!
          const differs = rowA.value !== rowB.value
          return (
            <div
              key={rowA.label}
              data-testid="compare-spec-row"
              data-differs={differs ? 'true' : 'false'}
              className="contents"
            >
              <dt className="font-mono uppercase tracking-[0.08em] text-micro text-text-2 self-start pt-0.5">
                {rowA.label}
              </dt>
              <dd className={`text-body ${differs ? 'text-text font-medium' : 'text-text-2'}`}>
                <Mono>{rowA.value}</Mono>
              </dd>
              <dd className={`text-body ${differs ? 'text-text font-medium' : 'text-text-2'}`}>
                <Mono>{rowB.value}</Mono>
              </dd>
            </div>
          )
        })}
      </dl>
    </Container>
  )
}
