type Loader<T> = () => T

const caches = new Map<string, unknown>()

export function memo<T>(key: string, fn: Loader<T>): Loader<T> {
  return () => {
    if (caches.has(key)) {
      return caches.get(key) as T
    }
    const value = fn()
    caches.set(key, value)
    return value
  }
}

/** Drops the loader memoization. Tests use this to read fresh data. */
export function __resetForTests(): void {
  caches.clear()
}
