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
})
