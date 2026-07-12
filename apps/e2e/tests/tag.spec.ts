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

  test('JSON-LD and <title> resolve the tag display name, not the raw slug', async ({
    page,
  }) => {
    // /tag/65 — slug "65" vs. display name "65%". The raw slug silently
    // drops the "%" that disambiguates a layout-size tag from a bare
    // number in machine-readable surfaces (mirrors the part-page
    // brand.name fix — display-name resolution, not slug passthrough).
    await page.goto('/tag/65')
    await expect(page).toHaveTitle(/#65%/)
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('#65%')
    expect(flat).not.toMatch(/"name":"#65"/)
  })

  test('visible H1/lede/heading/empty-state also resolve numeric-slug tags to the full display name', async ({
    page,
  }) => {
    // The JSON-LD/title fix above only covered machine-readable surfaces;
    // the H1/lede/section-heading/empty-state chrome still rendered the
    // bare "#65" slug (which reads as a stray number, not a layout size)
    // because the pass-8 "#slug" convention assumed slug/name only ever
    // differ by case. "65"/"75" are the only numeric slugs where they
    // diverge in meaning, so those two fall back to the display name.
    await page.goto('/tag/65')
    const h1 = page.getByTestId('tag-page-h1')
    await expect(h1).toContainText('#65%')
    await expect(h1).not.toHaveText('#65')
    const lede = page.getByTestId('tag-page-lede')
    await expect(lede).toContainText('tagged #65%')
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
