<template>
  <div class="blog-stats">
    <div class="stat-item">
      <div class="stat-icon articles">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      </div>
      <div class="stat-value">{{ totalArticles }}</div>
      <div class="stat-label">📝 文章总数</div>
    </div>

    <div class="stat-item">
      <div class="stat-icon categories">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div class="stat-value">{{ totalCategories }}</div>
      <div class="stat-label">📂 技术分类</div>
    </div>

    <div class="stat-item">
      <div class="stat-icon tags">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
          <line x1="7" y1="7" x2="7" y2="7"/>
        </svg>
      </div>
      <div class="stat-value">{{ totalTags }}</div>
      <div class="stat-label">🏷️ 标签数量</div>
    </div>

    <div class="stat-item">
      <div class="stat-icon calendar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div class="stat-value stat-value-small">{{ lastUpdate }}</div>
      <div class="stat-label">🕐 最后更新</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFrontmatter } from '../utils/frontmatter'

const allPosts = ref([])

onMounted(async () => {
  const postModules = import.meta.glob('../../blog/posts/*.md', { query: '?raw', import: 'default' })
  const posts = []

  for (const [, loadContent] of Object.entries(postModules)) {
    const content = await loadContent()
    const frontmatter = getFrontmatter(content)
    posts.push({
      title: frontmatter.title || '',
      tags: frontmatter.tags || [],
      category: frontmatter.category || '',
      date: frontmatter.date || '',
    })
  }

  allPosts.value = posts.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const totalArticles = computed(() => allPosts.value.length)
const totalCategories = computed(() => {
  const cats = new Set(allPosts.value.map(p => p.category).filter(Boolean))
  return cats.size
})
const totalTags = computed(() => {
  const tags = new Set(allPosts.value.flatMap(p => p.tags || []))
  return tags.size
})

const lastUpdate = computed(() => {
  if (allPosts.value.length === 0) return '-'
  const dates = allPosts.value.map(p => new Date(p.date)).filter(d => !isNaN(d))
  if (dates.length === 0) return '-'
  const latest = new Date(Math.max(...dates))
  return latest.toISOString().split('T')[0]
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

.stat-icon.calendar {
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

.stat-value-small {
  font-size: 1.2rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-tertiary);
  font-weight: 500;
}
</style>