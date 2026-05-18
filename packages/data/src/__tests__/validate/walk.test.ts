import { afterEach, describe, expect, it } from 'vitest'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { walkAll, type EntityKind } from '../../validate/walk'
import { setRepoRootForTests } from '../../loaders/paths'

const ALL_KINDS: EntityKind[] = [
  'vendors',
  'switches',
  'keycap-sets',
  'boards',
  'group-buys',
  'trends',
]

describe('walkAll', () => {
  afterEach(() => setRepoRootForTests(null))

  it('returns no failures for the real data directory', () => {
    const { failures } = walkAll()
    expect(failures).toHaveLength(0)
  })

  it('returns parsed records from all 6 entity kinds', () => {
    const { parsed } = walkAll()
    const kinds = new Set(parsed.map((r) => r.kind))
    for (const kind of ALL_KINDS) {
      expect(kinds.has(kind)).toBe(true)
    }
  })

  it('each ParsedRecord has kind, file, baseName, and data properties', () => {
    const { parsed } = walkAll()
    expect(parsed.length).toBeGreaterThan(0)
    const rec = parsed[0]!
    expect(rec).toHaveProperty('kind')
    expect(rec).toHaveProperty('file')
    expect(rec).toHaveProperty('baseName')
    expect(rec).toHaveProperty('data')
    expect(typeof rec.file).toBe('string')
    expect(typeof rec.baseName).toBe('string')
    expect(rec.file).toContain(rec.baseName)
  })

  it('captures a JSON parse error as a ParseFailure', () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'thock-walk-test-'))
    mkdirSync(join(tmpRoot, 'data', 'switches'), { recursive: true })
    writeFileSync(join(tmpRoot, 'data', 'switches', 'bad-switch.json'), 'NOT_VALID_JSON')
    setRepoRootForTests(tmpRoot)
    try {
      const { parsed, failures } = walkAll()
      expect(failures).toHaveLength(1)
      expect(failures[0]!.kind).toBe('switches')
      expect(failures[0]!.message).toMatch(/failed to parse JSON/)
      expect(parsed).toHaveLength(0)
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
    }
  })

  it('captures a schema validation error as a ParseFailure', () => {
    const tmpRoot = mkdtempSync(join(tmpdir(), 'thock-walk-test-'))
    mkdirSync(join(tmpRoot, 'data', 'switches'), { recursive: true })
    writeFileSync(
      join(tmpRoot, 'data', 'switches', 'schema-invalid.json'),
      JSON.stringify({ slug: 'schema-invalid', notAValidSwitch: true }),
    )
    setRepoRootForTests(tmpRoot)
    try {
      const { parsed, failures } = walkAll()
      expect(failures.length).toBeGreaterThanOrEqual(1)
      expect(failures[0]!.kind).toBe('switches')
      expect(parsed).toHaveLength(0)
    } finally {
      rmSync(tmpRoot, { recursive: true, force: true })
    }
  })
})
