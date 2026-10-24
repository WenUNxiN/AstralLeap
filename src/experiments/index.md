---
layout: page
sidebar: false
title: 实验记录
description: 每次一个明确目标，记录实际环境、步骤、代码与结果，让探索可以复现。
pageClass: collection-page collection-compact
---

<script setup>
import { withBase } from 'vitepress'
import ExperimentGrid from '../../.vitepress/components/ExperimentGrid.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import '../../.vitepress/theme/collections.css'
</script>

<main class="collection-shell">
  <a class="collection-back" :href="withBase('/explore/')"><AboutIcon name="arrow" /> 返回探索</a>
  <header class="collection-compact-header">
    <div>

# 实验记录

<p>每次一个明确目标，留下环境、步骤与实际结果，让下一次尝试有据可循。</p>
    </div>
    <a class="collection-all-records" :href="withBase('/explore/?type=experiments')">在探索中浏览 <AboutIcon name="arrow" /></a>
  </header>
  <section class="collection-compact-content" aria-label="实验记录">
    <ExperimentGrid />
  </section>
</main>
