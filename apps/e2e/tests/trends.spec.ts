import { expect, test } from '@playwright/test'

test.describe('trends pillar — phase 8', () => {
  test('pillar hero renders dashboard pill linking to /trends/tracker', async ({
    page,
  }) => {
    await page.goto('/trends')
    const pill = page.getByTestId('pillar-hero-tracker')
    await expect(pill).toBeVisible()
    await expect(pill).toHaveAttribute('href', '/trends/tracker')
  })

  test('pillar hero also renders RSS pill linking to /feed/trends.xml', async ({
    page,
  }) => {
    await page.goto('/trends')
    const rss = page.getByTestId('pillar-hero-rss')
    await expect(rss).toHaveAttribute('href', '/feed/trends.xml')
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/trends')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})

test.describe('trends tracker — phase 8', () => {
  test('renders SIGNATURE eyebrow + italic H1 + week-number block', async ({
    page,
  }) => {
    await page.goto('/trends/tracker')
    const eyebrow = page.getByTestId('pillar-hero-eyebrow')
    await expect(eyebrow).toContainText(/signature · trends tracker/i)
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/rising/i)
    await expect(page.getByTestId('tracker-week-block')).toBeVisible()
  })

  test('renders at least one summary card and one tracker row', async ({
    page,
  }) => {
    await page.goto('/trends/tracker')
    const cards = page.getByTestId('tracker-summary-card')
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
    const rows = page.getByTestId('tracker-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
  })

  test('renders at least three rows in every category section after the phase 19 backfill', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md MED single-row table
    // chrome (pass 3, line 95). After phase 19 the snapshot ships
    // ≥3 rows per category (switch / keycap / layout / vendor /
    // brand) so each category table no longer renders the chrome
    // wrapped around a single data point.
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/trends/tracker')
    const sections = page.getByTestId('tracker-category-section')
    const sectionCount = await sections.count()
    expect(sectionCount).toBeGreaterThanOrEqual(5)
    for (let i = 0; i < sectionCount; i++) {
      const rows = sections.nth(i).getByTestId('tracker-row')
      expect(await rows.count()).toBeGreaterThanOrEqual(3)
    }
  })

  test('emits Dataset JSON-LD in addition to CollectionPage', async ({
    page,
  }) => {
    await page.goto('/trends/tracker')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"Dataset"')
    expect(flat).toContain('"@type":"CollectionPage"')
  })

  test('row names link to their deep dive when an article exists', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md HIGH "lede claims rows
    // link to deep dives, but no row links anywhere" (pass 2,
    // commit 47a6363). After this fix, the seed snapshot's two
    // rows whose name matches a published article (Gateron Oil
    // King → gateron-oil-king-deep-dive, Alice layout →
    // alice-layout-decline) render their name as a Link to the
    // article. Other rows keep the plain-span treatment because
    // no deep dive exists yet.
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/trends/tracker')
    const oilKing = page.getByRole('link', {
      name: 'Gateron Oil King',
      exact: true,
    })
    await expect(oilKing).toHaveAttribute(
      'href',
      '/article/gateron-oil-king-deep-dive',
    )
    const alice = page.getByRole('link', {
      name: 'Alice layout',
      exact: true,
    })
    await expect(alice).toHaveAttribute('href', '/article/alice-layout-decline')
  })

  test('first tracker row keeps top padding so it does not collide with the table header', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md MED user-jot
    // "first row collides with table header". TrackerRow's
    // `first:pt-0` was zeroing out top padding on the first row,
    // so "01 Gateron Oil King" sat flush against the header
    // labels above it. Fix: drop first:pt-0 so every row keeps
    // py-4 top spacing; first:border-t-0 stays to avoid doubling
    // the border against the header's border-b.
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/trends/tracker')
    const firstRow = page.getByTestId('tracker-row').first()
    const paddingTop = await firstRow.evaluate(
      (el) => window.getComputedStyle(el).paddingTop,
    )
    const px = parseFloat(paddingTop)
    expect(px).toBeGreaterThan(8)
  })
})
