import { defineConfig } from 'vitepress'
import { readdirSync, statSync, readFileSync, existsSync } from 'fs'
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

/* ===== 中文搜索分词 =====
 * minisearch 默认按空白/标点切分，对中文几乎无效（整句成一个 token）。
 * 这里对连续 CJK 串生成「单字 + 相邻双字」token，兼顾召回与精度；
 * 拉丁/数字串整体成词并小写化。
 */
const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/
function cjkTokenize(text) {
  const tokens = []
  const runs = String(text).match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+|[A-Za-z0-9_]+/g) || []
  for (const run of runs) {
    if (!CJK_RE.test(run)) {
      tokens.push(run.toLowerCase())
      continue
    }
    for (let i = 0; i < run.length; i++) {
      tokens.push(run[i])
      if (i + 1 < run.length) tokens.push(run[i] + run[i + 1])
    }
  }
  return tokens
}
function cjkProcessTerm(term) {
  return typeof term === 'string' ? term.toLowerCase() : null
}

/* 构建期校验：knowledge/ 下每个分类目录都应出现在知识库侧边栏中。
 * 分类卡片/标签是自动发现的，但侧边栏手动维护（控制排序），
 * 新增分类时容易只出现卡片而漏加侧边栏，这里提前警告。 */
function warnKnowledgeSidebarDrift(sidebarItems) {
  try {
    const knowledgeDir = join(process.cwd(), 'knowledge')
    const diskDirs = readdirSync(knowledgeDir).filter(d => {
      const p = join(knowledgeDir, d)
      return statSync(p).isDirectory() && existsSync(join(p, 'index.md'))
    })
    const listed = new Set(
      sidebarItems
        .map(i => (i.link || '').replace(/^\/knowledge\//, '').replace(/\/$/, ''))
        .filter(Boolean)
    )
    for (const dir of diskDirs) {
      if (!listed.has(dir)) {
        console.warn(`[sidebar] 知识分类 "${dir}" 存在于 knowledge/ 但未加入侧边栏，请补充 .vitepress/config.mjs`)
      }
    }
  } catch (e) { /* 校验失败不应阻断构建 */ }
}

export default defineConfig({
  base: '/AstralLeap/',
  lang: 'zh-CN',
  title: "星跃 | Astral Leap",
  description: "嵌入式工程师 Stellan W 的个人博客",
  head: [['link', { rel: 'icon', href: '/AstralLeap/favicon.ico' }]],
  sitemap: {
    hostname: 'https://wenunxin.github.io/AstralLeap/',
    // 404 错误页与 doc/ 内部历史方案不应被主动索引
    // 注：此处 url 为不含前导斜杠的相对路径（如 doc/xxx.html）
    transformItems: (items) =>
      items.filter((i) => !i.url.includes('404') && !/(^|\/)doc\//.test(i.url)),
  },
  // 读取 git 时间戳，在文档页脚显示最后更新时间（deploy 已设 fetch-depth: 0）
  lastUpdated: true,
  // doc/ 为个人优化方案历史稿，不属于站点内容，不生成页面
  srcExclude: ['doc/**'],
  // 社交分享预览（OpenGraph / Twitter 卡片）
  transformHead({ pageData, siteData, title, description }) {
    const origin = 'https://wenunxin.github.io'
    const url = origin + siteData.base + pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '.html')
    return [
      ['meta', { property: 'og:site_name', content: siteData.title }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: origin + siteData.base + 'logo.png' }],
      ['meta', { name: 'twitter:card', content: 'summary' }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  },
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
    lastUpdated: { text: '最后更新于' },
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
        },
        miniSearch: {
          options: {
            tokenize: cjkTokenize,
            processTerm: cjkProcessTerm,
          },
        },
      }
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '项目', link: '/projects/' },
      { text: '知识库', link: '/knowledge/' },
      { text: '实验', link: '/experiments/' },
      { text: 'Debug', link: '/debug/' },
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
      warnKnowledgeSidebarDrift(sidebar['/knowledge/'][0].items)

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