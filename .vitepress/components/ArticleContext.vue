<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
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
</script>

<template>
  <div v-if="section" class="article-context">
    <span class="article-context-kind"><AboutIcon :name="section.icon" />{{ section.label }}</span>
    <div class="article-context-details">
      <time v-if="date" :datetime="date">{{ formatDate(date) }}</time>
      <span v-if="frontmatter.platform">{{ firstOf(frontmatter.platform) }}</span>
      <span v-if="frontmatter.status" class="article-context-status" :class="getStatusClass(frontmatter.status)">{{ getStatusText(frontmatter.status) }}</span>
    </div>
  </div>
</template>
