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

/* 滚动处理：rAF 节流；进度条用 transform 缩放，避免每帧触发布局重排 */
let ticking = false
const updateScrollUI = () => {
  ticking = false
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  const ratio = max > 0 ? h.scrollTop / max : 0
  if (progressBar.value) {
    progressBar.value.style.transform = `scaleX(${ratio})`
  }
  if (backTop.value) {
    backTop.value.classList.toggle('visible', h.scrollTop > 300)
  }
}

const onScroll = () => {
  if (ticking) return
  ticking = true
  requestAnimationFrame(updateScrollUI)
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

let codeObserver = null
let scanPending = false

const scanCodeBlocks = () => {
  scanPending = false
  document.querySelectorAll('div[class*="language-"]:not([data-enhanced])').forEach(enhanceCodeBlock)
}

const watchCodeBlocks = () => {
  scanCodeBlocks()
  codeObserver = new MutationObserver(() => {
    /* 微任务合并：同批 DOM 变更只扫描一次，避免自身插入按钮再触发扫描 */
    if (scanPending) return
    scanPending = true
    queueMicrotask(scanCodeBlocks)
  })
  codeObserver.observe(document.body, { childList: true, subtree: true })
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
  if (codeObserver) {
    codeObserver.disconnect()
    codeObserver = null
  }
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
