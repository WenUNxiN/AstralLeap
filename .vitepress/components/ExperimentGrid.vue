<template>
  <div class="exp-page-list">
    <a v-for="exp in displayedExperiments" :key="exp.slug" :href="withBase(exp.url)" class="exp-card">
      <div class="exp-header">
        <span class="exp-id">#{{ getExpId(exp.slug) }}</span>
        <span class="exp-status" :class="getStatusClass(exp.status)">
          {{ getStatusText(exp.status) }}
        </span>
        <span class="exp-platform">{{ firstOf(exp.platform) }}</span>
      </div>
      <h3 class="exp-title">{{ exp.title }}</h3>
      <p class="exp-desc">{{ exp.description || exp.excerpt }}</p>
      <div class="exp-footer">
        <span class="exp-date">{{ formatDate(exp.date) }}</span>
        <span v-if="exp.tags && exp.tags.length" class="exp-tags">
          <span v-for="t in exp.tags.slice(0, 4)" :key="t" class="tag">{{ t }}</span>
        </span>
      </div>
    </a>
    <div v-if="displayedExperiments.length === 0" class="empty">
      <p>暂无实验记录</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as experiments } from '../data/experiments.data.ts'
import { formatDate, getStatusText, getStatusClass, getExpId, firstOf } from '../utils/content-loader'

const props = defineProps({
  limit: { type: Number, default: 0 }
})

const displayedExperiments = computed(() => {
  if (props.limit > 0) {
    return experiments.slice(0, props.limit)
  }
  return experiments
})
</script>

<style scoped>
.exp-page-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exp-card {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 18px 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.2s;
}

.exp-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.exp-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.exp-id {
  font-family: Consolas, 'Courier New', monospace;
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-cyan);
  background: rgba(0, 180, 200, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.exp-status {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}

.exp-platform {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

.exp-title {
  font-size: 16px;
  font-weight: 600;
  margin: 4px 0 8px;
  color: var(--vp-c-text-1);
}

.exp-card:hover .exp-title {
  color: var(--vp-c-brand-1);
}

.exp-desc {
  font-size: 13.5px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 10px;
}

.exp-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.exp-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.exp-tags {
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
  .exp-card {
    padding: 14px 16px;
  }
  .exp-title {
    font-size: 14px;
  }
  .exp-desc {
    font-size: 12.5px;
  }
}
</style>
