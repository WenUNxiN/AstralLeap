<template>
  <div class="article-list">
    <div
      v-for="article in filteredArticles"
      :key="article.path"
      class="article-card"
    >
      <div class="article-meta">
        <span class="article-category" :style="{ background: getCategoryColor(article.category) }">
          {{ article.category }}
        </span>
        <span class="article-date">{{ article.date }}</span>
        <span class="article-read-time">🕐 {{ article.readTime }}</span>
      </div>
      <h3 class="article-title">
        <a :href="article.path">{{ article.title }}</a>
      </h3>
      <p class="article-excerpt">{{ article.excerpt }}</p>
      <div class="article-footer">
        <div class="article-author">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>{{ article.author }}</span>
        </div>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
    <div v-if="filteredArticles.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <p>暂无该分类下的文章</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  category: {
    type: String,
    default: ''
  }
})

const articles = [
  {
    title: 'Vue3 组合式 API 最佳实践',
    excerpt: '深入探讨 Vue3 组合式 API 的使用模式，包括 setup、ref、reactive、computed 等核心概念的最佳实践。',
    category: '前端技术',
    date: '2024-01-20',
    author: 'Stellan W',
    readTime: '5分钟',
    tags: ['Vue3', 'JavaScript', '前端'],
    path: './posts/vue3-composition-api.html'
  },
  {
    title: 'TypeScript 类型体操入门',
    excerpt: '从基础到进阶，系统学习 TypeScript 类型系统，掌握类型体操的核心技巧。',
    category: '前端技术',
    date: '2024-01-18',
    author: 'Stellan W',
    readTime: '8分钟',
    tags: ['TypeScript', '前端', '类型'],
    path: './posts/typescript-type-gymnastics.html'
  },
  {
    title: 'Node.js 性能优化实战',
    excerpt: '分享 Node.js 应用性能优化的实战经验，包括内存管理、异步编程、缓存策略等。',
    category: '后端开发',
    date: '2024-01-15',
    author: 'Stellan W',
    readTime: '6分钟',
    tags: ['Node.js', '性能', '后端'],
    path: './posts/nodejs-performance.html'
  },
  {
    title: '智能手表项目开发总结',
    excerpt: '回顾智能手表项目的开发历程，分享项目架构设计、技术选型和遇到的挑战。',
    category: '项目经验',
    date: '2024-01-10',
    author: 'Stellan W',
    readTime: '10分钟',
    tags: ['项目经验', '智能硬件', '架构'],
    path: './posts/smartwatch-project.html'
  }
]

const filteredArticles = computed(() => {
  if (!props.category) return articles
  return articles.filter(a => a.category === props.category)
})

const getCategoryColor = (category) => {
  const colors = {
    '前端技术': 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
    '后端开发': 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    '项目经验': 'linear-gradient(135deg, #10b981, #059669)'
  }
  return colors[category] || colors['前端技术']
}
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-card {
  background: var(--vp-c-bg-alt);
  border-radius: 16px;
  padding: 1.75rem;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.article-category {
  color: white;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.article-date {
  color: var(--vp-c-text-tertiary);
  font-size: 0.8rem;
}

.article-read-time {
  color: var(--vp-c-text-tertiary);
  font-size: 0.8rem;
}

.article-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.35rem;
}

.article-title a {
  color: var(--vp-c-text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.article-title a:hover {
  color: var(--vp-c-brand);
}

.article-excerpt {
  color: var(--vp-c-text-secondary);
  margin: 0 0 1.25rem 0;
  font-size: 0.95rem;
  line-height: 1.7;
}

.article-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.article-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-text-tertiary);
  font-size: 0.875rem;
}

.article-author svg {
  width: 16px;
  height: 16px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-secondary);
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  border: 1px solid var(--vp-c-divider);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--vp-c-text-tertiary);
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
}
</style>
