import { expect, test } from '@playwright/test'
import { getCanonicalUrls } from '../../src/fixtures/canonical-urls'

const HTML_URLS = getCanonicalUrls().filter((u) => u.kind === 'html')

test.describe('canonical URL walker — mobile (375px)', () => {
  for (const url of HTML_URLS) {
    test(`no horizontal scroll: ${url.path}`, async ({ page }) => {
      const response = await page.goto(url.path)
      expect(response, `${url.path} response`).not.toBeNull()
      expect(response!.status()).toBe(200)

      const overflow = await page.evaluate(() => {
        const root = document.documentElement
        return root.scrollWidth - root.clientWidth
      })
      expect(
        overflow,
        `${url.path} should not scroll horizontally at 375px (overflow=${overflow}px)`,
      ).toBeLessThanOrEqual(1)
    })
  }
})
