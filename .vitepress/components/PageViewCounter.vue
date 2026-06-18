<template>
  <div class="page-view-counter">
    <div>访问量统计组件已加载</div>
    <span id="busuanzi_container_site_pv">
      本站总访问量 <span id="busuanzi_value_site_pv">0</span> 次
    </span>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  console.log('PageViewCounter mounted');
  // 动态加载不蒜子脚本
  if (typeof window !== 'undefined') {
    console.log('Loading busuanzi script');
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.onload = () => {
      console.log('Busuanzi script loaded');
    };
    script.onerror = (error) => {
      console.error('Failed to load busuanzi script:', error);
    };
    document.head.appendChild(script);
  }
});
</script>

<style scoped>
.page-view-counter {
  text-align: center;
  margin-top: 40px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #333;
  font-size: 16px;
}
</style>