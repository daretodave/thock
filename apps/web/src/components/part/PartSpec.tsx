import type { ReactElement } from 'react'
import { Container, Mono } from '@thock/ui'
import type { Switch, KeycapSet, Board } from '@thock/data'
import type { ResolvedPart } from '@/lib/data-runtime'
import {
  BOARD_LAYOUT_LABEL,
  CASE_MATERIAL_LABEL,
  HOUSING_MATERIAL_LABEL,
  KEYCAP_MATERIAL_LABEL,
  KEYCAP_PROFILE_LABEL,
  LEGEND_TYPE_LABEL,
  MOUNT_STYLE_LABEL,
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

function switchRows(record: Switch): Array<[string, string]> {
  return [
    ['Type', specLabel(SWITCH_TYPE_LABEL, record.type)],
    ['Top housing', specLabel(HOUSING_MATERIAL_LABEL, record.housingTop)],
    ['Bottom housing', specLabel(HOUSING_MATERIAL_LABEL, record.housingBottom)],
    ['Stem', specLabel(STEM_MATERIAL_LABEL, record.stem)],
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
    ['Profile', specLabel(KEYCAP_PROFILE_LABEL, record.profile)],
    ['Material', specLabel(KEYCAP_MATERIAL_LABEL, record.material)],
    ['Legend', specLabel(LEGEND_TYPE_LABEL, record.legendType)],
    ['Designer', record.designer ?? '—'],
    ['Released', formatDate(record.releasedAt)],
  ]
}

function boardRows(record: Board): Array<[string, string]> {
  return [
    ['Layout', specLabel(BOARD_LAYOUT_LABEL, record.layout)],
    ['Case material', specLabel(CASE_MATERIAL_LABEL, record.caseMaterial)],
    ['Mount style', specLabel(MOUNT_STYLE_LABEL, record.mountStyle)],
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
