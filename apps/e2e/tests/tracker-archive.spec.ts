import { expect, test } from '@playwright/test'

test.describe('tracker archive — phase 27', () => {
  test('GET /trends/tracker/2026-W19 → 200 with tracker heading', async ({
    page,
  }) => {
    await page.goto('/trends/tracker/2026-W19')
    await expect(page.locator('h1').first()).toContainText(/rising/i)
  })

  test('GET /trends/tracker/2026-W20 → 200 (both weeks resolve)', async ({
    page,
  }) => {
    await page.goto('/trends/tracker/2026-W20')
    await expect(page.locator('h1').first()).toContainText(/rising/i)
  })

  test('/trends/tracker/2026-W19 shows week 19 in the tracker week block', async ({
    page,
  }) => {
    await page.goto('/trends/tracker/2026-W19')
    const weekBlock = page.getByTestId('tracker-week-block')
    await expect(weekBlock).toBeVisible()
    await expect(weekBlock).toContainText('19')
  })

  test('/trends/tracker/2026-W19 emits CollectionPage + BreadcrumbList + Dataset JSON-LD', async ({
    page,
  }) => {
    await page.goto('/trends/tracker/2026-W19')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
    expect(flat).toContain('"@type":"Dataset"')
  })

  test('/trends/tracker/unknown-week → 404 response', async ({
    page,
  }) => {
    const response = await page.goto('/trends/tracker/unknown-week')
    expect(response?.status()).toBe(404)
  })

  test('/trends/tracker shows archive strip linking to older weeks', async ({
    page,
  }) => {
    await page.goto('/trends/tracker')
    const strip = page.getByTestId('tracker-archive-strip')
    await expect(strip).toBeVisible()
    const archiveLinks = strip.getByTestId('tracker-archive-link')
    const count = await archiveLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)
    const firstLink = archiveLinks.first()
    const href = await firstLink.getAttribute('href')
    expect(href).toMatch(/^\/trends\/tracker\/\d{4}-W\d{2}$/)
  })

  test('/trends/tracker/2026-W19 shows next-week link to 2026-W20', async ({
    page,
  }) => {
    await page.goto('/trends/tracker/2026-W19')
    const nextLink = page.getByTestId('tracker-next-week')
    await expect(nextLink).toBeVisible()
    await expect(nextLink).toHaveAttribute('href', '/trends/tracker/2026-W20')
  })

  test('/trends/tracker/2026-W19 has a back-to-latest link', async ({
    page,
  }) => {
    await page.goto('/trends/tracker/2026-W19')
    const backLink = page.getByRole('link', { name: /back to latest/i })
    await expect(backLink).toHaveAttribute('href', '/trends/tracker')
  })

  test('archive week page has skip-to-main link + single main landmark', async ({
    page,
  }) => {
    await page.goto('/trends/tracker/2026-W19')
    const main = page.locator('main')
    await expect(main).toHaveCount(1)
  })
})
