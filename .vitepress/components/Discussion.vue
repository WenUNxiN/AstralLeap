<template>
  <div class="giscus-container">
    <div class="discussion-heading"><span class="discussion-eyebrow">LET’S DISCUSS</span><h3>一起讨论，让想法继续生长。</h3><p>欢迎提问、交流使用心得，或分享你的实践。</p></div>
    <div id="giscus-comments"></div>
    <a class="discussion-fallback" href="https://github.com/WenUNxiN/StellanW-Discussions/discussions" target="_blank" rel="noopener noreferrer">也可以前往 GitHub 参与讨论 ↗<span class="discussion-sr-only">（在新标签页打开）</span></a>
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
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
}

.giscus-container h3 {
  margin: 8px 0 10px;
  font-size: 20px;
  letter-spacing: -.025em;
}
.discussion-eyebrow { font: 10px var(--vp-font-family-mono); letter-spacing: .12em; color: var(--vp-c-brand-1); }
.discussion-heading p { margin: 0 0 24px; color: var(--vp-c-text-2); font-size: 13px; }
.discussion-fallback { display: inline-block; margin-top: 20px; font-size: 12px; color: var(--vp-c-brand-1); }
.discussion-sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
@media (max-width: 640px) { .giscus-container { padding: 20px 16px; } }
</style>
