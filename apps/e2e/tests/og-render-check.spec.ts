import { existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { crc32, deflateSync } from 'node:zlib'
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

/**
 * The three checks a real OG PNG must pass, factored out of the per-route
 * loop below so the fixture-regression test (A3, further down this file)
 * can run the exact same logic against synthetic degenerate buffers —
 * proving these checks would have caught the historical oklch 0-byte
 * failure, not just asserting it inline a second time.
 *
 * `label` is purely for readable `expect()` failure messages (the route
 * URL for live checks, a fixture description for the synthetic checks);
 * it does not change what is asserted.
 */
function assertOgPng(
  buffer: Buffer,
  contentType: string | undefined,
  label = 'OG image',
): void {
  expect(contentType, `${label} content-type`).toBe('image/png')

  expect(
    buffer.length,
    `${label} byte length should clear the degenerate-PNG floor`,
  ).toBeGreaterThan(MIN_PNG_BYTES)

  const width = buffer.readUInt32BE(PNG_SIGNATURE_AND_IHDR_HEADER_BYTES)
  const height = buffer.readUInt32BE(PNG_SIGNATURE_AND_IHDR_HEADER_BYTES + 4)
  expect(width, `${label} IHDR width`).toBe(1200)
  expect(height, `${label} IHDR height`).toBe(630)
}

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
    const buffer = await response.body()

    assertOgPng(buffer, contentType, ogUrl)
  })
}

// --- Fixture regression guard (A3) -----------------------------------
//
// Proves assertOgPng() itself would reject the historical "0-byte oklch
// PNG" failure shape (and a near-blank/undersized variant of it), without
// needing a live broken route to reproduce it against. If a future change
// to assertOgPng ever weakened these checks (e.g. loosening the byte
// floor or dropping the IHDR dimension check), these tests fail even
// though every real route still renders a healthy card.

/**
 * Build one real PNG chunk (length + type + data + CRC-32), per the PNG
 * spec. CRC-32 is computed over the chunk type + data (not the length
 * prefix), using Node's built-in `zlib.crc32` — no extra dependency.
 */
function buildPngChunk(type: string, data: Buffer): Buffer {
  const typeBuffer = Buffer.from(type, 'ascii')
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0)
  return Buffer.concat([length, typeBuffer, data, crc])
}

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
])

/**
 * Synthesize a small, real, valid solid-fill PNG — signature + IHDR +
 * (deflated) IDAT + IEND — at the given dimensions. Used to mirror the
 * spec's "0-byte or near-blank oklch PNG" failure class: a buffer that
 * genuinely parses as a PNG (so the content-type/IHDR-shape checks are
 * meaningfully exercised) but is undersized and the wrong dimensions,
 * the way a flat degenerate render would be.
 */
function buildTinySolidFillPng(width: number, height: number): Buffer {
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 2 // color type: truecolor (RGB)
  ihdrData[10] = 0 // compression method
  ihdrData[11] = 0 // filter method
  ihdrData[12] = 0 // interlace method
  const ihdr = buildPngChunk('IHDR', ihdrData)

  const rowBytes = 1 + width * 3 // leading per-row filter-type byte + RGB triples
  const raw = Buffer.alloc(rowBytes * height, 0x80) // solid mid-grey fill
  for (let y = 0; y < height; y++) {
    raw[y * rowBytes] = 0 // filter type "None" for every row
  }
  const idat = buildPngChunk('IDAT', deflateSync(raw))
  const iend = buildPngChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([PNG_SIGNATURE, ihdr, idat, iend])
}

test('assertOgPng rejects a zero-length buffer (historical 0-byte oklch failure shape)', () => {
  const zeroByteBuffer = Buffer.alloc(0)

  expect(() =>
    assertOgPng(zeroByteBuffer, 'image/png', 'fixture: zero-byte PNG'),
  ).toThrow(/byte length/)
})

test('assertOgPng rejects a tiny, wrong-dimensioned solid-fill PNG under the byte floor', () => {
  const tinyPng = buildTinySolidFillPng(4, 4)

  // Sanity-check the fixture itself first: it must be a real, parseable
  // PNG that is genuinely undersized and the wrong dimensions, otherwise
  // the rejection below would not be proving anything about the
  // historical failure shape.
  expect(tinyPng.length).toBeGreaterThan(
    PNG_SIGNATURE_AND_IHDR_HEADER_BYTES + 8,
  )
  expect(tinyPng.length).toBeLessThan(MIN_PNG_BYTES)
  expect(tinyPng.readUInt32BE(PNG_SIGNATURE_AND_IHDR_HEADER_BYTES)).toBe(4)
  expect(tinyPng.readUInt32BE(PNG_SIGNATURE_AND_IHDR_HEADER_BYTES + 4)).toBe(
    4,
  )

  expect(() =>
    assertOgPng(tinyPng, 'image/png', 'fixture: tiny solid-fill PNG'),
  ).toThrow(/byte length/)
})
