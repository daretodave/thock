import { expect, test } from '@playwright/test'

test.describe('/quiz/switch — mobile (375px) — phase 33', () => {
  test('no horizontal scroll on quiz page', async ({ page }) => {
    await page.goto('/quiz/switch')
    const overflow = await page.evaluate(() => {
      const root = document.documentElement
      return root.scrollWidth - root.clientWidth
    })
    expect(
      overflow,
      `/quiz/switch should not scroll horizontally at 375px (overflow=${overflow}px)`,
    ).toBeLessThanOrEqual(1)
  })

  test('H1 is visible at 375px viewport', async ({ page }) => {
    await page.goto('/quiz/switch')
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
  })
})
