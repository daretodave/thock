import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 375, height: 800 } })

test.describe('/vendors mobile — phase 45', () => {
  test('index has no horizontal scroll at 375px', async ({ page }) => {
    await page.goto('/vendors')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expect(page.getByTestId('vendors-h1')).toBeVisible()
  })

  test('detail page has no horizontal scroll at 375px', async ({ page }) => {
    await page.goto('/vendor/cannonkeys')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expect(page.getByTestId('vendor-detail-h1')).toBeVisible()
  })
})
