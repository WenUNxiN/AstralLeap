---
layout: page
sidebar: false
title: Debug 记录
description: 从现象与日志出发，留下排查过程、根因、处理方法与验证结果。
pageClass: collection-page collection-compact
---

<script setup>
import { withBase } from 'vitepress'
import DebugGrid from '../../.vitepress/components/DebugGrid.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import '../../.vitepress/theme/collections.css'
</script>

<main class="collection-shell">
  <a class="collection-back" :href="withBase('/explore/')"><AboutIcon name="arrow" /> 返回探索</a>
  <header class="collection-compact-header">
    <div>

# Debug 记录

<p>从现象与日志出发，记录排查过程、根因和处理结果，也保留还在追踪的问题。</p>
    </div>
    <a class="collection-all-records" :href="withBase('/explore/?type=debug')">在探索中浏览 <AboutIcon name="arrow" /></a>
  </header>
  <section class="collection-compact-content" aria-label="Debug 记录">
    <DebugGrid />
  </section>
</main>
