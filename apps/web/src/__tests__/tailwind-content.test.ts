import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Regression guard for the silent-purge bug investigated 2026-05-14:
 *
 * Tailwind's content array determines which source files Tailwind
 * scans for utility class usage. Any utility class used ONLY in a
 * source file not covered by the array is purged from the compiled
 * stylesheet — the className is present on the rendered DOM, but the
 * CSS rule does not exist, so `getComputedStyle(...).marginTop` etc.
 * return 0. This is silent: no warning, no build error, no broken
 * DOM, just missing visual rules.
 *
 * The bug surfaced as a Callout aside headbutting an H2 below it.
 * Two prior "spacing fixes" (Callout my-6 → my-8, SerifH2 mt-16 →
 * mt-20) never actually shipped to the compiled CSS because both
 * components live in @thock/content and the content array did not
 * include packages/content/src/.
 *
 * This test asserts every workspace package that renders JSX (and
 * therefore uses Tailwind utilities) is covered. If a new workspace
 * package starts rendering JSX, add it to BOTH places: tailwind.config.ts
 * AND the array below.
 */
describe('tailwind.config — content array coverage', () => {
  const cfg = readFileSync(
    resolve(__dirname, '../../tailwind.config.ts'),
    'utf8',
  )

  const REQUIRED_CONTENT_GLOBS = [
    './src/**/*.{ts,tsx,mdx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/content/src/**/*.{ts,tsx}',
  ]

  for (const glob of REQUIRED_CONTENT_GLOBS) {
    it(`covers ${glob}`, () => {
      expect(cfg).toContain(glob)
    })
  }

  it('uses an array literal for content (not a string), so each entry can be diffed', () => {
    expect(cfg).toMatch(/content:\s*\[/)
  })
})
