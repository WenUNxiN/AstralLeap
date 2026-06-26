<template>
  <div class="blog-stats">
    <div class="stat-item">
      <div class="stat-icon categories">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 11H5"></path>
          <path d="M12 19c-4 0-7-3-7-7s3-7 7-7 7 3 7 7-3 7-7 7z"></path>
          <path d="M12 19l-3-3"></path>
          <path d="M12 19l3-3"></path>
          <path d="M12 12l0-5"></path>
        </svg>
      </div>
      <div class="stat-value">3</div>
      <div class="stat-label">技术分类</div>
    </div>

    <div class="stat-item">
      <div class="stat-icon tags">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7" y2="7"></line>
        </svg>
      </div>
      <div class="stat-value">{{ tagsCount }}</div>
      <div class="stat-label">标签数量</div>
    </div>

    <div class="stat-item">
      <div class="stat-icon projects">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <div class="stat-value">5</div>
      <div class="stat-label">项目经验</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const articles = [
  { tags: ['Vue3', 'JavaScript', '前端'] },
  { tags: [] },
  { tags: [] },
  { tags: [] }
]

const tagsCount = computed(() => {
  const allTags = articles.flatMap(article => article.tags || [])
  return [...new Set(allTags)].length
})
</script>

<style scoped>
.blog-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .blog-stats {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-item {
  background: linear-gradient(135deg, var(--vp-c-bg-alt) 0%, var(--vp-c-bg) 100%);
  border-radius: 16px;
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--vp-c-brand), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand);
}

.stat-item:hover::before {
  opacity: 1;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.3s ease;
}

.stat-item:hover .stat-icon {
  transform: scale(1.1);
}

.stat-icon svg {
  width: 26px;
  height: 26px;
}

.stat-icon.articles {
  background: linear-gradient(135deg, #8b5cf6, #4f46e5);
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
}

.stat-icon.categories {
  background: linear-gradient(135deg, #06b6d4, #0ea5e9);
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.4);
}

.stat-icon.tags {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
}

.stat-icon.projects {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--vp-c-brand) 0%, var(--vp-c-brand-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-tertiary);
  font-weight: 500;
}
</style>
