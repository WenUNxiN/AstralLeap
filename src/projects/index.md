---
layout: page
title: 项目展示
description: 记录不同技术方向上的项目构思、实现与进展，让好奇心在一次次动手实践中落地。
aside: false
pageClass: projects-page
---

<script setup>
import { withBase } from 'vitepress'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import ProjectShowcase from '../../.vitepress/components/ProjectShowcase.vue'
import '../../.vitepress/theme/home.css'
</script>

<main class="projects-shell">
  <header class="projects-header">
    <p class="home-eyebrow">PROJECTS <span>/ 项目展示</span></p>
    <h1 id="projects-title"><span class="home-sr-only">项目展示 · </span>把想法，做成作品。<a class="header-anchor home-heading-anchor" href="#projects-title" aria-label="项目展示的永久链接">#</a></h1>
    <p class="projects-description">在感兴趣的问题上动手探索。这里收录项目的构思、实现与进展，<br class="projects-desktop-break">也整理开发过程中的技术资料与使用说明。</p>
    <div class="projects-header-bottom"><span><span class="home-status-dot" aria-hidden="true"></span>从构思到实现，持续更新</span><a :href="withBase('/about.html')">认识这里的探索者 <AboutIcon name="arrow-up" /></a></div>
  </header>
  <ProjectShowcase />
  <aside class="projects-note"><span class="projects-note-icon"><AboutIcon name="flask" /></span><div><h2 id="projects-experiments">作品之外，还有过程。<a class="header-anchor home-heading-anchor" href="#projects-experiments" aria-label="实验记录入口的永久链接">#</a></h2><p>具体的技术验证、调试过程与阶段性结果，记录在实验和 Debug 中。</p></div><a :href="withBase('/experiments/')">看看实验记录 <AboutIcon name="arrow" /></a></aside>
</main>
