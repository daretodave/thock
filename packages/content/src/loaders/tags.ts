import { TagsConfigSchema, type Tag } from '../schema/tags'
import { readUtf8, tagsFile } from './paths'
import { memo } from './memo'

const loadAll = memo<Tag[]>('tags', () => {
  const raw = JSON.parse(readUtf8(tagsFile())) as unknown
  return TagsConfigSchema.parse(raw).tags
})

export function getAllTags(): Tag[] {
  return [...loadAll()].sort((a, b) => a.slug.localeCompare(b.slug))
}

export function getTagBySlug(slug: string): Tag | null {
  return loadAll().find((t) => t.slug === slug) ?? null
}
