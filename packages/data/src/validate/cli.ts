#!/usr/bin/env tsx
import { generateAll } from '../../scripts/generate-json-schema'
import { validateAll } from './index'
import { printReport } from './report'

async function main() {
  const generated = await generateAll()
  if (generated.diffs.length > 0) {
    console.error('schemas drifted — wrote updated files:')
    for (const d of generated.diffs) console.error(`  ${d}`)
    console.error('\ncommit the updated data/schemas/*.schema.json and re-run.')
    process.exit(1)
  }

  const result = validateAll()
  printReport(result)
  process.exit(result.ok ? 0 : 1)
}

main().catch((err) => {
  console.error('@thock/data validate: unexpected error')
  console.error(err)
  process.exit(1)
})
