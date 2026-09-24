<template>
  <div class="not-found">
    <div class="not-found-code">404</div>
    <div class="not-found-divider"></div>
    <h1>页面迷失在星空中</h1>
    <p>你访问的页面可能已被删除、更名或暂时不可用</p>
    <div class="not-found-actions">
      <a :href="withBase('/')" class="btn btn-primary">🏠 返回首页</a>
      <a :href="withBase('/knowledge/')" class="btn btn-secondary">📚 浏览知识库</a>
      <a :href="withBase('/projects/')" class="btn btn-secondary">💼 查看项目</a>
    </div>
    <p v-if="showCountdown" class="not-found-hint">将在 <span class="countdown">{{ countdown }}</span> 秒后自动返回...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'

const showCountdown = ref(false)
const countdown = ref(3)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (typeof document === 'undefined') return
  const referrer = document.referrer
  if (referrer && referrer.indexOf(location.hostname) !== -1) {
    showCountdown.value = true
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (timer) clearInterval(timer)
        history.back()
      }
    }, 1000)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  padding: 2rem;
}

.not-found-code {
  font-size: 7rem;
  font-weight: 900;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-indigo-1));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  letter-spacing: -0.05em;
}

.not-found-divider {
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-indigo-1));
  border-radius: 2px;
  margin: 1.5rem 0;
}

.not-found h1 {
  font-size: 1.6rem;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
}

.not-found p {
  color: var(--vp-c-text-2);
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn {
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--vp-c-brand-3);
  color: var(--vp-button-brand-text);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.btn-secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.not-found-hint {
  font-size: 0.85rem !important;
  color: var(--vp-c-text-3) !important;
}

.countdown {
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .not-found-code { font-size: 4.5rem; }
  .not-found h1 { font-size: 1.3rem; }
  .not-found-actions { flex-direction: column; }
  .btn { text-align: center; }
}
</style>
