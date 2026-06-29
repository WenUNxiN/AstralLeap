import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/AstralLeap/',
  lang: 'zh-CN',
  title: "星跃 | Astral Leap",
  description: "以星为向，以技为跃",
  head: [
    ['link', { rel: 'shortcut icon', href: '/AstralLeap/favicon.ico' }],
    ['link', { rel: 'icon', href: '/AstralLeap/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    outline: {
      label: '页面大纲'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
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
      { text: '主页', link: '/' },
      { text: '博客', link: '/blog/' },
    ],

    sidebar: {
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
  }
})