import { createContentLoader } from 'vitepress'
import { collectArticles } from '../utils/content-collections.ts'

/** 递归扫描实验记录，排除各级首页和分类导航页。 */
export default createContentLoader('experiments/**/*.md', {
  includeSrc: true,
  transform: collectArticles
})
