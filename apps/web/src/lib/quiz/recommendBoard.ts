import type { Board } from '@thock/data'

export type BoardQuizAnswers = {
  layoutPref: 'tkl' | '60' | '65' | '75' | 'no-pref'
  mountStylePref: 'gasket' | 'top-mount' | 'tray-mount' | 'pcb-mount' | 'no-pref'
  caseMaterialPref: 'aluminum' | 'polycarbonate' | 'plastic' | 'wood' | 'no-pref'
  hotswapPref: 'yes' | 'no' | 'no-pref'
  wirelessPref: 'yes' | 'no' | 'no-pref'
}

export type ScoredBoard = { board: Board; score: number }

// Keyed by preference, scored against the board's actual `layout`. Exact
// match wins; adjacent sizes (one step up/down the 60→65→75→tkl ladder)
// get partial credit so a "60%" preference still prefers a 65% board over
// a full-size one. `full`/`alice`/`split`/`ortho`/`other` are not offered
// as preferences (none of the catalog's current boards use them) but still
// score 0 rather than throwing if a board ever does.
const LAYOUT_SCORE: Record<string, Record<string, number>> = {
  tkl: { tkl: 10, '75': 5, full: 4, '65': 2, '60': 0, alice: 0, split: 0, ortho: 0, other: 0 },
  '60': { '60': 10, '65': 5, '75': 2, tkl: 0, full: 0, alice: 0, split: 0, ortho: 0, other: 0 },
  '65': { '65': 10, '60': 5, '75': 5, tkl: 2, full: 0, alice: 0, split: 0, ortho: 0, other: 0 },
  '75': { '75': 10, '65': 5, tkl: 5, full: 3, '60': 2, alice: 0, split: 0, ortho: 0, other: 0 },
  'no-pref': {},
}

function scoreLayout(board: Board, pref: BoardQuizAnswers['layoutPref']): number {
  return LAYOUT_SCORE[pref]?.[board.layout] ?? 0
}

// Groups mounting styles by typing feel: gasket/top-mount share a springy,
// structured-flex feel; tray-mount/pcb-mount share a firmer, simpler one.
// integrated-plate/leaf-spring aren't offered as preferences but still
// pick up partial credit when a board uses them.
const MOUNT_STYLE_SCORE: Record<string, Record<string, number>> = {
  gasket: { gasket: 10, 'top-mount': 4, 'leaf-spring': 3, 'integrated-plate': 2, 'tray-mount': 0, 'pcb-mount': 0 },
  'top-mount': { 'top-mount': 10, gasket: 4, 'integrated-plate': 4, 'leaf-spring': 2, 'tray-mount': 0, 'pcb-mount': 0 },
  'tray-mount': { 'tray-mount': 10, 'pcb-mount': 6, 'integrated-plate': 2, gasket: 0, 'top-mount': 0, 'leaf-spring': 0 },
  'pcb-mount': { 'pcb-mount': 10, 'tray-mount': 6, 'integrated-plate': 2, gasket: 0, 'top-mount': 0, 'leaf-spring': 0 },
  'no-pref': {},
}

function scoreMountStyle(board: Board, pref: BoardQuizAnswers['mountStylePref']): number {
  return MOUNT_STYLE_SCORE[pref]?.[board.mountStyle] ?? 0
}

// `mixed` and `fr4` aren't offered as preferences, but score partial
// credit against every real preference since they blend materials.
const CASE_MATERIAL_SCORE: Record<string, Record<string, number>> = {
  aluminum: { aluminum: 10, mixed: 5, fr4: 2, polycarbonate: 0, plastic: 0, wood: 0 },
  polycarbonate: { polycarbonate: 10, mixed: 5, fr4: 3, plastic: 3, aluminum: 0, wood: 0 },
  plastic: { plastic: 10, polycarbonate: 4, fr4: 3, mixed: 3, aluminum: 0, wood: 0 },
  wood: { wood: 10, aluminum: 3, mixed: 3, polycarbonate: 0, plastic: 0, fr4: 0 },
  'no-pref': {},
}

function scoreCaseMaterial(board: Board, pref: BoardQuizAnswers['caseMaterialPref']): number {
  return CASE_MATERIAL_SCORE[pref]?.[board.caseMaterial] ?? 0
}

function scoreHotswap(board: Board, pref: BoardQuizAnswers['hotswapPref']): number {
  if (pref === 'yes') return board.hotswap ? 10 : 0
  if (pref === 'no') return board.hotswap ? 0 : 10
  return 0
}

function scoreWireless(board: Board, pref: BoardQuizAnswers['wirelessPref']): number {
  if (pref === 'yes') return board.wireless ? 10 : 0
  if (pref === 'no') return board.wireless ? 0 : 10
  return 0
}

/**
 * Pure board recommender. Unlike `recommendKeycapSet`/`recommendSwitch`,
 * there is no availability/status dimension in this quiz, so the catalog
 * is never filtered — every board is eligible regardless of `status`.
 * That means a non-empty catalog always returns at least one result: the
 * closest match, even when its score is low or zero.
 */
export function recommendBoard(
  answers: BoardQuizAnswers,
  catalog: Board[],
): ScoredBoard[] {
  if (catalog.length === 0) return []

  const scored = catalog
    .map((board) => ({
      board,
      score:
        scoreLayout(board, answers.layoutPref) +
        scoreMountStyle(board, answers.mountStylePref) +
        scoreCaseMaterial(board, answers.caseMaterialPref) +
        scoreHotswap(board, answers.hotswapPref) +
        scoreWireless(board, answers.wirelessPref),
    }))
    .sort((a, b) => b.score - a.score || a.board.slug.localeCompare(b.board.slug))

  return scored.slice(0, 3)
}
