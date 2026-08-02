<template>
  <div class="article-list">
    <TransitionGroup name="article-fade">
      <article v-for="article in filteredArticles" :key="article.path" class="article-card">
        <div class="article-meta">
          <span class="article-category" :style="{ background: getCategoryColor(article.category) }">
            {{ article.category || '未分类' }}
          </span>
          <span class="article-date">{{ formatDate(article.date) }}</span>
          <span class="article-reading-time">{{ article.readingTime }}</span>
        </div>
        <h3 class="article-title">
          <a :href="article.path">{{ article.title }}</a>
        </h3>
        <p class="article-excerpt">{{ article.excerpt }}</p>
        <div class="article-footer">
          <div class="article-author">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            {{ article.author }}
          </div>
          <div class="article-tags">
            <span v-for="tag in article.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </article>
    </TransitionGroup>

    <div v-if="filteredArticles.length === 0" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      <p>该分类暂无文章</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getFrontmatter, estimateReadingTime, getExcerpt } from '../utils/frontmatter'

const props = defineProps({
  category: { type: String, default: '' }
})

const allPosts = ref([])

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(async () => {
  const postModules = import.meta.glob('../../blog/posts/*.md', { query: '?raw', import: 'default' })
  const posts = []

  for (const [filePath, loadContent] of Object.entries(postModules)) {
    const content = await loadContent()
    const frontmatter = getFrontmatter(content)
    const nameMatch = filePath.match(/blog\/posts\/(.+)\.md$/)
    const slug = nameMatch ? nameMatch[1] : ''

    posts.push({
      title: frontmatter.title || '无标题',
      excerpt: frontmatter.excerpt || getExcerpt(content),
      category: frontmatter.category || '',
      date: frontmatter.date || '',
      author: frontmatter.author || 'Stellan W',
      tags: frontmatter.tags || [],
      readingTime: estimateReadingTime(content),
      path: `/AstralLeap/blog/posts/${slug}`
    })
  }

  allPosts.value = posts.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const filteredArticles = computed(() => {
  if (!props.category) return allPosts.value
  return allPosts.value.filter(a => a.category === props.category)
})

const getCategoryColor = (category) => {
  const colors = {
    '嵌入式软件': 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
    '硬件设计': 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    '项目复盘': 'linear-gradient(135deg, #10b981, #059669)',
    '随笔/工具': 'linear-gradient(135deg, #f59e0b, #ef4444)'
  }
  return colors[category] || 'linear-gradient(135deg, #8b5cf6, #4f46e5)'
}
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.article-fade-enter-active { transition: all 0.5s ease; }
.article-fade-enter-from { opacity: 0; transform: translateY(20px); }
.article-fade-leave-active { transition: all 0.3s ease; position: absolute; }
.article-fade-leave-to { opacity: 0; transform: translateX(-20px); }

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
  align-items: center;
}
.article-category {
  color: white;
  padding: 0.3rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}
.article-date,
.article-reading-time {
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
.empty-state p { margin: 0; }
</style>