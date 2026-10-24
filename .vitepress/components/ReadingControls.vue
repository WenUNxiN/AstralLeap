<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { sectionForPath } from '../utils/sections'
import AboutIcon from './AboutIcon.vue'

const { page, frontmatter } = useData()
const focused = ref(false)
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
watch(available, value => { if (!value) setFocus(false) })
onMounted(() => document.addEventListener('keydown', escapeFocus))
onBeforeUnmount(() => {
  setFocus(false)
  document.removeEventListener('keydown', escapeFocus)
})
</script>

<template>
  <div v-if="available" class="reading-controls">
    <button type="button" :aria-pressed="focused" :title="focused ? '退出专注阅读（Esc）' : '收起两侧目录，专注阅读正文'" @click="setFocus(!focused)">
      <AboutIcon name="focus" />{{ focused ? '退出专注' : '专注阅读' }}<kbd v-if="focused">Esc</kbd>
    </button>
  </div>
</template>
