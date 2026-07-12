import type { ReactElement } from 'react'
import Link from 'next/link'
import type { Board } from '@thock/data'
import { Container, Mono } from '@thock/ui'
import { getVendorBySlug } from '@/lib/data-runtime'

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

const STATUS_LABEL: Record<Board['status'], string> = {
  'in-stock': 'in stock',
  'group-buy': 'group buy',
  discontinued: 'discontinued',
}

type SpecRow = { label: string; value: string }

function boardSpecRows(b: Board): SpecRow[] {
  return [
    { label: 'Layout', value: b.layout },
    { label: 'Mount style', value: b.mountStyle },
    { label: 'Case material', value: b.caseMaterial },
    { label: 'Hotswap', value: b.hotswap ? 'yes' : 'no' },
    { label: 'Wireless', value: b.wireless ? 'yes' : 'no' },
    { label: 'Status', value: STATUS_LABEL[b.status] },
    { label: 'Released', value: formatDate(b.releasedAt) },
    { label: 'Vendor', value: getVendorBySlug(b.vendorSlug)?.name ?? b.vendorSlug },
  ]
}

export type BoardCompareTableProps = {
  boardA: Board
  boardB: Board
}

export function BoardCompareTable({
  boardA,
  boardB,
}: BoardCompareTableProps): ReactElement {
  const rowsA = boardSpecRows(boardA)
  const rowsB = boardSpecRows(boardB)

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
            href={`/part/board/${boardA.slug}`}
            data-testid="compare-board-a-link"
            className="font-serif text-h3 text-text hover:text-accent transition-colors"
          >
            {boardA.name}
          </Link>
        </div>
        <div>
          <Link
            href={`/part/board/${boardB.slug}`}
            data-testid="compare-board-b-link"
            className="font-serif text-h3 text-text hover:text-accent transition-colors"
          >
            {boardB.name}
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
