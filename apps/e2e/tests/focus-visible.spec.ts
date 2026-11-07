/**
 * Chunk 05.2 — Tab-walk e2e coverage check (closes acceptance A2 of
 * plan/05-focus-visible-default.md).
 *
 * Tabs through a representative set of routes and asserts every focus
 * stop has a visible keyboard-focus indicator (outline or box-shadow)
 * with at least 3:1 contrast against its background — the mechanical
 * check that's meant to end the "found another missing focus ring"
 * one-component-at-a-time repair cycle described in the spec's Why.
 *
 * Iteration is bounded (TAB_COUNT), not "until it wraps" — this is a
 * coverage sample of the start of each page's tab order, not an
 * exhaustive walk.
 */
import { test, expect, type Page } from '@playwright/test'

const TAB_COUNT = 20

const ROUTES: { label: string; path: string }[] = [
  { label: 'home', path: '/' },
  { label: 'article', path: '/article/gateron-oil-king-deep-dive' },
  { label: 'pillar (guides)', path: '/guides' },
  { label: 'tag', path: '/tag/linear' },
  { label: 'part', path: '/part/switch/gateron-oil-king' },
  {
    label: 'compare',
    path: '/compare/switch?a=akko-v3-cream-blue-pro&b=c3-tangerine-r2',
  },
  { label: 'quiz', path: '/quiz/switch' },
  { label: 'group-buys', path: '/group-buys' },
  { label: 'search', path: '/search' },
]

type Rgb = { r: number; g: number; b: number }

type TabStop =
  | { noFocusable: true }
  | {
      noFocusable: false
      tag: string
      testId: string | null
      hasIndicator: boolean
      ring: Rgb | null
      bg: Rgb
    }

/*
 * Ported from packages/tokens/__tests__/contrast.test.ts's luminance()/
 * contrast() — same WCAG relative-luminance formula and contrast-ratio
 * math — adapted to take resolved sRGB byte triples instead of raw CSS
 * color strings.
 *
 * Why not parse the CSS strings directly here, the way contrast.test.ts
 * parses #hex/oklch()? Empirically (verified against this repo's actual
 * Playwright/Chromium build before writing this), `getComputedStyle()`
 * on an element styled via an oklch() token does NOT serialize back to
 * rgb() — it comes back as lab() or oklab(), depending on the property.
 * Hand-rolling parsers for every CSS Color 4 color function the browser
 * might choose to emit is exactly the kind of re-derivation the chunk
 * brief asked to avoid. Instead, each extracted color token is
 * round-tripped through a 1x1 <canvas> (see resolveToRgb in
 * collectTabStop below) — canvas.fillStyle/getImageData normalizes any
 * valid CSS color syntax (hex, rgb, hsl, lab, oklab, oklch, ...) to
 * concrete sRGB bytes without a bespoke parser per color space — and
 * this ported math runs on that normalized byte triple.
 */
