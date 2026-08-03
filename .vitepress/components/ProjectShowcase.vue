<template>
  <div class="projects-page">
    <!-- 骨架屏：加载时显示 -->
    <div v-if="!projects.length" class="projects-grid">
      <div v-for="n in skeletonCount" :key="n" class="project-card skeleton">
        <div class="card-accent skeleton-bg"></div>
        <div class="card-body">
          <div class="card-top">
            <div class="skeleton-icon skeleton-bg"></div>
            <div class="card-title-box">
              <div class="skeleton-title skeleton-bg"></div>
              <div class="skeleton-status skeleton-bg"></div>
            </div>
          </div>
          <div class="skeleton-tags">
            <div class="skeleton-tag skeleton-bg"></div>
            <div class="skeleton-tag skeleton-bg"></div>
          </div>
          <div class="skeleton-text skeleton-bg"></div>
          <div class="skeleton-text short skeleton-bg"></div>
        </div>
      </div>
    </div>
    <!-- 实际内容 -->
    <div v-else class="projects-grid">
      <a v-for="(project, i) in displayedProjects" :key="project.name" :href="project.link" class="project-card" :style="{ animationDelay: i * 0.1 + 's' }">
        <div class="card-accent" :style="{ background: project.gradient }"></div>
        <div class="card-body">
          <div class="card-top">
            <div class="card-icon" :style="{ background: project.gradient }">
              <span>{{ project.icon }}</span>
            </div>
            <div class="card-title-box">
              <h3>{{ project.name }}</h3>
              <span class="card-status" :style="{ color: project.statusColor }">{{ project.status }}</span>
            </div>
          </div>
          <div class="card-tech">
            <span v-for="t in project.tech" :key="t" class="tech-tag">{{ t }}</span>
          </div>
          <p class="card-desc">{{ project.desc }}</p>
          <div class="card-btn">
            查看详情
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  limit: { type: Number, default: 0 }
})

const projects = ref([])
const skeletonCount = computed(() => props.limit || 4)

const sortedProjects = computed(() => {
  const sorted = [...projects.value].sort((a, b) => {
    const numA = parseFloat((a.folder.match(/^(\d+)/) || ['0'])[0])
    const numB = parseFloat((b.folder.match(/^(\d+)/) || ['0'])[0])
    return numB - numA
  })
  return props.limit > 0 ? sorted.slice(0, props.limit) : sorted
})

const displayedProjects = computed(() => sortedProjects.value)

onMounted(async () => {
  try {
    const modules = import.meta.glob('../../projects/*/project.json', { query: '?raw', import: 'default' })
    const list = []
    for (const [path, load] of Object.entries(modules)) {
      try {
        const raw = await load()
        const data = typeof raw === 'string' ? JSON.parse(raw.replace(/﻿/g, '')) : raw
        const linkMatch = path.match(/projects\/(.+?)\/project\.json$/)
        const slug = linkMatch ? linkMatch[1] : ''
        const link = data.link || ('/AstralLeap/projects/' + slug + '/' + slug)
        list.push({ ...data, folder: slug, link, statusColor: data.statusColor || 'var(--vp-c-brand)' })
      } catch (e) { console.warn('Failed:', path) }
    }
    projects.value = list
  } catch (e) { console.error('Failed:', e) }
})
</script>

<style scoped>
.projects-page { max-width: 1200px; margin: 0 auto; }
.projects-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; }
@media (max-width: 1024px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .projects-grid { grid-template-columns: 1fr; } }

/* 实际项目卡片 */
.project-card { display: flex; flex-direction: column; position: relative; height: 260px; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); border-radius: 16px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.3s; animation: cardIn 0.5s ease both; }
@keyframes cardIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.project-card:hover { border-color: var(--vp-c-brand); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
.card-accent { height: 3px; width: 100%; flex-shrink: 0; }
.card-body { display: flex; flex-direction: column; flex: 1; padding: 1.25rem; }
.card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.card-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
.card-title-box { flex: 1; min-width: 0; }
.card-title-box h3 { font-size: 0.95rem; font-weight: 700; color: var(--vp-c-text-1); margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-status { font-size: 0.65rem; font-weight: 600; padding: 2px 8px; border: 1px solid currentColor; border-radius: 20px; }
.card-tech { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
.tech-tag { font-size: 0.65rem; color: var(--vp-c-brand); background: var(--vp-c-brand-soft); padding: 2px 8px; border-radius: 4px; }
.card-desc { font-size: 0.8rem; color: var(--vp-c-text-2); line-height: 1.5; margin: 0; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.card-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; color: var(--vp-c-brand); padding: 6px 0; margin-top: auto; }
.project-card:hover .card-btn { gap: 10px; }

/* 骨架屏样式 */
.project-card.skeleton { animation: none; cursor: default; }
.skeleton-bg { background: linear-gradient(90deg, var(--vp-c-bg-elv) 25%, var(--vp-c-bg-alt) 50%, var(--vp-c-bg-elv) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.skeleton-icon { width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0; }
.skeleton-title { height: 16px; width: 70%; margin-bottom: 8px; }
.skeleton-status { height: 12px; width: 40%; }
.skeleton-tags { display: flex; gap: 6px; margin-bottom: 12px; }
.skeleton-tag { height: 18px; width: 50px; border-radius: 4px; }
.skeleton-text { height: 12px; width: 90%; margin-bottom: 6px; }
.skeleton-text.short { width: 60%; }
</style>