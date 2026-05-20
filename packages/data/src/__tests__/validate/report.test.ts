import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { printReport } from '../../validate/report'
import type { ValidationResult } from '../../validate/index'

const COUNTS = {
  vendors: 0,
  switches: 0,
  'keycap-sets': 0,
  boards: 0,
  'group-buys': 0,
  trends: 0,
}

describe('printReport', () => {
  let logSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  it('ok path — prints total count, per-kind breakdown, success line; no console.error', () => {
    const result: ValidationResult = {
      ok: true,
      errors: [],
      counts: { ...COUNTS, vendors: 2, switches: 3, trends: 1 },
    }
    printReport(result)
    expect(logSpy).toHaveBeenCalledWith('@thock/data: 6 record(s) walked')
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('vendors'))
    expect(logSpy).toHaveBeenCalledWith('\nall records valid; cross-refs resolve.')
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('error path — prints error count and details; no success line', () => {
    const result: ValidationResult = {
      ok: false,
      errors: [{ kind: 'switches', slug: 'bad-switch', field: 'vendorSlug', message: 'vendor "ghost" not found' }],
      counts: { ...COUNTS, switches: 1 },
    }
    printReport(result)
    expect(errorSpy).toHaveBeenCalledWith('\n1 validation error(s):')
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('"ghost"'))
    expect(logSpy).not.toHaveBeenCalledWith('\nall records valid; cross-refs resolve.')
  })

  it('uses err.file as the location prefix when set', () => {
    const result: ValidationResult = {
      ok: false,
      errors: [{ kind: 'switches', file: 'data/switches/bad.json', message: 'parse error' }],
      counts: { ...COUNTS },
    }
    printReport(result)
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('data/switches/bad.json'))
  })

  it('falls back to kind/slug when err.file is absent', () => {
    const result: ValidationResult = {
      ok: false,
      errors: [{ kind: 'boards', slug: 'mode-sonnet', message: 'vendorSlug missing' }],
      counts: { ...COUNTS, boards: 1 },
    }
    printReport(result)
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('boards/mode-sonnet'))
  })

  it('includes field in brackets when err.field is present', () => {
    const result: ValidationResult = {
      ok: false,
      errors: [{ kind: 'switches', slug: 'test', field: 'vendorSlug', message: 'vendor not found' }],
      counts: { ...COUNTS, switches: 1 },
    }
    printReport(result)
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('[vendorSlug]'))
  })
})
