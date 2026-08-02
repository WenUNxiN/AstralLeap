import { defineConfig } from 'vitepress'
import { readdirSync, statSync, readFileSync } from 'fs'
import { join } from 'path'

function getProjectSidebar(dir) {
  try {
    const json = JSON.parse(readFileSync(join('projects', dir, 'project.json'), 'utf-8'))
    if (json.sidebar && json.sidebar.length > 0) {
      const base = '/projects/' + dir + '/'
      const addBase = (items) => items.map(item => {
        const result = { text: item.text }
        if (item.link) result.link = base + item.link
        if (item.collapsed !== undefined) result.collapsed = item.collapsed
        if (item.items) result.items = addBase(item.items)
        return result
      })
      return [{ text: dir.replace(/^[\d.]+\s*/, ''), collapsed: false, items: addBase(json.sidebar) }]
    }
  } catch (e) { console.warn('Failed:', dir) }
  return [{ text: dir.replace(/^[\d.]+\s*/, ''), collapsed: false, items: [] }]
}

function getSortedProjectDirs() {
  const projectsDir = join(process.cwd(), 'projects')
  const dirs = readdirSync(projectsDir).filter(d => statSync(join(projectsDir, d)).isDirectory())
  
  const getNum = (name) => {
    const m = name.match(/^(\d+)/)
    return m ? parseInt(m[1]) : 0
  }
  
  return dirs.sort((a, b) => getNum(b) - getNum(a))
}

export default defineConfig({
  base: '/AstralLeap/',
  lang: 'zh-CN',
  title: "星跃 | Astral Leap",
  description: "嵌入式工程师 Stellan W 的个人博客",
  head: [['link', { rel: 'icon', href: '/AstralLeap/favicon.ico' }]],
  themeConfig: {
    logo: '/logo.png',
    outline: { label: '页面大纲', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    footer: { message: '以星为向，以技为跃' },
    search: { provider: 'local' },
    nav: [
      { text: '主页', link: '/' },
      { text: '项目', link: '/projects/' },
      { text: '博客', link: '/blog/' },
    ],
    sidebar: (() => {
      const sidebar = {}
      const dirs = getSortedProjectDirs()
      console.log('Sorted project dirs:', dirs)
      for (const dir of dirs) {
        sidebar['/projects/' + dir + '/'] = getProjectSidebar(dir)
      }
      sidebar['/blog/'] = [{ text: '技术博客', items: [
        { text: '博客首页', link: '/blog/' },
        { text: '嵌入式软件', link: '/blog/categories/embedded-sw' },
        { text: '硬件设计', link: '/blog/categories/hardware-design' },
        { text: '项目复盘', link: '/blog/categories/projects' },
        { text: '随笔/工具', link: '/blog/categories/essays-tools' },
      ]}]
      return sidebar
    })(),
  },
})