<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { sectionForPath } from '../utils/sections'
import { data as knowledge } from '../data/knowledge.data.ts'
import AboutIcon from './AboutIcon.vue'

const { page, theme } = useData()
const section = computed(() => sectionForPath(page.value.relativePath || ''))
const location = computed(() => {
  const parts = (page.value.relativePath || '').split('/')
  if (section.value?.id === 'knowledge' && parts[1] !== 'index.md') {
    return knowledge.categories.find(category => category.dir === parts[1])?.name || parts[1]
  }
  if (section.value?.id === 'projects' && parts[1] !== 'index.md') {
    const sidebar = theme.value.sidebar
    return sidebar?.[`/projects/${parts[1]}/`]?.[0]?.text || parts[1]
  }
  return section.value?.title || '探索'
})
const back = computed(() => section.value?.explore
  ? { label: '返回探索', link: `/explore/?type=${section.value.id}` }
  : { label: '返回项目集', link: '/projects/' })
</script>

<template>
  <div class="sidebar-intro">
    <a class="sidebar-back" :href="withBase(back.link)"><span aria-hidden="true">←</span>{{ back.label }}</a>
    <p class="sidebar-kicker"><AboutIcon :name="section?.icon || 'layers'" /><span>{{ location }}</span></p>
    <p class="sidebar-intro-note">{{ section?.id === 'projects' ? '当前项目的资料与进展' : `${section?.label || '探索'} · 目录导航` }}</p>
  </div>
</template>
