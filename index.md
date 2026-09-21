---
layout: home

hero:
  name: "星跃 | Astral Leap"
  tagline: 以星为向，以技为跃
  image:
    src: /logo.png
    alt: Astral Leap logo
  actions:
    - theme: brand
      text: 查看项目
      link: /projects/
    - theme: alt
      text: 浏览知识库
      link: /knowledge/
---

<script setup>
import ProjectShowcase from './.vitepress/components/ProjectShowcase.vue'
import KnowledgeTags from './.vitepress/components/KnowledgeTags.vue'
import ExperimentList from './.vitepress/components/ExperimentList.vue'
import DebugList from './.vitepress/components/DebugList.vue'
import CheatsheetPreview from './.vitepress/components/CheatsheetPreview.vue'
</script>

<ProjectShowcase :limit="4" />

<KnowledgeTags />

<ExperimentList :limit="4" />

<DebugList :limit="3" />

<CheatsheetPreview :limit="4" />