function luminance({ r, g, b }: Rgb): number {
  const chan = (v: number) => {
    const s = v / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Reads the currently-focused element's visual focus indicator and the
 * background it sits against, entirely inside the browser (colors are
 * resolved to sRGB bytes via canvas before crossing back to Node).
 */
async function collectTabStop(page: Page): Promise<TabStop> {
  return page.evaluate(() => {
    function resolveToRgb(colorStr: string): { r: number; g: number; b: number } {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = colorStr
      ctx.fillRect(0, 0, 1, 1)
      const d = ctx.getImageData(0, 0, 1, 1).data
      return { r: d[0]!, g: d[1]!, b: d[2]! }
    }

    // Splits a `box-shadow` computed-style value on its top-level commas
    // (i.e. not commas nested inside a color function's parens).
    function splitTopLevel(value: string): string[] {
      const parts: string[] = []
      let depth = 0
      let current = ''
      for (const ch of value) {
        if (ch === '(') depth++
        if (ch === ')') depth--
        if (ch === ',' && depth === 0) {
          parts.push(current.trim())
          current = ''
        } else {
          current += ch
        }
      }
      if (current.trim()) parts.push(current.trim())
      return parts
    }

    function extractColorToken(layer: string): string | null {
      const m = layer.match(
        /^(rgba?\([^)]*\)|hsla?\([^)]*\)|lab\([^)]*\)|oklab\([^)]*\)|oklch\([^)]*\)|lch\([^)]*\)|color\([^)]*\)|#[0-9a-fA-F]{3,8}|[a-zA-Z]+)/,
      )
      return m ? m[1]! : null
    }

    function isTransparentToken(token: string): boolean {
      if (token === 'transparent') return true
      const rgba = token.match(
        /^rgba?\(\s*[\d.]+[,\s]+[\d.]+[,\s]+[\d.]+(?:[,\s/]+([\d.]+))?\s*\)$/i,
      )
      if (rgba && rgba[1] !== undefined && Number(rgba[1]) === 0) return true
      return false
    }

    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body || el === document.documentElement) {
      return { noFocusable: true }
    }
    // Next.js dev-mode overlay portal — not part of the rendered page,
    // never present in the production build this suite runs against,
    // but excluded defensively in case a local run uses `next dev`.
    if (el.tagName === 'NEXTJS-PORTAL') {
      return { noFocusable: true }
    }

    const cs = getComputedStyle(el)
    const hasOutline = cs.outlineStyle !== 'none' && cs.outlineWidth !== '0px'

    let ringColorToken: string | null = null
    if (hasOutline) {
      ringColorToken = cs.outlineColor
    } else if (cs.boxShadow && cs.boxShadow !== 'none') {
      // A single focus ring can render as more than one non-transparent
      // box-shadow layer — e.g. Tailwind's ring-offset pattern draws a
      // small-spread "gap" layer in the offset color, then the real ring
      // color at a larger spread. The outermost layer (largest spread
      // radius, the 4th length value) is the one a sighted user actually
      // perceives as "the ring", so pick that one rather than the first
      // non-transparent layer encountered.
      let bestSpread = -Infinity
      for (const rawLayer of splitTopLevel(cs.boxShadow)) {
        const layer = rawLayer.replace(/^inset\s+/, '')
        const token = extractColorToken(layer)
        if (!token || isTransparentToken(token)) continue
        const rest = layer.slice(token.length).trim()
        const nums = rest
          .split(/\s+/)
          .filter(Boolean)
          .map((n) => parseFloat(n))
        const spread = nums.length >= 4 ? nums[3]! : 0
        if (spread > bestSpread) {
          bestSpread = spread
          ringColorToken = token
        }
      }
    }

    // Background: walk up from the focused element (inclusive) to the
    // nearest ancestor with a non-transparent background-color; fall
    // back to <body>'s computed background if nothing opaque is found.
    let bgEl: Element | null = el
    let bgToken = 'rgba(0, 0, 0, 0)'
    while (bgEl) {
      const c = getComputedStyle(bgEl).backgroundColor
      if (c && !isTransparentToken(c)) {
        bgToken = c
        break
      }
      bgEl = bgEl.parentElement
    }
    if (isTransparentToken(bgToken)) {
      bgToken = getComputedStyle(document.body).backgroundColor
    }

    return {
      noFocusable: false,
      tag: el.tagName,
      testId: el.getAttribute('data-testid'),
      hasIndicator: ringColorToken !== null,
      ring: ringColorToken ? resolveToRgb(ringColorToken) : null,
      bg: resolveToRgb(bgToken),
    }
  })
}

async function walkTabsAndAssertFocusVisible(page: Page, path: string): Promise<void> {
  await page.goto(path)
  await page.waitForLoadState('networkidle')

  for (let i = 0; i < TAB_COUNT; i++) {
    await page.keyboard.press('Tab')
    const stop = await collectTabStop(page)

    if (stop.noFocusable) continue

    const where = `${path} tab stop #${i} (<${stop.tag.toLowerCase()}>${
      stop.testId ? ` data-testid="${stop.testId}"` : ''
    })`

    expect(stop.hasIndicator, `${where} has no visible outline or box-shadow`).toBe(true)

    const ratio = contrast(stop.ring!, stop.bg)
    expect(
      ratio,
      `${where} focus indicator contrast is ${ratio.toFixed(2)}:1 against its background — below the 3:1 floor`,
    ).toBeGreaterThanOrEqual(3)
  }
}

test.describe('focus-visible tab walk — desktop', () => {
  for (const { label, path } of ROUTES) {
    test(`${label} (${path})`, async ({ page }) => {
      await walkTabsAndAssertFocusVisible(page, path)
    })
  }
})

test.describe('focus-visible tab walk — mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  for (const { label, path } of ROUTES) {
    test(`${label} (${path}) — mobile`, async ({ page }) => {
      await walkTabsAndAssertFocusVisible(page, path)
    })
  }
})
