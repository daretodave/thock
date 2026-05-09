import { expect, test } from '@playwright/test'

test.describe('global 404 — phase 16', () => {
  test('renders the branded not-found page for an unknown root path', async ({
    page,
  }) => {
    await page.goto('/this-route-does-not-exist-anywhere')
    await expect(page.getByTestId('not-found-eyebrow')).toContainText('404')
    await expect(page.locator('h1').first()).toContainText(
      /lost in the layout/i,
    )
  })

  test('the search affordance posts to /search via GET', async ({ page }) => {
    await page.goto('/this-also-does-not-exist')
    const form = page.getByTestId('not-found-search-form')
    await expect(form).toHaveAttribute('action', '/search')
    await expect(form).toHaveAttribute('method', 'get')
  })

  test('the pillar nav links to all five pillars', async ({ page }) => {
    await page.goto('/another-unknown-path')
    const nav = page.getByTestId('not-found-pillar-nav')
    const links = nav.locator('a')
    expect(await links.count()).toBe(5)
    for (const href of [
      '/news',
      '/trends',
      '/ideas',
      '/deep-dives',
      '/guides',
    ]) {
      await expect(nav.locator(`a[href="${href}"]`)).toBeVisible()
    }
  })
})

test.describe('/about — phase 16', () => {
  test('renders eyebrow + italic display H1 + four locked sections', async ({
    page,
  }) => {
    await page.goto('/about')
    await expect(page.getByTestId('about-eyebrow')).toContainText(/about/i)
    await expect(page.locator('h1').first()).toContainText(/who we are/i)
    await expect(page.getByTestId('about-section-pillars')).toBeVisible()
    await expect(page.getByTestId('about-section-voice')).toBeVisible()
    await expect(page.getByTestId('about-section-trends')).toBeVisible()
    await expect(page.getByTestId('about-section-disclosure')).toBeVisible()
  })

  test('emits WebSite + BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/about')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebSite"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })
})

test.describe('/sources — phase 16', () => {
  test('renders eyebrow + italic display H1 + at least one cited article', async ({
    page,
  }) => {
    await page.goto('/sources')
    await expect(page.getByTestId('sources-eyebrow')).toContainText(/sources/i)
    await expect(page.locator('h1').first()).toContainText(
      /where we got the facts/i,
    )
    // The seed Mode Sonnet R2 article uses <Source>; SourceCounts
    // surfaces it. If this assertion ever breaks, update the seed.
    const counts = page.getByTestId('source-counts')
    await expect(counts).toBeVisible()
    const rows = page.getByTestId('source-counts-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
  })

  test('emits WebSite + BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/sources')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebSite"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })
})
