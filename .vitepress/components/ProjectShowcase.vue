<template>
  <div class="projects-grid">
    <div 
      v-for="(project, i) in projects" 
      :key="project.name" 
      class="project-card" 
      :style="{ '--delay': i * 0.1 + 's' }"
    >
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
        <a :href="project.link" class="card-btn">
          查看详情
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
    <div v-if="projects.length === 0" class="empty-hint">
      暂无项目，请在 projects/ 目录下添加 project.json
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const projects = ref([])

onMounted(async () => {
  try {
    const modules = import.meta.glob('../../projects/*/project.json', { query: '?raw', import: 'default' })
    const list = []
    
    for (const [path, load] of Object.entries(modules)) {
      try {
        const raw = await load()
        const data = typeof raw === 'string' ? JSON.parse(raw) : raw
        const linkMatch = path.match(/projects\/(.+?)\/project\.json$/)
        const slug = linkMatch ? linkMatch[1] : ''
        list.push({
          ...data,
          link: '/AstralLeap/projects/' + slug + '/' + slug,
          statusColor: data.statusColor || 'var(--vp-c-brand)'
        })
      } catch (e) {
        console.warn('Failed to load project:', path, e)
      }
    }
    
    projects.value = list
  } catch (e) {
    console.error('Failed to load projects:', e)
  }
})
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}

.empty-hint {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.project-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: card-in 0.6s ease backwards;
  animation-delay: var(--delay);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-accent {
  height: 3px;
  width: 100%;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.project-card:hover .card-accent {
  opacity: 1;
}

.card-body {
  padding: 1.5rem;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.card-title-box {
  flex: 1;
  min-width: 0;
}

.card-title-box h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 4px;
  line-height: 1.3;
}

.card-status {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 10px;
  border: 1px solid currentColor;
  border-radius: 20px;
  display: inline-block;
  opacity: 0.8;
}

.card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.tech-tag {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 3px 10px;
  border-radius: 6px;
}

.card-desc {
  font-size: 0.88rem;
  color: var(--vp-c-text-2);
  line-height: 1.65;
  margin: 0 0 1.25rem;
}

.card-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-brand);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: all 0.25s ease;
}

.card-btn:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  gap: 12px;
}

.card-btn svg {
  transition: transform 0.25s ease;
}

.card-btn:hover svg {
  transform: translateX(3px);
}
</style>
