import { expect, test } from '@playwright/test'

test.describe('search — phase 14', () => {
  test('renders the H1 + a search input', async ({ page }) => {
    await page.goto('/search')
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/search thock/i)
    const input = page.locator('input[type="search"][name="q"]')
    await expect(input).toBeVisible()
  })

  test('typing a known term surfaces at least one result', async ({ page }) => {
    await page.goto('/search')
    const input = page.locator('input[type="search"][name="q"]')
    await input.fill('oil king')
    // Wait for the debounced query.
    await page.waitForSelector('[data-testid="search-result"]')
    const results = page.locator('[data-testid="search-result"]')
    expect(await results.count()).toBeGreaterThanOrEqual(1)
    const first = results.first()
    await expect(first).toHaveAttribute('data-slug', /oil-king|gateron/i)
  })

  test('a deep-link with ?q= populates the input and renders results', async ({
    page,
  }) => {
    await page.goto('/search?q=switch')
    const input = page.locator('input[type="search"][name="q"]')
    await expect(input).toHaveValue('switch')
    await page.waitForSelector('[data-testid="search-result"]')
    const results = page.locator('[data-testid="search-result"]')
    expect(await results.count()).toBeGreaterThanOrEqual(1)
  })

  test('clicking the header search icon navigates to /search', async ({
    page,
  }) => {
    await page.goto('/')
    const link = page.getByTestId('header-search-link')
    await expect(link).toBeVisible()
    await link.click()
    await page.waitForURL(/\/search$/)
    await expect(page.locator('input[type="search"][name="q"]')).toBeVisible()
  })

})
