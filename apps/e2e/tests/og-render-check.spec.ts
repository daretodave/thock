import { existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { expect, test } from '@playwright/test'
import { getCanonicalUrls } from '../src/fixtures/canonical-urls'

// Renders every opengraph-image.tsx handler through the real
// Satori/next/og pipeline (via the hermetic e2e production server) and
// decodes the resulting PNG, so a silent 0-byte or near-blank OG image
// never again ships past the verify gate undetected. See
// plan/08-og-render-verification-gate.md.

/**
 * Walk up from cwd to find the workspace root. Deliberately avoids
 * `import.meta.url` here — Playwright's CJS test transformer rejects it
 * (see the same note in apps/e2e/src/fixtures/canonical-urls.ts).
 */
function findRepoRoot(): string {
  let dir = process.cwd()
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    `[og-render-check] could not find pnpm-workspace.yaml from ${process.cwd()}`,
  )
}

const APP_DIR = resolve(findRepoRoot(), 'apps/web/src/app')

// Route patterns whose opengraph-image.tsx uses `generateImageMetadata`
// (confirmed via `grep -rl generateImageMetadata apps/web/src/app`) and
// therefore serve the PNG at `<path>/opengraph-image/og` (id `'og'`)
// rather than `<path>/opengraph-image` directly. Confirmed shape: see
// apps/e2e/tests/newsletter.spec.ts's JSON-LD image-URL assertion, which
// asserts `.../opengraph-image/og`. This set is not expected to churn
// independent of a review of this file.
const GENERATE_IMAGE_METADATA_PATTERNS = new Set([
  '/article/[slug]',
  '/vendor/[slug]',
  '/tag/[slug]',
  '/newsletter/[slug]',
  '/part/[kind]',
  '/part/[kind]/[slug]',
  '/trends/tracker/[week]',
])

/**
 * Map a canonical route `pattern` (e.g. "/article/[slug]", "/", "/part/[kind]")
 * onto its source directory under apps/web/src/app. Next's App Router
 * directory names already use the same `[param]` bracket syntax as
 * `pattern`, so this is a straight path join — no re-derivation of a
 * second route list (A4). Cross-references
 * scripts/og-coverage-check.mjs's own directory walk/exclusion logic
 * (EXCLUDED_SEGMENTS = api, _components, _lib, _hooks) — this file does
 * not walk the filesystem to enumerate routes (canonical-urls.ts already
 * gives us the full route list), it only needs to check, per
 * already-known route, whether an opengraph-image.tsx exists at the
 * matching directory. The exclusion set does not come into play here
 * because canonical-urls.ts never emits a pattern under an excluded
 * segment.
 */
function patternToAppDir(pattern: string): string {
  const segments = pattern.split('/').filter(Boolean)
  return segments.length === 0 ? APP_DIR : join(APP_DIR, ...segments)
}

function resolveOgUrl(pattern: string, path: string): string {
  // Avoid a doubled leading slash for the root route ("/" + "/opengraph-image"
  // would be "//opengraph-image", which the URL parser treats as
  // protocol-relative and resolves "opengraph-image" as a host, not a path).
  const base = path === '/' ? '' : path
  return GENERATE_IMAGE_METADATA_PATTERNS.has(pattern)
    ? `${base}/opengraph-image/og`
    : `${base}/opengraph-image`
}

const PNG_SIGNATURE_AND_IHDR_HEADER_BYTES = 16 // 8-byte PNG signature + 8-byte IHDR chunk header (4-byte length + 4-byte type "IHDR")

// Byte-size floor: determined empirically by running this spec once
// locally (desktop project, 2026-11-10) with a temporary
// `console.log(buffer.length)` per route, across all 328 covered
// routes at the time. Observed range: smallest was /tag/via at
// 46,161 bytes (sparse tag card), largest was
// /article/gsk-sweet-nightmare-group-buy at 112,130 bytes (dense
// article card). A degenerate flat-fill PNG (the historical oklch
// 0-byte / near-blank failure shape) compresses to a few hundred
// bytes at most. 20,000 bytes sits comfortably below every observed
// value (smallest observed is more than 2x this floor) and well
// above a flat-fill degenerate PNG — a future tightening pass can
// raise this once more routes are observed.
const MIN_PNG_BYTES = 20_000

const routes = getCanonicalUrls().filter((u) => u.kind === 'html')

for (const route of routes) {
  const appDir = patternToAppDir(route.pattern)
  const hasOgHandler = existsSync(join(appDir, 'opengraph-image.tsx'))
  if (!hasOgHandler) continue

  const ogUrl = resolveOgUrl(route.pattern, route.path)

  test(`OG image for ${route.path} is a real 1200x630 PNG`, async ({
    request,
  }) => {
    const response = await request.get(ogUrl)
    expect(response.status(), `${ogUrl} status`).toBe(200)

    const contentType = response.headers()['content-type']
    expect(contentType, `${ogUrl} content-type`).toBe('image/png')

    const buffer = await response.body()

    expect(
      buffer.length,
      `${ogUrl} byte length should clear the degenerate-PNG floor`,
    ).toBeGreaterThan(MIN_PNG_BYTES)

    const width = buffer.readUInt32BE(PNG_SIGNATURE_AND_IHDR_HEADER_BYTES)
    const height = buffer.readUInt32BE(PNG_SIGNATURE_AND_IHDR_HEADER_BYTES + 4)
    expect(width, `${ogUrl} IHDR width`).toBe(1200)
    expect(height, `${ogUrl} IHDR height`).toBe(630)
  })
}
