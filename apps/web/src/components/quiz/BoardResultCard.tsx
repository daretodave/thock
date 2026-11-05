import Link from 'next/link'
import { Mono } from '@thock/ui'
import type { Board } from '@thock/data'
import {
  BOARD_LAYOUT_LABEL,
  CASE_MATERIAL_LABEL,
  MOUNT_STYLE_LABEL,
  specLabel,
} from '@/lib/spec-labels'
import { truncate } from '@/lib/truncate'

type Props = {
  board: Board
  score: number
  maxScore: number
  rank: number
}

function hotswapWirelessBadge(board: Board): string {
  const parts = [board.hotswap ? 'Hotswap' : 'Soldered']
  if (board.wireless) parts.push('Wireless')
  return parts.join(' · ')
}

export function BoardResultCard({ board, score, maxScore, rank }: Props) {
  const hasSignal = maxScore > 0
  const pct = hasSignal ? Math.round((score / maxScore) * 100) : 0
  const layoutLabel = specLabel(BOARD_LAYOUT_LABEL, board.layout)
  const mountStyleLabel = specLabel(MOUNT_STYLE_LABEL, board.mountStyle)
  const caseMaterialLabel = specLabel(CASE_MATERIAL_LABEL, board.caseMaterial)
  const badge = hotswapWirelessBadge(board)
  const excerpt = truncate(board.description, 80)

  return (
    <div
      data-testid="board-result-card"
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
            <h3
              data-testid="board-result-card-name"
              className="font-serif text-h3 text-text"
            >
              <Link
                href={`/part/board/${board.slug}`}
                className="hover:text-accent transition-colors rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent-mu"
              >
                {board.name}
              </Link>
            </h3>
            <p className="text-small text-text-2 mt-0.5">
              <Mono>
                {layoutLabel} · {mountStyleLabel} · {caseMaterialLabel}
              </Mono>
            </p>
            <p className="text-small text-text-2 mt-0.5">
              <Mono>{badge}</Mono>
            </p>
          </div>
        </div>
      </div>
      <p className="text-small text-text-2">{excerpt}</p>
      <div className="flex items-center gap-3">
        {hasSignal ? (
          <>
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
              data-testid="board-result-card-pct"
              className="text-small font-mono text-text-2 shrink-0"
            >
              {pct}% match
            </span>
          </>
        ) : (
          <span
            data-testid="board-result-card-pct"
            className="text-small font-mono text-text-2"
          >
            Popular pick — no strong signal in your answers
          </span>
        )}
      </div>
    </div>
  )
}
