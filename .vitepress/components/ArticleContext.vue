<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data } from '../data/explore.data.ts'
import { findExploreArticle } from '../utils/explore'
import AboutIcon from './AboutIcon.vue'
import { sectionForPath } from '../utils/sections'
import { normalizeDate, formatDate, firstOf, getStatusClass, getStatusText } from '../utils/content-loader'

const { page, frontmatter } = useData()
const section = computed(() => {
  const path = page.value.relativePath || ''
  if (path.endsWith('/index.md') || frontmatter.value.categoryPage) return null
  return sectionForPath(path) || null
})
const date = computed(() => normalizeDate(frontmatter.value.date))
const topics = computed(() => {
  const url = '/' + (page.value.relativePath || '').replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
  const note = findExploreArticle(data.articles, url)
  const themes = new Set(data.topics.filter(topic => topic.kind === 'theme').map(topic => topic.id))
  return (note?.topics || []).filter(topic => themes.has(topic.id)).slice(0, 3)
})
</script>

<template>
  <div v-if="section" class="article-context">
    <span class="article-context-kind"><AboutIcon :name="section.icon" />{{ section.label }}</span>
    <div class="article-context-details">
      <time v-if="date" :datetime="date">{{ formatDate(date) }}</time>
      <span v-if="frontmatter.platform">{{ firstOf(frontmatter.platform) }}</span>
      <span v-if="frontmatter.status" class="article-context-status" :class="getStatusClass(frontmatter.status)">{{ getStatusText(frontmatter.status) }}</span>
    </div>
    <nav v-if="topics.length" class="article-context-topics" aria-label="相关主题">
      <span>相关主题</span>
      <a v-for="topic in topics" :key="topic.id" :href="withBase('/explore/?topic=' + encodeURIComponent(topic.id))">{{ topic.label }}<AboutIcon name="arrow-up" /></a>
    </nav>
  </div>
</template>
