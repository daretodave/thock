import type { ReactElement } from 'react'
import Link from 'next/link'
import { Mono } from '@thock/ui'
import type { ResolvedPart } from '@/lib/data-runtime'

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
  return 'text-text-3'
}

function summarize(description: string, max = 140): string {
  if (description.length <= max) return description
  const cut = description.slice(0, max).split(' ').slice(0, -1).join(' ')
  return cut.trimEnd() + '…'
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
      className="group flex flex-col gap-2 border-t border-border py-5 transition-colors hover:border-border-hi"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Mono className="text-h3 text-text group-hover:text-accent transition-colors">
          {part.record.name}
        </Mono>
        <span
          className={`font-mono uppercase tracking-[0.08em] text-micro ${statusTint(status)}`}
        >
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>
      <p className="max-w-[70ch] text-body text-text-2">
        {summarize(part.record.description)}
      </p>
    </Link>
  )
}
