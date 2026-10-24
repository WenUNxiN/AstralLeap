import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const origin = 'https://site.invalid'
const decodeEntities = value => value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, entity => {
  const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' }
  if (!entity.startsWith('&#')) return named[entity.toLowerCase()]
  const code = entity[2].toLowerCase() === 'x' ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10)
  return code <= 0x10ffff ? String.fromCodePoint(code) : entity
})
const isFile = file => { try { return statSync(file).isFile() } catch { return false } }
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)])

/** Inspect rendered HTML, including links emitted by Vue cards and navigation. */
export function checkSiteLinks(outDir, base = '/') {
  const root = resolve(outDir)
  const pages = walk(root).filter(file => file.endsWith('.html'))
  const errors = []
  const ids = new Map()
  let checked = 0
  const htmlOf = file => readFileSync(file, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>')
  const attributes = tag => [...tag.matchAll(/\s([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(match => [match[1].toLowerCase(), decodeEntities(match[2] ?? match[3] ?? match[4])])
  const tagsOf = html => html.match(/<[a-z][\w:-]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) || []
  const idsOf = file => {
    if (!ids.has(file)) ids.set(file, new Set(tagsOf(htmlOf(file)).flatMap(tag => attributes(tag)
      .filter(([name]) => name === 'id' || /^<a\b/i.test(tag) && name === 'name').map(([, value]) => value))))
    return ids.get(file)
  }

  for (const file of pages) {
    const page = relative(root, file).replaceAll('\\', '/')
    const pageUrl = new URL(base + page, origin)
    for (const tag of tagsOf(htmlOf(file))) {
      for (const [name, value] of attributes(tag)) {
        if (!['href', 'src'].includes(name) || !value || /^(?:data:|mailto:|tel:|javascript:)/i.test(value)) continue
        let url
        try { url = new URL(value, pageUrl) } catch {
          errors.push({ page, link: value, reason: '无效 URL' })
          continue
        }
        if (url.origin !== origin) continue
        checked++
        if (!url.pathname.startsWith(base)) {
          errors.push({ page, link: value, reason: `链接超出站点 base ${base}` })
          continue
        }
        let pathname, fragment
        try {
          pathname = decodeURIComponent(url.pathname.slice(base.length))
          fragment = decodeURIComponent(url.hash.slice(1).split(':~:')[0])
        } catch {
          errors.push({ page, link: value, reason: '无效 URL 编码' })
          continue
        }
        const target = resolve(root, pathname)
        // URL-encoded traversal should receive the same check as ordinary paths.
        if (target !== root && !target.startsWith(root + (process.platform === 'win32' ? '\\' : '/'))) {
          errors.push({ page, link: value, reason: '链接超出构建目录' })
          continue
        }
        const destination = [target, target + '.html', join(target, 'index.html')].find(isFile)
        if (!destination) errors.push({ page, link: value, reason: '目标文件不存在' })
        else if (fragment && fragment.toLowerCase() !== 'top' && destination.endsWith('.html') && !idsOf(destination).has(fragment)) {
          errors.push({ page, link: value, reason: `锚点不存在：${fragment}` })
        }
      }
    }
  }
  return { pages: pages.length, checked, errors }
}
