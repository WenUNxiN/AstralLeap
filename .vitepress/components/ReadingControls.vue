<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { sectionForPath } from '../utils/sections'
import AboutIcon from './AboutIcon.vue'

const { page, frontmatter } = useData()
const focused = ref(false)
const copied = ref(false)
const copying = ref(false)
const copyMessage = ref('')
const copyLabel = computed(() => copying.value ? '正在复制链接' : copied.value ? '链接已复制' : '复制当前页链接')
let feedbackTimer
let copyVersion = 0
let unmounted = false
const available = computed(() => !page.value.isNotFound &&
  !frontmatter.value.categoryPage &&
  !page.value.relativePath?.endsWith('/index.md') &&
  !!sectionForPath(page.value.relativePath || ''))

function setFocus(value) {
  focused.value = value
  if (typeof document !== 'undefined') document.documentElement.classList.toggle('reading-focus', value)
}
function escapeFocus(event) {
  if (event.key !== 'Escape' || event.defaultPrevented || !focused.value) return
  if (event.target instanceof Element && event.target.closest('[role="dialog"], .VPLocalSearchBox')) return
  setFocus(false)
}
function resetCopyFeedback() {
  copyVersion++
  if (feedbackTimer) clearTimeout(feedbackTimer)
  feedbackTimer = undefined
  copied.value = false
  copying.value = false
  copyMessage.value = ''
}
async function copyLink() {
  if (typeof window === 'undefined' || unmounted) return
  resetCopyFeedback()
  const version = copyVersion
  copying.value = true
  try {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(window.location.href)
    if (version !== copyVersion) return
    copied.value = true
    copyMessage.value = '链接已复制'
  } catch {
    if (version !== copyVersion) return
    copyMessage.value = '复制失败，请从地址栏复制链接。'
  } finally {
    if (version === copyVersion) {
      copying.value = false
      feedbackTimer = setTimeout(resetCopyFeedback, 3500)
    }
  }
}
watch(() => page.value.relativePath, resetCopyFeedback)
watch(available, value => { if (!value) setFocus(false) })
onMounted(() => document.addEventListener('keydown', escapeFocus))
onBeforeUnmount(() => {
  unmounted = true
  resetCopyFeedback()
  setFocus(false)
  document.removeEventListener('keydown', escapeFocus)
})
</script>

<template>
  <div v-if="available" class="reading-controls">
    <button type="button" :aria-pressed="focused" :title="focused ? '退出专注阅读（Esc）' : '收起两侧目录，专注阅读正文'" @click="setFocus(!focused)">
      <AboutIcon name="focus" />{{ focused ? '退出专注' : '专注阅读' }}<kbd v-if="focused">Esc</kbd>
    </button>
    <button type="button" class="reading-copy" :disabled="copying" :aria-label="copyLabel" :title="copyLabel" @click="copyLink">
      <AboutIcon :name="copied ? 'check' : 'copy'" /><span class="reading-copy-label">{{ copying ? '复制中' : copied ? '已复制' : '复制链接' }}</span>
    </button>
    <span class="reading-copy-feedback" :class="{ 'is-error': copyMessage && !copied }" role="status" aria-live="polite" aria-atomic="true">{{ copyMessage }}</span>
  </div>
</template>
