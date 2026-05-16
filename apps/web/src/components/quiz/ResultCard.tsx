import Link from 'next/link'
import { Mono } from '@thock/ui'
import type { Switch } from '@thock/data'

const TYPE_LABEL: Record<string, string> = {
  linear: 'Linear',
  'silent-linear': 'Silent Linear',
  tactile: 'Tactile',
  'silent-tactile': 'Silent Tactile',
  clicky: 'Clicky',
}

type Props = {
  sw: Switch
  score: number
  maxScore: number
  rank: number
}

export function ResultCard({ sw, score, maxScore, rank }: Props) {
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
  const typeLabel = TYPE_LABEL[sw.type] ?? sw.type
  const excerpt = sw.description.length > 80 ? sw.description.slice(0, 80).trimEnd() + '…' : sw.description

  return (
    <div
      data-testid="result-card"
      className="border border-border rounded-lg p-5 bg-surface flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            aria-label={`rank ${rank}`}
            className="shrink-0 w-7 h-7 rounded-full bg-accent-mu text-bg flex items-center justify-center text-small font-mono font-bold"
          >
            {rank}
          </span>
          <div>
            <Link
              href={`/part/switch/${sw.slug}`}
              className="font-serif text-h3 text-text hover:text-accent transition-colors"
            >
              {sw.name}
            </Link>
            <p className="text-small text-text-2 mt-0.5">
              <Mono>{typeLabel}</Mono>
            </p>
          </div>
        </div>
      </div>
      <p className="text-small text-text-2">{excerpt}</p>
      <div className="flex items-center gap-3">
        <div
          className="flex-1 h-1.5 bg-bg-2 rounded-full overflow-hidden"
          aria-label={`match score ${pct}%`}
        >
          <div
            className="h-full bg-accent-mu rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-small font-mono text-text-3 shrink-0">{pct}% match</span>
      </div>
    </div>
  )
}
