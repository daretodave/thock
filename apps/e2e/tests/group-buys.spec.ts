import { expect, test } from '@playwright/test'

test.describe('group-buys index — phase 13', () => {
  test('renders the canonical Group buys H1 and meta line', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/group buys/i)
    await expect(page.locator('text=/live/i').first()).toBeVisible()
  })

  test('lists at least four group-buy-rows from the backfill', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const rows = page.locator('[data-testid="group-buy-row"]')
    expect(await rows.count()).toBeGreaterThanOrEqual(4)
  })

  test('every CTA carries rel="sponsored noopener" target="_blank"', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const ctas = page.locator('[data-testid="group-buy-cta"]')
    const count = await ctas.count()
    expect(count).toBeGreaterThanOrEqual(1)
    for (let i = 0; i < count; i++) {
      const cta = ctas.nth(i)
      await expect(cta).toHaveAttribute('rel', 'sponsored noopener')
      await expect(cta).toHaveAttribute('target', '_blank')
    }
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/group-buys')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })

  test('links to the past-buys archive when an ended row renders', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const link = page.locator('[data-testid="group-buys-archive-link"]')
    if ((await link.count()) > 0) {
      await expect(link.first()).toHaveAttribute('href', '/group-buys/past')
    }
  })
})

test.describe('group-buys archive — phase 29', () => {
  test('renders the Past group buys H1', async ({ page }) => {
    await page.goto('/group-buys/past')
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/past group buys/i)
  })

  test('lists at least one ended row, no live rows', async ({ page }) => {
    await page.goto('/group-buys/past')
    const rows = page.locator('[data-testid="group-buy-row"]')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(1)
    const liveRows = page.locator(
      '[data-testid="group-buy-row"][data-variant="live"]',
    )
    expect(await liveRows.count()).toBe(0)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/group-buys/past')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})
