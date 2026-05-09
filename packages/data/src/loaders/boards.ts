import { BoardSchema, type Board } from '../schemas/board'
import { listEntityFiles, readJson } from './paths'
import { memo } from './memo'

const loadAll = memo<Board[]>('boards', () => {
  return listEntityFiles('boards')
    .map((file) => BoardSchema.parse(readJson(file)))
    .sort((a, b) => a.slug.localeCompare(b.slug))
})

export function getAllBoards(): Board[] {
  return loadAll()
}

export function getBoardBySlug(slug: string): Board | null {
  return getAllBoards().find((b) => b.slug === slug) ?? null
}
