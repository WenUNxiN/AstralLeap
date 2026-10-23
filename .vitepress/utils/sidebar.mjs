import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { createMarkdownRenderer, disposeMdItInstance } from 'vitepress'

// Reuse VitePress's public frontmatter parser, rendering only the YAML block.
// Release its global cache so the site's actual Markdown options initialize later.
const frontmatterRenderer = await createMarkdownRenderer('', { highlight: () => '' })
disposeMdItInstance()

export function cleanSidebarText(value) {
  return String(value || '').replace(/^(?:[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\uFE0E\u200D]|\s)+/u, '').trim()
}

function directories(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
}

function markdownFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = join(dir, entry.name)
    return entry.isDirectory() ? markdownFiles(file) : entry.isFile() && entry.name.endsWith('.md') ? [file] : []
  })
}

function documentInfo(file, srcDir) {
  const source = readFileSync(file, 'utf8').replace(/^\uFEFF/, '')
  const frontmatter = source.match(/^---[\t ]*\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)[\t ]*(?:\r?\n|$)/)?.[0] || ''
  const env = {}
  frontmatterRenderer.render(frontmatter, env)
  const meta = env.frontmatter || {}
  const path = relative(srcDir, file).replace(/\\/g, '/')
  const slug = path.split('/').at(-1).replace(/\.md$/, '')
  return {
    ...meta,
    path,
    slug,
    text: cleanSidebarText(meta.title || slug),
    link: '/' + path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html'),
    isIndex: slug === 'index',
  }
}

function byDateAndNumber(a, b) {
  const dateValue = value => {
    const date = value instanceof Date ? value.getTime() : Date.parse(value || '')
    return Number.isNaN(date) ? -Infinity : date
  }
  const left = dateValue(a.date)
  const right = dateValue(b.date)
  if (left !== right) return right - left
  const number = value => Number(value.slug.match(/^(\d+)/)?.[1] || 0)
  return number(b) - number(a) || a.text.localeCompare(b.text, 'zh-CN', { numeric: true }) || a.path.localeCompare(b.path)
}

function leaf(doc, showNumber = false) {
  const number = showNumber && doc.slug.match(/^(\d+)/)?.[1]
  return { text: number ? `#${number} · ${doc.text}` : doc.text, link: doc.link }
}

function projectLink(base, target) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(target)) return target
  const link = target.startsWith('/') ? target : base + target
  const [, path, suffix = ''] = link.match(/^([^?#]*)([?#].*)?$/)
  if (!path || path.endsWith('/') || /\.[a-z\d]+$/i.test(path) && !path.endsWith('.md')) return link
  return path.replace(/\.md$/, '') + '.html' + suffix
}

function projectSidebar(srcDir, dir) {
  const file = join(srcDir, 'projects', dir, 'project.json')
  if (!existsSync(file)) return [{ text: cleanSidebarText(dir), collapsed: false, items: [] }]
  const project = JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
  const base = `/projects/${dir}/`
  const mapItems = items => items.map(item => ({
    ...item,
    text: cleanSidebarText(item.text),
    ...(item.link ? { link: projectLink(base, item.link) } : {}),
    ...(item.items ? { items: mapItems(item.items) } : {}),
  }))
  return [{ text: cleanSidebarText(project.name || dir), collapsed: false, items: mapItems(project.sidebar || []) }]
}

function recordSidebar(srcDir, section, label, showNumber = false) {
  const docs = markdownFiles(join(srcDir, section)).map(file => documentInfo(file, srcDir)).filter(doc => doc.path !== `${section}/index.md`)
  const indexes = docs.filter(doc => doc.isIndex || doc.categoryPage === true).sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))
  const records = docs.filter(doc => !doc.isIndex && doc.categoryPage !== true).sort(byDateAndNumber)
  return [{ text: label, link: `/${section}/`, items: [
    ...indexes.map(doc => leaf(doc)),
    ...records.map(doc => leaf(doc, showNumber)),
  ] }]
}

