// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
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
