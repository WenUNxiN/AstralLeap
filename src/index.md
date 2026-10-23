---
layout: page
title: 星跃 Astral Leap
description: Stellan W 的技术知识花园。跟随好奇心探索不同技术，记录学习、项目、实验与 Debug，让知识在实践中持续生长。
pageClass: home-page
---
<script setup>
import { withBase } from 'vitepress'
import AboutIcon from '../.vitepress/components/AboutIcon.vue'
import ProjectShowcase from '../.vitepress/components/ProjectShowcase.vue'
import KnowledgeTags from '../.vitepress/components/KnowledgeTags.vue'
import ExperimentList from '../.vitepress/components/ExperimentList.vue'
import DebugList from '../.vitepress/components/DebugList.vue'
import CheatsheetPreview from '../.vitepress/components/CheatsheetPreview.vue'
import '../.vitepress/theme/home.css'
</script>

<main class="home-shell">
  <div class="home-topline"><span class="home-eyebrow">ASTRAL LEAP <span>/ 星跃</span></span><a :href="withBase('/about.html')">关于这里的记录者 <AboutIcon name="arrow-up" /></a></div>

  <section class="home-hero" aria-labelledby="home-title">
    <div class="home-intro">
      <p class="home-greeting">你好，我是 Stellan W。</p>
      <h1 id="home-title"><span class="home-sr-only">星跃首页 · </span>以星为向，<br><span>以技为跃<span class="home-period">.</span></span><a class="header-anchor home-heading-anchor" href="#home-title" aria-label="星跃首页的永久链接">#</a></h1>
      <p class="home-role">一座随好奇心生长的技术知识花园</p>
      <p class="home-description">从软件到硬件，从原理到实践，跟着问题继续探索。<br>记录项目、实验与思考，让零散的知识慢慢连接起来。</p>
      <div class="home-labels" aria-label="探索方式"><span>Learn</span> <span>Build</span> <span>Share</span></div>
      <div class="home-actions"><a class="home-button home-button-primary" :href="withBase('/projects/')">探索我的项目 <AboutIcon name="arrow" /></a><a class="home-button home-button-secondary" :href="withBase('/knowledge/')">浏览知识库 <AboutIcon name="book" /></a></div>
    </div>
    <aside class="home-notebook" aria-labelledby="notebook-title">
      <div class="home-notebook-top"><span><span class="home-status-dot" aria-hidden="true"></span>持续探索，持续记录</span><img :src="withBase('/logo.png')" alt="Astral Leap 标志" width="36" height="36"></div>
      <p class="home-eyebrow">THE EXPLORATION LOG</p>
      <h2 id="notebook-title">从一个问题，<br>走向下一次发现。<a class="header-anchor home-heading-anchor" href="#notebook-title" aria-label="探索路径的永久链接">#</a></h2>
      <nav class="home-path" aria-label="开始探索">
        <a :href="withBase('/knowledge/')"><span class="home-path-icon"><AboutIcon name="book" /></span><div><strong>理解原理</strong><span>连接知识，建立体系</span></div><span class="home-path-order">01</span></a>
        <a :href="withBase('/experiments/')"><span class="home-path-icon"><AboutIcon name="flask" /></span><div><strong>动手验证</strong><span>让想法在实践中落地</span></div><span class="home-path-order">02</span></a>
        <a :href="withBase('/debug/')"><span class="home-path-icon"><AboutIcon name="bug" /></span><div><strong>追到根因</strong><span>从现象出发，把问题讲清楚</span></div><span class="home-path-order">03</span></a>
      </nav>
      <div class="home-notebook-footer"><span aria-hidden="true">↳</span> 保持好奇，记录每一次向前。</div>
    </aside>
  </section>

  <section class="home-section" aria-labelledby="home-projects-title">
    <div class="home-section-heading"><div><p class="home-eyebrow">01 / PROJECTS</p><h2 id="home-projects-title">把想法，做成作品。<a class="header-anchor home-heading-anchor" href="#home-projects-title" aria-label="项目展示的永久链接">#</a></h2><p class="home-section-description">从产品开发到技术探索，记录项目的构思、实现与进展。</p></div><a class="home-section-link" :href="withBase('/projects/')">全部项目 <AboutIcon name="arrow" /></a></div>
    <ProjectShowcase :limit="4" />
  </section>

  <section class="home-section" aria-labelledby="home-knowledge-title">
    <div class="home-section-heading"><div><p class="home-eyebrow">02 / KNOWLEDGE</p><h2 id="home-knowledge-title">让知识，慢慢连成体系。<a class="header-anchor home-heading-anchor" href="#home-knowledge-title" aria-label="技术知识库的永久链接">#</a></h2><p class="home-section-description">整理学过的原理与方法，也为不断生长的新兴趣留出空间。</p></div><a class="home-section-link" :href="withBase('/knowledge/')">进入知识库 <AboutIcon name="arrow" /></a></div>
    <KnowledgeTags :showMore="false" />
  </section>

  <section class="home-section" aria-labelledby="home-experiments-title">
    <div class="home-section-heading"><div><p class="home-eyebrow">03 / EXPERIMENTS</p><h2 id="home-experiments-title">最新实验记录<a class="header-anchor home-heading-anchor" href="#home-experiments-title" aria-label="实验记录的永久链接">#</a></h2><p class="home-section-description">每次实验一个明确目标，记录环境、步骤、代码与结果。</p></div><a class="home-section-link" :href="withBase('/experiments/')">全部实验 <AboutIcon name="arrow" /></a></div>
    <ExperimentList :limit="4" :showMore="false" />
  </section>

  <section class="home-section" aria-labelledby="home-debug-title">
    <div class="home-section-heading"><div><p class="home-eyebrow">04 / DEBUG NOTES</p><h2 id="home-debug-title">每个问题，都有来路。<a class="header-anchor home-heading-anchor" href="#home-debug-title" aria-label="Debug 记录的永久链接">#</a></h2><p class="home-section-description">从现象到根因，再到解决方案，积累可以回看的排查记录。</p></div><a class="home-section-link" :href="withBase('/debug/')">全部 Debug 记录 <AboutIcon name="arrow" /></a></div>
    <DebugList :limit="3" :showMore="false" />
  </section>

  <section class="home-section" aria-labelledby="home-cheatsheet-title">
    <div class="home-section-heading"><div><p class="home-eyebrow">05 / CHEATSHEETS</p><h2 id="home-cheatsheet-title">常用命令，随用随查。<a class="header-anchor home-heading-anchor" href="#home-cheatsheet-title" aria-label="命令速查的永久链接">#</a></h2><p class="home-section-description">给日常开发准备的小抄，让熟悉的命令随时在手边。</p></div><a class="home-section-link" :href="withBase('/cheatsheet/')">全部速查表 <AboutIcon name="arrow" /></a></div>
    <CheatsheetPreview :limit="4" :showMore="false" />
  </section>

  <div class="home-colophon"><span><span aria-hidden="true">✦</span> 这里的内容，会和探索一起生长。</span><a :href="withBase('/about.html#contact')">聊聊技术与想法 <AboutIcon name="arrow-up" /></a></div>
</main>
