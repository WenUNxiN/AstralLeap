---
layout: page
sidebar: false
title: 命令速查
description: 开发、调试与日常工具的常用命令和配置，按场景整理，随用随查、持续补充。
pageClass: collection-page
---

<script setup>
import { withBase } from 'vitepress'
import CheatsheetGrid from '../../.vitepress/components/CheatsheetGrid.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import { data as cheatsheetList } from '../../.vitepress/data/cheatsheet.data.ts'
import '../../.vitepress/theme/collections.css'
</script>

<main class="collection-shell">
  <div class="collection-topline"><span class="collection-eyebrow">DEVELOPER CHEATSHEETS</span><span class="collection-topnote">常用命令，触手可及。</span></div>
  <header class="collection-hero">
    <div class="collection-intro">

# 命令速查

<p class="collection-lead">少翻一次文档，<br><span>多一点专注的时间。</span></p>
<p class="collection-description">整理学习与开发中经常用到、也容易忘记的命令与配置。按工具和使用场景查找，从系统操作到开发调试，随用随查，并随新的实践不断补充。</p>
<div class="collection-topics"><span>Linux</span><span>Git</span><span>V4L2</span><span>FFmpeg</span></div>
    </div>
    <aside class="collection-overview">
      <div class="collection-overview-label"><AboutIcon name="terminal" /><span>给日常开发的一份备忘</span></div>
      <p class="collection-overview-note">从高频场景出发，<br>把常用命令与参数留在伸手可及的地方。</p>
      <dl class="collection-metrics collection-metrics-single"><div><dt>份工具速查</dt><dd>{{ cheatsheetList.length }}</dd></div><div class="collection-metric-caption"><dt><code>$ command --help</code></dt><dd>记不住的，交给笔记。</dd></div></dl>
    </aside>
  </header>

  <section class="collection-content">
    <div class="collection-section-heading">
      <div><p class="collection-eyebrow">01 / QUICK REFERENCE</p>

## 找到手边需要的工具

</div><p>选择一个工具，直接进入常用场景。</p>
    </div>
    <CheatsheetGrid />
  </section>

  <section class="collection-bottom-note">
    <span class="collection-note-icon"><AboutIcon name="message" /></span><div>

## 让这份备忘更顺手

<p>已有 Linux、Git、V4L2 与 FFmpeg 的常用操作，后续会随着学习和使用的工具继续补充。你经常查哪些命令？欢迎<a :href="withBase('/about.html#contact')">交流与补充</a>。</p>
    </div>
  </section>
</main>
