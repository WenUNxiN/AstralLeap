<template>
  <div ref="progressBar" class="scroll-progress" aria-hidden="true"></div>
  <button
    ref="backTop"
    class="back-to-top"
    :class="{ visible: showBackTop }"
    :tabindex="showBackTop ? 0 : -1"
    :aria-hidden="!showBackTop"
    aria-label="返回顶部"
    title="返回顶部"
    @click="scrollToTop"
  >↑</button>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const progressBar = ref(null)
const backTop = ref(null)
const showBackTop = ref(false)

/* 滚动处理：rAF 节流；进度条用 transform 缩放，避免每帧触发布局重排 */
let scrollFrame = 0
const updateScrollUI = () => {
  scrollFrame = 0
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  const ratio = max > 0 ? h.scrollTop / max : 0
  if (progressBar.value) {
    progressBar.value.style.transform = `scaleX(${ratio})`
  }
  showBackTop.value = h.scrollTop > 400
}

const onScroll = () => {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(updateScrollUI)
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
}

/* VPButton 涟漪效果（事件委托） */
const onClick = (e) => {
  if (!(e.target instanceof Element) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
  btn.setAttribute('aria-expanded', 'true')
  btn.addEventListener('click', () => {
    const collapsed = block.classList.toggle('collapsed')
    btn.textContent = collapsed ? '▸' : '▾'
    btn.setAttribute('aria-expanded', String(!collapsed))
  })
  block.appendChild(btn)
}

let codeObserver = null
let codeFrame = 0
const pendingRoots = new Set()
const codeSelector = 'div[class*="language-"]:not([data-enhanced])'

const scanCodeBlocks = () => {
  codeFrame = 0
  for (const root of pendingRoots) {
    if (!root.isConnected) continue
    if (root.matches(codeSelector)) enhanceCodeBlock(root)
    root.querySelectorAll(codeSelector).forEach(enhanceCodeBlock)
  }
  pendingRoots.clear()
  onScroll()
}

const watchCodeBlocks = () => {
  const target = document.getElementById('app') || document.body
  pendingRoots.add(target)
  scanCodeBlocks()
  codeObserver = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        // Ignore text updates and our own controls; inspect only inserted subtrees.
        if (node instanceof Element && !node.matches('.code-fold, .btn-ripple')) {
          pendingRoots.add(node.closest('div[class*="language-"]') || node)
        }
      }
    }
    if (pendingRoots.size && !codeFrame) codeFrame = requestAnimationFrame(scanCodeBlocks)
  })
  codeObserver.observe(target, { childList: true, subtree: true })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  document.addEventListener('click', onClick)
  onScroll()
  watchCodeBlocks()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(scrollFrame)
  cancelAnimationFrame(codeFrame)
  pendingRoots.clear()
  window.removeEventListener('resize', onScroll)
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
