---
layout: page
sidebar: false
title: 技术知识库
description: 记录感兴趣技术的原理、方法与实践，让知识随探索不断连接、生长。
pageClass: collection-page
---

<script setup>
import { withBase } from 'vitepress'
import KnowledgeCategories from '../../.vitepress/components/KnowledgeCategories.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import { data as knowledge } from '../../.vitepress/data/knowledge.data.ts'
import '../../.vitepress/theme/collections.css'

const articleCount = knowledge.articles.length
</script>

<main class="collection-shell">
  <div class="collection-topline"><span class="collection-eyebrow">KNOWLEDGE BASE</span><span class="collection-topnote">连接知识，构建体系。</span></div>
  <header class="collection-hero">
    <div class="collection-intro">

# 技术知识库

<p class="collection-lead">把零散的知识，<br><span>慢慢连成自己的体系。</span></p>
<p class="collection-description">围绕学习中遇到的概念、工具与方法，记录原理、实践经验与理解过程。沿着感兴趣的问题不断探索，为新知识找到位置，也为下一次动手多留一点底气。</p>
<div class="collection-topics"><span>理解原理</span><span>动手实践</span><span>持续修订</span></div>
    </div>
    <aside class="collection-overview">
      <div class="collection-overview-label"><AboutIcon name="book" /><span>一座持续生长的知识花园</span></div>
      <p class="collection-overview-note">从已有的 Linux、驱动与 Camera 笔记出发。<br>沿着好奇心，继续拓展新的方向。</p>
      <dl class="collection-metrics"><div><dt>篇知识笔记</dt><dd>{{ articleCount }}</dd></div><div><dt>个技术分类</dt><dd>{{ knowledge.categories.length }}</dd></div></dl>
    </aside>
  </header>

  <section class="collection-content">
    <div class="collection-section-heading">
      <div><p class="collection-eyebrow">01 / EXPLORE BY TOPIC</p>

## 从感兴趣的方向开始

</div><p>先建立地图，再深入一个知识点。</p>
    </div>
    <KnowledgeCategories />
  </section>

  <section class="collection-guide">
    <div><p class="collection-eyebrow">02 / READING NOTES</p>

## 找到适合你的阅读路径

</div>
    <div class="collection-guide-items">
      <div><span class="collection-step">01</span><h3>按方向探索</h3><p>进入技术分类，从概念和基础笔记开始，逐步连接完整链路。</p></div>
      <div><span class="collection-step">02</span><h3>带着问题检索</h3><p>使用顶部搜索，直接查找接口名称、错误信息或正在研究的主题。</p></div>
      <div><span class="collection-step">03</span><h3>把理解放进实践</h3><p>结合<a :href="withBase('/experiments/')">实验记录</a>与<a :href="withBase('/debug/')">Debug 记录</a>阅读，看看知识在真实环境里如何使用。</p></div>
    </div>
  </section>
</main>
