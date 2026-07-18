import { test, expect } from '@playwright/test'

test.describe('/vendors index', () => {
  test('renders H1 and vendor cards', async ({ page }) => {
    await page.goto('/vendors')
    const h1 = page.getByTestId('vendors-h1')
    await expect(h1).toBeVisible()
    await expect(h1).toHaveText('Vendors')
    const cards = page.locator('[data-testid="vendor-card"]')
    await expect(cards).toHaveCount(10)
  })

  test('renders eyebrow and list', async ({ page }) => {
    await page.goto('/vendors')
    await expect(page.getByTestId('vendors-eyebrow')).toBeVisible()
    await expect(page.locator('[data-testid="vendors-list"]')).toBeVisible()
  })

  test('vendor card links to detail page', async ({ page }) => {
    await page.goto('/vendors')
    const firstLink = page.locator('[data-testid="vendor-card-name"]').first()
    const href = await firstLink.getAttribute('href')
    expect(href).toMatch(/^\/vendor\//)
  })

  test('has valid JSON-LD', async ({ page }) => {
    await page.goto('/vendors')
    const scripts = page.locator('script[type="application/ld+json"]')
    const count = await scripts.count()
    expect(count).toBeGreaterThan(0)
    const content = await scripts.first().textContent()
    const raw = JSON.parse(content ?? '{}')
    // JsonLd serializes the graph prop directly — it may be an array or a single object.
    const nodes: { '@type': string }[] = Array.isArray(raw)
      ? raw
      : raw['@graph'] ?? [raw]
    const types = nodes.map((n) => n['@type'])
    expect(types.some((t: string) => /CollectionPage|ItemList|BreadcrumbList/.test(t))).toBe(true)
  })

  test('every vendor card external link carries rel="sponsored noopener" target="_blank"', async ({
    page,
  }) => {
    await page.goto('/vendors')
    const links = page.locator('[data-testid="vendor-card-external-link"]')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('rel', 'sponsored noopener')
      await expect(link).toHaveAttribute('target', '_blank')
    }
  })
})

test.describe('/vendor/[slug] detail', () => {
  test('renders vendor name as H1', async ({ page }) => {
    await page.goto('/vendor/cannonkeys')
    const h1 = page.getByTestId('vendor-detail-h1')
    await expect(h1).toBeVisible()
    await expect(h1).toHaveText('CannonKeys')
  })

  test('renders description, country, and external URL', async ({ page }) => {
    await page.goto('/vendor/cannonkeys')
    await expect(page.getByTestId('vendor-detail-description')).toBeVisible()
    await expect(page.getByTestId('vendor-detail-country')).toHaveText('United States')
    const urlLink = page.getByTestId('vendor-detail-url')
    await expect(urlLink).toBeVisible()
    const href = await urlLink.getAttribute('href')
    expect(href).toContain('cannonkeys.com')
    await expect(urlLink).toHaveAttribute('rel', 'sponsored noopener')
    await expect(urlLink).toHaveAttribute('target', '_blank')
  })

  test('back link leads to /vendors', async ({ page }) => {
    await page.goto('/vendor/cannonkeys')
    const backLink = page.getByTestId('vendor-detail-back-link')
    await expect(backLink).toHaveAttribute('href', '/vendors')
  })

  test('renders group buy sections', async ({ page }) => {
    await page.goto('/vendor/kbdfans')
    await expect(page.getByTestId('vendor-active-buys-kicker')).toBeVisible()
    await expect(page.getByTestId('vendor-past-buys-kicker')).toBeVisible()
  })

  test('has valid Organization JSON-LD', async ({ page }) => {
    await page.goto('/vendor/cannonkeys')
    const scripts = page.locator('script[type="application/ld+json"]')
    const count = await scripts.count()
    expect(count).toBeGreaterThan(0)
    let org: { '@type': string; url?: string; sameAs?: string } | undefined
    for (let i = 0; i < count; i++) {
      const content = await scripts.nth(i).textContent()
      const raw = JSON.parse(content ?? '{}')
      // JsonLd serializes the graph prop directly — it may be an array or single object.
      const nodes: { '@type': string; url?: string; sameAs?: string }[] = Array.isArray(raw)
        ? raw
        : raw['@graph'] ?? [raw]
      org = nodes.find((n) => n['@type'] === 'Organization')
      if (org) break
    }
    expect(org).toBeTruthy()
    // url must be the vendor's own homepage, not thock's page about the vendor —
    // schema.org Organization.url identifies the entity's own site.
    expect(org?.url).toBe('https://cannonkeys.com')
    expect(org?.sameAs).toBeUndefined()
  })

  test('boards section visible for vendor with boards', async ({ page }) => {
    await page.goto('/vendor/cannonkeys')
    await expect(page.getByTestId('vendor-boards-kicker')).toBeVisible()
    const boardsList = page.getByTestId('vendor-boards-list')
    if (await boardsList.isVisible()) {
      const rows = page.locator('[data-testid="vendor-board-row"]')
      await expect(rows.first()).toBeVisible()
    }
  })

  test('switches section lists a vendor\'s catalog switches', async ({ page }) => {
    await page.goto('/vendor/novelkeys')
    await expect(page.getByTestId('vendor-switches-kicker')).toBeVisible()
    const rows = page.locator('[data-testid="vendor-switch-row"]')
    await expect(rows.first()).toBeVisible()
    const link = rows.first().locator('a').first()
    const href = await link.getAttribute('href')
    expect(href).toMatch(/^\/part\/switch\//)
  })

  test('keycap sets section lists a vendor\'s catalog keycap sets', async ({ page }) => {
    await page.goto('/vendor/kbdfans')
    await expect(page.getByTestId('vendor-keycap-sets-kicker')).toBeVisible()
    const rows = page.locator('[data-testid="vendor-keycap-set-row"]')
    await expect(rows.first()).toBeVisible()
    const link = rows.first().locator('a').first()
    const href = await link.getAttribute('href')
    expect(href).toMatch(/^\/part\/keycap-set\//)
  })

  test('switches/keycap-sets empty state renders for a vendor with only boards', async ({ page }) => {
    await page.goto('/vendor/keychron')
    await expect(page.getByTestId('vendor-switches-empty')).toBeVisible()
    await expect(page.getByTestId('vendor-keycap-sets-empty')).toBeVisible()
  })
})
