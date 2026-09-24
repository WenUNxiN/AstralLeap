import { createContentLoader } from 'vitepress'
import { toContentItem, sortByDateDesc, type ContentItem } from '../utils/content-loader'

/**
 * 实验记录数据加载器（构建时执行，SSR 直接可用）
 * 扫描 experiments/*.md，排除 index.md，按日期倒序。
 */
export default createContentLoader('experiments/*.md', {
  includeSrc: true,
  transform(raw): ContentItem[] {
    return sortByDateDesc(
      raw.filter(e => !e.url.endsWith('/')).map(e => toContentItem(e))
    )
  }
})
