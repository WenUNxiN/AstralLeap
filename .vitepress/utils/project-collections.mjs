import { readFileSync } from 'node:fs'
import { basename, dirname, isAbsolute, relative, resolve } from 'node:path'
import { projectLink, projectPageKey } from './project-links.mjs'

function sidebarLinks(items) {
  if (!Array.isArray(items)) return []
  return items.flatMap(item => item && typeof item === 'object' ? [
    ...(typeof item.link === 'string' ? [item.link] : []),
    ...sidebarLinks(item.items),
  ] : [])
}

/**
 * Runs only in Node via the VitePress data loader. Markdown is used to select
 * real entry pages; article sources and sidebar configuration never ship in
 * the project card data sent to the browser.
 */
export function collectProjectCards(files) {
  const normalized = [...new Set(files.map(file => resolve(file)))]
  const configs = normalized.filter(file => basename(file) === 'project.json')
  const cards = configs.flatMap(file => {
    const root = dirname(file)
    const folder = basename(root)
    const data = JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
    const base = `/projects/${folder}/`
    let link = typeof data.link === 'string' && data.link.trim()
      ? projectLink(base, data.link.trim()) : ''

    if (!link) {
      const documents = normalized.filter(candidate => {
        const path = relative(root, candidate).replace(/\\/g, '/')
        return path.endsWith('.md') && !path.startsWith('../') && !isAbsolute(path)
      }).map(candidate => relative(root, candidate).replace(/\\/g, '/'))
        .sort((a, b) => a.localeCompare(b, 'zh-CN', { numeric: true }))
      const pages = new Map(documents.map(path => {
        const target = base + path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
        return [projectPageKey(target), target]
      }))
      const configured = sidebarLinks(data.sidebar).map(target => projectLink(base, target))
        .find(target => pages.has(projectPageKey(target)))
      link = documents.includes('index.md') ? base : configured || pages.values().next().value || ''
    }
    // A configuration without an entry page does not create a broken card.
    if (!link) return []
    const number = (folder.match(/^(\d+)/)?.[1] || '').padStart(2, '0')
    return [{
      folder, number, link,
      name: data.name, icon: data.icon, gradient: data.gradient,
      tech: data.tech, desc: data.desc, status: data.status, statusColor: data.statusColor,
    }]
  })
  return cards.sort((a, b) => Number(b.folder.match(/^(\d+)/)?.[1] || 0) - Number(a.folder.match(/^(\d+)/)?.[1] || 0)
    || a.folder.localeCompare(b.folder, 'zh-CN', { numeric: true }))
}
