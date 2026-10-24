import { sortByDateDesc, toContentItem, type ContentItem, type RawContentEntry } from './content-loader.ts'
import { getMarkdownTitle } from './frontmatter.ts'

export interface KnowledgeCategory {
  name: string
  icon: string
  description: string
  dir: string
  count: number
  url: string
}

export interface KnowledgeData {
  categories: KnowledgeCategory[]
  articles: ContentItem[]
}

/** Indexes and explicit category pages are navigation, not article cards. */
export function isArticle(entry: RawContentEntry): boolean {
  return !entry.url.endsWith('/') && entry.frontmatter?.categoryPage !== true
}

export function collectArticles(entries: RawContentEntry[]): ContentItem[] {
  return sortByDateDesc(entries.filter(isArticle).map(toContentItem))
}

/** Group all descendants under their first knowledge category. */
export function collectKnowledge(entries: RawContentEntry[]): KnowledgeData {
  const articles: ContentItem[] = []
  const meta = new Map<string, Omit<KnowledgeCategory, 'dir' | 'count' | 'url'>>()
  for (const entry of entries) {
    const match = entry.url.match(/^\/knowledge\/([^/]+)\/(.*)$/)
    if (!match) continue
    const [, dir, rest] = match
    const fm = entry.frontmatter || {}
    // Only the category's own index may supply category metadata. A deeper
    // directory index must never rename the containing category.
    if (!rest) {
      meta.set(dir, { name: fm.title || getMarkdownTitle(entry.src) || dir, icon: fm.icon || '📁', description: fm.description || '' })
    } else if (isArticle(entry)) {
      articles.push({ ...toContentItem(entry), dir })
    }
  }

  const counts = new Map<string, number>()
  for (const article of articles) counts.set(article.dir!, (counts.get(article.dir!) || 0) + 1)
  const categories = [...meta].map(([dir, info]) => ({
    dir, ...info, count: counts.get(dir) || 0, url: `/knowledge/${dir}/`
  })).filter(category => category.count > 0).sort((a, b) => b.count - a.count)
  return { categories, articles: sortByDateDesc(articles) }
}
