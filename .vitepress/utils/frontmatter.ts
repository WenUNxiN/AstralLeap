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
  // A closing fence may be longer than its opener; an unclosed fence consumes
  // the rest of the document. Never use headings inside examples as page titles.
  let fence: { marker: string; length: number } | undefined
  body = body.split('\n').map(line => {
    if (fence) {
      const close = line.match(/^ {0,3}(`+|~+)[\t ]*$/)
      if (close && close[1][0] === fence.marker && close[1].length >= fence.length) fence = undefined
      return ''
    }
    const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/)
    if (open && (open[1][0] !== '`' || !open[2].includes('`'))) {
      fence = { marker: open[1][0], length: open[1].length }
      return ''
    }
    return line
  }).join('\n')
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
