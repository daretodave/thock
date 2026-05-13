import { expect, test } from '@playwright/test'

// One real seed slug — chosen because it referenced parts in the
// frontmatter, exercising the MentionedPartsRail in phase 5.
const SEED = '/article/gateron-oil-king-deep-dive'

test.describe('article page family — canonical template', () => {
  test('renders hero + byline + body + tag chips', async ({ page }) => {
    await page.goto(SEED)

    await expect(page.getByTestId('article-hero')).toBeVisible()
    await expect(page.getByTestId('article-byline')).toBeVisible()
    await expect(page.getByTestId('article-body')).toBeVisible()

    const chips = page.getByTestId('tag-chip')
    expect(await chips.count()).toBeGreaterThanOrEqual(1)
  })

  test('eyebrow links to the pillar landing', async ({ page }) => {
    await page.goto(SEED)
    const eyebrow = page.getByTestId('article-hero-eyebrow').locator('a')
    await expect(eyebrow).toHaveAttribute('href', /^\/(news|trends|ideas|deep-dives|guides)$/)
  })

  test('renders an Article JSON-LD graph', async ({ page }) => {
    await page.goto(SEED)
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents()
    expect(scripts.length).toBeGreaterThanOrEqual(1)
    const matched = scripts.some((s) => s.includes('"@type":"Article"'))
    expect(matched).toBe(true)
  })

  test('mentioned-parts rail renders for an article with parts', async ({ page }) => {
    await page.goto(SEED)
    await expect(page.getByTestId('mentioned-parts-rail')).toBeVisible()
  })

  test('canonical link tag matches the URL', async ({ page }) => {
    await page.goto(SEED)
    const href = await page
      .locator('link[rel="canonical"]')
      .first()
      .getAttribute('href')
    expect(href).toMatch(new RegExp(`${SEED}$`))
  })

  test('body paragraphs have non-zero bottom margin (prose styles applied)', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md HIGH "wall-of-text" finding.
    // Without .thock-prose styles, Tailwind preflight resets `p { margin: 0 }`
    // and adjacent paragraphs collapse into one visual block. We only need to
    // assert one paragraph has a real bottom margin — the same rule covers
    // every <p> inside .thock-prose.
    await page.goto('/article/trends-tracker-preview')
    const body = page.getByTestId('article-body')
    const firstP = body.locator('p').first()
    const margin = await firstP.evaluate(
      (el) => window.getComputedStyle(el).marginBottom,
    )
    const px = parseFloat(margin)
    expect(px).toBeGreaterThan(8)
  })

  test('inline <Mono> tokens render inside their surrounding paragraph', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md HIGH "inline Mono renders as
    // block siblings". The Mono tokens listing the five categories must
    // sit inside a single <p> with the running prose, not as sibling
    // block elements.
    await page.goto('/article/trends-tracker-preview')
    const para = page
      .locator('p', {
        hasText: 'Every row on the tracker belongs to one of five categories',
      })
      .first()
    await expect(para).toContainText('switches')
    await expect(para).toContainText('keycaps')
    await expect(para).toContainText('layouts')
    await expect(para).toContainText('vendors')
    await expect(para).toContainText('brands')
    const monoCount = await para.locator('span.font-mono').count()
    expect(monoCount).toBeGreaterThanOrEqual(5)
  })

  test('PartReference resolves and does NOT leak the [unknown part:...] fallback', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md HIGH "[unknown part:oil-king]
    // placeholder leaks". When ArticleBody fails to bind resolved parts
    // into the per-article mdxComponents map, every <PartReference id />
    // falls through to the literal "[unknown part:<id>]" string. Two
    // seed articles use this token in their opening paragraphs.
    for (const path of [
      '/article/gateron-oil-king-deep-dive',
      '/article/beginners-switch-buying-guide',
    ]) {
      await page.goto(path)
      const body = await page.getByTestId('article-body').textContent()
      expect(
        body,
        `${path} body must not contain "[unknown part:"`,
      ).not.toMatch(/\[unknown part:/)
      // The resolved part record name renders as a Mono token in body
      // prose. The Oil King appears in both seed articles.
      expect(body, `${path} body should mention the part by name`).toMatch(
        /Oil King/i,
      )
    }
  })

  test('Callout aside titles render as h2 headings (a11y, WCAG 1.3.1)', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md pass 8 "[MED]
    // /article/keychron-q-ultra-zmk (and likely all `<aside>` callouts)
    // — aside title renders as a generic, not a heading". Pre-fix, the
    // Callout title rendered inside a <div> so screen-reader users
    // navigating by heading skipped past every callout. Promoted to
    // an h2 inside <aside> so heading-nav lands on the title.
    // h2 (not h3) avoids a h1 → h3 skip on articles whose first
    // Callout sits between the article hero h1 and the first `##`.
    const slugs = [
      '/article/keychron-q-ultra-zmk',
      '/article/beginners-switch-buying-guide',
    ]
    for (const slug of slugs) {
      await page.goto(slug)
      const calloutHeading = page
        .locator('aside[role="note"] > h2')
        .first()
      await expect(
        calloutHeading,
        `${slug}: aside heading must exist`,
      ).toBeVisible()
      const text = (await calloutHeading.textContent())?.trim() ?? ''
      expect(text.length, `${slug}: aside heading must have text`).toBeGreaterThan(0)
      // Verify no heading-skip when walking the whole document.
      const levels = await page
        .locator('h1, h2, h3, h4, h5, h6')
        .evaluateAll((els) =>
          els.map((el) => Number(el.tagName.slice(1))),
        )
      expect(levels.length).toBeGreaterThan(0)
      expect(levels[0]).toBe(1)
      for (let i = 1; i < levels.length; i++) {
        const prev = levels[i - 1] ?? 1
        const curr = levels[i] ?? 1
        if (curr > prev) {
          expect(
            curr - prev,
            `${slug}: heading skip at index ${i}: h${prev} → h${curr}`,
          ).toBeLessThanOrEqual(1)
        }
      }
    }
  })

  test('document <title> applies the "— thock" suffix exactly once', async ({
    page,
  }) => {
    // Regression guard for plan/CRITIQUE.md MED "every page <title>
    // duplicates the site name". buildMetadata used to suffix here,
    // and the layout's title.template applied the suffix again →
    // "<headline> — thock — thock". The fix returns the raw title
    // and lets the template apply once.
    for (const path of [
      '/',
      '/news',
      SEED,
      '/trends/tracker',
      '/tag/linear',
    ]) {
      await page.goto(path)
      const title = await page.title()
      const matches = title.match(/— thock/g) ?? []
      expect(matches.length, `${path}: <title>="${title}"`).toBe(1)
    }
  })
})
