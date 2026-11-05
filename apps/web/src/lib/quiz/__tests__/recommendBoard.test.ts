import { describe, expect, it } from 'vitest'
import type { Board } from '@thock/data'
import { recommendBoard, type BoardQuizAnswers } from '../recommendBoard'

function makeBoard(overrides: Partial<Board> & { slug: string }): Board {
  return {
    name: overrides.slug,
    vendorSlug: 'test-vendor',
    layout: '75',
    caseMaterial: 'aluminum',
    mountStyle: 'gasket',
    hotswap: true,
    wireless: false,
    releasedAt: null,
    status: 'in-stock',
    description: 'A test board with adequate length for the schema validator to accept.',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const TKL_GASKET_ALU = makeBoard({
  slug: 'tkl-gasket-alu',
  layout: 'tkl',
  mountStyle: 'gasket',
  caseMaterial: 'aluminum',
  hotswap: true,
  wireless: false,
})
const SIXTY_TRAY_PLASTIC = makeBoard({
  slug: 'sixty-tray-plastic',
  layout: '60',
  mountStyle: 'tray-mount',
  caseMaterial: 'plastic',
  hotswap: true,
  wireless: false,
})
const SEVENTYFIVE_GASKET_ALU_WIRELESS = makeBoard({
  slug: 'seventyfive-gasket-alu-wireless',
  layout: '75',
  mountStyle: 'gasket',
  caseMaterial: 'aluminum',
  hotswap: true,
  wireless: true,
})
const SIXTYFIVE_GASKET_PC = makeBoard({
  slug: 'sixtyfive-gasket-pc',
  layout: '65',
  mountStyle: 'gasket',
  caseMaterial: 'polycarbonate',
  hotswap: true,
  wireless: false,
})
const WOOD_TOPMOUNT_SOLDERED = makeBoard({
  slug: 'wood-topmount-soldered',
  layout: 'tkl',
  mountStyle: 'top-mount',
  caseMaterial: 'wood',
  hotswap: false,
  wireless: false,
})

const CATALOG = [
  TKL_GASKET_ALU,
  SIXTY_TRAY_PLASTIC,
  SEVENTYFIVE_GASKET_ALU_WIRELESS,
  SIXTYFIVE_GASKET_PC,
  WOOD_TOPMOUNT_SOLDERED,
]

const NO_PREF: BoardQuizAnswers = {
  layoutPref: 'no-pref',
  mountStylePref: 'no-pref',
  caseMaterialPref: 'no-pref',
  hotswapPref: 'no-pref',
  wirelessPref: 'no-pref',
}

describe('recommendBoard', () => {
  it('A: prefers tkl layout for the tkl preference', () => {
    const answers: BoardQuizAnswers = { ...NO_PREF, layoutPref: 'tkl' }
    const results = recommendBoard(answers, CATALOG)
    expect(results[0]?.board.layout).toBe('tkl')
  })

  it('B: prefers gasket mount for the gasket preference', () => {
    const answers: BoardQuizAnswers = { ...NO_PREF, mountStylePref: 'gasket' }
    const results = recommendBoard(answers, CATALOG)
    expect(results[0]?.board.mountStyle).toBe('gasket')
  })

  it('C: prefers aluminum case for the aluminum preference', () => {
    const answers: BoardQuizAnswers = { ...NO_PREF, caseMaterialPref: 'aluminum' }
    const results = recommendBoard(answers, CATALOG)
    expect(results[0]?.board.caseMaterial).toBe('aluminum')
  })

  it('D: prefers a hotswap board for the "yes" hotswap preference', () => {
    const answers: BoardQuizAnswers = { ...NO_PREF, hotswapPref: 'yes' }
    const results = recommendBoard(answers, CATALOG)
    expect(results[0]?.board.hotswap).toBe(true)
  })

  it('D2: prefers a soldered board for the "no" hotswap preference', () => {
    const answers: BoardQuizAnswers = { ...NO_PREF, hotswapPref: 'no' }
    const results = recommendBoard(answers, CATALOG)
    expect(results[0]?.board.hotswap).toBe(false)
  })

  it('E: prefers a wireless board for the "yes" wireless preference', () => {
    const answers: BoardQuizAnswers = { ...NO_PREF, wirelessPref: 'yes' }
    const results = recommendBoard(answers, CATALOG)
    expect(results[0]?.board.wireless).toBe(true)
  })

  it('F: returns an empty array for an empty catalog', () => {
    expect(recommendBoard(NO_PREF, [])).toEqual([])
  })

  it('G: returns at most 3 results even with a large catalog', () => {
    const big = Array.from({ length: 12 }, (_, i) =>
      makeBoard({ slug: `board-${i}`, layout: 'tkl' }),
    )
    const answers: BoardQuizAnswers = { ...NO_PREF, layoutPref: 'tkl' }
    expect(recommendBoard(answers, big).length).toBeLessThanOrEqual(3)
  })

  it('H: ties are broken by slug ascending', () => {
    const aaa = makeBoard({ slug: 'aaa-board' })
    const zzz = makeBoard({ slug: 'zzz-board' })
    // Both boards are identical on every scored dimension, so both score
    // the same under any answer set — the sort must fall back to slug.
    const results = recommendBoard(NO_PREF, [zzz, aaa])
    expect(results.map((r) => r.board.slug)).toEqual(['aaa-board', 'zzz-board'])
  })

  it('I: never returns an empty result, even when no board fully matches every axis (closest match wins)', () => {
    // Every axis here points away from what every fixture board actually
    // has: layout 60% (only SIXTY_TRAY_PLASTIC matches, but on mount/
    // material/hotswap/wireless it doesn't), mount pcb-mount (no fixture
    // uses it), case wood (only WOOD_TOPMOUNT_SOLDERED matches), hotswap
    // "no" (only WOOD_TOPMOUNT_SOLDERED matches), wireless "yes" (only
    // SEVENTYFIVE_GASKET_ALU_WIRELESS matches). No single board scores
    // the maximum (50) on all five axes at once.
    const answers: BoardQuizAnswers = {
      layoutPref: '60',
      mountStylePref: 'pcb-mount',
      caseMaterialPref: 'wood',
      hotswapPref: 'no',
      wirelessPref: 'yes',
    }
    const results = recommendBoard(answers, CATALOG)
    expect(results.length).toBeGreaterThan(0)
    expect(results.length).toBeLessThanOrEqual(3)
    const maxPossibleScore = 10 + 10 + 10 + 10 + 10
    for (const r of results) {
      expect(r.score).toBeLessThan(maxPossibleScore)
    }
    // WOOD_TOPMOUNT_SOLDERED scores highest among the fixtures (wood case +
    // "no" hotswap both hit, nothing else does) even though it's an
    // incomplete match.
    expect(results[0]?.board.slug).toBe('wood-topmount-soldered')
  })

  it('J: all-no-pref answers score every board 0 but still return results', () => {
    const results = recommendBoard(NO_PREF, CATALOG)
    expect(results.length).toBeGreaterThan(0)
    for (const r of results) {
      expect(r.score).toBe(0)
    }
  })
})
