import { expect, test, type Page } from '@playwright/test'
import { getCanonicalUrls, type CanonicalUrl } from '../src/fixtures/canonical-urls'
import { pageReads, type PageAssertion } from '../src/fixtures/page-reads'
import { canonicalUrl } from '@thock/seo'

const URLS = getCanonicalUrls()

const collectConsoleErrors = (page: Page) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}

const runHtmlAssertion = async (
  page: Page,
  url: CanonicalUrl,
  a: PageAssertion,
): Promise<void> => {
  switch (a.kind) {
    case 'h1-present': {
      const count = await page.locator('h1').count()
      expect(count, `${url.path} should have an h1`).toBeGreaterThanOrEqual(1)
      return
    }
    case 'h1-matches': {
      const text = (await page.locator('h1').first().textContent()) ?? ''
      expect(text, `${url.path} h1 text`).toMatch(a.pattern)
      return
    }
    case 'has-canonical-link': {
      const expected = canonicalUrl(url.path)
      const href = await page
        .locator('link[rel="canonical"]')
        .first()
        .getAttribute('href')
      expect(href, `${url.path} canonical href`).toBe(expected)
      return
    }
    case 'has-jsonld': {
      const count = await page
        .locator('script[type="application/ld+json"]')
        .count()
      expect(count, `${url.path} should have JSON-LD`).toBeGreaterThanOrEqual(1)
      return
    }
    case 'min-link-count': {
      const count = await page.locator(a.selector).count()
      expect(count, `${url.path} ${a.selector} count`).toBeGreaterThanOrEqual(
        a.min,
      )
      return
    }
    case 'body-contains': {
      const body = await page.content()
      expect(body, `${url.path} body should contain ${a.needle}`).toContain(
        a.needle,
      )
      return
    }
    case 'response-content-type':
      // Handled in non-HTML branch.
      return
  }
}

const runNonHtmlAssertion = async (
  url: CanonicalUrl,
  body: string,
  contentType: string | null,
  a: PageAssertion,
): Promise<void> => {
  switch (a.kind) {
    case 'response-content-type':
      expect(contentType ?? '', `${url.path} content-type`).toMatch(a.matcher)
      return
    case 'body-contains':
      expect(body, `${url.path} body should contain ${a.needle}`).toContain(
        a.needle,
      )
      return
    default:
      return
  }
}

test.describe('canonical URL walker — desktop', () => {
  for (const url of URLS) {
    test(`200 + contract: ${url.path}`, async ({ page, request }) => {
      const reads = pageReads[url.pattern]
      if (!reads) throw new Error(`no page-reads entry for ${url.pattern}`)

      if (reads.isHtml) {
        const errors = collectConsoleErrors(page)
        const response = await page.goto(url.path)
        expect(response, `${url.path} response`).not.toBeNull()
        expect(response!.status(), `${url.path} status`).toBe(200)

        for (const a of reads.assertions) {
          await runHtmlAssertion(page, url, a)
        }

        expect(
          errors,
          `${url.path} console errors: ${errors.join(' | ')}`,
        ).toEqual([])
      } else {
        const response = await request.get(url.path)
        expect(response.status(), `${url.path} status`).toBe(200)
        const body = await response.text()
        const ct = response.headers()['content-type'] ?? null
        for (const a of reads.assertions) {
          await runNonHtmlAssertion(url, body, ct, a)
        }
      }
    })
  }
})

test('404 routes render not-found pages', async ({ page }) => {
  const article = await page.goto('/article/this-slug-does-not-exist')
  expect(article?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /doesn.{1,3}t exist/i,
  )

  const tag = await page.goto('/tag/nope')
  expect(tag?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    /no tag with that name/i,
  )
})
