import { expect, test } from '@playwright/test'

test.describe('ideas pillar — phase 9', () => {
  test('renders pillar hero with descriptive eyebrow and italic H1', async ({ page }) => {
    await page.goto('/ideas')
    const eyebrow = page.getByTestId('pillar-hero-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/pillar · ideas/i)
    const h1 = page.locator('h1').first()
    await expect(h1).toContainText(/ideas/i)
  })

  test('renders an RSS pill linking to /feed/ideas.xml', async ({ page }) => {
    await page.goto('/ideas')
    const link = page.getByTestId('pillar-hero-rss')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('href', '/feed/ideas.xml')
  })

  test('shows the build-of-the-week eyebrow when a tagged article exists', async ({
    page,
  }) => {
    // Seed has /article/building-mode-sonnet-with-oil-kings tagged
    // build-of-the-week. The page should render the BUILD OF THE WEEK
    // section heading above the lead.
    await page.goto('/ideas')
    const heading = page.locator('text=/build of the week/i').first()
    await expect(heading).toBeVisible()
  })

  test('shows at least one article-card link to an /article/<slug>', async ({ page }) => {
    await page.goto('/ideas')
    const cards = page.locator(
      '[data-testid="hero-card"], [data-testid="article-card-row"]',
    )
    expect(await cards.count()).toBeGreaterThanOrEqual(1)
    const href = await cards.first().getAttribute('href')
    expect(href).toMatch(/^\/article\//)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/ideas')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })
})
