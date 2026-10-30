import type { Switch } from '@thock/data'

const TYPE_PRIORITY: Switch['type'][] = [
  'linear',
  'tactile',
  'clicky',
  'silent-linear',
  'silent-tactile',
]

export type SuggestedSwitchPair = { a: Switch; b: Switch }

/**
 * Picks a small, deterministic set of switch pairs for the comparison
 * tool's empty state, each pair spanning a different switch type so
 * the suggestions read as genuinely distinct comparisons rather than
 * three linear-vs-linear picks. One representative per type (the
 * first in catalog order, which is slug-sorted), then consecutive
 * representatives are paired, wrapping around the type list.
 */
export function getSuggestedSwitchPairs(
  switches: Switch[],
  count = 3,
): SuggestedSwitchPair[] {
  if (switches.length < 2) return []

  const firstByType = new Map<string, Switch>()
  for (const s of switches) {
    if (!firstByType.has(s.type)) firstByType.set(s.type, s)
  }

  const representatives = [
    ...TYPE_PRIORITY.filter((type) => firstByType.has(type)).map(
      (type) => firstByType.get(type) as Switch,
    ),
    ...[...firstByType.entries()]
      .filter(([type]) => !TYPE_PRIORITY.includes(type as Switch['type']))
      .map(([, s]) => s),
  ]

  const pairs: SuggestedSwitchPair[] = []
  const seen = new Set<string>()

  const addPair = (a: Switch, b: Switch): void => {
    if (a.slug === b.slug) return
    const key = [a.slug, b.slug].sort().join('|')
    if (seen.has(key)) return
    seen.add(key)
    pairs.push({ a, b })
  }

  for (
    let i = 0;
    i < representatives.length && pairs.length < count;
    i++
  ) {
    const a = representatives[i]
    const b = representatives[(i + 1) % representatives.length]
    if (a && b) addPair(a, b)
  }

  for (let i = 0; i < switches.length - 1 && pairs.length < count; i++) {
    const a = switches[i]
    const b = switches[i + 1]
    if (a && b) addPair(a, b)
  }

  return pairs
}
