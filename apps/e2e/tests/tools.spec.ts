import { expect, test } from '@playwright/test'

test.describe('/tools — phase 49', () => {
  test('renders H1 "Tools" and eyebrow kicker', async ({ page }) => {
    await page.goto('/tools')
    await expect(page.getByTestId('tools-h1')).toHaveText('Tools')
    await expect(page.getByTestId('tools-eyebrow')).toBeVisible()
  })

  test('renders exactly 4 tool cards', async ({ page }) => {
    await page.goto('/tools')
    const cards = page.locator('[data-testid^="tools-card-"]')
    await expect(cards).toHaveCount(4)
  })

  test('all four tool cards link to the correct routes', async ({ page }) => {
    await page.goto('/tools')
    await expect(page.getByTestId('tools-card-quiz-switch')).toHaveAttribute('href', '/quiz/switch')
    await expect(page.getByTestId('tools-card-quiz-keycap-set')).toHaveAttribute('href', '/quiz/keycap-set')
    await expect(page.getByTestId('tools-card-compare-switch')).toHaveAttribute('href', '/compare/switch')
    await expect(page.getByTestId('tools-card-compare-board')).toHaveAttribute('href', '/compare/board')
  })

  test('emits CollectionPage + BreadcrumbList + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/tools')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
    expect(flat).toContain('"@type":"ItemList"')
  })

  test('header nav shows Tools link (desktop)', async ({ page }) => {
    await page.goto('/tools')
    await expect(page.getByTestId('header-tools-link')).toBeVisible()
    await expect(page.getByTestId('header-tools-link')).toHaveAttribute('href', '/tools')
  })

  test('clicking a tool card navigates to the correct page', async ({ page }) => {
    await page.goto('/tools')
    await page.getByTestId('tools-card-quiz-switch').click()
    await expect(page).toHaveURL('/quiz/switch')
  })
})
