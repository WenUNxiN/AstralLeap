<template>
  <div class="debug-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="icon">🐛</span>
        Debug 记录
        <span class="badge">NEW</span>
      </h2>
      <p class="section-sub">从现象到根因到解决方案，积累可检索的问题库</p>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="debug-list">
      <a
        v-for="item in displayedDebug"
        :key="item.slug"
        :href="item.link"
        class="debug-item"
        :class="{ solved: item.status === 'solved' }"
      >
        <span class="debug-title">{{ item.title }}</span>
        <span class="debug-status" :class="item.status">
          {{ getStatusText(item.status) }}
        </span>
        <span class="debug-cat">{{ firstOf(item.category) }}</span>
        <span class="debug-platform">{{ firstOf(item.platform) }}</span>
      </a>
    </div>

    <div v-if="showMore && !loading" class="section-more">
      <a :href="moreLink">浏览全部 Debug 记录 →</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { parseContentList, getStatusText, firstOf } from '../utils/content-loader'

const props = defineProps({
  limit: { type: Number, default: 0 },
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/debug/' }
})

const debugList = ref([])
const loading = ref(true)

const displayedDebug = computed(() => {
  if (props.limit > 0) {
    return debugList.value.slice(0, props.limit)
  }
  return debugList.value
})

onMounted(async () => {
  const modules = import.meta.glob('../../debug/*.md', { query: '?raw', import: 'default' })
  debugList.value = await parseContentList(modules, '/AstralLeap/debug/')
  loading.value = false
})
</script>

<style scoped>
.debug-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .icon {
  font-size: 20px;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 4px;
}

.section-sub {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.loading {
  text-align: center;
  padding: 30px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.debug-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.debug-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-yellow, #e0af68);
  border-radius: 0 10px 10px 0;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.debug-item:hover {
  background: var(--vp-c-bg-soft-up);
  transform: translateX(2px);
}

.debug-item.solved {
  border-left-color: var(--vp-c-green, #9ece6a);
}

.debug-item.solved:hover {
  border-color: var(--vp-c-green, #9ece6a);
}

.debug-title {
  flex: 1;
  font-size: 13.5px;
  color: var(--vp-c-text-1);
  font-weight: 500;
  font-family: Consolas, 'Courier New', monospace;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.debug-status {
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
}

.debug-status.solved {
  color: var(--vp-c-green, #9ece6a);
  background: rgba(158, 206, 106, 0.1);
}

.debug-status.debugging,
.debug-status.doing {
  color: var(--vp-c-yellow, #e0af68);
  background: rgba(224, 175, 104, 0.1);
}

.debug-cat {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 110px;
  text-align: right;
}

.debug-platform {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
}

.section-more {
  text-align: right;
  margin-top: 16px;
}

.section-more a {
  font-size: 12.5px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: none;
}

.section-more a:hover {
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 640px) {
  .debug-section {
    padding: 28px 0;
  }
  .section-title {
    font-size: 16px;
  }
  .debug-cat {
    display: none;
  }
  .debug-item {
    gap: 10px;
    padding: 10px 14px;
  }
}
</style>
