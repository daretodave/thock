import type { ReactElement } from 'react'
import Link from 'next/link'
import { Container, Stack } from '@thock/ui'
import type { ResolvedPart } from '@/lib/data-runtime'
import { getVendorBySlug } from '@/lib/data-runtime'

const KIND_LABEL: Record<ResolvedPart['kind'], string> = {
  switch: 'switch',
  'keycap-set': 'keycap set',
  board: 'board',
}

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

export type PartHeroProps = {
  part: ResolvedPart
}

export function PartHero({ part }: PartHeroProps): ReactElement {
  const vendor = getVendorBySlug(part.record.vendorSlug)
  const status = part.record.status
  return (
    <Container as="header" className="py-12 sm:py-16">
      <Stack gap={4}>
        <span
          data-testid="part-hero-eyebrow"
          className="font-mono uppercase tracking-[0.12em] text-micro text-accent"
        >
          part · {KIND_LABEL[part.kind]}
        </span>
        <h1
          data-testid="part-hero-h1"
          className="font-serif text-h1 sm:text-display text-text"
        >
          {part.record.name}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-small uppercase tracking-[0.08em] text-text-3">
          {vendor ? (
            <Link
              href="/sources"
              data-testid="part-hero-vendor"
              className="hover:text-text"
            >
              by {vendor.name}
            </Link>
          ) : (
            <span data-testid="part-hero-vendor">by {part.record.vendorSlug}</span>
          )}
          <span
            data-testid="part-hero-status"
            className={statusTint(status)}
          >
            · {STATUS_LABEL[status] ?? status}
          </span>
        </div>
      </Stack>
    </Container>
  )
}
