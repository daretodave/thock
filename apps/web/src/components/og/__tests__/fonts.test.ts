import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { OG_FONT_MANIFEST } from '../fonts'

const fontsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'fonts')

describe('OG_FONT_MANIFEST', () => {
  it('covers exactly the serif/mono weight+style combinations PillarOG/ArticleOG use', () => {
    const triples = OG_FONT_MANIFEST.map((f) => `${f.name}/${f.weight}/${f.style}`).sort()
    expect(triples).toEqual(
      [
        'serif/400/normal',
        'serif/500/normal',
        'serif/400/italic',
        'serif/500/italic',
        'monospace/400/normal',
      ].sort(),
    )
  })

  it('has no duplicate name+weight+style triples', () => {
    const triples = OG_FONT_MANIFEST.map((f) => `${f.name}/${f.weight}/${f.style}`)
    expect(new Set(triples).size).toBe(triples.length)
  })

  it('every listed filename exists on disk as a real WOFF binary', () => {
    for (const entry of OG_FONT_MANIFEST) {
      const path = join(fontsDir, entry.filename)
      expect(existsSync(path), `${entry.filename} should exist under components/og/fonts/`).toBe(
        true,
      )
      const buf = readFileSync(path)
      expect(buf.byteLength, `${entry.filename} should be a real font file`).toBeGreaterThan(1000)
      // WOFF magic bytes: 'wOFF'
      expect(buf.subarray(0, 4).toString('ascii'), `${entry.filename} WOFF signature`).toBe(
        'wOFF',
      )
    }
  })
})
