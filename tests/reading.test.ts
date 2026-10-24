import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { sectionForPath } from '../.vitepress/utils/sections.ts'

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
