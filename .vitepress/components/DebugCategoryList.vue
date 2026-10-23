<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../data/debug.data.ts'
import { firstOf, formatShortDate, getStatusText } from '../utils/content-loader'
import { matchesDebugCategory } from '../utils/debug-category'

const props = defineProps<{ category: string }>()
const articles = computed(() => data.filter(article => matchesDebugCategory(article, props.category)))
</script>

<template>
  <div v-if="articles.length" class="debug-category-records">
    <table>
      <thead><tr><th scope="col">标题</th><th scope="col">状态</th><th scope="col">平台</th><th scope="col">日期</th></tr></thead>
      <tbody>
        <tr v-for="article in articles" :key="article.url">
          <td><a :href="withBase(article.url)">{{ article.title }}</a></td>
          <td>{{ getStatusText(article.status) || '—' }}</td>
          <td>{{ firstOf(article.platform) || '—' }}</td>
          <td><time v-if="article.date" :datetime="article.date">{{ formatShortDate(article.date) }}</time><span v-else>—</span></td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else class="debug-category-empty">本分类暂无问题记录。</p>
</template>

<style scoped>
.debug-category-records { overflow-x: auto; }
.debug-category-records table { width: 100%; }
.debug-category-records th:not(:first-child),
.debug-category-records td:not(:first-child) { white-space: nowrap; }
.debug-category-empty { color: var(--vp-c-text-2); }
</style>
