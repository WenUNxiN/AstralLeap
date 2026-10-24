/** Shared vocabulary for navigation, content discovery and article context. */
export const sections = [
  { id: 'knowledge', label: '知识笔记', title: '知识库', path: '/knowledge/', icon: 'book', context: 'KNOWLEDGE NOTE', explore: true },
  { id: 'experiments', label: '实验记录', title: '实验记录', path: '/experiments/', icon: 'flask', context: 'LAB NOTE', explore: true },
  { id: 'debug', label: 'Debug 记录', title: 'Debug 记录', path: '/debug/', icon: 'bug', context: 'DEBUG LOG', explore: true },
  { id: 'cheatsheet', label: '命令速查', title: '命令速查', path: '/cheatsheet/', icon: 'terminal', context: 'QUICK REFERENCE', explore: true },
  { id: 'projects', label: '项目文档', title: '项目', path: '/projects/', icon: 'layers', context: 'PROJECT NOTE', explore: false },
] as const

export type Section = typeof sections[number]
export type SectionId = Section['id']
export const exploreSections = sections.filter(section => section.explore)
export type ExploreSectionId = typeof exploreSections[number]['id']

/** Accept a source-relative path or a URL path, with an optional deployment base. */
export function sectionForPath(path: string, base = '/'): Section | undefined {
  let pathname = String(path || '').replace(/\\/g, '/').split(/[?#]/, 1)[0]
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(pathname)) {
    try { pathname = new URL(pathname).pathname } catch { return undefined }
  }
  pathname = '/' + pathname.replace(/^\/+/, '')
  const prefix = '/' + base.replace(/^\/+|\/+$/g, '') + '/'
  if (prefix !== '//' && pathname.startsWith(prefix)) pathname = '/' + pathname.slice(prefix.length)
  const id = pathname.split('/')[1]
  return sections.find(section => section.id === id)
}
