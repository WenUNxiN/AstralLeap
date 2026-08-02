import { h } from "vue"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import "./style.css"
import StarfieldBackground from "../components/StarfieldBackground.vue"

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
        style: { display: "flex", alignItems: "center", justifyContent: "center", width: "28px", height: "28px" }
      }, [
        h("img", {
          src: `/AstralLeap/icons/${l.icon}.png`,
          alt: l.label,
          style: { width: "20px", height: "20px", display: "block" }
        })
      ]))
    )
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => h(StarfieldBackground),
      "nav-bar-content-after": () => h(SocialIcons),
      "layout-bottom": () => h("div", {
        style: { textAlign: "center", padding: "24px", fontSize: "13px", color: "var(--vp-c-text-3)", borderTop: "1px solid var(--vp-c-divider)" }
      }, [
        h("span", { id: "busuanzi_container_site_pv", style: { marginRight: "20px" } }, ["👁️ 总访问量：", h("span", { id: "busuanzi_value_site_pv" })]),
        h("span", { id: "busuanzi_container_site_uv" }, ["👤 总访客：", h("span", { id: "busuanzi_value_site_uv" })])
      ])
    })
  },
  enhanceApp({ app, router }) {
    router.onAfterRouteChanged = () => { window.scrollTo({ top: 0, behavior: "smooth" }) }
  }
} satisfies Theme