import { expect, test } from '@playwright/test'

test.describe('home smoke — desktop', () => {
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

  test('home lists at least one article', async ({ page }) => {
    await page.goto('/')
    const list = page.getByTestId('home-article-list')
    await expect(list).toBeVisible()
    const items = list.locator('li')
    await expect(items.first()).toBeVisible()
    expect(await items.count()).toBeGreaterThanOrEqual(1)
    // At least one item links into /article/[slug]
    const articleLinks = list.locator('a[href^="/article/"]')
    expect(await articleLinks.count()).toBeGreaterThanOrEqual(1)
  })
})
