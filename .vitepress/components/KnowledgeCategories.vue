<template>
  <div v-if="loading" class="loading">加载中...</div>
  <div v-else>
    <div class="category-grid">
      <a
        v-for="cat in categories"
        :key="cat.dir"
        :href="cat.link"
        class="cat-card"
      >
        <div class="cat-icon">{{ cat.icon }}</div>
        <div class="cat-body">
          <h3 class="cat-name">{{ cat.name }}</h3>
          <p class="cat-count">{{ cat.count }} 篇文章</p>
        </div>
      </a>
    </div>

    <div v-if="totalCount > 0" class="progress-section">
      <h3>📊 总览</h3>
      <p class="progress-text">
        共 <strong>{{ totalCount }}</strong> 篇文章，分布在 <strong>{{ categories.length }}</strong> 个分类中
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { discoverKnowledgeCategories } from '../utils/content-loader'

defineProps({
  basePath: { type: String, default: '/AstralLeap/knowledge/' }
})

const categories = ref([])
const loading = ref(true)

const totalCount = computed(() => {
  return categories.value.reduce((sum, c) => sum + c.count, 0)
})

onMounted(async () => {
  // 扫描所有分类的 index.md
  const indexModules = import.meta.glob('../../knowledge/*/index.md', { query: '?raw', import: 'default' })
  // 扫描所有分类下的所有文章（用于统计数量）
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
.loading {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-2);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.cat-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.cat-icon {
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
}

.cat-body {
  min-width: 0;
  flex: 1;
}

.cat-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--vp-c-text-1);
}

.cat-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 0;
}

.progress-section {
  padding: 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  text-align: center;
}

.progress-section h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.progress-text {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.progress-text strong {
  color: var(--vp-c-brand-1);
  font-size: 18px;
}

@media (max-width: 640px) {
  .category-grid {
    grid-template-columns: 1fr 1fr;
  }
  .cat-name {
    font-size: 13.5px;
  }
  .cat-icon {
    font-size: 24px;
  }
}
</style>
