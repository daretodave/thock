import { Analytics } from '@vercel/analytics/next'

/**
 * Vercel Web Analytics loader. Wraps the upstream `<Analytics />`
 * client component from `@vercel/analytics/next` in a server-side
 * env-var gate so e2e and other automated traffic never enter the
 * `/_vercel/insights/*` beacon stream.
 *
 * Gated on the `DISABLE_ANALYTICS` env var (read at SSR time, not
 * `NEXT_PUBLIC_*`). Set `DISABLE_ANALYTICS=1` for e2e builds so the
 * production Vercel Analytics dataset doesn't ingest bot pageviews
 * — see `apps/e2e/playwright.config.ts`. Mirrors the GTM gate in
 * `GoogleTagManager.tsx` so a single env var kills both surfaces.
 */
export function VercelAnalytics() {
  if (isAnalyticsDisabled()) return null
  return <Analytics />
}

function isAnalyticsDisabled(): boolean {
  return process.env['DISABLE_ANALYTICS'] === '1'
}

export const __test_only__ = {
  isAnalyticsDisabled,
}
