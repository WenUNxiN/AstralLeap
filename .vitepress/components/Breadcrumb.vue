<template>
  <nav v-if="crumbs.length" class="vp-breadcrumb" aria-label="面包屑导航">
    <a :href="withBase('/')">首页</a>
    <template v-for="(c, i) in crumbs" :key="i">
      <span class="sep" aria-hidden="true">/</span>
      <a v-if="c.url" :href="withBase(c.url)">{{ c.label }}</a>
      <span v-else class="current" :aria-current="i === crumbs.length - 1 ? 'page' : undefined">{{ c.label }}</span>
    </template>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as knowledgeData } from '../data/knowledge.data.ts'
import { buildBreadcrumbs } from '../utils/breadcrumb'

const { page, frontmatter, title } = useData()

const crumbs = computed(() => buildBreadcrumbs(
  page.value.relativePath || '',
  frontmatter.value.title || page.value.title || title.value,
  knowledgeData.categories
))
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
