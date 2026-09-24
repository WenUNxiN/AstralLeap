<template>
  <div class="knowledge-section">
    <div class="section-header">
      <h2 class="section-title">
        <span class="icon">📚</span>
        技术知识库
        <span class="badge">NEW</span>
      </h2>
      <p class="section-sub">系统化的嵌入式技术知识，从基础到进阶，持续更新中</p>
    </div>

    <div class="knowledge-tags">
      <a
        v-for="cat in categories"
        :key="cat.dir"
        :href="withBase(cat.url)"
        class="k-tag"
      >
        <span class="icon">{{ cat.icon }}</span>
        <span class="name">{{ cat.name }}</span>
        <span class="count">{{ cat.count }} 篇</span>
      </a>
    </div>

    <div v-if="showMore" class="section-more">
      <a :href="withBase(moreLink)">浏览全部知识库 →</a>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { data } from '../data/knowledge.data.ts'

defineProps({
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/knowledge/' }
})

const categories = data.categories
</script>

<style scoped>
.knowledge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.k-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
  text-decoration: none;
}

.k-tag:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  transform: translateY(-1px);
}

.k-tag .icon {
  font-size: 14px;
}

.k-tag .name {
  font-weight: 500;
}

.k-tag .count {
  font-size: 10.5px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-elv);
  padding: 1px 6px;
  border-radius: 4px;
}

.k-tag:hover .count {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}

</style>
