import { z } from 'zod'
import { listEntityFiles, readJson, fileBaseName } from '../loaders/paths'
import { SwitchSchema } from '../schemas/switch'
import { KeycapSetSchema } from '../schemas/keycap-set'
import { BoardSchema } from '../schemas/board'
import { VendorSchema } from '../schemas/vendor'
import { GroupBuySchema } from '../schemas/group-buy'
import { TrendSnapshotSchema } from '../schemas/trend'

export type EntityKind =
  | 'switches'
  | 'keycap-sets'
  | 'boards'
  | 'vendors'
  | 'group-buys'
  | 'trends'

export type ParsedRecord<T = unknown> = {
  kind: EntityKind
  file: string
  baseName: string
  data: T
}

export type ParseFailure = {
  kind: EntityKind
  file: string
  message: string
  path?: string
}

const SCHEMA_BY_KIND: Record<EntityKind, z.ZodTypeAny> = {
  switches: SwitchSchema,
  'keycap-sets': KeycapSetSchema,
  boards: BoardSchema,
  vendors: VendorSchema,
  'group-buys': GroupBuySchema,
  trends: TrendSnapshotSchema,
}

const ENTITIES: EntityKind[] = [
  'vendors',
  'switches',
  'keycap-sets',
  'boards',
  'group-buys',
  'trends',
]

export function walkAll(): {
  parsed: ParsedRecord[]
  failures: ParseFailure[]
} {
  const parsed: ParsedRecord[] = []
  const failures: ParseFailure[] = []

  for (const kind of ENTITIES) {
    const schema = SCHEMA_BY_KIND[kind]
    for (const file of listEntityFiles(kind)) {
      const baseName = fileBaseName(file)
      let raw: unknown
      try {
        raw = readJson(file)
      } catch (err) {
        failures.push({
          kind,
          file,
          message: `failed to parse JSON: ${(err as Error).message}`,
        })
        continue
      }

      const result = schema.safeParse(raw)
      if (!result.success) {
        for (const issue of result.error.issues) {
          failures.push({
            kind,
            file,
            message: issue.message,
            path: issue.path.join('.') || undefined,
          })
        }
        continue
      }
      parsed.push({ kind, file, baseName, data: result.data })
    }
  }

  return { parsed, failures }
}
