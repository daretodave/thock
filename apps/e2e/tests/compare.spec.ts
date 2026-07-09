import { expect, test } from '@playwright/test'

test.describe('/compare/switch — phase 44', () => {
  test('base route renders H1 "Compare switches" and selector', async ({
    page,
  }) => {
    await page.goto('/compare/switch')
    await expect(page.getByTestId('compare-h1')).toHaveText('Compare switches')
    await expect(page.getByTestId('compare-selector')).toBeVisible()
    await expect(page.getByTestId('compare-select-a')).toBeVisible()
    await expect(page.getByTestId('compare-select-b')).toBeVisible()
    await expect(page.getByTestId('compare-button')).toBeDisabled()
  })

  test('renders comparison table when two valid slugs are in query params', async ({
    page,
  }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=cherry-mx2a-red',
    )
    await expect(page.getByTestId('compare-table')).toBeVisible()
    await expect(page.getByTestId('compare-switch-a-link')).toContainText(
      'Gateron Oil King',
    )
    await expect(page.getByTestId('compare-switch-b-link')).toContainText(
      'Cherry MX2A Red',
    )
  })

  test('switch name links point to the correct /part/switch/[slug] pages', async ({
    page,
  }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=cherry-mx2a-red',
    )
    await expect(page.getByTestId('compare-switch-a-link')).toHaveAttribute(
      'href',
      '/part/switch/gateron-oil-king',
    )
    await expect(page.getByTestId('compare-switch-b-link')).toHaveAttribute(
      'href',
      '/part/switch/cherry-mx2a-red',
    )
  })

  test('at least one spec row is marked data-differs="true" for different switches', async ({
    page,
  }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=cherry-mx2a-red',
    )
    const diffRows = page.locator(
      '[data-testid="compare-spec-row"][data-differs="true"]',
    )
    expect(await diffRows.count()).toBeGreaterThan(0)
  })

  test('H1 changes to switch names when both params are provided', async ({
    page,
  }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=cherry-mx2a-red',
    )
    await expect(page.getByTestId('compare-h1')).toContainText('vs')
  })

  test('emits BreadcrumbList JSON-LD on base route', async ({ page }) => {
    await page.goto('/compare/switch')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })

  test('emits ItemList JSON-LD when two valid switches are compared', async ({
    page,
  }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=cherry-mx2a-red',
    )
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"ItemList"')
    expect(flat).toContain('"@type":"ListItem"')
  })

  test('part detail page for a switch shows "Compare →" affordance', async ({
    page,
  }) => {
    await page.goto('/part/switch/gateron-oil-king')
    const link = page.getByTestId('part-compare-link')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute(
      'href',
      '/compare/switch?a=gateron-oil-king',
    )
  })

  test('selector is pre-seeded with query param values', async ({ page }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=cherry-mx2a-red',
    )
    const selectA = page.getByTestId('compare-select-a')
    const selectB = page.getByTestId('compare-select-b')
    await expect(selectA).toHaveValue('gateron-oil-king')
    await expect(selectB).toHaveValue('cherry-mx2a-red')
  })

  test('identical a and b params fall back to the empty state instead of a degenerate table', async ({
    page,
  }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=gateron-oil-king',
    )
    await expect(page.getByTestId('compare-h1')).toHaveText('Compare switches')
    await expect(page.getByTestId('compare-table')).not.toBeVisible()
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    expect(scripts.join('\n')).not.toContain('"@type":"ItemList"')
  })
})

test.describe('/compare/board — phase 48', () => {
  test('base route renders H1 "Compare boards" and selector', async ({
    page,
  }) => {
    await page.goto('/compare/board')
    await expect(page.getByTestId('compare-h1')).toHaveText('Compare boards')
    await expect(page.getByTestId('compare-selector')).toBeVisible()
    await expect(page.getByTestId('compare-select-a')).toBeVisible()
    await expect(page.getByTestId('compare-select-b')).toBeVisible()
    await expect(page.getByTestId('compare-button')).toBeDisabled()
  })

  test('renders comparison table when two valid slugs are in query params', async ({
    page,
  }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=class80')
    await expect(page.getByTestId('compare-table')).toBeVisible()
    await expect(page.getByTestId('compare-board-a-link')).toContainText(
      'Mode Sonnet',
    )
    await expect(page.getByTestId('compare-board-b-link')).toContainText(
      'MM Studio Class80',
    )
  })

  test('board name links point to the correct /part/board/[slug] pages', async ({
    page,
  }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=class80')
    await expect(page.getByTestId('compare-board-a-link')).toHaveAttribute(
      'href',
      '/part/board/mode-sonnet',
    )
    await expect(page.getByTestId('compare-board-b-link')).toHaveAttribute(
      'href',
      '/part/board/class80',
    )
  })

  test('at least one spec row is marked data-differs="true" for different boards', async ({
    page,
  }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=class80')
    const diffRows = page.locator(
      '[data-testid="compare-spec-row"][data-differs="true"]',
    )
    expect(await diffRows.count()).toBeGreaterThan(0)
  })

  test('H1 changes to board names when both params are provided', async ({
    page,
  }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=class80')
    await expect(page.getByTestId('compare-h1')).toContainText('vs')
  })

  test('emits BreadcrumbList JSON-LD on base route', async ({ page }) => {
    await page.goto('/compare/board')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"BreadcrumbList"')
  })

  test('emits ItemList JSON-LD when two valid boards are compared', async ({
    page,
  }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=class80')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"ItemList"')
    expect(flat).toContain('"@type":"ListItem"')
  })

  test('part detail page for a board shows "Compare this board →" affordance', async ({
    page,
  }) => {
    await page.goto('/part/board/mode-sonnet')
    const link = page.getByTestId('part-compare-link')
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute(
      'href',
      '/compare/board?a=mode-sonnet',
    )
  })

  test('selector is pre-seeded with query param values', async ({ page }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=class80')
    const selectA = page.getByTestId('compare-select-a')
    const selectB = page.getByTestId('compare-select-b')
    await expect(selectA).toHaveValue('mode-sonnet')
    await expect(selectB).toHaveValue('class80')
  })

  test('identical a and b params fall back to the empty state instead of a degenerate table', async ({
    page,
  }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=mode-sonnet')
    await expect(page.getByTestId('compare-h1')).toHaveText('Compare boards')
    await expect(page.getByTestId('compare-table')).not.toBeVisible()
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    expect(scripts.join('\n')).not.toContain('"@type":"ItemList"')
  })
})
