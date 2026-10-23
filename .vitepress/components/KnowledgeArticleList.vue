<template>
  <section class="knowledge-articles" aria-label="本分类的知识笔记">
    <div v-if="articles.length" class="knowledge-article-list-heading">
      <p class="knowledge-overline">NOTES / 全部笔记 <span>{{ articles.length }}</span></p>
      <span>最近记录在前</span>
    </div>

    <div v-if="!articles.length" class="knowledge-empty">
      <span class="knowledge-empty-icon"><AboutIcon name="sprout" /></span>
      <h3>这个主题，正在慢慢积累。</h3>
      <p>相关笔记正在整理，可以先看看知识库中的其他主题。</p>
      <a :href="withBase('/knowledge/')">浏览其他知识分类 <AboutIcon name="arrow" /></a>
    </div>

    <div v-else class="knowledge-article-items">
      <a v-for="item in articles" :key="item.url" :href="withBase(item.url)" class="knowledge-article">
        <div class="knowledge-article-heading">
          <h3>{{ item.title }}</h3>
          <span v-if="item.status" :class="['knowledge-status', getStatusClass(item.status)]"><span aria-hidden="true"></span>{{ statusText(item.status) }}</span>
        </div>
        <p v-if="item.description || item.excerpt" class="knowledge-article-excerpt">{{ item.description || item.excerpt }}</p>
        <div class="knowledge-article-meta">
          <span v-if="item.date" class="knowledge-article-date">记录于 <time :datetime="item.date">{{ formatShortDate(item.date) }}</time></span>
          <span v-if="item.difficulty" :class="['knowledge-difficulty', item.difficulty]">{{ getDifficultyText(item.difficulty) }}</span>
        </div>
        <div class="knowledge-article-footer">
          <div v-if="item.tags && item.tags.length" class="knowledge-article-tags" aria-label="文章标签"><span v-for="tag in item.tags.slice(0, 3)" :key="tag">#{{ tag }}</span></div>
          <span class="knowledge-read-link">阅读笔记 <AboutIcon name="arrow" /></span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../data/knowledge.data.ts'
import { getStatusText, getStatusClass, getDifficultyText, formatShortDate } from '../utils/content-loader'
import AboutIcon from './AboutIcon.vue'
import '../theme/knowledge.css'

const props = defineProps({ category: { type: String, required: true } })
const articles = computed(() => data.articles.filter(article => article.dir === props.category))
const statusText = (status: string) => getStatusText(status).replace(/^(?:✓|⟳|🔍|📖)\s*/u, '')
</script>
