import type { ReactElement } from 'react'
import { Container, Mono } from '@thock/ui'
import type { Switch, KeycapSet, Board } from '@thock/data'
import type { ResolvedPart } from '@/lib/data-runtime'

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

function switchRows(record: Switch): Array<[string, string]> {
  return [
    ['Type', record.type],
    ['Top housing', record.housingTop],
    ['Bottom housing', record.housingBottom],
    ['Stem', record.stem],
    [
      'Spring',
      `${record.springGrams.actuation}g actuation · ${record.springGrams.bottomOut}g bottom-out`,
    ],
    ['Travel', `${record.travelMm} mm`],
    ['Factory lubed', record.factoryLubed ? 'yes' : 'no'],
    ['Released', formatDate(record.releasedAt)],
  ]
}

function keycapSetRows(record: KeycapSet): Array<[string, string]> {
  return [
    ['Profile', record.profile],
    ['Material', record.material],
    ['Legend', record.legendType],
    ['Designer', record.designer ?? '—'],
    ['Released', formatDate(record.releasedAt)],
  ]
}

function boardRows(record: Board): Array<[string, string]> {
  return [
    ['Layout', record.layout],
    ['Case material', record.caseMaterial],
    ['Mount style', record.mountStyle],
    ['Hotswap', record.hotswap ? 'yes' : 'no'],
    ['Wireless', record.wireless ? 'yes' : 'no'],
    ['Released', formatDate(record.releasedAt)],
  ]
}

function rowsForPart(part: ResolvedPart): Array<[string, string]> {
  if (part.kind === 'switch') return switchRows(part.record)
  if (part.kind === 'keycap-set') return keycapSetRows(part.record)
  return boardRows(part.record)
}

export type PartSpecProps = {
  part: ResolvedPart
}

export function PartSpec({ part }: PartSpecProps): ReactElement {
  const rows = rowsForPart(part)
  return (
    <Container as="section" className="pb-8">
      <h2 data-testid="part-spec-heading" className="font-mono uppercase tracking-[0.12em] text-micro text-text-2 mb-5">
        Spec sheet
      </h2>
      <dl
        data-testid="part-spec-list"
        className="grid grid-cols-[max-content_1fr] gap-x-8 gap-y-2 sm:gap-x-12"
      >
        {rows.map(([label, value]) => (
          <div
            key={label}
            data-testid="part-spec-row"
            className="contents"
          >
            <dt data-testid="part-spec-label" className="font-mono uppercase tracking-[0.08em] text-micro text-text-2">
              {label}
            </dt>
            <dd className="text-body text-text">
              <Mono>{value}</Mono>
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  )
}
