import { expect, test } from '@playwright/test'

test.describe('newsletter page — phase 15', () => {
  test('renders the locked Buttondown form on /newsletter', async ({ page }) => {
    await page.goto('/newsletter')
    const form = page.getByTestId('buttondown-form-full')
    await expect(form).toBeVisible()
    await expect(form).toHaveAttribute(
      'action',
      'https://buttondown.com/api/emails/embed-subscribe/thock',
    )
    await expect(form).toHaveAttribute('method', 'post')
  })

  test('renders the newsletter eyebrow + italic display H1', async ({
    page,
  }) => {
    await page.goto('/newsletter')
    await expect(page.getByTestId('newsletter-eyebrow')).toContainText(
      /newsletter/i,
    )
    await expect(page.locator('h1').first()).toContainText(
      /join the newsletter/i,
    )
  })

  test('shows the empty-state archive when no digests have been authored', async ({
    page,
  }) => {
    await page.goto('/newsletter')
    await expect(
      page.getByTestId('newsletter-archive-empty'),
    ).toBeVisible()
    await expect(
      page.getByTestId('newsletter-archive-empty'),
    ).toContainText(/no digests yet/i)
  })

  test('renders WebSite + BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/newsletter')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebSite"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })
})

test.describe('footer Buttondown form — phase 15 retrofit', () => {
  test('the page footer renders a footer-variant Buttondown form on every route', async ({
    page,
  }) => {
    for (const path of ['/', '/news', '/trends/tracker']) {
      await page.goto(path)
      const form = page.getByTestId('buttondown-form-footer')
      await expect(form, `footer form on ${path}`).toBeVisible()
      await expect(form).toHaveAttribute(
        'action',
        'https://buttondown.com/api/emails/embed-subscribe/thock',
      )
    }
  })
})

test.describe('Google Tag Manager — analytics gate (#28)', () => {
  test('GTM loader is suppressed in the e2e build (DISABLE_ANALYTICS=1)', async ({
    page,
  }) => {
    // The webServer in playwright.config.ts builds with
    // DISABLE_ANALYTICS=1, so <GoogleTagManager> renders null and
    // the GTM container ID + script source never make it into the
    // SSR'd HTML. This guards against e2e runs polluting the prod
    // GA property with bot traffic.
    for (const path of ['/', '/news', '/article/gateron-oil-king-deep-dive']) {
      await page.goto(path)
      const html = await page.content()
      expect(html, `GTM container ID absent on ${path}`).not.toContain(
        'GTM-58T839ZD',
      )
      expect(html, `GTM source URL absent on ${path}`).not.toContain(
        'googletagmanager.com/gtm.js',
      )
    }
  })
})

test.describe('RSS feeds — phase 15 schema validation', () => {
  const FEEDS = [
    '/feed.xml',
    '/feed/news.xml',
    '/feed/trends.xml',
    '/feed/ideas.xml',
    '/feed/deep-dives.xml',
    '/feed/guides.xml',
  ]

  for (const feed of FEEDS) {
    test(`${feed} is valid RSS 2.0`, async ({ request }) => {
      const res = await request.get(feed)
      expect(res.status(), `status for ${feed}`).toBe(200)
      const body = await res.text()
      expect(body).toMatch(/<rss\s+[^>]*version="2\.0"/)
      expect(body).toContain('<channel>')
      expect(body).toContain('</channel>')
      expect(body).toMatch(/<title>.+<\/title>/)
      expect(body).toMatch(/<link>https?:\/\//)
      expect(body).toMatch(/<description>.+<\/description>/)
    })
  }
})
