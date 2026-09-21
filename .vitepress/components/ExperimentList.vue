<template>
  <div class="experiment-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="icon">🧪</span>
        最新实验
        <span class="badge">NEW</span>
      </h2>
      <p class="section-sub">每次实验一个明确目标，完整记录环境、步骤、代码与结果</p>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="exp-list">
      <a
        v-for="exp in displayedExperiments"
        :key="exp.slug"
        :href="exp.link"
        class="exp-item"
      >
        <span class="exp-id">#{{ getExpId(exp.slug) }}</span>
        <span class="exp-title">{{ exp.title }}</span>
        <span class="exp-status" :class="getStatusClass(exp.status)">
          {{ getStatusText(exp.status) }}
        </span>
        <span class="exp-platform">{{ firstOf(exp.platform) }}</span>
        <span class="exp-date">{{ formatShortDate(exp.date) }}</span>
      </a>
    </div>

    <div v-if="showMore && !loading" class="section-more">
      <a :href="moreLink">查看全部实验记录 →</a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { parseContentList, getStatusText, getStatusClass, getExpId, firstOf, formatShortDate } from '../utils/content-loader'

const props = defineProps({
  limit: { type: Number, default: 0 },
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/experiments/' }
})

const experiments = ref([])
const loading = ref(true)

const displayedExperiments = computed(() => {
  if (props.limit > 0) {
    return experiments.value.slice(0, props.limit)
  }
  return experiments.value
})

onMounted(async () => {
  const modules = import.meta.glob('../../experiments/*.md', { query: '?raw', import: 'default' })
  experiments.value = await parseContentList(modules, '/AstralLeap/experiments/')
  loading.value = false
})
</script>

<style scoped>
.experiment-section {
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

.exp-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.exp-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.exp-item:hover {
  border-color: var(--vp-c-cyan);
  background: var(--vp-c-bg-soft-up);
  transform: translateX(2px);
}

.exp-id {
  font-family: Consolas, 'Courier New', monospace;
  font-size: 11px;
  color: var(--vp-c-cyan);
  font-weight: 600;
  white-space: nowrap;
  min-width: 50px;
}

.exp-title {
  flex: 1;
  font-size: 13.5px;
  color: var(--vp-c-text-1);
  font-weight: 500;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.exp-status {
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
}

.exp-status.done {
  color: var(--vp-c-green, #9ece6a);
  background: rgba(158, 206, 106, 0.1);
}

.exp-status.doing {
  color: var(--vp-c-yellow, #e0af68);
  background: rgba(224, 175, 104, 0.1);
}

.exp-platform {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 80px;
  text-align: right;
}

.exp-date {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  min-width: 78px;
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
  .experiment-section {
    padding: 28px 0;
  }
  .section-title {
    font-size: 16px;
  }
  .exp-platform {
    display: none;
  }
  .exp-item {
    gap: 10px;
    padding: 10px 14px;
  }
}
</style>
