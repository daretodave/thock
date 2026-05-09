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

  test('body paragraphs have non-zero bottom margin (prose styles applied)', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md HIGH "wall-of-text" finding.
    // Without .thock-prose styles, Tailwind preflight resets `p { margin: 0 }`
    // and adjacent paragraphs collapse into one visual block. We only need to
    // assert one paragraph has a real bottom margin — the same rule covers
    // every <p> inside .thock-prose.
    await page.goto('/article/trends-tracker-preview')
    const body = page.getByTestId('article-body')
    const firstP = body.locator('p').first()
    const margin = await firstP.evaluate(
      (el) => window.getComputedStyle(el).marginBottom,
    )
    const px = parseFloat(margin)
    expect(px).toBeGreaterThan(8)
  })

  test('inline <Mono> tokens render inside their surrounding paragraph', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md HIGH "inline Mono renders as
    // block siblings". The Mono tokens listing the five categories must
    // sit inside a single <p> with the running prose, not as sibling
    // block elements.
    await page.goto('/article/trends-tracker-preview')
    const para = page
      .locator('p', {
        hasText: 'Every row on the tracker belongs to one of five categories',
      })
      .first()
    await expect(para).toContainText('switches')
    await expect(para).toContainText('keycaps')
    await expect(para).toContainText('layouts')
    await expect(para).toContainText('vendors')
    await expect(para).toContainText('brands')
    const monoCount = await para.locator('span.font-mono').count()
    expect(monoCount).toBeGreaterThanOrEqual(5)
  })
})
