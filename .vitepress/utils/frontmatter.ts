/**
 * Markdown 内容辅助工具
 * 注：frontmatter 解析已交由 createContentLoader 内置的 gray-matter 处理，
 * 这里提供基于原始文本生成标题和摘要的工具。
 */

/**
 * 提取文章摘要
 */
function markdownBody(content: string): string {
  const source = content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const fmMatch = source.match(/^---[\t ]*\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)[\t ]*(?:\r?\n|$)/)
  let body = fmMatch ? source.substring(fmMatch[0].length) : source
  // Remove fenced code and non-content blocks before stripping Markdown syntax.
  body = body.replace(/^ {0,3}(`{3,}|~{3,})[^\r\n]*\r?\n[\s\S]*?^ {0,3}\1[\t ]*$/gm, '')
  body = body.replace(/<!--[^]*?-->/g, '')
  body = body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  return body
}

function inlineText(content: string): string {
  return content
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/<[^>]+>/g, '').trim()
}

/** Without a frontmatter title, use the article's first level-one heading. */
export function getMarkdownTitle(content: unknown): string {
  if (typeof content !== 'string') return ''
  const body = markdownBody(content)
  const heading = body.match(/^ {0,3}#\s+(.+?)(?:\s+#+)?[\t ]*$/m)
    || body.match(/^([^\n]+)\n {0,3}=+[\t ]*$/m)
  return heading ? inlineText(heading[1]) : ''
}

export function getExcerpt(content: unknown, maxLength = 150): string {
  if (typeof content !== 'string') return '暂无摘要'
  let body = markdownBody(content)
  body = body.replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-*+]\s+|\d+[.)]\s+)/gm, '')
  body = inlineText(body)
  // 按句子分割取前两句
  const sentences = body.split(/。|！|？|\n/).filter(s => s.trim().length > 0)
  let excerpt = sentences.slice(0, 2).join('。').trim()
  if (excerpt.length > maxLength) {
    excerpt = excerpt.substring(0, maxLength) + '...'
  }
  return excerpt || '暂无摘要'
}
