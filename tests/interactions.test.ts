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
