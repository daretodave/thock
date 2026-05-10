import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const publicDir = resolve(here, '../../public')

/**
 * Phase 23 regression guard. Prevent re-shipping SVG files with
 * comments that violate the XML rule "no double-hyphen inside a
 * comment" (e.g. `<!-- ---------------- Row 1 ---------------- -->`).
 *
 * Browsers serve such files happily, but XML parsers — including
 * the one Chrome / Firefox / Safari use to render `<svg>` images
 * referenced via `<img src>` — reject them with
 * "Double hyphen within comment". The result is a broken-image
 * icon on the page (user-spotted on /article/gmk-cyl-prussian-alert
 * + 3 of the 6 group-buy heroes from the phase 23 backfill).
 *
 * We walk the static asset trees that ship loop-generated SVGs
 * (currently `hero-art/` for articles and `group-buy-art/` for
 * group buys) and validate each comment block. Add new directories
 * here when the loop starts emitting SVGs to them.
 */

const SVG_DIRS = ['hero-art', 'group-buy-art'] as const

function listSvgFiles(): string[] {
  const out: string[] = []
  for (const sub of SVG_DIRS) {
    const dir = join(publicDir, sub)
    let entries: string[]
    try {
      const stat = statSync(dir)
      if (!stat.isDirectory()) continue
      entries = readdirSync(dir)
    } catch {
      continue
    }
    for (const entry of entries) {
      if (!entry.endsWith('.svg')) continue
      out.push(join(dir, entry))
    }
  }
  return out
}

/**
 * Find any HTML/XML comment block in the source whose interior
 * (the text between `<!--` and `-->`) contains `--`. Returns the
 * offending comment text on first match, or `null` if clean.
 *
 * Implementation note: we do this at the string level instead of
 * leaning on a DOMParser because the test must be deterministic
 * and parser-implementation-independent. The XML spec rule is
 * strict and cheap to verify by hand.
 */
function findIllegalDoubleHyphen(source: string): string | null {
  // Non-greedy, multiline-aware match on the content between the
  // open and close markers.
  const re = /<!--([\s\S]*?)-->/g
  let match: RegExpExecArray | null
  while ((match = re.exec(source))) {
    const inner = match[1] ?? ''
    if (inner.includes('--')) return match[0]
  }
  return null
}

describe('SVG validity gate', () => {
  it('walks the loop-generated SVG directories and finds at least one file', () => {
    const files = listSvgFiles()
    expect(
      files.length,
      `expected at least one SVG under ${SVG_DIRS.join(' / ')}`,
    ).toBeGreaterThan(0)
  })

  it('every SVG in public/ has comment blocks that satisfy XML well-formedness (no `--` inside a comment)', () => {
    const files = listSvgFiles()
    const offenders: Array<{ file: string; preview: string }> = []
    for (const file of files) {
      const source = readFileSync(file, 'utf-8')
      const bad = findIllegalDoubleHyphen(source)
      if (bad !== null) {
        offenders.push({
          file: relative(publicDir, file),
          preview:
            bad.length > 120 ? bad.slice(0, 117).replace(/\n/g, ' ') + '…' : bad,
        })
      }
    }
    expect(
      offenders,
      `XML-invalid SVGs found (browsers reject these as broken images via 'Double hyphen within comment'):\n${offenders
        .map((o) => `  ${o.file}\n    ${o.preview}`)
        .join('\n')}`,
    ).toEqual([])
  })
})
