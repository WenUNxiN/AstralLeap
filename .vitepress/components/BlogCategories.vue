<template>
  <div class="blog-categories">
    <h2 class="section-title">文章分类</h2>
    <div class="category-list">
      <a 
        v-for="cat in categories" 
        :key="cat.name" 
        :href="cat.path"
        class="category-card"
      >
        <div class="category-icon" :style="{ background: cat.gradient }">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <component :is="cat.icon" />
          </svg>
        </div>
        <div class="category-info">
          <span class="category-name">{{ cat.name }}</span>
          <span class="category-count">{{ cat.count }} 篇文章</span>
        </div>
        <p class="category-desc">{{ cat.desc }}</p>
      </a>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

const frontendIcon = h('path', { d: 'M20 18v-4a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v4' })
const backendIcon = h('path', { d: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' })
const projectIcon = h('path', { d: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10' })

const categories = [
  {
    name: '前端技术',
    desc: 'Vue、React、TypeScript 等前端技术分享',
    count: 2,
    path: '/blog/categories/frontend',
    gradient: 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
    icon: frontendIcon
  },
  {
    name: '后端开发',
    desc: 'Node.js、数据库、API 设计等后端技术',
    count: 1,
    path: '/blog/categories/backend',
    gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    icon: backendIcon
  },
  {
    name: '项目经验',
    desc: '项目实践、架构设计、踩坑记录',
    count: 1,
    path: '/blog/categories/projects',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    icon: projectIcon
  }
]
</script>

<style scoped>
.blog-categories {
  margin-bottom: 2rem;
}

.section-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  padding-left: 0.75rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .category-list {
    flex-direction: row;
    gap: 1rem;
  }
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--vp-c-bg-alt);
  border-radius: 12px;
  padding: 1.25rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.category-icon svg {
  width: 24px;
  height: 24px;
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-name {
  font-weight: 600;
  color: var(--vp-c-text-primary);
}

.category-count {
  font-size: 0.8rem;
  color: var(--vp-c-text-tertiary);
}

.category-desc {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  color: var(--vp-c-text-secondary);
}
</style>
