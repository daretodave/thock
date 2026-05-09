import type { ReactElement } from 'react'

export type SparklineDirection = 'up' | 'down' | 'flat'

export type SparklineProps = {
  /** Series — at least 2 points needed; renders nothing for shorter inputs. */
  values: number[]
  /** Pixel width of the SVG. */
  w?: number
  /** Pixel height of the SVG. */
  h?: number
  /**
   * Tone semantics — drives stroke color via `currentColor`. The
   * caller wraps the sparkline in a parent that sets `text-up` /
   * `text-down` / `text-flat` so the chart inherits the same hue
   * the surrounding tile uses.
   */
  tone?: SparklineDirection
  /** Optional accessible label. Falls back to a generic description. */
  ariaLabel?: string
}

const DEFAULT_W = 70
const DEFAULT_H = 20
const STROKE = 1.25
const PAD = 1.5

const TONE_CLASS: Record<SparklineDirection, string> = {
  up: 'text-up',
  down: 'text-down',
  flat: 'text-flat',
}

/**
 * Pure SVG line chart used by the Trends-related surfaces (home
 * trending strip, trends tracker rows). Stateless, no animation —
 * motion is reserved for tag activation per `decisions.jsx`.
 *
 * Rendering is deterministic across server and client so it streams
 * cleanly inside RSC without hydration mismatch warnings.
 */
export function Sparkline({
  values,
  w = DEFAULT_W,
  h = DEFAULT_H,
  tone = 'flat',
  ariaLabel,
}: SparklineProps): ReactElement | null {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const innerW = w - PAD * 2
  const innerH = h - PAD * 2

  const points = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * innerW
    const y = PAD + innerH - ((v - min) / span) * innerH
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })

  const label =
    ariaLabel ?? `${tone} trend over ${values.length} data points`

  return (
    <svg
      data-testid="sparkline"
      data-tone={tone}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label}
      className={TONE_CLASS[tone]}
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.join(' ')}
      />
    </svg>
  )
}
