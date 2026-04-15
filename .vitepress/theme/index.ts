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

// // 3. 把“导入”的主题“默认导出”即可
// export default Theme