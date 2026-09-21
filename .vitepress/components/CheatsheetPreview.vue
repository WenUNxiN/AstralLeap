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

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="cheat-grid">
      <a
        v-for="item in displayItems"
        :key="item.slug"
        :href="item.link"
        class="cheat-card"
      >
        <div class="cheat-icon">{{ getIcon(item.slug) }}</div>
        <div class="cheat-body">
          <h3 class="cheat-title">{{ item.title }}</h3>
          <p v-if="item.description" class="cheat-desc">{{ item.description }}</p>
        </div>
      </a>
    </div>

    <div v-if="showMore && !loading" class="section-more">
      <a :href="moreLink">查看全部速查表 →</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { parseContentList } from '../utils/content-loader'

const props = defineProps({
  limit: { type: Number, default: 6 },
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/cheatsheet/' }
})

const items = ref<any[]>([])
const loading = ref(true)

const displayItems = computed(() => {
  return items.value.slice(0, props.limit)
})

function getIcon(slug: string): string {
  const iconMap: Record<string, string> = {
    'linux': '🐧',
    'v4l2': '📷',
    'ffmpeg': '🎬',
    'git': '🌿',
    'vim': '📝',
    'docker': '🐳',
    'ssh': '🔐',
    'gdb': '🔍',
  }
  return iconMap[slug] || '📋'
}

onMounted(async () => {
  const modules = import.meta.glob('../../cheatsheet/*.md', { query: '?raw', import: 'default' })
  items.value = await parseContentList(modules, '/AstralLeap/cheatsheet/')
  loading.value = false
})
</script>

<style scoped>
.cheatsheet-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 36px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .icon {
  font-size: 20px;
}

.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 4px;
}

.section-sub {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.loading {
  text-align: center;
  padding: 30px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

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

.section-more {
  text-align: right;
  margin-top: 16px;
}

.section-more a {
  font-size: 12.5px;
  color: var(--vp-c-brand-1);
  font-weight: 500;
  text-decoration: none;
}

.section-more a:hover {
  text-decoration: underline;
}

/* 响应式 */
@media (max-width: 640px) {
  .cheatsheet-section {
    padding: 28px 0;
  }
  .section-title {
    font-size: 16px;
  }
  .cheat-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
