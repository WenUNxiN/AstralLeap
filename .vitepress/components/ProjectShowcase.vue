<template>
  <div class="project-showcase" :class="{ 'is-preview': limit > 0 }">
    <div class="projects-grid">
      <a v-for="project in displayedProjects" :key="project.folder" :href="project.link" class="project-card" :style="{ '--project-gradient': project.gradient }">
        <div class="card-body">
          <div class="card-top">
            <span class="card-number">PROJECT / {{ project.number }}</span>
            <span v-if="project.status" class="card-status" :class="project.statusClass"><span aria-hidden="true"></span>{{ project.status }}</span>
          </div>
          <div class="card-heading">
            <span class="card-icon" aria-hidden="true">{{ project.icon }}</span>
            <h3>{{ project.name }}</h3>
          </div>
          <p class="card-desc">{{ project.desc }}</p>
          <div class="card-tech">
            <span v-for="t in project.tech" :key="t" class="tech-tag">{{ t }}</span>
          </div>
          <div class="card-footer">
            <span>查看项目文档</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="17" height="17" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
          </div>
        </div>
      </a>
      <div v-if="!displayedProjects.length" class="empty-state">
        <div class="empty-icon">🌱</div>
        <p class="empty-text">暂无项目</p>
        <p class="empty-hint">相关内容正在整理，敬请期待</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data } from '../data/projects.data.ts'
import { orderProjectPreview, projectStatusClass } from '../utils/project-presentation.ts'

const props = defineProps({
  limit: { type: Number, default: 0 },
  preferActive: { type: Boolean, default: false }
})

// Discovery and entry-point resolution happen at build time; only card metadata
// reaches the browser. Optional presentation fields never block a new project.
const projects = computed(() => data.map(project => {
  const isExternal = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(project.link)
  return {
    ...project,
    name: typeof project.name === 'string' && project.name.trim() ? project.name : project.folder,
    icon: typeof project.icon === 'string' && project.icon.trim() ? project.icon : '✦',
    desc: typeof project.desc === 'string' ? project.desc : '',
    tech: Array.isArray(project.tech) ? project.tech.filter(item => typeof item === 'string' && item.trim()) : [],
    link: isExternal ? project.link : withBase(project.link),
    statusClass: projectStatusClass(project.status)
  }
}))

const displayedProjects = computed(() => {
  const ordered = orderProjectPreview(projects.value, props.preferActive)
  return props.limit > 0 ? ordered.slice(0, props.limit) : ordered
})
</script>

<style scoped>
.project-showcase { width: 100%; min-width: 0; }
.projects-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.project-card { position: relative; display: flex; flex-direction: column; min-width: 0; min-height: 286px; overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 13px; background: var(--vp-c-bg); color: inherit; text-decoration: none; transition: border-color .2s, transform .2s, box-shadow .2s; }
.project-card::before { content: ''; position: absolute; top: 0; left: 24px; right: 24px; height: 2px; background: var(--project-gradient, var(--vp-c-brand-1)); opacity: .65; }
.project-card:hover { border-color: color-mix(in srgb, var(--vp-c-brand-1) 50%, var(--vp-c-divider)); transform: translateY(-3px); box-shadow: 0 8px 28px rgb(40 50 100 / 6%); }
.project-card:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; border-color: var(--vp-c-brand-1); }
.card-body { display: flex; flex-direction: column; flex: 1; min-width: 0; padding: 24px 25px 18px; }
.card-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 22px; }
.card-number { color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); font-size: 10px; letter-spacing: .08em; }
.card-status { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 5px; background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-size: 10px; line-height: 1.7; white-space: nowrap; }
.card-status > span { width: 4px; height: 4px; border-radius: 50%; background: currentColor; }
.card-status.planned { background: var(--vp-c-default-soft); color: var(--vp-c-text-2); }
.card-status.complete { background: var(--astral-accent-soft); color: var(--astral-accent); }
.card-heading { display: flex; align-items: center; gap: 12px; }
.card-icon { display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); font-size: 20px; flex-shrink: 0; }
.card-heading h3 { margin: 0; color: var(--vp-c-text-1); font-size: 17px; font-weight: 600; line-height: 1.6; letter-spacing: -.02em; overflow-wrap: anywhere; }
.card-body .card-desc { margin: 13px 0 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.85; }
.card-tech { display: flex; flex-wrap: wrap; gap: 6px; padding-top: 17px; padding-bottom: 22px; }
.tech-tag { padding: 3px 7px; border: 1px solid var(--vp-c-divider); border-radius: 4px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-family: var(--vp-font-family-mono); font-size: 10px; line-height: 1.6; }
.card-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: auto; padding-top: 15px; border-top: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2); font-size: 11px; transition: color .2s; }
.card-footer svg { color: var(--vp-c-brand-1); transition: transform .2s; }
.project-card:hover .card-footer { color: var(--vp-c-brand-1); }
.project-card:hover .card-footer svg { transform: translateX(3px); }
@media (max-width: 640px) {
  .projects-grid { grid-template-columns: 1fr; gap: 12px; }
  .project-card { min-height: 268px; }
  .card-body { padding: 21px 22px 17px; }
  .card-top { margin-bottom: 18px; }
  .card-heading h3 { font-size: 16px; }
  .card-desc { font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .project-card:hover, .project-card:hover .card-footer svg { transform: none; }
}
</style>
