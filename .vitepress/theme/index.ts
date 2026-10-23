import { h } from "vue"
import { withBase } from "vitepress"
import type { Theme } from "vitepress"
import DefaultTheme from "vitepress/theme"
import "./style.css"
import "./sections.css"
import "./site.css"
import "./sidebar.css"
import StarfieldBackground from "../components/StarfieldBackground.vue"
import MicroInteractions from "../components/MicroInteractions.vue"
import Breadcrumb from "../components/Breadcrumb.vue"
import NotFound from "../components/NotFound.vue"
import SiteFooter from "../components/SiteFooter.vue"
import ArticleContext from "../components/ArticleContext.vue"
import VisitorCounter from "../components/VisitorCounter.vue"
import SidebarIntro from "../components/SidebarIntro.vue"

const SocialIcons = {
  render() {
    const links = [
      { href: "https://space.bilibili.com/242636527", icon: "bilibili", label: "B站" },
      { href: "https://github.com/WenUNxiN", icon: "github", label: "GitHub" },
      { href: "https://oshwhub.com/eda_vmqaugwah", icon: "lcsc", label: "立创" }
    ]
    return h("div", { class: "site-social-links" },
      links.map(l => h("a", {
        href: l.href,
        target: "_blank",
        rel: "noopener noreferrer",
        title: l.label,
        "aria-label": `${l.label}（在新标签页打开）`,
        class: "social-icon-link"
      }, [
        h("img", {
          src: withBase(`/icons/${l.icon}.png`),
          alt: l.label,
          class: "social-icon-img"
        })
      ]))
    )
  }
}

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      "layout-top": () => [h(StarfieldBackground), h(MicroInteractions), h(VisitorCounter)],
      "doc-before": () => [h(Breadcrumb), h(ArticleContext)],
      "doc-after": () => h(SiteFooter, { compact: true }),
      "sidebar-nav-before": () => h(SidebarIntro),
      "nav-bar-content-after": () => h(SocialIcons),
      "layout-bottom": () => h(SiteFooter),
      "not-found": () => h(NotFound)
    })
  },
  enhanceApp({ app, router }) {
    router.onAfterRouteChange = (to) => {
      if (typeof window === "undefined" || to.includes("#")) return
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }
} satisfies Theme
