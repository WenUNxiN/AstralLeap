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

    <div class="debug-list">
      <a
        v-for="item in displayedDebug"
        :key="item.slug"
        :href="withBase(item.url)"
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

    <div v-if="showMore" class="section-more">
      <a :href="withBase(moreLink)">浏览全部 Debug 记录 →</a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as debugList } from '../data/debug.data.ts'
import { getStatusText, firstOf } from '../utils/content-loader'

const props = defineProps({
  limit: { type: Number, default: 0 },
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/debug/' }
})

const displayedDebug = computed(() => {
  if (props.limit > 0) {
    return debugList.slice(0, props.limit)
  }
  return debugList
})
</script>

<style scoped>
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

/* 响应式 */
@media (max-width: 640px) {
  .debug-cat {
    display: none;
  }
  .debug-item {
    gap: 10px;
    padding: 10px 14px;
  }
}
</style>
