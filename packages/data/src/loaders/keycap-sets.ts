import { KeycapSetSchema, type KeycapSet } from '../schemas/keycap-set'
import { listEntityFiles, readJson } from './paths'
import { memo } from './memo'

const loadAll = memo<KeycapSet[]>('keycap-sets', () => {
  return listEntityFiles('keycap-sets')
    .map((file) => KeycapSetSchema.parse(readJson(file)))
    .sort((a, b) => a.slug.localeCompare(b.slug))
})

export function getAllKeycapSets(): KeycapSet[] {
  return loadAll()
}

export function getKeycapSetBySlug(slug: string): KeycapSet | null {
  return getAllKeycapSets().find((k) => k.slug === slug) ?? null
}
