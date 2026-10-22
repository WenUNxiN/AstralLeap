---
layout: page
title: 关于我
description: 你好，我是 Stellan W，一名专注嵌入式视频开发的工程师。这里记录我的知识、实验、项目与思考。
pageClass: about-page
---

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'
import AboutIcon from '../.vitepress/components/AboutIcon.vue'
import '../.vitepress/theme/about.css'

const email = 'stellan.w@outlook.com'
const copyState = ref('idle')
let resetTimer

async function copyEmail() {
  clearTimeout(resetTimer)
  try {
    await navigator.clipboard.writeText(email)
    copyState.value = 'copied'
  } catch {
    copyState.value = 'error'
  }
  resetTimer = setTimeout(() => { copyState.value = 'idle' }, 4000)
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<main class="about-shell" id="about-main">
  <div class="about-topline">
    <span class="about-eyebrow">ABOUT ME <span>/ 关于我</span></span>
    <span class="about-motto">以星为向，以技为跃 <span aria-hidden="true">✦</span></span>
  </div>

  <section class="about-hero" aria-labelledby="about-title">
    <div class="about-intro">
      <p class="about-greeting">很高兴，在这里遇见你。</p>
      <h1 id="about-title"><span class="about-sr-only">关于我 · </span>你好，我是<br><span>Stellan W<span class="about-period">.</span></span><a class="header-anchor about-heading-anchor" href="#about-title" aria-label="自我介绍的永久链接">#</a></h1>
      <p class="about-role">嵌入式工程师 <span aria-hidden="true">/</span> 在软硬件之间探索</p>
      <p class="about-description">专注嵌入式视频开发，打通从 Camera Sensor 到 RTSP 推流的视频链路。喜欢动手实验，也习惯把过程写下来。</p>
      <div class="about-labels" aria-label="关注方向">
        <span>Embedded Linux</span> <span>Camera &amp; Video</span> <span>Edge AI</span>
      </div>
      <div class="about-actions">
        <a class="about-button about-button-primary" :href="withBase('/projects/')">查看我的项目 <AboutIcon name="arrow" /></a>
        <a class="about-button about-button-secondary" href="#contact">交流一下 <AboutIcon name="message" /></a>
      </div>
    </div>
    <aside class="about-focus" aria-labelledby="focus-title">
      <div class="about-focus-top">
        <span class="about-focus-label"><span class="about-status-dot" aria-hidden="true"></span>目前专注</span>
        <span class="about-focus-code" aria-hidden="true">VIDEO PIPELINE</span>
      </div>
      <h2 id="focus-title">让每一帧，顺畅抵达。<a class="header-anchor about-heading-anchor" href="#focus-title" aria-label="视频链路的永久链接">#</a></h2>
      <p class="about-focus-desc">从底层采集，到画面传输</p>
      <ol class="about-pipeline" aria-label="嵌入式视频开发链路">
        <li><span class="about-stage-icon"><AboutIcon name="camera" /></span><div><strong>Camera Sensor</strong><span>传感器调试 · 图像采集</span></div><span class="about-stage-number" aria-hidden="true">01</span></li>
        <li><span class="about-stage-icon"><AboutIcon name="sliders" /></span><div><strong>V4L2 / ISP</strong><span>驱动适配 · 图像处理</span></div><span class="about-stage-number" aria-hidden="true">02</span></li>
        <li><span class="about-stage-icon"><AboutIcon name="film" /></span><div><strong>MPP / H.264 / H.265</strong><span>硬件编码 · 视频压缩</span></div><span class="about-stage-number" aria-hidden="true">03</span></li>
        <li><span class="about-stage-icon"><AboutIcon name="radio" /></span><div><strong>RTSP</strong><span>网络推流 · 实时传输</span></div><span class="about-stage-number" aria-hidden="true">04</span></li>
      </ol>
      <div class="about-focus-footer"><span aria-hidden="true">↳</span> 连接硬件与画面，也连接探索与实践。</div>
    </aside>
  </section>

  <section class="about-section" aria-labelledby="toolbox-title">
    <div class="about-section-heading">
      <div><p class="about-eyebrow">01 / TOOLBOX</p><h2 id="toolbox-title">技术栈与关注方向<a class="header-anchor about-heading-anchor" href="#toolbox-title" aria-label="技术栈的永久链接">#</a></h2></div>
      <p>从底层驱动，到完整的视频链路。</p>
    </div>
    <div class="about-toolbox">
      <article class="about-skill"><span class="about-skill-icon"><AboutIcon name="film" /></span><h3>视频开发</h3><p>采集、处理、编码与传输</p><div class="about-tags"><span>V4L2</span> <span>MPP</span> <span>FFmpeg</span> <span>RTSP</span> <span>H.264 / H.265</span></div></article>
      <article class="about-skill"><span class="about-skill-icon"><AboutIcon name="chip" /></span><h3>嵌入式平台</h3><p>围绕 Rockchip 平台持续实践</p><div class="about-tags"><span>RV1106</span> <span>RV1126</span> <span>RK3566</span> <span>RK3588</span></div></article>
      <article class="about-skill"><span class="about-skill-icon"><AboutIcon name="sliders" /></span><h3>Linux 驱动</h3><p>理解硬件，也理解内核</p><div class="about-tags"><span>I2C</span> <span>GPIO</span> <span>设备树</span> <span>Linux 驱动模型</span></div></article>
      <article class="about-skill"><span class="about-skill-icon"><AboutIcon name="code" /></span><h3>编程语言</h3><p>用合适的语言解决具体问题</p><div class="about-tags"><span>C</span> <span>Python</span> <span>Shell</span> <span>JavaScript</span></div></article>
      <article class="about-skill"><span class="about-skill-icon"><AboutIcon name="sparkles" /></span><h3>端侧 AI</h3><p>让模型在嵌入式设备上运行</p><div class="about-tags"><span>RKNN</span> <span>NPU 部署</span> <span>模型量化</span></div></article>
      <article class="about-skill"><span class="about-skill-icon"><AboutIcon name="terminal" /></span><h3>开发工具</h3><p>让日常开发更顺手</p><div class="about-tags"><span>Git</span> <span>Vim</span> <span>VS Code</span> <span>Make</span> <span>CMake</span></div></article>
    </div>
  </section>

  <section class="about-section" aria-labelledby="garden-title">
    <div class="about-section-heading">
      <div><p class="about-eyebrow">02 / DIGITAL GARDEN</p><h2 id="garden-title">一座持续生长的知识花园<a class="header-anchor about-heading-anchor" href="#garden-title" aria-label="知识花园的永久链接">#</a></h2></div>
      <p>记录过程，也为下一次探索留下路标。</p>
    </div>
    <div class="about-garden">
      <div class="about-garden-note">
        <AboutIcon name="sprout" />
        <h3>写下来，<br>让知识真正属于自己。</h3>
        <p>这里沉淀系统化的知识、动手做过的实验，以及排查问题时走过的弯路。内容会随着学习不断修订、生长。</p>
        <p>对抗遗忘，连接零散的知识；把问题讲清楚，也检验自己是否真正理解。如果这些记录恰好帮到了你，就更好了。</p>
        <span class="about-note-signature">保持好奇，持续动手。 <span aria-hidden="true">↗</span></span>
      </div>
      <nav class="about-garden-links" aria-label="探索知识花园">
        <a :href="withBase('/knowledge/')"><span class="about-entry-icon"><AboutIcon name="book" /></span><div><h3>知识库</h3><p>把零散的知识，整理成体系</p></div><AboutIcon name="arrow" /></a>
        <a :href="withBase('/experiments/')"><span class="about-entry-icon"><AboutIcon name="flask" /></span><div><h3>实验记录</h3><p>动手验证想法，记录每一次尝试</p></div><AboutIcon name="arrow" /></a>
        <a :href="withBase('/debug/')"><span class="about-entry-icon"><AboutIcon name="bug" /></span><div><h3>Debug 记录</h3><p>从问题现象，追到背后的原因</p></div><AboutIcon name="arrow" /></a>
        <a :href="withBase('/cheatsheet/')"><span class="about-entry-icon"><AboutIcon name="terminal" /></span><div><h3>命令速查</h3><p>常用命令，随用随查</p></div><AboutIcon name="arrow" /></a>
        <a :href="withBase('/projects/')"><span class="about-entry-icon"><AboutIcon name="layers" /></span><div><h3>项目展示</h3><p>把想法做出来，整理资料与进展</p></div><AboutIcon name="arrow" /></a>
      </nav>
    </div>
  </section>

  <section id="contact" class="about-section about-contact" aria-labelledby="contact-title">
    <div class="about-contact-intro">
      <p class="about-eyebrow">03 / LET’S CONNECT</p>
      <h2 id="contact-title">聊聊技术，交换灵感。<a class="header-anchor about-heading-anchor" href="#contact-title" aria-label="联系方式的永久链接">#</a></h2>
      <p>如果你也在做嵌入式、视频开发，<br>或者只是有个有趣的想法，欢迎交流。</p>
      <a class="about-email" :href="'mailto:' + email">stellan.w@outlook.com <AboutIcon name="arrow-up" /></a>
      <div class="about-copy-row">
        <button class="about-copy" type="button" @click="copyEmail"><AboutIcon :name="copyState === 'copied' ? 'check' : 'copy'" />{{ copyState === 'copied' ? '已复制邮箱' : '复制邮箱地址' }}</button>
        <span class="about-copy-feedback" role="status">{{ copyState === 'error' ? '复制未成功，请手动选择邮箱地址。' : copyState === 'copied' ? '期待你的来信。' : '' }}</span>
      </div>
    </div>
    <div class="about-socials">
      <a href="https://github.com/WenUNxiN" target="_blank" rel="noopener noreferrer"><span class="about-social-icon"><img :src="withBase('/icons/github.png')" alt="" width="22" height="22"></span><div><h3>GitHub</h3><p>代码与开源项目</p></div><AboutIcon name="arrow-up" /><span class="about-sr-only">（在新标签页打开）</span></a>
      <a href="https://space.bilibili.com/242636527" target="_blank" rel="noopener noreferrer"><span class="about-social-icon"><img :src="withBase('/icons/bilibili.png')" alt="" width="22" height="22"></span><div><h3>哔哩哔哩</h3><p>视频分享与交流</p></div><AboutIcon name="arrow-up" /><span class="about-sr-only">（在新标签页打开）</span></a>
      <a href="https://oshwhub.com/eda_vmqaugwah" target="_blank" rel="noopener noreferrer"><span class="about-social-icon"><img :src="withBase('/icons/lcsc.png')" alt="" width="22" height="22"></span><div><h3>立创开源硬件</h3><p>硬件项目与设计</p></div><AboutIcon name="arrow-up" /><span class="about-sr-only">（在新标签页打开）</span></a>
      <div class="about-wechat"><span class="about-social-icon"><AboutIcon name="message" /></span><div><h3>微信公众号</h3><p>搜索「星跃AstralLeap」· 后台留言</p></div></div>
    </div>
  </section>

  <div class="about-colophon">
    <div><span class="about-colophon-star" aria-hidden="true">✦</span><span>用 VitePress 2 构建，托管于 GitHub Pages。</span></div>
    <a href="https://github.com/WenUNxiN/AstralLeap" target="_blank" rel="noopener noreferrer">在 GitHub 上看看 <AboutIcon name="arrow-up" /><span class="about-sr-only">（在新标签页打开）</span></a>
  </div>
</main>
