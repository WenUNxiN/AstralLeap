// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'nav-bar-title': () => h('div', {
        class: 'custom-logo',
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, [
        h('img', {
          src: '/logo.png',
          alt: '星跃 | Astral Leap',
          style: {
            height: '24px',
            width: 'auto'
          }
        }),
        h('span', '星跃 | Astral Leap')
      ]),
      'layout-bottom': () => h('div', {
        class: 'visitor-counter',
        style: {
          textAlign: 'center',
          padding: '20px',
          fontSize: '14px',
          color: 'var(--vp-c-text-2)'
        }
      }, [
        h('script', {
          src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
          async: 'true'
        }),
        h('span', {
          id: 'busuanzi_container_site_pv',
          style: { marginRight: '20px' }
        }, [
          '总访问量：',
          h('span', {
            id: 'busuanzi_value_site_pv',
            style: { fontWeight: 'bold' }
          })
        ]),
        h('span', {
          id: 'busuanzi_container_site_uv',
          style: { marginLeft: '20px' }
        }, [
          '总访客数：',
          h('span', {
            id: 'busuanzi_value_site_uv',
            style: { fontWeight: 'bold' }
          })
        ])
      ])
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme

// // 1. 导入 vitepress 主题
// import Theme from '@escook/vitepress-theme'
// // 2. 导入配套的 CSS 样式（此步骤不能省略）
// import '@escook/vitepress-theme/style.css'

// // 3. 把"导入"的主题"默认导出"即可
// export default Theme
