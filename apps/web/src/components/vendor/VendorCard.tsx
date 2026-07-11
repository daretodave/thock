import type { ReactElement } from 'react'
import Link from 'next/link'
import type { Vendor } from '@thock/data'
import { countryLabel } from '@/lib/vendor-country'

function truncate(text: string, max = 130): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s\S*$/, '').trimEnd() + '…'
}

export type VendorCardProps = {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps): ReactElement {
  const country = countryLabel(vendor.countryCode)
  return (
    <div
      data-testid="vendor-card"
      className="py-8 flex flex-col gap-3 border-b border-border last:border-b-0"
    >
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <Link
          href={`/vendor/${vendor.slug}`}
          data-testid="vendor-card-name"
          className="font-serif text-h2 text-text hover:text-accent transition-colors"
        >
          {vendor.name}
        </Link>
        <span
          data-testid="vendor-card-country"
          className="font-mono text-micro uppercase tracking-[0.08em] text-text-2"
        >
          {country}
        </span>
      </div>
      <p
        data-testid="vendor-card-description"
        className="max-w-[60ch] text-body text-text-2"
      >
        {truncate(vendor.description)}
      </p>
      <div className="flex flex-wrap gap-4 font-mono text-small uppercase tracking-[0.08em]">
        <Link
          href={`/vendor/${vendor.slug}`}
          data-testid="vendor-card-detail-link"
          className="text-text-2 hover:text-text transition-colors"
        >
          View vendor →
        </Link>
        <a
          href={vendor.url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="vendor-card-external-link"
          className="text-text-2 hover:text-text transition-colors"
        >
          {vendor.url.replace(/^https?:\/\//, '')} ↗
        </a>
      </div>
    </div>
  )
}
