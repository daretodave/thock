import { expect, test } from '@playwright/test'

test.describe('news pillar — phase 7', () => {
  test('renders pillar hero with eyebrow and italic H1', async ({ page }) => {
    await page.goto('/news')
    const eyebrow = page.getByTestId('pillar-hero-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/pillar · news/i)
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/news/i)
  })

  test('renders an RSS pill linking to /feed/news.xml', async ({ page }) => {
    await page.goto('/news')
    const link = page.getByTestId('pillar-hero-rss')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/feed/news.xml')
  })

  test('shows at least one article card linking to an /article/<slug>', async ({
    page,
  }) => {
    await page.goto('/news')
    const cards = page.locator(
      '[data-testid="hero-card"], [data-testid="article-card-row"]',
    )
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
    const href = await cards.first().getAttribute('href')
    expect(href).toMatch(/^\/article\//)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/news')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})
