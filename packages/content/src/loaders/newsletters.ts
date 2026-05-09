import matter from 'gray-matter'
import {
  NewsletterFrontmatterSchema,
  type NewsletterFrontmatter,
} from '../schema/newsletter'
import { fileBaseName, listNewsletterFiles, readUtf8 } from './paths'
import { memo } from './memo'

export type Newsletter = {
  slug: string
  frontmatter: NewsletterFrontmatter
  body: string
  filePath: string
}

const loadAll = memo<Newsletter[]>('newsletters', () => {
  const issues: Newsletter[] = []
  for (const file of listNewsletterFiles()) {
    const baseName = fileBaseName(file)
    const raw = readUtf8(file)
    const { data, content } = matter(raw)
    const parsed = NewsletterFrontmatterSchema.safeParse(data)
    if (!parsed.success) {
      throw new Error(
        `[@thock/content] newsletter frontmatter parse failed in ${file}: ${parsed.error.message}`,
      )
    }
    if (parsed.data.slug !== baseName) {
      throw new Error(
        `[@thock/content] newsletter slug "${parsed.data.slug}" does not match filename "${baseName}.mdx"`,
      )
    }
    issues.push({
      slug: parsed.data.slug,
      frontmatter: parsed.data,
      body: content,
      filePath: file,
    })
  }
  issues.sort((a, b) =>
    b.frontmatter.publishedAt.localeCompare(a.frontmatter.publishedAt),
  )
  return issues
})

/**
 * All published newsletter digests, sorted newest first. Empty
 * array when `apps/web/src/content/newsletters/` doesn't exist or
 * contains no .mdx files — the /newsletter page renders an empty
 * state in that case.
 */
export function getAllNewsletters(): Newsletter[] {
  return loadAll()
}

export function getNewsletterBySlug(slug: string): Newsletter | null {
  return getAllNewsletters().find((n) => n.slug === slug) ?? null
}
