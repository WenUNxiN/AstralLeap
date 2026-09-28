import { createContentLoader } from 'vitepress'
import { toContentItem, sortByDateDesc, type ContentItem } from '../utils/content-loader.ts'

/**
 * Debug 记录数据加载器（构建时执行，SSR 直接可用）
 * 扫描 debug/*.md，排除首页和分类导航页，按日期倒序。
 */
export default createContentLoader('debug/*.md', {
  includeSrc: true,
  transform(raw): ContentItem[] {
    return sortByDateDesc(
      raw.filter(e => !e.url.endsWith('/') && e.frontmatter?.categoryPage !== true)
        .map(e => toContentItem(e))
    )
  }
})
