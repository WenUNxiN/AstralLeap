// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import StarfieldBackground from '../components/StarfieldBackground.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(StarfieldBackground),
      'layout-bottom': () => h('div', {
        class: 'visitor-counter',
        style: {
          textAlign: 'center',
          padding: '24px',
          fontSize: '13px',
          color: 'var(--vp-c-text-3)',
          borderTop: '1px solid var(--vp-c-divider)'
        }
      }, [
        h('span', {
          id: 'busuanzi_container_site_pv',
          style: { marginRight: '20px' }
        }, [
          '👁️ 总访问量：',
          h('span', {
            id: 'busuanzi_value_site_pv',
            style: { fontWeight: 'bold', color: 'var(--vp-c-brand-2)' }
          })
        ]),
        h('span', {
          id: 'busuanzi_container_site_uv'
        }, [
          '👤 总访客：',
          h('span', {
            id: 'busuanzi_value_site_uv',
            style: { fontWeight: 'bold', color: 'var(--vp-c-brand-2)' }
          })
        ])
      ])
    })
  },
  enhanceApp({ app, router, siteData }) {
    // 页面切换后滚动到顶部
    router.onAfterRouteChanged = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
} satisfies Theme
