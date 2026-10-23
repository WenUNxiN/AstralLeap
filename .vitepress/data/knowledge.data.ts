import { createContentLoader } from 'vitepress'
import { collectKnowledge } from '../utils/content-collections.ts'

export type { KnowledgeCategory, KnowledgeData } from '../utils/content-collections.ts'

/** 递归扫描分类文章；仅直接分类首页提供分类元信息。 */
export default createContentLoader('knowledge/**/*.md', {
  includeSrc: true,
  transform: collectKnowledge
})
