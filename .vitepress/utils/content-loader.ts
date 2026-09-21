/**
 * 内容列表解析工具
 * 注意：import.meta.glob 必须使用字符串字面量，不能动态拼接
 * 所以各组件自己写 glob 模式，这里只负责解析 frontmatter 和排序
 */
import { getFrontmatter, getExcerpt } from './frontmatter'

export interface ContentItem {
  title: string
  description: string
  date: string
  category: string | string[]
  tags: string[]
  status: string
  platform: string | string[]
  link: string
  slug: string
  excerpt: string
  icon?: string
}

/**
 * 从 import.meta.glob 的结果中解析出内容列表
 * @param modules import.meta.glob 返回的对象
 * @param basePath 链接基础路径，如 '/AstralLeap/experiments/'
 * @param options 排序选项
 */
export async function parseContentList(
  modules: Record<string, () => Promise<string>>,
  basePath: string,
  options: { sortByDate?: boolean } = {}
): Promise<ContentItem[]> {
  const { sortByDate = true } = options
  const items: ContentItem[] = []

  for (const [filePath, loadContent] of Object.entries(modules)) {
    // 跳过 index.md
    if (filePath.endsWith('/index.md')) continue

    const content = await loadContent()
    const fm = getFrontmatter(content)

    // 从路径中提取 slug
    const fileName = filePath.split('/').pop() || ''
    const slug = fileName.replace(/\.md$/, '')

    items.push({
      title: fm.title || slug,
      description: fm.description || '',
      date: fm.date || '',
      category: fm.category || '',
      tags: fm.tags || [],
      status: fm.status || '',
      platform: fm.platform || '',
      link: basePath + slug,
      slug,
      excerpt: fm.excerpt || getExcerpt(content, 120)
    })
  }

  // 按日期排序（最新的在前）
  if (sortByDate) {
    items.sort((a, b) => {
      if (!a.date) return 1
      if (!b.date) return -1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  return items
}

/**
 * 自动发现知识库分类
 * 扫描各子目录下的 index.md，从 frontmatter 中读取分类名称和图标
 * @param indexModules 所有分类 index.md 的 glob 结果
 * @param allArticlesModules 所有分类下所有文章的 glob 结果（用于统计文章数）
 * @param basePath 基础路径
 */
export async function discoverKnowledgeCategories(
  indexModules: Record<string, () => Promise<string>>,
  allArticlesModules: Record<string, () => Promise<string>>,
  basePath: string
): Promise<Array<{
  name: string
  icon: string
  description: string
  dir: string
  count: number
  link: string
}>> {
  const categories = []

  for (const [filePath, loadContent] of Object.entries(indexModules)) {
    // 从路径中提取目录名：.../knowledge/camera/index.md → camera
    const parts = filePath.split('/')
    const dirIndex = parts.lastIndexOf('knowledge') + 1
    if (dirIndex <= 0 || dirIndex >= parts.length) continue
    const dir = parts[dirIndex]

    const content = await loadContent()
    const fm = getFrontmatter(content)

    categories.push({
      name: fm.title || dir,
      icon: fm.icon || '📁',
      description: fm.description || '',
      dir,
      count: 0, // 后面再统计
      link: `${basePath}${dir}/`
    })
  }

  // 统计每个分类的文章数（排除 index.md）
  for (const [filePath] of Object.entries(allArticlesModules)) {
    if (filePath.endsWith('/index.md')) continue
    const parts = filePath.split('/')
    const dirIndex = parts.lastIndexOf('knowledge') + 1
    if (dirIndex <= 0 || dirIndex >= parts.length) continue
    const dir = parts[dirIndex]

    const cat = categories.find(c => c.dir === dir)
    if (cat) cat.count++
  }

  // 按文章数量降序排列
  categories.sort((a, b) => b.count - a.count)

  return categories
}

/**
 * 从知识库全量文章中按分类过滤
 * @param allModules 所有分类下所有文章的 glob 结果
 * @param categoryDir 分类目录名（如 'camera'）
 * @param basePath 基础路径
 */
export async function getKnowledgeCategoryArticles(
  allModules: Record<string, () => Promise<string>>,
  categoryDir: string,
  basePath: string
): Promise<ContentItem[]> {
  const filtered: Record<string, () => Promise<string>> = {}

  for (const [filePath, loader] of Object.entries(allModules)) {
    if (filePath.endsWith('/index.md')) continue
    // 检查路径中是否包含 /<categoryDir>/
    if (filePath.includes(`/${categoryDir}/`)) {
      filtered[filePath] = loader
    }
  }

  return parseContentList(filtered, `${basePath}${categoryDir}/`)
}

/**
 * 格式化日期
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * 格式化短日期 YYYY-MM-DD
 */
export function formatShortDate(d: string): string {
  if (!d) return ''
  const date = new Date(d)
  if (isNaN(date.getTime())) return d
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * 状态显示文本
 */
export function getStatusText(status: string): string {
  const map: Record<string, string> = {
    'done': '✓ 已验证',
    'verified': '✓ 已验证',
    'doing': '⟳ 进行中',
    'solved': '✓ 已解决',
    'debugging': '🔍 排查中',
    'learning': '📖 学习中',
  }
  return map[status] || status || ''
}

/**
 * 状态 CSS class
 */
export function getStatusClass(status: string): string {
  if (['done', 'verified', 'solved'].includes(status)) return 'done'
  if (['doing', 'debugging', 'learning'].includes(status)) return 'doing'
  return ''
}

/**
 * 取数组第一个元素（兼容字符串和数组）
 */
export function firstOf(v: string | string[] | undefined): string {
  if (!v) return ''
  return Array.isArray(v) ? v[0] : v
}

/**
 * 从实验 slug 中提取编号
 */
export function getExpId(slug: string): string {
  const m = slug.match(/^(\d+)/)
  return m ? m[1] : ''
}
