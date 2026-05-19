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

  test('searching a switch name surfaces a part result linking to the part page', async ({
    page,
  }) => {
    await page.goto('/search')
    const input = page.locator('input[type="search"][name="q"]')
    await input.fill('Gateron')
    await page.waitForSelector('[data-testid="search-part-result"]')
    const partResult = page.locator('[data-testid="search-part-result"]').first()
    await expect(partResult).toHaveAttribute('data-kind', 'switch')
    const link = partResult.locator('a').first()
    await expect(link).toHaveAttribute('href', /\/part\/switch\/gateron/)
  })

})
