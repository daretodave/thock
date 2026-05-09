import type { ValidationResult } from './index'

export function printReport(result: ValidationResult): void {
  const total = Object.values(result.counts).reduce((a, b) => a + b, 0)
  console.log(`@thock/data: ${total} record(s) walked`)
  for (const [kind, n] of Object.entries(result.counts)) {
    console.log(`  ${kind.padEnd(12)} ${n}`)
  }

  if (result.ok) {
    console.log('\nall records valid; cross-refs resolve.')
    return
  }

  console.error(`\n${result.errors.length} validation error(s):`)
  for (const err of result.errors) {
    const where = err.file ?? `${err.kind}/${err.slug ?? '<unknown>'}`
    const field = err.field ? ` [${err.field}]` : ''
    console.error(`  ${where}${field}: ${err.message}`)
  }
}
