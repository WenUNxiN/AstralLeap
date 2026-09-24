/**
 * Markdown 内容辅助工具
 * 注：frontmatter 解析已交由 createContentLoader 内置的 gray-matter 处理，
 * 这里仅保留基于原始文本生成摘要的工具。
 */

/**
 * 提取文章摘要
 */
export function getExcerpt(content: unknown, maxLength = 150): string {
  if (typeof content !== 'string') return '暂无摘要'
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*/)
  let body = fmMatch ? content.substring(fmMatch[0].length) : content
  // 移除代码块
  body = body.replace(/```[\s\S]*?```/g, '')
  // 移除行内代码
  body = body.replace(/`[^`]+`/g, '')
  // 移除 Markdown 标记
  body = body.replace(/[#*>\-\[\]!]/g, '')
  // 移除 HTML 标签
  body = body.replace(/<[^>]+>/g, '')
  body = body.trim()
  // 按句子分割取前两句
  const sentences = body.split(/。|！|？|\n/).filter(s => s.trim().length > 0)
  let excerpt = sentences.slice(0, 2).join('。').trim()
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength) + '...'
  }
  return excerpt || '暂无摘要'
}
