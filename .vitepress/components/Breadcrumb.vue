<template>
  <nav v-if="crumbs.length" class="vp-breadcrumb" aria-label="面包屑导航">
    <a :href="withBase('/')">首页</a>
    <template v-for="(c, i) in crumbs" :key="i">
      <span class="sep">/</span>
      <a v-if="c.url" :href="withBase(c.url)">{{ c.label }}</a>
      <span v-else class="current">{{ c.label }}</span>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as knowledgeData } from '../data/knowledge.data.ts'

const { page, frontmatter, title } = useData()

/* 一级目录 → 名称与索引页 */
const topMap = {
  knowledge: { label: '知识库', url: '/knowledge/' },
  experiments: { label: '实验记录', url: '/experiments/' },
  debug: { label: 'Debug 记录', url: '/debug/' },
  cheatsheet: { label: '命令速查', url: '/cheatsheet/' },
  projects: { label: '项目', url: '/projects/' },
  doc: { label: '文档', url: null }
}

const crumbs = computed(() => {
  const rel = (page.value.relativePath || '').replace(/\\/g, '/')
  if (!rel || rel === 'index.md') return []
  const parts = rel.replace(/\.md$/, '').split('/')
  const isIndex = parts[parts.length - 1] === 'index'
  const meta = topMap[parts[0]]
  const pageLabel = frontmatter.value.title || title.value
  const out = []

  if (meta) {
    out.push({ label: meta.label, url: isIndex && parts.length === 2 ? null : meta.url })
    // 知识库二级为分类目录，映射为分类名（分类索引页显示为末级）
    if (parts[0] === 'knowledge' && parts[1] && parts[1] !== 'index') {
      const cat = knowledgeData.categories.find(c => c.dir === parts[1])
      out.push({
        label: cat?.name || (isIndex ? pageLabel : parts[1]),
        url: isIndex ? null : cat?.url || `/knowledge/${parts[1]}/`
      })
    }
    if (!isIndex) out.push({ label: pageLabel, url: null })
    return out
  }

  // 单页（about 等）：首页 / 页面名
  return isIndex ? [] : [{ label: pageLabel, url: null }]
})
</script>

<style scoped>
.vp-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 0;
  padding: 4px 0;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.vp-breadcrumb a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.vp-breadcrumb a:hover {
  text-decoration: underline;
}

.vp-breadcrumb .sep {
  margin: 0 6px;
  color: var(--vp-c-text-3);
}

.vp-breadcrumb .current {
  color: var(--vp-c-text-2);
}
</style>
