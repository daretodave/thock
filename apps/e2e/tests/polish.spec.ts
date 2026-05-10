import { expect, test } from '@playwright/test'

test.describe('per-route 404 — search-suggestion path', () => {
  test('/article/<unknown-slug> renders did-you-mean suggestions when the slug overlaps the catalog', async ({
    page,
  }) => {
    // "gateron-oil" overlaps "Gateron Oil King" deep dive (seed); MiniSearch
    // fuzzy/prefix matching should surface that article in the top hits.
    await page.goto('/article/gateron-oil')
    await expect(page.locator('h1').first()).toContainText(
      /that article doesn/i,
    )
    const suggestions = page.getByTestId('not-found-suggestions')
    await expect(suggestions).toBeVisible()
    const items = page.getByTestId('not-found-suggestion')
    expect(await items.count()).toBeGreaterThanOrEqual(1)
    expect(await items.count()).toBeLessThanOrEqual(3)
    // First suggestion should link to a real article slug.
    const firstHref = await items.first().getAttribute('href')
    expect(firstHref).toMatch(/^\/article\/[a-z0-9-]+$/)
  })

  // (Removed: "no overlap" e2e — fragile against catalog growth.
  // MiniSearch fuzzy/prefix matching at scale finds overlap for
  // most strings; the empty-result behavior is unit-tested against
  // the SuggestedArticles helper directly.)

  test('/tag/<unknown-slug> renders did-you-mean suggestions via overlap with article tags', async ({
    page,
  }) => {
    // Use a slug that won't overlap an existing tag but contains terms in
    // article bodies (gateron is heavily indexed via the deep dive).
    await page.goto('/tag/gateron-something-fake')
    await expect(page.locator('h1').first()).toContainText(/no tag/i)
    const suggestions = page.getByTestId('not-found-suggestions')
    await expect(suggestions).toBeVisible()
    const items = page.getByTestId('not-found-suggestion')
    expect(await items.count()).toBeGreaterThanOrEqual(1)
  })
})

test.describe('global 404 — phase 16', () => {
  test('renders the branded not-found page for an unknown root path', async ({
    page,
  }) => {
    await page.goto('/this-route-does-not-exist-anywhere')
    await expect(page.getByTestId('not-found-eyebrow')).toContainText('404')
    await expect(page.locator('h1').first()).toContainText(
      /lost in the layout/i,
    )
  })

  test('the search affordance posts to /search via GET', async ({ page }) => {
    await page.goto('/this-also-does-not-exist')
    const form = page.getByTestId('not-found-search-form')
    await expect(form).toHaveAttribute('action', '/search')
    await expect(form).toHaveAttribute('method', 'get')
  })

  test('the pillar nav links to all five pillars', async ({ page }) => {
    await page.goto('/another-unknown-path')
    const nav = page.getByTestId('not-found-pillar-nav')
    const links = nav.locator('a')
    expect(await links.count()).toBe(5)
    for (const href of [
      '/news',
      '/trends',
      '/ideas',
      '/deep-dives',
      '/guides',
    ]) {
      await expect(nav.locator(`a[href="${href}"]`)).toBeVisible()
    }
  })
})

test.describe('/about — phase 16', () => {
  test('renders eyebrow + italic display H1 + four locked sections', async ({
    page,
  }) => {
    await page.goto('/about')
    await expect(page.getByTestId('about-eyebrow')).toContainText(/about/i)
    await expect(page.locator('h1').first()).toContainText(/who we are/i)
    await expect(page.getByTestId('about-section-pillars')).toBeVisible()
    await expect(page.getByTestId('about-section-voice')).toBeVisible()
    await expect(page.getByTestId('about-section-trends')).toBeVisible()
    await expect(page.getByTestId('about-section-disclosure')).toBeVisible()
  })

  test('emits WebSite + BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/about')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebSite"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })
})

test.describe('/sources — phase 16', () => {
  test('renders eyebrow + italic display H1 + at least one cited article', async ({
    page,
  }) => {
    await page.goto('/sources')
    await expect(page.getByTestId('sources-eyebrow')).toContainText(/sources/i)
    await expect(page.locator('h1').first()).toContainText(
      /where we got the facts/i,
    )
    // The seed Mode Sonnet R2 article uses <Source>; SourceCounts
    // surfaces it. If this assertion ever breaks, update the seed.
    const counts = page.getByTestId('source-counts')
    await expect(counts).toBeVisible()
    const rows = page.getByTestId('source-counts-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
  })

  test('renders the per-citation index with at least one row pointing at a real URL', async ({
    page,
  }) => {
    await page.goto('/sources')
    const index = page.getByTestId('citation-index')
    await expect(index).toBeVisible()
    const rows = page.getByTestId('citation-index-row')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
    const firstHref = await rows.first().getAttribute('data-href')
    expect(firstHref).toMatch(/^https?:\/\//)
  })

  test('emits WebSite + BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/sources')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebSite"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })
})
