import { createContentLoader } from 'vitepress'
import { collectArticles } from '../utils/content-collections.ts'

/** 递归扫描Debug 记录，排除各级首页和分类导航页。 */
export default createContentLoader('debug/**/*.md', {
  includeSrc: true,
  transform: collectArticles
})
