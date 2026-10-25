import { nextTick, shallowRef, type InjectionKey } from 'vue'
import type { Router } from 'vitepress'
import { sectionForPath } from './sections.ts'

interface ExploreReturn {
  href: string
  scrollY: number
  recordPath: string
  recordPaths: string[]
}
interface NavigationWindow {
  location: { href: string }
  readonly scrollY: number
  scrollTo(x: number, y: number): void
  sessionStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
}

/** Per-app state: SSR never shares a reader's location with another request. */
export function createExploreNavigation(router: Pick<Router, 'go' | 'onBeforeRouteChange' | 'onAfterRouteChange'>, base: string, browser?: NavigationWindow) {
  const returnTo = shallowRef<ExploreReturn | null>(null)
  const explorePath = base.replace(/\/?$/, '/') + 'explore/'
  const storageKey = 'astralleap:explore-return:' + base
  const isExplore = (url: URL) => url.pathname === explorePath
  const isRecord = (url: URL) => Boolean(sectionForPath(url.pathname, base)?.explore)
  const currentUrl = () => new URL(browser!.location.href)
  const persist = () => {
    try {
      if (returnTo.value) browser?.sessionStorage?.setItem(storageKey, JSON.stringify(returnTo.value))
      else browser?.sessionStorage?.removeItem(storageKey)
    } catch { /* Storage can be unavailable; in-page navigation still works. */ }
  }

  // Called after hydration so an SSR fallback href never disagrees with the client.
  function restore() {
    if (!browser || returnTo.value || !isRecord(currentUrl())) return
    try {
      const stored = JSON.parse(browser.sessionStorage?.getItem(storageKey) || 'null')
      if (!stored || typeof stored.href !== 'string') return
      const paths = (Array.isArray(stored.recordPaths) ? stored.recordPaths : [stored.recordPath])
        .filter((path: unknown): path is string => typeof path === 'string' && path.startsWith(base) && isRecord(new URL(path, currentUrl())))
      if (!paths.includes(currentUrl().pathname)) return
      const url = new URL(stored.href, currentUrl())
      if (url.origin !== currentUrl().origin || !isExplore(url) || !Number.isFinite(stored.scrollY) || stored.scrollY < 0) return
      returnTo.value = { href: url.pathname + url.search + url.hash, scrollY: stored.scrollY, recordPath: currentUrl().pathname, recordPaths: paths }
    } catch { /* A malformed or inaccessible saved entry should not affect reading. */ }
  }

  if (browser) {
    const before = router.onBeforeRouteChange
    router.onBeforeRouteChange = async href => {
      if (await before?.(href) === false) return false
      const from = currentUrl()
      const to = new URL(href, from)
      if (to.origin !== from.origin) return
      if (isExplore(from) && isRecord(to)) {
        returnTo.value = { href: from.pathname + from.search + from.hash, scrollY: browser.scrollY, recordPath: to.pathname, recordPaths: [to.pathname] }
        persist()
      } else if (isRecord(from) && isRecord(to)) {
        if (returnTo.value) {
          returnTo.value = { ...returnTo.value, recordPath: to.pathname, recordPaths: [...new Set([...returnTo.value.recordPaths, to.pathname])] }
          persist()
        }
      } else if (!(isRecord(from) && isExplore(to))) {
        returnTo.value = null
        persist()
      }
    }
    const after = router.onAfterRouteChange
    router.onAfterRouteChange = async href => {
      await after?.(href)
      const to = new URL(href, currentUrl())
      if (returnTo.value && isRecord(to)) {
        // Popstate skips the before hook. Only a visited page in this reading
        // chain inherits the saved result; unrelated old history entries do not.
        returnTo.value = returnTo.value.recordPaths.includes(to.pathname)
          ? { ...returnTo.value, recordPath: to.pathname } : null
        persist()
      }
    }
  }

  async function goBack(fallback: string) {
    const saved = returnTo.value
    const href = saved?.href || fallback
    await router.go(href)
    await nextTick()
    // Only this explicit return action restores a list position. Normal routing,
    // hashes and browser Back/Forward retain VitePress's own scroll behaviour.
    if (browser && saved && currentUrl().pathname + currentUrl().search + currentUrl().hash === href) {
      browser.scrollTo(0, saved.scrollY)
    }
  }
  return { returnTo, restore, goBack }
}

export const exploreNavigationKey: InjectionKey<ReturnType<typeof createExploreNavigation>> = Symbol('explore-navigation')
