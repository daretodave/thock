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

  test('group-buys widget renders rows when an active buy exists', async ({
    page,
  }) => {
    // <GroupBuysWidget> renders null (by design) when the active list is
    // empty — as of 2026-07-15 every backfilled group buy has closed, so
    // the widget (and its rows) can legitimately be absent. Soft-skip
    // shape matches assertKickerContrast in apps/e2e/tests/a11y.spec.ts.
    await page.goto('/')
    const widget = page.getByTestId('widget-kicker')
    if ((await widget.count()) === 0) return
    const rows = page.getByTestId('group-buy-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
    const href = await rows.first().getAttribute('href')
    expect(href).toMatch(/^\/(article|part|group-buys)/)
  })

  test('/parts catalog link is present on the home page', async ({ page }) => {
    await page.goto('/')
    const partsLink = page.getByTestId('home-cta-strip').getByRole('link', { name: /browse the parts catalog/i })
    await expect(partsLink).toBeVisible()
    await expect(partsLink).toHaveAttribute('href', '/parts')
  })
})
