---
layout: page
title: 项目展示
aside: false
---

<script setup>
import ProjectShowcase from '../.vitepress/components/ProjectShowcase.vue'
</script>

<div class="projects-page">

  <div class="projects-header">
    <h1>项目展示</h1>
  </div>

  <ProjectShowcase />

</div>

<style scoped>
.projects-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

.projects-header {
  margin-bottom: 2rem;
}

.projects-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}
</style>