function debugSidebar(srcDir) {
  const docs = markdownFiles(join(srcDir, 'debug')).map(file => documentInfo(file, srcDir)).filter(doc => doc.path !== 'debug/index.md')
  const indexes = docs.filter(doc => doc.categoryPage === true || doc.isIndex).sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'))
  const records = docs.filter(doc => doc.categoryPage !== true && !doc.isIndex).sort(byDateAndNumber)
  const groups = indexes.map(doc => ({ doc, records: [] }))
  const ungrouped = []
  for (const doc of records) {
    const categories = Array.isArray(doc.category) ? doc.category : [doc.category]
    const match = categories.map(category => groups.find(group => group.doc.slug.toLowerCase() === String(category || '').toLowerCase())).find(Boolean)
    if (match) match.records.push(doc)
    else ungrouped.push(doc)
  }
  return [{ text: 'Debug 记录', link: '/debug/', items: [
    ...groups.map(group => ({ ...leaf(group.doc), ...(group.records.length ? { collapsed: true, items: group.records.map(doc => leaf(doc)) } : {}) })),
    ...(ungrouped.length ? [{ text: '其他记录', collapsed: false, items: ungrouped.map(doc => leaf(doc)) }] : []),
  ] }]
}

export function createSidebar(srcDir) {
  const sidebar = {}
  const projectDirs = directories(join(srcDir, 'projects')).sort((a, b) => Number(b.match(/^(\d+)/)?.[1] || 0) - Number(a.match(/^(\d+)/)?.[1] || 0) || a.localeCompare(b))
  for (const dir of projectDirs) sidebar[`/projects/${dir}/`] = projectSidebar(srcDir, dir)

  const categories = directories(join(srcDir, 'knowledge')).filter(dir => existsSync(join(srcDir, 'knowledge', dir, 'index.md'))).map(dir => {
    const home = documentInfo(join(srcDir, 'knowledge', dir, 'index.md'), srcDir)
    const docs = markdownFiles(join(srcDir, 'knowledge', dir)).filter(file => file !== join(srcDir, 'knowledge', dir, 'index.md')).map(file => documentInfo(file, srcDir)).sort(byDateAndNumber)
    return { dir, home, docs }
  }).sort((a, b) => b.docs.length - a.docs.length || a.home.text.localeCompare(b.home.text, 'zh-CN'))

  const knowledgeSidebar = activeDir => [{ text: '技术知识库', link: '/knowledge/', items: categories.map(category => ({
    ...leaf(category.home),
    ...(category.docs.length ? { collapsed: category.dir !== activeDir, items: category.docs.map(doc => leaf(doc)) } : {}),
  })) }]
  sidebar['/knowledge/'] = knowledgeSidebar(null)
  for (const category of categories) sidebar[`/knowledge/${category.dir}/`] = knowledgeSidebar(category.dir)
  sidebar['/experiments/'] = recordSidebar(srcDir, 'experiments', '实验记录', true)
  sidebar['/cheatsheet/'] = recordSidebar(srcDir, 'cheatsheet', '命令速查')
  sidebar['/debug/'] = debugSidebar(srcDir)
  return sidebar
}

// Frontmatter and added/removed Markdown files are not config import dependencies.
// Reuse VitePress's existing site object and invalidate its one site-data module.
export function sidebarContentPlugin(srcDir) {
  const root = resolve(srcDir)
  return {
    name: 'astralleap:sidebar-content',
    apply: 'serve',
    hotUpdate({ file, server }) {
      if (this.environment.name !== 'client') return
      const path = relative(root, file).replace(/\\/g, '/')
      if (!/^(?:knowledge|experiments|debug|cheatsheet)\/.*\.md$/.test(path) && !/^projects\/[^/]+\/project\.json$/.test(path)) return
      const site = server.config.vitepress?.site
      if (!site) return
      const nextSidebar = createSidebar(root)
      if (JSON.stringify(site.themeConfig.sidebar) === JSON.stringify(nextSidebar)) return
      site.themeConfig.sidebar = nextSidebar
      const graph = server.environments.client.moduleGraph
      const siteData = graph.getModuleById('/@siteData')
      if (siteData) graph.invalidateModule(siteData)
      server.ws.send({ type: 'full-reload', path: '*' })
    },
  }
}
