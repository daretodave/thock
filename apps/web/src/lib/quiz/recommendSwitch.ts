import type { Switch } from '@thock/data'

export type QuizAnswers = {
  soundProfile: 'thocky' | 'crisp' | 'silent' | 'neutral'
  actuationFeel: 'smooth' | 'tactile'
  springWeight: 'light' | 'medium' | 'heavy'
  primaryUse: 'gaming' | 'typing' | 'office'
}

export type ScoredSwitch = { switch: Switch; score: number }

function scoreSoundProfile(sw: Switch, profile: QuizAnswers['soundProfile']): number {
  switch (profile) {
    case 'thocky':
      return (
        (sw.type === 'linear' ? 4 : 0) +
        (sw.housingTop === 'pc' ? 2 : 0) +
        (sw.housingBottom === 'nylon' ? 2 : 0) +
        (sw.stem === 'pom' ? 2 : 0)
      )
    case 'crisp':
      return (
        (sw.type.startsWith('linear') ? 4 : 0) +
        (sw.housingTop === 'nylon' ? 3 : 0) +
        (sw.housingBottom === 'nylon' ? 3 : 0)
      )
    case 'silent':
      return sw.type === 'silent-linear' || sw.type === 'silent-tactile' ? 10 : 0
    case 'neutral':
      return 0
  }
}

function scoreActuationFeel(sw: Switch, feel: QuizAnswers['actuationFeel']): number {
  if (feel === 'smooth') return sw.type.startsWith('linear') ? 8 : 0
  if (feel === 'tactile') return sw.type === 'tactile' || sw.type === 'silent-tactile' ? 8 : 0
  return 0
}

function scoreSpringWeight(sw: Switch, weight: QuizAnswers['springWeight']): number {
  const g = sw.springGrams.actuation
  switch (weight) {
    case 'light':
      return g <= 45 ? 8 : g <= 55 ? 4 : 0
    case 'medium':
      return g >= 46 && g <= 59 ? 8 : g <= 65 ? 4 : 0
    case 'heavy':
      return g >= 60 ? 8 : g >= 55 ? 4 : 0
  }
}

function scorePrimaryUse(sw: Switch, use: QuizAnswers['primaryUse']): number {
  switch (use) {
    case 'gaming':
      return (sw.type.startsWith('linear') ? 4 : 0) + (sw.springGrams.actuation <= 50 ? 3 : 0)
    case 'typing':
      return sw.type === 'tactile' || sw.type === 'silent-tactile' ? 6 : sw.type.startsWith('linear') ? 2 : 0
    case 'office':
      return sw.type === 'silent-linear' || sw.type === 'silent-tactile' ? 8 : sw.type === 'linear' ? 2 : sw.type === 'tactile' ? 1 : 0
  }
}

export function recommendSwitch(
  answers: QuizAnswers,
  catalog: Switch[],
): ScoredSwitch[] {
  if (catalog.length === 0) return []

  const scored = catalog
    .map((sw) => ({
      switch: sw,
      score:
        scoreSoundProfile(sw, answers.soundProfile) +
        scoreActuationFeel(sw, answers.actuationFeel) +
        scoreSpringWeight(sw, answers.springWeight) +
        scorePrimaryUse(sw, answers.primaryUse),
    }))
    .sort((a, b) => b.score - a.score || a.switch.slug.localeCompare(b.switch.slug))

  return scored.slice(0, 3)
}
