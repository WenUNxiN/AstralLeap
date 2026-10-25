<script setup>
import { computed, inject, onMounted } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import { sectionForPath } from '../utils/sections'
import { data as knowledge } from '../data/knowledge.data.ts'
import AboutIcon from './AboutIcon.vue'
import { exploreNavigationKey } from '../utils/explore-navigation'

const { page, theme } = useData()
const router = useRouter()
const navigation = inject(exploreNavigationKey, null)
onMounted(() => navigation?.restore())
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
  ? { label: '返回探索', link: navigation?.returnTo.value?.href || withBase(`/explore/?type=${section.value.id}`) }
  : { label: '返回项目集', link: withBase('/projects/') })

function followBack(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (section.value?.explore && navigation) void navigation.goBack(back.value.link)
  else void router.go(back.value.link)
}
</script>

<template>
  <div class="sidebar-intro">
    <a class="sidebar-back vp-raw" :href="back.link" @click="followBack"><span aria-hidden="true">←</span>{{ back.label }}</a>
    <p class="sidebar-kicker"><AboutIcon :name="section?.icon || 'layers'" /><span>{{ location }}</span></p>
    <p class="sidebar-intro-note">{{ section?.id === 'projects' ? '当前项目的资料与进展' : `${section?.label || '探索'} · 目录导航` }}</p>
  </div>
</template>
