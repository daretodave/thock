import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 375, height: 800 } })

test.describe('/compare/switch mobile — phase 44', () => {
  test('base route has no horizontal scroll at 375px', async ({ page }) => {
    await page.goto('/compare/switch')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('H1 is visible in the viewport at 375px', async ({ page }) => {
    await page.goto('/compare/switch')
    const h1 = page.getByTestId('compare-h1')
    await expect(h1).toBeVisible()
    const box = await h1.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBeLessThan(800)
  })

  test('compare table has no horizontal scroll at 375px', async ({ page }) => {
    await page.goto(
      '/compare/switch?a=gateron-oil-king&b=cherry-mx2a-red',
    )
    await expect(page.getByTestId('compare-table')).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})

test.describe('/compare/board mobile — phase 48', () => {
  test('base route has no horizontal scroll at 375px', async ({ page }) => {
    await page.goto('/compare/board')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })

  test('H1 is visible in the viewport at 375px', async ({ page }) => {
    await page.goto('/compare/board')
    const h1 = page.getByTestId('compare-h1')
    await expect(h1).toBeVisible()
    const box = await h1.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.y).toBeLessThan(800)
  })

  test('compare table has no horizontal scroll at 375px', async ({ page }) => {
    await page.goto('/compare/board?a=mode-sonnet&b=class80')
    await expect(page.getByTestId('compare-table')).toBeVisible()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  })
})
