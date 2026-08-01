import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // ⚠️ 迁移到云服务器时改为 base: '/'
  base: '/AstralLeap/',
  
  lang: 'zh-CN',
  title: "星跃 | Astral Leap",
  description: "嵌入式工程师 Stellan W 的个人博客 — 以星为向，以技为跃。分享嵌入式开发、硬件设计、LVGL、边缘AI等技术实践。",

  head: [
    ['link', { rel: 'shortcut icon', href: '/AstralLeap/favicon.ico' }],
    ['link', { rel: 'icon', href: '/AstralLeap/favicon.ico' }],

    // SEO
    ['meta', { name: 'keywords', content: '嵌入式,MCU,RTOS,LVGL,硬件设计,RV1106,Linux,边缘AI,交叉编译,泰山派,Luckfox' }],
    ['meta', { name: 'author', content: 'Stellan W' }],
    ['meta', { name: 'robots', content: 'index, follow' }],

    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '星跃 | Astral Leap' }],
    ['meta', { property: 'og:description', content: '以星为向，以技为跃 — 嵌入式开发技术博客' }],
    ['meta', { property: 'og:image', content: '/AstralLeap/logo.png' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '星跃 | Astral Leap' }],
    ['meta', { name: 'twitter:description', content: '以星为向，以技为跃 — 嵌入式开发技术博客' }],
    ['meta', { name: 'twitter:image', content: '/AstralLeap/logo.png' }],
  ],

  themeConfig: {
    logo: '/logo.png',

    outline: {
      label: '页面大纲',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    footer: {
      message: '以星为向，以技为跃',
      copyright: `Copyright © ${new Date().getFullYear()} Stellan W`,
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            displayDetails: '显示详情',
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              navigateText: '切换',
              selectText: '选择',
              closeText: '关闭',
              searchByText: '搜索提供者'
            }
          }
        }
      }
    },

    nav: [
      { text: '主页', link: '/', activeMatch: '^/$' },
      {
        text: '项目',
        activeMatch: '^/projects/',
        items: [
          { text: '项目总览', link: '/projects/' },
          { text: '智能手表 星序', link: '/projects/智能手表 星序AstralOrder/智能手表 星序AstralOrder' },
          { text: '新项目', link: '/projects/新项目/项目介绍' },
        ]
      },
      { text: '关于我', link: '/about/' },
      { text: '博客', link: '/blog/' },
    ],

    sidebar: {
      '/projects/': [
        {
          text: '项目展示',
          items: [
            { text: '项目总览', link: '/projects/' },
            { text: '智能手表 星序', link: '/projects/智能手表 星序AstralOrder/智能手表 星序AstralOrder' },
            { text: '新项目', link: '/projects/新项目/项目介绍' },
          ]
        }
      ],
      '/projects/智能手表 星序AstralOrder/': [
        {
          text: '智能手表 星序AstralOrder',
          items: [
            { text: '项目介绍', link: '/projects/智能手表 星序AstralOrder/智能手表 星序AstralOrder' },
            {
              text: '用户操作说明',
              collapsed: false,
              items: [
                { text: '硬件操作', link: '/projects/智能手表 星序AstralOrder/硬件操作' },
                { text: '手机客户端', link: '/projects/智能手表 星序AstralOrder/手机客户端' },
                { text: '常见问题', link: '/projects/智能手表 星序AstralOrder/常见问题' }
              ]
            },
            {
              text: '技术资料',
              collapsed: false,
              items: [
                { text: '硬件规格', link: '/projects/智能手表 星序AstralOrder/硬件规格' },
                { text: '软件架构', link: '/projects/智能手表 星序AstralOrder/软件架构' },
                { text: '开发指南', link: '/projects/智能手表 星序AstralOrder/开发指南' }
              ]
            },
            {
              text: '其他说明',
              collapsed: false,
              items: [
                { text: '版本更新', link: '/projects/智能手表 星序AstralOrder/版本更新' },
                { text: '免责声明', link: '/projects/智能手表 星序AstralOrder/免责声明' }
              ]
            },
            { text: '讨论区', link: '/projects/智能手表 星序AstralOrder/讨论区' }
          ]
        }
      ],
      '/projects/新项目/': [
        {
          text: '新项目',
          items: [
            { text: '项目介绍', link: '/projects/新项目/项目介绍' },
            { text: '功能说明', link: '/projects/新项目/功能说明' },
            { text: '讨论区', link: '/projects/新项目/讨论区' }
          ]
        }
      ],
      '/blog/': [
        {
          text: '技术博客',
          items: [
            { text: '博客首页', link: '/blog/' },
            {
              text: '文章分类',
              collapsed: false,
              items: [
                { text: '嵌入式软件', link: '/blog/categories/embedded-sw' },
                { text: '硬件设计', link: '/blog/categories/hardware-design' },
                { text: '项目复盘', link: '/blog/categories/projects' },
                { text: '随笔/工具', link: '/blog/categories/essays-tools' }
              ]
            }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WenUNxiN' }
    ]
  },

  vite: {
    ssr: {
      noExternal: ['@escook/vitepress-theme', 'vitepress']
    }
  },

  // 站点地图（迁移到云服务器后改为实际域名）
  sitemap: {
    hostname: 'https://your-domain.com'
  }
})
