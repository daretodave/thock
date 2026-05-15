import type { ReactElement } from 'react'
import { OG_BACKGROUND, OG_PALETTE } from './palette'

export type PillarOGContentProps = {
  /** Pillar display label rendered both as eyebrow and italic H1. */
  pillarLabel: string
  /** Short single-line tagline shown beneath the H1. */
  tagline: string
}

/**
 * Per-pillar OG card body. Same chrome as the site-default
 * `app/opengraph-image.tsx`: dark radial-gradient bg, brass-dot
 * accent, italic ductus on the headline. The pillar label is
 * the headline; the tagline is the supporting line.
 *
 * Returns plain JSX so each route's `opengraph-image.tsx` can
 * wrap it in `next/og` `ImageResponse` while keeping the visual
 * identity in one place.
 *
 * Color values come from `./palette` (hex sRGB) — Satori does not
 * support `oklch()` so the source-of-truth oklch tokens cannot be
 * referenced directly here. The prior version of this file was
 * authored in oklch and silently produced 0-byte PNGs.
 */
export function PillarOGContent({
  pillarLabel,
  tagline,
}: PillarOGContentProps): ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px',
        background: OG_BACKGROUND,
        color: OG_PALETTE.text,
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontFamily: 'monospace',
          color: OG_PALETTE.text2,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        {`thock · ${pillarLabel}`}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span
            style={{
              fontSize: 156,
              fontWeight: 500,
              letterSpacing: '-0.022em',
              fontStyle: 'italic',
            }}
          >
            {pillarLabel}
          </span>
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              background: OG_PALETTE.accent,
              marginBottom: 22,
            }}
          />
        </div>
        <div style={{ fontSize: 32, color: OG_PALETTE.text2 }}>
          {tagline}
        </div>
      </div>
    </div>
  )
}

export const PILLAR_OG_TAGLINES: Record<string, string> = {
  news: "What's shipping, vendor moves, the broader beat.",
  trends:
    'How taste in switches, layouts, and keycaps moves week-to-week.',
  ideas: 'Builds, mods, and the half-formed ideas that become hobbies.',
  'deep-dives':
    'Long-form, sourced, and unhurried — for a quiet evening.',
  guides: 'Practical reference. Firmware, modding, switches, keycaps.',
}
