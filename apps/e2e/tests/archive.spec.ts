import { expect, test } from '@playwright/test'

test.describe('archive — phase 43', () => {
  test('renders eyebrow + H1', async ({ page }) => {
    await page.goto('/archive')
    const eyebrow = page.getByTestId('archive-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/browse/i)
    const h1 = page.getByTestId('archive-h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/archive/i)
  })

  test('renders at least one month group heading', async ({ page }) => {
    await page.goto('/archive')
    const headings = page.getByTestId('archive-month-heading')
    await expect(headings.first()).toBeVisible()
  })

  test('article links point to /article/<slug>', async ({ page }) => {
    await page.goto('/archive')
    const links = page.getByTestId('archive-article-link')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    const href = await links.first().getAttribute('href')
    expect(href).toMatch(/^\/article\//)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/archive')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })

  test('/tags page has Browse by date link to /archive', async ({ page }) => {
    await page.goto('/tags')
    const link = page.getByTestId('tags-archive-link')
    await expect(link).toBeVisible()
    await expect(link).toContainText(/browse by date/i)
    const href = await link.getAttribute('href')
    expect(href).toBe('/archive')
  })
})
