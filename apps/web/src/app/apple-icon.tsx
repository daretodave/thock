import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/**
 * iOS home-screen icon — same brand stamp as `app/icon.svg`,
 * rendered at 180x180 PNG so iOS Safari has a high-density
 * pinned icon. Body is the lowercase "t" wordmark with the
 * brass accent dot, on the dark editorial bg.
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
          background: 'oklch(0.175 0.006 250)',
          borderRadius: 22,
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        <span
          style={{
            fontSize: 132,
            fontWeight: 500,
            color: 'oklch(0.965 0.005 90)',
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
            background: 'oklch(0.80 0.135 75)',
          }}
        />
      </div>
    ),
    size,
  )
}
