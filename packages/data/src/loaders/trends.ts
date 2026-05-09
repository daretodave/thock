import { TrendSnapshotSchema, type TrendSnapshot } from '../schemas/trend'
import { listEntityFiles, readJson } from './paths'
import { memo } from './memo'

const loadAll = memo<TrendSnapshot[]>('trends', () => {
  return listEntityFiles('trends')
    .map((file) => TrendSnapshotSchema.parse(readJson(file)))
    .sort((a, b) => a.isoWeek.localeCompare(b.isoWeek))
})

export function getAllTrendSnapshots(): TrendSnapshot[] {
  return loadAll()
}

export function getTrendSnapshot(isoWeek: string): TrendSnapshot | null {
  return getAllTrendSnapshots().find((t) => t.isoWeek === isoWeek) ?? null
}

export function getLatestTrendSnapshot(): TrendSnapshot | null {
  const all = getAllTrendSnapshots()
  return all.length > 0 ? all[all.length - 1]! : null
}
