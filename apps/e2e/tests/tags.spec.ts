import { expect, test } from '@playwright/test'

test.describe('tags index — phase 28', () => {
  test('renders eyebrow + H1', async ({ page }) => {
    await page.goto('/tags')
    const eyebrow = page.getByTestId('tags-eyebrow')
    await expect(eyebrow).toBeVisible()
    await expect(eyebrow).toContainText(/browse/i)
    const h1 = page.getByTestId('tags-h1')
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(/all tags/i)
  })

  test('renders tag group headings for known categories', async ({ page }) => {
    await page.goto('/tags')
    for (const cat of ['switch', 'layout', 'brand', 'material', 'profile']) {
      const group = page.getByTestId(`tag-group-${cat}`)
      await expect(group).toBeVisible()
    }
  })

  test('each chip links to /tag/<slug>', async ({ page }) => {
    await page.goto('/tags')
    const chips = page.locator('a[data-testid="tag-chip"]')
    const count = await chips.count()
    expect(count).toBeGreaterThan(10)
    const href = await chips.first().getAttribute('href')
    expect(href).toMatch(/^\/tag\//)
  })

  test('clicking a chip navigates to the tag page', async ({ page }) => {
    await page.goto('/tags')
    const linearChip = page.locator('a[data-testid="tag-chip"][href="/tag/linear"]')
    await expect(linearChip).toBeVisible()
    await linearChip.click()
    await page.waitForURL(/\/tag\/linear$/)
    const h1 = page.getByTestId('tag-page-h1')
    await expect(h1).toContainText('#linear')
  })

  test('emits CollectionPage + ItemList JSON-LD', async ({ page }) => {
    await page.goto('/tags')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"CollectionPage"')
    expect(flat).toContain('"@type":"ItemList"')
  })

  test('ItemList JSON-LD order matches the rendered grouped-chip order', async ({
    page,
  }) => {
    // Regression guard: the ItemList used to be built from the raw
    // alphabetical tags array while <TagsIndex> renders tags grouped by
    // category — the two orders diverged (audit finding, same class as
    // the home-page ac241f7e fix).
    await page.goto('/tags')
    const graph = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    expect(graph.length).toBeGreaterThanOrEqual(1)
    const itemList = JSON.parse(graph[0] as string).find(
      (node: { '@type': string }) => node['@type'] === 'ItemList',
    )
    const jsonLdPaths = (
      itemList.itemListElement as Array<{ url: string }>
    ).map((el) => new URL(el.url).pathname)

    const chips = page.locator('a[data-testid="tag-chip"]')
    const renderedHrefs: string[] = []
    for (const chip of await chips.all()) {
      const href = await chip.getAttribute('href')
      if (href) renderedHrefs.push(href)
    }

    expect(jsonLdPaths).toEqual(renderedHrefs)
  })

  test('/tag/[slug] back-link now points to /tags', async ({ page }) => {
    await page.goto('/tag/linear')
    const backLink = page.getByTestId('tag-page-back-link')
    await expect(backLink).toBeVisible()
    await expect(backLink).toContainText(/all tags/i)
    const href = await backLink.getAttribute('href')
    expect(href).toBe('/tags')
  })
})
