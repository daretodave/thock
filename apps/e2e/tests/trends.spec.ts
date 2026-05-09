import { expect, test } from '@playwright/test'

test.describe('trends pillar — phase 8', () => {
  test('pillar hero renders dashboard pill linking to /trends/tracker', async ({
    page,
  }) => {
    await page.goto('/trends')
    const pill = page.getByTestId('pillar-hero-tracker')
    await expect(pill).toBeVisible()
    await expect(pill).toHaveAttribute('href', '/trends/tracker')
  })

  test('pillar hero also renders RSS pill linking to /feed/trends.xml', async ({
    page,
  }) => {
    await page.goto('/trends')
    const rss = page.getByTestId('pillar-hero-rss')
    await expect(rss).toHaveAttribute('href', '/feed/trends.xml')
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/trends')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})

test.describe('trends tracker — phase 8', () => {
  test('renders SIGNATURE eyebrow + italic H1 + week-number block', async ({
    page,
  }) => {
    await page.goto('/trends/tracker')
    const eyebrow = page.getByTestId('pillar-hero-eyebrow')
    await expect(eyebrow).toContainText(/signature · trends tracker/i)
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/rising/i)
    await expect(page.getByTestId('tracker-week-block')).toBeVisible()
  })

  test('renders at least one summary card and one tracker row', async ({
    page,
  }) => {
    await page.goto('/trends/tracker')
    const cards = page.getByTestId('tracker-summary-card')
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
    const rows = page.getByTestId('tracker-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
  })

  test('emits Dataset JSON-LD in addition to CollectionPage', async ({
    page,
  }) => {
    await page.goto('/trends/tracker')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"Dataset"')
    expect(flat).toContain('"@type":"CollectionPage"')
  })
})
