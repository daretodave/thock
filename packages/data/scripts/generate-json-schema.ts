import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { findRepoRoot } from '../src/loaders/paths'
import { SwitchSchema } from '../src/schemas/switch'
import { KeycapSetSchema } from '../src/schemas/keycap-set'
import { BoardSchema } from '../src/schemas/board'
import { VendorSchema } from '../src/schemas/vendor'
import { GroupBuySchema } from '../src/schemas/group-buy'
import { TrendSnapshotSchema } from '../src/schemas/trend'

const TARGETS = [
  { name: 'switch', schema: SwitchSchema },
  { name: 'keycap-set', schema: KeycapSetSchema },
  { name: 'board', schema: BoardSchema },
  { name: 'vendor', schema: VendorSchema },
  { name: 'group-buy', schema: GroupBuySchema },
  { name: 'trend', schema: TrendSnapshotSchema },
] as const

/** Stable JSON serialization with sorted keys so generated files are deterministic. */
function stableStringify(value: unknown): string {
  const sortedReplacer = (_key: string, val: unknown) => {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      const sorted: Record<string, unknown> = {}
      for (const k of Object.keys(val).sort()) {
        sorted[k] = (val as Record<string, unknown>)[k]
      }
      return sorted
    }
    return val
  }
  return JSON.stringify(value, sortedReplacer, 2) + '\n'
}

export async function generateAll(): Promise<{ diffs: string[] }> {
  const outDir = join(findRepoRoot(), 'data', 'schemas')
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const diffs: string[] = []
  for (const { name, schema } of TARGETS) {
    const json = zodToJsonSchema(schema, name)
    const text = stableStringify(json)
    const file = join(outDir, `${name}.schema.json`)
    const existing = existsSync(file) ? readFileSync(file, 'utf-8') : null
    if (existing !== text) {
      writeFileSync(file, text)
      diffs.push(file)
    }
  }
  return { diffs }
}

// Allow `tsx scripts/generate-json-schema.ts` to run standalone.
const isMain = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}`
if (isMain) {
  generateAll().then((r) => {
    if (r.diffs.length === 0) console.log('schemas already up to date')
    else for (const d of r.diffs) console.log(`wrote ${d}`)
  })
}
