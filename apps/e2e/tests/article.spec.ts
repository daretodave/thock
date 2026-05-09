import { expect, test } from '@playwright/test'

// One real seed slug — chosen because it referenced parts in the
// frontmatter, exercising the MentionedPartsRail in phase 5.
const SEED = '/article/gateron-oil-king-deep-dive'

test.describe('article page family — canonical template', () => {
  test('renders hero + byline + body + tag chips', async ({ page }) => {
    await page.goto(SEED)

    await expect(page.getByTestId('article-hero')).toBeVisible()
    await expect(page.getByTestId('article-byline')).toBeVisible()
    await expect(page.getByTestId('article-body')).toBeVisible()

    const chips = page.getByTestId('tag-chip')
    expect(await chips.count()).toBeGreaterThanOrEqual(1)
  })

  test('eyebrow links to the pillar landing', async ({ page }) => {
    await page.goto(SEED)
    const eyebrow = page.getByTestId('article-hero-eyebrow').locator('a')
    await expect(eyebrow).toHaveAttribute('href', /^\/(news|trends|ideas|deep-dives|guides)$/)
  })

  test('renders an Article JSON-LD graph', async ({ page }) => {
    await page.goto(SEED)
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    expect(scripts.length).toBeGreaterThanOrEqual(1)
    const matched = scripts.some((s) => s.includes('"@type":"Article"'))
    expect(matched).toBe(true)
  })

  test('mentioned-parts rail renders for an article with parts', async ({ page }) => {
    await page.goto(SEED)
    await expect(page.getByTestId('mentioned-parts-rail')).toBeVisible()
  })

  test('canonical link tag matches the URL', async ({ page }) => {
    await page.goto(SEED)
    const href = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute('href')
    expect(href).toMatch(new RegExp(`${SEED}$`))
  })
})
