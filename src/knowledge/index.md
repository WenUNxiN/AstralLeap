---
layout: page
sidebar: false
title: 技术知识库
description: 按主题整理原理、方法与实践中的理解，沿着感兴趣的问题继续探索。
pageClass: collection-page collection-compact
---

<script setup>
import { withBase } from 'vitepress'
import KnowledgeCategories from '../../.vitepress/components/KnowledgeCategories.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import '../../.vitepress/theme/collections.css'
</script>

<main class="collection-shell">
  <a class="collection-back" :href="withBase('/explore/')"><AboutIcon name="arrow" /> 返回探索</a>
  <header class="collection-compact-header">
    <div>

# 技术知识库

<p>按主题整理原理、方法和自己的理解，从一个知识点继续深入。</p>
    </div>
    <a class="collection-all-records" :href="withBase('/explore/?type=knowledge')">在探索中浏览 <AboutIcon name="arrow" /></a>
  </header>
  <section class="collection-compact-content" aria-label="技术知识库">
    <KnowledgeCategories />
  </section>
</main>
