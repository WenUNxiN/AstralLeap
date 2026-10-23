---
layout: page
sidebar: false
title: 实验记录
description: 用实验探索感兴趣的技术，每次一个明确目标，记录环境、步骤、代码与结果。
pageClass: collection-page
---

<script setup>
import ExperimentGrid from '../../.vitepress/components/ExperimentGrid.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import { data as experiments } from '../../.vitepress/data/experiments.data.ts'
import '../../.vitepress/theme/collections.css'

const verifiedCount = experiments.filter(item => ['done', 'verified'].includes(item.status)).length
</script>

<main class="collection-shell">
  <div class="collection-topline"><span class="collection-eyebrow">EXPERIMENT LOG</span><span class="collection-topnote">让想法，经得起验证。</span></div>
  <header class="collection-hero">
    <div class="collection-intro">

# 实验记录

<p class="collection-lead">每一次动手，<br><span>把一个问题弄明白。</span></p>
<p class="collection-description">把感兴趣的技术拆成可以动手验证的小问题，每次只完成一个明确目标。留下环境、操作步骤、代码与结果，让尝试可以复现，让结论有所依据。</p>
<div class="collection-topics"><span>目标明确</span><span>过程可复现</span><span>结论有依据</span></div>
    </div>
    <aside class="collection-overview">
      <div class="collection-overview-label"><AboutIcon name="flask" /><span>从一个小实验开始</span></div>
      <p class="collection-overview-note">目前已有采集、编码与 Linux 等实验。<br>新的兴趣，也从一个可验证的问题开始。</p>
      <dl class="collection-metrics"><div><dt>篇实验记录</dt><dd>{{ experiments.length }}</dd></div><div><dt>项已验证</dt><dd>{{ verifiedCount }}</dd></div></dl>
    </aside>
  </header>

  <section class="collection-content">
    <div class="collection-section-heading">
      <div><p class="collection-eyebrow">01 / LAB NOTEBOOK</p>

## 全部实验

</div><p>按记录日期排列，从最近一次尝试开始。</p>
    </div>
    <ExperimentGrid />
  </section>

  <section class="collection-guide">
    <div><p class="collection-eyebrow">02 / HOW I EXPERIMENT</p>

## 一次实验，一个明确目标

</div>
    <div class="collection-guide-items">
      <div><span class="collection-step">01</span><h3>先定义问题</h3><p>写清楚目标与预期结果，确认相关设备、软件版本与运行环境。</p></div>
      <div><span class="collection-step">02</span><h3>保留完整过程</h3><p>记录关键步骤、命令、代码和原始结果，方便复现与对照。</p></div>
      <div><span class="collection-step">03</span><h3>让结论可追溯</h3><p>标记验证状态与适用条件。实验编号表示记录顺序，标题与标签说明主题。</p></div>
    </div>
  </section>
</main>
