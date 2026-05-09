import { expect, test } from '@playwright/test'

test.describe('deep-dives pillar — phase 10', () => {
  test('renders pillar hero with eyebrow 04 of 05 and italic H1', async ({
    page,
  }) => {
    await page.goto('/deep-dives')
    const eyebrow = page.getByTestId('pillar-hero-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/04 of 05/i)
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/deep dives/i)
  })

  test('renders an RSS pill linking to /feed/deep-dives.xml', async ({
    page,
  }) => {
    await page.goto('/deep-dives')
    const link = page.getByTestId('pillar-hero-rss')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/feed/deep-dives.xml')
  })

  test('shows at least one article-card link to an /article/<slug>', async ({
    page,
  }) => {
    await page.goto('/deep-dives')
    const cards = page.locator(
      '[data-testid="hero-card"], [data-testid="article-card-row"]',
    )
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
    const href = await cards.first().getAttribute('href')
    expect(href).toMatch(/^\/article\//)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/deep-dives')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})
