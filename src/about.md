---
layout: page
title: 关于我
description: 你好，我是 Stellan W。这里记录已有的技术实践，也为 FOC、ROS、机器人与更多未来兴趣留出空间。
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
      <p class="about-role">工程师 <span aria-hidden="true">/</span> 保持好奇，持续动手</p>
      <p class="about-description">喜欢理解原理，也喜欢亲手验证。这里记录软件、硬件与更多技术方向的学习和实践，写下已经弄清楚的，也给还没遇见的新兴趣留位置。</p>
      <div class="about-actions">
        <a class="about-button about-button-primary" :href="withBase('/projects/')">看看实际做过的事 <AboutIcon name="arrow" /></a>
        <a class="about-button about-button-secondary" href="#contact">交流一下 <AboutIcon name="message" /></a>
      </div>
    </div>
    <aside class="about-focus" aria-labelledby="focus-title">
      <div class="about-focus-art" aria-hidden="true"><AboutIcon name="sparkles" /></div>
      <p class="about-focus-code">STAY CURIOUS. KEEP BUILDING.</p>
      <h2 id="focus-title">从好奇出发，把探索留下。<a class="header-anchor about-heading-anchor" href="#focus-title" aria-label="探索方式的永久链接">#</a></h2>
      <p class="about-focus-desc">Learn / Build / Share</p>
    </aside>
  </section>

  <section class="about-section" aria-labelledby="toolbox-title">
    <div class="about-section-heading">
      <h2 id="toolbox-title">实践积累与下一站<a class="header-anchor about-heading-anchor" href="#toolbox-title" aria-label="实践与兴趣的永久链接">#</a></h2>
      <p>走过的路，与想去的地方。</p>
    </div>
    <div class="about-paths">
      <section class="about-practice" aria-labelledby="practice-title">
        <p class="about-eyebrow">ALREADY EXPLORED</p>
        <h3 id="practice-title">已经走过的一些路。</h3>
        <div class="about-practice-list">
          <article class="about-practice-item">
            <span class="about-practice-icon"><AboutIcon name="chip" /></span>
            <div><h4>嵌入式与 Linux</h4><p>在 RV1106、RV1126、RK3566、RK3588 上的开发积累；从设备树、I2C、GPIO 到 Linux 驱动模型。</p><a :href="withBase('/projects/1-smart-watch/智能手表 星序AstralOrder.html')">智能手表 · 星序 AstralOrder <AboutIcon name="arrow" /></a></div>
          </article>
          <article class="about-practice-item">
            <span class="about-practice-icon"><AboutIcon name="film" /></span>
            <div><h4>图像与视频实践</h4><p>围绕 Camera Sensor、V4L2、ISP、MPP、FFmpeg、RTSP 和 H.264 / H.265，尝试采集、处理、编码与传输。</p><a :href="withBase('/knowledge/camera/')">相关知识笔记 <AboutIcon name="arrow" /></a></div>
          </article>
          <article class="about-practice-item">
            <span class="about-practice-icon"><AboutIcon name="sparkles" /></span>
            <div><h4>设备端 AI 尝试</h4><p>记录 RKNN、NPU 部署与模型量化中的尝试，把实践过程留在具体项目里。</p><a :href="withBase('/projects/3-edge-ai/项目概述.html')">边缘 AI 计算平台 <AboutIcon name="arrow" /></a></div>
          </article>
        </div>
        <div class="about-practice-tools"><h4>日常语言与工具</h4><p>C · Python · Shell · JavaScript · Git · Vim · VS Code · Make · CMake</p></div>
      </section>
      <aside class="about-curiosity" aria-labelledby="curiosity-title">
        <p class="about-eyebrow">NOT YET, BUT CURIOUS</p>
        <h3 id="curiosity-title">下一站，不止一种可能。</h3>
        <p>技术方向可以变化，好奇心会继续。这些是未来想学习的方向，等真正开始实践，再慢慢留下记录。</p>
        <div class="about-interest"><AboutIcon name="sliders" /><div><h4>FOC / 电机控制</h4><p>想理解电机怎样被控制，从原理与小实验开始。</p></div></div>
        <div class="about-interest"><AboutIcon name="layers" /><div><h4>ROS / 机器人</h4><p>想看看感知、控制与系统协作如何连接起来。</p></div></div>
        <div class="about-curiosity-note"><AboutIcon name="sprout" /><p>还有更多未曾遇见的技术与问题。<br>兴趣不需要预先填满，先保持开放。</p></div>
      </aside>
    </div>
  </section>

  <section class="about-section" aria-labelledby="garden-title">
    <div class="about-section-heading">
      <h2 id="garden-title">记录过程，连接新的问题。<a class="header-anchor about-heading-anchor" href="#garden-title" aria-label="知识花园的永久链接">#</a></h2>
    </div>
    <div class="about-garden">
      <div class="about-garden-note">
        <h3>写下来，<br>留给下一次实践。</h3>
        <p>学过的原理、动手做的实验、排查时走过的弯路，都值得留下一份记录。内容会随着理解修订，新的问题也会带来新的方向。</p>
        <span class="about-note-signature">保持好奇，持续动手。 <span aria-hidden="true">↗</span></span>
      </div>
      <nav class="about-garden-links" aria-label="探索知识花园">
        <a :href="withBase('/explore/')"><span class="about-entry-icon"><AboutIcon name="book" /></span><div><h3>探索所有记录</h3><p>沿着主题，连接知识、实验与 Debug</p></div><AboutIcon name="arrow" /></a>
        <a :href="withBase('/projects/')"><span class="about-entry-icon"><AboutIcon name="layers" /></span><div><h3>项目与作品</h3><p>想法的实现、开发资料与当前进展</p></div><AboutIcon name="arrow" /></a>
        <a :href="withBase('/explore/?type=cheatsheet')"><span class="about-entry-icon"><AboutIcon name="terminal" /></span><div><h3>手边的速查</h3><p>常用命令与配置，随用随查</p></div><AboutIcon name="arrow" /></a>
      </nav>
    </div>
  </section>

  <section id="contact" class="about-section about-contact" aria-labelledby="contact-title">
    <div class="about-contact-intro">
      <p class="about-eyebrow">LET’S CONNECT</p>
      <h2 id="contact-title">聊聊技术，交换灵感。<a class="header-anchor about-heading-anchor" href="#contact-title" aria-label="联系方式的永久链接">#</a></h2>
      <p>无论你在研究什么，或是刚冒出一个想法，<br>都欢迎聊聊问题、经验和新的可能。</p>
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
