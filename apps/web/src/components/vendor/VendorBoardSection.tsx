import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import type { Board } from '@thock/data'

const SECTION_HEADING_CLASS =
  'font-mono uppercase tracking-[0.12em] text-micro text-text-2'

const LAYOUT_LABEL: Record<Board['layout'], string> = {
  tkl: 'TKL',
  '60': '60%',
  '65': '65%',
  '75': '75%',
  full: 'Full',
  alice: 'Alice',
  split: 'Split',
  ortho: 'Ortho',
  other: 'Other',
}

const STATUS_LABEL: Record<Board['status'], string> = {
  'in-stock': 'In stock',
  'group-buy': 'Group buy',
  discontinued: 'Discontinued',
}

function statusTint(status: Board['status']): string {
  if (status === 'in-stock') return 'text-accent'
  return 'text-text-2'
}

export type VendorBoardSectionProps = {
  vendorName: string
  boards: Board[]
}

export function VendorBoardSection({
  vendorName,
  boards,
}: VendorBoardSectionProps): ReactElement {
  return (
    <Container as="section" className="pb-12">
      <Stack gap={6}>
        <h2 data-testid="vendor-boards-kicker" className={SECTION_HEADING_CLASS}>
          boards
        </h2>
        {boards.length === 0 ? (
          <p
            data-testid="vendor-boards-empty"
            className="text-body text-text-2"
          >
            No boards from {vendorName} in the catalog yet.
          </p>
        ) : (
          <div
            data-testid="vendor-boards-list"
            className="flex flex-col divide-y divide-border"
          >
            {boards.map((board) => (
              <div
                key={board.slug}
                data-testid="vendor-board-row"
                className="py-4 flex flex-col gap-1"
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link
                    href={`/part/board/${board.slug}`}
                    className="font-serif text-h3 text-text hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
                  >
                    {board.name}
                  </Link>
                  <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-2">
                    {LAYOUT_LABEL[board.layout]}
                  </span>
                  <span
                    className={`font-mono text-micro uppercase tracking-[0.08em] ${statusTint(board.status)}`}
                  >
                    {STATUS_LABEL[board.status]}
                  </span>
                </div>
                <p className="max-w-[60ch] text-small text-text-2">
                  {board.description.length > 100
                    ? board.description.slice(0, 100).replace(/\s\S*$/, '').trimEnd() + '…'
                    : board.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </Container>
  )
}
