import { sectionForPath } from './sections.ts'

export interface BreadcrumbItem {
  label: string
  url: string | null
}

interface KnowledgeCategory {
  dir: string
  name: string
  url: string
}

export function buildBreadcrumbs(relativePath: string, pageLabel: string, categories: KnowledgeCategory[] = []): BreadcrumbItem[] {
  const rel = relativePath.replace(/\\/g, '/')
  if (!rel || rel === 'index.md') return []
  const parts = rel.replace(/\.md$/, '').split('/')
  const isIndex = parts.at(-1) === 'index'
  if (rel === 'explore/index.md') return [{ label: '探索', url: null }]
  const descriptor = sectionForPath(rel)
  const section = descriptor ? { label: descriptor.title, url: descriptor.path } : parts[0] === 'doc' ? { label: '文档', url: null } : null
  if (!section) return isIndex ? [] : [{ label: pageLabel, url: null }]

  const isSectionIndex = isIndex && parts.length === 2
  const out: BreadcrumbItem[] = [
    ...(descriptor?.explore ? [{ label: '探索', url: '/explore/' }] : []),
    { ...section, url: isSectionIndex ? null : section.url }
  ]
  if (isSectionIndex) return out

  const isCategoryIndex = parts[0] === 'knowledge' && isIndex && parts.length === 3
  if (parts[0] === 'knowledge' && parts.length >= 3) {
    const category = categories.find(item => item.dir === parts[1])
    out.push({
      label: category?.name || (isCategoryIndex ? pageLabel : parts[1]),
      url: isCategoryIndex ? null : category?.url || `/knowledge/${parts[1]}/`
    })
  }
  if (!isCategoryIndex) out.push({ label: pageLabel, url: null })
  return out
}
