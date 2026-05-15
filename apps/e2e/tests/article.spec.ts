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

  test('og:image is a non-empty PNG (no SVG, no 0-byte cached miss)', async ({
    page,
    request,
  }) => {
    // Regression guard for the 2026-05-14 fix: previously articles
    // emitted `og:image` pointing at the hero-art SVG, which every
    // major social platform (Twitter, Facebook, LinkedIn, Slack,
    // Discord) rejects as a card image. The home OG was authored
    // in `oklch()` color which Satori cannot parse, so Vercel cached
    // a 0-byte PNG with a 1-year immutable header. Both surfaces
    // need the og:image to be (a) a PNG content-type meta and (b)
    // actually return PNG bytes.
    for (const path of [SEED, '/article/switch-films-worth-it', '/']) {
      await page.goto(path)
      const ogType = await page
        .locator('meta[property="og:image:type"]')
        .first()
        .getAttribute('content')
      expect(ogType, `${path}: og:image:type`).toBe('image/png')
      const ogHref = await page
        .locator('meta[property="og:image"]')
        .first()
        .getAttribute('content')
      expect(ogHref, `${path}: og:image href`).toBeTruthy()
      // The canonical URL points at thock.xyz; in e2e the same path
      // lives on the local baseURL. Rewrite to the same-origin
      // pathname so request.get() resolves to the e2e server.
      const url = new URL(ogHref!)
      const localPath = url.pathname + url.search
      const res = await request.get(localPath)
      expect(res.status(), `${path}: og:image fetch`).toBe(200)
      expect(
        res.headers()['content-type'],
        `${path}: og:image content-type`,
      ).toMatch(/image\/png/)
      const body = await res.body()
      expect(
        body.length,
        `${path}: og:image body bytes (was 0 with cached oklch crash)`,
      ).toBeGreaterThan(1000)
      // PNG magic bytes — confirms Satori produced a real image,
      // not an HTML error page served with a fake content-type.
      expect(body[0]).toBe(0x89)
      expect(body[1]).toBe(0x50)
      expect(body[2]).toBe(0x4e)
      expect(body[3]).toBe(0x47)
    }
  })

  test('GFM markdown tables render in articles that have them', async ({
    page,
  }) => {
    // Regression guard for the 2026-05-14 fix: MDXRemote was wired
    // without remark-gfm, so the `| Switch type | ... |` block in
    // /article/switch-films-worth-it stayed as literal pipe text in
    // the article body. Same bug across all four articles below.
    // Fix: pass `mdxOptions.remarkPlugins: [remarkGfm]` and add
    // styled `table`/`thead`/`tr`/`th`/`td` to mdxComponents.
    const slugs = [
      '/article/switch-films-worth-it',
      '/article/pe-foam-mod',
      '/article/stabilizer-servicing-guide',
      '/article/tape-mod',
    ]
    for (const slug of slugs) {
      await page.goto(slug)
      const body = page.getByTestId('article-body')
      const tables = body.locator('table')
      expect(
        await tables.count(),
        `${slug} should render at least one MDX table`,
      ).toBeGreaterThanOrEqual(1)
      // First header cell must be a real <th scope="col"> to confirm
      // the styled mdxComponents.th picked it up rather than a
      // browser-default rendering.
      const firstTh = tables.first().locator('th').first()
      await expect(firstTh).toBeVisible()
      const scope = await firstTh.getAttribute('scope')
      expect(scope, `${slug}: first th scope`).toBe('col')
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
