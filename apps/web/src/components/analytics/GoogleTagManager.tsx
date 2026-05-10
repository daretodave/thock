import Script from 'next/script'

const GTM_CONTAINER_ID = 'GTM-58T839ZD' // per /oversight 2026-05-09 — GTM container locked

const GTM_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`

/**
 * Google Tag Manager loader. Embeds the locked GTM snippet via
 * Next's `<Script strategy="afterInteractive">` so the third-party
 * fetch doesn't block first paint or hurt core vitals. Lives in
 * `apps/web/src/app/layout.tsx` so every route gets it.
 *
 * Gated on the `DISABLE_ANALYTICS` env var (read at SSR time, not
 * `NEXT_PUBLIC_*`). Set `DISABLE_ANALYTICS=1` for e2e builds and
 * other automated traffic so the prod GA property doesn't ingest
 * bot pageviews — see `apps/e2e/playwright.config.ts`.
 *
 * No consent gate yet — thock collects no PII; GTM is page-level
 * pageview tracking only. Revisit when forms beyond Buttondown
 * ship.
 */
export function GoogleTagManager() {
  if (isAnalyticsDisabled()) return null
  return (
    <Script
      id="gtm-loader"
      data-testid="gtm-loader"
      strategy="afterInteractive"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }}
    />
  )
}

function isAnalyticsDisabled(): boolean {
  return process.env['DISABLE_ANALYTICS'] === '1'
}

export const __test_only__ = {
  GTM_CONTAINER_ID,
  GTM_SNIPPET,
  isAnalyticsDisabled,
}
