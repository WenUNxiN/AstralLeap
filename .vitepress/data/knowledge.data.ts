import { createContentLoader } from 'vitepress'
import { toContentItem, sortByDateDesc, type ContentItem } from '../utils/content-loader'

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

/**
 * 知识库数据加载器（构建时执行，SSR 直接可用）
 * 扫描 knowledge 下各分类目录的 md 文件：
 *   - 各分类的 index.md → 分类元信息（名称/图标/描述）
 *   - 其余文章 → articles（带 dir 字段，供分类页过滤）
 * 一次构建产出分类卡片与全部文章，避免每个分类页重复加载全量内容。
 */
export default createContentLoader('knowledge/*/*.md', {
  includeSrc: true,
  transform(raw): KnowledgeData {
    const articles: ContentItem[] = []
    const meta: Record<string, { name: string; icon: string; description: string }> = {}

    for (const entry of raw) {
      const parts = entry.url.split('/') // ['', 'knowledge', dir, file]
      const dir = parts[2]
      if (!dir) continue
      const fm = entry.frontmatter || {}

      // 分类首页（index.md → url 以 / 结尾）
      if (entry.url.endsWith('/')) {
        meta[dir] = {
          name: fm.title || dir,
          icon: fm.icon || '📁',
          description: fm.description || ''
        }
        continue
      }

      articles.push({ ...toContentItem(entry), dir })
    }

    const counts: Record<string, number> = {}
    for (const a of articles) {
      const d = a.dir as string
      counts[d] = (counts[d] || 0) + 1
    }

    const categories: KnowledgeCategory[] = Object.keys(meta)
      .map(dir => ({ dir, ...meta[dir], count: counts[dir] || 0, url: `/knowledge/${dir}/` }))
      // 隐藏 0 篇文章的空分类，避免首页出现点进去为空的卡片/标签
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count)

    sortByDateDesc(articles)
    return { categories, articles }
  }
})
