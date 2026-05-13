import { expect, test } from '@playwright/test'

test.describe('tag pages — phase 12', () => {
  test('renders the categorical eyebrow + #slug H1', async ({ page }) => {
    await page.goto('/tag/linear')
    const eyebrow = page.getByTestId('tag-page-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/tag · switch/i)
    const h1 = page.getByTestId('tag-page-h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('#linear')
  })

  test('lede references the slug in #slug form (matches H1, not Title-Cased name)', async ({
    page,
  }) => {
    // Critique pass 8 row: lede previously read "Linear" while the H1 reads
    // "#linear", contradicting on a single screen. Lock the consistent
    // hashtag-slug form so future renames can't reintroduce drift.
    await page.goto('/tag/linear')
    const lede = page.getByTestId('tag-page-lede')
    await expect(lede).toContainText('tagged #linear')
    await expect(lede).not.toContainText(/tagged Linear/)
  })

  test('renders the misc category as "topic" in the eyebrow', async ({
    page,
  }) => {
    // /tag/modding (and the other 20 misc-categorized tags) should
    // display "tag · topic" — the internal `misc` enum value never
    // leaks to the eyebrow chrome.
    await page.goto('/tag/modding')
    const eyebrow = page.getByTestId('tag-page-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/tag · topic/i)
    await expect(eyebrow).not.toContainText(/misc/i)
  })

  test('lists at least one article-card-row when seed has matches', async ({
    page,
  }) => {
    await page.goto('/tag/linear')
    const rows = page.locator('[data-testid="article-card-row"]')
    expect(await rows.count()).toBeGreaterThanOrEqual(1)
    const href = await rows.first().getAttribute('href')
    expect(href).toMatch(/^\/article\//)
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/tag/linear')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })

  test('does not render the tag page chrome for an unknown slug', async ({
    page,
  }) => {
    await page.goto('/tag/this-tag-does-not-exist', { waitUntil: 'load' })
    // notFound() short-circuits the page before our header renders.
    await expect(page.getByTestId('tag-page-h1')).toHaveCount(0)
    await expect(page.getByTestId('tag-page-eyebrow')).toHaveCount(0)
  })

  test('clicking a chip from /article/<slug> lands on the matching tag page', async ({
    page,
  }) => {
    // beginners-switch-buying-guide carries the linear chip in its
    // tag rail — outside the wrapper Link the chips are clickable.
    await page.goto('/article/beginners-switch-buying-guide')
    const chip = page.locator('a[data-testid="tag-chip"][href="/tag/linear"]')
    await expect(chip.first()).toBeVisible()
    await chip.first().click()
    await page.waitForURL(/\/tag\/linear$/)
    const h1 = page.getByTestId('tag-page-h1')
    await expect(h1).toContainText('#linear')
  })
})
