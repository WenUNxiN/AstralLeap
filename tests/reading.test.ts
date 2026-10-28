import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { sectionForPath } from '../.vitepress/utils/sections.ts'

function copyControls(clipboard: any, href = 'https://example.com/AstralLeap/knowledge/linux/mmap.html?from=search#共享映射', browser = true) {
  const source = readFileSync(new URL('../.vitepress/components/ReadingControls.vue', import.meta.url), 'utf8')
    .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
  const page = { value: { relativePath: 'knowledge/linux/mmap.md', isNotFound: false } }
  const timers = new Map<number, () => void>()
  const watchers: Array<{ source: any; notify: () => void }> = []
  let nextTimer = 1
  let cleanup: () => void
  const location = { href }
  const context: any = {
    sectionForPath,
    useData: () => ({ page, frontmatter: { value: {} } }),
    ref: (value: any) => ({ value }), computed: (get: () => any) => ({ get value() { return get() } }),
    watch: (source: any, notify: () => void) => watchers.push({ source, notify }),
    onMounted() {}, onBeforeUnmount: (fn: () => void) => { cleanup = fn },
    setTimeout: (fn: () => void) => { const id = nextTimer++; timers.set(id, fn); return id },
    clearTimeout: (id: number) => timers.delete(id),
    document: { documentElement: { classList: { toggle() {} } }, removeEventListener() {} },
  }
  if (browser) Object.assign(context, { window: { location }, navigator: { clipboard } })
  runInNewContext(source + '\nglobalThis.api = { copyLink, copied, copying, copyMessage, copyLabel }', context)
  return {
    api: context.api, location, timers,
    unmount: () => cleanup(),
    navigate() { page.value.relativePath = 'knowledge/linux/another.md'; watchers[0].notify() },
    expire() {
      const timer = timers.entries().next().value
      assert.ok(timer)
      timers.delete(timer[0]); timer[1]()
    },
  }
}

test('copying a link uses the current full URL and resets its success feedback', async () => {
  const writes: string[] = []
  const state = copyControls({ writeText: async (url: string) => { writes.push(url) } })
  await state.api.copyLink()
  assert.deepEqual(writes, [state.location.href])
  assert.equal(state.api.copied.value, true)
  assert.equal(state.api.copyLabel.value, '链接已复制')
  assert.equal(state.api.copyMessage.value, '链接已复制')
  assert.equal(state.timers.size, 1)
  state.expire()
  assert.equal(state.api.copied.value, false)
  assert.equal(state.api.copyMessage.value, '')

  state.location.href = 'https://example.com/AstralLeap/knowledge/linux/mmap.html?q=Linux#另一个位置'
  await state.api.copyLink()
  assert.equal(writes[1], state.location.href)
  state.unmount()
  assert.equal(state.timers.size, 0)
})

test('rejected or unavailable clipboard access produces recoverable feedback', async () => {
  for (const clipboard of [{ writeText: async () => { throw new Error('Permission denied') } }, undefined]) {
    const state = copyControls(clipboard)
    await state.api.copyLink()
    assert.equal(state.api.copied.value, false)
    assert.equal(state.api.copying.value, false)
    assert.equal(state.api.copyMessage.value, '复制失败，请从地址栏复制链接。')
    state.expire()
    assert.equal(state.api.copyMessage.value, '')
    state.unmount()
  }
})

test('navigation and unmount cancel timers and ignore a clipboard operation that finishes later', async () => {
  let complete: () => void
  const state = copyControls({ writeText: () => new Promise<void>(resolve => { complete = resolve }) })
  const pending = state.api.copyLink()
  assert.equal(state.api.copying.value, true)
  state.unmount()
  complete()
  await pending
  assert.equal(state.api.copied.value, false)
  assert.equal(state.api.copyMessage.value, '')
  assert.equal(state.timers.size, 0)

  const navigated = copyControls({ writeText: async () => {} })
  await navigated.api.copyLink()
  assert.equal(navigated.timers.size, 1)
  navigated.navigate()
  assert.equal(navigated.timers.size, 0)
  assert.equal(navigated.api.copyMessage.value, '')
  navigated.unmount()
})

test('copy handling remains safe without browser globals during server rendering', async () => {
  const state = copyControls(undefined, '', false)
  await state.api.copyLink()
  assert.equal(state.api.copyMessage.value, '')
  assert.equal(state.timers.size, 0)
})

test('focus reading exits on Escape, ignores search dialogs and cleans up after navigation', () => {
  const source = readFileSync(new URL('../.vitepress/components/ReadingControls.vue', import.meta.url), 'utf8')
    .split('<script setup>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
  const page = { value: { relativePath: 'knowledge/linux/mmap.md', isNotFound: false } }
  const frontmatter = { value: {} }
  const classes = new Set()
  let mount, unmount, changedAvailability
  const listeners = new Map()
  class Element {
    inDialog = false
    closest() { return this.inDialog ? {} : null }
  }
  const context = {
    sectionForPath, Element,
    useData: () => ({ page, frontmatter }),
    ref: value => ({ value }), computed: getter => ({ get value() { return getter() } }),
    watch: (_, fn) => { changedAvailability = fn },
    onMounted: fn => { mount = fn }, onBeforeUnmount: fn => { unmount = fn },
    document: {
      documentElement: { classList: { toggle: (name, enabled) => enabled ? classes.add(name) : classes.delete(name) } },
      addEventListener: (name, fn) => listeners.set(name, fn),
      removeEventListener: (name, fn) => { assert.equal(listeners.get(name), fn); listeners.delete(name) },
    },
    result: undefined,
  }
  runInNewContext(source + '\nglobalThis.result = {setFocus, focused, available}', context)
  mount()
  assert.equal(context.result.available.value, true)
  context.result.setFocus(true)
  assert.ok(classes.has('reading-focus'))
  const target = new Element(); target.inDialog = true
  listeners.get('keydown')({ key: 'Escape', target })
  assert.ok(classes.has('reading-focus'))
  target.inDialog = false
  listeners.get('keydown')({ key: 'Escape', target })
  assert.equal(context.result.focused.value, false)
  context.result.setFocus(true)
  page.value.relativePath = 'knowledge/linux/index.md'
  assert.equal(context.result.available.value, false)
  changedAvailability(false)
  assert.equal(classes.size, 0)
  context.result.setFocus(true)
  unmount()
  assert.equal(classes.size, 0)
  assert.equal(listeners.size, 0)
})
