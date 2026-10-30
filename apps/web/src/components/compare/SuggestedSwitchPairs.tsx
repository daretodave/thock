import type { ReactElement } from 'react'
import Link from 'next/link'
import type { SuggestedSwitchPair } from '@/lib/compare/suggested-switch-pairs'

export type SuggestedSwitchPairsProps = {
  pairs: SuggestedSwitchPair[]
}

export function SuggestedSwitchPairs({
  pairs,
}: SuggestedSwitchPairsProps): ReactElement | null {
  if (pairs.length === 0) return null

  return (
    <div data-testid="compare-suggested-pairs" className="pb-4">
      <p className="font-mono text-micro uppercase tracking-[0.08em] text-text-2 mb-2">
        Or try a pair
      </p>
      <ul className="flex flex-col gap-1">
        {pairs.map(({ a, b }) => (
          <li key={`${a.slug}-${b.slug}`}>
            <Link
              href={`/compare/switch?a=${encodeURIComponent(a.slug)}&b=${encodeURIComponent(b.slug)}`}
              data-testid="compare-suggested-pair"
              className="font-mono text-small text-text-2 hover:text-text transition-colors rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
            >
              {a.name} vs {b.name} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
