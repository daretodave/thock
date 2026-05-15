import { ImageResponse } from 'next/og'
import { PILLARS, siteConfig } from '@thock/seo'
import { OG_BACKGROUND, OG_PALETTE } from '@/components/og/palette'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Home OG card.
 *
 * Same chrome as the per-article and per-pillar templates so any
 * social preview reads as part of one family:
 *  - dark cool-charcoal radial gradient bg
 *  - left-edge brass accent strip
 *  - mono micro-caps for the kicker line
 *  - serif wordmark with the canonical brass-dot
 *  - italic tagline below
 *  - pillar breadcrumb across the bottom so the share preview
 *    advertises the editorial surface, not just the wordmark.
 *
 * The prior card rendered only the wordmark + tagline on a dark
 * field AND was authored in `oklch()` color which Satori parsed as
 * `Unexpected token type: function`, producing 0-byte PNGs that
 * Vercel cached for a year. Hex palette comes from
 * `@/components/og/palette` — see that file for the rationale.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: OG_BACKGROUND,
          color: OG_PALETTE.text,
          fontFamily: 'serif',
        }}
      >
        {/* Left brass accent strip — same anchor as the article card. */}
        <div
          style={{
            width: 12,
            height: '100%',
            background: OG_PALETTE.accent,
          }}
        />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 80px',
          }}
        >
          {/* Top — kicker line. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 22,
              fontFamily: 'monospace',
              color: OG_PALETTE.text3,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            <div>Editorial — mechanical keyboards</div>
            <div>thock.xyz</div>
          </div>

          {/* Middle — wordmark + tagline. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 28,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 232,
                  fontWeight: 500,
                  letterSpacing: '-0.024em',
                  lineHeight: 1,
                }}
              >
                {siteConfig.name}
              </span>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  background: OG_PALETTE.accent,
                  marginBottom: 26,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 52,
                fontStyle: 'italic',
                color: OG_PALETTE.text2,
                letterSpacing: '-0.005em',
                display: 'flex',
              }}
            >
              {siteConfig.tagline}
            </div>
          </div>

          {/* Bottom — pillar breadcrumb. The five pillars are the
              shape of the site; surfacing them on the share card
              communicates the editorial surface at a glance. */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontSize: 22,
              fontFamily: 'monospace',
              color: OG_PALETTE.text2,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            {PILLARS.map((p, i) => (
              <div
                key={p.slug}
                style={{ display: 'flex', alignItems: 'center', gap: 18 }}
              >
                <span>{p.label}</span>
                {i < PILLARS.length - 1 && (
                  <span style={{ color: OG_PALETTE.divider }}>·</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
