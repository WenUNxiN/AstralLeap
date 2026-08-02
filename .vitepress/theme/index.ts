import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import "./style.css"
import StarfieldBackground from "../components/StarfieldBackground.vue"
import BackToTop from "../components/BackToTop.vue"

const SocialIcons = {
  render() {
    const links = [
      { href: "https://space.bilibili.com/242636527", icon: "bilibili", label: "B站" },
      { href: "https://github.com/WenUNxiN", icon: "github", label: "GitHub" },
      { href: "https://oshwhub.com/eda_vmqaugwah/works", icon: "lcsc", label: "立创" }
    ]
    return h("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginLeft: "12px", marginRight: "12px", paddingLeft: "12px", borderLeft: "1px solid var(--vp-c-divider)" } },
      links.map(l => h("a", {
        href: l.href,
        target: "_blank",
        title: l.label,
        class: "social-icon-link",
        style: { display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px" }
      }, [
        h("img", {
          src: `/AstralLeap/icons/${l.icon}.png`,
          alt: l.label,
          class: "social-icon-img",
          style: { width: "20px", height: "20px", display: "block" }
        })
      ]))
    )
  }
}

// 不蒜子访问量统计（单一加载源）
const SiteFooter = {
  mounted() {
    if (typeof window === 'undefined') return
    if (window.__busuanzi_loaded) return
    window.__busuanzi_loaded = true

    const script = document.createElement('script')
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    script.async = true
    document.body.appendChild(script)
  },
  render() {
    return h("footer", { class: "site-footer" }, [
      h("div", { class: "footer-divider" }),
      h("div", { class: "footer-content" }, [
        h("div", { class: "footer-row" }, [
          h("span", { class: "footer-copyright" }, "© 2026 Stellan W"),
          
        ]),
        h("div", { class: "footer-row footer-stats" }, [
          h("span", { class: "stat-pill" }, [
            h("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "2", class: "stat-icon" }, [
              h("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
              h("circle", { cx: "12", cy: "12", r: "3" })
            ]),
            h("span", { id: "busuanzi_value_site_pv" }, "--"), " 次访问"
          ]),
          h("span", { class: "stat-pill" }, [
            h("svg", { viewBox: "0 0 24 24", width: "14", height: "14", fill: "none", stroke: "currentColor", strokeWidth: "2", class: "stat-icon" }, [
              h("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }),
              h("circle", { cx: "9", cy: "7", r: "4" }),
              h("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }),
              h("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })
            ]),
            h("span", { id: "busuanzi_value_site_uv" }, "--"), " 位访客"
          ])
        ]),
        h("div", { class: "footer-row footer-tagline" }, "以星为向，以技为跃 ✦ Astral Leap")
      ])
    ])
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => h(StarfieldBackground),
      "nav-bar-content-after": () => h(SocialIcons),
      "layout-bottom": () => h(SiteFooter),
      "doc-after": () => h(BackToTop)
    })
  },
  enhanceApp({ app, router }) {
    router.onAfterRouteChanged = () => { window.scrollTo({ top: 0, behavior: "smooth" }) }
  }
} satisfies Theme
