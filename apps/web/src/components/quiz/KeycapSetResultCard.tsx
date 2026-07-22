import Link from 'next/link'
import { Mono } from '@thock/ui'
import type { KeycapSet } from '@thock/data'

const PROFILE_LABEL: Record<string, string> = {
  cherry: 'Cherry',
  oem: 'OEM',
  mt3: 'MT3',
  sa: 'SA',
  kat: 'KAT',
  kam: 'KAM',
  xda: 'XDA',
  dsa: 'DSA',
}

const MATERIAL_LABEL: Record<string, string> = {
  abs: 'ABS',
  pbt: 'PBT',
  resin: 'Resin',
  mixed: 'Mixed',
}

type Props = {
  keycapSet: KeycapSet
  score: number
  maxScore: number
  rank: number
}

export function KeycapSetResultCard({ keycapSet: ks, score, maxScore, rank }: Props) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const profileLabel = PROFILE_LABEL[ks.profile] ?? ks.profile
  const materialLabel = MATERIAL_LABEL[ks.material] ?? ks.material
  const excerpt =
    ks.description.length > 80
      ? ks.description.slice(0, 80).trimEnd() + '…'
      : ks.description

  return (
    <div
      data-testid="keycap-result-card"
      className="border border-border rounded-lg p-5 bg-surface flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            aria-label={`rank ${rank}`}
            className="shrink-0 w-7 h-7 rounded-full bg-accent-mu text-text flex items-center justify-center text-small font-mono font-bold"
          >
            {rank}
          </span>
          <div>
            <Link
              href={`/part/keycap-set/${ks.slug}`}
              className="font-serif text-h3 text-text hover:text-accent transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-mu"
            >
              {ks.name}
            </Link>
            <p className="text-small text-text-2 mt-0.5">
              <Mono>
                {profileLabel} · {materialLabel}
              </Mono>
            </p>
          </div>
        </div>
      </div>
      <p className="text-small text-text-2">{excerpt}</p>
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`match score ${pct}%`}
          className="flex-1 h-1.5 bg-bg-2 rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-accent-mu rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          data-testid="keycap-result-card-pct"
          className="text-small font-mono text-text-2 shrink-0"
        >
          {pct}% match
        </span>
      </div>
    </div>
  )
}
