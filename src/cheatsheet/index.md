---
layout: page
sidebar: false
title: 命令速查
description: 随用随查的工具命令与配置，按实际使用场景持续整理。
pageClass: collection-page collection-compact
---

<script setup>
import { withBase } from 'vitepress'
import CheatsheetGrid from '../../.vitepress/components/CheatsheetGrid.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import '../../.vitepress/theme/collections.css'
</script>

<main class="collection-shell">
  <a class="collection-back" :href="withBase('/explore/')"><AboutIcon name="arrow" /> 返回探索</a>
  <header class="collection-compact-header">
    <div>

# 命令速查

<p>给经常用到、也容易忘记的命令与配置留一份备忘，按工具和场景查找。</p>
    </div>
    <a class="collection-all-records" :href="withBase('/explore/?type=cheatsheet')">在探索中浏览 <AboutIcon name="arrow" /></a>
  </header>
  <section class="collection-compact-content" aria-label="命令速查">
    <CheatsheetGrid />
  </section>
</main>
