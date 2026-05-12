import { expect, test } from '@playwright/test'

test.describe('guides pillar — phase 11', () => {
  test('renders pillar hero with descriptive eyebrow and italic H1', async ({
    page,
  }) => {
    await page.goto('/guides')
    const eyebrow = page.getByTestId('pillar-hero-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/pillar · guides/i)
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/guides/i)
  })

  test('renders an RSS pill linking to /feed/guides.xml', async ({ page }) => {
    await page.goto('/guides')
    const link = page.getByTestId('pillar-hero-rss')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/feed/guides.xml')
  })

  test('renders at least one section block with article rows', async ({
    page,
  }) => {
    await page.goto('/guides')
    // Seed has the switches-section beginners-switch-buying-guide.
    const sectionAnchor = page.locator(
      '[data-testid^="guide-section-"]',
    )
    expect(await sectionAnchor.count()).toBeGreaterThanOrEqual(1)
    const rows = page.locator('[data-testid="article-card-row"]')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
    const href = await rows.first().getAttribute('href')
    expect(href).toMatch(/^\/article\//)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/guides')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})
