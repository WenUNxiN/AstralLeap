<template>
  <section class="knowledge-categories" aria-label="按主题浏览知识库">
    <div class="knowledge-catalog-meta">
      <p class="knowledge-overline">TOPICS / 知识分类</p>
      <p><strong>{{ categories.length }}</strong> 个主题 <span aria-hidden="true">·</span> <strong>{{ totalCount }}</strong> 篇笔记，持续积累中</p>
    </div>

    <div v-if="categories.length" class="knowledge-category-grid">
      <a v-for="(cat, index) in categories" :key="cat.dir" :href="withBase(cat.url)" class="knowledge-category-card">
        <div class="knowledge-card-top">
          <span class="knowledge-topic-icon" aria-hidden="true"><span v-if="knowledgeIcon(cat).emoji" class="knowledge-custom-icon">{{ knowledgeIcon(cat).emoji }}</span><AboutIcon v-else :name="knowledgeIcon(cat).name" /></span>
          <span class="knowledge-card-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
        </div>
        <h3>{{ cat.name }}</h3>
        <p v-if="cat.description" class="knowledge-card-description">{{ cat.description }}</p>
        <div class="knowledge-card-footer">
          <span>{{ cat.count }} 篇笔记</span>
          <span class="knowledge-card-action">进入分类 <AboutIcon name="arrow" /></span>
        </div>
      </a>
    </div>

    <div v-else class="knowledge-empty">
      <span class="knowledge-empty-icon"><AboutIcon name="sprout" /></span>
      <h3>知识，正在慢慢积累。</h3>
      <p>笔记正在整理，先到实验记录看看动手探索的过程。</p>
      <a :href="withBase('/experiments/')">浏览实验记录 <AboutIcon name="arrow" /></a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../data/knowledge.data.ts'
import { knowledgeIcon } from '../utils/knowledge-icons'
import AboutIcon from './AboutIcon.vue'
import '../theme/knowledge.css'

const categories = data.categories
const totalCount = computed(() => categories.reduce((sum, category) => sum + category.count, 0))
</script>
