import type { ReactElement } from 'react'

export type TrendDirection = 'up' | 'down' | 'flat'

export type TrendDirectionGlyphProps = {
  dir: TrendDirection
  /** Pixel size; defaults to 12. */
  size?: number
  /** Optional aria label override; defaults to the direction word. */
  ariaLabel?: string
}

/**
 * Tiny inline glyph used next to delta numbers and trending tiles.
 * Inherits color via `currentColor` so the parent (tile, sparkline,
 * tracker row) controls the tone — keeping the palette restrained
 * per `decisions.jsx` "tag color = category, not vibe".
 */
export function TrendDirectionGlyph({
  dir,
  size = 12,
  ariaLabel,
}: TrendDirectionGlyphProps): ReactElement {
  const label = ariaLabel ?? dir
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 12 12',
    role: 'img' as const,
    'aria-label': label,
    'data-testid': 'trend-direction-glyph',
    'data-dir': dir,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (dir === 'up') {
    return (
      <svg {...common}>
        <path d="M2 9 L6 3 L10 9" />
      </svg>
    )
  }

  if (dir === 'down') {
    return (
      <svg {...common}>
        <path d="M2 3 L6 9 L10 3" />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <path d="M2 6 L10 6" />
    </svg>
  )
}
