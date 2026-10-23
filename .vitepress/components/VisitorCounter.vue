<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { visitorStats } from '../utils/visitor-stats'

const root = ref(null)
let observer

onMounted(() => {
  const readCounts = () => {
    const pageViews = root.value?.querySelector('#busuanzi_value_site_pv')?.textContent?.trim()
    const visitors = root.value?.querySelector('#busuanzi_value_site_uv')?.textContent?.trim()
    if (/^\d+$/.test(pageViews || '')) visitorStats.pageViews = pageViews
    if (/^\d+$/.test(visitors || '')) visitorStats.visitors = visitors
  }
  observer = new MutationObserver(readCounts)
  observer.observe(root.value, { childList: true, subtree: true, characterData: true })

  if (document.getElementById('astral-visitor-counter')) return
  const script = document.createElement('script')
  script.id = 'astral-visitor-counter'
  script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  script.async = true
  document.body.appendChild(script)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div ref="root" hidden aria-hidden="true">
    <span id="busuanzi_value_site_pv">{{ visitorStats.pageViews }}</span>
    <span id="busuanzi_value_site_uv">{{ visitorStats.visitors }}</span>
  </div>
</template>
