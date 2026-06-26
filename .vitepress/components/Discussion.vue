<template>
  <div class="giscus-container">
    <h3>💬 讨论区</h3>
    <div id="giscus-comments"></div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

const loadGiscus = () => {
  const existingScript = document.querySelector('script[src*="giscus"]')
  if (existingScript) {
    existingScript.remove()
  }

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.setAttribute('data-repo', 'WenUNxiN/StellanW-Discussions')
  script.setAttribute('data-repo-id', 'R_kgDOTFvJVw')
  script.setAttribute('data-category', 'General')
  script.setAttribute('data-category-id', 'DIC_kwDOTFvJV84C_68h')
  script.setAttribute('data-mapping', 'pathname')
  script.setAttribute('data-strict', '0')
  script.setAttribute('data-reactions-enabled', '1')
  script.setAttribute('data-emit-metadata', '0')
  script.setAttribute('data-input-position', 'top')
  script.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  script.setAttribute('data-lang', 'zh-CN')
  script.setAttribute('data-loading', 'lazy')
  script.crossOrigin = 'anonymous'
  script.async = true

  document.getElementById('giscus-comments')?.appendChild(script)
}

const updateTheme = () => {
  const iframe = document.querySelector('iframe.giscus-frame')
  if (iframe) {
    iframe.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: isDark.value ? 'dark' : 'light' } } },
      'https://giscus.app'
    )
  }
}

onMounted(() => {
  loadGiscus()
})

onUnmounted(() => {
  const script = document.querySelector('script[src*="giscus"]')
  script?.remove()
})

watch(isDark, () => {
  updateTheme()
})
</script>

<style scoped>
.giscus-container {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.giscus-container h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}
</style>
