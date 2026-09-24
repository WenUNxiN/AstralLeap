import { createContentLoader } from 'vitepress'
import { toContentItem, sortByDateDesc, type ContentItem } from '../utils/content-loader'

/**
 * 命令速查数据加载器（构建时执行，SSR 直接可用）
 * 扫描 cheatsheet/*.md，排除 index.md。
 */
export default createContentLoader('cheatsheet/*.md', {
  includeSrc: true,
  transform(raw): ContentItem[] {
    return sortByDateDesc(
      raw.filter(e => !e.url.endsWith('/')).map(e => toContentItem(e))
    )
  }
})
