<template>
  <section class="knowledge-section knowledge-preview" aria-labelledby="knowledge-preview-title">
    <div class="section-header knowledge-preview-heading">
      <div>
        <p class="knowledge-overline">KNOWLEDGE / 持续积累</p>
        <h2 id="knowledge-preview-title" class="section-title"><span class="knowledge-heading-icon"><AboutIcon name="book" /></span>技术知识库</h2>
        <p class="section-sub">从底层原理到开发实践，让零散的知识慢慢连成体系。</p>
      </div>
      <a v-if="showMore" :href="withBase(moreLink)" class="knowledge-view-all">浏览知识库 <AboutIcon name="arrow" /></a>
    </div>

    <div v-if="categories.length" class="knowledge-preview-grid">
      <a v-for="cat in categories" :key="cat.dir" :href="withBase(cat.url)" class="knowledge-preview-card">
        <span class="knowledge-topic-icon" aria-hidden="true"><span v-if="knowledgeIcon(cat).emoji" class="knowledge-custom-icon">{{ knowledgeIcon(cat).emoji }}</span><AboutIcon v-else :name="knowledgeIcon(cat).name" /></span>
        <h3>{{ cat.name }}</h3>
        <p v-if="cat.description">{{ cat.description }}</p>
        <div class="knowledge-preview-footer"><span>{{ cat.count }} 篇笔记</span><AboutIcon name="arrow" /></div>
      </a>
    </div>
    <p v-else class="knowledge-preview-empty">笔记正在整理，知识花园会随着学习持续生长。</p>
  </section>
</template>

<script setup>
import { withBase } from 'vitepress'
import { data } from '../data/knowledge.data.ts'
import { knowledgeIcon } from '../utils/knowledge-icons'
import AboutIcon from './AboutIcon.vue'
import '../theme/knowledge.css'

defineProps({
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/knowledge/' }
})

const categories = data.categories
</script>
