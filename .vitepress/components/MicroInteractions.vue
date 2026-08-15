<template>
  <div ref="progressBar" class="scroll-progress"></div>
  <button
    ref="backTop"
    class="back-to-top"
    aria-label="返回顶部"
    title="返回顶部"
    @click="scrollToTop"
  >↑</button>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const progressBar = ref(null)
const backTop = ref(null)

const onScroll = () => {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  if (progressBar.value) {
    progressBar.value.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%'
  }
  if (backTop.value) {
    backTop.value.classList.toggle('visible', h.scrollTop > 300)
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/* VPButton 涟漪效果（事件委托） */
const onClick = (e) => {
  const btn = e.target.closest('.VPButton')
  if (!btn) return
  const rect = btn.getBoundingClientRect()
  const size = Math.max(btn.clientWidth, btn.clientHeight)
  const ripple = document.createElement('span')
  ripple.className = 'btn-ripple'
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = (e.clientX - rect.left - size / 2) + 'px'
  ripple.style.top = (e.clientY - rect.top - size / 2) + 'px'
  btn.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}

/* 代码块折叠按钮：VitePress 路由切换后代码块是动态渲染的，用 MutationObserver 统一增强 */
const enhanceCodeBlock = (block) => {
  if (block.dataset.enhanced || !block.querySelector('pre')) return
  block.dataset.enhanced = '1'
  const btn = document.createElement('button')
  btn.className = 'code-fold'
  btn.type = 'button'
  btn.textContent = '▾'
  btn.title = '折叠 / 展开'
  btn.setAttribute('aria-label', '折叠或展开代码块')
  btn.addEventListener('click', () => {
    const collapsed = block.classList.toggle('collapsed')
    btn.textContent = collapsed ? '▸' : '▾'
  })
  block.appendChild(btn)
}

const watchCodeBlocks = () => {
  document.querySelectorAll('div[class*="language-"]').forEach(enhanceCodeBlock)
  const observer = new MutationObserver(() => {
    document.querySelectorAll('div[class*="language-"]:not([data-enhanced])').forEach(enhanceCodeBlock)
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClick)
  onScroll()
  watchCodeBlocks()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('click', onClick)
})
</script>

<style scoped>
.back-to-top {
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
  font-family: inherit;
}
</style>
