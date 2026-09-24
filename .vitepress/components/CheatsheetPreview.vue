<template>
  <div class="cheatsheet-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="icon">⚡</span>
        命令速查
        <span class="badge">NEW</span>
      </h2>
      <p class="section-sub">常用命令速查表，随时翻找，不用再搜</p>
    </div>

    <div class="cheat-grid">
      <a
        v-for="item in displayItems"
        :key="item.slug"
        :href="withBase(item.url)"
        class="cheat-card"
      >
        <div class="cheat-icon">{{ getCheatsheetIcon(item.slug) }}</div>
        <div class="cheat-body">
          <h3 class="cheat-title">{{ item.title }}</h3>
          <p v-if="item.description" class="cheat-desc">{{ item.description }}</p>
        </div>
      </a>
    </div>

    <div v-if="showMore" class="section-more">
      <a :href="withBase(moreLink)">查看全部速查表 →</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as items } from '../data/cheatsheet.data.ts'
import { getCheatsheetIcon } from '../utils/content-loader'

const props = defineProps({
  limit: { type: Number, default: 6 },
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/cheatsheet/' }
})

const displayItems = computed(() => {
  return items.slice(0, props.limit)
})
</script>

<style scoped>
.cheat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.cheat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.cheat-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.cheat-icon {
  font-size: 26px;
  line-height: 1;
  flex-shrink: 0;
}

.cheat-body {
  min-width: 0;
  flex: 1;
}

.cheat-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 2px;
  color: var(--vp-c-text-1);
}

.cheat-desc {
  font-size: 11.5px;
  color: var(--vp-c-text-3);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式 */
@media (max-width: 640px) {
  .cheat-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
