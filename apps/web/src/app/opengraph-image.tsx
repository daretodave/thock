import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/siteConfig'

export const runtime = 'edge'
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Phase 1 default OG image — wordmark + tagline on the dark bg.
 * Per-family templates land in phase 16 polish.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
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
            fontSize: 18,
            fontFamily: 'monospace',
            color: 'oklch(0.58 0.006 90)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {siteConfig.url.replace('https://', '')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 220, fontWeight: 500, letterSpacing: '-0.022em' }}>
              {siteConfig.name}
            </span>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: 'oklch(0.80 0.135 75)',
                marginBottom: 24,
              }}
            />
          </div>
          <div style={{ fontSize: 36, color: 'oklch(0.78 0.005 90)' }}>
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
