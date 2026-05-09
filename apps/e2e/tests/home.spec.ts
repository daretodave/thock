import { expect, test } from '@playwright/test'

test.describe('home page family — phase 6', () => {
  test('renders hero card + trending strip + latest-by-pillar + group buys', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.getByTestId('hero-card')).toBeVisible()
    await expect(page.getByTestId('trending-strip')).toBeVisible()
    await expect(page.getByTestId('latest-by-pillar')).toBeVisible()

    const tiles = page.getByTestId('trending-tile')
    expect(await tiles.count()).toBeGreaterThanOrEqual(1)

    const cards = page.getByTestId('latest-by-pillar-card')
    expect(await cards.count()).toBeGreaterThanOrEqual(2)
  })

  test('hero card links to an /article/<slug> route', async ({ page }) => {
    await page.goto('/')
    const href = await page
      .getByTestId('hero-card')
      .first()
      .getAttribute('href')
    expect(href).toMatch(/^\/article\//)
  })

  test('emits both WebSite and ItemList JSON-LD blocks', async ({ page }) => {
    await page.goto('/')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    expect(scripts.length).toBeGreaterThanOrEqual(1)
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebSite"')
    expect(flat).toContain('"@type":"ItemList"')
  })

  test('group-buys widget renders rows with the seed dataset', async ({
    page,
  }) => {
    await page.goto('/')
    const rows = page.getByTestId('group-buy-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
  })
})
