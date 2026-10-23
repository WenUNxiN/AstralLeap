<script setup>
import { withBase } from 'vitepress'
import AboutIcon from './AboutIcon.vue'
</script>

<template>
  <main class="error-shell" aria-labelledby="error-title">
    <p class="error-eyebrow">LOST IN EXPLORATION</p>
    <div class="error-code" aria-hidden="true">404<span>✦</span></div>
    <h1 id="error-title">这一次，偏离了轨道。</h1>
    <p class="error-description">这个页面可能已更名或暂时不可用。<br>换个入口，继续探索这座知识花园。</p>
    <div class="error-actions">
      <a class="error-primary" :href="withBase('/')">返回首页 <AboutIcon name="arrow" /></a>
      <a class="error-secondary" :href="withBase('/knowledge/')">浏览知识库 <AboutIcon name="book" /></a>
    </div>
    <a class="error-projects" :href="withBase('/projects/')">也可以看看我正在做的项目 <AboutIcon name="arrow-up" /></a>
  </main>
</template>

<style scoped>
.error-shell { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; max-width: 1000px; margin: 0 auto; padding: 80px 24px; min-height: 65vh; text-align: center; }
.error-eyebrow { margin: 0; font: 11px var(--vp-font-family-mono); letter-spacing: .14em; color: var(--vp-c-brand-1); }
.error-code { position: relative; margin: 32px 0 26px; font: 700 clamp(90px, 16vw, 150px)/1 var(--vp-font-family-mono); letter-spacing: -.08em; color: var(--vp-c-brand-1); background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-purple)); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.error-code > span { position: absolute; top: 0; right: -32px; font-size: 28px; -webkit-text-fill-color: var(--astral-accent); }
h1 { margin: 0; font-size: 30px; font-weight: 650; line-height: 1.6; letter-spacing: -.03em; }
.error-description { margin: 16px 0 0; font-size: 14px; line-height: 1.95; color: var(--vp-c-text-2); }
.error-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 30px; }
.error-actions a { display: inline-flex; align-items: center; justify-content: center; gap: 14px; min-height: 44px; padding: 10px 18px; border: 1px solid var(--vp-c-divider); border-radius: 9px; font-size: 13px; font-weight: 600; text-decoration: none; }
.error-actions .about-icon { width: 16px; height: 16px; }
.error-primary { background: var(--vp-c-brand-3); color: #fff; border-color: transparent !important; }
.error-primary:hover { background: var(--vp-c-brand-2); }
.error-secondary { color: var(--vp-c-text-1); background: var(--vp-c-bg); }
.error-secondary:hover { background: var(--vp-c-brand-soft); border-color: var(--vp-c-brand-1); }
.error-projects { display: inline-flex; align-items: center; gap: 8px; margin-top: 24px; min-height: 36px; font-size: 12px; color: var(--vp-c-text-2); text-decoration: none; }
.error-projects .about-icon { width: 14px; height: 14px; }
.error-projects:hover { color: var(--vp-c-brand-1); }
@media(max-width: 640px) { .error-shell { padding: 56px 20px; } h1 { font-size: 24px; } }
</style>
