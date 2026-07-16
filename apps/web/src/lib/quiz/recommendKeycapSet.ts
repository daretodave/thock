import type { KeycapSet } from '@thock/data'

export type KeycapSetQuizAnswers = {
  profilePref: 'uniform' | 'spherical-tall' | 'cylindrical-tall' | 'no-pref'
  materialPref: 'abs' | 'pbt' | 'no-pref'
  legendPref: 'doubleshot' | 'dye-sub' | 'no-pref'
  availabilityPref: 'now' | 'group-buy' | 'no-pref'
}

export type ScoredKeycapSet = { keycapSet: KeycapSet; score: number }

const PROFILE_SCORE: Record<string, Record<string, number>> = {
  uniform:           { cherry: 10, oem: 8, xda: 6, dsa: 5, kat: 3, kam: 3, mt3: 0, sa: 0 },
  'spherical-tall':  { sa: 10, mt3: 3, kat: 2, cherry: 1, oem: 0, xda: 0, dsa: 0, kam: 0 },
  'cylindrical-tall': { mt3: 10, sa: 3, kat: 2, cherry: 1, oem: 0, xda: 0, dsa: 0, kam: 0 },
  'no-pref':         {},
}

function scoreProfile(ks: KeycapSet, pref: KeycapSetQuizAnswers['profilePref']): number {
  return PROFILE_SCORE[pref]?.[ks.profile] ?? 0
}

function scoreMaterial(ks: KeycapSet, pref: KeycapSetQuizAnswers['materialPref']): number {
  if (pref === 'abs') {
    if (ks.material === 'abs') return 10
    if (ks.material === 'mixed') return 5
    if (ks.material === 'resin') return 5
    return 0
  }
  if (pref === 'pbt') {
    if (ks.material === 'pbt') return 10
    if (ks.material === 'mixed') return 5
    if (ks.material === 'resin') return 3
    return 0
  }
  return 0
}

function scoreLegend(ks: KeycapSet, pref: KeycapSetQuizAnswers['legendPref']): number {
  if (pref === 'doubleshot') {
    if (ks.legendType === 'doubleshot') return 10
    if (ks.legendType === 'dye-sub') return 4
    if (ks.legendType === 'pad-printed') return 2
    return 0
  }
  if (pref === 'dye-sub') {
    if (ks.legendType === 'dye-sub') return 10
    if (ks.legendType === 'doubleshot') return 4
    if (ks.legendType === 'pad-printed') return 5
    return 0
  }
  return 0
}

function scoreAvailability(ks: KeycapSet, pref: KeycapSetQuizAnswers['availabilityPref']): number {
  if (pref === 'now') {
    if (ks.status === 'in-stock') return 10
    if (ks.status === 'group-buy') return 2
    return 0
  }
  if (pref === 'group-buy') {
    if (ks.status === 'group-buy') return 10
    if (ks.status === 'in-stock') return 8
    if (ks.status === 'sold-out') return 4
    if (ks.status === 'discontinued') return 3
    return 0
  }
  return 0
}

function filterByAvailability(
  catalog: KeycapSet[],
  pref: KeycapSetQuizAnswers['availabilityPref'],
): KeycapSet[] {
  if (pref === 'now') {
    const eligible = catalog.filter((ks) => ks.status === 'in-stock' || ks.status === 'group-buy')
    return eligible.length > 0 ? eligible : catalog
  }
  if (pref === 'group-buy') {
    const eligible = catalog.filter((ks) => ks.status !== 'discontinued')
    return eligible.length > 0 ? eligible : catalog
  }
  return catalog
}

export function recommendKeycapSet(
  answers: KeycapSetQuizAnswers,
  catalog: KeycapSet[],
): ScoredKeycapSet[] {
  if (catalog.length === 0) return []

  const eligible = filterByAvailability(catalog, answers.availabilityPref)

  const scored = eligible
    .map((ks) => ({
      keycapSet: ks,
      score:
        scoreProfile(ks, answers.profilePref) +
        scoreMaterial(ks, answers.materialPref) +
        scoreLegend(ks, answers.legendPref) +
        scoreAvailability(ks, answers.availabilityPref),
    }))
    .sort((a, b) => b.score - a.score || a.keycapSet.slug.localeCompare(b.keycapSet.slug))

  return scored.slice(0, 3)
}
