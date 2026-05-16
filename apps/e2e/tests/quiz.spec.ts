import { expect, test } from '@playwright/test'

test.describe('/quiz/switch — phase 33', () => {
  test('renders H1 and first question on load', async ({ page }) => {
    await page.goto('/quiz/switch')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /find your switch/i,
    )
    await expect(page.getByRole('heading', { level: 2 })).toContainText(
      /sound/i,
    )
  })

  test('shows "Question 1 of 4" progress indicator', async ({ page }) => {
    await page.goto('/quiz/switch')
    await expect(page.getByText(/question 1 of 4/i)).toBeVisible()
  })

  test('advances to next question when an option is clicked', async ({
    page,
  }) => {
    await page.goto('/quiz/switch')
    const firstOption = page.getByRole('button').first()
    await firstOption.click()
    await expect(page.getByText(/question 2 of 4/i)).toBeVisible()
  })

  test('shows results with /part/switch/ links after answering all questions', async ({
    page,
  }) => {
    await page.goto('/quiz/switch')
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button').first().click()
      if (i < 3) {
        await expect(page.getByText(new RegExp(`question ${i + 2} of 4`, 'i'))).toBeVisible()
      }
    }
    await expect(page.getByTestId('quiz-results')).toBeVisible()
    const resultLinks = page.locator('[data-testid="result-card"] a')
    const count = await resultLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)
    const firstHref = await resultLinks.first().getAttribute('href')
    expect(firstHref).toMatch(/^\/part\/switch\//)
  })

  test('start-over button resets to question 1', async ({ page }) => {
    await page.goto('/quiz/switch')
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button').first().click()
    }
    await expect(page.getByTestId('quiz-results')).toBeVisible()
    await page.getByRole('button', { name: /start over/i }).click()
    await expect(page.getByText(/question 1 of 4/i)).toBeVisible()
  })

  test('includes WebApplication JSON-LD', async ({ page }) => {
    await page.goto('/quiz/switch')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebApplication"')
  })
})
