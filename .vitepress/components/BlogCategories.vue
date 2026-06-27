<template>
  <div class="blog-categories">
    <div class="section-header">
      <h2 class="section-title">文章分类</h2>
      <span class="total-count">共 {{ totalArticles }} 篇文章</span>
    </div>
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
import { ref, computed, h, onMounted } from 'vue'

const softwareIcon = h('path', { d: 'M20 18v-4a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v4' })
const hardwareIcon = h('path', { d: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' })
const projectIcon = h('path', { d: 'M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10' })
const lifeIcon = h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })

const allPosts = ref([])

const getFrontmatter = (content) => {
  if (typeof content !== 'string') return {}
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*/)
  if (!match) return {}
  const fm = match[1]
  const result = {}
  let currentKey = ''
  let currentList = []
  const lines = fm.split('\n')
  
  lines.forEach(line => {
    const trimmed = line.trim()
    if (trimmed === '') {
      if (currentKey && currentList.length > 0) {
        result[currentKey] = currentList
        currentKey = ''
        currentList = []
      }
      return
    }
    
    if (trimmed.startsWith('- ')) {
      if (currentKey) {
        currentList.push(trimmed.substring(2).replace(/^['"]|['"]$/g, ''))
      }
      return
    }
    
    if (currentKey && currentList.length > 0) {
      result[currentKey] = currentList
      currentKey = ''
      currentList = []
    }
    
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) return
    
    const key = line.substring(0, colonIndex).trim()
    const value = line.substring(colonIndex + 1).trim()
    
    if (value === '') {
      currentKey = key
      currentList = []
    } else if (value.startsWith('[') && value.endsWith(']')) {
      result[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
    } else {
      result[key] = value.replace(/^['"]|['"]$/g, '')
    }
  })
  
  if (currentKey && currentList.length > 0) {
    result[currentKey] = currentList
  }
  
  return result
}

onMounted(async () => {
  const postModules = import.meta.glob('../../blog/posts/*.md', { query: '?raw', import: 'default' })
  const posts = []
  
  for (const [, loadContent] of Object.entries(postModules)) {
    const content = await loadContent()
    const frontmatter = getFrontmatter(content)
    posts.push({
      category: frontmatter.category || ''
    })
  }
  
  allPosts.value = posts
})

const categoryStats = computed(() => {
  const counts = {
    '嵌入式软件': 0,
    '硬件设计': 0,
    '项目复盘': 0,
    '随笔/工具': 0
  }

  allPosts.value.forEach(post => {
    const category = post.category
    if (counts.hasOwnProperty(category)) {
      counts[category]++
    }
  })

  return counts
})

const categories = computed(() => [
  {
    name: '嵌入式软件',
    desc: '专注于 MCU 编程、RTOS、C/C++、算法及上位机工具',
    count: categoryStats.value['嵌入式软件'],
    path: '/AstralLeap/blog/categories/embedded-sw',
    gradient: 'linear-gradient(135deg, #8b5cf6, #4f46e5)',
    icon: softwareIcon
  },
  {
    name: '硬件设计',
    desc: '模电/数电基础、PCB设计、电路仿真与调试',
    count: categoryStats.value['硬件设计'],
    path: '/AstralLeap/blog/categories/hardware-design',
    gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
    icon: hardwareIcon
  },
  {
    name: '项目复盘',
    desc: '软硬结合的项目复盘、从0到1的产品落地记录、踩坑指南',
    count: categoryStats.value['项目复盘'],
    path: '/AstralLeap/blog/categories/projects',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    icon: projectIcon
  },
  {
    name: '随笔/工具',
    desc: '开发工具技巧、学习心得、嵌入式相关生活记录',
    count: categoryStats.value['随笔/工具'],
    path: '/AstralLeap/blog/categories/essays-tools',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    icon: lifeIcon
  }
])

const totalArticles = computed(() => {
  return Object.values(categoryStats.value).reduce((sum, count) => sum + count, 0)
})
</script>

<style scoped>
.blog-categories {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  padding-left: 0.75rem;
}

.total-count {
  font-size: 0.875rem;
  color: var(--vp-c-brand);
  font-weight: 600;
  background: rgba(139, 92, 246, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr;
  gap: 1rem;
}

@media (max-width: 1024px) {
  .category-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .category-list {
    grid-template-columns: 1fr;
  }
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  background: var(--vp-c-bg-alt);
  border-radius: 16px;
  padding: 1.25rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-divider);
  height: 100%;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--vp-c-brand);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.category-icon svg {
  width: 24px;
  height: 24px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-name {
  font-weight: 700;
  color: var(--vp-c-text-primary);
  font-size: 1.1rem;
}

.category-count {
  font-size: 0.75rem;
  color: var(--vp-c-text-tertiary);
  background: var(--vp-c-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
}

.category-desc {
  margin: 0;
  font-size: 0.825rem;
  color: var(--vp-c-text-secondary);
  line-height: 1.5;
  flex: 1;
  text-align: left;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
