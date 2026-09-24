<template>
  <div class="debug-page-list">
    <article v-for="item in debugList" :key="item.slug" class="debug-card" :class="{ solved: item.status === 'solved' }">
      <div class="debug-header">
        <span class="debug-status" :class="getStatusClass(item.status)">
          {{ getStatusText(item.status) }}
        </span>
        <span class="debug-category">{{ firstOf(item.category) }}</span>
        <span class="debug-platform">{{ firstOf(item.platform) }}</span>
        <span class="debug-date">{{ formatDate(item.date) }}</span>
      </div>
      <h3 class="debug-title">
        <a :href="withBase(item.url)">{{ item.title }}</a>
      </h3>
      <p class="debug-desc">{{ item.description || item.excerpt }}</p>
      <div class="debug-footer">
        <span v-if="item.tags && item.tags.length" class="debug-tags">
          <span v-for="t in item.tags.slice(0, 5)" :key="t" class="tag">{{ t }}</span>
        </span>
      </div>
    </article>
    <div v-if="debugList.length === 0" class="empty">
      <p>暂无 Debug 记录</p>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { data as debugList } from '../data/debug.data.ts'
import { formatDate, getStatusText, getStatusClass, firstOf } from '../utils/content-loader'
</script>

<style scoped>
.debug-page-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.debug-card {
  padding: 18px 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-yellow, #e0af68);
  border-radius: 0 12px 12px 0;
  transition: all 0.2s;
}

.debug-card.solved {
  border-left-color: var(--vp-c-green, #9ece6a);
}

.debug-card:hover {
  background: var(--vp-c-bg-soft-up);
  transform: translateX(2px);
}

.debug-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.debug-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.debug-status.done {
  color: var(--vp-c-green, #9ece6a);
  background: rgba(158, 206, 106, 0.12);
}

.debug-status.doing {
  color: var(--vp-c-yellow, #e0af68);
  background: rgba(224, 175, 104, 0.12);
}

.debug-category,
.debug-platform,
.debug-date {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

.debug-title {
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0 8px;
  font-family: Consolas, 'Courier New', monospace;
}

.debug-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.debug-title a:hover {
  color: var(--vp-c-brand-1);
}

.debug-desc {
  font-size: 13.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 10px;
}

.debug-footer {
  display: flex;
  justify-content: flex-end;
}

.debug-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  font-size: 11px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-elv);
  padding: 1px 7px;
  border-radius: 4px;
}

.empty {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .debug-card {
    padding: 14px 16px;
  }
  .debug-title {
    font-size: 13.5px;
  }
  .debug-desc {
    font-size: 12.5px;
  }
}
</style>
