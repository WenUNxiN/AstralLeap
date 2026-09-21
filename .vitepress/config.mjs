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
        const m = info.match(/title\s*=\s*["']([^"']*)["']/)
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
      { text: '知识库', link: '/knowledge/' },
      { text: '实验', link: '/experiments/' },
      { text: '速查', link: '/cheatsheet/' },
      { text: '关于', link: '/about' },
    ],
    sidebar: (() => {
      const sidebar = {}
      const dirs = getSortedProjectDirs()
      for (const dir of dirs) {
        sidebar['/projects/' + dir + '/'] = getProjectSidebar(dir)
      }
      // 知识库侧边栏（自动发现分类，但侧边栏手动维护，确保排序可控）
      sidebar['/knowledge/'] = [{ text: '📚 技术知识库', items: [
        { text: '🏠 知识库首页', link: '/knowledge/' },
        { text: '🐧 Linux 系统编程', link: '/knowledge/linux/' },
        { text: '🔌 驱动开发', link: '/knowledge/driver/' },
        { text: '📷 Camera / V4L2', link: '/knowledge/camera/' },
        { text: '🎬 视频编解码', link: '/knowledge/video/' },
        { text: '🎵 音频', link: '/knowledge/audio/' },
        { text: '🤖 AI / NPU', link: '/knowledge/ai/' },
        { text: '📡 网络 / RTSP', link: '/knowledge/network/' },
        { text: '✍️ 思考随笔', link: '/knowledge/thoughts/' },
      ]}]

      // 实验记录侧边栏
      sidebar['/experiments/'] = [{ text: '🧪 实验记录', items: [
        { text: '🏠 实验首页', link: '/experiments/' },
        { text: '📺 最新实验', link: '/experiments/#最新实验' },
      ]}]

      // 命令速查侧边栏
      sidebar['/cheatsheet/'] = [{ text: '⚡ 命令速查', items: [
        { text: '🏠 速查首页', link: '/cheatsheet/' },
        { text: '🐧 Linux', link: '/cheatsheet/linux' },
        { text: '📷 V4L2', link: '/cheatsheet/v4l2' },
        { text: '🎬 FFmpeg', link: '/cheatsheet/ffmpeg' },
        { text: '🌿 Git', link: '/cheatsheet/git' },
      ]}]

      // Debug 记录侧边栏
      sidebar['/debug/'] = [{ text: '🐛 Debug 记录', items: [
        { text: '🏠 Debug 首页', link: '/debug/' },
        { text: '📷 Camera', link: '/debug/camera' },
        { text: '📺 V4L2', link: '/debug/v4l2' },
        { text: '🎬 MPP', link: '/debug/mpp' },
      ]}]

      return sidebar
    })(),
  },
})