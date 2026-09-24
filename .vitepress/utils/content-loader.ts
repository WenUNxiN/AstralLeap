/**
 * 内容解析与展示助手
 * 数据加载已迁移到 .vitepress/data/*.data.ts（createContentLoader，构建时执行）
 * 这里只提供：将加载器条目规范化为 ContentItem、排序、以及展示格式化函数。
 * 注意：本文件会被构建时（Node）与运行时同时引用，禁止引入 vitepress 客户端 API（如 withBase）。
 */
import { getExcerpt } from './frontmatter'

export interface ContentItem {
  title: string
  description: string
  date: string
  category: string | string[]
  tags: string[]
  status: string
  platform: string | string[]
  difficulty: string
  url: string
  slug: string
  excerpt: string
  dir?: string
  icon?: string
}

/** createContentLoader 返回的单条内容 */
export interface RawContentEntry {
  url: string
  frontmatter: Record<string, any>
  src?: string
}

/**
 * 将日期规范化为 YYYY-MM-DD 字符串（gray-matter 会把 YAML 日期解析成 Date 对象）
 * 统一用 UTC 取值，避免时区导致跨天。
 */
export function normalizeDate(d: any): string {
  if (!d) return ''
  const date = d instanceof Date ? d : new Date(d)
  if (isNaN(date.getTime())) return String(d)
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 从 url 提取 slug：/experiments/022-v4l2-mmap.html → 022-v4l2-mmap
 */
export function slugFromUrl(url: string): string {
  const last = url.split('/').pop() || ''
  return last.replace(/\.html$/, '')
}

/**
 * 将加载器条目规范化为统一的 ContentItem
 */
export function toContentItem(entry: RawContentEntry): ContentItem {
  const fm = entry.frontmatter || {}
  const slug = slugFromUrl(entry.url)
  return {
    title: fm.title || slug,
    description: fm.description || '',
    date: normalizeDate(fm.date),
    category: fm.category || '',
    tags: fm.tags || [],
    status: fm.status || '',
    platform: fm.platform || '',
    difficulty: fm.difficulty || '',
    url: entry.url,
    slug,
    excerpt: fm.excerpt || getExcerpt(entry.src || '', 120)
  }
}

/**
 * 按日期倒序排列（最新在前，无日期沉底）
 */
export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    if (!a.date) return 1
    if (!b.date) return -1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
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
    'in-progress': '⟳ 进行中',
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
  if (['doing', 'in-progress', 'debugging', 'learning'].includes(status)) return 'doing'
  return ''
}

/**
 * 难度显示文本
 */
export function getDifficultyText(d: string): string {
  const map: Record<string, string> = {
    'beginner': '入门',
    'intermediate': '进阶',
    'advanced': '高级',
  }
  return map[d] || d || ''
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
