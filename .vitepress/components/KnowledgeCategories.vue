<template>
  <div>
    <div class="category-grid">
      <a
        v-for="cat in categories"
        :key="cat.dir"
        :href="withBase(cat.url)"
        class="cat-card"
      >
        <div class="cat-header">
          <div class="cat-icon">{{ cat.icon }}</div>
          <h3 class="cat-name">{{ cat.name }}</h3>
          <span class="cat-count">{{ cat.count }} 篇</span>
        </div>
        <p v-if="cat.description" class="cat-desc">{{ cat.description }}</p>
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
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../data/knowledge.data.ts'

const categories = data.categories

const totalCount = computed(() => {
  return categories.reduce((sum, c) => sum + c.count, 0)
})
</script>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.cat-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 20px 22px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

/* hover 顶部渐变线 */
.cat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-purple, #bb9af7));
  opacity: 0;
  transition: opacity 0.3s;
}

.cat-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft-up);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.cat-card:hover::before {
  opacity: 1;
}

.cat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.cat-icon {
  font-size: 32px;
  line-height: 1;
  flex-shrink: 0;
}

.cat-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
  flex: 1;
  min-width: 0;
}

.cat-count {
  font-size: 11px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.cat-desc {
  margin: 0;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  line-height: 1.5;
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
  .cat-card {
    padding: 16px 18px;
  }
  .cat-name {
    font-size: 13.5px;
  }
  .cat-icon {
    font-size: 24px;
  }
}
</style>
