import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { createExploreNavigation, exploreNavigationKey } from '../.vitepress/utils/explore-navigation.ts'

function fixture() {
  const saved = new Map<string, string>()
  const scrolls: number[] = []
  const browser = {
    location: new URL('https://example.com/AstralLeap/explore/?topic=linux&type=knowledge&tag=mmap&q=Linux&sort=title#explore-records-title'),
    scrollY: 860,
    sessionStorage: { getItem: key => saved.get(key) || null, setItem: (key, value) => saved.set(key, value), removeItem: key => saved.delete(key) },
    scrollTo: (_x, y) => { scrolls.push(y); browser.scrollY = y },
  }
  const router = {
    onBeforeRouteChange: undefined as undefined | ((href: string) => unknown),
    onAfterRouteChange: undefined as undefined | ((href: string) => unknown),
    go: async (href: string) => {
      if (await router.onBeforeRouteChange?.(href) === false) return
      browser.location.href = new URL(href, browser.location).href
      await router.onAfterRouteChange?.(href)
    },
  }
  return { browser, router, saved, scrolls }
}

test('explicit reading return keeps every exploration condition and its position across related notes and reload', async () => {
  const { browser, router, saved, scrolls } = fixture()
  const source = browser.location.pathname + browser.location.search + browser.location.hash
  const navigation = createExploreNavigation(router, '/AstralLeap/', browser)
  await router.go('/AstralLeap/knowledge/linux/mmap.html')
  assert.equal(navigation.returnTo.value?.href, source)
  assert.equal(navigation.returnTo.value?.scrollY, 860)
  await router.go('/AstralLeap/experiments/019-linux-mmap.html')
  assert.equal(navigation.returnTo.value?.href, source)
  browser.location.href = 'https://example.com/AstralLeap/knowledge/linux/mmap.html'
  await router.onAfterRouteChange!(browser.location.href)
  assert.equal(navigation.returnTo.value?.recordPath, '/AstralLeap/knowledge/linux/mmap.html', 'native Back updates the visited article without scrolling')
  assert.deepEqual(scrolls, [])

  const freshRouter = { go: async href => { browser.location.href = new URL(href, browser.location).href } }
  const reloaded = createExploreNavigation(freshRouter, '/AstralLeap/', browser)
  assert.equal(reloaded.returnTo.value, null, 'SSR and hydration start with the same fallback link')
  reloaded.restore()
  assert.equal(reloaded.returnTo.value?.href, source)
  assert.equal(saved.size, 1)
  await reloaded.goBack('/AstralLeap/explore/?type=experiments')
  assert.equal(browser.location.pathname + browser.location.search + browser.location.hash, source)
  assert.deepEqual(scrolls, [860])
})

test('fresh visits use their actual section and saved returns cannot escape the site or another article', async () => {
  const { browser, router, saved, scrolls } = fixture()
  const navigation = createExploreNavigation(router, '/AstralLeap/', browser)
  await router.go('/AstralLeap/knowledge/linux/mmap.html')
  await router.go('/AstralLeap/')
  await router.go('/AstralLeap/debug/problem.html')
  assert.equal(navigation.returnTo.value, null)
  await navigation.goBack('/AstralLeap/explore/?type=debug')
  assert.equal(browser.location.search, '?type=debug')
  assert.deepEqual(scrolls, [])

  browser.location.href = 'https://example.com/AstralLeap/debug/problem.html'
  for (const bad of [
    { href: 'https://other.example/AstralLeap/explore/', scrollY: 1, recordPath: browser.location.pathname },
    { href: '/AstralLeap/projects/', scrollY: 1, recordPath: browser.location.pathname },
    { href: '/AstralLeap/explore/', scrollY: -1, recordPath: browser.location.pathname },
    { href: '/AstralLeap/explore/', scrollY: 1, recordPath: '/AstralLeap/debug/another.html' },
  ]) {
    saved.set('astralleap:explore-return:/AstralLeap/', JSON.stringify(bad))
    navigation.restore()
    assert.equal(navigation.returnTo.value, null)
  }
})

