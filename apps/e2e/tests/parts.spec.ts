import { expect, test } from '@playwright/test'

test.describe('per-part pages — phase 21', () => {
  test.describe('kind-index pages', () => {
    for (const kind of ['switch', 'keycap-set', 'board'] as const) {
      test(`/part/${kind} renders the catalog heading + at least one row`, async ({
        page,
      }) => {
        await page.goto(`/part/${kind}`)
        const eyebrow = page.getByTestId('part-index-eyebrow')
        await expect(eyebrow).toBeVisible()
        await expect(eyebrow).toContainText(`catalog · ${kind}`)
        const h1 = page.getByTestId('part-index-h1')
        await expect(h1).toBeVisible()
        const cards = page.locator('[data-testid="part-index-card"]')
        expect(await cards.count()).toBeGreaterThanOrEqual(1)
        const href = await cards.first().getAttribute('href')
        expect(href).toMatch(new RegExp(`^/part/${kind}/`))
      })
    }
  })

  test.describe('detail pages', () => {
    test('renders hero + spec + body for a known switch slug', async ({
      page,
    }) => {
      await page.goto('/part/switch/gateron-oil-king')
      await expect(page.getByTestId('part-hero-eyebrow')).toContainText(
        /part · switch/i,
      )
      await expect(page.getByTestId('part-hero-h1')).toContainText(
        /Gateron Oil King/i,
      )
      await expect(page.getByTestId('part-spec-list')).toBeVisible()
      await expect(page.getByTestId('part-body')).toBeVisible()
    })

    test('renders a known keycap-set slug', async ({ page }) => {
      await page.goto('/part/keycap-set/gmk-bento-r2')
      await expect(page.getByTestId('part-hero-eyebrow')).toContainText(
        /part · keycap set/i,
      )
      await expect(page.getByTestId('part-spec-list')).toContainText(/Profile/i)
    })

    test('renders a known board slug', async ({ page }) => {
      await page.goto('/part/board/bakeneko65')
      await expect(page.getByTestId('part-hero-eyebrow')).toContainText(
        /part · board/i,
      )
      await expect(page.getByTestId('part-spec-list')).toContainText(/Layout/i)
    })

    test('emits BreadcrumbList + Product/Thing JSON-LD', async ({ page }) => {
      await page.goto('/part/switch/gateron-oil-king')
      const scripts = await page
        .locator('script[type="application/ld+json"]')
        .allTextContents()
      const flat = scripts.join('\n')
      expect(flat).toContain('"@type":"BreadcrumbList"')
      expect(flat).toMatch(/"@type":"(Product|Thing)"/)
    })

    test('mentioned-in rail surfaces ≥1 article when known articles cite the part', async ({
      page,
    }) => {
      await page.goto('/part/switch/gateron-oil-king')
      // gateron-oil-king-deep-dive references this switch in mentionedParts.
      const list = page.getByTestId('part-mentioned-list')
      await expect(list).toBeVisible()
      const rows = list.locator('a[href^="/article/"]')
      expect(await rows.count()).toBeGreaterThanOrEqual(1)
    })

    test('renders the empty-state for a part no article references', async ({
      page,
    }) => {
      // akko-v3-cream-blue-pro is in the catalog but no article cites it
      // (verify-time hand-check; if a future article adds it, swap this
      // for another uncited slug and re-record).
      await page.goto('/part/switch/akko-v3-cream-blue-pro')
      await expect(page.getByTestId('part-mentioned-empty')).toBeVisible()
    })

    test('does not render the part page chrome for an unknown slug', async ({
      page,
    }) => {
      await page.goto('/part/switch/this-switch-does-not-exist', {
        waitUntil: 'load',
      })
      // notFound() short-circuits the page before our header renders.
      await expect(page.getByTestId('part-hero-h1')).toHaveCount(0)
      await expect(page.getByTestId('part-hero-eyebrow')).toHaveCount(0)
    })

    test('does not render the part page chrome for an unknown kind', async ({
      page,
    }) => {
      await page.goto('/part/keyboard/anything', { waitUntil: 'load' })
      await expect(page.getByTestId('part-hero-h1')).toHaveCount(0)
      await expect(page.getByTestId('part-index-h1')).toHaveCount(0)
    })
  })

  test.describe('MentionedPartsRail retrofit', () => {
    test('article body rail items are anchors to /part/<kind>/<slug>', async ({
      page,
    }) => {
      // gateron-oil-king-deep-dive carries mentionedParts; the build sheet
      // rail should now render its items as anchors.
      await page.goto('/article/gateron-oil-king-deep-dive')
      const items = page.locator('[data-testid="mentioned-parts-rail-item"]')
      expect(await items.count()).toBeGreaterThanOrEqual(1)
      const href = await items.first().getAttribute('href')
      expect(href).toMatch(/^\/part\/(switch|keycap-set|board)\//)
    })
  })
})
