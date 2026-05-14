import { SpeedInsights as VercelSpeedInsights } from '@vercel/speed-insights/next'

/**
 * Vercel Speed Insights loader. Wraps the upstream `<SpeedInsights />`
 * client component from `@vercel/speed-insights/next` in a server-side
 * env-var gate so e2e and other automated traffic never enter the
 * Speed Insights beacon stream.
 *
 * Gated on the `DISABLE_ANALYTICS` env var (read at SSR time, not
 * `NEXT_PUBLIC_*`). Set `DISABLE_ANALYTICS=1` for e2e builds so the
 * production Speed Insights dataset doesn't ingest bot pageviews —
 * see `apps/e2e/playwright.config.ts`. Mirrors the gates in
 * `VercelAnalytics.tsx` and `GoogleTagManager.tsx` so a single env
 * var kills every telemetry surface.
 */
export function SpeedInsights() {
  if (isAnalyticsDisabled()) return null
  return <VercelSpeedInsights />
}

function isAnalyticsDisabled(): boolean {
  return process.env['DISABLE_ANALYTICS'] === '1'
}

export const __test_only__ = {
  isAnalyticsDisabled,
}
