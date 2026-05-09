import { expect, test } from '@playwright/test'

test.describe('mobile nav — phase critique drain', () => {
  test('hamburger toggle is visible at 375px and opens a drawer with all 5 pillar links', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md HIGH "mobile nav —
    // primary links unreachable at 375px, no toggle".
    await page.goto('/article/gateron-oil-king-deep-dive')

    const toggle = page.getByTestId('mobile-nav-toggle')
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const drawer = page.getByTestId('mobile-nav-menu')
    await expect(drawer).toBeVisible()

    for (const label of ['News', 'Trends', 'Ideas', 'Deep Dives', 'Guides']) {
      await expect(drawer.getByRole('link', { name: label })).toBeVisible()
    }
  })

  test('clicking a drawer link routes to the pillar', async ({ page }) => {
    await page.goto('/article/gateron-oil-king-deep-dive')
    await page.getByTestId('mobile-nav-toggle').click()
    const drawer = page.getByTestId('mobile-nav-menu')
    await drawer.getByRole('link', { name: 'News' }).click()
    await expect(page).toHaveURL(/\/news$/)
  })
})
