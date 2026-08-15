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
      return [{ text: json.name || dir, collapsed: false, items: addBase(json.sidebar) }]
    }
  } catch (e) { console.warn('Failed:', dir) }
  return [{ text: dir, collapsed: false, items: [] }]
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
  markdown: {
    config(md) {
      /* 代码块文件名标题：```bash title="build.sh" 语法 → 在包装 div 内注入 <span class="title"> */
      const originalFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const rendered = originalFence(tokens, idx, options, env, self)
        const info = tokens[idx].info || ''
        const m = info.match(/title\s*=\s*"([^"]*)"/)
        if (!m) return rendered
        let title = m[1]
        try { title = decodeURIComponent(title) } catch { /* 保留原文 */ }
        const escaped = md.utils.escapeHtml(title)
        return rendered.replace(
          /(<div class="language-[^"]*"[^>]*>)/,
          `$1<span class="title">${escaped}</span>`
        )
      }
    }
  },
  themeConfig: {
    logo: '/logo.png',
    outline: { label: '页面大纲', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { navigateText: '切换', selectText: '选择', closeText: '关闭', searchByText: '搜索提供者' }
          }
        }
      }
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '项目', link: '/projects/' },
      { text: '博客', link: '/blog/' },
    ],
    sidebar: (() => {
      const sidebar = {}
      const dirs = getSortedProjectDirs()
      for (const dir of dirs) {
        sidebar['/projects/' + dir + '/'] = getProjectSidebar(dir)
      }
      sidebar['/blog/'] = [{ text: '📝 技术博客', items: [
        { text: '🏠 博客首页', link: '/blog/' },
        { text: '💻 嵌入式软件', link: '/blog/categories/embedded-sw' },
        { text: '🔌 硬件设计', link: '/blog/categories/hardware-design' },
        { text: '📦 项目复盘', link: '/blog/categories/projects' },
        { text: '✍️ 随笔/工具', link: '/blog/categories/essays-tools' },
      ]}]
      return sidebar
    })(),
  },
})