import { createContentLoader } from 'vitepress'
import { collectArticles } from '../utils/content-collections.ts'

/** 递归扫描命令速查，排除各级首页和分类导航页。 */
export default createContentLoader('cheatsheet/**/*.md', {
  includeSrc: true,
  transform: collectArticles
})
