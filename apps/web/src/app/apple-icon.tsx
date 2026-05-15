import { ImageResponse } from 'next/og'
import { OG_PALETTE } from '@/components/og/palette'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * iOS home-screen icon — same brand stamp as `app/icon.svg`,
 * rendered at 180x180 PNG so iOS Safari has a high-density
 * pinned icon. Body is the lowercase "t" wordmark with the
 * brass accent dot, on the dark editorial bg.
 *
 * Color values come from `@/components/og/palette` (hex sRGB) —
 * Satori does not support `oklch()`, and the prior version of this
 * file was authored in oklch which silently produced a 0-byte PNG
 * on every request. Every page in the layout `<link rel="apple-touch-icon">`s
 * this route, so the upstream failure surfaced as console-error
 * noise on every route in the e2e smoke walker.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: OG_PALETTE.bg,
          borderRadius: 22,
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        <span
          style={{
            fontSize: 132,
            fontWeight: 500,
            color: OG_PALETTE.text,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          t
        </span>
        <span
          style={{
            position: 'absolute',
            top: 38,
            right: 44,
            width: 16,
            height: 16,
            borderRadius: 999,
            background: OG_PALETTE.accent,
          }}
        />
      </div>
    ),
    size,
  )
}
