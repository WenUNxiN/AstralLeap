<template>
  <div class="article-list">
    <div v-if="articles.length === 0" class="empty">
      暂无文章，敬请期待
    </div>

    <a
      v-for="item in articles"
      :key="item.slug"
      :href="withBase(item.url)"
      class="article-item"
    >
      <div class="article-header">
        <h3 class="article-title">{{ item.title }}</h3>
        <span v-if="item.status" :class="['status-tag', getStatusClass(item.status)]">
          {{ getStatusText(item.status) }}
        </span>
      </div>
      <p v-if="item.description || item.excerpt" class="article-excerpt">
        {{ item.description || item.excerpt }}
      </p>
      <div class="article-meta">
        <span v-if="item.date" class="meta-item">
          📅 {{ formatShortDate(item.date) }}
        </span>
        <span v-if="item.difficulty" :class="['diff-tag', item.difficulty]">
          {{ getDifficultyText(item.difficulty) }}
        </span>
        <div v-if="item.tags && item.tags.length" class="tag-list">
          <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../data/knowledge.data.ts'
import { getStatusText, getStatusClass, getDifficultyText, formatShortDate } from '../utils/content-loader'

const props = defineProps({
  category: { type: String, required: true }
})

const articles = computed(() => data.articles.filter(a => a.dir === props.category))
</script>

<style scoped>
.empty {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
  font-size: 14px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  display: block;
  padding: 16px 18px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.article-item:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateX(4px);
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.article-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: var(--vp-c-text-1);
}

.status-tag {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
}

.status-tag.doing {
  background: rgba(224, 175, 106, 0.12);
  color: var(--vp-c-yellow, #e0af68);
}

.status-tag.done {
  background: rgba(158, 206, 106, 0.12);
  color: var(--vp-c-green, #9ece6a);
}

.article-excerpt {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 0 0 8px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 11.5px;
  color: var(--vp-c-text-3);
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.diff-tag {
  font-size: 10.5px;
  padding: 1px 7px;
  border-radius: 4px;
  font-weight: 500;
}

.diff-tag.beginner {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.diff-tag.intermediate {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.diff-tag.advanced {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-left: auto;
}

.tag {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-elv);
  padding: 1px 6px;
  border-radius: 4px;
}

@media (max-width: 640px) {
  .article-item {
    padding: 12px 14px;
  }
  .article-title {
    font-size: 14px;
  }
}
</style>
