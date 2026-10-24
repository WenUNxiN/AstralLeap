import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

test('code enhancements scan inserted subtrees, ignore their own controls and cancel pending work', () => {
  const source = readFileSync(new URL('../.vitepress/components/MicroInteractions.vue', import.meta.url), 'utf8')
    .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/m, '')
  let mount, unmount, notify
  let scans = 0
  const frames = new Map()
  let nextFrame = 1
  class Element {
    isConnected = true
    control = false
    matches() { return this.control }
    closest() { return null }
    querySelectorAll() { scans++; return [] }
  }
  const root = new Element()
  const listeners = new Set()
  const win = {
    addEventListener: name => listeners.add(name),
    removeEventListener: name => listeners.delete(name)
  }
  let disconnected = false
  runInNewContext(source, {
    ref: value => ({ value }), onMounted: fn => { mount = fn }, onBeforeUnmount: fn => { unmount = fn },
    Element, window: win,
    document: { getElementById: () => root, addEventListener() {}, removeEventListener() {} },
    MutationObserver: class { constructor(fn) { notify = fn } observe() {} disconnect() { disconnected = true } },
    requestAnimationFrame: fn => { const id = nextFrame++; frames.set(id, fn); return id },
    cancelAnimationFrame: id => frames.delete(id)
  })
  mount()
  assert.equal(scans, 1)
  // Route insertion is inspected; unrelated existing page subtrees are not rescanned.
  const article = new Element()
  notify([{ addedNodes: [article] }])
  const scanFrame = [...frames.entries()].at(-1)
  frames.delete(scanFrame[0]); scanFrame[1]()
  assert.equal(scans, 2)
  const control = new Element(); control.control = true
  notify([{ addedNodes: [control] }])
  assert.equal(frames.size, 1) // only the initial scroll update remains
  notify([{ addedNodes: [new Element()] }])
  unmount()
  assert.equal(frames.size, 0)
  assert.equal(listeners.size, 0)
  assert.equal(disconnected, true)
})

test('discussion theme changes reach a pending script and its own loaded iframe', () => {
  const source = readFileSync(new URL('../.vitepress/components/Discussion.vue', import.meta.url), 'utf8')
    .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
  const isDark = { value: false }
  let mount, unmount, changeTheme, script, iframe
  const comments = {
    appendChild(node) { script = node },
    querySelector(selector) {
      assert.equal(selector, 'iframe.giscus-frame')
      return iframe
    }
  }
  const messages = []
  let removed = false
  runInNewContext(source, {
    useData: () => ({ isDark }), ref: () => ({ value: comments }),
    onMounted: fn => { mount = fn }, onUnmounted: fn => { unmount = fn },
    watch: (_, fn) => { changeTheme = fn },
    document: {
      createElement: () => ({
        attributes: new Map(), setAttribute(name, value) { this.attributes.set(name, value) },
        remove() { removed = true }
      })
    }
  })
  mount()
  assert.equal(script.attributes.get('data-theme'), 'light')
  // Switching while the external script is still loading must update its initial config.
  isDark.value = true
  changeTheme()
  assert.equal(script.attributes.get('data-theme'), 'dark')
  iframe = { contentWindow: { postMessage: (message, origin) => messages.push([message, origin]) } }
  isDark.value = false
  changeTheme()
  assert.equal(messages[0][0].giscus.setConfig.theme, 'light')
  assert.equal(messages[0][1], 'https://giscus.app')
  unmount()
  assert.equal(removed, true)
})

test('project cards render optional metadata defaults while keeping resolved internal and external links', () => {
  const source = readFileSync(new URL('../.vitepress/components/ProjectShowcase.vue', import.meta.url), 'utf8')
    .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
  const context = {
    data: [
      { folder: '9-new-project', number: '09', link: '/projects/9-new-project/' },
      { folder: '8-external', number: '08', link: 'https://example.com/project', name: '自定义名称', icon: '⚙', desc: '说明', tech: ['C', '', null] }
    ],
    computed: getter => ({ get value() { return getter() } }),
    defineProps: () => ({ limit: 0 }),
    withBase: link => '/AstralLeap' + link,
    result: undefined
  }
  runInNewContext(source + '\nglobalThis.result = displayedProjects.value', context)
  const cards = context.result
  assert.equal(cards[0].name, '9-new-project')
  assert.equal(cards[0].icon, '✦')
  assert.equal(cards[0].desc, '')
  assert.equal(cards[0].tech.length, 0)
  assert.equal(cards[0].link, '/AstralLeap/projects/9-new-project/')
  assert.equal(cards[1].name, '自定义名称')
  assert.equal(cards[1].icon, '⚙')
  assert.equal(cards[1].desc, '说明')
  assert.equal(cards[1].tech.join(','), 'C')
  assert.equal(cards[1].link, 'https://example.com/project')
})
