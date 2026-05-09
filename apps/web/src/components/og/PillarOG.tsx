import type { ReactElement } from 'react'

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
        background:
          'radial-gradient(ellipse at top left, oklch(0.235 0.006 250) 0%, oklch(0.175 0.006 250) 70%)',
        color: 'oklch(0.965 0.005 90)',
        fontFamily: 'serif',
      }}
    >
      <div
        style={{
          fontSize: 22,
          fontFamily: 'monospace',
          color: 'oklch(0.78 0.005 90)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}
      >
        thock · {pillarLabel}
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
              background: 'oklch(0.80 0.135 75)',
              marginBottom: 22,
            }}
          />
        </div>
        <div style={{ fontSize: 32, color: 'oklch(0.78 0.005 90)' }}>
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
