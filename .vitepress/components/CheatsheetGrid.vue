<template>
  <div class="cheatsheet-grid">
    <a
      v-for="item in cheatsheetList"
      :key="item.slug"
      :href="withBase(item.url)"
      class="cheat-card"
    >
      <div class="cheat-icon">{{ getCheatsheetIcon(item.slug) }}</div>
      <div class="cheat-body">
        <h3 class="cheat-title">{{ item.title }}</h3>
        <p class="cheat-desc">{{ item.description || item.excerpt }}</p>
      </div>
    </a>
    <div v-if="cheatsheetList.length === 0" class="empty">
      <p>暂无速查表</p>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { data as cheatsheetList } from '../data/cheatsheet.data.ts'
import { getCheatsheetIcon } from '../utils/content-loader'
</script>

<style scoped>
.cheatsheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.cheat-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.cheat-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.cheat-icon {
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
}

.cheat-body {
  min-width: 0;
  flex: 1;
}

.cheat-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 6px;
  color: var(--vp-c-text-1);
}

.cheat-desc {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty {
  text-align: center;
  padding: 40px;
  color: var(--vp-c-text-3);
  grid-column: 1 / -1;
}

@media (max-width: 640px) {
  .cheatsheet-grid {
    grid-template-columns: 1fr;
  }
}
</style>
