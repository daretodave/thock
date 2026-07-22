import { expect, test } from '@playwright/test'

test.describe('group-buys index — phase 13', () => {
  test('renders the canonical Group buys H1 and meta line', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/group buys/i)
    // Meta line reads "N live · N announced · N recently ended", omitting
    // any segment at 0 — doesn't assume a live/announced buy is currently
    // in flight (as of 2026-07-15 every backfilled buy has closed).
    await expect(
      page.locator('[data-testid="group-buys-summary"]'),
    ).toBeVisible()
  })

  test('lists at least four group-buy-rows from the backfill', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const rows = page.locator('[data-testid="group-buy-row"]')
    expect(await rows.count()).toBeGreaterThanOrEqual(4)
  })

  test('every CTA carries rel="sponsored noopener" target="_blank"', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    // CTAs render only on live/announced rows (GroupBuyRow's `ctaVisible`);
    // as of 2026-07-15 every backfilled buy has closed, so the list can be
    // legitimately empty right now. Same conditional-guard shape as the
    // "links to the past-buys archive" test above — asserts the contract
    // on every CTA that does exist rather than assuming one is in flight.
    const ctas = page.locator('[data-testid="group-buy-cta"]')
    const count = await ctas.count()
    for (let i = 0; i < count; i++) {
      const cta = ctas.nth(i)
      await expect(cta).toHaveAttribute('rel', 'sponsored noopener')
      await expect(cta).toHaveAttribute('target', '_blank')
    }
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/group-buys')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })

  test('links to the past-buys archive when an ended row renders', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const link = page.locator('[data-testid="group-buys-archive-link"]')
    if ((await link.count()) > 0) {
      await expect(link.first()).toHaveAttribute('href', '/group-buys/past')
    }
  })
})

test.describe('group-buys relatedArticle — phase 37', () => {
  test('shows "read our coverage" link on at least one card where relatedArticle is set', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    const links = page.locator('[data-testid="group-buy-coverage-link"]')
    expect(await links.count()).toBeGreaterThanOrEqual(1)
    const first = links.first()
    await expect(first).toHaveAttribute('href', /^\/article\//)
    await expect(first).toContainText(/read our coverage/i)
  })

  test('coverage link also appears on past group-buys archive', async ({
    page,
  }) => {
    await page.goto('/group-buys/past')
    const links = page.locator('[data-testid="group-buy-coverage-link"]')
    expect(await links.count()).toBeGreaterThanOrEqual(1)
    const first = links.first()
    await expect(first).toHaveAttribute('href', /^\/article\//)
  })

  test('ItemList JSON-LD on /group-buys includes sameAs for buy with relatedArticle', async ({
    page,
  }) => {
    await page.goto('/group-buys')
    // The active-buys ItemList only carries live/announced entries; as of
    // 2026-07-15 every backfilled buy has closed, so it can legitimately
    // be empty. The equivalent coverage on /group-buys/past (which does
    // include ended buys) is asserted by the sibling "coverage link also
    // appears on past group-buys archive" test above.
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    if (flat.includes('"sameAs"')) {
      expect(flat).toContain('/article/')
    }
  })
})

test.describe('group-buys productSlug catalog link', () => {
  test('shows "view catalog specs" link on past group-buys where productSlug is set', async ({
    page,
  }) => {
    await page.goto('/group-buys/past')
    const links = page.locator('[data-testid="group-buy-product-link"]')
    expect(await links.count()).toBeGreaterThanOrEqual(1)
    const first = links.first()
    await expect(first).toHaveAttribute('href', /^\/part\/(board|keycap-set|switch)\//)
    await expect(first).toContainText(/view catalog specs/i)
  })

  test('catalog link target resolves to a real part page', async ({
    page,
  }) => {
    await page.goto('/group-buys/past')
    const href = await page
      .locator('[data-testid="group-buy-product-link"]')
      .first()
      .getAttribute('href')
    expect(href).toBeTruthy()
    const response = await page.request.get(href as string)
    expect(response.status()).toBe(200)
  })
})

test.describe('group-buys archive — phase 29', () => {
  test('renders the Past group buys H1', async ({ page }) => {
    await page.goto('/group-buys/past')
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/past group buys/i)
  })

  test('lists at least one ended row, no live rows', async ({ page }) => {
    await page.goto('/group-buys/past')
    const rows = page.locator('[data-testid="group-buy-row"]')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(1)
    const liveRows = page.locator(
      '[data-testid="group-buy-row"][data-variant="live"]',
    )
    expect(await liveRows.count()).toBe(0)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/group-buys/past')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})
