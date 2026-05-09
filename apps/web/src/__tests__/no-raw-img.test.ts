import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(here, '..')

const RAW_IMG = /<img\b/
const FILE_EXTS = new Set(['.tsx', '.jsx', '.mdx'])

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (entry === '__tests__' || entry === 'node_modules' || entry === '.next')
        continue
      walk(full, out)
    } else if (stat.isFile()) {
      const dotIdx = entry.lastIndexOf('.')
      if (dotIdx < 0) continue
      const ext = entry.slice(dotIdx)
      if (FILE_EXTS.has(ext)) out.push(full)
    }
  }
  return out
}

describe('image discipline gate', () => {
  it('no raw <img> tag survives outside __tests__/', () => {
    const files = walk(srcDir)

    const offenders: Array<{ file: string; line: number; preview: string }> = []
    for (const file of files) {
      const lines = readFileSync(file, 'utf-8').split(/\r?\n/)
      lines.forEach((text, idx) => {
        if (RAW_IMG.test(text)) {
          offenders.push({
            file: relative(srcDir, file),
            line: idx + 1,
            preview: text.trim(),
          })
        }
      })
    }

    expect(offenders, formatOffenders(offenders)).toEqual([])
  })
})

function formatOffenders(
  rows: Array<{ file: string; line: number; preview: string }>,
): string {
  if (rows.length === 0) return ''
  const header =
    '\nphase 17 — image discipline gate. Raw <img> tags must be replaced with next/image:\n'
  const body = rows
    .map((r) => `  ${r.file}:${r.line}  ${r.preview.slice(0, 90)}`)
    .join('\n')
  return header + body
}
