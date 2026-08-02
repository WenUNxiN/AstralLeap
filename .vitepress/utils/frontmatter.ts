/**
 * 统一的 frontmatter 解析工具
 * 从 Markdown 文件内容中解析 YAML frontmatter
 */
export function getFrontmatter(content) {
  if (typeof content !== 'string') return {}
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*/)
  if (!match) return {}
  const fm = match[1]
  const result = {}
  let currentKey = ''
  let currentList = []
  const lines = fm.split('\n')

  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed === '') {
      if (currentKey && currentList.length > 0) {
        result[currentKey] = currentList
        currentKey = ''
        currentList = []
      }
      return
    }

    if (trimmed.startsWith('- ')) {
      if (currentKey) {
        currentList.push(trimmed.substring(2).replace(/^['"]|['"]$/g, ''))
      }
      return
    }

    if (currentKey && currentList.length > 0) {
      result[currentKey] = currentList
      currentKey = ''
      currentList = []
    }

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) return

    const key = line.substring(0, colonIndex).trim()
    const value = line.substring(colonIndex + 1).trim()

    if (value === '') {
      currentKey = key
      currentList = []
    } else if (value.startsWith('[') && value.endsWith(']')) {
      result[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      result[key] = value.replace(/^['"]|['"]$/g, '')
    }
  })

  if (currentKey && currentList.length > 0) {
    result[currentKey] = currentList
  }

  return result
}

/**
 * 估算阅读时间
 * 中文约 300 字/分钟，英文约 200 词/分钟
 */
export function estimateReadingTime(content) {
  if (typeof content !== 'string') return '1 分钟'
  const fmMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*/)
  const body = fmMatch ? content.substring(fmMatch[0].length) : content
  const chineseChars = (body.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = (body.match(/[a-zA-Z]+/g) || []).length
  const codeBlocks = (body.match(/```[\s\S]*?```/g) || []).join(' ')
  const codeLines = (codeBlocks.match(/\n/g) || []).length
  const minutes = Math.max(1, Math.ceil(chineseChars / 300 + englishWords / 200 + codeLines / 10))
  return minutes + ' 分钟'
}

/**
 * 提取文章摘要
 */
export function getExcerpt(content, maxLength = 150) {
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
