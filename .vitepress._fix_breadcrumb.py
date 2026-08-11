import sys
sys.stdout.reconfigure(encoding='utf-8')

component = '''<template>
  <nav class="breadcrumb" aria-label="面包屑导航">
    <ol class="breadcrumb-list">
      <li class="breadcrumb-item">
        <a href="/AstralLeap/">首页</a>
      </li>
      <li class="breadcrumb-separator">/</li>
      <li v-for="(item, index) in items" :key="index" class="breadcrumb-item">
        <a v-if="item.link" :href="item.link">{{ item.text }}</a>
        <span v-else class="breadcrumb-current">{{ item.text }}</span>
        <span v-if="index < items.length - 1" class="breadcrumb-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const route = useRoute()

const pathLabels = {
  'blog': '博客',
  'categories': '分类',
  'embedded-sw': '嵌入式软件',
  'hardware-design': '硬件设计',
  'projects': '项目复盘',
  'essays-tools': '随笔/工具',
}

const items = computed(() => {
  const path = route.path
  const parts = path.replace(/^\\/|\\/$/g, '').split('/').filter(Boolean)
  // Remove 'AstralLeap' base
  const baseIndex = parts.indexOf('AstralLeap')
  const segments = baseIndex >= 0 ? parts.slice(baseIndex + 1) : parts
  
  const result = []
  let currentPath = '/AstralLeap'
  
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    currentPath += '/' + seg
    const isLast = i === segments.length - 1
    
    // Skip "posts" segment - it is a container, not a real page
    if (seg === 'posts') continue
    
    // Get label from map or clean up segment
    let label = pathLabels[seg] || seg
    
    // Remove .md extension for post pages
    if (label.endsWith('.md')) {
      label = label.replace('.md', '')
    }
    
    if (isLast) {
      result.push({ text: label, link: null })
    } else {
      result.push({ text: label, link: currentPath + '/' })
    }
  }
  
  return result
})
</script>

<style scoped>
.breadcrumb {
  padding: 0.5rem 0 1rem;
  margin-bottom: 0.5rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
}

.breadcrumb-item a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s ease;
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
}

.breadcrumb-item a:hover {
  color: var(--vp-c-brand);
  background: var(--vp-c-bg-soft);
}

.breadcrumb-current {
  color: var(--vp-c-text-1);
  font-weight: 500;
  padding: 0.15rem 0.3rem;
}

.breadcrumb-separator {
  color: var(--vp-c-text-3);
  margin: 0 0.1rem;
  user-select: none;
}
</style>'''

with open(r'D:\StellanW\GitLocalRepository\AstralLeap\.vitepress\components\Breadcrumb.vue', 'w', encoding='utf-8') as f:
    f.write(component)

print('Breadcrumb.vue updated - posts segment skipped')
