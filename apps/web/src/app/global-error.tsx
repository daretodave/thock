'use client'

import { OG_PALETTE } from '@/components/og/palette'

/**
 * Root-layout error boundary. `error.tsx` (and every route-family
 * error.tsx) only catches errors thrown by children of layout.tsx —
 * if layout.tsx itself (Header, Footer, GTM, analytics, font
 * bindings) throws, only this file's own `<html>`/`<body>` can
 * render a fallback. Kept dependency-free (no @thock/ui, no
 * Tailwind classes) since it must survive whatever broke the rest
 * of the app.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: OG_PALETTE.bg,
          color: '#f2f2f0',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span
            style={{
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '0.75rem',
              color: '#b45050',
            }}
          >
            error
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>
            Something went wrong.
          </h1>
          <p style={{ maxWidth: '40ch', color: '#b7b8ba', margin: 0 }}>
            The page itself failed to load. The incident has a digest you can
            quote when reporting.
          </p>
          {error.digest && (
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#b45050',
              }}
            >
              digest: {error.digest}
            </span>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: '0.5rem',
              border: '1px solid #4a4d51',
              background: 'transparent',
              color: '#f2f2f0',
              padding: '0.5rem 1rem',
              fontFamily: 'monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
