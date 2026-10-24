<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data } from '../data/explore.data.ts'
import { relatedExplore } from '../utils/explore'
import { sectionForPath } from '../utils/sections'
import AboutIcon from './AboutIcon.vue'

const { page } = useData()
const currentUrl = computed(() => '/' + (page.value.relativePath || '').replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html'))
const notes = computed(() => relatedExplore(data.articles, currentUrl.value))
</script>

<template>
  <section v-if="notes.length" class="related-notes" aria-labelledby="related-title">
    <div class="related-heading"><h2 id="related-title" class="ignore-header">沿着这个主题，继续探索</h2><a :href="withBase('/explore/')">全部记录 <AboutIcon name="arrow" /></a></div>
    <ul>
      <li v-for="note in notes" :key="note.url">
        <a :href="withBase(note.url)"><span class="related-type">{{ sectionForPath(note.url)?.label }}</span><span class="related-title">{{ note.title }}</span><AboutIcon name="arrow" /></a>
      </li>
    </ul>
  </section>
</template>
