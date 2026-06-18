<template>
  <div class="visitor-counter">
    <span id="busuanzi_container_site_pv" style="margin-right: 10px;">
      总访问量：<span id="busuanzi_value_site_pv" style="font-weight: bold;">--</span>
    </span>
    <span id="busuanzi_container_site_uv" style="margin-left: 10px;">
      总访客数：<span id="busuanzi_value_site_uv" style="font-weight: bold;">--</span>
    </span>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<style scoped>
.visitor-counter {
  text-align: center;
  padding: 20px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
