import { afterEach, describe, expect, it } from 'vitest'
import {
  dataDir,
  entityDir,
  fileBaseName,
  listEntityFiles,
  setRepoRootForTests,
} from '../../loaders/paths'

describe('fileBaseName', () => {
  it('strips .json from a flat filename', () => {
    expect(fileBaseName('gateron-oil-king.json')).toBe('gateron-oil-king')
  })

  it('strips .json from an absolute path', () => {
    expect(fileBaseName('/data/switches/mode-sonnet.json')).toBe('mode-sonnet')
  })

  it('handles Windows-style backslash paths', () => {
    expect(fileBaseName('data\\switches\\mode-sonnet.json')).toBe('mode-sonnet')
  })

  it('only strips the trailing .json extension', () => {
    expect(fileBaseName('my.json.file.json')).toBe('my.json.file')
  })
})

describe('dataDir and entityDir', () => {
  afterEach(() => setRepoRootForTests(null))

  it('dataDir() is /data under the injected repo root', () => {
    setRepoRootForTests('/fake/root')
    expect(dataDir()).toBe('/fake/root/data')
  })

  it('entityDir() is the entity subdirectory under /data', () => {
    setRepoRootForTests('/fake/root')
    expect(entityDir('switches')).toBe('/fake/root/data/switches')
  })
})

describe('listEntityFiles', () => {
  it('returns sorted .json file paths for the switches entity', () => {
    const files = listEntityFiles('switches')
    expect(files.length).toBeGreaterThanOrEqual(1)
    expect(files.every((f) => f.endsWith('.json'))).toBe(true)
    const sorted = [...files].sort()
    expect(files).toEqual(sorted)
  })

  it('returns an empty array for a non-existent entity', () => {
    expect(listEntityFiles('__no_such_entity__')).toEqual([])
  })
})
