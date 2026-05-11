import Image from 'next/image'
import type { ReactElement } from 'react'
import type { GroupBuy, Vendor } from '@thock/data'

export type GroupBuyRowVariant = 'live' | 'announced' | 'ended'

export type GroupBuyRowProps = {
  groupBuy: GroupBuy
  vendor: Vendor | null
  variant: GroupBuyRowVariant
  /** Reference date for countdown / opens-in math. */
  now?: Date
}

const REGION_LABEL: Record<GroupBuy['region'], string> = {
  global: 'GLOBAL',
  us: 'US',
  eu: 'EU',
  asia: 'ASIA',
  oceania: 'OCEANIA',
  mena: 'MENA',
}

const KIND_LABEL: Record<GroupBuy['productKind'], string> = {
  board: 'BOARD',
  'keycap-set': 'KEYCAPS',
  switch: 'SWITCHES',
  other: 'OTHER',
}

const STATUS_LABEL: Record<GroupBuy['status'], string> = {
  announced: 'ANNOUNCED',
  live: 'LIVE',
  closed: 'CLOSED',
  shipped: 'SHIPPED',
}

function dayDelta(fromIso: string, toIso: string): number {
  const from = Date.parse(`${fromIso}T00:00:00.000Z`)
  const to = Date.parse(`${toIso}T00:00:00.000Z`)
  if (!Number.isFinite(from) || !Number.isFinite(to)) return 0
  return Math.ceil((to - from) / 86_400_000)
}

function fmtDateRange(start: string, end: string): string {
  return `${start} → ${end}`
}

/**
 * One row in the canonical /group-buys index. Mirrors the card-row
 * density of `<ArticleCard variant="row">` so the page rhythm
 * matches pillar archives. Variants change the chrome:
 *
 *   - live      → countdown ("X days left"), CTA enabled.
 *   - announced → "Opens in X days", CTA enabled.
 *   - ended     → muted, status pill, no CTA.
 */
export function GroupBuyRow({
  groupBuy,
  vendor,
  variant,
  now = new Date(),
}: GroupBuyRowProps): ReactElement {
  const todayIso = now.toISOString().slice(0, 10)
  const region = REGION_LABEL[groupBuy.region]
  const kind = KIND_LABEL[groupBuy.productKind]
  const vendorName = vendor?.name ?? groupBuy.vendorSlug

  let countdown: string
  if (variant === 'live') {
    const days = Math.max(0, dayDelta(todayIso, groupBuy.endDate))
    countdown = days === 0 ? 'closes today' : `${days}d left`
  } else if (variant === 'announced') {
    const days = Math.max(0, dayDelta(todayIso, groupBuy.startDate))
    countdown = days === 0 ? 'opens today' : `opens in ${days}d`
  } else {
    // variant === 'ended': the section selector visually classifies
    // this row as past. Never render forward-looking labels even if
    // the source record's `status` field is stale (critique pass 11
    // [HIGH] issue #44: Ishtar R2 had status:'live' + endDate today,
    // leaking "LIVE" into the Just-closed section pill). Preserve
    // 'SHIPPED' as editorially distinct; collapse everything else
    // to 'CLOSED'.
    countdown = groupBuy.status === 'shipped' ? 'SHIPPED' : 'CLOSED'
  }

  const ctaVisible = variant !== 'ended'
  const isMuted = variant === 'ended'

  return (
    <article
      data-testid="group-buy-row"
      data-variant={variant}
      className={`grid grid-cols-1 items-start gap-4 border-t border-border py-5 first:border-t-0 first:pt-0 sm:grid-cols-[140px_minmax(0,1fr)_auto] sm:gap-6 ${
        isMuted ? 'opacity-70' : ''
      }`}
    >
      {groupBuy.heroImage ? (
        <div
          data-testid="group-buy-hero"
          className="relative aspect-[4/3] overflow-hidden border border-border"
        >
          <Image
            src={groupBuy.heroImage}
            alt={`thock hero — ${groupBuy.name}`}
            fill
            sizes="140px"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          aria-hidden="true"
          data-testid="group-buy-hero-placeholder"
          className="aspect-[4/3] border border-border bg-accent-mu/20"
        />
      )}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-micro uppercase tracking-[0.08em] text-text-3">
            {kind}
          </span>
          <span
            data-testid="group-buy-region"
            className="border border-border-hi px-1.5 py-0.5 font-mono text-micro uppercase tracking-[0.08em] text-text-3"
          >
            {region}
          </span>
        </div>
        <h3 className="font-serif text-h3 text-text">{groupBuy.name}</h3>
        <p className="text-small text-text-2 line-clamp-2">
          {groupBuy.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-micro uppercase tracking-[0.08em] text-text-3">
          <span>
            via <span className="text-accent">{vendorName}</span>
          </span>
          <span>{fmtDateRange(groupBuy.startDate, groupBuy.endDate)}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          data-testid="group-buy-countdown"
          className={`font-mono text-small uppercase tracking-[0.08em] ${
            variant === 'live' ? 'text-accent' : 'text-text-3'
          }`}
        >
          {countdown}
        </span>
        {ctaVisible && (
          <a
            data-testid="group-buy-cta"
            href={groupBuy.url}
            rel="sponsored noopener"
            target="_blank"
            className="border border-border-hi px-3 py-1.5 font-mono text-micro uppercase tracking-[0.08em] text-text-2 hover:text-text"
          >
            view at vendor →
          </a>
        )}
      </div>
    </article>
  )
}