test('unavailable storage and cancelled routes preserve normal reading behaviour', async () => {
  const { browser, router, scrolls } = fixture()
  browser.sessionStorage.getItem = () => { throw new Error('blocked') }
  browser.sessionStorage.setItem = () => { throw new Error('blocked') }
  browser.sessionStorage.removeItem = () => { throw new Error('blocked') }
  const navigation = createExploreNavigation(router, '/AstralLeap/', browser)
  await router.go('/AstralLeap/knowledge/linux/mmap.html')
  assert.ok(navigation.returnTo.value)
  await navigation.goBack('/AstralLeap/explore/')
  assert.deepEqual(scrolls, [860])
  router.onBeforeRouteChange = async () => false
  browser.location.href = 'https://example.com/AstralLeap/knowledge/linux/mmap.html'
  const before = browser.location.href
  await navigation.goBack('/AstralLeap/explore/')
  assert.equal(browser.location.href, before)
  assert.deepEqual(scrolls, [860], 'cancelled return must not scroll the article')
  const blocked = fixture()
  blocked.router.onBeforeRouteChange = async () => false
  const untouched = createExploreNavigation(blocked.router, '/AstralLeap/', blocked.browser)
  await blocked.router.go('/AstralLeap/knowledge/linux/mmap.html')
  assert.equal(untouched.returnTo.value, null)
})

test('the installed theme lets the real VitePress router restore Back and Forward positions', async () => {
  const routerSource = readFileSync(new URL('../node_modules/vitepress/dist/client/app/router.js', import.meta.url), 'utf8')
    .replace(/^import .*;\r?$/gm, '')
    .replaceAll('import.meta.env.PROD', 'false').replaceAll('import.meta.hot', 'undefined')
    .replace(/export \{[^]*$/, 'globalThis.makeRouter = createRouter;')
  const handlers = new Map<string, Function>()
  const location = new URL('https://example.com/AstralLeap/explore/')
  const positions: number[] = []
  const browser = {
    location, scrollY: 0,
    addEventListener: (name, fn) => handlers.set(name, fn),
    scrollTo: (x, y) => { browser.scrollY = typeof x === 'object' ? x.top : y; positions.push(browser.scrollY) },
  }
  const history = {
    state: {},
    replaceState: (state, _title, href?) => { history.state = state; if (href) location.href = new URL(href, location).href },
    pushState: (state, _title, href) => { history.state = state; location.href = new URL(href, location).href },
  }
  const context: any = {
    window: browser, location, history, URL, console, inBrowser: true,
    document: { fragmentDirective: false }, notFoundPageData: {},
    siteDataRef: { value: { cleanUrls: false } }, runtimeBase: () => '/AstralLeap/', withBase: path => '/AstralLeap' + path,
    reactive: value => value, markRaw: value => value, readonly: value => value,
    nextTick: fn => Promise.resolve().then(fn),
  }
  runInNewContext(routerSource, context)
  const router = context.makeRouter(async path => ({
    default: {}, __pageData: { relativePath: path === '/AstralLeap/explore/' ? 'explore/index.md' : 'knowledge/linux/mmap.md' },
  }))
  const theme = readFileSync(new URL('../.vitepress/theme/index.ts', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
  const enhance = theme.match(/enhanceApp\(\{ app, router, siteData \}\) \{([\s\S]*)\n  \}\n\} satisfies Theme/)!
  assert.ok(enhance)
  const install = runInNewContext('(function({ app, router, siteData }) {' + enhance[1] + '\n})', {
    createExploreNavigation, exploreNavigationKey, window: browser,
  })
  install({ app: { provide() {} }, router, siteData: { value: { base: '/AstralLeap/' } } })
  await router.go(location.href, { initialLoad: true })
  browser.scrollY = 900
  await router.go('/AstralLeap/knowledge/linux/mmap.html')
  assert.equal(browser.scrollY, 0, 'ordinary new-page navigation starts at the top')
  positions.length = 0
  location.href = 'https://example.com/AstralLeap/explore/'
  await handlers.get('popstate')!({ state: { scrollPosition: 900 } })
  assert.deepEqual(positions, [900], 'Back must not be overwritten by another scrollTo(0)')
  positions.length = 0
  location.href = 'https://example.com/AstralLeap/knowledge/linux/mmap.html'
  await handlers.get('popstate')!({ state: { scrollPosition: 340 } })
  assert.deepEqual(positions, [340], 'Forward also retains its stored position')
})
