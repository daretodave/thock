import type { ReactElement } from 'react'
import Link from 'next/link'
import { Mono } from '@thock/ui'
import type { ResolvedPart } from '@/lib/data-runtime'
import { SENSING_LABEL, specLabel } from '@/lib/spec-labels'
import { truncate } from '@/lib/truncate'

const STATUS_LABEL: Record<string, string> = {
  'in-production': 'in production',
  'in-stock': 'in stock',
  'sold-out': 'sold out',
  'group-buy': 'group buy',
  discontinued: 'discontinued',
  limited: 'limited',
}

function statusTint(status: string): string {
  if (status === 'in-production' || status === 'in-stock') return 'text-accent'
  if (status === 'group-buy' || status === 'limited') return 'text-text-2'
  return 'text-text-2'
}

export type PartIndexCardProps = {
  part: ResolvedPart
}

export function PartIndexCard({ part }: PartIndexCardProps): ReactElement {
  const href = `/part/${part.kind}/${part.slug}`
  const status = part.record.status
  return (
    <Link
      href={href}
      data-testid="part-index-card"
      className="group flex flex-col gap-2 border-t border-border py-5 transition-colors hover:border-border-hi focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2
          data-testid="part-index-name"
          className="text-h3 text-text group-hover:text-accent transition-colors"
        >
          <Mono>{part.record.name}</Mono>
        </h2>
        <span className="flex items-center gap-2">
          {part.kind === 'switch' && (
            <span
              data-testid="part-index-sensing"
              className="font-mono uppercase tracking-[0.08em] text-micro text-text-2"
            >
              {specLabel(SENSING_LABEL, part.record.sensing)}
            </span>
          )}
          <span
            data-testid="part-index-status"
            className={`font-mono uppercase tracking-[0.08em] text-micro ${statusTint(status)}`}
          >
            {STATUS_LABEL[status] ?? status}
          </span>
        </span>
      </div>
      <p className="max-w-70ch text-body text-text-2">
        {truncate(part.record.description, 140)}
      </p>
    </Link>
  )
}
