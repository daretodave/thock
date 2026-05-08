import { expect, test } from '@playwright/test'

test.describe('phase 1 smoke — mobile (375px)', () => {
  test('home has no horizontal scroll and h1 is in viewport', async ({ page }) => {
    await page.goto('/')

    const overflow = await page.evaluate(() => {
      const root = document.documentElement
      return root.scrollWidth - root.clientWidth
    })
    expect(overflow).toBeLessThanOrEqual(1)

    const h1 = page.getByRole('heading', { level: 1, name: /thock/i })
    await expect(h1).toBeVisible()
    const box = await h1.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(375 + 1)
  })
})
