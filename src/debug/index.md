---
layout: page
sidebar: false
title: Debug 记录
description: 技术探索中的问题记录，从现象与日志出发，追踪排查过程、根因、修复与验证。
pageClass: collection-page
---

<script setup>
import { withBase } from 'vitepress'
import DebugGrid from '../../.vitepress/components/DebugGrid.vue'
import AboutIcon from '../../.vitepress/components/AboutIcon.vue'
import { data as debugList } from '../../.vitepress/data/debug.data.ts'
import '../../.vitepress/theme/collections.css'

const solvedCount = debugList.filter(item => item.status === 'solved').length
</script>

<main class="collection-shell">
  <div class="collection-topline"><span class="collection-eyebrow">DEBUG JOURNAL</span><span class="collection-topnote">沿着现象，找到原因。</span></div>
  <header class="collection-hero">
    <div class="collection-intro">

# Debug 记录

<p class="collection-lead">把走过的弯路，<br><span>留成下一次的路标。</span></p>
<p class="collection-description">从一条错误日志、一次异常行为开始，记录假设、验证与修复。沉淀学习和项目实践中遇到的真实问题，让相似的 Bug 更容易定位，也让排查经验能用在新的探索中。</p>
<div class="collection-topics"><span>现象与日志</span><span>根因分析</span><span>修复验证</span></div>
    </div>
    <aside class="collection-overview">
      <div class="collection-overview-label"><AboutIcon name="bug" /><span>问题背后，总有迹可循</span></div>
      <p class="collection-overview-note">保留错误，也保留思考过程。<br>已解决的经验与仍在追踪的问题，都在这里。</p>
      <dl class="collection-metrics"><div><dt>篇问题记录</dt><dd>{{ debugList.length }}</dd></div><div><dt>项已解决</dt><dd>{{ solvedCount }}</dd></div></dl>
    </aside>
  </header>

  <section class="collection-content">
    <div class="collection-section-heading">
      <div><p class="collection-eyebrow">01 / TRACE THE PROBLEM</p>

## 问题与排查记录

</div><p>从错误关键词、平台或处理状态查起。</p>
    </div>
    <nav class="collection-topic-links" aria-label="按 Debug 方向浏览">
      <a :href="withBase('/debug/camera.html')"><AboutIcon name="camera" /><span>Camera <small>Sensor · MIPI · ISP</small></span><AboutIcon name="arrow" /></a>
      <a :href="withBase('/debug/v4l2.html')"><AboutIcon name="sliders" /><span>V4L2 <small>缓冲 · 格式 · 控制</small></span><AboutIcon name="arrow" /></a>
      <a :href="withBase('/debug/mpp.html')"><AboutIcon name="film" /><span>MPP <small>编解码 · 格式转换</small></span><AboutIcon name="arrow" /></a>
    </nav>
    <DebugGrid />
  </section>

  <section class="collection-guide">
    <div><p class="collection-eyebrow">02 / DEBUGGING NOTES</p>

## 先留下证据，再验证判断

</div>
    <div class="collection-guide-items">
      <div><span class="collection-step">01</span><h3>确认现场</h3><p>记录问题现象、复现条件、平台版本与原始日志。错误信息保留文本，便于检索。</p></div>
      <div><span class="collection-step">02</span><h3>逐个验证</h3><p>列出可能的原因，保留排查过程与关键证据，缩小问题范围。</p></div>
      <div><span class="collection-step">03</span><h3>修复后再确认</h3><p>写清根因、解决方法与验证结果，补充经验总结和相关知识、实验链接。</p></div>
    </div>
  </section>
</main>
