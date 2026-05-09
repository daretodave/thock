import { SwitchSchema, type Switch } from '../schemas/switch'
import { listEntityFiles, readJson } from './paths'
import { memo } from './memo'

const loadAll = memo<Switch[]>('switches', () => {
  return listEntityFiles('switches')
    .map((file) => SwitchSchema.parse(readJson(file)))
    .sort((a, b) => a.slug.localeCompare(b.slug))
})

export function getAllSwitches(): Switch[] {
  return loadAll()
}

export function getSwitchBySlug(slug: string): Switch | null {
  return getAllSwitches().find((s) => s.slug === slug) ?? null
}
