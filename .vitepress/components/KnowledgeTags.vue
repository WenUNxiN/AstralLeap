<template>
  <div class="knowledge-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="icon">📚</span>
        技术知识库
        <span class="badge">NEW</span>
      </h2>
      <p class="section-sub">系统化的嵌入式技术知识，从基础到进阶，持续更新中</p>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="knowledge-tags">
      <a
        v-for="cat in categories"
        :key="cat.dir"
        :href="cat.link"
        class="k-tag"
      >
        <span class="icon">{{ cat.icon }}</span>
        <span class="name">{{ cat.name }}</span>
        <span class="count">{{ cat.count }} 篇</span>
      </a>
    </div>

    <div v-if="showMore && !loading" class="section-more">
      <a :href="moreLink">浏览全部知识库 →</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { discoverKnowledgeCategories } from '../utils/content-loader'

defineProps({
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/knowledge/' }
})

const categories = ref([])
const loading = ref(true)

onMounted(async () => {
  const indexModules = import.meta.glob('../../knowledge/*/index.md', { query: '?raw', import: 'default' })
  const allArticlesModules = import.meta.glob('../../knowledge/*/*.md', { query: '?raw', import: 'default' })

  categories.value = await discoverKnowledgeCategories(
    indexModules,
    allArticlesModules,
    '/AstralLeap/knowledge/'
  )
  loading.value = false
})
</script>

<style scoped>
.knowledge-section {
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

.knowledge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.k-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
  text-decoration: none;
}

.k-tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.k-tag .icon {
  font-size: 14px;
}

.k-tag .name {
  font-weight: 500;
}

.k-tag .count {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-elv);
  padding: 1px 6px;
  border-radius: 4px;
}

.k-tag:hover .count {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
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
  .knowledge-section {
    padding: 28px 0;
  }
  .section-title {
    font-size: 16px;
  }
}
</style>
