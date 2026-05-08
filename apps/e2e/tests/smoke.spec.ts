import { expect, test } from '@playwright/test'

test.describe('phase 1 smoke — desktop', () => {
  test('home renders header, h1, and footer', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: /thock/i })).toBeVisible()
    await expect(page.getByText(/© 2026 thock/i)).toBeVisible()
  })

  test('document has a title and lang attribute', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/thock/i)
    const lang = await page.locator('html').getAttribute('lang')
    expect(lang).toBe('en')
  })
})
