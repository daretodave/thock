/** Returns the slug part of a `<slug>.mdx` filename. */
export function slugFromFile(file: string): string {
  return file
    .split(/[\\/]/)
    .at(-1)!
    .replace(/\.mdx$/, '')
}
