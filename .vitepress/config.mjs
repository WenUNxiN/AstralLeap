import { defineConfig } from 'vitepress'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'node:url'
import { createSidebar, sidebarContentPlugin } from './utils/sidebar.mjs'

const SITE_BASE = '/AstralLeap/'
const SITE_ORIGIN = 'https://wenunxin.github.io'
const SOURCE_DIR = fileURLToPath(new URL('../src/', import.meta.url))

/* ===== 中文搜索分词 =====
 * minisearch 默认按空白/标点切分，对中文几乎无效（整句成一个 token）。
 * 连续 CJK 串按相邻双字重叠切分；单字词保留为单字 token。
 * 拉丁/数字串整体成词并小写化，控制索引体积。
 */
function cjkTokenize(text) {
  const tokens = []
  const runs = String(text).match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+|[A-Za-z0-9_]+/g) || []
  for (const run of runs) {
    // VitePress 会将函数序列化到浏览器，不能引用模块作用域的常量。
    if (!/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(run)) {
      tokens.push(run.toLowerCase())
      continue
    }
    if (run.length === 1) tokens.push(run)
    else for (let i = 0; i < run.length - 1; i++) tokens.push(run.slice(i, i + 2))
  }
  return tokens
}
function cjkProcessTerm(term) {
  return typeof term === 'string' ? term.toLowerCase() : null
}

export default defineConfig({
  srcDir: 'src',
  base: SITE_BASE,
  lang: 'zh-CN',
  title: "星跃 | Astral Leap",
  description: "Stellan W 的技术探索知识花园，记录学习、实验、项目与思考，让知识随探索持续生长。",
  vite: { plugins: [sidebarContentPlugin(SOURCE_DIR)] },
  head: [['link', { rel: 'icon', href: `${SITE_BASE}favicon.ico` }]],
  sitemap: {
    hostname: `${SITE_ORIGIN}${SITE_BASE}`,
    // 404 错误页不应被主动索引
    transformItems: (items) => items.filter((i) => !i.url.includes('404')),
  },
  // 读取 git 时间戳，在文档页脚显示最后更新时间（deploy 已设 fetch-depth: 0）
  lastUpdated: true,
  // 社交分享预览（OpenGraph / Twitter 卡片）
  transformHead({ pageData, siteData, title, description }) {
    const origin = SITE_ORIGIN
    const relativeUrl = pageData.relativePath
      .replace(/(^|\/)index\.md$/, '$1')
      .replace(/\.md$/, '.html')
      .split('/')
      .map(encodeURIComponent)
      .join('/')
    const url = origin + siteData.base + relativeUrl
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
  // Keep robots.txt paths in sync with the configured GitHub Pages base.
  buildEnd(siteConfig) {
    const base = siteConfig.site.base
    writeFileSync(join(siteConfig.outDir, 'robots.txt'), [
      'User-agent: *',
      'Allow: /',
      '',
      '# Sitemap',
      `Sitemap: ${SITE_ORIGIN}${base}sitemap.xml`,
      '',
      'Crawl-delay: 1',
      '',
      '# Disallow private paths',
      `Disallow: ${base}404.html`,
      '',
    ].join('\n'))
  },
  markdown: {
    // Shiki 没有内置 DTS / Kconfig 语法，映射到相近的内置语法以保留代码高亮并消除回退警告。
    languageAlias: {
      dts: 'c',
      kconfig: 'make',
    },
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
    sidebarMenuLabel: '浏览目录',
    mobileMenuLabel: '导航菜单',
    navMenuLabel: '主导航',
    extraMenuLabel: '更多选项',
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换为浅色模式',
    darkModeSwitchTitle: '切换为深色模式',
    returnToTopLabel: '返回顶部',
    skipToContentLabel: '跳转到正文',
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新于' },
    search: {
      provider: 'local',
      options: {
        // 搜索索引只收录正文与代码块标题，跳过冗长的代码内容以缩小索引。
        async _render(src, env, md) {
          const html = await md.renderAsync(src, env)
          if (env.frontmatter?.search === false) return ''
          return html.replace(
            /<div class="language-[^"]*"[^>]*>([\s\S]*?)<\/div>/g,
            (block, contents) => contents.match(/<span class="title">([\s\S]*?)<\/span>/)?.[1] || ''
          )
        },
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '关闭搜索',
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
    sidebar: createSidebar(SOURCE_DIR),
  },
})
