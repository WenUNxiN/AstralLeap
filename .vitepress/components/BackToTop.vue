<template>
  <Transition name="fade">
    <button
      v-show="visible"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="返回顶部"
      title="返回顶部"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const threshold = 300

const handleScroll = () => {
  visible.value = window.scrollY > threshold
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2.5rem;
  right: 2rem;
  z-index: 999;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
  transition: all 0.3s ease;
}
.back-to-top:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
}
.back-to-top:active {
  transform: translateY(0) scale(0.95);
}
.back-to-top svg {
  width: 22px;
  height: 22px;
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.8);
}
@media (max-width: 768px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.25rem;
    width: 42px;
    height: 42px;
  }
  .back-to-top svg {
    width: 18px;
    height: 18px;
  }
}
</style>