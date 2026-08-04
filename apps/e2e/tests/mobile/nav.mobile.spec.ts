import { expect, test } from '@playwright/test'

test.describe('mobile nav — phase critique drain', () => {
  test('hamburger toggle is visible at 375px and opens a drawer with pillar links and Tools', async ({
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

    for (const label of ['News', 'Trends', 'Ideas', 'Deep Dives', 'Guides', 'Tools']) {
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

  test('real keyboard Tab wraps from the last drawer link back to the toggle button', async ({
    page,
  }) => {
    // Regression guard for the fix-then-regression pair shipped 2026-08-03/04
    // (6ef381e3 added the Tab trap, 1cfc52d4 narrowed it) — the unit-test
    // suite only dispatches synthetic KeyboardEvents in jsdom, which never
    // exercises real browser Tab focus order. This drives an actual Tab key.
    await page.goto('/article/gateron-oil-king-deep-dive')
    const toggle = page.getByTestId('mobile-nav-toggle')
    await toggle.click()
    const toolsLink = page.getByTestId('mobile-nav-tools-link')

    await toolsLink.focus()
    await expect(toolsLink).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(toggle).toBeFocused()
  })

  test('real keyboard Shift+Tab from the toggle button reaches the header Search link, not the drawer', async ({
    page,
  }) => {
    // Regression guard for 1cfc52d4 — the original Tab-trap fix (6ef381e3)
    // over-broadly intercepted Shift+Tab on the toggle too, hijacking a
    // normal backward tab stop into the drawer instead of Search.
    await page.goto('/article/gateron-oil-king-deep-dive')
    const toggle = page.getByTestId('mobile-nav-toggle')
    await toggle.click()
    await toggle.focus()
    await expect(toggle).toBeFocused()

    await page.keyboard.press('Shift+Tab')
    await expect(page.getByTestId('header-search-link')).toBeFocused()
  })
})
