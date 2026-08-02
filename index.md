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
      text: 阅读博客
      link: /blog/
---

<script setup>
import ProjectShowcase from './.vitepress/components/ProjectShowcase.vue'
</script>

<ProjectShowcase :limit="4" />