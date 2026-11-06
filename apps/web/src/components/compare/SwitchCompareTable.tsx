import type { ReactElement } from 'react'
import Link from 'next/link'
import type { Switch } from '@thock/data'
import { Container, Mono } from '@thock/ui'
import { getVendorBySlug } from '@/lib/data-runtime'
import {
  HOUSING_MATERIAL_LABEL,
  SENSING_LABEL,
  specLabel,
  STEM_MATERIAL_LABEL,
  SWITCH_TYPE_LABEL,
} from '@/lib/spec-labels'

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
  const rows: SpecRow[] = [
    { label: 'Type', value: specLabel(SWITCH_TYPE_LABEL, s.type) },
    { label: 'Sensing', value: specLabel(SENSING_LABEL, s.sensing) },
    { label: 'Top housing', value: specLabel(HOUSING_MATERIAL_LABEL, s.housingTop) },
    { label: 'Bottom housing', value: specLabel(HOUSING_MATERIAL_LABEL, s.housingBottom) },
    { label: 'Stem', value: specLabel(STEM_MATERIAL_LABEL, s.stem) },
    {
      label: s.sensing !== 'mechanical' ? 'Force' : 'Spring',
      value: `${s.springGrams.actuation}g actuation · ${s.springGrams.bottomOut}g bottom-out`,
    },
  ]
  if (s.actuationRangeMm) {
    rows.push({
      label: 'Actuation range',
      value: `${s.actuationRangeMm.min}–${s.actuationRangeMm.max} mm`,
    })
  }
  rows.push(
    { label: 'Travel', value: `${s.travelMm} mm` },
    { label: 'Factory lubed', value: s.factoryLubed ? 'yes' : 'no' },
    { label: 'Status', value: STATUS_LABEL[s.status] },
    { label: 'Released', value: formatDate(s.releasedAt) },
    { label: 'Vendor', value: getVendorBySlug(s.vendorSlug)?.name ?? s.vendorSlug },
  )
  return rows
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
      <div className="grid grid-cols-[calc(14*var(--ch))_1fr_1fr] gap-x-8 mb-4 pb-3 border-b border-border-hi">
        <div />
        <div>
          <h2 data-testid="compare-switch-a-name" className="font-serif text-h3 text-text">
            <Link
              href={`/part/switch/${switchA.slug}`}
              data-testid="compare-switch-a-link"
              className="hover:text-accent transition-colors rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
            >
              {switchA.name}
            </Link>
          </h2>
        </div>
        <div>
          <h2 data-testid="compare-switch-b-name" className="font-serif text-h3 text-text">
            <Link
              href={`/part/switch/${switchB.slug}`}
              data-testid="compare-switch-b-link"
              className="hover:text-accent transition-colors rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
            >
              {switchB.name}
            </Link>
          </h2>
        </div>
      </div>

      {/* Spec rows */}
      <dl className="grid grid-cols-[calc(14*var(--ch))_1fr_1fr] gap-x-8 gap-y-3">
        {rowsA.map((rowA, i) => {
          const rowB = rowsB[i]!
          const differs = rowA.value !== rowB.value
          // Spring/Force is the one row whose label can differ between A and
          // B (each side relabels independently based on its own sensing).
          // Prefer "Force" over the "Spring" default so the shared dt still
          // reflects a hall-effect/TMR side even when the other side is
          // mechanical.
          const label = rowA.label !== rowB.label && rowA.label === 'Spring' ? rowB.label : rowA.label
          return (
            <div
              key={rowA.label}
              data-testid="compare-spec-row"
              data-differs={differs ? 'true' : 'false'}
              className="contents"
            >
              <dt className="font-mono uppercase tracking-[0.08em] text-micro text-text-2 self-start pt-0.5">
                {label}
              </dt>
              <dd className={`text-body ${differs ? 'text-text font-medium' : 'text-text-2'}`}>
                <span className="sr-only">{switchA.name}: </span>
                <Mono>{rowA.value}</Mono>
              </dd>
              <dd className={`text-body ${differs ? 'text-text font-medium' : 'text-text-2'}`}>
                <span className="sr-only">{switchB.name}: </span>
                <Mono>{rowB.value}</Mono>
              </dd>
            </div>
          )
        })}
      </dl>
    </Container>
  )
}
