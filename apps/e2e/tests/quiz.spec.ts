import { expect, test } from '@playwright/test'

test.describe('/quiz/keycap-set — phase 47', () => {
  test('renders H1 and first question on load', async ({ page }) => {
    await page.goto('/quiz/keycap-set')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      /find your keycap set/i,
    )
    await expect(page.getByRole('heading', { level: 2 })).toContainText(
      /profile height/i,
    )
  })

  test('shows "Question 1 of 4" progress indicator', async ({ page }) => {
    await page.goto('/quiz/keycap-set')
    await expect(page.getByText(/question 1 of 4/i)).toBeVisible()
  })

  test('advances to next question when an option is clicked', async ({
    page,
  }) => {
    await page.goto('/quiz/keycap-set')
    const firstOption = page.getByRole('button').first()
    await firstOption.click()
    await expect(page.getByText(/question 2 of 4/i)).toBeVisible()
  })

  test('shows results with /part/keycap-set/ links and browse-all affordance after answering all questions', async ({
    page,
  }) => {
    await page.goto('/quiz/keycap-set')
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button').first().click()
      if (i < 3) {
        await expect(page.getByText(new RegExp(`question ${i + 2} of 4`, 'i'))).toBeVisible()
      }
    }
    await expect(page.getByTestId('keycap-quiz-results')).toBeVisible()
    const resultLinks = page.locator('[data-testid="keycap-result-card"] a')
    const count = await resultLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)
    const firstHref = await resultLinks.first().getAttribute('href')
    expect(firstHref).toMatch(/^\/part\/keycap-set\//)
    const browseAllLink = page.getByTestId('keycap-quiz-browse-all-link')
    await expect(browseAllLink).toBeVisible()
    await expect(browseAllLink).toHaveAttribute('href', '/part/keycap-set')
  })

  test('start-over button resets to question 1', async ({ page }) => {
    await page.goto('/quiz/keycap-set')
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button').first().click()
      if (i < 3) {
        await expect(page.getByText(new RegExp(`question ${i + 2} of 4`, 'i'))).toBeVisible()
      }
    }
    await expect(page.getByTestId('keycap-quiz-results')).toBeVisible()
    await page.getByRole('button', { name: /start over/i }).click()
    await expect(page.getByText(/question 1 of 4/i)).toBeVisible()
  })

  test('includes WebApplication and BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/quiz/keycap-set')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebApplication"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
    expect(flat).toContain('"name":"Find your keycap set"')
  })
})

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

  test('shows results with /part/switch/ links and browse-all affordance after answering all questions', async ({
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
    const browseAllLink = page.getByTestId('quiz-browse-all-link')
    await expect(browseAllLink).toBeVisible()
    await expect(browseAllLink).toHaveAttribute('href', '/part/switch')
  })

  test('start-over button resets to question 1', async ({ page }) => {
    await page.goto('/quiz/switch')
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button').first().click()
      if (i < 3) {
        await expect(page.getByText(new RegExp(`question ${i + 2} of 4`, 'i'))).toBeVisible()
      }
    }
    await expect(page.getByTestId('quiz-results')).toBeVisible()
    await page.getByRole('button', { name: /start over/i }).click()
    await expect(page.getByText(/question 1 of 4/i)).toBeVisible()
  })

  test('includes WebApplication and BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto('/quiz/switch')
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    const flat = scripts.join('\n')
    expect(flat).toContain('"@type":"WebApplication"')
    expect(flat).toContain('"@type":"BreadcrumbList"')
    expect(flat).toContain('"name":"Find your switch"')
  })
})
